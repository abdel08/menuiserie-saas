'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../../../lib/supabase'
import { useRouter } from 'next/navigation'
import { Wrench, Users, CalendarDays, Clock, StickyNote, UserPlus, ArrowRight, ArrowLeft } from 'lucide-react'

type Client = { id: string; nom: string }
type Technicien = { id: string; username: string; disponible?: boolean }

export default function CreateInterventionPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [techniciens, setTechniciens] = useState<Technicien[]>([])
  const [entrepriseId, setEntrepriseId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const [form, setForm] = useState({
    type: 'depannage',
    client_id: '',
    technicien_id: '',
    date: '',
    tranche_horaire: 'matin',
    remarque: ''
  })

  const router = useRouter()

  // 1. Récupère l'entreprise de l'utilisateur connecté
  useEffect(() => {
    const fetchEntreprise = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("users")
        .select("entreprise_id")
        .eq("id", user.id)
        .single()

      if (!error && data?.entreprise_id) {
        setEntrepriseId(data.entreprise_id)
      } else {
        alert("❌ Entreprise introuvable")
      }
    }

    fetchEntreprise()
  }, [])

  // 2. Récupère les clients de l'entreprise
  useEffect(() => {
    if (!entrepriseId) return
    const fetchClients = async () => {
      const { data } = await supabase
        .from('clients')
        .select('id, nom')
        .eq('entreprise_id', entrepriseId)

      setClients(data ?? [])
    }
    fetchClients()
  }, [entrepriseId])

  // 3. Récupère les techniciens + filtre indisponibles
  useEffect(() => {
    if (!form.date || !entrepriseId) return

    const fetchTechniciens = async () => {
      const { data: techData } = await supabase
        .from('users')
        .select('id, username')
        .eq('role', 'technicien')
        .eq('entreprise_id', entrepriseId)

      const { data: indispos } = await supabase
        .from('disponibilites')
        .select('technicien_id')
        .eq('date', form.date)
        .eq('disponible', false)

      const indispoSet = new Set(indispos?.map(d => d.technicien_id))
      const techWithStatus = techData?.map(t => ({
        ...t,
        disponible: !indispoSet.has(t.id)
      }))

      setTechniciens(techWithStatus ?? [])
    }

    fetchTechniciens()
  }, [form.date, entrepriseId])

  const handleChange = (e: React.ChangeEvent<any>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  try {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError

    const user = authData.user
    if (!user) throw new Error("Utilisateur non authentifié")

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("entreprise_id")
      .eq("id", user.id)
      .single()
    if (userError) throw userError

    const entrepriseId = userData?.entreprise_id
    if (!entrepriseId) throw new Error("Entreprise introuvable")

    const { error: insertError } = await supabase
      .from('interventions')
      .insert([{ ...form, entreprise_id: entrepriseId, created_by: user.id }])
      .select()
      .single()

    if (insertError) throw insertError

    await supabase.from('disponibilites').upsert({
      technicien_id: form.technicien_id,
      date: form.date,
      disponible: false
    }, { onConflict: 'technicien_id,date' })

    alert('✅ Intervention créée')
    router.push('/dashboard')
  } catch (error: any) {
    alert('❌ Erreur : ' + error.message)
  } finally {
    setLoading(false)
  }
}


  const nextStep = () => setStep(s => Math.min(s + 1, 3))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-white shadow-xl rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">➕ Nouvelle intervention</h1>

        <div className="flex items-center justify-between mb-6">
          {["Détails", "Planification", "Résumé"].map((label, i) => (
            <div key={i} className="flex-1 text-center">
              <div className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${step >= i + 1 ? 'bg-blue-600' : 'bg-gray-300'}`}>{i + 1}</div>
              <p className="text-sm text-gray-600 mt-2">{label}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {step === 1 && (
            <>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Wrench size={16} /> Type
                </label>
                <select name="type" value={form.type} onChange={handleChange} className="input">
                  <option value="depannage">🛠 Dépannage</option>
                  <option value="maintenance">🧰 Maintenance</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Users size={16} /> Client
                </label>
                <select name="client_id" value={form.client_id} onChange={handleChange} className="input" required>
                  <option value="">-- Choisir un client --</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <CalendarDays size={16} /> Date
                </label>
                <input type="date" name="date" value={form.date} onChange={handleChange} className="input" required />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Clock size={16} /> Tranche horaire
                </label>
                <select name="tranche_horaire" value={form.tranche_horaire} onChange={handleChange} className="input">
                  <option value="matin">🕘 Matin</option>
                  <option value="apres-midi">🕑 Après-midi</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <UserPlus size={16} /> Technicien
                </label>
                <select name="technicien_id" value={form.technicien_id} onChange={handleChange} className="input" required>
                  <option value="">-- Choisir un technicien --</option>
                  {techniciens.map((t) => (
                    <option key={t.id} value={t.id} disabled={!t.disponible}>
                      {t.username} {t.disponible ? '🟢' : '🔴 Indisponible'}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <StickyNote size={16} /> Remarque
                </label>
                <textarea name="remarque" value={form.remarque} onChange={handleChange} className="input h-24" />
              </div>
            </>
          )}

          <div className="md:col-span-2 flex justify-between items-center mt-4">
            {step > 1 && <button type="button" onClick={prevStep} className="text-sm text-gray-500 flex items-center gap-1"><ArrowLeft size={14} /> Précédent</button>}
            {step < 3 && <button type="button" onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition flex items-center gap-1">Suivant <ArrowRight size={14} /></button>}
            {step === 3 && <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition">✅ Enregistrer</button>}
          </div>
        </form>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 shadow-inner animate-fade-in">
        <h2 className="text-lg font-bold mb-4">📝 Résumé</h2>
        <ul className="text-sm text-gray-700 space-y-2">
          <li><b>Type :</b> {form.type}</li>
          <li><b>Client :</b> {clients.find(c => c.id === form.client_id)?.nom || '-'}</li>
          <li><b>Technicien :</b> {techniciens.find(t => t.id === form.technicien_id)?.username || '-'}</li>
          <li><b>Date :</b> {form.date || '-'}</li>
          <li><b>Tranche horaire :</b> {form.tranche_horaire}</li>
          <li><b>Remarque :</b> {form.remarque || '-'}</li>
        </ul>
      </div>
    </div>
  )
}
