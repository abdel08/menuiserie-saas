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
        date: item.date,
        tranche_horaire: item.tranche_horaire, // ex: "08:00-10:00"
        type: item.type,
        statut: item.statut,
        technicien_id: item.technicien_id,
        client_nom: item.client?.nom || '',
        technicien_nom: item.technicien?.username || '',
      }))

      setEvents(mapped)
    }

    fetch()
  }, [])

  const filteredEvents = events.filter((item) => {
    const matchType = filters.type === '' || item.type === filters.type
    const matchTech = filters.technicien === '' || item.technicien_id === filters.technicien
    return matchType && matchTech
  })

  return { events: filteredEvents, filters, setFilters }
}
