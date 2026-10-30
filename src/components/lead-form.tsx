"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { fieldClass, primaryButtonClass } from "@/components/styles";
import type { LandingContent } from "@/lib/cms/schema";
import { parseLead } from "@/lib/validation";
import { readStoredUtm } from "@/lib/utm-client";

export function LeadForm({ lead }: { lead: LandingContent["lead"] }) {
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [savedContact, setSavedContact] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!startedAt.current) {
      startedAt.current = Date.now();
      setStatus("error");
      setMessage("Formulir baru saja siap. Kirim sekali lagi.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      contact: String(form.get("contact") ?? ""),
      website: String(form.get("fax") ?? ""),
      startedAt: startedAt.current,
      utm: readStoredUtm(),
    };
    const parsed = parseLead(payload);
    if (!parsed.ok && parsed.spam) {
      setStatus("success");
      setSavedContact(payload.contact);
      return;
    }
    if (!parsed.ok) {
      setStatus("error");
      setMessage(parsed.message);
      return;
    }

    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message ?? "Kiriman gagal. Coba lagi.");
        return;
      }
      setSavedContact(parsed.data.contact);
      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("Tidak terhubung ke server. Coba lagi.");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="rounded-3xl bg-forest px-5 py-6 text-white">
        Terima kasih. Data {savedContact} sudah masuk ke studio marketing.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-4" noValidate>
      <label className="grid gap-2 text-sm font-medium">
        Nama
        <input className={fieldClass} name="name" autoComplete="name" required maxLength={80} />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Email atau WhatsApp
        <input className={fieldClass} name="contact" autoComplete="on" required maxLength={80} />
      </label>
      <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
        <label>
          Website
          <input name="fax" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {status === "error" ? (
        <p role="alert" className="text-sm font-medium text-clay">
          {message}
        </p>
      ) : null}
      <button className={primaryButtonClass} type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Mengirim..." : lead.submitLabel}
      </button>
      <p className="text-sm text-muted">{lead.note}</p>
    </form>
  );
}
