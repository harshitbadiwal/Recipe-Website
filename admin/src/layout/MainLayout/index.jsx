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
  ...theme.typography.mainContent,
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.grey[50],
  width: '100%',
  minHeight: 'calc(100vh - 88px)',
  flexGrow: 1,
  padding: '24px',
  marginTop: '88px',
  marginRight: '20px',
  borderRadius: `${theme.shape.borderRadius || 10}px`,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.up('md')]: {
    marginLeft: -(config.drawerWidth - 20),
    width: `calc(100% - ${config.drawerWidth}px)`,
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: '20px',
    padding: '16px',
    marginTop: '80px',
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '10px',
    marginRight: '10px',
    padding: '12px',
  },
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    [theme.breakpoints.down('md')]: {
      marginLeft: '20px',
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '10px',
    },
  }),
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
    <Box sx={{ display: 'flex' }}>
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
