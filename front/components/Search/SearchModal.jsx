'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getRecipes, getCategories } from '@/services/api'
import MiniRecipeCard from './MiniRecipeCard'

export default function SearchModal() {
  const router = useRouter()
  const { searchModalOpen, closeSearchModal } = useAuth()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const inputRef = useRef(null)
  const debounceTimerRef = useRef(null)

  // Fetch dynamic categories from API
  useEffect(() => {
    let isMounted = true
    async function fetchDynamicCategories() {
      try {
        const catList = await getCategories()
        if (isMounted && Array.isArray(catList)) {
          setCategories(catList)
        }
      } catch (err) {
        console.warn('Failed to load categories for search:', err.message)
      }
    }
    fetchDynamicCategories()
    return () => {
      isMounted = false
    }
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (searchModalOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => {
        inputRef.current?.focus()
      }, 80)
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
      setHasSearched(false)
      setLoading(false)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [searchModalOpen])

  // Live search fetch
  const performSearch = useCallback(async (searchTerm) => {
    const trimmed = searchTerm.trim()
    if (!trimmed) {
      setResults([])
      setHasSearched(false)
      setLoading(false)
      return
    }

    setLoading(true)
    setHasSearched(true)
    try {
      const { recipes } = await getRecipes({ q: trimmed, limit: 12 })
      setResults(Array.isArray(recipes) ? recipes : [])
    } catch (err) {
      console.warn('Search query error:', err.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced input change
  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (!value.trim()) {
      setResults([])
      setHasSearched(false)
      setLoading(false)
      return
    }

    setLoading(true)
    debounceTimerRef.current = setTimeout(() => {
      performSearch(value)
    }, 280)
  }

  // Handle suggestion chip click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    performSearch(suggestion)
  }

  // Handle form submit (press enter)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    closeSearchModal()
    router.push(`/recipes?q=${encodeURIComponent(query.trim())}`)
  }

  if (!searchModalOpen) return null

  return (
    <div className="search-modal-backdrop" onClick={closeSearchModal}>
      <div
        className="search-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar / Search Input Header */}
        <div className="search-modal-header">
          <form onSubmit={handleSubmit} className="search-modal-form">
            <span className="search-input-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>

            <input
              ref={inputRef}
              type="text"
              className="search-modal-input"
              placeholder="Search recipes, ingredients, or cuisines (e.g. Chole, Biryani)..."
              value={query}
              onChange={handleInputChange}
            />

            {query && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {
                  setQuery('')
                  setResults([])
                  setHasSearched(false)
                  inputRef.current?.focus()
                }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}

            <button
              type="button"
              className="search-close-key-btn"
              onClick={closeSearchModal}
              title="Close (ESC)"
            >
              <span>ESC</span>
            </button>
          </form>
        </div>

        {/* Dynamic Categories Chips from API */}
        {categories.length > 0 && (
          <div className="search-suggestions-bar">
            <span className="suggestions-label">Explore Categories:</span>
            <div className="suggestions-chips-scroll">
              {categories.map((cat) => {
                const catName = cat.name || cat.slug || ''
                return (
                  <button
                    key={cat._id || cat.id || cat.slug || catName}
                    type="button"
                    className={`search-chip-btn ${query.toLowerCase() === catName.toLowerCase() ? 'active' : ''}`}
                    onClick={() => handleSuggestionClick(catName)}
                  >
                    {catName}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Results Area */}
        <div className="search-modal-body">
          {/* Status info */}
          {hasSearched && !loading && (
            <div className="search-results-count-bar">
              <span className="results-count-text">
                {results.length > 0
                  ? `Found ${results.length} recipe${results.length === 1 ? '' : 's'} matching "${query}"`
                  : `No recipes found matching "${query}"`}
              </span>
              {results.length > 0 && (
                <button
                  type="button"
                  className="view-all-results-link"
                  onClick={() => {
                    closeSearchModal()
                    router.push(`/recipes?q=${encodeURIComponent(query)}`)
                  }}
                >
                  View full results on Recipes page →
                </button>
              )}
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="mini-cards-grid">
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

          {/* Results Grid with Mini Recipe Cards */}
          {!loading && results.length > 0 && (
            <div className="mini-cards-grid">
              {results.map((recipe) => (
                <MiniRecipeCard
                  key={recipe._id || recipe.id || recipe.slug}
                  recipe={recipe}
                  onSelect={closeSearchModal}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && hasSearched && results.length === 0 && (
            <div className="search-empty-state">
              <div className="empty-state-icon">🍲</div>
              <h3 className="empty-state-title">No Culinary Matches Found</h3>
              <p className="empty-state-text">
                We couldn't find any dishes matching <strong>"{query}"</strong>. Try checking your keywords or explore one of our authentic categories below.
              </p>
              {categories.length > 0 && (
                <div className="empty-state-actions">
                  {categories.slice(0, 5).map((cat) => {
                    const catName = cat.name || cat.slug
                    return (
                      <button
                        key={cat._id || cat.id || cat.slug || catName}
                        type="button"
                        className="empty-tag-pill"
                        onClick={() => handleSuggestionClick(catName)}
                      >
                        Try "{catName}"
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Initial Prompt (when user hasn't typed anything yet) */}
          {!hasSearched && !loading && (
            <div className="search-initial-prompt">
              <div className="prompt-icon">🔍</div>
              <h3 className="prompt-title">What would you like to cook today?</h3>
              <p className="prompt-desc">
                Type any dish name, cuisine, ingredient, or click one of the categories above to see instant recipe previews.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
