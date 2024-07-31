import Link from 'next/link'
import { auth } from '@/auth'
import { SignOutButton } from '../SignOutButton/SignOutButton'
import { NotificationBell } from '../NotificationBell/NotificationBell'

export async function Header() {
  const session = await auth()

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            SFT Coaching
          </Link>
        </div>
        <nav className="flex flex-row items-center space-x-4">
          <ul className="flex space-x-4">
            {session?.user.role === 'coach' && (
              <li><Link href="/coach/dashboard">Dashboard</Link></li>
            )}
            {session?.user.role === 'student' && (
              <li><Link href="/student/book">Book Session</Link></li>
            )}
            {session?.user.role === 'student' && (
              <li><Link href="/student/bookings">My Bookings</Link></li>
            )}
            {session && <li><Link href="/profile">Profile</Link></li>}
          </ul>
          {session ? (
            <SignOutButton />
          ) : (
            <Link href="/signin" className="text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
          )}
        </nav>
        {session && <NotificationBell userId={session.user.id} />}
      </div>
    </header>
  )
}
