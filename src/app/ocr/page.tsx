'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OCRPage() {
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [processing, setProcessing] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [extractedEvents, setExtractedEvents] = useState([])
  const fileInputRef = useRef(null)
  const router = useRouter()

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      setExtractedText('')
      setExtractedEvents([])
    }
  }

  // Trigger file input click
  const handleSelectImage = () => {
    fileInputRef.current.click()
  }

  // Process image with OCR
  const processImage = async () => {
    if (!image) return
    
    setProcessing(true)
    
    try {
      // In a real implementation, this would use Tesseract.js or call an API
      // For now, we'll simulate OCR processing with sample text
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate processing time
      
      // Sample extracted text based on image type
      const sampleText = `Conference Schedule
March 20, 2025
9:00 AM - Opening Remarks
10:30 AM - Keynote Speech
12:00 PM - Lunch Break
1:30 PM - Workshop Session
3:00 PM - Panel Discussion
5:00 PM - Networking Event
Location: Grand Conference Center`
      
      setExtractedText(sampleText)
      
      // Extract events from the text
      const events = extractEventsFromText(sampleText)
      setExtractedEvents(events)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Error processing your image. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  // Extract events from OCR text
  const extractEventsFromText = (text) => {
    const events = []
    const lines = text.split('\n')
    
    // Try to find a date in the text
    let eventDate = new Date()
    for (const line of lines) {
      const dateMatch = line.match(/(\w+)\s+(\d{1,2}),\s+(\d{4})/)
      if (dateMatch) {
        const [_, month, day, year] = dateMatch
        const monthIndex = getMonthIndex(month)
        if (monthIndex !== -1) {
          eventDate = new Date(parseInt(year), monthIndex, parseInt(day))
          break
        }
      }
    }
    
    // Look for time patterns (e.g., "9:00 AM - Opening Remarks")
    for (const line of lines) {
      const timeMatch = line.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(.+)/)
      if (timeMatch) {
        const [_, hour, minute, meridiem, title] = timeMatch
        
        // Parse start time
        let startHour = parseInt(hour)
        const startMinute = parseInt(minute)
        
        if (meridiem === 'PM' && startHour < 12) {
          startHour += 12
        } else if (meridiem === 'AM' && startHour === 12) {
          startHour = 0
        }
        
        // Create start date
        const start = new Date(eventDate)
        start.setHours(startHour, startMinute, 0, 0)
        
        // Create end date (default to 1 hour later)
        const end = new Date(start)
        end.setHours(end.getHours() + 1)
        
        // Extract location if present
        let location = ''
        const locationLine = lines.find(line => line.startsWith('Location:'))
        if (locationLine) {
          location = locationLine.replace('Location:', '').trim()
        }
        
        // Determine category
        const workKeywords = ['meeting', 'conference', 'presentation', 'keynote', 'workshop', 'panel']
        const isWork = workKeywords.some(keyword => title.toLowerCase().includes(keyword))
        const category = isWork ? 'work' : 'personal'
        
        // Add event
        events.push({
          id: Date.now() + events.length,
          title: title.trim(),
          start,
          end,
          location,
          category,
          selected: false
        })
      }
    }
    
    return events
  }

  // Helper function to get month index from name
  const getMonthIndex = (monthName) => {
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                   'july', 'august', 'september', 'october', 'november', 'december']
    return months.findIndex(m => monthName.toLowerCase().includes(m))
  }

  // Toggle event selection
  const toggleEventSelection = (id) => {
    setExtractedEvents(events => 
      events.map(event => 
        event.id === id ? { ...event, selected: !event.selected } : event
      )
    )
  }

  // Save selected events
  const saveSelectedEvents = () => {
    const selectedEvents = extractedEvents.filter(event => event.selected)
    if (selectedEvents.length === 0) {
      alert('Please select at least one event to add.')
      return
    }
    
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
    
    events.push(...selectedEvents)
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
          <h1 className="text-3xl font-bold">Add Events from Image</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <p className="mb-4">
            Upload an image of a schedule, ticket, or event flyer, and I'll extract the events.
          </p>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          
          <div className="flex flex-col items-center mb-4">
            {imageUrl ? (
              <div className="mb-4">
                <img 
                  src={imageUrl} 
                  alt="Selected" 
                  className="max-w-full max-h-64 rounded-md"
                />
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-md p-8 mb-4 text-center cursor-pointer hover:bg-gray-50"
                onClick={handleSelectImage}
              >
                <p className="text-gray-500">Click to select an image</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                onClick={handleSelectImage}
              >
                {imageUrl ? 'Change Image' : 'Select Image'}
              </button>
              
              {imageUrl && (
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
                  onClick={processImage}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : 'Extract Events'}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {extractedText && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">Extracted Text</h2>
            <pre className="bg-gray-100 p-3 rounded-md whitespace-pre-wrap text-sm">
              {extractedText}
            </pre>
          </div>
        )}
        
        {extractedEvents.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Detected Events</h2>
            <p className="mb-4 text-sm text-gray-600">
              Select the events you want to add to your calendar.
            </p>
            
            <div className="mb-6">
              {extractedEvents.map(event => (
                <div 
                  key={event.id}
                  className={`border p-3 rounded-md mb-3 cursor-pointer ${
                    event.selected ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                  onClick={() => toggleEventSelection(event.id)}
                >
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={event.selected}
                      onChange={() => toggleEventSelection(event.id)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(event.start)} - {formatDate(event.end).split(', ')[3]}
                      </p>
                      {event.location && (
                        <p className="text-sm text-gray-600">
                          Location: {event.location}
                        </p>
                      )}
                      <span className={`mt-1 inline-block px-2 py-1 rounded-full text-xs ${
                        event.category === 'work' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {event.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                onClick={saveSelectedEvents}
              >
                Add Selected Events
              </button>
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => {
                  setExtractedEvents([])
                  setExtractedText('')
                }}
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
