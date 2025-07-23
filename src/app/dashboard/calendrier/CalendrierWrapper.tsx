'use client'

import { useEffect, useState } from 'react'
import { Drawer } from '@/components/ui/drawer'
import { supabase } from '../../../../lib/supabase'

type Intervention = {
  id: string
  type: string
  date: string
  tranche_horaire: string
  client: { nom: string }
  technicien: { username: string }
  statut: string
}

type Props = {
  selectedId: string | null
  onClose: () => void
}

export default function InterventionDrawer({ selectedId, onClose }: Props) {
  const [intervention, setIntervention] = useState<Intervention | null>(null)

  useEffect(() => {
    if (!selectedId) return

    const fetchIntervention = async () => {
      const { data, error } = await supabase
        .from('interventions')
        .select(
          `
          id,
          type,
          date,
          tranche_horaire,
          statut,
          client:client_id ( nom ),
          technicien:technicien_id ( username )
        `
        )
        .eq('id', selectedId)
        .single()

      if (error) {
        console.error('Erreur chargement intervention :', error)
        return
      }

      setIntervention(data)
    }

    fetchIntervention()
  }, [selectedId])

  return (
    <Drawer open={!!selectedId} onClose={onClose}>
      <div className="p-4 space-y-3">
        {intervention ? (
          <>
            <h2 className="text-xl font-bold">
              {intervention.type === 'maintenance' ? '🧰 Maintenance' : '🛠 Dépannage'}
            </h2>
            <p>📅 {intervention.date} — {intervention.tranche_horaire}</p>
            <p>👤 Client : {intervention.client?.nom}</p>
            <p>🧑‍🔧 Technicien : {intervention.technicien?.username}</p>
            <p>📌 Statut : {intervention.statut}</p>
          </>
        ) : (
          <p className="text-sm text-gray-500">Chargement...</p>
        )}
      </div>
    </Drawer>
  )
}
