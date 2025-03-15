'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    description: '',
    category: 'personal'
  })
  const router = useRouter()

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.title || !formData.startDate || !formData.startTime) {
      alert('Please fill in at least the title, start date, and start time.')
      return
    }
    
    // Create start and end dates
    const start = new Date(`${formData.startDate}T${formData.startTime}`)
    
    let end
    if (formData.endDate && formData.endTime) {
      end = new Date(`${formData.endDate}T${formData.endTime}`)
    } else if (formData.endTime) {
      // If only end time is provided, use start date
      end = new Date(`${formData.startDate}T${formData.endTime}`)
    } else {
      // Default to 1 hour after start
      end = new Date(start)
      end.setHours(end.getHours() + 1)
    }
    
    // Validate that end is after start
    if (end <= start) {
      alert('End time must be after start time.')
      return
    }
    
    // Create event object
    const newEvent = {
      id: Date.now(),
      title: formData.title,
      start,
      end,
      location: formData.location,
      description: formData.description,
      category: formData.category
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
    
    events.push(newEvent)
    localStorage.setItem('calendar_events', JSON.stringify(events))
    
    // Navigate back to calendar
    router.push('/')
  }

  // Get today's date in YYYY-MM-DD format for default value
  const today = new Date().toISOString().split('T')[0]

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-3xl">
        <div className="flex items-center mb-6">
          <Link href="/" className="mr-4 text-blue-600 hover:text-blue-800">
            &larr; Back to Calendar
          </Link>
          <h1 className="text-3xl font-bold">Create New Event</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                Event Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="startDate">
                  Start Date*
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={today}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="startTime">
                  Start Time*
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="endDate">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || today}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="endTime">
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="location">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Category
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value="personal"
                    checked={formData.category === 'personal'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                    Personal
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value="work"
                    checked={formData.category === 'work'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                    Work
                  </span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Event
              </button>
              <Link
                href="/"
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
