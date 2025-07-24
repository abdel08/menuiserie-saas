"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

type Filters = {
  type: string;
  technicien: string;
};

export function useInterventions() {
  const [filters, setFilters] = useState<Filters>({
    type: "",
    technicien: "",
  });

  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("interventions")
        .select(`
          id,
          type,
          date,
          tranche_horaire,
          statut,
          technicien_id,
          client:client_id ( nom ),
          technicien:technicien_id ( username )
        `);

      if (error) {
        console.error("Erreur chargement interventions:", error);
        return;
      }

      const mapped = data.map((item: any) => ({
        id: item.id,
        title: `${item.type} - ${item.technicien?.[0]?.username || "?"} → ${item.client?.[0]?.nom || "?"}`,
        start: item.date,
        backgroundColor:
          item.statut === "terminée"
            ? "#22c55e"
            : item.statut === "en attente"
            ? "#facc15"
            : "#ef4444",
        fullData: item,
        type: item.type,
        technicien_id: item.technicien_id,
      }));

      setEvents(mapped);
    };

    fetch();
  }, []);

  const filteredEvents = events.filter((item) => {
    const matchType = filters.type === "" || item.type === filters.type;
    const matchTechnicien = filters.technicien === "" || item.technicien_id === filters.technicien;
    return matchType && matchTechnicien;
  });

  return { events: filteredEvents, filters, setFilters };
}
