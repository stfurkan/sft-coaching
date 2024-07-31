import { format } from 'date-fns'
import { FeedbackModal } from '../FeedbackModal/FeedbackModal'

export function PastSessionsList({ sessions }: { sessions: any[] }) {
  return (
    <ul className="space-y-2">
      {sessions.map((session) => (
        <li key={session.id} className="bg-white shadow rounded-lg p-4">
          <p>Date: {format(new Date(session.startTime), 'MMMM d, yyyy')}</p>
          <p>Time: {format(new Date(session.startTime), 'HH:mm')} - {format(new Date(session.endTime), 'HH:mm')}</p>
          <p>Student: {session.studentName}</p>
          <p>Satisfaction Score: {session.satisfactionScore || 'Not recorded'}</p>
          <p>Notes: {session.notes || 'No notes'}</p>
          {!session.notes && <FeedbackModal sessionId={session.id} />}
        </li>
      ))}
    </ul>
  )
}
