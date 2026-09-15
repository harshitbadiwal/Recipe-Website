import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const Logo = ({ size = 38, showSubtitle = true, sx = {} }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.5,
        textDecoration: 'none',
        userSelect: 'none',
        ...sx,
      }}
    >
      <Box
        component="img"
        src="/logo.png"
        alt="Sonia Sharma"
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'contain',
          bgcolor: '#000000',
          boxShadow: '0 3px 12px rgba(0, 0, 0, 0.18)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            transform: 'rotate(6deg) scale(1.06)',
          },
        }}
      />
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontSize: size > 40 ? '1.45rem' : '1.15rem',
            lineHeight: 1.15,
            letterSpacing: '-0.3px',
            color: theme.palette.text.primary,
          }}
        >
          Sonia
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              ml: 0.5,
            }}
          >
            Sharma
          </Box>
        </Typography>
        {showSubtitle && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              fontWeight: 700,
              fontSize: '0.62rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: 'text.secondary',
              mt: 0.2,
            }}
          >
            Culinary Admin
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Logo;
