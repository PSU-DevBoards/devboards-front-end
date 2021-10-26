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
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Section from '../components/Section';
import { useOrganization } from '../contexts/organization-context';
import OrganizationService, {
  OrganizationUser,
} from '../services/organization.service';

const OrganizationForm = () => {
  const toast = useToast();
  const { organization, setOrganization } = useOrganization();

  const onSubmitForm = ({ name }: { name: string }) => {
    if (organization)
      OrganizationService.updateOrganization(organization?.id, { name })
        .then((org) => {
          setOrganization(org);

          toast({
            position: 'bottom-right',
            status: 'success',
            title: 'Organization Updated',
          });
        })
        .catch((err) =>
          toast({
            position: 'bottom-right',
            status: 'error',
            title: 'Organization Update Failed',
            description: err,
          })
        );
  };

  const { handleSubmit, handleChange, errors, touched, values, setValues } =
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
        </SimpleGrid>
        <Divider />
        <Flex justifyContent="flex-end" w="full">
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

  useEffect(() => {
    const id = parseInt(orgId, 10);

    OrganizationService.getOrganizationUsers(id).then(setOrgUsers);
  }, []);

  return (
    <Table variant="simple" title="Users">
      <Thead>
        <Tr>
          <Th>Organization ID</Th>
          <Th>Role ID</Th>
          <Th isNumeric>User ID</Th>
        </Tr>
      </Thead>
      <Tbody>
        {orgUsers.map((orgUser) => (
          <Tr key={orgUser.user_id}>
            <Td>{orgUser.organization_id}</Td>
            <Td>{orgUser.role_id}</Td>
            <Td isNumeric>{orgUser.user_id}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

function EditOrganization() {
  return (
    <VStack alignItems="initial">
      <Heading textAlign="left">Edit Organization</Heading>
      <Section title="General Settings">
        <OrganizationForm />
      </Section>
      <Section title="Organization Users">
        <UsersTable />
      </Section>
    </VStack>
  );
}

export default EditOrganization;
