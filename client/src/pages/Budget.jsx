import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchBudget, saveBudget, clearBudgetStatus } from "../redux/budgetSlice";
import { formatCurrency } from "../utils/formatCurrency";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { StatCardSkeleton } from "../components/ui/Skeleton";
import { Target, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

function Budget() {
  const dispatch = useDispatch();
  const { data, loading, saving, fetched, error, success } = useSelector(
    (state) => state.budget
  );
  const { dashboard } = useSelector((state) => state.insight);
  const [monthlyBudget, setMonthlyBudget] = useState("");

  useEffect(() => {
    dispatch(fetchBudget());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => dispatch(clearBudgetStatus()), 3000);
      return () => clearTimeout(t);
    }
  }, [success, dispatch]);

  const total = Number(data?.monthlyBudget) || 0;
  const remaining = dashboard?.budgetRemaining ?? total;
  const spent = Math.max(0, total - remaining);
  const percent = total > 0 ? Math.min(100, (spent / total) * 100) : 0;

  if (loading && !fetched) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Budget</h1>
        <p className="text-sm text-slate-400">Set limits and track spending progress</p>
      </div>

      {error && (
        <div className="mb-6">
          <Alert>{error}</Alert>
        </div>
      )}
      {success && (
        <div className="mb-6">
          <Alert variant="success">Budget saved successfully</Alert>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                <Target className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-100">Monthly Budget</h2>
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-400">Budget Amount (₹)</label>
              <input
                type="number"
                className="w-full rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-lg font-semibold text-slate-100 placeholder-slate-500 transition-all duration-200 focus:border-indigo-500/50 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Enter amount"
                value={monthlyBudget || data?.monthlyBudget || ""}
                onChange={(e) => setMonthlyBudget(e.target.value)}
              />
            </div>
            <Button
              variant="primary"
              className="w-full bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/30"
              disabled={saving || !monthlyBudget}
              onClick={() => dispatch(saveBudget(monthlyBudget))}
            >
              {saving ? "Saving..." : "Save Budget"}
            </Button>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <PiggyBank className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-100">Spending Progress</h2>
            </div>
            
            <div className="mb-8 text-center">
              <p className="mb-2 text-sm text-slate-400">Remaining</p>
              <p className="text-4xl font-bold text-slate-100">
                {formatCurrency(remaining)}
              </p>
            </div>

            <div className="mb-4 flex justify-between text-sm">
              <span className="text-slate-400">{Math.round(percent)}% used</span>
              <span className="text-slate-400">{formatCurrency(total)} total</span>
            </div>
            
            <div className="mb-6 h-4 overflow-hidden rounded-full bg-slate-700/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  percent > 90
                    ? "bg-gradient-to-r from-red-500 to-red-400 shadow-lg shadow-red-500/30"
                    : percent > 70
                    ? "bg-gradient-to-r from-amber-500 to-amber-400 shadow-lg shadow-amber-500/30"
                    : "bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-lg shadow-emerald-500/30"
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-900/50 p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs text-slate-400">Spent</span>
                </div>
                <p className="text-lg font-semibold text-slate-100">{formatCurrency(spent)}</p>
              </div>
              <div className="rounded-xl bg-slate-900/50 p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs text-slate-400">Budget</span>
                </div>
                <p className="text-lg font-semibold text-slate-100">{formatCurrency(total)}</p>
              </div>
            </div>

            {data?.categoryBudgets?.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="text-sm font-medium text-slate-400">Category limits</h3>
                {data.categoryBudgets.map((cat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-slate-100">{cat.category}</span>
                      <span className="text-slate-400">{formatCurrency(cat.limit)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-700/50">
                      <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Budget;
