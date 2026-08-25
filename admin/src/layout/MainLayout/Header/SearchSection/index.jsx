import React, { useState } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Card, Grid, InputAdornment, OutlinedInput, Popper } from '@mui/material';
import { IconSearch, IconAdjustmentsHorizontal, IconX } from '@tabler/icons-react';
import { shouldForwardProp } from '@mui/system';

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
  width: 380,
  marginLeft: 16,
  paddingLeft: 16,
  paddingRight: 16,
  '& input': {
    background: 'transparent !important',
    paddingLeft: '4px !important',
  },
  [theme.breakpoints.down('lg')]: {
    width: 250,
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginLeft: 4,
    background: '#fff',
  },
}));

const SearchSection = () => {
  const theme = useTheme();
  const [value, setValue] = useState('');

  return (
    <>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <OutlineInputStyle
          id="input-search-header"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search recipes, ingredients, analytics..."
          startAdornment={
            <InputAdornment position="start">
              <IconSearch stroke={1.5} size="18px" color={theme.palette.grey[500]} />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <ButtonBase sx={{ borderRadius: '8px' }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    bgcolor: theme.palette.primary.light,
                    color: theme.palette.primary.dark,
                    width: 32,
                    height: 32,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                      color: theme.palette.primary.light,
                    },
                  }}
                >
                  <IconAdjustmentsHorizontal stroke={1.5} size="16px" />
                </Avatar>
              </ButtonBase>
            </InputAdornment>
          }
          aria-describedby="search-helper-text"
          inputProps={{ 'aria-label': 'weight' }}
          size="small"
        />
      </Box>
    </>
  );
};

export default SearchSection;
