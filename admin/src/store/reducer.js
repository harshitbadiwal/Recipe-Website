import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// reducer imports
import menuReducer from './slices/menu';
import snackbarReducer from './slices/snackbar';
import accountReducer from './accountReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const authPersistConfig = {
  key: 'recipe-admin-auth',
  storage,
  keyPrefix: 'recipe-admin-',
};

const reducer = combineReducers({
  account: persistReducer(authPersistConfig, accountReducer),
  menu: menuReducer,
  snackbar: snackbarReducer,
});

export default reducer;
