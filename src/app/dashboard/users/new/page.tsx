'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateUserPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
    role: 'technicien',
    entreprise_id: ''
  });

  const [entreprises, setEntreprises] = useState<{ id: string; nom: string }[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 🧠 Charger les entreprises depuis Supabase
  useEffect(() => {
    async function fetchEntreprises() {
      const res = await fetch('/api/entreprises');
      const data = await res.json();
      setEntreprises(data);
    }
    fetchEntreprises();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('https://tgcbrdpxovdcomcfsryd.functions.supabase.co/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const result = await res.json();
    setLoading(false);

    if (res.ok) {
      alert('✅ Utilisateur créé avec succès');
      router.push('/dashboard');
    } else {
      alert('❌ Erreur : ' + result.error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">➕ Créer un utilisateur</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Email</label>
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Mot de passe</label>
          <input
            required
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Nom d'utilisateur</label>
          <input
            required
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Rôle</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="technicien">Technicien</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label>Entreprise</label>
          <select
            name="entreprise_id"
            value={form.entreprise_id}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">-- Sélectionner --</option>
            {entreprises.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nom}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Création en cours...' : 'Créer'}
        </button>
      </form>
    </div>
  );
}
