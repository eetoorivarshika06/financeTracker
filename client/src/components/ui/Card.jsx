import { motion } from "framer-motion";

export function Card({ children, className = "", hover = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -2 } : undefined}
      className={`rounded-2xl border border-white/[0.08] bg-card p-6 shadow-[var(--shadow-soft)] ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default Card;
