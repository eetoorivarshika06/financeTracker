import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, PiggyBank, Target, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { fetchDashboard } from "../redux/insightSlice";
import { formatCurrency } from "../utils/formatCurrency";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import Alert from "../components/ui/Alert";
import { StatCardSkeleton, ChartSkeleton } from "../components/ui/Skeleton";
import ChartTooltip from "../components/charts/ChartTooltip";

const CHART_COLORS = ["#6366F1", "#14B8A6", "#8B5CF6", "#0EA5E9", "#EC4899", "#F59E0B"];

function Dashboard() {
  const dispatch = useDispatch();
  const { dashboard, dashboardLoading, dashboardError } = useSelector(
    (state) => state.insight
  );

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const data = dashboard || {};
  const trend = data.monthlyTrend || [];
  const categories = data.categoryBreakdown || [];
  const recent = data.recentTransactions || [];

  if (dashboardLoading && !dashboard) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
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
      {dashboardError && (
        <div className="mb-6">
          <Alert>{dashboardError}</Alert>
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatCard
            title="Total Income"
            value={formatCurrency(data.totalIncome)}
            icon={TrendingUp}
            accent="success"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatCard
            title="Total Expense"
            value={formatCurrency(data.totalExpense)}
            icon={TrendingDown}
            accent="danger"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StatCard
            title="Savings"
            value={formatCurrency(data.savings)}
            icon={PiggyBank}
            accent="secondary"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <StatCard
            title="Budget Remaining"
            value={formatCurrency(data.budgetRemaining)}
            subtitle={`of ${formatCurrency(data.monthlyBudget)}`}
            icon={Target}
            accent="primary"
          />
        </motion.div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-100">Income vs Expense</h2>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-400">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-slate-400">Expense</span>
                </div>
              </div>
            </div>
            {trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={trend} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v)} />} />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <Wallet className="mb-4 h-12 w-12 text-slate-600" />
                <p className="text-sm text-slate-400">No trend data yet</p>
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-xl">
            <h2 className="mb-6 text-lg font-semibold text-slate-100">Spending by Category</h2>
            {categories.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {categories.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v)} />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <Wallet className="mb-4 h-12 w-12 text-slate-600" />
                <p className="text-sm text-slate-400">No category data yet</p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">Recent Transactions</h2>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              View All
            </button>
          </div>
          {recent.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50 text-slate-400">
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((tx) => (
                    <tr
                      key={tx._id}
                      className="border-b border-slate-700/30 transition hover:bg-slate-700/20"
                    >
                      <td className="py-4 font-medium text-slate-100">{tx.title}</td>
                      <td className="py-4 text-slate-400">{tx.category}</td>
                      <td
                        className={`py-4 text-right font-semibold ${
                          tx.type === "income" ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        <span className="flex items-center justify-end gap-2">
                          {tx.type === "income" ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <Wallet className="mb-4 h-12 w-12 text-slate-600" />
              <p className="text-sm text-slate-400">No recent transactions</p>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;
