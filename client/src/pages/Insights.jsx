import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Brain } from "lucide-react";
import { fetchInsights } from "../redux/insightSlice";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Loader from "../components/Loader";

function Insights() {
  const dispatch = useDispatch();
  const { insights, provider, insightsLoading, insightsError } = useSelector(
    (state) => state.insight
  );

  useEffect(() => {
    dispatch(fetchInsights());
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">AI Insights</h1>
          <p className="text-sm text-slate-400">
            Powered by {provider || "AI"} · Personalized for your finances
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => dispatch(fetchInsights())}
          disabled={insightsLoading}
          className="border-slate-700/50 bg-slate-800/50 text-slate-100 hover:bg-slate-700/50 hover:border-slate-600"
        >
          <RefreshCw className={`h-4 w-4 ${insightsLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {insightsError && (
        <div className="mb-6">
          <Alert>{insightsError}</Alert>
        </div>
      )}

      {insightsLoading && insights.length === 0 ? (
        <Loader label="Analyzing your finances..." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {insights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-xl p-6 shadow-lg shadow-indigo-500/10 transition hover:border-indigo-500/30 hover:shadow-indigo-500/20"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl transition group-hover:bg-indigo-500/20" />
              <div className="relative flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/20">
                  <Brain className="h-6 w-6 text-indigo-400" />
                </div>
                <div className="flex-1">
                  <span className="mb-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    <Sparkles className="h-3 w-3" />
                    Insight {index + 1}
                  </span>
                  <p className="mt-2 leading-relaxed text-slate-300">{item}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!insightsLoading && insights.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-dashed border-slate-700/50 bg-slate-800/30 py-16 text-center"
        >
          <Brain className="mx-auto mb-4 h-12 w-12 text-slate-600" />
          <p className="text-slate-400">Add transactions to unlock AI insights</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Insights;
