"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import InterventionDrawer from "./InterventionDrawer";

type Event = {
  id: string;
  title: string;
  start: string;
  backgroundColor?: string;
};

export default function CalendrierWrapper() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
            ? "#22c55e" // vert
            : item.statut === "en attente"
            ? "#facc15" // jaune
            : "#ef4444", // rouge
      }));

      setEvents(mapped);
    };

    loadEvents();
  }, []);

  const handleDateChange = async (info: any) => {
    const { event } = info;
    await supabase
      .from("interventions")
      .update({ date: event.startStr })
      .eq("id", event.id);
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
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
