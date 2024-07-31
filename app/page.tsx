import Link from 'next/link'
import { auth } from '@/auth'

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default async function Home() {
  const session = await auth()
 
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome to Coaching Call Scheduler</CardTitle>
          <CardDescription>Schedule and manage your coaching calls</CardDescription>
        </CardHeader>
        <CardContent>
          {session ? (
            <p className="text-center">Welcome, {session?.user?.name}!</p>
          ) : (
            <p className="text-center">Please sign in to continue</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {session ? (
            session?.user?.role === 'coach' ? (
              <Button asChild>
                <Link href="/coach/dashboard">Manage Availability</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/student/book">Book a Session</Link>
              </Button>
            )
          ) : (
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
