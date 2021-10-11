import React from 'react';
import Dashboard from '../pages/Dashboard';
import Landing from '../pages/Landing';

export default [
  { name: 'Landing', path: '/', authenticated: false, component: <Landing /> },
  {
    name: 'Dashboard',
    path: '/dashboard',
    authenticated: true,
    component: <Dashboard />,
  },
];
