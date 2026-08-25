import React, { lazy } from 'react';
import MainLayout from '../layout/MainLayout';
import Loadable from '../ui-component/Loadable';
import AuthGuard from './AuthGuard';

// Views lazy loading
const DashboardDefault = Loadable(lazy(() => import('../views/dashboard')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '/',
      element: <DashboardDefault />,
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />,
    },
  ],
};

export default MainRoutes;
