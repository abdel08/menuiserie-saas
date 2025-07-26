'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'

export type Filters = {
  type: string
  technicien: string
}

export function useInterventions() {
  const [filters, setFilters] = useState<Filters>({ type: '', technicien: '' })
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('interventions')
        .select(`
          id,
          type,
          date,
          tranche_horaire,
          statut,
          technicien_id,
          client:client_id ( nom ),
          technicien:technicien_id ( username )
        `)

      if (error) {
        console.error('Erreur chargement interventions:', error)
        return
      }

      const mapped = data.map((item: any) => ({
        id: item.id,
        title: `${item.client?.nom ?? 'Client'} - ${item.technicien?.username ?? 'Tech'}`,
        fullData: {
          date: item.date,
          tranche_horaire: item.tranche_horaire,
          type: item.type,
          statut: item.statut,
          client: item.client,
          technicien: item.technicien,
        },
      }))

      setEvents(mapped)
    }

    fetch()
  }, [])

  const filteredEvents = events.filter((item) => {
    const matchType = filters.type === '' || item.fullData?.type === filters.type
    const matchTech = filters.technicien === '' || item.fullData?.technicien?.id === filters.technicien
    return matchType && matchTech
  })

  return { events: filteredEvents, filters, setFilters }
}
