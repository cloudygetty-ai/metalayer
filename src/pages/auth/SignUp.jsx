/**
 * Metalayer — Sign Up Page
 */

import { SignUp } from '@clerk/clerk-react'
import './Auth.css'

export default function SignUpPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <h1 className="auth-brand-title">Metalayer</h1>
          <p className="auth-brand-sub">The Intelligence Layer</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              rootBox: 'auth-clerk-box',
              card: 'auth-clerk-card',
            }
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
        <p className="auth-footer-text">
          Already have an account? <a href="/sign-in">Sign in</a>
        </p>
      </div>
    </div>
  )
}
