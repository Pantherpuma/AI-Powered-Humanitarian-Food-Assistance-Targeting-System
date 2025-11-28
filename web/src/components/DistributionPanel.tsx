import type { DistributionRecommendation } from "../types";

interface Props {
  plan?: DistributionRecommendation;
  isLoading?: boolean;
}

export function DistributionPanel({ plan, isLoading }: Props) {
  if (isLoading) {
    return <p className="text-sm text-slate-600">Generating distribution blueprint…</p>;
  }

  if (!plan) {
    return <p className="text-sm text-slate-600">No recommendation yet.</p>;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Automated Route Plan</h3>
        <p className="text-xs uppercase text-slate-500">{new Date(plan.generated_at).toLocaleString()}</p>
      </div>
      <p className="mt-2 text-sm text-slate-600">{plan.methodology}</p>
      <div className="mt-4 space-y-4">
        {plan.plans.map((p) => (
          <div key={p.region_id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-slate-900">{p.region_id.toUpperCase()}</p>
              <p className="text-sm text-slate-600">{p.households_targeted.toLocaleString()} households</p>
            </div>
            <p className="text-sm text-slate-600">
              Food required: <span className="font-semibold">{p.tonnage_required_mt} MT</span>
            </p>
            <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">Route</p>
            <ol className="mt-1 flex flex-wrap gap-2 text-xs text-slate-700">
              {p.recommended_route.map((node, index) => (
                <li key={node} className="flex items-center gap-1">
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">{node}</span>
                  {index < p.recommended_route.length - 1 && <span>→</span>}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}

