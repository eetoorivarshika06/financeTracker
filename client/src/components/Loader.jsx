import { motion } from "framer-motion";

function Loader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent"
      />
      <p className="text-sm text-text-muted">{label}</p>
    </div>
  );
}

export default Loader;
