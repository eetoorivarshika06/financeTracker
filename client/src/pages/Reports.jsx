import { useDispatch, useSelector } from "react-redux";
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
import PageHeader from "../components/ui/PageHeader";
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
        { name: "Income", value: report.totalIncome, fill: "#22C55E" },
        { name: "Expense", value: report.totalExpense, fill: "#EF4444" },
        { name: "Savings", value: report.savings, fill: "#14B8A6" },
      ]
    : [];

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Monthly financial summary and breakdown"
        action={
          <Button
            variant="primary"
            onClick={() => dispatch(fetchMonthlyReport())}
            disabled={reportLoading}
          >
            <FileText className="h-4 w-4" />
            {reportLoading ? "Generating..." : "Generate Report"}
          </Button>
        }
      />

      {reportError && (
        <div className="mb-6">
          <Alert>{reportError}</Alert>
        </div>
      )}

      {reportLoading && !report && <Loader label="Generating report..." />}

      {report && (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              title="Income"
              value={formatCurrency(report.totalIncome)}
              accent="success"
            />
            <StatCard
              title="Expense"
              value={formatCurrency(report.totalExpense)}
              accent="danger"
            />
            <StatCard
              title="Savings"
              value={formatCurrency(report.savings)}
              accent="secondary"
            />
          </div>

          <Card>
            <h2 className="mb-6 text-lg font-semibold text-white">
              Summary — {report.month}/{report.year}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v)} />} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {report.transactions?.length > 0 && (
            <Card className="!p-0 overflow-hidden">
              <h2 className="border-b border-white/[0.08] px-6 py-4 text-lg font-semibold text-white">
                Transactions
              </h2>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-text-muted">
                      <th className="px-6 py-3 font-medium">Title</th>
                      <th className="px-6 py-3 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.transactions.map((tx) => (
                      <tr key={tx._id} className="border-b border-white/[0.04]">
                        <td className="px-6 py-3 text-white">{tx.title}</td>
                        <td
                          className={`px-6 py-3 text-right font-medium ${
                            tx.type === "income" ? "text-success" : "text-danger"
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
          )}
        </div>
      )}
    </div>
  );
}

export default Reports;
