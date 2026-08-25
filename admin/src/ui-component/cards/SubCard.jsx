import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';

const SubCard = forwardRef(
  (
    {
      children,
      content = true,
      contentClass = '',
      darkTitle,
      secondary,
      sx = {},
      contentSX = {},
      title,
      ...others
    },
    ref
  ) => {
    const theme = useTheme();

    return (
      <Card
        ref={ref}
        sx={{
          border: '1px solid',
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : theme.palette.grey[200],
          borderRadius: `${theme.shape.borderRadius || 10}px`,
          bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.background.paper,
          ':hover': {
            boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
          },
          ...sx,
        }}
        {...others}
      >
        {/* card header and action */}
        {title && (
          <CardHeader
            sx={{ p: 2 }}
            title={
              <Typography variant={darkTitle ? 'h4' : 'h5'} sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
            }
            action={secondary}
          />
        )}

        {/* content & header divider */}
        {title && <Divider />}

        {/* card content */}
        {content ? (
          <CardContent sx={{ p: 2.5, ...contentSX }} className={contentClass}>
            {children}
          </CardContent>
        ) : (
          children
        )}
      </Card>
    );
  }
);

SubCard.propTypes = {
  children: PropTypes.node,
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  darkTitle: PropTypes.bool,
  secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  sx: PropTypes.object,
  contentSX: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
};

export default SubCard;
