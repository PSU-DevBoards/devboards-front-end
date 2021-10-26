import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
  Input,
  useToast,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Section from '../components/Section';
import { useUser } from '../contexts/user-context';
import OrganizationService, {
  Organization,
} from '../services/organization.service';
import UserService from '../services/user.service';

const NewOrganizationModel = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string }) => void;
}) => {
  const { handleSubmit, handleChange, errors, touched, values, submitForm } =
    useFormik({
      initialValues: { name: '' },
      onSubmit,
    });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Organizaiton</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl isInvalid={!!errors.name && touched.name} isRequired>
              <FormLabel htmlFor="name">Organization Name</FormLabel>
              <Input
                onChange={handleChange}
                id="name"
                placeholder="name"
                value={values.name}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="purple"
            variant="outline"
            mr={3}
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            colorScheme="purple"
            onClick={() => {
              submitForm();
              onClose();
            }}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

function Organizations() {
  const [organizations, setOrganizations] = useState<Array<Organization>>([]);
  const user = useUser();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    UserService.getCurrentUserOrganizations().then(setOrganizations);
  }, []);

  const onClickNewOrganization = () => {
    onOpen();
  };

  const onSubmitNewOrganization = ({ name }: { name: string }) => {
    OrganizationService.createOrganization(name)
      .then((organization) => {
        setOrganizations([...organizations, organization]);

        toast({
          position: 'bottom-right',
          status: 'success',
          title: 'Organization Created',
        });
      })
      .catch(() => {
        toast({
          position: 'bottom-right',
          status: 'error',
          title: 'Organization Creation Failed',
        });
      });
  };

  const onClickDeleteOrganizaiton = (id: number) => {
    OrganizationService.deleteOrganization(id)
      .then(() => {
        setOrganizations(organizations.filter((org) => org.id !== id));

        toast({
          position: 'bottom-right',
          status: 'success',
          title: 'Organization Deleted',
        });
      })
      .catch(() => {
        toast({
          position: 'bottom-right',
          status: 'error',
          title: 'Organization Deletion Failed',
        });
      });
  };

  return (
    <>
      <VStack alignItems="initial">
        <Heading textAlign="left">Organizations</Heading>
        <Section>
          <Table variant="simple" title="Organizations">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Owner</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {organizations.map(({ id, name, owner: { username } }) => (
                <Tr key={name}>
                  <Td>{name}</Td>
                  <Td>{username}</Td>
                  <Td>
                    <HStack>
                      <Link to={`/organizations/${id}`}>
                        <Button colorScheme="purple">View</Button>
                      </Link>
                      {username === user?.username ? (
                        <>
                          <Link to={`/organizations/${id}/edit`}>
                            <Button colorScheme="purple" variant="outline">
                              <FaEdit />
                            </Button>
                          </Link>
                          <Popover>
                            <PopoverTrigger>
                              <Button
                                colorScheme="red"
                                variant="outline"
                                aria-label="Delete"
                              >
                                <FaTrash />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader>Are you sure?</PopoverHeader>
                              <PopoverBody>
                                <Button
                                  colorScheme="red"
                                  onClick={() => onClickDeleteOrganizaiton(id)}
                                  aria-label="Confirm Delete"
                                >
                                  Yes
                                </Button>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </>
                      ) : null}
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Button colorScheme="purple" onClick={onClickNewOrganization}>
            New Organization
          </Button>
        </Section>
      </VStack>
      <NewOrganizationModel
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmitNewOrganization}
      />
    </>
  );
}

export default Organizations;
