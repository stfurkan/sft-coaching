'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function getUserProfile(userId: string) {
  const user = await db.select().from(users).where(eq(users.id, userId)).get()
  return user
}

export async function updateUserProfile(userId: string, data: { name: string, phoneNumber: string }) {
  try {
    await db.update(users)
      .set({ name: data.name, phoneNumber: data.phoneNumber })
      .where(eq(users.id, userId))

    revalidatePath('/profile')
    return { success: true }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}
