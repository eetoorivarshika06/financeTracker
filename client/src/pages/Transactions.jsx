import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Plus, Trash2, Pencil, Loader2, Sparkles, RefreshCw } from "lucide-react";
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  categorizeMerchant,
  batchRecategorize,
  clearBatchMessage,
} from "../redux/transactionSlice";
import { CATEGORIES } from "../utils/categories";
import { formatCurrency } from "../utils/formatCurrency";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { TableSkeleton } from "../components/ui/Skeleton";

const emptyForm = {
  title: "",
  amount: "",
  type: "expense",
  category: "",
  paymentMethod: "card",
};

function Transactions() {
  const dispatch = useDispatch();
  const {
    items,
    loading,
    submitting,
    categorizing,
    batchRecategorizing,
    error,
    batchMessage,
  } = useSelector((state) => state.transactions);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  useEffect(() => {
    if (!batchMessage) return;
    const timer = setTimeout(() => dispatch(clearBatchMessage()), 5000);
    return () => clearTimeout(timer);
  }, [batchMessage, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      amount: String(item.amount ?? ""),
      type: item.type || "expense",
      category: item.category || "",
      paymentMethod: item.paymentMethod || "card",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleAutoDetect = async () => {
    if (!form.title.trim()) return;
    const result = await dispatch(
      categorizeMerchant({
        merchantName: form.title.trim(),
        amount: Number(form.amount) || 0,
      })
    );
    if (categorizeMerchant.fulfilled.match(result)) {
      setForm((prev) => ({ ...prev, category: result.payload }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;

    const payload = { ...form, amount: Number(form.amount) };

    if (editingId) {
      await dispatch(updateTransaction({ id: editingId, payload }));
    } else {
      await dispatch(addTransaction(payload));
    }
    closeForm();
    dispatch(fetchTransactions());
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      dispatch(deleteTransaction(id));
    }
  };

  const handleBatchRecategorize = async () => {
    const result = await dispatch(batchRecategorize());
    if (batchRecategorize.fulfilled.match(result)) {
      dispatch(fetchTransactions());
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title="Transactions"
        description="Track every income and expense"
        action={
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-wrap gap-2"
          >
            <Button
              variant="secondary"
              onClick={handleBatchRecategorize}
              disabled={batchRecategorizing || items.length === 0}
            >
              {batchRecategorizing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Re-categorize all
            </Button>
            <Button variant="primary" onClick={() => (showForm ? closeForm() : openAddForm())}>
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
          </motion.div>
        }
      />

      {error && (
        <div className="mb-6">
          <Alert>{error}</Alert>
        </div>
      )}

      {batchMessage && (
        <div className="mb-6">
          <Alert variant="success">{batchMessage}</Alert>
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
            <h2 className="mb-4 text-lg font-semibold text-white">
              {editingId ? "Edit Transaction" : "New Transaction"}
            </h2>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <input
                name="title"
                className="finance-input !mb-0"
                placeholder="Merchant / title"
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
              <div className="flex gap-2">
                <select
                  name="category"
                  className="finance-input !mb-0 flex-1"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAutoDetect}
                  disabled={categorizing || !form.title.trim()}
                  className="shrink-0 whitespace-nowrap"
                  title="Auto-detect category from merchant name"
                >
                  {categorizing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Auto-detect
                </Button>
              </div>
              <select
                name="paymentMethod"
                className="finance-input !mb-0"
                value={form.paymentMethod}
                onChange={handleChange}
              >
                <option value="card">Card</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="bank">Bank transfer</option>
              </select>
              <motion.div className="sm:col-span-2 flex gap-3">
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? "Saving..." : editingId ? "Update" : "Save"}
                </Button>
                <Button type="button" variant="ghost" onClick={closeForm}>
                  Cancel
                </Button>
              </motion.div>
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
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditForm(item)}
                          className="rounded-lg p-2 text-text-muted transition hover:bg-primary/10 hover:text-primary"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                          className="rounded-lg p-2 text-text-muted transition hover:bg-danger/10 hover:text-danger"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

export default Transactions;
