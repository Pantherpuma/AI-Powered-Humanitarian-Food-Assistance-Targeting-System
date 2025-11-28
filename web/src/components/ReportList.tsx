import type { CommunityReport } from "../types";

interface Props {
  reports?: CommunityReport[];
  isLoading?: boolean;
}

export function ReportList({ reports, isLoading }: Props) {
  if (isLoading) {
    return <div className="text-sm text-slate-600">Loading latest community intel…</div>;
  }

  if (!reports?.length) {
    return <div className="text-sm text-slate-600">No reports submitted yet.</div>;
  }

  return (
    <ul className="space-y-4">
      {reports.map((report) => (
        <li key={report.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">
              {report.county} · {report.incident_type}
            </p>
            <span className="text-xs uppercase text-slate-500">{new Date(report.created_at).toLocaleString()}</span>
          </div>
          <p className="mt-2 text-sm text-slate-700">{report.narrative}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
            <span>Reporter: {report.reporter_name}</span>
            <span>Households impacted: {report.households_impacted}</span>
            <span>Severity: {report.severity}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

