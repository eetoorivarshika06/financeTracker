import { motion } from "framer-motion";

export function StatCard({ title, value, subtitle, icon: Icon, trend, accent = "primary" }) {
  const accents = {
    primary: "from-primary/20 to-primary/5 text-primary",
    secondary: "from-secondary/20 to-secondary/5 text-secondary",
    success: "from-success/20 to-success/5 text-success",
    danger: "from-danger/20 to-danger/5 text-danger",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group rounded-2xl border border-white/[0.08] bg-card p-6 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-card)]"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white lg:text-3xl">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-text-muted">{subtitle}</p>
          )}
          {trend && (
            <p
              className={`mt-2 text-xs font-medium ${
                trend.positive ? "text-success" : "text-danger"
              }`}
            >
              {trend.label}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accents[accent]}`}
          >
            <Icon className="h-6 w-6" strokeWidth={1.75} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default StatCard;
