export const BASE_PATH = '';
// export const API_BASE_URL = 'https://recipe-website-ja3v.onrender.com/api/v1';
export const API_BASE_URL = 'http://localhost:5000/api/v1';

const config = {
  basename: '',
  defaultPath: '/recipes',
  fontFamily: `'Poppins', 'Inter', sans-serif`,
  borderRadius: 10,
  outlinedFilled: true,
  theme: 'light', // light, dark
  presetColor: 'default', // default, theme1, theme2, theme3, theme4, theme5, theme6
  i18n: 'en', // 'en' - English, 'fr' - French, 'ro' - Romanian, 'zh' - Chinese
  rtlLayout: false,
  // apiBaseUrl: 'https://recipe-website-ja3v.onrender.com/api/v1',
  apiBaseUrl: 'http://localhost:5000/api/v1',
  jwt: {
    secret: 'recipe-secret-token-key-2026',
    timeout: '1 days',
  },
  appTitle: 'FoodieAdmin Pro',
  drawerWidth: 260,
  miniDrawerWidth: 80,
};

export default config;
