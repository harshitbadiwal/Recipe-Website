import React, { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from '../store';
import { loginAction, logoutAction, updateProfileAction } from '../store/accountReducer';
import { openSnackbar } from '../store/slices/snackbar';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);

  const login = async (email, password) => {
    // Simulated authentication API response
    const mockUser = {
      id: 'ADMIN-001',
      email: email || 'admin@foodie-admin.io',
      name: email?.includes('chef') ? 'Chef Marcus Sterling' : 'Alexandra Vance',
      role: email?.includes('chef') ? 'Head Chef' : 'Super Admin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      title: 'Lead Platform Administrator',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      bio: 'Managing recipes, culinary menus, kitchen workflow, and administrative analytics.',
    };

    dispatch(loginAction({ user: mockUser, token: 'mock-jwt-token-2026' }));
    dispatch(
      openSnackbar({
        open: true,
        message: `Welcome back, ${mockUser.name}!`,
        variant: 'alert',
        alert: { color: 'success' },
        close: true,
      })
    );
    return true;
  };

  const logout = () => {
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
