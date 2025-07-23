'use client'

export default function FiltersBar({ filters, setFilters }: any) {
  return (
    <div className="flex gap-4 mb-4">
      <select
        className="border rounded p-2"
        value={filters.type}
        onChange={(e) => setFilters((f: any) => ({ ...f, type: e.target.value }))}
      >
        <option value="all">Tous types</option>
        <option value="maintenance">Maintenance</option>
        <option value="depannage">Dépannage</option>
      </select>

      <select
        className="border rounded p-2"
        value={filters.technicien}
        onChange={(e) => setFilters((f: any) => ({ ...f, technicien: e.target.value }))}
      >
        <option value="all">Tous techniciens</option>
        {/* Tu peux dynamiquement lister ici depuis ton Supabase */}
        <option value="rachid">Rachid</option>
        <option value="youssef">Youssef</option>
      </select>
    </div>
  )
}
