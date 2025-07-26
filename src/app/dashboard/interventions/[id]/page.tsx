'use client'

import { useParams } from 'next/navigation'
import { useInterventionById } from '@/app/dashboard/calendrier/useInterventionById'
import FicheIntervention from '@/app/dashboard/calendrier/FicheIntervention'

export default function PageIntervention() {
  const params = useParams()
  const id = params?.id as string

  const { intervention, isLoading, error } = useInterventionById(id)

  if (isLoading) return <div className="p-4">Chargement...</div>
  if (error) return <div className="p-4 text-red-500">Erreur : {error.message}</div>
  if (!intervention) return <div className="p-4 text-gray-500">Intervention introuvable</div>

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <FicheIntervention intervention={intervention} />
    </div>
  )
}
