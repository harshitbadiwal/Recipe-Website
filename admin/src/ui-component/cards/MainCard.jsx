import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';

const headerSX = {
  '& .MuiCardHeader-action': { mr: 0 },
};

const MainCard = forwardRef(
  (
    {
      border = true,
      boxShadow,
      children,
      content = true,
      contentClass = '',
      contentSX = {},
      darkTitle,
      secondary,
      shadow,
      sx = {},
      title,
      ...others
    },
    ref
  ) => {
    const theme = useTheme();

    return (
      <Card
        ref={ref}
        {...others}
        sx={{
          border: border ? '1px solid' : 'none',
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : theme.palette.grey[200],
          bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.background.paper,
          boxShadow:
            boxShadow || shadow
              ? '0px 8px 24px -4px rgba(16, 24, 40, 0.08), 0px 2px 6px -1px rgba(16, 24, 40, 0.04)'
              : 'none',
          borderRadius: `${theme.shape.borderRadius || 10}px`,
          position: 'relative',
          ...sx,
        }}
      >
        {/* card header and action */}
        {title && (
          <CardHeader
            sx={headerSX}
            title={
              darkTitle ? (
                <Typography variant="h3" sx={{ fontWeight: 600 }}>
                  {title}
                </Typography>
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {title}
                </Typography>
              )
            }
            action={secondary}
          />
        )}

        {/* content & header divider */}
        {title && <Divider />}

        {/* card content */}
        {content ? (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        ) : (
          children
        )}
      </Card>
    );
  }
);

MainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.node,
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
};

export default MainCard;
