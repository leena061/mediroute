import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3.5 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-teal-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">M</div>
        <span className="text-lg font-bold text-gray-900">MediRoute</span>
      </Link>
      <div className="flex gap-3 items-center">
        {user ? (
          <>
            <Link to="/triage" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition">
              Triage
            </Link>
            <span className="text-sm text-gray-400 hidden md:block">{user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition">
              Sign In
            </Link>
            <Link to="/register" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;