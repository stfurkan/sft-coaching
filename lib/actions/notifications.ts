'use server'

import { db } from '@/db'
import { notifications } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function getUnreadNotifications(userId: string) {
  return await db.select()
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
}

export async function markNotificationAsRead(notificationId: string) {
  await db.update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, notificationId))
}

export async function createNotification(userId: string, message: string) {
  await db.insert(notifications).values({
    userId,
    message,
    createdAt: new Date(Date.now()),
  })
}
