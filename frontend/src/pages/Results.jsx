import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { getHistory } from "../api";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const SEV = {
  Low:    { badge: "bg-emerald-50 border-emerald-200 text-emerald-700", bar: "bg-emerald-500", dot: "🟢", bg: "from-emerald-50 to-white" },
  Medium: { badge: "bg-amber-50 border-amber-200 text-amber-700",       bar: "bg-amber-400",  dot: "🟡", bg: "from-amber-50 to-white" },
  High:   { badge: "bg-red-50 border-red-200 text-red-700",             bar: "bg-red-500",    dot: "🔴", bg: "from-red-50 to-white" },
};

const Results = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!state) navigate("/triage");
    getHistory().then(r => setHistory(r.data)).catch(() => {});
  }, [navigate, state]);

  if (!state) return null;

  const { predicted_disease, severity, top_reasons, nearby_facilities, confidence } = state;

  const filteredFacilities = severity === "High"
    ? nearby_facilities?.filter(f => f.type === "Specialist" || f.type === "General")
    : severity === "Medium"
    ? nearby_facilities?.filter(f => f.type === "General" || f.type === "Clinic")
    : nearby_facilities;

  const mapCenter = filteredFacilities?.length > 0
    ? [filteredFacilities[0].lat, filteredFacilities[0].lng]
    : [27.7172, 85.324];

  const sev = SEV[severity] || SEV.Medium;
  const confColor = confidence >= 75 ? "text-emerald-600" : confidence >= 50 ? "text-amber-500" : "text-red-500";
  const confBar = confidence >= 75 ? "bg-emerald-500" : confidence >= 50 ? "bg-amber-400" : "bg-red-400";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">

        {/* ── TOP: Diagnosis + Key Indicators ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Diagnosis card */}
          <div className={`md:col-span-2 card p-8 bg-gradient-to-br ${sev.bg}`}>
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-4">Diagnosis</p>
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900 mb-1">{predicted_disease}</h1>
                <p className="text-sm text-slate-400">Based on {top_reasons.length} key symptom indicators</p>
              </div>
              <span className={`inline-flex items-center gap-2 border-2 rounded-2xl px-6 py-3 font-bold text-base ${sev.badge}`}>
                {sev.dot} {severity} Severity
              </span>
            </div>
            {/* Confidence */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Model Confidence</span>
                <span className={`text-lg font-extrabold ${confColor}`}>{confidence}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className={`h-3 rounded-full transition-all ${confBar}`} style={{ width: `${confidence}%` }} />
              </div>
              {confidence < 50 && (
                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  ⚠️ Low confidence — add more symptoms for a better result
                </p>
              )}
            </div>
          </div>

          {/* Key indicators card */}
          <div className="card p-7">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-4">Key Indicators</p>
            <div className="space-y-2.5">
              {top_reasons.map((r, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                  <span className="w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                  <span className="text-sm font-medium text-slate-700">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FACILITIES: Map full width on top, list below ── */}
        <div className="card p-7">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest">Recommended Facilities</p>
            <span className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${sev.badge}`}>
              {severity === "High" ? "🏥 Specialists prioritised" : severity === "Medium" ? "🏨 General hospitals shown" : "📍 All nearby facilities"}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-5">Nearest hospitals to you</h2>

          {/* Map — full width, tall */}
          <div className="rounded-2xl overflow-hidden border border-slate-100 mb-5" style={{ height: "420px" }}>
            <MapContainer center={mapCenter} zoom={12} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
              {filteredFacilities?.map((f, i) => (
                <Marker key={i} position={[f.lat, f.lng]}>
                  <Popup>
                    <strong>{f.name}</strong><br />
                    {f.type} · {f.distance_km} km<br />
                    ~{f.wait_time} min wait
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Facility list — horizontal scroll cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredFacilities?.map((f, i) => (
              <div key={i} className="border-2 border-slate-100 hover:border-teal-300 hover:bg-teal-50 rounded-2xl px-4 py-4 transition cursor-default">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</div>
                  <span className="text-xs font-semibold text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">~{f.wait_time}m wait</span>
                </div>
                <p className="font-bold text-slate-800 text-sm leading-snug">{f.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{f.type} · {f.distance_km} km away</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM: History + New Triage ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {history.length > 0 && (
            <div className="md:col-span-2 card p-7">
              <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-3">History</p>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Past Triage Sessions</h2>
              <div className="space-y-2">
                {history.slice(0, 5).map(h => (
                  <div key={h.id} className="flex justify-between items-center border border-slate-100 hover:border-teal-200 rounded-xl px-4 py-3.5 transition">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{h.predicted_disease}</p>
                      <p className="text-xs text-slate-400">{new Date(h.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${SEV[h.severity]?.badge}`}>{h.severity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className={`card p-7 flex flex-col justify-between ${history.length > 0 ? "" : "md:col-span-3"}`}>
            <div>
              <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Not accurate?</p>
              <p className="text-sm text-slate-500 mb-5">Try again with more symptoms for a higher confidence result.</p>
            </div>
            <button
              onClick={() => navigate("/triage")}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition shadow-md w-full py-4 text-sm"
            >
              Start New Triage →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Results;