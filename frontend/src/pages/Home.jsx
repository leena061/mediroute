import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-500">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-10 left-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-teal-100 bg-white/15 border border-white/20 backdrop-blur px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              AI-Powered Medical Triage
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
              Know what's<br />wrong.{" "}
              <span className="text-cyan-200">Get there</span><br />
              <span className="text-cyan-200">fast.</span>
            </h1>
            <p className="text-teal-100 leading-relaxed mb-10 max-w-md text-base">
              Select your symptoms. Our ML model diagnoses your condition, rates severity, and routes you to the right hospital — all in under 2 seconds.
            </p>
            <div className="flex gap-4 flex-wrap">
              {user ? (
                <Link to="/triage" className="bg-white text-teal-700 hover:bg-teal-50 font-extrabold rounded-2xl shadow-xl px-8 py-4 text-sm transition">
                  Start Triage →
                </Link>
              ) : (
                <>
                  <Link to="/register" className="bg-white text-teal-700 hover:bg-teal-50 font-extrabold rounded-2xl shadow-xl px-8 py-4 text-sm transition">
                    Get Started Free →
                  </Link>
                  <Link to="/login" className="text-white border-2 border-white/30 hover:border-white hover:bg-white/10 font-bold rounded-2xl px-8 py-4 text-sm transition">
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Trust line */}
            <p className="text-teal-200/70 text-xs mt-8">
              🔒 Not a substitute for professional medical advice
            </p>
          </div>

          {/* Right — stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "97%",  l: "Model Accuracy",    icon: "🎯", bg: "bg-white/15", t: "text-white" },
              { v: "41",   l: "Diseases Covered",  icon: "🧬", bg: "bg-white/15", t: "text-white" },
              { v: "132",  l: "Symptoms Tracked",  icon: "📋", bg: "bg-white/15", t: "text-white" },
              { v: "<2s",  l: "Triage Time",       icon: "⚡", bg: "bg-white/15", t: "text-white" },
            ].map(s => (
              <div key={s.l} className={`${s.bg} backdrop-blur border border-white/20 rounded-2xl p-6 hover:bg-white/25 transition`}>
                <p className="text-2xl mb-2">{s.icon}</p>
                <p className="text-4xl font-extrabold text-white">{s.v}</p>
                <p className="text-sm font-semibold text-teal-100 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-4xl font-extrabold text-slate-900">From symptoms to the right care</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">Three steps, under 2 seconds, no guesswork.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              n: "01", icon: "📋", t: "Select Symptoms",
              d: "Choose from 132 tracked symptoms using smart search. More symptoms = higher confidence.",
              accent: "from-teal-500 to-cyan-400", light: "bg-teal-50", border: "border-teal-100"
            },
            {
              n: "02", icon: "🧠", t: "AI Diagnosis",
              d: "Random Forest model trained on 4,900+ cases returns a disease prediction with confidence score.",
              accent: "from-violet-500 to-purple-400", light: "bg-violet-50", border: "border-violet-100"
            },
            {
              n: "03", icon: "🗺️", t: "Hospital Routing",
              d: "Facilities filtered by severity, sorted by Haversine distance with live wait time estimates.",
              accent: "from-amber-500 to-orange-400", light: "bg-amber-50", border: "border-amber-100"
            },
          ].map(item => (
            <div key={item.n} className={`relative rounded-3xl border-2 ${item.border} ${item.light} p-8 hover:shadow-xl transition-all duration-300 group overflow-hidden`}>
              <div className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${item.accent} rounded-t-3xl`} />
              <span className="text-xs font-extrabold text-slate-300 tracking-widest block mb-4">{item.n}</span>
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-2">{item.t}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SEVERITY GUIDE ── */}
      <div className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-3">Severity levels</p>
            <h2 className="text-4xl font-extrabold text-slate-900">What your result means</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                l: "Low Severity", e: "🟢", dot: "bg-emerald-500",
                d: "Manageable at home or a quick clinic visit. No immediate danger detected.",
                bg: "bg-white border-emerald-200", t: "text-emerald-700",
                badge: "bg-emerald-100 text-emerald-700"
              },
              {
                l: "Medium Severity", e: "🟡", dot: "bg-amber-400",
                d: "Needs medical attention within 24 hours. General hospital recommended.",
                bg: "bg-white border-amber-200", t: "text-amber-700",
                badge: "bg-amber-100 text-amber-700"
              },
              {
                l: "High Severity", e: "🔴", dot: "bg-red-500",
                d: "Urgent care needed. Specialist or emergency hospital prioritised immediately.",
                bg: "bg-white border-red-200", t: "text-red-700",
                badge: "bg-red-100 text-red-700"
              },
            ].map(s => (
              <div key={s.l} className={`rounded-3xl border-2 ${s.bg} p-8 hover:shadow-lg transition`}>
                <div className={`inline-flex items-center gap-2 ${s.badge} font-bold text-sm px-4 py-2 rounded-full mb-5`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                  {s.l}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      {!user && (
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600">
          <div className="max-w-3xl mx-auto px-6 py-16 text-center">
            <h2 className="text-4xl font-extrabold text-white mb-4">Ready to find out what's wrong?</h2>
            <p className="text-teal-100 mb-8 text-base">Free to use. No credit card. Results in seconds.</p>
            <Link to="/register" className="inline-block bg-white text-teal-700 hover:bg-teal-50 font-extrabold rounded-2xl shadow-xl px-10 py-4 text-base transition">
              Create Free Account →
            </Link>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div className="bg-slate-900 py-6 text-center text-slate-500 text-xs">
        <span className="text-slate-400 font-semibold">MediRoute</span> · Built with FastAPI, React & scikit-learn ·{" "}
        <span className="text-slate-600">Not a substitute for medical advice</span>
      </div>
    </div>
  );
};

export default Home;