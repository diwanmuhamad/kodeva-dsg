"use client";

import { useEffect, useState } from "react";

import type { DataLayerEvent } from "@/lib/datalayer";

export function EventLog() {
  const [events, setEvents] = useState<DataLayerEvent[]>([]);

  useEffect(() => {
    const onEvent = (event: Event) => {
      const detail = (event as CustomEvent<DataLayerEvent>).detail;
      setEvents((items) => [detail, ...items].slice(0, 8));
    };
    window.addEventListener("kodeva:datalayer", onEvent);
    return () => window.removeEventListener("kodeva:datalayer", onEvent);
  }, []);

  return (
    <details className="rounded-2xl border border-line bg-card p-4">
      <summary className="min-h-11 cursor-pointer font-semibold">Bukti event dataLayer</summary>
      {events.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Belum ada event. Event hanya terkirim saat ada aksi, bukan saat halaman digambar ulang.</p>
      ) : (
        <ol className="mt-3 grid gap-3" aria-live="polite">
          {events.map((event, index) => (
            <li key={`${event.event}-${index}`}>
              <p className="text-sm font-semibold">{event.event}</p>
              <pre className="mt-1 overflow-x-auto text-xs leading-5 text-muted">{JSON.stringify(event, null, 2)}</pre>
            </li>
          ))}
        </ol>
      )}
    </details>
  );
}
