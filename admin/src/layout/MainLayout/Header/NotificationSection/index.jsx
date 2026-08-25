import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  CardActions,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography,
  useMediaQuery,
  Fade,
} from '@mui/material';
import { IconBell, IconChefHat, IconReceiptTax, IconAlertTriangle } from '@tabler/icons-react';
import MainCard from '../../../../ui-component/cards/MainCard';
import Transitions from '../../../../ui-component/extended/Transitions';

const NotificationSection = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Box sx={{ ml: 2, mr: 1 }}>
        <ButtonBase sx={{ borderRadius: '12px' }}>
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              transition: 'all .2s ease-in-out',
              '&[aria-controls="menu-list-grow"],&:hover': {
                bgcolor: theme.palette.secondary.dark,
                color: theme.palette.secondary.light,
              },
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="inherit"
          >
            <IconBell stroke={1.5} size="20px" />
          </Avatar>
        </ButtonBase>
      </Box>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? 5 : 0, 20],
              },
            },
          ],
        }}
        sx={{ zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Grid container direction="column" spacing={2} sx={{ width: { xs: 300, sm: 360 } }}>
                    <Grid item xs={12}>
                      <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                        <Grid item>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              Notifications
                            </Typography>
                            <Chip size="small" label="03" color="warning" sx={{ height: 20, fontSize: '0.75rem' }} />
                          </Stack>
                        </Grid>
                        <Grid item>
                          <Typography component={Link} to="#" variant="subtitle2" color="primary" sx={{ textDecoration: 'none' }}>
                            Mark all read
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <List sx={{ width: '100%', py: 0, '& .MuiListItem-root': { py: 1.5, px: 2 } }}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.main }}>
                              <IconChefHat size="20px" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={<Typography variant="subtitle1">New Recipe Published</Typography>}
                            secondary={<Typography variant="caption">Artisan Sourdough Pizza was approved by Chef Marcus</Typography>}
                          />
                        </ListItem>
                        <Divider />
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: theme.palette.success.light, color: theme.palette.success.dark }}>
                              <IconReceiptTax size="20px" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={<Typography variant="subtitle1">Daily Sales Target Hit</Typography>}
                            secondary={<Typography variant="caption">Revenue crossed $4,250 for today's orders</Typography>}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                  <Divider />
                  <CardActions sx={{ p: 1.5, justifyContent: 'center' }}>
                    <Button size="small" color="primary">
                      View All Notifications
                    </Button>
                  </CardActions>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default NotificationSection;
