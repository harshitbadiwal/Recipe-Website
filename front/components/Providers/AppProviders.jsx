'use client'

import React from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import SearchModal from '@/components/Search/SearchModal'
import AuthModal from '@/components/Auth/AuthModal'

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      {children}
      <SearchModal />
      <AuthModal />
    </AuthProvider>
  )
}
