'use server'

import { db } from '@/db'
import { bookings, availabilitySlots, users } from '@/db/schema'
import { eq, or } from 'drizzle-orm'

export async function getUserSessions(userId: string) {
  const sessions = await db
    .select({
      id: bookings.id,
      startTime: availabilitySlots.startTime,
      endTime: availabilitySlots.endTime,
      studentName: users.name,
      coachName: users.name,
      satisfactionScore: bookings.satisfactionScore,
      notes: bookings.notes,
    })
    .from(bookings)
    .innerJoin(availabilitySlots, eq(bookings.slotId, availabilitySlots.id))
    .innerJoin(users, eq(bookings.studentId, users.id))
    .where(or(eq(bookings.studentId, userId), eq(bookings.coachId, userId)))
    .orderBy(availabilitySlots.startTime)

  return sessions
}
