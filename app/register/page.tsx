'use client'

import { registerUser, RegisterState } from '@/lib/actions/register'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFormState } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const initialState: RegisterState = { errors: {}, message: '' }

export default function Register() {
  const [state, formAction] = useFormState(registerUser, initialState)
  const router = useRouter()

  useEffect(() => {
    if (state.message) {
      // Registration successful, redirect to sign-in page
      router.push('/signin')
    }
  }, [state.message, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                />
                {state.errors?.name && (
                  <p className="text-red-500 text-sm">{state.errors.name.join(', ')}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Choose a username"
                  required
                />
                {state.errors?.username && (
                  <p className="text-red-500 text-sm">{state.errors.username.join(', ')}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
                {state.errors?.email && (
                  <p className="text-red-500 text-sm">{state.errors.email.join(', ')}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Choose a password"
                  required
                />
                {state.errors?.password && (
                  <p className="text-red-500 text-sm">{state.errors.password.join(', ')}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="passwordConfirm">Confirm Password</Label>
                <Input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  placeholder="Confirm your password"
                  required
                />
                {state.errors?.passwordConfirm && (
                  <p className="text-red-500 text-sm">{state.errors.passwordConfirm.join(', ')}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue="student">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="coach">Coach</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {state.message && (
              <p className="text-green-500 mt-2">{state.message}</p>
            )}
            <CardFooter className="mt-4">
              <Button className="w-full" type="submit">Register</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
