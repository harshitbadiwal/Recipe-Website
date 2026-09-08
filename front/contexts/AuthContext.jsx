'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  loginUser as apiLogin,
  registerUser as apiRegister,
  getCurrentUser as apiGetCurrentUser,
  getUserFavorites as apiGetUserFavorites,
  addFavorite as apiAddFavorite,
  removeFavorite as apiRemoveFavorite,
} from '@/services/api'

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  favoriteIds: [],
  isFavorite: () => false,
  toggleFavorite: async () => {},
  refreshFavorites: async () => {},
  authModalOpen: false,
  authModalTab: 'login',
  openAuthModal: () => {},
  closeAuthModal: () => {},
  searchModalOpen: false,
  openSearchModal: () => {},
  closeSearchModal: () => {},
  toggleSearchModal: () => {},
})

const STORAGE_TOKEN_KEY = 'recipe_auth_token'
const STORAGE_USER_KEY = 'recipe_auth_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [favoriteIds, setFavoriteIds] = useState([])

  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState('login')
  const [searchModalOpen, setSearchModalOpen] = useState(false)

  // Fetch and sync user favorites
  const refreshFavorites = useCallback(async (authToken) => {
    const activeToken = authToken || token
    if (!activeToken) {
      setFavoriteIds([])
      return
    }
    try {
      const res = await apiGetUserFavorites(activeToken, { limit: 100 })
      if (res && Array.isArray(res.favorites)) {
        const ids = res.favorites.map((f) => String(f.recipe_id || f._id || f.slug)).filter(Boolean)
        const slugs = res.favorites.map((f) => f.slug).filter(Boolean)
        // Store both IDs and slugs for easy lookup
        setFavoriteIds([...new Set([...ids, ...slugs])])
      }
    } catch (e) {
      console.warn('Failed to load favorites:', e.message)
    }
  }, [token])

  // Initialize from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY)
      const storedUser = localStorage.getItem(STORAGE_USER_KEY)

      if (storedToken) {
        setToken(storedToken)
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser))
          } catch {}
        }
        // Validate with server
        apiGetCurrentUser(storedToken).then((serverUser) => {
          if (serverUser) {
            setUser(serverUser)
            localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(serverUser))
            refreshFavorites(storedToken)
          } else {
            // Invalid/expired token
            localStorage.removeItem(STORAGE_TOKEN_KEY)
            localStorage.removeItem(STORAGE_USER_KEY)
            setToken(null)
            setUser(null)
            setFavoriteIds([])
          }
          setLoading(false)
        }).catch(() => setLoading(false))
      } else {
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }, [refreshFavorites])

  // Keyboard shortcut listener for Search (Ctrl+K or Cmd+K or /)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      const targetTag = e.target.tagName?.toLowerCase()
      if (['input', 'textarea', 'select'].includes(targetTag) && !searchModalOpen) {
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchModalOpen((prev) => !prev)
      } else if (e.key === 'Escape' && searchModalOpen) {
        e.preventDefault()
        setSearchModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchModalOpen])

  // Login handler
  const login = async ({ email, password }) => {
    const result = await apiLogin({ email, password })
    if (result.success && result.data) {
      const { user: loggedInUser, accessToken } = result.data
      setToken(accessToken)
      setUser(loggedInUser)
      try {
        localStorage.setItem(STORAGE_TOKEN_KEY, accessToken)
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(loggedInUser))
      } catch {}
      refreshFavorites(accessToken)
      setAuthModalOpen(false)
      return { success: true }
    }
    return { success: false, error: result.error || 'Login failed' }
  }

  // Register handler
  const register = async ({ name, email, password }) => {
    const result = await apiRegister({ name, email, password })
    if (result.success && result.data) {
      const { user: registeredUser, accessToken } = result.data
      setToken(accessToken)
      setUser(registeredUser)
      try {
        localStorage.setItem(STORAGE_TOKEN_KEY, accessToken)
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(registeredUser))
      } catch {}
      refreshFavorites(accessToken)
      setAuthModalOpen(false)
      return { success: true }
    }
    return { success: false, error: result.error || 'Registration failed' }
  }

  // Logout handler
  const logout = () => {
    setToken(null)
    setUser(null)
    setFavoriteIds([])
    try {
      localStorage.removeItem(STORAGE_TOKEN_KEY)
      localStorage.removeItem(STORAGE_USER_KEY)
    } catch {}
  }

  // Check if recipe is favorited
  const isFavorite = useCallback(
    (recipeIdOrSlug) => {
      if (!recipeIdOrSlug) return false
      return favoriteIds.includes(String(recipeIdOrSlug))
    },
    [favoriteIds]
  )

  // Toggle favorite with optimistic update
  const toggleFavorite = async (recipe) => {
    if (!token || !user) {
      setAuthModalTab('login')
      setAuthModalOpen(true)
      return { success: false, requireAuth: true }
    }

    const targetId = typeof recipe === 'object' ? (recipe._id || recipe.id || recipe.slug) : recipe
    const slug = typeof recipe === 'object' ? recipe.slug : null
    const alreadyFav = isFavorite(targetId) || (slug && isFavorite(slug))

    // Optimistic UI update
    if (alreadyFav) {
      setFavoriteIds((prev) => prev.filter((id) => id !== String(targetId) && id !== String(slug)))
    } else {
      setFavoriteIds((prev) => [...prev, String(targetId), ...(slug ? [String(slug)] : [])])
    }

    try {
      if (alreadyFav) {
        await apiRemoveFavorite(targetId, token)
      } else {
        await apiAddFavorite(targetId, token)
      }
      return { success: true, isFavorite: !alreadyFav }
    } catch (err) {
      // Revert optimistic update on failure
      refreshFavorites(token)
      throw err
    }
  }

  // Modal controls
  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab)
    setAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setAuthModalOpen(false)
  }

  const openSearchModal = () => {
    setSearchModalOpen(true)
  }

  const closeSearchModal = () => {
    setSearchModalOpen(false)
  }

  const toggleSearchModal = () => {
    setSearchModalOpen((prev) => !prev)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        loading,
        login,
        register,
        logout,
        favoriteIds,
        isFavorite,
        toggleFavorite,
        refreshFavorites,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        searchModalOpen,
        openSearchModal,
        closeSearchModal,
        toggleSearchModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
