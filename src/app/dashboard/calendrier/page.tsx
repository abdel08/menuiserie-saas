'use client'

import CalendrierWrapper from '..//components/dashboard/CalendrierWrapper'

export default function Page() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Calendrier</h1>
      <CalendrierWrapper /> {/* ✅ Pas de props à passer */}
    </div>
  )
}
