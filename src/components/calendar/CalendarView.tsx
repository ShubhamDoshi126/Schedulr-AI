'use client'

import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Set up the localizer for the calendar
const localizer = momentLocalizer(moment)

// Sample events data
const sampleEvents = [
  {
    id: 1,
    title: 'Team Meeting',
    start: new Date(2025, 2, 15, 14, 0), // March 15, 2025, 2:00 PM
    end: new Date(2025, 2, 15, 15, 30),  // March 15, 2025, 3:30 PM
    location: 'Conference Room A',
    category: 'work'
  },
  {
    id: 2,
    title: 'Lunch with Alex',
    start: new Date(2025, 2, 16, 12, 30), // March 16, 2025, 12:30 PM
    end: new Date(2025, 2, 16, 13, 30),   // March 16, 2025, 1:30 PM
    location: 'Cafe Downtown',
    category: 'personal'
  },
  {
    id: 3,
    title: 'Project Deadline',
    start: new Date(2025, 2, 18, 17, 0), // March 18, 2025, 5:00 PM
    end: new Date(2025, 2, 18, 17, 0),   // March 18, 2025, 5:00 PM
    location: '',
    category: 'work'
  }
]

export const CalendarView = () => {
  const [events, setEvents] = useState(sampleEvents)
  const [view, setView] = useState('month')
  const [date, setDate] = useState(new Date())

  // Load events from localStorage on component mount
  useEffect(() => {
    const storedEvents = localStorage.getItem('calendar_events')
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents)
        // Convert string dates back to Date objects
        const eventsWithDates = parsedEvents.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }))
        setEvents(eventsWithDates)
      } catch (error) {
        console.error('Error parsing stored events:', error)
      }
    }
  }, [])

  // Save events to localStorage when they change
  useEffect(() => {
    localStorage.setItem('calendar_events', JSON.stringify(events))
  }, [events])

  // Event style customization based on category
  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad' // default blue
    
    if (event.category === 'work') {
      backgroundColor = '#2196f3' // blue
    } else if (event.category === 'personal') {
      backgroundColor = '#4caf50' // green
    }
    
    const style = {
      backgroundColor,
      borderRadius: '4px',
      color: 'white',
      border: 'none',
      display: 'block'
    }
    
    return {
      style
    }
  }

  // Handle event selection
  const handleSelectEvent = (event) => {
    alert(`Event: ${event.title}\nTime: ${moment(event.start).format('MMMM D, YYYY h:mm A')} - ${moment(event.end).format('h:mm A')}\nLocation: ${event.location || 'Not specified'}`)
  }

  // Handle slot selection (clicking on a time slot)
  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt('New Event Title:')
    if (title) {
      const newEvent = {
        id: Date.now(),
        title,
        start,
        end,
        category: 'personal'
      }
      setEvents([...events, newEvent])
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 h-[600px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Calendar</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setView('month')} 
            className={`px-3 py-1 rounded ${view === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Month
          </button>
          <button 
            onClick={() => setView('week')} 
            className={`px-3 py-1 rounded ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Week
          </button>
          <button 
            onClick={() => setView('day')} 
            className={`px-3 py-1 rounded ${view === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Day
          </button>
          <button 
            onClick={() => setView('agenda')} 
            className={`px-3 py-1 rounded ${view === 'agenda' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Agenda
          </button>
        </div>
      </div>
      
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        popup
      />
    </div>
  )
}
