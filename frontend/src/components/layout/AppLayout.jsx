import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, Search, ShoppingCart, LogIn, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import Footer from "../common/Footer";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const tab = loc.pathname;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">

      {/* HEADER */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 shadow-sm border-b border-gray-200/40 dark:border-gray-700/40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">

          <Link to="/" className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
            VoiceCart
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {user ? (
                <User size={22} className="text-gray-800 dark:text-white" />
              ) : (
                <LogIn size={22} className="text-gray-800 dark:text-white" />
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-2 border border-gray-200 dark:border-gray-700 animate-fade">

                {!user && (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      className="block px-3 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Register
                    </Link>
                  </>
                )}

                {user && (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                      Hello, <span className="font-semibold">{user.username}</span>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      Logout
                    </button>
                  </>
                )}

              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-4 pb-32">
        <Outlet />
        <Footer />
      </main>

      {/* BOTTOM NAV */}
      <footer className="fixed bottom-0 left-0 right-0 z-30">
        <div className="max-w-3xl mx-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-t px-6 py-3 flex justify-between">

          <Link to="/" className={`nav-btn ${tab === "/" ? "active" : ""}`}>
            <Home size={22} />
            <span>Home</span>
          </Link>

          <Link to="/search" className={`nav-btn ${tab === "/search" ? "active" : ""}`}>
            <Search size={22} />
            <span>Search</span>
          </Link>

          <Link to="/cart" className={`nav-btn ${tab === "/cart" ? "active" : ""}`}>
            <ShoppingCart size={22} />
            <span>Cart</span>
          </Link>
        </div>
      </footer>

      <style>{`
        .nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          color: #888;
        }
        .nav-btn.active {
          color: #6366F1;
          font-weight: 600;
        }
        @keyframes fade {
          0% { opacity: 0; transform: scale(0.95);}
          100% { opacity: 1; transform: scale(1);}
        }
        .animate-fade {
          animation: fade 0.15s ease-out;
        }
      `}</style>

    </div>
  );
}
