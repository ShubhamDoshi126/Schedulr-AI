import Link from 'next/link'
import { CalendarView } from '@/components/calendar/CalendarView'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Intelligent Calendar</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <CalendarView />
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
              <div className="flex flex-col gap-2">
                <Link 
                  href="/create-event" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
                >
                  Create Event
                </Link>
                <Link 
                  href="/nlp" 
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-center hover:bg-green-700 transition-colors"
                >
                  Add via Text
                </Link>
                <Link 
                  href="/ocr" 
                  className="bg-purple-600 text-white px-4 py-2 rounded-md text-center hover:bg-purple-700 transition-colors"
                >
                  Add from Image
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-3">Upcoming Events</h2>
              <div className="flex flex-col gap-2">
                <div className="border-l-4 border-blue-500 pl-2 py-1">
                  <p className="font-medium">Team Meeting</p>
                  <p className="text-sm text-gray-600">Today, 2:00 PM</p>
                </div>
                <div className="border-l-4 border-green-500 pl-2 py-1">
                  <p className="font-medium">Lunch with Alex</p>
                  <p className="text-sm text-gray-600">Tomorrow, 12:30 PM</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-2 py-1">
                  <p className="font-medium">Project Deadline</p>
                  <p className="text-sm text-gray-600">Mar 18, 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
