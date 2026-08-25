import React from 'react';
import { Alert, Button, Fade, Grow, IconButton, Slide, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from '../store';
import { closeSnackbar } from '../store/slices/snackbar';

function TransitionSlideLeft(props) {
  return <Slide {...props} direction="left" />;
}

function TransitionSlideUp(props) {
  return <Slide {...props} direction="up" />;
}

function TransitionSlideRight(props) {
  return <Slide {...props} direction="right" />;
}

function TransitionSlideDown(props) {
  return <Slide {...props} direction="down" />;
}

function GrowTransition(props) {
  return <Grow {...props} />;
}

const animation = {
  SlideLeft: TransitionSlideLeft,
  SlideUp: TransitionSlideUp,
  SlideRight: TransitionSlideRight,
  SlideDown: TransitionSlideDown,
  Grow: GrowTransition,
  Fade: Fade,
};

const CustomSnackbar = () => {
  const dispatch = useDispatch();
  const snackbar = useSelector((state) => state.snackbar);
  const { actionButton, anchorOrigin, alert, close, message, open, transition, variant } = snackbar;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackbar());
  };

  return (
    <>
      {variant === 'default' && (
        <Snackbar
          anchorOrigin={anchorOrigin}
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
          message={message}
          TransitionComponent={animation[transition]}
          action={
            <>
              <Button color="secondary" size="small" onClick={handleClose}>
                UNDO
              </Button>
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose} sx={{ p: 0.5 }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
        />
      )}

      {variant === 'alert' && (
        <Snackbar
          anchorOrigin={anchorOrigin}
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
          TransitionComponent={animation[transition]}
        >
          <Alert
            variant={alert.variant}
            color={alert.color}
            severity={alert.color}
            sx={{
              fontWeight: 500,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              borderRadius: '10px',
              px: 2.5,
              py: 1,
            }}
            action={
              <>
                {actionButton && (
                  <Button color="inherit" size="small" onClick={handleClose}>
                    UNDO
                  </Button>
                )}
                {close && (
                  <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose} sx={{ p: 0.5 }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </>
            }
          >
            {message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default CustomSnackbar;
