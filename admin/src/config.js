export const BASE_PATH = '';

const config = {
  basename: '',
  defaultPath: '/dashboard',
  fontFamily: `'Poppins', 'Inter', sans-serif`,
  borderRadius: 10,
  outlinedFilled: true,
  theme: 'light', // light, dark
  presetColor: 'default', // default, theme1, theme2, theme3, theme4, theme5, theme6
  i18n: 'en', // 'en' - English, 'fr' - French, 'ro' - Romanian, 'zh' - Chinese
  rtlLayout: false,
  jwt: {
    secret: 'recipe-secret-token-key-2026',
    timeout: '1 days',
  },
  appTitle: 'FoodieAdmin Pro',
  drawerWidth: 260,
  miniDrawerWidth: 80,
};

export default config;
