'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { updateUserProfile } from '@/lib/actions/profile'

export function ProfileForm({ userProfile }: { userProfile: any }) {
  const [name, setName] = useState(userProfile.name)
  const [phoneNumber, setPhoneNumber] = useState(userProfile.phoneNumber || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await updateUserProfile(userProfile.id, { name, phoneNumber })
    if (result.success) {
      toast({ title: "Success", description: "Profile updated successfully." })
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Phone Number</label>
        <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      </div>
      <Button type="submit">Update Profile</Button>
    </form>
  )
}
