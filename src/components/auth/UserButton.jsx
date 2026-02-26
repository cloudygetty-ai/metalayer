/**
 * Metalayer — User Button Component
 * Displays user avatar with dropdown menu
 */

import { UserButton as ClerkUserButton, useUser } from '@clerk/clerk-react'
import './UserButton.css'

export default function UserButton() {
  const { user } = useUser()

  if (!user) return null

  return (
    <div className="user-button-wrapper">
      <ClerkUserButton 
        appearance={{
          elements: {
            avatarBox: 'user-button-avatar',
            userButtonPopoverCard: 'user-button-popover',
          }
        }}
        afterSignOutUrl="/sign-in"
      />
      <div className="user-button-info">
        <span className="user-button-name">{user.firstName || user.username}</span>
        <span className="user-button-email">{user.primaryEmailAddress?.emailAddress}</span>
      </div>
    </div>
  )
}
