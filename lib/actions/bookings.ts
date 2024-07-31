'use server'

import { db } from '@/db'
import { availabilitySlots, bookings, users } from '@/db/schema'
import { eq, and, lt, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function bookSlot(slotId: string, studentId: string) {
  try {
    // Start a transaction
    return await db.transaction(async (tx) => {
      // Check if the slot is still available
      const slot = await db.query.availabilitySlots.findFirst({
        where: eq(availabilitySlots.id, slotId)
      })

      if (!slot || slot.isBooked) {
        throw new Error('This slot is no longer available.')
      }

      // Update the availability slot to mark it as booked
      await tx.update(availabilitySlots)
        .set({ isBooked: true })
        .where(eq(availabilitySlots.id, slotId))

      // Create a new booking
      await tx.insert(bookings).values({
        slotId,
        studentId,
        coachId: slot.coachId,
      })

      revalidatePath('/student/book')
      return { success: true, error: null }
    })
  } catch (error) {
    console.error('Error booking slot:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to book slot' }
  }
}

export async function getBookingDetails(bookingId: string) {
  return await db.select({
    id: bookings.id,
    startTime: availabilitySlots.startTime,
    endTime: availabilitySlots.endTime,
    studentName: users.name,
    studentPhone: users.phoneNumber,
    coachName: users.name,
    coachPhone: users.phoneNumber,
  })
    .from(bookings)
    .innerJoin(availabilitySlots, eq(bookings.slotId, availabilitySlots.id))
    .innerJoin(users, eq(bookings.studentId, users.id))
    .where(eq(bookings.id, bookingId))
}

export async function recordFeedback(bookingId: string, satisfactionScore: number, notes: string) {
  await db.update(bookings)
    .set({ satisfactionScore, notes })
    .where(eq(bookings.id, bookingId))
}

export async function getCoachPastSessions(coachId: string) {
  const now = new Date(Date.now())
  return await db.select({
    id: bookings.id,
    startTime: availabilitySlots.startTime,
    endTime: availabilitySlots.endTime,
    studentName: users.name,
    satisfactionScore: bookings.satisfactionScore,
    notes: bookings.notes,
  })
    .from(bookings)
    .innerJoin(availabilitySlots, eq(bookings.slotId, availabilitySlots.id))
    .innerJoin(users, eq(bookings.studentId, users.id))
    .where(and(eq(bookings.coachId, coachId), lt(availabilitySlots.endTime, now)))
    .orderBy(desc(availabilitySlots.startTime))
}

export async function getStudentBookings(studentId: string) {
  return await db.select({
    id: bookings.id,
    startTime: availabilitySlots.startTime,
    endTime: availabilitySlots.endTime,
    coachName: users.name,
    coachPhone: users.phoneNumber,
    satisfactionScore: bookings.satisfactionScore,
    notes: bookings.notes,
  })
    .from(bookings)
    .innerJoin(availabilitySlots, eq(bookings.slotId, availabilitySlots.id))
    .innerJoin(users, eq(bookings.coachId, users.id))
    .where(eq(bookings.studentId, studentId))
    .orderBy(availabilitySlots.startTime)
}
