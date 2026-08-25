import { createTheme } from '@mui/material/styles';
import colors from '../assets/scss/_themes-vars.module.scss';
import componentStyleOverrides from './compStyleOverride';
import themePalette from './palette';
import themeTypography from './typography';

/**
 * Represent theme style and elements as per Berry / QuickMart standard
 * @param {JsonObject} customization customization parameter object
 */
export const theme = (customization) => {
  const color = colors;

  const themeOption = {
    colors: color,
    heading: color.grey900,
    paper: color.paper,
    backgroundDefault: color.paper,
    background: color.primaryLight,
    darkTextPrimary: color.grey700,
    darkTextSecondary: color.grey500,
    textDark: color.grey900,
    menuSelected: color.primaryMain,
    menuSelectedBack: color.primaryLight,
    divider: color.grey200,
    customization,
  };

  const themeOptions = {
    direction: 'ltr',
    palette: themePalette(themeOption),
    mixins: {
      toolbar: {
        minHeight: '48px',
        padding: '16px',
        '@media (min-width: 600px)': {
          minHeight: '48px',
        },
      },
    },
    typography: themeTypography(themeOption),
    customShadows: {
      z1: '0px 2px 8px rgba(0, 0, 0, 0.08)',
      primary: `0px 8px 24px ${color.primary200}`,
      secondary: `0px 8px 24px ${color.secondary200}`,
    },
  };

  const themes = createTheme(themeOptions);
  themes.components = componentStyleOverrides(themeOption);

  return themes;
};

export default theme;
