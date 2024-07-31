import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getAllAvailableSlots } from '@/lib/actions/availabilitySlots'
import { BookingList } from '@/components/BookingList/BookingList'

export default async function StudentBookingPage() {
  const session = await auth()

  if (!session || session.user.role !== 'student') {
    redirect('/')
  }

  const availableSlots = await getAllAvailableSlots()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Book a Coaching Session</h1>
      <BookingList slots={availableSlots} studentId={session.user.id} />
    </div>
  )
}
