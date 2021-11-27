import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
  ButtonGroup,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  UseToastOptions,
} from '@chakra-ui/react';
import { BiPlus } from "react-icons/bi";
import { FormikErrors, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import Section from '../components/Section';
import { useOrganization } from '../contexts/organization-context';
import { useUser } from '../contexts/user-context'
import OrganizationService, {
  OrganizationUser,
} from '../services/organization.service';

const OrganizationForm = () => {
  const toast = useToast();
  const { organization, setOrganization } = useOrganization();
  const {currentUser, setCurrentUser} = useUser();

  const onSubmitForm = ({ name }: { name: string }) => {
    if (organization)
      OrganizationService.updateOrganization(organization?.id, { name })
        .then(() => {
          setOrganization({...organization, name});
          toast({
            position: 'bottom-right',
            status: 'success',
            title: 'Organization Updated',
          });
        })
        .catch((err) => {            
            const toastData: UseToastOptions = {
              position: 'bottom-right',
              status: 'error',
              title: 'Organization Update Failed',
            };

            if( err.errors ){
              const [errorMessages] = err.errors;
              toastData.description = errorMessages;
            }

            toast(toastData);
          }
        );
  };

  const { handleSubmit, handleChange, handleBlur, errors, values, setValues } =
    useFormik({
      initialValues: { name: '' },
      onSubmit: onSubmitForm,
    });

  useEffect(() => {
    if (organization) setValues({ name: organization?.name });
  }, [organization]);

  return (
    <form onSubmit={handleSubmit}>
      <VStack>
        <SimpleGrid columns={[1, 2]} w="full">
          <FormControl isInvalid={!!errors.name} isRequired>
            <FormLabel htmlFor="name">Organization Name</FormLabel>
            <Input
              onChange={handleChange}
              onBlur={handleBlur}
              id="name"
              placeholder="name"
              value={values.name}
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>
        <Divider />
        <Flex justifyContent="flex-end" w="full" paddingTop="15px">
          <Button w={['full', 'sm']} type="submit" colorScheme="purple">
            Save
          </Button>
        </Flex>
      </VStack>
    </form>
  );
};

const UsersTable = () => {
  const [orgUsers, setOrgUsers] = useState<Array<OrganizationUser>>([]);
  const { orgId } = useParams<{ orgId: string }>();
  const history = useHistory();

  useEffect(() => {
    const id = parseInt(orgId, 10);

    OrganizationService.getOrganizationUsers(id)
    .then(setOrgUsers)
    .catch(() => history.push('/dashboard'));
  }, []);

  const onClickRemoveUser = (removedUser:OrganizationUser) =>
  {
    OrganizationService.deleteOrganizationUser(removedUser.organizationId,removedUser.userId);
  }

  return (
    <Table variant="simple" title="Users">
      <Thead>
        <Tr>
          <Th>Organization ID</Th>
          <Th>Role ID</Th>
          <Th isNumeric>User ID</Th>
          <Th> Options </Th>
        </Tr>
      </Thead>
      <Tbody>
        {orgUsers.map((orgUser) => (
          <Tr key={orgUser.userId}>
            <Td>{orgUser.organizationId}</Td>
            <Td>{orgUser.roleId}</Td>
            <Td isNumeric>{orgUser.userId}</Td>
            <Td>
              <Flex justifyContent = "flex-end">
                <Button colorScheme = "green">
                  Confirm Change
                </Button>
                {
                  orgUser.userId !== currentUser.userId && <Button colorScheme = "red" ml = {3} onClick = {() => onClickRemoveUser(orgUser)}>
                    Remove User
                  </Button>
                }

              </Flex>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

function EditOrganization() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { organization } = useOrganization();
  const toast = useToast();

  const onInviteUser = ({ email }: { email: string }) => {
    if( organization ){
      OrganizationService.inviteUser(organization?.id, email, 2).then((data) => {
        toast({
            position: 'bottom-right',
            status: 'success',
            title: 'Invitation Sent',
            description: `User ${email} (${data.userId}) invited successfully!`,
        });
        onClose();
      }).catch(() => {
        toast({
          position: 'bottom-right',
          status: 'error',
          title: 'Invitation Failed',
          description: `User ${email} could not be invited.`,
      });
      });
    }
  };

  const { handleSubmit, handleChange, handleBlur, errors } =
    useFormik({
      initialValues: { email: '' },
      onSubmit: onInviteUser,
      validate: (values: { email: string }) => {
        const error: FormikErrors<{ email: string }> = {};
        if (!values.email) {
          error.email = 'Required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
          error.email = 'Invalid email address';
        }
        return error;
      },
    });
  
  return (
    <VStack alignItems="initial">
      <Heading textAlign="left">Edit Organization</Heading>
      <Section title="General Settings">
        <OrganizationForm />
      </Section>
      <Section title="Organization Users">
        <UsersTable />
        <Flex justifyContent="flex-end" w="full" paddingTop="15px">
          <ButtonGroup w={['full', 'sm']} justifyContent="flex-end" isAttached onClick={onOpen} colorScheme="purple" variant="outline">
              <Button mr="-px">Invite</Button>
              <Modal size="xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <form onSubmit={handleSubmit}>
                  <ModalContent>
                    <ModalHeader>Invite User to {organization?.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                      <FormControl
                        isInvalid={!!errors.email}
                        isRequired
                      >
                        <FormLabel htmlFor="email">Email Address:</FormLabel>
                        <Input
                          onChange={handleChange}
                          onBlur={handleBlur}
                          id="email"
                          placeholder="Email"
                        />
                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                      </FormControl>
                    </ModalBody>
                    <ModalFooter>
                      <Button type="submit" colorScheme="purple" variant="solid" mr={3}>Send Invitation</Button>
                      <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                  </ModalContent>
                </form>
              </Modal>
              <IconButton aria-label="Invite User" icon={<BiPlus />} />
            </ButtonGroup>
          </Flex>
      </Section>
    </VStack>
  );
}

export default EditOrganization;
