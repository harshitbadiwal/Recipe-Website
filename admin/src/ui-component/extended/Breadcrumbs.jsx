import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Card, Divider, Grid, Typography, Breadcrumbs as MuiBreadcrumbs } from '@mui/material';
import { IconChevronRight, IconHome } from '@tabler/icons-react';
import config from '../../config';

const Breadcrumbs = ({ card, custom, divider = true, heading, icon = true, icons, links, maxItems, rightAlign, separator, title = true, titleBottom, ...others }) => {
  const theme = useTheme();
  const location = useLocation();
  const [main, setMain] = useState();
  const [item, setItem] = useState();

  useEffect(() => {
    // Generate simple breadcrumbs from URL pathname
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 0) {
      const pageTitle = segments[segments.length - 1].replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      setItem({ title: pageTitle });
    }
  }, [location]);

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Grid item>
          <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
            {heading || item?.title || 'Dashboard'}
          </Typography>
        </Grid>
        <Grid item>
          <MuiBreadcrumbs
            separator={<IconChevronRight stroke={1.5} size="14px" style={{ color: theme.palette.grey[500] }} />}
            aria-label="breadcrumb"
            maxItems={maxItems || 8}
            {...others}
          >
            <Typography
              component={Link}
              to="/"
              color="inherit"
              variant="subtitle2"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: theme.palette.grey[500],
                '&:hover': { color: theme.palette.primary.main },
              }}
            >
              <IconHome stroke={1.5} size="16px" style={{ marginRight: 4 }} />
              Home
            </Typography>
            {item && (
              <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                {item.title}
              </Typography>
            )}
          </MuiBreadcrumbs>
        </Grid>
      </Grid>
      {divider && <Divider sx={{ mt: 2 }} />}
    </Box>
  );
};

Breadcrumbs.propTypes = {
  card: PropTypes.bool,
  custom: PropTypes.bool,
  divider: PropTypes.bool,
  heading: PropTypes.string,
  icon: PropTypes.bool,
  icons: PropTypes.bool,
  links: PropTypes.array,
  maxItems: PropTypes.number,
  rightAlign: PropTypes.bool,
  separator: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  title: PropTypes.bool,
  titleBottom: PropTypes.bool,
};

export default Breadcrumbs;
