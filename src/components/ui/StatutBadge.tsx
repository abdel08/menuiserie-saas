// StatutBadge.tsx
export function StatutBadge({ statut }: { statut: string }) {
  const style =
    statut === 'terminée' ? 'bg-green-100 text-green-800' :
    statut === 'en attente' ? 'bg-yellow-100 text-yellow-800' :
    'bg-red-100 text-red-800'

  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style}`}>{statut}</span>
}