'use client'

import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useInterventions } from './useInterventions'
import InterventionDrawer from './InterventionDrawer'
import FiltersBar from './FiltersBar'

type Intervention = {
  id: string
  type: string
  date: string
  tranche_horaire: string
  statut: string
  client: { nom: string }
  technicien: { username: string }
}

export default function CalendrierWrapper() {
  const { events, filters, setFilters } = useInterventions()
  const [selected, setSelected] = useState<Intervention | null>(null)

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
          const fullData = event.extendedProps.fullData
          setSelected(fullData)
        }}
      />

      <InterventionDrawer selectedId={selected?.id ?? null} onClose={() => setSelected(null)} />
    </div>
  )
}
