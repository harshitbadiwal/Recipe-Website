import React, { lazy } from 'react';
import MinimalLayout from '../layout/MinimalLayout';
import Loadable from '../ui-component/Loadable';
import GuestGuard from './GuestGuard';

// Auth views lazy loading
const AuthLogin = Loadable(lazy(() => import('../views/authentication/Login')));
const AuthOtpVerify = Loadable(lazy(() => import('../views/authentication/OtpVerify')));
const AuthForgotPassword = Loadable(lazy(() => import('../views/authentication/ForgotPassword')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: (
    <GuestGuard>
      <MinimalLayout />
    </GuestGuard>
  ),
  children: [
    {
      path: '/login',
      element: <AuthLogin />,
    },
    {
      path: '/login-otp-verify',
      element: <AuthOtpVerify />,
    },
    {
      path: '/forgot-password',
      element: <AuthForgotPassword />,
    },
  ],
};

export default LoginRoutes;
