import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import { fetchInsights } from "../redux/insightSlice";
import PageHeader from "../components/ui/PageHeader";
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
    <div>
      <PageHeader
        title="AI Insights"
        description={`Powered by ${provider || "AI"} · Personalized for your finances`}
        action={
          <Button
            variant="outline"
            onClick={() => dispatch(fetchInsights())}
            disabled={insightsLoading}
          >
            <RefreshCw className={`h-4 w-4 ${insightsLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

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
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-card p-6 shadow-[var(--shadow-soft)] transition hover:border-primary/30"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20" />
              <div className="relative flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-secondary/20">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
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
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <Sparkles className="mx-auto mb-4 h-10 w-10 text-text-muted" />
          <p className="text-text-muted">Add transactions to unlock AI insights</p>
        </div>
      )}
    </div>
  );
}

export default Insights;
