import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getStudentBookings } from '@/lib/actions/bookings'
import { StudentBookingsList } from '@/components/StudentBookingList/StudentBookingList'

export default async function StudentBookingsPage() {
  const session = await auth()

  if (!session || session.user.role !== 'student') {
    redirect('/')
  }

  const bookings = await getStudentBookings(session.user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Bookings</h1>
      <StudentBookingsList bookings={bookings} />
    </div>
  )
}
