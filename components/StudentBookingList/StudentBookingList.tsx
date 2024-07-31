import { format } from 'date-fns'

type Booking = {
  id: string;
  startTime: Date;
  endTime: Date;
  coachName: string | null;
  coachPhone: string | null;
  satisfactionScore: number | null;
  notes: string | null;
}

export function StudentBookingsList({ bookings }: { bookings: Booking[] }) {
  const now = new Date(Date.now())

  const currentBookings = bookings.filter(booking => booking.startTime > now)
  const pastBookings = bookings.filter(booking => booking.startTime <= now)

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
        <div className="space-y-4">
          {currentBookings.map((booking) => (
            <div key={booking.id} className="bg-white shadow rounded-lg p-4">
              <p className="font-semibold">{format(new Date(booking.startTime), 'MMMM d, yyyy')}</p>
              <p>{format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}</p>
              <p>Coach: {booking.coachName}</p>
              <p>Coach&rsquo;s Phone: {booking.coachPhone}</p>
            </div>
          ))}
        </div>
      </section>
      {pastBookings.length > 0 && (<section>
        <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
        <div className="space-y-4">
          {pastBookings.map((booking) => (
            <div key={booking.id} className="bg-white shadow rounded-lg p-4">
              <p className="font-semibold">{format(new Date(booking.startTime), 'MMMM d, yyyy')}</p>
              <p>{format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}</p>
              <p>Coach: {booking.coachName}</p>
              <p>Satisfaction Score: {booking.satisfactionScore || 'Not recorded'}</p>
              <p>Notes: {booking.notes || 'No notes'}</p>
            </div>
          ))}
        </div>
      </section>)}
    </div>
  )
}
