import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchBudget, saveBudget, clearBudgetStatus } from "../redux/budgetSlice";
import { fetchDashboard } from "../redux/insightSlice";
import { formatCurrency } from "../utils/formatCurrency";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { StatCardSkeleton } from "../components/ui/Skeleton";

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
    if (data?.monthlyBudget != null) {
      setMonthlyBudget(String(data.monthlyBudget));
    }
  }, [data]);

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
      <div>
        <PageHeader title="Budget" description="Manage your monthly spending" />
        <div className="grid gap-6 lg:grid-cols-2">
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Budget" description="Set limits and track spending progress" />

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
        <Card>
          <h2 className="mb-6 text-lg font-semibold text-white">Monthly Budget</h2>
          <input
            type="number"
            className="finance-input mb-4"
            placeholder="Enter amount (₹)"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(e.target.value)}
          />
          <Button
            variant="primary"
            className="w-full"
            disabled={saving || !monthlyBudget}
            onClick={() => dispatch(saveBudget(monthlyBudget))}
          >
            {saving ? "Saving..." : "Save Budget"}
          </Button>
        </Card>

        <Card>
          <h2 className="mb-2 text-lg font-semibold text-white">Spending Progress</h2>
          <p className="mb-6 text-3xl font-bold text-white">
            {formatCurrency(remaining)}
            <span className="ml-2 text-sm font-normal text-text-muted">remaining</span>
          </p>

          <div className="mb-2 flex justify-between text-sm text-text-muted">
            <span>{Math.round(percent)}% used</span>
            <span>{formatCurrency(total)} total</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${
                percent > 90 ? "bg-danger" : percent > 70 ? "bg-warning" : "bg-primary"
              }`}
            />
          </div>

          {data?.categoryBudgets?.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-sm font-medium text-text-muted">Category limits</h3>
              {data.categoryBudgets.map((cat, i) => (
                <div key={i}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-white">{cat.category}</span>
                    <span className="text-text-muted">{formatCurrency(cat.limit)}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full w-1/2 rounded-full bg-secondary" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Budget;
