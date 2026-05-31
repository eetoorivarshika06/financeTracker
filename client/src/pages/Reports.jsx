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
} from "recharts";
import { FileText } from "lucide-react";
import { fetchMonthlyReport } from "../redux/insightSlice";
import { formatCurrency } from "../utils/formatCurrency";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import StatCard from "../components/ui/StatCard";
import Loader from "../components/Loader";
import ChartTooltip from "../components/charts/ChartTooltip";

function Reports() {
  const dispatch = useDispatch();
  const { report, reportLoading, reportError } = useSelector((state) => state.insight);

  const chartData = report
    ? [
        { name: "Income", value: report.totalIncome, fill: "#10b981" },
        { name: "Expense", value: report.totalExpense, fill: "#ef4444" },
        { name: "Savings", value: report.savings, fill: "#14b8a6" },
      ]
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Reports</h1>
          <p className="text-sm text-slate-400">Monthly financial summary and breakdown</p>
        </div>
        <Button
          variant="primary"
          onClick={() => dispatch(fetchMonthlyReport())}
          disabled={reportLoading}
          className="bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/30"
        >
          <FileText className="h-4 w-4" />
          {reportLoading ? "Generating..." : "Generate Report"}
        </Button>
      </div>

      {reportError && (
        <div className="mb-6">
          <Alert>{reportError}</Alert>
        </div>
      )}

      {reportLoading && !report && <Loader label="Generating report..." />}

      {report && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-8"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <StatCard
                title="Income"
                value={formatCurrency(report.totalIncome)}
                accent="success"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <StatCard
                title="Expense"
                value={formatCurrency(report.totalExpense)}
                accent="danger"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <StatCard
                title="Savings"
                value={formatCurrency(report.savings)}
                accent="secondary"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-100">
                  Summary — {report.month}/{report.year}
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={80} />
                  <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v)} />} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {report.transactions?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-xl !p-0 overflow-hidden">
                <div className="border-b border-slate-700/50 px-6 py-4 bg-slate-900/30">
                  <h2 className="text-lg font-semibold text-slate-100">Transactions</h2>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50 text-slate-400 bg-slate-900/30">
                        <th className="px-6 py-3 font-medium">Title</th>
                        <th className="px-6 py-3 text-right font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.transactions.map((tx) => (
                        <tr key={tx._id} className="border-b border-slate-700/30 transition hover:bg-slate-700/20">
                          <td className="px-6 py-3 text-slate-100">{tx.title}</td>
                          <td
                            className={`px-6 py-3 text-right font-medium ${
                              tx.type === "income" ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {formatCurrency(tx.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default Reports;
