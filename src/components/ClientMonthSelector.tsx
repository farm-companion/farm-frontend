'use client'

export default function ClientMonthSelector({ currentMonth }: { currentMonth: number }) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-sm font-medium text-gray-600">Currently viewing:</span>
      <span className="text-lg font-semibold text-gray-900">{months[currentMonth - 1]}</span>
    </div>
  )
}
