/**
 * Metalayer — Clerk Authentication Provider
 * Wraps the entire app with Clerk authentication
 */

import { ClerkProvider } from '@clerk/clerk-react'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk publishable key. Add VITE_CLERK_PUBLISHABLE_KEY to your .env.local file')
}

export default function AuthProvider({ children }) {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  )
}
