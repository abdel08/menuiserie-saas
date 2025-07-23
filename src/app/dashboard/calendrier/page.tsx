'use client'

import CalendrierWrapper from './CalendrierWrapper'

export default function PageCalendrier() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📅 Planning des interventions</h1>
      <CalendrierWrapper />
    </div>
  )
}
