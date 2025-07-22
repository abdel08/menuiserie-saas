'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

type Intervention = {
  id: string;
  type: 'maintenance' | 'depannage';
  date: string;
  tranche_horaire: 'matin' | 'apres-midi';
  statut: string;
  client: {
    nom: string;
    adresse: string;
  };
  technicien: {
    username: string;
  };
};

export default function DashboardPage() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [today] = useState(new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

useEffect(() => {
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('interventions')
      .select('id, type, date, tranche_horaire, statut, client(nom, adresse), technicien(username)')
      .eq('date', new Date().toISOString().split('T')[0])
      .order('tranche_horaire', { ascending: true });

    if (error) {
      console.error(error);
    } else {
      // ⚠️ Correction ici : on extrait l’objet unique des tableaux
      const fixedData = (data || []).map((item) => ({
        ...item,
        client: Array.isArray(item.client) ? item.client[0] : item.client,
        technicien: Array.isArray(item.technicien) ? item.technicien[0] : item.technicien,
      }));

      setInterventions(fixedData as Intervention[]);
    }
  };

  fetchData();
}, []);

  const maintenanceCount = interventions.filter(i => i.type === 'maintenance').length;
  const depannageCount = interventions.filter(i => i.type === 'depannage').length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">👋 Bonjour, Admin</h1>
      <p className="text-gray-600 mb-4">📅 {today}</p>

      <div className="bg-gray-100 p-4 rounded-lg shadow mb-6">
        <p className="text-lg font-semibold">📊 Aujourd’hui :</p>
        <ul className="list-disc list-inside mt-2 text-sm">
          <li>{interventions.length} intervention(s) planifiée(s)</li>
          <li>{maintenanceCount} maintenance • {depannageCount} dépannage</li>
        </ul>
        <Link href="/dashboard/interventions/new">
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Nouvelle intervention
          </button>
        </Link>
      </div>

      <h2 className="text-xl font-semibold mb-3">📋 Interventions du jour</h2>
      {interventions.map((i) => (
        <div key={i.id} className="bg-white shadow rounded p-4 mb-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">
                {i.type === 'maintenance' ? '🧰 Maintenance' : '🛠 Dépannage'} — {i.client.nom}
              </h3>
              <p className="text-sm text-gray-600">
                {i.tranche_horaire === 'matin' ? '🕘 Matin' : '🕑 Après-midi'} — {i.date} — {i.technicien?.username}
              </p>
              <p className="text-sm text-gray-500">📍 {i.client.adresse}</p>
              <p className="text-sm mt-1">
                Statut : <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">{i.statut}</span>
              </p>
            </div>
            <Link href={`/dashboard/interventions/${i.id}`}>
              <button className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1 rounded">
                📄 Voir
              </button>
            </Link>
          </div>
        </div>
      ))}

      {interventions.length === 0 && (
        <p className="text-gray-500 italic">Aucune intervention prévue aujourd’hui.</p>
      )}
    </div>
  );
}
