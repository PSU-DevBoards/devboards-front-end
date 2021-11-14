import React from 'react';
import Dashboard from '../pages/Dashboard';
import Landing from '../pages/Landing';
import Organizations from '../pages/Organizations';
import EditOrganization from '../pages/EditOrganization';
import OrganizationBoard from '../pages/OrganizationBoard';

export default [
  { name: 'Landing', path: '/', authenticated: false, component: <Landing /> },
  {
    name: 'Dashboard',
    path: '/dashboard',
    authenticated: true,
    component: <Dashboard />,
  },
  {
    name: 'Organizations',
    path: '/organizations',
    authenticated: true,
    component: <Organizations />,
  },
  {
    name: 'Edit Organization',
    path: '/organizations/:orgId/edit',
    authenticated: true,
    component: <EditOrganization />,
  },
  {
    name: 'Organization Board',
    path: '/organizations/:orgId',
    authenticated: true,
    component: <OrganizationBoard />,
  },
];
