"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import InterventionDrawer from "./InterventionDrawer";
import FiltersBar from "./FiltersBar";

type Filters = {
  type: string;
  technicien: string;
};

type Event = {
  id: string;
  title: string;
  start: string;
  backgroundColor?: string;
  type: string;
  technicien_id: string;
};

export default function CalendrierWrapper() {
  const [rawEvents, setRawEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    type: "",
    technicien: "",
  });

  useEffect(() => {
    const loadEvents = async () => {
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
        console.error("Erreur chargement interventions :", error);
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
        type: item.type,
        technicien_id: item.technicien_id,
      }));

      setRawEvents(mapped);
    };

    loadEvents();
  }, []);

  useEffect(() => {
    const filtered = rawEvents.filter((item) => {
      const matchType = filters.type === "" || item.type === filters.type;
      const matchTechnicien = filters.technicien === "" || item.technicien_id === filters.technicien;
      return matchType && matchTechnicien;
    });

    setFilteredEvents(filtered);
  }, [rawEvents, filters]);

  const handleDateChange = async (info: any) => {
    const { event } = info;
    await supabase
      .from("interventions")
      .update({ date: event.startStr })
      .eq("id", event.id);
  };

  return (
    <>
      <FiltersBar filters={filters} setFilters={setFilters} />

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={filteredEvents}
        height="auto"
        editable={true}
        eventDrop={handleDateChange}
        eventClick={(info) => setSelectedId(info.event.id)}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
      />

      {selectedId && (
        <InterventionDrawer
          selectedId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}
