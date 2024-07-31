'use server'

import { db } from '@/db'
import { bookings } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function recordFeedback(sessionId: string, satisfactionScore: number, notes: string) {
  try {
    await db.update(bookings)
      .set({ satisfactionScore, notes })
      .where(eq(bookings.id, sessionId))

    revalidatePath('/coach/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error recording feedback:', error)
    return { success: false, error: 'Failed to record feedback' }
  }
}
