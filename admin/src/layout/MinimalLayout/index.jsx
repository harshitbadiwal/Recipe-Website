import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomSnackbar from '../../ui-component/CustomSnackbar';

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => (
  <>
    <Outlet />
    <CustomSnackbar />
  </>
);

export default MinimalLayout;
