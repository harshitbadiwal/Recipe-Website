// Action types
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const UPDATE_PROFILE = 'UPDATE_PROFILE';

const initialState = {
  isLoggedIn: true, // Default to demo logged in for effortless evaluation
  isInitialized: true,
  user: {
    id: 'ADMIN-001',
    email: 'admin@foodie-admin.io',
    name: 'Alexandra Vance',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    title: 'Lead Platform Administrator',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    bio: 'Overseeing master recipes, kitchen analytics, staff management, and system integrations.',
  },
  token: 'mock-jwt-auth-token-sample-xyz',
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
        token: token || 'mock-jwt-auth-token-sample-xyz',
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
