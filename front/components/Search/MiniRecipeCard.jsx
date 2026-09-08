'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function MiniRecipeCard({ recipe, onSelect }) {
  const { isFavorite, toggleFavorite } = useAuth()
  if (!recipe) return null

  const slug = recipe.slug || recipe._id || recipe.id
  const recipeId = recipe._id || recipe.id || slug
  const title = recipe.title || 'Untitled Recipe'
  const image = recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop'
  const catName = recipe.categoryName || recipe.category?.name || recipe.category || 'Specialty'
  
  // Format total cooking time
  const timeMinutes = recipe.totalTime || (recipe.prepTime && recipe.cookTime ? recipe.prepTime + recipe.cookTime : null) || recipe.cookTime || recipe.time || 25
  const timeDisplay = typeof timeMinutes === 'string' && timeMinutes.includes('min') ? timeMinutes : `${timeMinutes} min`
  
  const rating = typeof recipe.ratingAverage === 'number' ? recipe.ratingAverage.toFixed(1) : (recipe.rating || '4.9')
  const difficulty = recipe.difficulty || 'Easy'
  const description = recipe.description || recipe.excerpt || ''

  const favorited = isFavorite(recipeId) || isFavorite(slug)

  const handleFavoriteClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await toggleFavorite(recipe)
    } catch (err) {
      console.warn('Favorite toggle error:', err.message)
    }
  }

  const getCategoryEmoji = (category) => {
    const cat = String(category).toLowerCase()
    if (cat.includes('dessert') || cat.includes('sweet')) return '🍨'
    if (cat.includes('non-veg') || cat.includes('chicken') || cat.includes('mutton')) return '🍗'
    if (cat.includes('veg')) return '🌱'
    if (cat.includes('snack') || cat.includes('street')) return '🥟'
    if (cat.includes('beverage') || cat.includes('drink')) return '🍹'
    return '🍲'
  }

  const getCategoryClass = (category) => {
    const cat = String(category).toLowerCase()
    if (cat.includes('dessert') || cat.includes('sweet')) return 'mini-cat-dessert'
    if (cat.includes('non-veg') || cat.includes('nonveg')) return 'mini-cat-nonveg'
    if (cat.includes('veg')) return 'mini-cat-veg'
    return 'mini-cat-snacks'
  }

  return (
    <div className="mini-recipe-card-wrapper">
      <Link
        href={`/recipes/${slug}`}
        className="mini-recipe-card"
        onClick={() => {
          if (onSelect) onSelect()
        }}
      >
        {/* Media Container */}
        <div className="mini-card-media">
          <img src={image} alt={title} className="mini-card-img" loading="lazy" />
          <div className="mini-card-overlay" />

          {/* Top-Left Category Badge */}
          <span className={`mini-card-cat-badge ${getCategoryClass(catName)}`}>
            <span className="mini-cat-icon">{getCategoryEmoji(catName)}</span>
            <span>{catName}</span>
          </span>

          {/* Top-Right Favorite Button */}
          <button
            type="button"
            className={`mini-card-fav-btn ${favorited ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={favorited ? '#e11d48' : 'none'}
              stroke={favorited ? '#e11d48' : 'currentColor'}
              strokeWidth="2.2"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>

          {/* Bottom-Left Time Pill */}
          <div className="mini-card-time-pill">
            <span className="mini-time-icon">⏱</span>
            <span>{timeDisplay}</span>
          </div>
        </div>

        {/* Content Details */}
        <div className="mini-card-body">
          <div className="mini-card-meta-row">
            <span className="mini-star-icon">★</span>
            <span className="mini-rating-text">{rating}</span>
            <span className="mini-meta-dot">•</span>
            <span className="mini-difficulty-text">{difficulty}</span>
          </div>

          <h4 className="mini-card-title">{title}</h4>

          {description && (
            <p className="mini-card-desc">
              {description.length > 85 ? `${description.slice(0, 85)}...` : description}
            </p>
          )}

          <div className="mini-card-action">
            <span className="mini-cook-text">Cook Now</span>
            <svg
              className="mini-cook-arrow"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  )
}
