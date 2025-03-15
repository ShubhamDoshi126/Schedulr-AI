'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NLPPage() {
  const [input, setInput] = useState('')
  const [processing, setProcessing] = useState(false)
  const [extractedEvent, setExtractedEvent] = useState(null)
  const router = useRouter()

  // Process natural language input
  const processInput = async () => {
    if (!input.trim()) return
    
    setProcessing(true)
    
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate NLP processing with a simple implementation
      const event = simulateNLPProcessing(input)
      setExtractedEvent(event)
    } catch (error) {
      console.error('Error processing input:', error)
      alert('Error processing your input. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  // Simple NLP simulation
  const simulateNLPProcessing = (text) => {
    // Extract potential date
    let date = new Date()
    if (text.includes('tomorrow')) {
      date.setDate(date.getDate() + 1)
    } else if (text.includes('next week')) {
      date.setDate(date.getDate() + 7)
    } else if (text.match(/on\s+monday/i)) {
      date = getNextDayOfWeek(1) // 1 = Monday
    } else if (text.match(/on\s+tuesday/i)) {
      date = getNextDayOfWeek(2) // 2 = Tuesday
    } else if (text.match(/on\s+wednesday/i)) {
      date = getNextDayOfWeek(3) // 3 = Wednesday
    } else if (text.match(/on\s+thursday/i)) {
      date = getNextDayOfWeek(4) // 4 = Thursday
    } else if (text.match(/on\s+friday/i)) {
      date = getNextDayOfWeek(5) // 5 = Friday
    } else if (text.match(/on\s+saturday/i)) {
      date = getNextDayOfWeek(6) // 6 = Saturday
    } else if (text.match(/on\s+sunday/i)) {
      date = getNextDayOfWeek(0) // 0 = Sunday
    }
    
    // Extract time
    let startHour = 9 // Default to 9 AM
    let startMinute = 0
    let endHour = 10 // Default to 1 hour duration
    let endMinute = 0
    
    const timeMatch = text.match(/at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i)
    if (timeMatch) {
      startHour = parseInt(timeMatch[1])
      startMinute = timeMatch[2] ? parseInt(timeMatch[2]) : 0
      
      // Handle AM/PM
      const meridiem = timeMatch[3]?.toLowerCase()
      if (meridiem === 'pm' && startHour < 12) {
        startHour += 12
      } else if (meridiem === 'am' && startHour === 12) {
        startHour = 0
      }
      
      // Set end time to 1 hour later
      endHour = startHour + 1
      endMinute = startMinute
    }
    
    // Extract title (simple approach)
    let title = text
      .replace(/schedule|create|add|new|event|meeting|appointment/gi, '')
      .replace(/tomorrow|today|next week|on\s+\w+day/gi, '')
      .replace(/at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?/gi, '')
      .replace(/from\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?/gi, '')
      .replace(/to\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?/gi, '')
      .trim()
    
    // Capitalize first letter of each word
    title = title.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
    
    // If title is empty, use a default
    if (!title) {
      title = 'New Event'
    }
    
    // Determine category (work or personal)
    const workKeywords = ['meeting', 'conference', 'presentation', 'client', 'project', 'deadline', 'work', 'business', 'team']
    const isWork = workKeywords.some(keyword => text.toLowerCase().includes(keyword))
    const category = isWork ? 'work' : 'personal'
    
    // Create start and end dates
    const start = new Date(date)
    start.setHours(startHour, startMinute, 0, 0)
    
    const end = new Date(date)
    end.setHours(endHour, endMinute, 0, 0)
    
    return {
      id: Date.now(),
      title,
      start,
      end,
      category,
      location: extractLocation(text)
    }
  }

  // Helper function to get next occurrence of a day of week
  const getNextDayOfWeek = (dayOfWeek) => {
    const today = new Date()
    const result = new Date(today)
    result.setDate(today.getDate() + (dayOfWeek + 7 - today.getDay()) % 7)
    return result
  }

  // Extract location from text
  const extractLocation = (text) => {
    const locationMatch = text.match(/at\s+([^,\.]+)(?=,|\.|$)/i)
    if (locationMatch) {
      return locationMatch[1].trim()
    }
    return ''
  }

  // Save the extracted event
  const saveEvent = () => {
    if (!extractedEvent) return
    
    // Save to localStorage
    const storedEvents = localStorage.getItem('calendar_events')
    let events = []
    
    if (storedEvents) {
      try {
        events = JSON.parse(storedEvents)
      } catch (error) {
        console.error('Error parsing stored events:', error)
      }
    }
    
    events.push(extractedEvent)
    localStorage.setItem('calendar_events', JSON.stringify(events))
    
    // Navigate back to calendar
    router.push('/')
  }

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-3xl">
        <div className="flex items-center mb-6">
          <Link href="/" className="mr-4 text-blue-600 hover:text-blue-800">
            &larr; Back to Calendar
          </Link>
          <h1 className="text-3xl font-bold">Add Event via Text</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <p className="mb-4">
            Describe your event in natural language, and I'll extract the details.
            <br />
            <span className="text-sm text-gray-600">
              Examples: "Team meeting tomorrow at 3pm" or "Lunch with Alex on Friday at 12:30pm"
            </span>
          </p>
          
          <div className="mb-4">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Type your event details..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            onClick={processInput}
            disabled={!input.trim() || processing}
          >
            {processing ? 'Processing...' : 'Process Text'}
          </button>
        </div>
        
        {extractedEvent && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Extracted Event Details</h2>
            
            <div className="mb-6">
              <div className="mb-3">
                <span className="font-medium">Title:</span> {extractedEvent.title}
              </div>
              <div className="mb-3">
                <span className="font-medium">Start:</span> {formatDate(extractedEvent.start)}
              </div>
              <div className="mb-3">
                <span className="font-medium">End:</span> {formatDate(extractedEvent.end)}
              </div>
              {extractedEvent.location && (
                <div className="mb-3">
                  <span className="font-medium">Location:</span> {extractedEvent.location}
                </div>
              )}
              <div className="mb-3">
                <span className="font-medium">Category:</span>{' '}
                <span className={`px-2 py-1 rounded-full text-sm ${
                  extractedEvent.category === 'work' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {extractedEvent.category}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                onClick={saveEvent}
              >
                Save Event
              </button>
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => setExtractedEvent(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
