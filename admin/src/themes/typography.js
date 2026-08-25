/**
 * Typography options for Material UI
 */
export default function themeTypography(theme) {
  return {
    fontFamily: theme?.customization?.fontFamily || `'Poppins', 'Inter', sans-serif`,
    h6: {
      fontWeight: 500,
      color: theme.heading,
      fontSize: '0.75rem',
    },
    h5: {
      fontSize: '0.875rem',
      color: theme.heading,
      fontWeight: 600,
    },
    h4: {
      fontSize: '1rem',
      color: theme.heading,
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.25rem',
      color: theme.heading,
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.5rem',
      color: theme.heading,
      fontWeight: 700,
    },
    h1: {
      fontSize: '2rem',
      color: theme.heading,
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: theme.textDark,
    },
    subtitle2: {
      fontSize: '0.75rem',
      fontWeight: 400,
      color: theme.darkTextSecondary,
    },
    caption: {
      fontSize: '0.75rem',
      color: theme.darkTextSecondary,
      fontWeight: 400,
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.4em',
    },
    body2: {
      letterSpacing: '0em',
      fontWeight: 400,
      lineHeight: '1.5em',
      color: theme.darkTextSecondary,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    customInput: {
      marginTop: 1,
      marginBottom: 1,
      '& > label': {
        top: 23,
        left: 0,
        color: theme.grey500,
        '&[data-shrink="false"]': {
          top: 5,
        },
      },
      '& > div > input': {
        padding: '30.5px 14px 11.5px !important',
      },
      '& legend': {
        display: 'none',
      },
      '& fieldset': {
        top: 0,
      },
    },
  };
}
