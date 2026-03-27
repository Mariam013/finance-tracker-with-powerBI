import { useState } from "react";
import api from "../api/client";

const today = () => new Date().toISOString().split("T")[0];

export default function ExpenseForm({ expense, categories, paymentMethods, onSave, onClose }) {
  const isEdit = Boolean(expense);
  const [form, setForm] = useState({
    type: expense?.type || "expense",
    amount: expense ? String(expense.amount) : "",
    category_id: expense ? String(expense.category_id) : "",
    payment_method_id: expense ? String(expense.payment_method_id) : "",
    currency: expense?.currency || "USD",
    transaction_date: expense ? expense.transaction_date : today(),
    description: expense?.description || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const payload = {
      type: form.type,
      amount: parseFloat(form.amount),
      category_id: parseInt(form.category_id),
      payment_method_id: parseInt(form.payment_method_id),
      currency: form.currency,
      transaction_date: form.transaction_date,
      description: form.description || null,
    };
    try {
      if (isEdit) {
        await api.put(`/expenses/${expense.expense_id}`, payload);
      } else {
        await api.post("/expenses/", payload);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save expense.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-4">
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, type: "expense", category_id: "" }))}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              form.type === "expense"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, type: "income", category_id: "" }))}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              form.type === "income"
                ? "bg-green-500 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            Income
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="USD">USD — US Dollar</option>
              <option value="GHS">GHS — Ghanaian Cedi</option>
              <option value="RWF">RWF — Rwandan Franc</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select category</option>
              {categories
                .filter((c) => c.type === form.type)
                .map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              name="payment_method_id"
              value={form.payment_method_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select payment method</option>
              {paymentMethods.map((pm) => (
                <option key={pm.id} value={pm.id}>{pm.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="transaction_date"
              value={form.transaction_date}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Add a note…"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              {loading ? "Saving…" : isEdit ? "Save changes" : `Add ${form.type}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
