'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Button } from "@/components/ui/button"
import { bookSlot } from '@/lib/actions/bookings'
import { toast } from "@/components/ui/use-toast"

export type AvailabilitySlot = {
  id: string;
  startTime: Date;
  endTime: Date;
  coachId: string;
  coachName: string | null;
}

export function BookingList({ slots, studentId }: { slots: AvailabilitySlot[], studentId: string }) {
  const [bookingSlot, setBookingSlot] = useState<string | null>(null)

  const handleBooking = async (slotId: string) => {
    setBookingSlot(slotId)
    const result = await bookSlot(slotId, studentId)
    if (result.success) {
      toast({
        title: "Success",
        description: "Session booked successfully!",
      })
    } else {
      toast({
        title: "Error",
        description: result?.error || "Failed to book session.",
        variant: "destructive",
      })
    }
    setBookingSlot(null)
  }

  return (
    <div className="space-y-4">
      {slots.map((slot) => (
        <div key={slot.id} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="font-semibold">{format(new Date(slot.startTime), 'MMMM d, yyyy')}</p>
            <p>{format(new Date(slot.startTime), 'h:mm a')} - {format(new Date(slot.endTime), 'h:mm a')}</p>
            <p>Coach: {slot.coachName}</p>
          </div>
          <Button 
            onClick={() => handleBooking(slot.id)}
            disabled={bookingSlot === slot.id}
          >
            {bookingSlot === slot.id ? 'Booking...' : 'Book Session'}
          </Button>
        </div>
      ))}
    </div>
  )
}
