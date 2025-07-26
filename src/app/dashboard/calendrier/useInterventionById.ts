// useInterventionById.ts
import { useState, useEffect } from 'react'
import { supabase } from '../../../../lib/supabase'

export const useInterventionById = (id: string) => {
  const [intervention, setIntervention] = useState(null)

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      const { data } = await supabase
        .from('interventions')
        .select('*, client:clients(*), technicien:users(*)')
        .eq('id', id)
        .single()
      setIntervention(data)
    }
    fetchData()
  }, [id])

  return { intervention }
}   