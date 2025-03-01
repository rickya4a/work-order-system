'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error('Failed to sign out')
      }

      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  )
}