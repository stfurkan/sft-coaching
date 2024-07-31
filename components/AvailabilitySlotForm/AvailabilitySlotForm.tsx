'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addAvailabilitySlot } from '@/lib/actions/availabilitySlots'
import { toast } from "@/components/ui/use-toast"
import { format, addDays, startOfToday, isBefore, isToday } from 'date-fns'

export function AvailabilitySlotForm({ coachId }: { coachId: string }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select both date and time.",
        variant: "destructive",
      })
      return
    }

    const startTime = new Date(selectedDate)
    const [hours, minutes] = selectedTime.split(':')
    startTime.setHours(parseInt(hours), parseInt(minutes))
    
    if (isBefore(startTime, new Date())) {
      toast({
        title: "Error",
        description: "Cannot select a time in the past.",
        variant: "destructive",
      })
      return
    }

    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000) // Add 2 hours

    const result = await addAvailabilitySlot(coachId, startTime.toISOString(), endTime.toISOString())

    if (result.success) {
      toast({
        title: "Success",
        description: "Availability slot added successfully.",
      })
      setSelectedDate(undefined)
      setSelectedTime('')
      router.refresh()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add availability slot.",
        variant: "destructive",
      })
    }
  }

  const timeSlots = () => {
    const slots = []
    const now = new Date()
    const isSelectedDateToday = isToday(selectedDate || now)
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (!isSelectedDateToday || 
            (hour > currentHour || (hour === currentHour && minute > currentMinute))) {
          slots.push(format(new Date().setHours(hour, minute), 'HH:mm'))
        }
      }
    }
    return slots
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) => isBefore(date, startOfToday())}
          className="rounded-md border"
        />
      </div>
      <div>
        <Select onValueChange={setSelectedTime} value={selectedTime}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a time" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots().map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Add 2-Hour Slot</Button>
    </form>
  )
}
