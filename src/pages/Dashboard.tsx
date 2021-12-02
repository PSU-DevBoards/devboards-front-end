import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import NoOrganization from '../components/NoOrganization';
import organizationService from '../services/organization.service';
import { getPreference } from '../services/preference.service';

function Dashboard() {
  const history = useHistory();
  const [organizationCount, setOrganizationCount] = useState(-1);

  useEffect(() => {
    organizationService.getCurrentUserOrganizations().then((organizations) => {
      setOrganizationCount(organizations.length);

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

  if( organizationCount === 0 )
    return <NoOrganization/>;

  return <></>;
}

export default Dashboard;
