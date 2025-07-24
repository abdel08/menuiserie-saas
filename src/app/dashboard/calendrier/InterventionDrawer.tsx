"use client";

import { Drawer } from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function InterventionDrawer({
  selectedId,
  onClose,
}: {
  selectedId: string | null;
  onClose: () => void;
}) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      if (!selectedId) return;
      const { data, error } = await supabase
        .from("interventions")
        .select(`
          id,
          date,
          tranche_horaire,
          type,
          statut,
          remarque,
          client:client_id(nom),
          technicien:technicien_id(username)
        `)
        .eq("id", selectedId)
        .single();

      if (error) {
        console.error("Erreur fetch drawer:", error);
        return;
      }

      setData(data);
    };

    fetch();
  }, [selectedId]);

  if (!selectedId || !data) return null;

  return (
    <Drawer open={true} onClose={onClose}>
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          🔧 Intervention #{data.id}
        </h2>
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Type :</strong> {data.type}
          </p>
          <p>
            <strong>Date :</strong> 📅 {data.date}
          </p>
          <p>
            <strong>Tranche horaire :</strong> 🕒 {data.tranche_horaire}
          </p>
          <p>
            <strong>Client :</strong> 👤 {data.client?.[0]?.nom || "N/A"}
          </p>
          <p>
            <strong>Technicien :</strong> 🧑‍🔧 {data.technicien?.[0]?.username || "N/A"}
          </p>
          <p>
            <strong>Statut :</strong>{" "}
            {data.statut === "terminée"
              ? "✅ Terminée"
              : data.statut === "en attente"
              ? "🕗 En attente"
              : "❌ Autre"}
          </p>
          {data.remarque && (
            <p>
              <strong>Remarques :</strong> 📝 {data.remarque}
            </p>
          )}
        </div>
      </div>
    </Drawer>
  );
}
