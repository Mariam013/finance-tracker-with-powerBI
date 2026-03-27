export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 text-center py-16">
        <p className="text-gray-400 text-sm">No expenses yet. Add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 font-medium text-gray-500">Date</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Type</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Category</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Payment</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Currency</th>
              <th className="text-right px-5 py-3 font-medium text-gray-500">Amount</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Note</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {expenses.map((expense) => (
              <tr key={expense.expense_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                  {new Date(expense.transaction_date + "T00:00:00").toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                    expense.type === "income"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}>
                    {expense.type === "income" ? "Income" : "Expense"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    {expense.category.name}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-600">{expense.payment_method.name}</td>
                <td className="px-5 py-3 text-gray-600">
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {expense.currency}
                  </span>
                </td>
                <td className={`px-5 py-3 text-right font-medium ${
                  expense.type === "income" ? "text-green-600" : "text-red-600"
                }`}>
                  {expense.type === "income" ? "+" : "-"}{parseFloat(expense.amount).toFixed(2)}
                </td>
                <td className="px-5 py-3 text-gray-500 max-w-xs truncate">
                  {expense.description || <span className="text-gray-300">—</span>}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => onEdit(expense)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(expense.expense_id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
