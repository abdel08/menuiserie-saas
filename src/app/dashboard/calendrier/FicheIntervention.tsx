import { StatutBadge } from '@/components/ui/StatutBadge'

type Intervention = {
  id: string
  statut: string
  clients: { nom: string } | null
  users: { username: string } | null
}

export default function FicheIntervention({ intervention }: { intervention: Intervention }) {
  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="font-bold text-lg">Intervention {intervention.id}</h2>
      <p>Client : {intervention.clients?.nom ?? 'Nom client inconnu'}</p>
      <p>Technicien : {intervention.users?.username ?? 'Technicien inconnu'}</p>
      <p><StatutBadge statut={intervention.statut} /></p>
    </div>
  )
}
