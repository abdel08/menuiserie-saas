import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'
import { Event } from '../../../../types'

export function useInterventions() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selected, setSelected] = useState<Event | null>(null)
  const [filters, setFilters] = useState<{ type: string | null }>({ type: null })

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('interventions')
        .select(`
          id,
          date,
          tranche_horaire,
          type,
          client:client_id ( nom ),
          technicien:technicien_id ( username )
        `)

      if (error) {
        console.error('Erreur récupération interventions', error)
        setLoading(false)
        return
      }

      const formattedEvents: Event[] = (data || []).map((item: any) => ({
        id: item.id,
        title: `${item.type} - ${item.client?.[0]?.nom || 'Client ?'} (${item.technicien?.[0]?.username || 'Tech ?'})`,
        start: new Date(`${item.date}T${item.tranche_horaire === 'matin' ? '08:00:00' : '14:00:00'}`),
        end: new Date(`${item.date}T${item.tranche_horaire === 'matin' ? '12:00:00' : '18:00:00'}`),
        color: item.type === 'maintenance' ? '#10b981' : '#ef4444'
      }))

      setEvents(formattedEvents)
      setLoading(false)
    }

    fetchEvents()
  }, [])

  return { events, loading, selected, setSelected, filters, setFilters }
}
