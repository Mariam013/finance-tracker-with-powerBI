import { useState, useEffect, useCallback } from "react";
import api from "../api/client";
import Navbar from "../components/Navbar";
import ExpenseTable from "../components/ExpenseTable";
import ExpenseForm from "../components/ExpenseForm";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExpenses = useCallback(async () => {
    try {
      const { data } = await api.get("/expenses/");
      setExpenses(data);
    } catch {
      setError("Failed to load expenses.");
    }
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const [expRes, catRes, pmRes] = await Promise.all([
          api.get("/expenses/"),
          api.get("/categories/"),
          api.get("/payment-methods/"),
        ]);
        setExpenses(expRes.data);
        setCategories(catRes.data);
        setPaymentMethods(pmRes.data);
      } catch {
        setError("Failed to load data. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  function openAdd() {
    setEditingExpense(null);
    setShowForm(true);
  }

  function openEdit(expense) {
    setEditingExpense(expense);
    setShowForm(true);
  }

  async function handleDelete(expenseId) {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await api.delete(`/expenses/${expenseId}`);
      setExpenses((prev) => prev.filter((e) => e.expense_id !== expenseId));
    } catch {
      alert("Failed to delete expense.");
    }
  }

  async function handleSave() {
    setShowForm(false);
    setEditingExpense(null);
    await fetchExpenses();
  }

  const currencies = ["USD", "GHS", "RWF"];
  const summaryByCurrency = currencies
    .map((currency) => {
      const subset = expenses.filter((e) => e.currency === currency);
      if (subset.length === 0) return null;
      const income = subset.filter((e) => e.type === "income").reduce((s, e) => s + parseFloat(e.amount), 0);
      const expense = subset.filter((e) => e.type === "expense").reduce((s, e) => s + parseFloat(e.amount), 0);
      return { currency, income, expense, net: income - expense };
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {expenses.length} transaction{expenses.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={openAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Transaction
          </button>
        </div>

        {/* Summary cards per currency */}
        {summaryByCurrency.length > 0 && (
          <div className="space-y-3 mb-6">
            {summaryByCurrency.map(({ currency, income, expense, net }) => (
              <div key={currency} className="bg-white rounded-2xl border border-gray-200 px-5 py-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{currency}</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Income</p>
                    <p className="text-base font-semibold text-green-600">+{income.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Expenses</p>
                    <p className="text-base font-semibold text-red-600">-{expense.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Net Balance</p>
                    <p className={`text-base font-semibold ${net >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {net >= 0 ? "+" : ""}{net.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Loading…</div>
        ) : (
          <ExpenseTable
            expenses={expenses}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          categories={categories}
          paymentMethods={paymentMethods}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
        />
      )}
    </div>
  );
}
