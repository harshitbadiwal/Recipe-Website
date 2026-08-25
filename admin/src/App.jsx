import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from './routes';

// defaultTheme
import themes from './themes';

// project imports
import NavigationScroll from './layout/NavigationScroll';
import { AuthProvider } from './contexts/AuthContext';
import useConfig from './hooks/useConfig';

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.menu);
  const config = useConfig();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes({ ...customization, ...config })}>
        <CssBaseline />
        <NavigationScroll>
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
