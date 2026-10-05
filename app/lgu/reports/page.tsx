import PageHeader from "@/components/ugnay/PageHeader";
import { reports } from "@/lib/mock/reports";

export default function LguReportsPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Reports" }]}
        title="Reports"
        description="Generated documents."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((r) => (
          <article key={r.id} className="ugnay-card p-5">
            <span className="rounded-full bg-[#084989]/10 px-2.5 py-0.5 text-xs font-bold text-[#084989]">{r.type}</span>
            <h2 className="font-display mt-2 text-lg font-bold">{r.title}</h2>
            <p className="text-sm text-[#6b7280]">{r.period} · {r.pages} pages · {r.downloads.toLocaleString()} downloads · updated {r.updatedAt}</p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="ugnay-btn ugnay-btn-solid text-xs">Download PDF</button>
              <button type="button" className="ugnay-btn ugnay-btn-outline text-xs">Preview</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
