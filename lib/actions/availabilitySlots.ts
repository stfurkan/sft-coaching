'use server'

import { db } from '@/db'
import { availabilitySlots, bookings, users } from '@/db/schema'
import { and, eq, or, gte, lte } from 'drizzle-orm'

export async function addAvailabilitySlot(coachId: string, startTime: string, endTime: string) {
  try {
    const startTimestamp = new Date(startTime)
    const endTimestamp = new Date(endTime)
    const now = new Date(Date.now())

    if (startTimestamp < now) {
      return { success: false, error: 'Cannot add availability slots in the past.' }
    }

    // Check for conflicting slots
    const conflictingSlots = await db.select()
      .from(availabilitySlots)
      .where(
        and(
          eq(availabilitySlots.coachId, coachId),
          or(
            and(
              gte(availabilitySlots.startTime, startTimestamp),
              lte(availabilitySlots.startTime, endTimestamp)
            ),
            and(
              gte(availabilitySlots.endTime, startTimestamp),
              lte(availabilitySlots.endTime, endTimestamp)
            )
          )
        )
      )

    if (conflictingSlots.length > 0) {
      return { success: false, error: 'This time slot conflicts with an existing slot.' }
    }

    // If no conflicts, add the new slot
    await db.insert(availabilitySlots).values({
      coachId,
      startTime: startTimestamp,
      endTime: endTimestamp,
      isBooked: false,
    })

    return { success: true }
  } catch (error) {
    console.error('Error creating availability slot:', error)
    return { success: false, error: 'Failed to create availability slot' }
  }
}

export async function getAvailabilitySlots(coachId: string) {
  const now = new Date(Date.now())
  const slots = await db.select({
    id: availabilitySlots.id,
    startTime: availabilitySlots.startTime,
    endTime: availabilitySlots.endTime,
    isBooked: availabilitySlots.isBooked,
    studentName: users.name,
    studentPhone: users.phoneNumber,
  })
    .from(availabilitySlots)
    .leftJoin(bookings, eq(availabilitySlots.id, bookings.slotId))
    .leftJoin(users, eq(bookings.studentId, users.id))
    .where(and(eq(availabilitySlots.coachId, coachId), gte(availabilitySlots.startTime, now)))
    .orderBy(availabilitySlots.startTime)

  return slots
}

export async function getAllAvailableSlots() {
  const now = new Date(Date.now())
  const slots = await db.select({
    id: availabilitySlots.id,
    startTime: availabilitySlots.startTime,
    endTime: availabilitySlots.endTime,
    coachId: availabilitySlots.coachId,
    coachName: users.name,
  })
    .from(availabilitySlots)
    .innerJoin(users, eq(availabilitySlots.coachId, users.id))
    .where(
      and(
        eq(availabilitySlots.isBooked, false),
        gte(availabilitySlots.startTime, now)
      )
    )
    .orderBy(availabilitySlots.startTime)

  return slots
}

export async function getCoachUpcomingSlots(coachId: string) {
  const now = new Date(Date.now())
  return await db.select().from(availabilitySlots)
    .where(and(eq(availabilitySlots.coachId, coachId), gte(availabilitySlots.startTime, now)))
    .orderBy(availabilitySlots.startTime)
}
