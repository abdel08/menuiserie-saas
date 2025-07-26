"use client"

import { useEffect, useState } from 'react'
import { addDays, format, startOfWeek } from 'date-fns'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useInterventions } from './useInterventions'

const joursFrancais = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const tranches = ['matin', 'après-midi']
const heuresAffichage = ['08:00', '14:00']

export default function CalendrierAdminProV2() {
  const [jours, setJours] = useState<string[]>([])
  const [dates, setDates] = useState<Date[]>([])
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null)

  const { events } = useInterventions()
  const interventions = events ?? []

  const router = useRouter()

  useEffect(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 })
    const joursFormatted = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(start, i)
      return {
        label: `${joursFrancais[date.getDay() === 0 ? 6 : date.getDay() - 1]} ${format(date, 'dd/MM')}`,
        date,
      }
    })

    setJours(joursFormatted.map(j => j.label))
    setDates(joursFormatted.map(j => j.date))
  }, [])

  const findInterventions = (date: Date, tranche: string) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return interventions
      .filter((i) =>
        i.fullData?.date === dateStr &&
        i.fullData?.tranche_horaire === tranche &&
        (!selectedTechnician || i.fullData?.technicien?.username === selectedTechnician)
      )
      .slice(0, 4)
  }

  const allTechnicians = [
    ...new Set(
      interventions
        .map(i => i.fullData?.technicien?.username)
        .filter(Boolean)
    ),
  ] as string[]

  return (
    <div className="w-full overflow-auto rounded-xl border shadow bg-white">
      <div className="p-4 flex items-center gap-3 bg-gray-50 border-b justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Filtrer par technicien :</label>
          <select
            onChange={(e) => setSelectedTechnician(e.target.value || null)}
            className="border p-2 rounded text-sm"
            value={selectedTechnician || ''}
          >
            <option value="">Tous</option>
            {allTechnicians.map(tech => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>
          {selectedTechnician && (
            <button
              onClick={() => setSelectedTechnician(null)}
              className="text-sm text-blue-600 underline ml-2"
            >
              Réinitialiser
            </button>
          )}
        </div>
        <span className="text-xs text-gray-500">{interventions.length} interventions chargées</span>
      </div>

      <div className="flex">
        <div className="w-44 p-4 border-r bg-gray-50 sticky left-0 top-0 z-30">
          <h3 className="font-bold text-sm mb-2">Légende</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" /> Terminée
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full" /> En attente
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" /> Annulée
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[80px_repeat(7,1fr)] min-w-[1000px] w-full">
          <div className="bg-neutral-100 p-3 font-bold text-xs border-b border-r sticky top-0 z-20">Heure</div>
          {jours.map((jour, i) => (
            <div key={`jour-${i}`} className="bg-neutral-100 p-3 text-center text-sm font-semibold border-b border-r sticky top-0 z-10">
              {jour}
            </div>
          ))}

          {tranches.map((tranche, rowIndex) => (
            <div key={`row-${rowIndex}`} className="contents">
              <div className="p-2 text-xs text-right border-r border-b sticky left-0 z-10 bg-white">
                {heuresAffichage[rowIndex]}
              </div>
              {dates.map((date, colIndex) => {
                const items = findInterventions(date, tranche)
                return (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className="h-[100px] border-b border-r p-1 relative transition-all group hover:bg-blue-50"
                  >
                    {items.map((item, idx) => {
                      const statut = item.fullData?.statut
                      const bg =
                        statut === 'terminée'
                          ? 'bg-green-500'
                          : statut === 'en attente'
                          ? 'bg-yellow-400'
                          : 'bg-red-500'

                      return (
                        <div
                          key={item.id + '-' + idx}
                          onClick={() => router.push(`/interventions/${item.id}`)}
                          className={clsx(
                            bg,
                            'cursor-pointer text-white text-xs rounded-md px-2 py-1 truncate shadow-sm hover:scale-[1.02] transition-all duration-200'
                          )}
                          title={`${item.fullData?.client?.nom} - ${item.fullData?.technicien?.username}`}
                        >
                          <strong>{item.fullData?.client?.nom || '❓'}</strong> · {item.fullData?.technicien?.username || '❓'}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
