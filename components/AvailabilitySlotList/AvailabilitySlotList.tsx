import { getAvailabilitySlots } from '@/lib/actions/availabilitySlots'
import { format } from 'date-fns'

export async function AvailabilitySlotList({ coachId }: { coachId: string }) {
  const slots = await getAvailabilitySlots(coachId)

  return (
    <div className="space-y-4">
      {slots.map((slot) => (
        <div key={slot.id} className="bg-white shadow rounded-lg p-4">
        <p className="font-semibold">{format(new Date(slot.startTime), 'MMMM d, yyyy')}</p>
        <p>{format(new Date(slot.startTime), 'h:mm a')} - {format(new Date(slot.endTime), 'h:mm a')}</p>
        {slot.isBooked ? (
          <>
            <p className="text-red-500">Booked</p>
            <p>Student: {slot.studentName}</p>
            <p>Student&rsquo;s Phone: {slot.studentPhone}</p>
          </>
        ) : (
          <p className="text-green-500">Available</p>
        )}
      </div>
      ))}
    </div>
  )
}
