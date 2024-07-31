import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getUserProfile } from '@/lib/actions/profile'
import { ProfileForm } from '@/components/ProfileForm/ProfileForm'

export default async function ProfilePage() {
  const session = await auth()

  if (!session) {
    redirect('/signin')
  }

  const userProfile = await getUserProfile(session.user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <ProfileForm userProfile={userProfile} />
    </div>
  )
}
