'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthModal() {
  const { authModalOpen, authModalTab, closeAuthModal, login, register } = useAuth()

  const [activeTab, setActiveTab] = useState(authModalTab || 'login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (authModalOpen) {
      setActiveTab(authModalTab || 'login')
      setName('')
      setEmail('')
      setPassword('')
      setFormError('')
      setFieldErrors({})
    } else {
      setName('')
      setEmail('')
      setPassword('')
      setFormError('')
      setFieldErrors({})
      setSubmitting(false)
    }
  }, [authModalOpen, authModalTab])

  if (!authModalOpen) return null

  const clearFieldError = (field) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      })
    }
  }

  const handleTabSwitch = (tab) => {
    setActiveTab(tab)
    setName('')
    setEmail('')
    setPassword('')
    setFormError('')
    setFieldErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    const errors = {}

    if (activeTab === 'register' && !name.trim()) {
      errors.name = 'Please enter your full name.'
    }
    if (!email.trim()) {
      errors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.'
    }
    if (!password) {
      errors.password = 'Please enter your password.'
    } else if (activeTab === 'register' && password.length < 6) {
      errors.password = 'Password must be at least 6 characters.'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setSubmitting(true)
    try {
      if (activeTab === 'login') {
        const res = await login({ email: email.trim(), password })
        if (!res.success) {
          setFormError(res.error || 'Invalid credentials. Please try again.')
        }
      } else {
        const res = await register({ name: name.trim(), email: email.trim(), password })
        if (!res.success) {
          setFormError(res.error || 'Registration failed. Email might already be taken.')
        }
      }
    } catch (err) {
      setFormError(err.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-modal-backdrop" onClick={closeAuthModal}>
      <div className="auth-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="auth-modal-close-btn"
          onClick={closeAuthModal}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="auth-modal-header">
          <div className="auth-logo-badge">
            <span className="auth-chef-icon">👩‍🍳</span>
          </div>
          <h3 className="auth-modal-title">
            {activeTab === 'login' ? 'Welcome Back!' : 'Join Foodie Circle'}
          </h3>
          <p className="auth-modal-subtitle">
            {activeTab === 'login'
              ? 'Sign in to access your saved recipes and culinary favorites.'
              : 'Create an account to save favorite dishes and share your culinary journey.'}
          </p>

          {/* Tab Switcher */}
          <div className="auth-tab-pill-group">
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('register')}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {formError && (
          <div className="auth-error-banner">
            <span className="error-icon">⚠️</span>
            <span>{formError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="auth-modal-form" noValidate autoComplete="off">
          {activeTab === 'register' && (
            <div className="auth-field-group">
              <label className="auth-label">Full Name *</label>
              <input
                type="text"
                className={`auth-input ${fieldErrors.name ? 'input-error' : ''}`}
                placeholder="Enter your name"
                value={name}
                autoComplete="off"
                onChange={(e) => {
                  setName(e.target.value)
                  clearFieldError('name')
                }}
              />
              {fieldErrors.name && (
                <span className="auth-field-error-text">{fieldErrors.name}</span>
              )}
            </div>
          )}

          <div className="auth-field-group">
            <label className="auth-label">Email Address *</label>
            <input
              type="email"
              className={`auth-input ${fieldErrors.email ? 'input-error' : ''}`}
              placeholder="example@gmail.com"
              value={email}
              autoComplete="off"
              onChange={(e) => {
                setEmail(e.target.value)
                clearFieldError('email')
              }}
            />
            {fieldErrors.email && (
              <span className="auth-field-error-text">{fieldErrors.email}</span>
            )}
          </div>

          <div className="auth-field-group">
            <label className="auth-label">Password *</label>
            <input
              type="password"
              className={`auth-input ${fieldErrors.password ? 'input-error' : ''}`}
              placeholder="Enter your password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => {
                setPassword(e.target.value)
                clearFieldError('password')
              }}
            />
            {fieldErrors.password && (
              <span className="auth-field-error-text">{fieldErrors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={submitting}
          >
            {submitting ? (
              <span className="auth-btn-spinner" />
            ) : activeTab === 'login' ? (
              'Sign In to Foodie Hub'
            ) : (
              'Create My Free Account'
            )}
          </button>
        </form>

        <div className="auth-modal-footer">
          {activeTab === 'login' ? (
            <p className="auth-switch-text">
              Don't have an account yet?{' '}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => handleTabSwitch('register')}
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p className="auth-switch-text">
              Already have an account?{' '}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => handleTabSwitch('login')}
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
