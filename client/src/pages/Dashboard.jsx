import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { TrendingUp, TrendingDown, PiggyBank, Target } from "lucide-react";
import { fetchDashboard } from "../redux/insightSlice";
import { formatCurrency } from "../utils/formatCurrency";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import Alert from "../components/ui/Alert";
import { StatCardSkeleton, ChartSkeleton } from "../components/ui/Skeleton";
import ChartTooltip from "../components/charts/ChartTooltip";

const CHART_COLORS = ["#4F46E5", "#14B8A6", "#6366F1", "#0EA5E9", "#8B5CF6", "#EC4899"];

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
      <div>
        <PageHeader title="Dashboard" description="Your financial overview" />
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your income, expenses, and savings"
      />

      {dashboardError && (
        <div className="mb-6">
          <Alert>{dashboardError}</Alert>
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Income"
          value={formatCurrency(data.totalIncome)}
          icon={TrendingUp}
          accent="success"
        />
        <StatCard
          title="Total Expense"
          value={formatCurrency(data.totalExpense)}
          icon={TrendingDown}
          accent="danger"
        />
        <StatCard
          title="Savings"
          value={formatCurrency(data.savings)}
          icon={PiggyBank}
          accent="secondary"
        />
        <StatCard
          title="Budget Remaining"
          value={formatCurrency(data.budgetRemaining)}
          subtitle={`of ${formatCurrency(data.monthlyBudget)}`}
          icon={Target}
          accent="primary"
        />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-6 text-lg font-semibold text-white">Income vs Expense</h2>
          {trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v)} />} />
                <Bar dataKey="income" name="Income" fill="#22C55E" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-16 text-center text-sm text-text-muted">No trend data yet</p>
          )}
        </Card>

        <Card>
          <h2 className="mb-6 text-lg font-semibold text-white">Spending by Category</h2>
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
            <p className="py-16 text-center text-sm text-text-muted">No category data yet</p>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-white">Recent Transactions</h2>
        {recent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] text-text-muted">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((tx) => (
                  <tr
                    key={tx._id}
                    className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                  >
                    <td className="py-4 font-medium text-white">{tx.title}</td>
                    <td className="py-4 text-text-muted">{tx.category}</td>
                    <td
                      className={`py-4 text-right font-semibold ${
                        tx.type === "income" ? "text-success" : "text-danger"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-8 text-center text-text-muted">No recent transactions</p>
        )}
      </Card>
    </div>
  );
}

export default Dashboard;
