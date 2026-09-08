'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function FavoriteButton({ recipe, className = '' }) {
  const { isFavorite, toggleFavorite, isAuthenticated, openAuthModal } = useAuth()
  const [loading, setLoading] = useState(false)

  if (!recipe) return null

  const id = recipe._id || recipe.id || recipe.slug
  const favorited = isFavorite(id) || (recipe.slug && isFavorite(recipe.slug))

  const handleToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      openAuthModal('login')
      return
    }

    setLoading(true)
    try {
      await toggleFavorite(recipe)
    } catch (err) {
      console.warn('Failed to toggle favorite:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      className={`detail-fav-btn ${favorited ? 'active' : ''} ${className}`}
      onClick={handleToggle}
      disabled={loading}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      title={favorited ? 'Saved in your favorites' : 'Save to favorites'}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={favorited ? '#e11d48' : 'none'}
        stroke={favorited ? '#e11d48' : 'currentColor'}
        strokeWidth="2.2"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      <span>{favorited ? 'Saved in Favorites' : 'Save Recipe'}</span>
    </button>
  )
}
