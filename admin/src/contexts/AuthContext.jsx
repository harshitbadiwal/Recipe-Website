import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from '../store';
import { loginAction, logoutAction, updateProfileAction } from '../store/accountReducer';
import { openSnackbar } from '../store/slices/snackbar';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      dispatch(loginAction({ user: data.user, token: data.token }));
      dispatch(
        openSnackbar({
          open: true,
          message: `Welcome back, ${data.user?.name || 'Admin'}!`,
          variant: 'alert',
          alert: { color: 'success' },
          close: true,
        })
      );
      return data;
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Login failed',
          variant: 'alert',
          alert: { color: 'error' },
          close: true,
        })
      );
      throw err;
    }
  };

  const logout = async () => {
    await authService.logout();
    dispatch(logoutAction());
    dispatch(
      openSnackbar({
        open: true,
        message: 'Logged out successfully.',
        variant: 'alert',
        alert: { color: 'info' },
        close: true,
      })
    );
  };

  const updateProfile = (updatedFields) => {
    dispatch(updateProfileAction(updatedFields));
    dispatch(
      openSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        variant: 'alert',
        alert: { color: 'success' },
        close: true,
      })
    );
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: account?.isLoggedIn,
        isInitialized: account?.isInitialized,
        user: account?.user,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
