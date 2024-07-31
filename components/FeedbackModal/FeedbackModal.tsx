'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { recordFeedback } from '@/lib/actions/feedback'
import { toast } from "@/components/ui/use-toast"

export function FeedbackModal({ sessionId }: { sessionId: string }) {
  const [satisfactionScore, setSatisfactionScore] = useState<number>(0)
  const [notes, setNotes] = useState('')

  const handleSubmit = async () => {
    const result = await recordFeedback(sessionId, satisfactionScore, notes)
    if (result.success) {
      toast({ title: "Success", description: "Feedback recorded successfully." })
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Provide Feedback</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session Feedback</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label>Satisfaction Score (1-5)</label>
            <Input 
              type="number" 
              min="1" 
              max="5" 
              value={satisfactionScore} 
              onChange={(e) => setSatisfactionScore(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Notes</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button onClick={handleSubmit}>Submit Feedback</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
