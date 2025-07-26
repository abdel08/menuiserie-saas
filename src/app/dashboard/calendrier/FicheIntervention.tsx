import { StatutBadge } from '@/components/ui/StatutBadge'

type Intervention = {
  id: string
  statut: string
  client: { nom: string }
  technicien: { username: string }
}

export default function FicheIntervention({ intervention }: { intervention: Intervention }) {
  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="font-bold text-lg">Intervention {intervention.id}</h2>
      <p>Client : {intervention.client.nom}</p>
      <p>Technicien : {intervention.technicien.username}</p>
      <p><StatutBadge statut={intervention.statut} /></p>
    </div>
  )
}
