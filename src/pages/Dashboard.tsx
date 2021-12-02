import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import NoOrganization from '../components/NoOrganization';
import organizationService from '../services/organization.service';
import { getPreference } from '../services/preference.service';

function Dashboard() {
  const history = useHistory();

  useEffect(() => {
    organizationService.getCurrentUserOrganizations().then((organizations) => {
      if (organizations.length !== 0)
        getPreference('default_organization')
          .then((defaultOrgId) =>
            organizations.find(({ id }) => id === defaultOrgId)
              ? history.push(`/organizations/${defaultOrgId}`)
              : history.push('/organizations')
          )
          .catch(() => history.push('/organizations'));
    });
  }, []);

  return <NoOrganization />;
}

export default Dashboard;
