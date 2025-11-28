import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDistributionPlan, fetchReports, fetchVulnerability } from "./lib/api";
import { VulnerabilityCard } from "./components/VulnerabilityCard";
import { MapPlaceholder } from "./components/MapPlaceholder";
import { ReportList } from "./components/ReportList";
import { DistributionPanel } from "./components/DistributionPanel";

const regions = ["unity", "jonglei", "wai"];

function App() {
  const vulnerabilityQueries = regions.map((region) =>
    useQuery({
      queryKey: ["vulnerability", region],
      queryFn: () => fetchVulnerability(region),
    })
  );

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: fetchReports,
  });

  const { data: plan, isLoading: planLoading } = useQuery({
    queryKey: ["distribution-plan", regions],
    queryFn: () => fetchDistributionPlan(regions),
  });

  const hotspots = useMemo(
    () =>
      vulnerabilityQueries.map((query, index) => ({
        name: regions[index],
        score: query.data?.risk_score ?? 0,
      })),
    [vulnerabilityQueries]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white py-8 shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-600">AI for Zero Hunger</p>
            <h1 className="text-3xl font-bold text-slate-900">
              Humanitarian Food Assistance Targeting Platform
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Real-time vulnerability modeling, community intelligence, and automated logistics insights to ensure the
              right aid reaches the right community at the right time.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["SDG 1", "SDG 2", "SDG 3", "SDG 13", "SDG 16"].map((sdg) => (
              <span key={sdg} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {sdg}
              </span>
            ))}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <section>
          <div className="grid gap-5 md:grid-cols-3">
            {vulnerabilityQueries.map((query, index) => (
              <VulnerabilityCard
                key={regions[index]}
                region={regions[index]}
                score={query.data}
                isLoading={query.isLoading}
              />
            ))}
          </div>
        </section>

        <section>
          <MapPlaceholder riskHotspots={hotspots} />
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Community Signals</h2>
              <span className="text-xs text-slate-500">{reports?.total ?? 0} reports</span>
            </div>
            <ReportList reports={reports?.items} isLoading={reportsLoading} />
          </div>
          <DistributionPanel plan={plan} isLoading={planLoading} />
        </section>
      </main>
    </div>
  );
}

export default App;

