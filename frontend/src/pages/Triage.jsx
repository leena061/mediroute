import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { predictDisease, getNearbyFacilities } from "../api";

const ALL_SYMPTOMS = [
  "itching","skin_rash","nodal_skin_eruptions","continuous_sneezing","shivering","chills",
  "joint_pain","stomach_pain","acidity","ulcers_on_tongue","muscle_wasting","vomiting",
  "burning_micturition","fatigue","weight_gain","anxiety","cold_hands_and_feets","mood_swings",
  "weight_loss","restlessness","lethargy","patches_in_throat","irregular_sugar_level","cough",
  "high_fever","sunken_eyes","breathlessness","sweating","dehydration","indigestion","headache",
  "yellowish_skin","dark_urine","nausea","loss_of_appetite","pain_behind_the_eyes","back_pain",
  "constipation","abdominal_pain","diarrhoea","mild_fever","yellow_urine","yellowing_of_eyes",
  "acute_liver_failure","swelling_of_stomach","swelled_lymph_nodes","malaise",
  "blurred_and_distorted_vision","phlegm","throat_irritation","redness_of_eyes","sinus_pressure",
  "runny_nose","congestion","chest_pain","weakness_in_limbs","fast_heart_rate","neck_pain",
  "dizziness","cramps","bruising","obesity","swollen_legs","puffy_face_and_eyes","enlarged_thyroid",
  "brittle_nails","excessive_hunger","slurred_speech","knee_pain","hip_joint_pain","muscle_weakness",
  "stiff_neck","swelling_joints","movement_stiffness","loss_of_balance","unsteadiness","loss_of_smell",
  "bladder_discomfort","continuous_feel_of_urine","passage_of_gases","depression","irritability",
  "muscle_pain","red_spots_over_body","belly_pain","abnormal_menstruation","watering_from_eyes",
  "increased_appetite","polyuria","family_history","mucoid_sputum","lack_of_concentration",
  "visual_disturbances","coma","stomach_bleeding","blood_in_sputum","palpitations",
  "painful_walking","pus_filled_pimples","blackheads","skin_peeling","small_dents_in_nails",
  "inflammatory_nails","blister","yellow_crust_ooze"
];

const Triage = () => {
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const filtered = ALL_SYMPTOMS.filter(s =>
    s.includes(search.toLowerCase().replace(/ /g, "_")) && !selected.includes(s)
  );

  const toggle = (s) => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const handleSubmit = async () => {
    if (!selected.length) { setError("Select at least one symptom"); return; }
    setLoading(true); setError("");
    try {
      const res = await predictDisease({ symptoms: selected });
      const result = res.data;
      const getLocation = () => new Promise((resolve) => {
        if (!navigator.geolocation) { resolve([27.7172, 85.324]); return; }
        navigator.geolocation.getCurrentPosition(
          p => resolve([p.coords.latitude, p.coords.longitude]),
          () => resolve([27.7172, 85.324])
        );
      });
      const [lat, lng] = await getLocation();
      const facRes = await getNearbyFacilities(lat, lng);
      navigate("/results", { state: { ...result, nearby_facilities: facRes.data } });
    } catch { setError("Prediction failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">Step {step + 1} of 2</p>
          <h1 className="text-3xl font-extrabold text-slate-900">Symptom Triage</h1>
          <p className="text-slate-500 mt-1">Select every symptom you're currently experiencing for the most accurate result</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 mb-8">
          <div className="bg-teal-500 h-2 rounded-full transition-all duration-500" style={{ width: step === 0 ? "50%" : "100%" }} />
        </div>

        {step === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left — search + grid */}
            <div className="lg:col-span-2 card p-6">

              {/* Search bar */}
              <div className="relative mb-5">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search symptoms... (e.g. headache, fever)"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full border-2 border-slate-200 focus:border-teal-400 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 transition"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg leading-none"
                  >×</button>
                )}
              </div>

              {/* Count label */}
              <p className="text-xs text-slate-400 mb-3">
                {search ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"` : `${filtered.length} symptoms available`}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[420px] overflow-y-auto pr-1">
                {filtered.slice(0, 90).map(s => (
                  <button
                    key={s}
                    onClick={() => toggle(s)}
                    className="text-left border border-slate-100 hover:border-teal-400 hover:bg-teal-50 text-slate-700 hover:text-teal-700 rounded-xl px-3 py-2.5 text-sm capitalize transition"
                  >
                    {s.replace(/_/g, " ")}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="col-span-3 text-center text-sm text-slate-400 py-8">No symptoms match "{search}"</p>
                )}
              </div>
            </div>

            {/* Right — selected panel */}
            <div className="card p-6 flex flex-col">
              <h3 className="font-bold text-slate-800 mb-1">Selected Symptoms</h3>
              <p className="text-xs text-slate-400 mb-4">
                {selected.length === 0 ? "None selected" : `${selected.length} symptom${selected.length !== 1 ? "s" : ""} selected`}
              </p>
              <div className="flex-1 flex flex-wrap gap-2 content-start min-h-32">
                {selected.length === 0 ? (
                  <p className="text-sm text-slate-400 w-full text-center mt-8">No symptoms selected yet</p>
                ) : selected.map(s => (
                  <span
                    key={s}
                    onClick={() => toggle(s)}
                    className="bg-teal-50 border border-teal-200 text-teal-700 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition capitalize"
                  >
                    {s.replace(/_/g, " ")} ×
                  </span>
                ))}
              </div>
              {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
              <button
                onClick={() => { if (!selected.length) { setError("Select at least one symptom"); return; } setError(""); setStep(1); }}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition shadow-md w-full py-4 text-sm mt-4"
              >
                Review & Submit →
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="max-w-2xl mx-auto card p-8">
            <h2 className="font-bold text-slate-900 text-lg mb-1">Review your symptoms</h2>
            <p className="text-sm text-slate-500 mb-5">Confirm these are correct before running the diagnosis</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {selected.map(s => (
                <span key={s} className="bg-teal-50 border border-teal-200 text-teal-700 px-3 py-1.5 rounded-full text-sm capitalize">
                  {s.replace(/_/g, " ")}
                </span>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="border-2 border-slate-200 hover:border-teal-500 hover:text-teal-600 text-slate-600 font-semibold rounded-xl transition flex-1 py-4 text-sm">
                ← Edit Symptoms
              </button>
              <button onClick={handleSubmit} disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition shadow-md flex-1 py-4 text-sm">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Analyzing...
                  </span>
                ) : "Get Diagnosis →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Triage;