'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { useRouter } from 'next/navigation';

type Client = { id: string; nom: string };
type Technicien = { id: string; username: string };

export default function CreateInterventionPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [techniciens, setTechniciens] = useState<Technicien[]>([]);
  const [form, setForm] = useState({
    type: 'depannage',
    client_id: '',
    technicien_id: '',
    date: new Date().toISOString().split('T')[0],
    tranche_horaire: 'matin',
    remarque: ''
  });
  const router = useRouter();

  useEffect(() => {
    const fetchOptions = async () => {
      const { data: clientsData } = await supabase.from('clients').select('id, nom');
      const { data: techData } = await supabase
        .from('users')
        .select('id, username')
        .eq('role', 'technicien');

      if (clientsData) setClients(clientsData);
      if (techData) setTechniciens(techData);
    };

    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('interventions').insert([
      {
        type: form.type,
        client_id: form.client_id,
        technicien_id: form.technicien_id,
        date: form.date,
        tranche_horaire: form.tranche_horaire,
        remarque: form.remarque
      }
    ]);

    if (error) {
      alert('Erreur : ' + error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">➕ Nouvelle intervention</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Type</label>
          <select name="type" value={form.type} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="depannage">🛠 Dépannage</option>
            <option value="maintenance">🧰 Maintenance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Client</label>
          <select name="client_id" value={form.client_id} onChange={handleChange} required className="w-full border p-2 rounded">
            <option value="">-- Sélectionner un client --</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Technicien</label>
          <select name="technicien_id" value={form.technicien_id} onChange={handleChange} required className="w-full border p-2 rounded">
            <option value="">-- Sélectionner un technicien --</option>
            {techniciens.map((t) => (
              <option key={t.id} value={t.id}>{t.username}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Tranche horaire</label>
          <select name="tranche_horaire" value={form.tranche_horaire} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="matin">🕘 Matin</option>
            <option value="apres-midi">🕑 Après-midi</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Remarque (facultative)</label>
          <textarea name="remarque" value={form.remarque} onChange={handleChange} rows={3} className="w-full border p-2 rounded" />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Enregistrer
        </button>
      </form>
    </div>
  );
}
