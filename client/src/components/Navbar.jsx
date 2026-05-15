import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { logout } from "../redux/authSlice";
import { ROUTES } from "../routes/paths";
import { useSidebar } from "../context/SidebarContext";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toggle } = useSidebar();
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-bg/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-8">
        <button
          type="button"
          onClick={toggle}
          className="rounded-xl p-2 text-text-muted transition hover:bg-white/5 hover:text-white md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden flex-1 max-w-md sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            placeholder="Search transactions, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="finance-input !mb-0 w-full py-2.5 pl-10 pr-4 text-sm"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="relative rounded-xl p-2.5 text-text-muted transition hover:bg-white/5 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-card/50 py-1.5 pl-1.5 pr-3 transition hover:bg-card"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="hidden max-w-[120px] truncate text-sm font-medium text-white sm:block">
                {user?.name || "User"}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-text-muted transition ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/[0.08] bg-card shadow-[var(--shadow-card)]"
                >
                  <div className="border-b border-white/[0.08] px-4 py-3">
                    <p className="truncate text-sm font-medium text-white">
                      {user?.name}
                    </p>
                    <p className="truncate text-xs text-text-muted">{user?.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate(ROUTES.PROFILE);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-text-muted transition hover:bg-white/5 hover:text-white"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-danger transition hover:bg-danger/10"
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
