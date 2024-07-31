'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signInUser, signInGitHub, signInGoogle } from '@/lib/auth/authHelpers'

export default function SignIn() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const result = await signInUser(username, password)
      if (result.error) {
        setError('Invalid credentials')
      } else {
        router.push('/') // Redirect to home page after successful sign in
      }
    } catch (error) {
      setError('An unexpected error occurred')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            {error && (
              <p className="text-red-500 mt-2">{error}</p>
            )}
            <CardFooter className="flex flex-col space-y-2 mt-4">
              <Button className="w-full" type="submit">Sign in with Credentials</Button>
            </CardFooter>
          </form>
          <div className="text-center mt-4">
            <Link href="/register" className="text-blue-500 hover:underline">
              Don&rsquo;t have an account? Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
