'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { getUnreadNotifications, markNotificationAsRead } from '@/lib/actions/notifications'
import { toast } from "@/components/ui/use-toast"

export function NotificationBell({ userId }: { userId: string }) {
  const [unreadNotifications, setUnreadNotifications] = useState<any[]>([])

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      const notifications = await getUnreadNotifications(userId)
      setUnreadNotifications(notifications)
    }
    fetchUnreadNotifications()
  }, [userId])

  const handleClick = async () => {
    unreadNotifications.forEach(notification => {
      toast({
        title: "Notification",
        description: notification.message,
      })
      markNotificationAsRead(notification.id)
    })
    setUnreadNotifications([])
  }

  return (
    <Button onClick={handleClick} variant="ghost">
      <Bell />
      {unreadNotifications.length > 0 && (
        <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
          {unreadNotifications.length}
        </span>
      )}
    </Button>
  )
}
