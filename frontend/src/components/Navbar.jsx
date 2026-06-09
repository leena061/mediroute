import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur text-white w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-base shadow-inner border border-white/30">M</div>
          <span className="text-lg font-extrabold text-white tracking-tight">MediRoute</span>
        </Link>
        <div className="flex gap-2 items-center">
          {user ? (
            <>
              <Link
                to="/triage"
                className={`text-sm font-semibold px-4 py-2 rounded-xl transition ${
                  pathname === "/triage"
                    ? "bg-white text-teal-700 shadow"
                    : "text-white/80 hover:text-white hover:bg-white/15"
                }`}
              >
                Triage
              </Link>
              <span className="text-sm text-white/60 hidden md:block px-2 border-l border-white/20 ml-1 pl-4">{user.email}</span>
              <button
                onClick={() => { logout(); navigate("/login"); }}
                className="text-sm font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-red-500 px-4 py-2 rounded-xl transition border border-white/20 hover:border-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-white/80 hover:text-white px-4 py-2 rounded-xl transition hover:bg-white/15">
                Sign In
              </Link>
              <Link to="/register" className="bg-white text-teal-700 hover:bg-teal-50 font-bold rounded-xl transition shadow text-sm px-5 py-2.5">
                Get Started →
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;