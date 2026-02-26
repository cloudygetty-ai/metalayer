/**
 * Metalayer — Protected Route Component
 * Redirects to sign-in if user is not authenticated
 */

import { useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div className="protected-route-loading">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />
  }

  // Render children if authenticated
  return children
}
