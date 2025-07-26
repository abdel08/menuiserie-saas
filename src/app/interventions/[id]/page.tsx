'use client'

import { useParams } from 'next/navigation'
import { useInterventionById } from '@/app/dashboard/calendrier/useInterventionById'
import FicheIntervention from '@/app/dashboard/calendrier/FicheIntervention'

export default function PageIntervention() {
  const params = useParams()
  const id = params?.id as string

  const { intervention, isLoading, error } = useInterventionById(id)

  if (isLoading) return <div>Chargement...</div>
  if (error) return <div>Erreur : {error.message}</div>
  if (!intervention) return <div>Intervention introuvable</div>

  return (
    <div className="p-4">
      <FicheIntervention intervention={intervention} />
    </div>
  )
}
