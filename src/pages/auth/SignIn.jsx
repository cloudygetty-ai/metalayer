/**
 * Metalayer — Sign In Page
 */

import { SignIn } from '@clerk/clerk-react'
import './Auth.css'

export default function SignInPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <h1 className="auth-brand-title">Metalayer</h1>
          <p className="auth-brand-sub">The Intelligence Layer</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: 'auth-clerk-box',
              card: 'auth-clerk-card',
            }
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
        />
        <p className="auth-footer-text">
          Don't have an account? <a href="/sign-up">Sign up</a>
        </p>
      </div>
    </div>
  )
}
