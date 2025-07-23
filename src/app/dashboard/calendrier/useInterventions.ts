import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useInterventions() {
  const [events, setEvents] = useState<any[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [filters, setFilters] = useState({ type: 'all', technicien: 'all' })

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: userRow } = await supabase
        .from('users')
        .select('entreprise_id')
        .eq('id', user.id)
        .single()

      const { data } = await supabase
        .from('interventions')
        .select(`
          id, date, tranche_horaire, type,
          client:client_id(nom),
          technicien:technicien_id(username)
        `)
        .eq('entreprise_id', userRow?.entreprise_id)

      const filtered = (data || []).filter((i) =>
        (filters.type === 'all' || i.type === filters.type) &&
        (filters.technicien === 'all' || i.technicien?.username === filters.technicien)
      )

      const mapped = filtered.map((i: any) => ({
        id: i.id,
        title: `${i.type === 'maintenance' ? '🧰' : '🛠'} ${i.client?.nom || ''}`,
        start: `${i.date}T${i.tranche_horaire === 'apres-midi' ? '14:00:00' : '09:00:00'}`,
        backgroundColor: i.type === 'maintenance' ? '#facc15' : '#ef4444',
        borderColor: '#111827',
        textColor: '#fff'
      }))

      setEvents(mapped)
    }

    fetchData()
  }, [filters])

  return { events, selected, setSelected, filters, setFilters }
}
