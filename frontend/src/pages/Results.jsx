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

const SEVERITY_STYLES = {
  Low: "bg-green-100 text-green-800 border-green-300",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  High: "bg-red-100 text-red-800 border-red-300",
};

const SEVERITY_EMOJI = {
  Low: "🟢",
  Medium: "🟡",
  High: "🔴",
};

const Results = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!state) navigate("/triage");
    getHistory().then((res) => setHistory(res.data)).catch(() => {});
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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Result Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-teal-700 mb-4">Triage Result</h1>
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="flex-1">
              <p className="text-gray-500 text-sm mb-1">Predicted Condition</p>
              <p className="text-2xl font-bold text-gray-800">{predicted_disease}</p>
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-500">Model Confidence</span>
                  <span className={`text-sm font-bold ${
                    confidence >= 75 ? "text-green-600" :
                    confidence >= 50 ? "text-amber-500" :
                    "text-red-500"
                  }`}>
                    {confidence}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      confidence >= 75 ? "bg-green-500" :
                      confidence >= 50 ? "bg-amber-400" :
                      "bg-red-400"
                    }`}
                    style={{ width: `${confidence}%` }}
                  />
                </div>
                {confidence < 50 && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Low confidence — try adding more symptoms for a better result
                  </p>
                )}
              </div>
            </div>
            <div className={`border-2 rounded-xl px-6 py-3 text-center font-bold text-lg ${SEVERITY_STYLES[severity]}`}>
              {SEVERITY_EMOJI[severity]} {severity} Severity
            </div>
          </div>
        </div>

        {/* Top Reasons */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-3">
            🔍 Key Symptoms Driving This Result
          </h2>
          <div className="flex flex-wrap gap-2">
            {top_reasons.map((reason, i) => (
              <span
                key={i}
                className="bg-teal-50 border border-teal-200 text-teal-800 px-4 py-2 rounded-full text-sm font-medium"
              >
                {i + 1}. {reason}
              </span>
            ))}
          </div>
        </div>

        {/* Nearby Facilities Map */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-1">
            📍 Recommended Facilities
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {severity === "High" ? "Specialist & General hospitals prioritized for your condition" :
             severity === "Medium" ? "General hospitals & clinics recommended" :
             "Nearest facilities shown"}
          </p>
          <div className="rounded-xl overflow-hidden mb-4" style={{ height: "350px" }}>
            <MapContainer
              center={mapCenter}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
              {filteredFacilities?.map((f, i) => (
                <Marker key={i} position={[f.lat, f.lng]}>
                  <Popup>
                    <strong>{f.name}</strong><br />
                    Type: {f.type}<br />
                    Distance: {f.distance_km} km<br />
                    Wait time: ~{f.wait_time} mins
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Facility List */}
          <div className="space-y-2">
            {filteredFacilities?.map((f, i) => (
              <div
                key={i}
                className="flex justify-between items-center border border-gray-100 rounded-lg px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-gray-800">{f.name}</p>
                  <p className="text-sm text-gray-500">{f.type} · {f.distance_km} km away</p>
                </div>
                <span className="text-sm text-teal-700 font-medium">
                  ~{f.wait_time} min wait
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* History Panel */}
        {history.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-700 mb-3">
              🕒 Past Triage Sessions
            </h2>
            <div className="space-y-2">
              {history.slice(0, 5).map((h) => (
                <div
                  key={h.id}
                  className="flex justify-between items-center border border-gray-100 rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{h.predicted_disease}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(h.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${SEVERITY_STYLES[h.severity]}`}>
                    {h.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Triage Button */}
        <button
          onClick={() => navigate("/triage")}
          className="w-full bg-teal-700 text-white py-3 rounded-xl font-semibold hover:bg-teal-800 transition"
        >
          Start New Triage
        </button>
      </div>
    </div>
  );
};

export default Results;