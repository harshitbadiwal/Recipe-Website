'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const {
    user,
    isAuthenticated,
    logout,
    openAuthModal,
    openSearchModal,
    favoriteIds,
  } = useAuth()

  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [userMenuOpen])

  return (
    <header className="header header-scrolled">
      <div className="header-container">
        <div className="header-content">
          {/* Logo */}
          <Link href="/" className="logo">
            <img
              src="/logo.png"
              alt="Sonia Sharma"
              className="site-logo-img"
              width={46}
              height={46}
            />
            <span className="logo-text">
              Sonia<span className="logo-accent">Sharma</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="nav">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/recipes" className="nav-link">
              Recipes
            </Link>
            <Link href="/categories" className="nav-link">
              Categories
            </Link>
            {/* <Link href="/videos" className="nav-link">
              Videos
            </Link> */}
            <Link href="/articles" className="nav-link">
              Articles
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
            <Link href="/contact" className="nav-link">
              Contact
            </Link>
          </nav>

          {/* Header Action Buttons */}
          <div className="header-actions">
            {/* Search Trigger Button */}
            <div className="header-search-trigger" onClick={openSearchModal}>
              <button type="button" className="search-btn" aria-label="Open search modal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              <span className="header-search-placeholder">
                Search recipes...
              </span>
              <kbd className="search-shortcut-badge">⌘K</kbd>
            </div>

            {/* User Favorites Link & Count Badge (if logged in) */}
            {isAuthenticated && (
              <Link
                href="/favorites"
                className="header-fav-quick-btn"
                title="My Favorite Recipes"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="#e11d48" stroke="#e11d48" strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                {favoriteIds.length > 0 && (
                  <span className="header-fav-badge">{favoriteIds.length}</span>
                )}
              </Link>
            )}

            {/* Authentication / User Profile */}
            <div className="header-user-wrapper" ref={menuRef}>
              {isAuthenticated ? (
                <div className="user-dropdown-container">
                  <button
                    type="button"
                    className="header-avatar-btn"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    aria-label="User profile menu"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name || 'User'} className="header-avatar-img" />
                    ) : (
                      <span className="header-avatar-initials">
                        {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </button>

                  {userMenuOpen && (
                    <div className="header-user-menu-dropdown">
                      <div className="dropdown-user-info">
                        <div className="user-info-name">{user?.name || 'Chef Member'}</div>
                        <div className="user-info-email">{user?.email}</div>
                      </div>

                      <div className="dropdown-divider" />

                      <Link
                        href="/favorites"
                        className="dropdown-menu-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <span className="dropdown-item-icon">❤️</span>
                        <span>My Favorites</span>
                        {favoriteIds.length > 0 && (
                          <span className="dropdown-count-pill">{favoriteIds.length}</span>
                        )}
                      </Link>

                      <Link
                        href="/recipes"
                        className="dropdown-menu-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <span className="dropdown-item-icon">🍳</span>
                        <span>Explore Recipes</span>
                      </Link>

                      <div className="dropdown-divider" />

                      <button
                        type="button"
                        className="dropdown-menu-item logout-item"
                        onClick={() => {
                          setUserMenuOpen(false)
                          logout()
                        }}
                      >
                        <span className="dropdown-item-icon">🚪</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  className="header-auth-btn"
                  onClick={() => openAuthModal('login')}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
