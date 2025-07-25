'use client'

import { useEffect, useState } from 'react'
import { addDays, format, startOfWeek } from 'date-fns'
import clsx from 'clsx'
import { useInterventions } from './useInterventions'

const joursFrancais = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
const tranches = ['matin', 'après-midi']
const heuresAffichage = ['08:00', '14:00']

export default function CalendrierAdminPro() {
  const [jours, setJours] = useState<string[]>([])
  const [dates, setDates] = useState<Date[]>([])
  const { events } = useInterventions()
  const interventions = events ?? []

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
      .filter((i) => i.date === dateStr && i.tranche_horaire === tranche)
      .slice(0, 4)
  }

  return (
    <div className="w-full overflow-auto rounded-xl border shadow-sm bg-white">
      <div className="grid grid-cols-[100px_repeat(7,1fr)] min-w-[1000px]">
        {/* Entête des jours */}
        <div className="bg-neutral-100 p-3 font-bold text-sm border-b border-r sticky left-0 top-0 z-20">Heures</div>
        {jours.map((jour, i) => (
          <div key={`jour-${i}`} className="bg-neutral-100 p-3 text-center font-semibold text-sm border-b border-r sticky top-0 z-10">
            {jour}
          </div>
        ))}

        {/* Grille */}
        {tranches.map((tranche, rowIndex) => (
          <div key={`row-${rowIndex}`} className="contents">
            <div className="p-2 text-sm font-medium text-right border-r border-b sticky left-0 z-10 bg-white">
              {heuresAffichage[rowIndex]}
            </div>
            {dates.map((date, colIndex) => {
              const items = findInterventions(date, tranche)
              return (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="h-[100px] border-b border-r relative group cursor-pointer transition-all duration-150 hover:bg-blue-50 p-1 space-y-1"
                >
                  {items.map((item, idx) => {
                    const statut = item.statut
                    const bg =
                      statut === 'terminée'
                        ? 'bg-green-500'
                        : statut === 'en attente'
                        ? 'bg-yellow-400'
                        : 'bg-red-500'

                    return (
                      <div
                        key={item.id + '-' + idx}
                        className={clsx(
                          bg,
                          "text-white text-xs rounded px-1 py-0.5 truncate"
                        )}
                        title={item.type}
                      >
                        {item.technicien_nom || '❓'} - {item.client_nom || '❓'}
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
  )
}
