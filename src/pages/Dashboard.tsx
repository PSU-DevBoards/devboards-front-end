import React, { useEffect, useState } from 'react';
import NoOrganization from '../components/NoOrganization';
import userService, { Organization } from '../services/user.service';

function Dashboard() {
  const [organizations, setOrganizations] = useState<Array<Organization>>(
    []
  );

  useEffect(() => {
    userService.getCurrentUserOrganizations().then(setOrganizations);
  }, []);

  return (
    <>
      {organizations?.length > 0 ? (
        <p>Welcome to the dashboard!</p>
      ) : (
        <NoOrganization />
      )}
    </>
  );
}

export default Dashboard;
