import PropTypes from 'prop-types';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Typography } from '@mui/material';
import { IconMenu2, IconChefHat } from '@tabler/icons-react';
import SearchSection from './SearchSection';
import NotificationSection from './NotificationSection';
import ProfileSection from './ProfileSection';

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto',
          },
          alignItems: 'center',
        }}
      >
        <Box component="span" sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: theme.palette.primary.main,
              color: '#ffffff',
              mr: 1.5,
              width: 36,
              height: 36,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
            }}
          >
            <IconChefHat stroke={2} size="22px" />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.primary.main, letterSpacing: '-0.5px' }}>
              FOODIE<span style={{ color: theme.palette.secondary.main }}>ADMIN</span>
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500, fontSize: '0.65rem' }}>
              RECIPE & PORTAL HUB
            </Typography>
          </Box>
        </Box>
        <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden', ml: { xs: 2, md: 3 } }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.primary.light,
              color: theme.palette.primary.dark,
              width: 36,
              height: 36,
              '&:hover': {
                background: theme.palette.primary.dark,
                color: theme.palette.primary.light,
              },
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="20px" />
          </Avatar>
        </ButtonBase>
      </Box>

      {/* header search */}
      <SearchSection />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* notification & profile */}
      <NotificationSection />
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func,
};

export default Header;
