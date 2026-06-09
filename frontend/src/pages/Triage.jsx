import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { predictDisease, getNearbyFacilities } from "../api";

const ALL_SYMPTOMS = [
  "itching", "skin_rash", "nodal_skin_eruptions", "continuous_sneezing",
  "shivering", "chills", "joint_pain", "stomach_pain", "acidity",
  "ulcers_on_tongue", "muscle_wasting", "vomiting", "burning_micturition",
  "fatigue", "weight_gain", "anxiety", "cold_hands_and_feets", "mood_swings",
  "weight_loss", "restlessness", "lethargy", "patches_in_throat",
  "irregular_sugar_level", "cough", "high_fever", "sunken_eyes",
  "breathlessness", "sweating", "dehydration", "indigestion", "headache",
  "yellowish_skin", "dark_urine", "nausea", "loss_of_appetite",
  "pain_behind_the_eyes", "back_pain", "constipation", "abdominal_pain",
  "diarrhoea", "mild_fever", "yellow_urine", "yellowing_of_eyes",
  "acute_liver_failure", "swelling_of_stomach", "swelled_lymph_nodes",
  "malaise", "blurred_and_distorted_vision", "phlegm", "throat_irritation",
  "redness_of_eyes", "sinus_pressure", "runny_nose", "congestion",
  "chest_pain", "weakness_in_limbs", "fast_heart_rate", "neck_pain",
  "dizziness", "cramps", "bruising", "obesity", "swollen_legs",
  "puffy_face_and_eyes", "enlarged_thyroid", "brittle_nails",
  "excessive_hunger", "slurred_speech", "knee_pain", "hip_joint_pain",
  "muscle_weakness", "stiff_neck", "swelling_joints", "movement_stiffness",
  "loss_of_balance", "unsteadiness", "loss_of_smell", "bladder_discomfort",
  "continuous_feel_of_urine", "passage_of_gases", "depression", "irritability",
  "muscle_pain", "red_spots_over_body", "belly_pain", "abnormal_menstruation",
  "watering_from_eyes", "increased_appetite", "polyuria", "family_history",
  "mucoid_sputum", "lack_of_concentration", "visual_disturbances",
  "coma", "stomach_bleeding", "blood_in_sputum", "palpitations",
  "painful_walking", "pus_filled_pimples", "blackheads", "skin_peeling",
  "small_dents_in_nails", "inflammatory_nails", "blister", "yellow_crust_ooze"
];

const STEPS = ["Select Symptoms", "Confirm & Submit"];

const Triage = () => {
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const filtered = ALL_SYMPTOMS.filter(
    (s) =>
      s.includes(search.toLowerCase().replace(" ", "_")) &&
      !selected.includes(s)
  );

  const toggleSymptom = (symptom) => {
    setSelected((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      setError("Please select at least one symptom");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await predictDisease({ symptoms: selected });
      const result = res.data;

      // Try to get location for nearby facilities
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            const facRes = await getNearbyFacilities(latitude, longitude);
            navigate("/results", {
              state: { ...result, nearby_facilities: facRes.data },
            });
          },
          () => {
            // Location denied — use Kathmandu default
            getNearbyFacilities(27.7172, 85.3240).then((facRes) => {
              navigate("/results", {
                state: { ...result, nearby_facilities: facRes.data },
              });
            });
          }
        );
      }
    } catch {
      setError("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-teal-700 mb-2 text-center">
          Symptom Triage
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Select all symptoms you are currently experiencing
        </p>

        {/* Step Indicator */}
        <div className="flex justify-center gap-4 mb-8">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`px-4 py-1 rounded-full text-sm font-semibold ${
                i === step
                  ? "bg-teal-700 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {i + 1}. {s}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Search */}
            <input
              type="text"
              placeholder="Search symptoms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            {/* Selected symptoms */}
            {selected.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Selected ({selected.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {selected.map((s) => (
                    <span
                      key={s}
                      onClick={() => toggleSymptom(s)}
                      className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-teal-200"
                    >
                      {s.replace(/_/g, " ")} ✕
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Symptom list */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-80 overflow-y-auto">
              {filtered.slice(0, 60).map((s) => (
                <div
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition capitalize"
                >
                  {s.replace(/_/g, " ")}
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                if (selected.length === 0) {
                  setError("Select at least one symptom");
                  return;
                }
                setError("");
                setStep(1);
              }}
              className="mt-6 w-full bg-teal-700 text-white py-2 rounded-lg font-semibold hover:bg-teal-800 transition"
            >
              Next →
            </button>
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-700 mb-4">
              Confirm your symptoms:
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {selected.map((s) => (
                <span
                  key={s}
                  className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm capitalize"
                >
                  {s.replace(/_/g, " ")}
                </span>
              ))}
            </div>
            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="flex-1 border-2 border-teal-700 text-teal-700 py-2 rounded-lg font-semibold hover:bg-teal-50 transition"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-teal-700 text-white py-2 rounded-lg font-semibold hover:bg-teal-800 transition"
              >
                {loading ? "Analyzing..." : "Get Diagnosis →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Triage;