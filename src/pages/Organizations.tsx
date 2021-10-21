import {
  Button,
  Heading,
  HStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Section from '../components/Section';
import { useUser } from '../contexts/user-context';
import { Organization } from '../services/organization.service';
import UserService from '../services/user.service';

function Organizations() {
  const [organizations, setOrganizations] = useState<Array<Organization>>([]);
  const user = useUser();

  useEffect(() => {
    UserService.getCurrentUserOrganizations().then(setOrganizations);
  }, []);

  return (
    <VStack alignItems="initial">
      <Heading textAlign="left">Organizations</Heading>
      <Section>
        <Table variant="simple" title="Users">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Owner</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {organizations.map(({ id, name, owner: { username } }) => (
              <Tr>
                <Td>{name}</Td>
                <Td>{username}</Td>
                <Td>
                  {username === user?.username ? (
                    <HStack>
                      <Link to={`/organizations/${id}`}>
                        <Button colorScheme="purple">View</Button>
                      </Link>
                      <Link to={`/organizations/${id}/edit`}>
                        <Button colorScheme="purple" variant="outline">
                          <FaEdit />
                        </Button>
                      </Link>
                      <Button colorScheme="red" variant="outline">
                        <FaTrash />
                      </Button>
                    </HStack>
                  ) : null}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Section>
    </VStack>
  );
}

export default Organizations;
