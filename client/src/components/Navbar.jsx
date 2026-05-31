import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { logout } from "../redux/authSlice";
import { ROUTES } from "../routes/paths";
import { useSidebar } from "../context/SidebarContext";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggle } = useSidebar();
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === ROUTES.DASHBOARD) return "Dashboard";
    if (path === ROUTES.TRANSACTIONS) return "Transactions";
    if (path === ROUTES.BUDGET) return "Budget";
    if (path === ROUTES.INSIGHTS) return "AI Insights";
    if (path === ROUTES.CHAT) return "AI Assistant";
    if (path === ROUTES.REPORTS) return "Reports";
    if (path === ROUTES.PROFILE) return "Profile";
    return "FinanceAI";
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-8">
        <button
          type="button"
          onClick={toggle}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-100">{getPageTitle()}</h1>
        </div>

        <div className="relative hidden flex-1 max-w-md sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search transactions, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-400 transition-all duration-200 focus:border-indigo-500/50 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="relative rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/50 py-1.5 pl-1.5 pr-3 transition hover:bg-slate-800 hover:border-slate-600"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/30">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="hidden max-w-[120px] truncate text-sm font-medium text-slate-100 sm:block">
                {user?.name || "User"}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/95 backdrop-blur-xl shadow-lg shadow-indigo-500/10"
                >
                  <div className="border-b border-slate-700/50 px-4 py-3 bg-slate-900/50">
                    <p className="truncate text-sm font-medium text-slate-100">
                      {user?.name}
                    </p>
                    <p className="truncate text-xs text-slate-400">{user?.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate(ROUTES.PROFILE);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-700/50 hover:text-slate-100"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-700/50 hover:text-slate-100"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
