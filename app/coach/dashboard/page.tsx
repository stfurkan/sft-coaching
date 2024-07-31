import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AvailabilitySlotForm } from '@/components/AvailabilitySlotForm/AvailabilitySlotForm'
import { AvailabilitySlotList } from '@/components/AvailabilitySlotList/AvailabilitySlotList'
import { getCoachPastSessions } from '@/lib/actions/bookings'
import { PastSessionsList } from '@/components/PastSessionsList/PastSessionsList'

export default async function CoachDashboard() {
  const session = await auth()

  if (!session || session.user.role !== 'coach') {
    redirect('/')
  }

  const pastSessions = await getCoachPastSessions(session.user.id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Coach Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add Availability Slot</h2>
          <AvailabilitySlotForm coachId={session.user.id} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
          <AvailabilitySlotList coachId={session.user.id} />
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold">Past Sessions</h2>
        <PastSessionsList sessions={pastSessions} />
      </section>
    </div>
  )
}
