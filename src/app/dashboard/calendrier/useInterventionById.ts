import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'

type Intervention = {
  id: string
  statut: string
  clients: {
    nom: string
  }
  users: {
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
          clients (
            nom
          ),
          users (
            username
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        setError(error)
        setIntervention(null)
      } else {
        const cleanData = {
          ...data,
          clients: Array.isArray(data.clients) ? data.clients[0] : data.clients,
          users: Array.isArray(data.users) ? data.users[0] : data.users,
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
