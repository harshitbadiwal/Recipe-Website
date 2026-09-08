'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { getUserFavorites } from '@/services/api'
import MiniRecipeCard from '@/components/Search/MiniRecipeCard'

export default function FavoritesPage() {
  const { token, isAuthenticated, loading: authLoading, openAuthModal, favoriteIds } = useAuth()

  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      setFavorites([])
      return
    }

    setLoading(true)
    getUserFavorites(token, { limit: 50 })
      .then((res) => {
        if (res && Array.isArray(res.favorites)) {
          setFavorites(res.favorites)
        }
      })
      .catch((err) => {
        console.warn('Error fetching user favorites:', err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [token, favoriteIds])

  if (authLoading) {
    return (
      <div className="favorites-page-container">
        <div className="container py-12 text-center">
          <div className="favorites-spinner" />
          <p className="mt-4 text-slate-500">Checking your kitchen favorites...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="favorites-page-container">
        <div className="container py-16 text-center">
          <div className="favorites-guest-card">
            <span className="guest-card-icon">❤️</span>
            <h1 className="guest-card-title">Save & Access Your Favorite Recipes</h1>
            <p className="guest-card-desc">
              Sign in to your account to curate your personalized cookbook, save delicious dishes, and access them anytime on any device.
            </p>
            <div className="guest-card-actions">
              <button
                type="button"
                className="guest-login-btn"
                onClick={() => openAuthModal('login')}
              >
                Sign In to View Favorites
              </button>
              <button
                type="button"
                className="guest-register-btn"
                onClick={() => openAuthModal('register')}
              >
                Create Free Account
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="favorites-page-container">
      <div className="container py-10">
        {/* Header Banner */}
        <div className="favorites-header">
          <div className="favorites-header-info">
            <span className="favorites-eyebrow">❤️ Your Personal Cookbook</span>
            <h1 className="favorites-title">My Favorite Recipes</h1>
            <p className="favorites-desc">
              All the recipes you've loved and bookmarked for quick cooking inspiration.
            </p>
          </div>

          <Link href="/recipes" className="explore-more-btn">
            <span>Explore More Recipes</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mini-cards-grid mt-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="mini-card-skeleton">
                <div className="skeleton-media shimmer" />
                <div className="skeleton-body">
                  <div className="skeleton-line short shimmer" />
                  <div className="skeleton-line medium shimmer" />
                  <div className="skeleton-line shimmer" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recipes Grid */}
        {!loading && favorites.length > 0 && (
          <div className="mini-cards-grid mt-8">
            {favorites.map((recipe) => (
              <MiniRecipeCard
                key={recipe._id || recipe.recipe_id || recipe.slug}
                recipe={recipe}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && favorites.length === 0 && (
          <div className="favorites-empty-box">
            <span className="empty-box-icon">🍳</span>
            <h2 className="empty-box-title">No Favorite Recipes Saved Yet</h2>
            <p className="empty-box-desc">
              Whenever you find a dish you'd love to cook, tap the heart icon on the recipe card or recipe page to save it right here!
            </p>
            <Link href="/recipes" className="browse-recipes-action-btn">
              Browse Recipes Now
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
