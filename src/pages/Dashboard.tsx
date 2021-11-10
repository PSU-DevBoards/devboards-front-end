import React, { useEffect, useState } from 'react';
import NoOrganization from '../components/NoOrganization';
import organizationService, {
  Organization,
} from '../services/organization.service';

function Dashboard() {
  const [organizations, setOrganizations] = useState<Array<Organization>>([]);

  useEffect(() => {
    organizationService.getCurrentUserOrganizations().then(setOrganizations);
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
