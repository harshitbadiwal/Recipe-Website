import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import { Collapse, Fade, Grow, Slide, Zoom, Box } from '@mui/material';

const Transitions = forwardRef(({ children, position = 'top-left', type = 'grow', direction = 'up', ...others }, ref) => {
  let positionSX = {
    transformOrigin: '0 0 0',
  };

  switch (position) {
    case 'top-right':
      positionSX = { transformOrigin: 'top right' };
      break;
    case 'top':
      positionSX = { transformOrigin: 'top' };
      break;
    case 'bottom-left':
      positionSX = { transformOrigin: 'bottom left' };
      break;
    case 'bottom-right':
      positionSX = { transformOrigin: 'bottom right' };
      break;
    case 'bottom':
      positionSX = { transformOrigin: 'bottom' };
      break;
    case 'top-left':
    default:
      positionSX = { transformOrigin: '0 0 0' };
      break;
  }

  return (
    <Box ref={ref}>
      {type === 'grow' && (
        <Grow {...others}>
          <Box sx={positionSX}>{children}</Box>
        </Grow>
      )}
      {type === 'collapse' && (
        <Collapse {...others} sx={positionSX}>
          {children}
        </Collapse>
      )}
      {type === 'fade' && (
        <Fade
          {...others}
          timeout={{
            appear: 500,
            enter: 300,
            exit: 150,
          }}
        >
          <Box sx={positionSX}>{children}</Box>
        </Fade>
      )}
      {type === 'slide' && (
        <Slide
          {...others}
          direction={direction}
          timeout={{
            appear: 0,
            enter: 300,
            exit: 200,
          }}
        >
          <Box sx={positionSX}>{children}</Box>
        </Slide>
      )}
      {type === 'zoom' && (
        <Zoom {...others}>
          <Box sx={positionSX}>{children}</Box>
        </Zoom>
      )}
    </Box>
  );
});

Transitions.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(['collapse', 'fade', 'grow', 'slide', 'zoom']),
  position: PropTypes.oneOf(['top-left', 'top-right', 'top', 'bottom-left', 'bottom-right', 'bottom']),
  direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),
};

export default Transitions;
