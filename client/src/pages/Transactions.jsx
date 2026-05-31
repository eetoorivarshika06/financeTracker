import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Pencil, Loader2, Sparkles, RefreshCw, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Transactions</h1>
          <p className="text-sm text-slate-400">Track every income and expense</p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          <Button
            variant="secondary"
            onClick={handleBatchRecategorize}
            disabled={batchRecategorizing || items.length === 0}
            className="border-slate-700/50 bg-slate-800/50 text-slate-100 hover:bg-slate-700/50 hover:border-slate-600"
          >
            {batchRecategorizing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Re-categorize all
          </Button>
          <Button
            variant="primary"
            onClick={() => (showForm ? closeForm() : openAddForm())}
            className="bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/30"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
        </motion.div>
      </div>

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

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-xl">
              <h2 className="mb-6 text-lg font-semibold text-slate-100">
                {editingId ? "Edit Transaction" : "New Transaction"}
              </h2>
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-400">Merchant / Title</label>
                  <input
                    name="title"
                    className="w-full rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 focus:border-indigo-500/50 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g., Amazon, Starbucks"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-400">Amount</label>
                  <input
                    name="amount"
                    type="number"
                    className="w-full rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 focus:border-indigo-500/50 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-400">Type</label>
                  <select
                    name="type"
                    className="w-full rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 transition-all duration-200 focus:border-indigo-500/50 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-400">Category</label>
                  <div className="flex gap-2">
                    <select
                      name="category"
                      className="flex-1 rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 transition-all duration-200 focus:border-indigo-500/50 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                      className="shrink-0 whitespace-nowrap border-slate-700/50 bg-slate-800/50 text-slate-100 hover:bg-slate-700/50 hover:border-slate-600"
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
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-400">Payment Method</label>
                  <select
                    name="paymentMethod"
                    className="w-full rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 transition-all duration-200 focus:border-indigo-500/50 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    value={form.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="card">Card</option>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="bank">Bank transfer</option>
                  </select>
                </div>
                <motion.div className="sm:col-span-2 flex gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting}
                    className="bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/30"
                  >
                    {submitting ? "Saving..." : editingId ? "Update" : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={closeForm}
                    className="border-slate-700/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-100"
                  >
                    Cancel
                  </Button>
                </motion.div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-xl !p-0 overflow-hidden">
        {loading && items.length === 0 ? (
          <div className="p-6">
            <TableSkeleton rows={6} />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Wallet className="mb-4 h-12 w-12 text-slate-600" />
            <p className="text-sm text-slate-400">No transactions yet</p>
            <Button
              variant="primary"
              onClick={openAddForm}
              className="mt-4 bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/30"
            >
              <Plus className="h-4 w-4" />
              Add your first transaction
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-900/30">
                  <th className="px-6 py-4 font-medium text-slate-400">Title</th>
                  <th className="px-6 py-4 font-medium text-slate-400">Category</th>
                  <th className="px-6 py-4 font-medium text-slate-400">Type</th>
                  <th className="px-6 py-4 text-right font-medium text-slate-400">Amount</th>
                  <th className="px-6 py-4 text-right font-medium text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-slate-700/30 transition hover:bg-slate-700/20"
                  >
                    <td className="px-6 py-4 font-medium text-slate-100">{item.title}</td>
                    <td className="px-6 py-4 text-slate-400">{item.category || "—"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.type === "income"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/15 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-semibold ${
                        item.type === "income" ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      <span className="flex items-center justify-end gap-2">
                        {item.type === "income" ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        {formatCurrency(item.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditForm(item)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-500/10 hover:text-indigo-400"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
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
