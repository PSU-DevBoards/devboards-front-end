import { Container } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import NoOrganization from '../components/NoOrganization';
import userService, { UserOrganization } from '../services/user.service';

function Dashboard() {
  const [organizations, setOrganizations] = useState<Array<UserOrganization>>();

  useEffect(() => {
    userService.getCurrentUserOrganizations().then(setOrganizations);
  }, []);

  if (organizations?.length! <= 0) {
    return (
      <Container maxW="" px="1%" pt="5px" data-testid="no_org_container">
        <Navbar />
        <NoOrganization />
      </Container>
    );
  }

  return (
    <Container maxW="" px="1%" pt="5px">
      <Navbar />
      <p>Welcome to the dashboard!</p>
    </Container>
  );
}

export default Dashboard;
