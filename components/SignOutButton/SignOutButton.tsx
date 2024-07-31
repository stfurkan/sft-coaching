'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { signOutUser } from '@/lib/auth/authHelpers'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setIsLoading(true)
    await signOutUser()
    router.push('/') // Redirect to home page after sign out
    router.refresh() // Refresh the current route
  }

  return (
    <Button variant="outline" onClick={handleSignOut} disabled={isLoading}>
      {isLoading ? 'Signing Out...' : 'Sign Out'}
    </Button>
  )
}
