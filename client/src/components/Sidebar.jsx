import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  Sparkles,
  FileText,
  User,
  X,
  Wallet,
} from "lucide-react";
import { ROUTES } from "../routes/paths";
import { useSidebar } from "../context/SidebarContext";

const links = [
  { to: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { to: ROUTES.TRANSACTIONS, label: "Transactions", icon: ArrowLeftRight },
  { to: ROUTES.BUDGET, label: "Budget", icon: Target },
  { to: ROUTES.INSIGHTS, label: "AI Insights", icon: Sparkles },
  { to: ROUTES.REPORTS, label: "Reports", icon: FileText },
  { to: ROUTES.PROFILE, label: "Profile", icon: User },
];

function SidebarContent({ onNavigate }) {
  return (
    <>
      <div className="flex items-center gap-3 border-b border-white/[0.08] px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
          <Wallet className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white">FinanceAI</h2>
          <p className="text-xs text-text-muted">Smart tracking</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/15 text-white shadow-inner"
                  : "text-text-muted hover:bg-white/[0.04] hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon
                  className={`h-5 w-5 shrink-0 ${
                    isActive ? "text-primary" : "text-text-muted group-hover:text-white"
                  }`}
                  strokeWidth={1.75}
                />
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

function Sidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Desktop */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-white/[0.08] bg-sidebar md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-white/[0.08] bg-sidebar md:hidden"
            >
              <button
                type="button"
                onClick={close}
                className="absolute right-4 top-6 rounded-lg p-2 text-text-muted hover:bg-white/5 hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent onNavigate={close} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
