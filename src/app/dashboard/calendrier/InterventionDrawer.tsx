'use client'

import { Drawer } from '../../../components/ui/drawer'
import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'

export default function InterventionDrawer({ selectedId, onClose }: { selectedId: string | null, onClose: () => void }) {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetch = async () => {
      if (!selectedId) return
      const { data } = await supabase
        .from('interventions')
        .select(`
          id, date, tranche_horaire, type,
          client:client_id(nom),
          technicien:technicien_id(username)
        `)
        .eq('id', selectedId)
        .single()
      setData(data)
    }

    fetch()
  }, [selectedId])

  if (!selectedId || !data) return null

  return (
    <Drawer open={true} onClose={onClose}>
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold">Intervention #{data.id}</h2>
        <p>🗓 {data.date} - {data.tranche_horaire}</p>
        <p>👷‍♂️ {data.technicien?.username}</p>
        <p>🏢 {data.client?.nom}</p>
        <p>🛠 Type : {data.type}</p>
      </div>
    </Drawer>
  )
}
