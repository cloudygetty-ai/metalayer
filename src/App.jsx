/**
 * Metalayer — App Entry Point with Authentication & Routing
 */

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

import AuthProvider from '@/providers/AuthProvider'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AppShell from '@/components/shared/AppShell'

// Auth pages
import SignInPage from '@/pages/auth/SignIn'
import SignUpPage from '@/pages/auth/SignUp'

// App pages
import ToneEngine from '@/components/ToneEngine/ToneEngine'
import MemoryEngine from '@/components/MemoryEngine/MemoryEngine'
import PromptOptimizer from '@/components/PromptOptimizer/PromptOptimizer'
import ModelRouting from '@/components/ModelRouting/ModelRouting'

// Marketing pages
import LandingPage from '@/pages/marketing/Landing'
import PricingPage from '@/pages/marketing/Pricing'

// Styles
import '@/styles/globals.css'
import '@/styles/components.css'
import '@/components/shared/AppShell.css'
import '@/components/ToneEngine/ToneEngine.css'
import '@/components/MemoryEngine/MemoryEngine.css'
import '@/components/PromptOptimizer/PromptOptimizer.css'
import '@/components/ModelRouting/ModelRouting.css'
import '@/pages/auth/Auth.css'
import '@/components/auth/UserButton.css'

// Main app with authentication
function AuthenticatedApp() {
  const [activePage, setActivePage] = React.useState('tone')
  
  const PAGES = {
    tone:      ToneEngine,
    memory:    MemoryEngine,
    optimizer: PromptOptimizer,
    routing:   ModelRouting,
  }

  const Page = PAGES[activePage] || ToneEngine

  return (
    <AppShell activePage={activePage} onNavigate={setActivePage}>
      <Page key={activePage} />
    </AppShell>
  )
}

// Root component
function AppRoutes() {
  const { isSignedIn } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={isSignedIn ? <Navigate to="/app" replace /> : <LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      
      {/* Auth routes */}
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />

      {/* Protected app routes */}
      <Route 
        path="/app/*" 
        element={
          <ProtectedRoute>
            <AuthenticatedApp />
          </ProtectedRoute>
        } 
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
