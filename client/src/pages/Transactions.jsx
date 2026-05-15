import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import {
  fetchTransactions,
  addTransaction,
  deleteTransaction,
} from "../redux/transactionSlice";
import { formatCurrency } from "../utils/formatCurrency";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { TableSkeleton } from "../components/ui/Skeleton";

function Transactions() {
  const dispatch = useDispatch();
  const { items, loading, submitting, error } = useSelector((state) => state.transactions);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    paymentMethod: "card",
  });

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;
    await dispatch(
      addTransaction({ ...form, amount: Number(form.amount) })
    );
    setForm({ title: "", amount: "", type: "expense", category: "", paymentMethod: "card" });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      dispatch(deleteTransaction(id));
    }
  };

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Track every income and expense"
        action={
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
        }
      />

      {error && (
        <div className="mb-6">
          <Alert>{error}</Alert>
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-white">New Transaction</h2>
            <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-2">
              <input
                name="title"
                className="finance-input !mb-0"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                required
              />
              <input
                name="amount"
                type="number"
                className="finance-input !mb-0"
                placeholder="Amount"
                value={form.amount}
                onChange={handleChange}
                required
              />
              <select name="type" className="finance-input !mb-0" value={form.type} onChange={handleChange}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input
                name="category"
                className="finance-input !mb-0"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
              />
              <div className="sm:col-span-2 flex gap-3">
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? "Saving..." : "Save"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      <Card className="!p-0 overflow-hidden">
        {loading && items.length === 0 ? (
          <div className="p-6">
            <TableSkeleton rows={6} />
          </div>
        ) : items.length === 0 ? (
          <p className="py-16 text-center text-text-muted">No transactions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  <th className="px-6 py-4 font-medium text-text-muted">Title</th>
                  <th className="px-6 py-4 font-medium text-text-muted">Category</th>
                  <th className="px-6 py-4 font-medium text-text-muted">Type</th>
                  <th className="px-6 py-4 text-right font-medium text-text-muted">Amount</th>
                  <th className="px-6 py-4 text-right font-medium text-text-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 font-medium text-white">{item.title}</td>
                    <td className="px-6 py-4 text-text-muted">{item.category || "—"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.type === "income"
                            ? "bg-success/15 text-success"
                            : "bg-danger/15 text-danger"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-semibold ${
                        item.type === "income" ? "text-success" : "text-danger"
                      }`}
                    >
                      {item.type === "income" ? "+" : "-"}
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        className="rounded-lg p-2 text-text-muted transition hover:bg-danger/10 hover:text-danger"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Transactions;
