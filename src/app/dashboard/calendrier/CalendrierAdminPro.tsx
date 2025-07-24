'use client'

import { useEffect, useState } from 'react'
import { addDays, format, startOfWeek } from 'date-fns'
import clsx from 'clsx'

// 🗓️ Jours en français
const joursFrancais = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

// 🕐 Créneaux horaires
const heures = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
]

export default function PlanningSemaine() {
  const [jours, setJours] = useState<string[]>([])

  useEffect(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 })
    const joursFormatted = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(start, i)
      const jour = joursFrancais[date.getDay() === 0 ? 6 : date.getDay() - 1]
      const dateStr = format(date, 'dd/MM')
      return `${jour} ${dateStr}`
    })
    setJours(joursFormatted)
  }, [])

  return (
    <div className="w-full overflow-auto rounded-xl border shadow-sm bg-white">
      <div className="grid grid-cols-[100px_repeat(7,1fr)] min-w-[900px]">
        {/* Header des jours */}
        <div className="bg-neutral-100 p-3 font-bold text-sm border-b border-r sticky left-0 top-0 z-20">
          Heures
        </div>
        {jours.map((jour, i) => (
          <div
            key={`jour-${i}`}
            className="bg-neutral-100 p-3 text-center font-semibold text-sm border-b border-r sticky top-0 z-10"
          >
            {jour}
          </div>
        ))}

        {/* Grille horaires */}
        {heures.map((heure, rowIndex) => (
          <div key={`row-${rowIndex}`} className="contents">
            {/* Colonne heures (fixe à gauche) */}
            <div className="p-2 text-sm font-medium text-right border-r border-b sticky left-0 z-10 bg-white">
              {heure}
            </div>

            {/* Cellules horaires */}
            {jours.map((_, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={clsx(
                  "h-[60px] border-b border-r relative group cursor-pointer transition-all duration-150",
                  "hover:bg-blue-50"
                )}
              >
                {/* Future intervention */}
                {/* <div className="absolute inset-1 rounded bg-blue-100 text-xs p-1 overflow-hidden">RDV</div> */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
