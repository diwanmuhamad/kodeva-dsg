import Link from "next/link";

import { secondaryButtonClass } from "@/components/styles";
import { getCms } from "@/lib/cms/content";
import { readLeads } from "@/lib/cms/disk";
import { sanityStudioUrl } from "@/lib/sanity/env";

export default async function AdminHomePage() {
  const [cms, leads] = await Promise.all([getCms(), readLeads()]);
  const published = cms.posts.filter((post) => post.status === "published").length;
  const drafts = cms.posts.length - published;

  return (
    <div>
      <h1 className="text-4xl">Ringkasan</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Panel ini hanya untuk melihat <strong>lead</strong> dari formulir landing. Teks, gambar, dan artikel diedit di{" "}
        <strong>Sanity Studio</strong> — bukan di sini.
      </p>
      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Artikel terbit (Sanity)" value={String(published)} />
        <Stat label="Draf (Sanity)" value={String(drafts)} />
        <Stat label="Lead masuk" value={String(leads.length)} />
      </dl>
      <div className="mt-8 flex flex-wrap gap-3">
        <a className={secondaryButtonClass} href={sanityStudioUrl} target="_blank" rel="noreferrer">
          Buka Sanity Studio
        </a>
        <Link className={secondaryButtonClass} href="/admin/leads">
          Lihat leads
        </Link>
      </div>
      <p className="mt-6 max-w-2xl text-sm text-muted">
        Demo: undang reviewer ke project <code>ao3rfvgu</code> (dataset production) untuk Sanity. Login panel leads:{" "}
        <code>marketing</code> / <code>PromoAkhirTahun2026</code>.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-line bg-card p-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-3xl">{value}</dd>
    </div>
  );
}
