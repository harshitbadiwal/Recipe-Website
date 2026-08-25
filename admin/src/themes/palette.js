/**
 * Color theme palette configuration
 */
export default function themePalette(theme) {
  const isDark = theme.customization?.navType === 'dark';

  return {
    mode: isDark ? 'dark' : 'light',
    common: {
      black: '#000000',
      white: '#ffffff',
    },
    primary: {
      light: theme.colors?.primaryLight || '#eef2ff',
      main: theme.colors?.primaryMain || '#6366f1',
      dark: theme.colors?.primaryDark || '#4338ca',
      200: theme.colors?.primary200 || '#c7d2fe',
      800: theme.colors?.primary800 || '#3730a3',
      contrastText: '#ffffff',
    },
    secondary: {
      light: theme.colors?.secondaryLight || '#ecfdf5',
      main: theme.colors?.secondaryMain || '#10b981',
      dark: theme.colors?.secondaryDark || '#047857',
      200: theme.colors?.secondary200 || '#a7f3d0',
      800: theme.colors?.secondary800 || '#065f46',
      contrastText: '#ffffff',
    },
    error: {
      light: theme.colors?.errorLight || '#fef2f2',
      main: theme.colors?.errorMain || '#ef4444',
      dark: theme.colors?.errorDark || '#b91c1c',
    },
    orange: {
      light: theme.colors?.orangeLight || '#fffbeb',
      main: theme.colors?.orangeMain || '#f59e0b',
      dark: theme.colors?.orangeDark || '#b45309',
    },
    warning: {
      light: theme.colors?.warningLight || '#fffbeb',
      main: theme.colors?.warningMain || '#f59e0b',
      dark: theme.colors?.warningDark || '#d97706',
    },
    success: {
      light: theme.colors?.successLight || '#f0fdf4',
      200: theme.colors?.success200 || '#bbf7d0',
      main: theme.colors?.successMain || '#22c55e',
      dark: theme.colors?.successDark || '#15803d',
    },
    grey: {
      50: theme.colors?.grey50 || '#f8fafc',
      100: theme.colors?.grey100 || '#f1f5f9',
      200: theme.colors?.grey200 || '#e2e8f0',
      300: theme.colors?.grey300 || '#cbd5e1',
      500: theme.colors?.grey500 || '#64748b',
      600: theme.colors?.grey600 || '#475569',
      700: theme.colors?.grey700 || '#334155',
      800: theme.colors?.grey800 || '#1e293b',
      900: theme.colors?.grey900 || '#0f172a',
    },
    dark: {
      light: theme.colors?.darkTextPrimary || '#e2e8f0',
      main: theme.colors?.darkLevel1 || '#1e293b',
      dark: theme.colors?.darkBackground || '#0f172a',
      800: theme.colors?.darkLevel2 || '#334155',
      900: theme.colors?.darkPaper || '#1e293b',
    },
    text: {
      primary: isDark ? theme.colors?.darkTextPrimary || '#e2e8f0' : theme.colors?.grey800 || '#1e293b',
      secondary: isDark ? theme.colors?.darkTextSecondary || '#94a3b8' : theme.colors?.grey500 || '#64748b',
      dark: isDark ? '#ffffff' : theme.colors?.grey900 || '#0f172a',
      hint: theme.colors?.grey300 || '#cbd5e1',
    },
    background: {
      paper: isDark ? theme.colors?.darkPaper || '#1e293b' : theme.colors?.paper || '#ffffff',
      default: isDark ? theme.colors?.darkBackground || '#0f172a' : theme.colors?.grey50 || '#f8fafc',
    },
    divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
  };
}
