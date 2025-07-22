'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Entreprise = {
  id: string;
  nom: string;
};

export default function CreateUserPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
    role: 'technicien',
    entreprise_id: ''
  });

  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Charger la liste des entreprises depuis Supabase via /api/entreprises
  useEffect(() => {
    async function fetchEntreprises() {
      try {
        const res = await fetch('/api/entreprises');
        if (!res.ok) throw new Error('Erreur lors du chargement des entreprises');
        const data = await res.json();
        setEntreprises(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les entreprises.");
      }
    }

    fetchEntreprises();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/create-user', {
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
        setError(result.error || 'Erreur inconnue');
      }
    } catch (err: any) {
      setLoading(false);
      setError('❌ Échec de la requête : ' + err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">➕ Créer un utilisateur</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

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
