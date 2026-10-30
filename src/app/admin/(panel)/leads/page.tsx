import { readLeads } from "@/lib/cms/disk";
import { formatDateTime } from "@/lib/format";

export default async function LeadsPage() {
  const leads = await readLeads();

  return (
    <div>
      <h1 className="text-4xl">Leads</h1>
      <p className="mt-3 text-muted">Isian formulir di halaman promo, beserta parameter UTM jika pengunjung datang dari iklan.</p>
      {leads.length === 0 ? (
        <p className="mt-8">Belum ada lead.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-[1.75rem] border border-line">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-mist">
              <tr>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Kontak</th>
                <th className="px-4 py-3">Sumber</th>
                <th className="px-4 py-3">Kampanye</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-line">
                  <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(lead.createdAt)}</td>
                  <td className="px-4 py-3">{lead.name}</td>
                  <td className="px-4 py-3">{lead.contact}</td>
                  <td className="px-4 py-3">{lead.utm.utm_source ?? "-"}</td>
                  <td className="px-4 py-3">{lead.utm.utm_campaign ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
