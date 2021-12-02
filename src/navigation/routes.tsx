import React from 'react';
import Dashboard from '../pages/Dashboard';
import Landing from '../pages/Landing';
import Organizations from '../pages/Organizations';
import EditOrganization from '../pages/EditOrganization';
import OrganizationBoard from '../pages/OrganizationBoard';
import NotFound from '../pages/NotFound';

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
  {
    name: 'Not Found',
    path: '/not-found',
    authenticated: false,
    component: <NotFound />,
  },
];
