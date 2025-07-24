'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'

type Filters = {
  type: string
  technicien: string
}

type Props = {
  filters: Filters
  setFilters: (callback: (prev: Filters) => Filters) => void
}

export default function FiltersBar({ filters, setFilters }: Props) {
  const [techniciens, setTechniciens] = useState<{ id: string; username: string }[]>([])

  useEffect(() => {
    const fetchTechniciens = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, username')
        .eq('role', 'technicien')

      if (error) {
        console.error('Erreur chargement techniciens:', error)
        return
      }

      setTechniciens(data)
    }

    fetchTechniciens()
  }, [])

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <select
        className="border rounded p-2"
        value={filters.type ?? ''}
        onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
      >
        <option value="">Tous types</option>
        <option value="maintenance">Maintenance</option>
        <option value="depannage">Dépannage</option>
      </select>

      <select
        className="border rounded p-2"
        value={filters.technicien ?? ''}
        onChange={(e) => setFilters((f) => ({ ...f, technicien: e.target.value }))}
      >
        <option value="">Tous techniciens</option>
        {techniciens.map((tech) => (
          <option key={tech.id} value={tech.id}>
            {tech.username}
          </option>
        ))}
      </select>
    </div>
  )
}
