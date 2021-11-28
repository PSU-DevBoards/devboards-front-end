import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  UseToastOptions,
  VStack,
} from '@chakra-ui/react';
import { FormikErrors, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import Section from '../components/Section';
import { useOrganization } from '../contexts/organization-context';
import OrganizationService, {
  Organization,
  OrganizationUser,
} from '../services/organization.service';
import RoleService, { Role } from '../services/role.service';

const OrganizationForm = () => {
  const toast = useToast();
  const { organization, setOrganization } = useOrganization();

  const onSubmitForm = ({ name }: { name: string }) => {
    if (organization)
      OrganizationService.updateOrganization(organization?.id, { name })
        .then(() => {
          setOrganization({ ...organization, name });
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

          if (err.errors) {
            const [errorMessages] = err.errors;
            toastData.description = errorMessages;
          }

          toast(toastData);
        });
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
  const [roles, setRoles] = useState<Array<Role>>([]);
  const [orgUsers, setOrgUsers] = useState<Array<OrganizationUser>>([]);
  const { orgId } = useParams<{ orgId: string }>();
  const history = useHistory();

  useEffect(() => {
    const id = parseInt(orgId, 10);

    OrganizationService.getOrganizationUsers(id)
      .then(setOrgUsers)
      .catch(() => history.push('/dashboard'));

    RoleService.listRoles().then(setRoles);
  }, []);

  return (
    <Table variant="simple" title="Users">
      <Thead>
        <Tr>
          <Th>Role</Th>
          <Th isNumeric>User ID</Th>
        </Tr>
      </Thead>
      <Tbody>
        {orgUsers.map((orgUser) => (
          <Tr key={orgUser.userId}>
            <Td>
              {
                roles.find((role) => role.id === parseInt(orgUser.roleId, 10))
                  ?.name
              }
            </Td>
            <Td isNumeric>{orgUser.userId}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

const InviteUserModal = ({
  isOpen,
  onClose,
  onInviteUser,
  organization,
}: {
  isOpen: boolean;
  onClose: () => void;
  onInviteUser: ({ email, roleId }: { email: string; roleId: number }) => void;
  organization: Organization;
}) => {
  const [roles, setRoles] = useState<Array<Role>>([]);
  const { handleSubmit, handleChange, handleBlur, errors } = useFormik({
    initialValues: { email: '', roleId: 2 },
    onSubmit: onInviteUser,
    validate: (values: { email: string }) => {
      const error: FormikErrors<{ email: string }> = {};
      if (!values.email) {
        error.email = 'Required';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        error.email = 'Invalid email address';
      }
      return error;
    },
  });

  useEffect(() => {
    RoleService.listRoles().then(setRoles);
  }, []);

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit}>
        <ModalContent>
          <ModalHeader>Invite User to {organization?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={!!errors.email} isRequired>
              <FormLabel htmlFor="email">Email Address:</FormLabel>
              <Input
                onChange={handleChange}
                onBlur={handleBlur}
                id="email"
                placeholder="Email"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.roleId} isRequired>
              <FormLabel htmlFor="roleId">Role:</FormLabel>
              <Select
                onChange={handleChange}
                onBlur={handleBlur}
                id="roleId"
                placeholder="Select Role"
              >
                {roles.map(({ id, name }) => (
                  <option value={id} key={id}>
                    {name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="purple" variant="solid" mr={3}>
              Send Invitation
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

function EditOrganization() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { organization } = useOrganization();
  const toast = useToast();

  const onInviteUser = ({
    email,
    roleId,
  }: {
    email: string;
    roleId: number;
  }) => {
    if (organization) {
      OrganizationService.inviteUser(organization.id, email, roleId)
        .then((data) => {
          toast({
            position: 'bottom-right',
            status: 'success',
            title: 'Invitation Sent',
            description: `User ${email} (${data.userId}) invited successfully!`,
          });
          onClose();
        })
        .catch(() => {
          toast({
            position: 'bottom-right',
            status: 'error',
            title: 'Invitation Failed',
            description: `User ${email} could not be invited.`,
          });
        });
    }
  };

  return (
    <VStack alignItems="initial">
      <Heading textAlign="left">Edit Organization</Heading>
      <Section title="General Settings">
        <OrganizationForm />
      </Section>
      <Section title="Organization Users">
        <UsersTable />
        <Flex justifyContent="flex-end" w="full" paddingTop="15px">
          <Button
            onClick={onOpen}
            colorScheme="purple"
            variant="outline"
            w={['full', 'sm']}
            rightIcon={<BiPlus />}
          >
            Invite
          </Button>
          <InviteUserModal
            isOpen={isOpen}
            onClose={onClose}
            onInviteUser={onInviteUser}
            organization={organization!}
          />
        </Flex>
      </Section>
    </VStack>
  );
}

export default EditOrganization;
