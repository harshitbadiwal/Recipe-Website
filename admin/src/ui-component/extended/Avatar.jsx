import PropTypes from 'prop-types';
import React from 'react';
import MuiAvatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';

const Avatar = ({ color, outline, size, sx, ...others }) => {
  const theme = useTheme();

  const colorSX = color && !outline && {
    color: theme.palette[color] ? theme.palette[color].contrastText : theme.palette.common.white,
    bgcolor: theme.palette[color] ? theme.palette[color].main : color,
  };

  const outlineSX = outline && {
    color: color ? (theme.palette[color] ? theme.palette[color].main : color) : theme.palette.primary.main,
    bgcolor: theme.palette.background.paper,
    border: '2px solid',
    borderColor: color ? (theme.palette[color] ? theme.palette[color].main : color) : theme.palette.primary.main,
  };

  let sizeSX = {};
  switch (size) {
    case 'badge':
      sizeSX = { width: 28, height: 28 };
      break;
    case 'xs':
      sizeSX = { width: 34, height: 34, fontSize: '0.75rem' };
      break;
    case 'sm':
      sizeSX = { width: 40, height: 40, fontSize: '0.875rem' };
      break;
    case 'lg':
      sizeSX = { width: 72, height: 72, fontSize: '1.5rem' };
      break;
    case 'xl':
      sizeSX = { width: 88, height: 88, fontSize: '1.75rem' };
      break;
    case 'md':
    default:
      sizeSX = { width: 48, height: 48, fontSize: '1rem' };
      break;
  }

  return <MuiAvatar sx={{ ...colorSX, ...outlineSX, ...sizeSX, ...sx }} {...others} />;
};

Avatar.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  outline: PropTypes.bool,
  size: PropTypes.string,
  sx: PropTypes.object,
};

export default Avatar;
