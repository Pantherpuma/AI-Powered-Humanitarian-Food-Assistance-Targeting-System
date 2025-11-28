interface Props {
  riskHotspots: { name: string; score: number }[];
}

export function MapPlaceholder({ riskHotspots }: Props) {
  return (
    <div className="h-80 w-full rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-slate-800">Geospatial Risk Layers</p>
        <span className="text-xs uppercase tracking-widest text-slate-500">Mapbox integration placeholder</span>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
        {riskHotspots.map((hotspot) => (
          <div key={hotspot.name} className="rounded-xl bg-white/80 p-4 shadow">
            <p className="text-xs uppercase tracking-wide text-slate-500">{hotspot.name}</p>
            <p className="text-2xl font-bold text-slate-900">{hotspot.score.toFixed(2)}</p>
            <p className="text-slate-600">Composite risk index</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-slate-600">
        The production build streams Mapbox vector tiles and overlays FEWS NET layers, flood footprints, and AI model
        outputs. For now this placeholder highlights how cards will bind to live data.
      </p>
    </div>
  );
}

