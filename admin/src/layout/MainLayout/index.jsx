import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';
import Breadcrumbs from '../../ui-component/extended/Breadcrumbs';
import CustomSnackbar from '../../ui-component/CustomSnackbar';
import Header from './Header';
import Sidebar from './Sidebar';
import { openDrawer } from '../../store/slices/menu';
import config from '../../config';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.grey[50],
  minHeight: 'calc(100vh - 88px)',
  flexGrow: 1,
  minWidth: 0,
  padding: '24px',
  marginTop: '88px',
  marginRight: '20px',
  marginLeft: '20px',
  marginBottom: '20px',
  borderRadius: `${theme.shape.borderRadius || 12}px`,
  boxSizing: 'border-box',
  overflowX: 'hidden',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.up('md')]: {
    marginLeft: '20px',
    marginRight: '20px',
    width: open ? `calc(100% - ${config.drawerWidth + 40}px)` : 'calc(100% - 40px)',
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: '16px',
    marginRight: '16px',
    padding: '16px',
    marginTop: '80px',
    width: 'calc(100% - 32px)',
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '10px',
    marginRight: '10px',
    padding: '12px',
    marginTop: '80px',
    width: 'calc(100% - 20px)',
  },
}));

const MainLayout = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const drawerOpen = useSelector((state) => state.menu.drawerOpen);

  const handleLeftDrawerToggle = () => {
    dispatch(openDrawer(!drawerOpen));
  };

  useEffect(() => {
    dispatch(openDrawer(!matchDownMd));
  }, [matchDownMd]);

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: drawerOpen ? theme.transitions.create('width') : 'none',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ height: '88px' }}>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <Sidebar drawerOpen={drawerOpen} drawerToggle={handleLeftDrawerToggle} />

      {/* main content */}
      <Main theme={theme} open={drawerOpen}>
        {/* breadcrumb */}
        <Breadcrumbs separator={null} navigation={null} icon title rightAlign />
        <Outlet />
      </Main>

      {/* global alert toast */}
      <CustomSnackbar />
    </Box>
  );
};

export default MainLayout;
