import PropTypes from 'prop-types';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase } from '@mui/material';
import { IconMenu2 } from '@tabler/icons-react';
import ProfileSection from './ProfileSection';
import Logo from '../../../ui-component/Logo';
import { Link } from 'react-router-dom';

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 240,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto',
          },
          alignItems: 'center',
        }}
      >
        <Box
          component={Link}
          to="/recipes"
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          <Logo size={38} />
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

      {/* spacer */}
      <Box sx={{ flexGrow: 1 }} />

      {/* profile section */}
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func,
};

export default Header;
