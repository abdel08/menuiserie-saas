import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'

type Intervention = {
  id: string
  statut: string
  client: {
    nom: string
  }
  technicien: {
    username: string
  }
}

type UseInterventionResult = {
  intervention: Intervention | null
  isLoading: boolean
  error: Error | null
}

export function useInterventionById(id: string): UseInterventionResult {
  const [intervention, setIntervention] = useState<Intervention | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('interventions')
        .select(`
          id,
          statut,
          client (
            nom
          ),
          technicien (
            username
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        setError(error)
        setIntervention(null)
      } else {
        // ⚠️ Si jamais client ou technicien est un tableau (parfois supabase le fait)
        const cleanData = {
          ...data,
          client: Array.isArray(data.client) ? data.client[0] : data.client,
          technicien: Array.isArray(data.technicien) ? data.technicien[0] : data.technicien,
        }

        setIntervention(cleanData as Intervention)
        setError(null)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [id])

  return { intervention, isLoading, error }
}
