import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              AI-Powered Medical Triage
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Know what's wrong.<br />
              <span className="text-teal-600">Get there fast.</span>
            </h1>
            <p className="text-lg text-gray-500 mb-8 max-w-lg">
              Describe your symptoms and MediRoute's ML model predicts your condition, assesses severity, and routes you to the right facility — instantly.
            </p>
            <div className="flex gap-3 flex-wrap">
              {user ? (
                <Link to="/triage" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-xl font-bold text-base transition shadow-sm">
                  Start Triage →
                </Link>
              ) : (
                <>
                  <Link to="/register" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-xl font-bold text-base transition shadow-sm">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="border border-gray-300 text-gray-700 hover:border-teal-500 hover:text-teal-600 px-8 py-3.5 rounded-xl font-bold text-base transition">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Stats card */}
          <div className="flex-1 grid grid-cols-2 gap-4 w-full max-w-sm">
            {[
              { value: "97%", label: "Model Accuracy", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
              { value: "41", label: "Diseases Covered", color: "bg-teal-50 text-teal-700 border-teal-200" },
              { value: "132", label: "Symptom Inputs", color: "bg-violet-50 text-violet-700 border-violet-200" },
              { value: "<2s", label: "Triage Time", color: "bg-amber-50 text-amber-700 border-amber-200" },
            ].map((s) => (
              <div key={s.label} className={`border rounded-2xl p-5 ${s.color}`}>
                <p className="text-3xl font-extrabold">{s.value}</p>
                <p className="text-sm font-medium mt-1 opacity-80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">How MediRoute works</h2>
        <p className="text-gray-500 mb-10">Three steps from symptoms to the right care</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "📋", title: "Select Symptoms", desc: "Choose from 132 tracked symptoms using our smart search. The more you select, the more accurate the result.", color: "border-l-teal-500" },
            { icon: "🧠", title: "AI Diagnosis", desc: "Random Forest model trained on 4,900+ cases predicts your condition with a confidence score and severity rating.", color: "border-l-emerald-500" },
            { icon: "🗺️", title: "Hospital Routing", desc: "Facilities are filtered by your severity level and sorted by Haversine distance with live wait time estimates.", color: "border-l-violet-500" },
          ].map((item) => (
            <div key={item.title} className={`bg-white rounded-2xl p-6 border border-gray-100 border-l-4 ${item.color} shadow-sm`}>
              <span className="text-3xl mb-4 block">{item.icon}</span>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Severity guide */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Severity Levels</h2>
        <p className="text-gray-500 mb-6">MediRoute categorizes every diagnosis into one of three severity levels</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { level: "Low", emoji: "🟢", desc: "Condition manageable at home or via a clinic visit. No immediate danger.", bg: "bg-emerald-50 border-emerald-200 text-emerald-800" },
            { level: "Medium", emoji: "🟡", desc: "Requires medical attention within 24 hours. General hospital recommended.", bg: "bg-amber-50 border-amber-200 text-amber-800" },
            { level: "High", emoji: "🔴", desc: "Urgent care needed. Specialist or emergency hospital prioritized.", bg: "bg-red-50 border-red-200 text-red-800" },
          ].map((s) => (
            <div key={s.level} className={`border rounded-2xl p-5 ${s.bg}`}>
              <p className="text-2xl mb-2">{s.emoji}</p>
              <p className="font-bold text-lg mb-1">{s.level} Severity</p>
              <p className="text-sm opacity-80">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-white py-6 text-center text-gray-400 text-sm">
        MediRoute · FastAPI · React · scikit-learn · Not a substitute for professional medical advice
      </div>
    </div>
  );
};

export default Home;