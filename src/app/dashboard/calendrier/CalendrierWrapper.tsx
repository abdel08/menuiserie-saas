'use client'

import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useInterventions } from './useInterventions'
import InterventionDrawer from './InterventionDrawer'
import FiltersBar from './FiltersBar'

export default function CalendrierWrapper() {
  const { events, selected, setSelected, filters, setFilters } = useInterventions()

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <FiltersBar filters={filters} setFilters={setFilters} />

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        height="auto"
        events={events}
        eventClick={({ event }) => {
          setSelected(event.id)
        }}
      />

      <InterventionDrawer selectedId={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
