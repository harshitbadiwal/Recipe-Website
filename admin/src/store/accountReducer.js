// Action types
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const UPDATE_PROFILE = 'UPDATE_PROFILE';

const getInitialToken = () => {
  try {
    const token = localStorage.getItem('recipe_admin_token');
    if (token && token !== 'null' && token !== 'undefined' && !token.startsWith('mock-')) {
      return token;
    }
  } catch (e) {}
  return null;
};

const getInitialUser = () => {
  try {
    const user = localStorage.getItem('recipe_admin_user');
    if (user) return JSON.parse(user);
  } catch (e) {}
  return null;
};

const initialToken = getInitialToken();
const initialUser = getInitialUser();

const initialState = {
  isLoggedIn: Boolean(initialToken),
  isInitialized: true,
  user: initialUser,
  token: initialToken,
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      const { user, token } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: true,
        user,
        token,
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isLoggedIn: false,
        isInitialized: true,
        user: null,
        token: null,
      };
    }
    case UPDATE_PROFILE: {
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    }
    default: {
      return { ...state };
    }
  }
};

export const loginAction = (payload) => ({ type: LOGIN, payload });
export const logoutAction = () => ({ type: LOGOUT });
export const updateProfileAction = (payload) => ({ type: UPDATE_PROFILE, payload });

export default accountReducer;
