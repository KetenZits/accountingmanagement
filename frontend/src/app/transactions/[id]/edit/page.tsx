'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTransaction, updateTransaction } from "@/lib/services/transactionService";
import { Transaction, TransactionPayload } from "@/types/transaction";
import Link from "next/link";

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [form, setForm] = useState<TransactionPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTransaction = async () => {
      try {
        setIsPageLoading(true);
        const tx: Transaction = await getTransaction(id);
        setForm({
          type: tx.type,
          amount: tx.amount,
          category: tx.category,
          note: tx.note,
          date: tx.date,
        });
      } catch (err) {
        setError("Failed to load transaction");
        console.error("Error loading transaction:", err);
      } finally {
        setIsPageLoading(false);
      }
    };

    if (id) {
      loadTransaction();
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!form) return;
    
    setIsLoading(true);
    try {
      await updateTransaction(id, form);
      router.push("/");
    } catch (err) {
      setError("Failed to update transaction");
      console.error("Error updating transaction:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumberInput = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    return numericValue;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumberInput(e.target.value);
    setForm(prev => prev ? { ...prev, amount: parseFloat(formattedValue) || 0 } : null);
  };

  const commonCategories = {
    income: ["Salary", "Bonus", "Investment", "Gift", "Other Income"],
    expense: ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Healthcare", "Other Expense"]
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-600 text-lg">Loading transaction...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border p-8 max-w-md w-full mx-4 text-center">
          <div className="p-4 bg-red-100 rounded-lg inline-block mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || "Transaction not found"}</p>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Transaction</h1>
                <p className="text-gray-600 text-sm mt-1">แก้ไขรายการรายรับรายจ่าย</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              ID: {id}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 space-y-6">
            {/* Transaction Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm(prev => prev ? { ...prev, type: "income", category: "" } : null)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    form.type === "income"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      form.type === "income" ? "bg-green-100" : "bg-gray-100"
                    }`}>
                      <svg className={`w-5 h-5 ${
                        form.type === "income" ? "text-green-600" : "text-gray-600"
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    </div>
                    <span className="font-medium">Income</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setForm(prev => prev ? { ...prev, type: "expense", category: "" } : null)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    form.type === "expense"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      form.type === "expense" ? "bg-red-100" : "bg-gray-100"
                    }`}>
                      <svg className={`w-5 h-5 ${
                        form.type === "expense" ? "text-red-600" : "text-gray-600"
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                      </svg>
                    </div>
                    <span className="font-medium">Expense</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (THB)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg">฿</span>
                </div>
                <input
                  id="amount"
                  type="text"
                  required
                  placeholder="0.00"
                  value={form.amount || ''}
                  onChange={handleAmountChange}
                  className="block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium text-gray-600"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="space-y-3">
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm(prev => prev ? { ...prev, category: e.target.value } : null)}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
                >
                  <option value="">Select a category</option>
                  {commonCategories[form.type].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                <div className="text-center text-sm text-gray-500">or</div>
                
                <input
                  type="text"
                  placeholder="Enter custom category"
                  value={form.category}
                  onChange={(e) => setForm(prev => prev ? { ...prev, category: e.target.value } : null)}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                id="date"
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm(prev => prev ? { ...prev, date: e.target.value } : null)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
              />
            </div>

            {/* Note */}
            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                Note (Optional)
              </label>
              <textarea
                id="note"
                rows={3}
                placeholder="Add a note about this transaction..."
                value={form.note ?? ""}
                onChange={(e) => setForm(prev => prev ? { ...prev, note: e.target.value } : null)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-600"
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-red-800 font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <Link 
                href="/"
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-center transition-colors"
              >
                Cancel
              </Link>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !form.amount || !form.category}
                className={`flex-1 px-4 py-3 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                  isLoading || !form.amount || !form.category
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Update Transaction
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Update History Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">Editing Transaction</h3>
              <p className="text-sm text-blue-800">
                You're editing transaction ID #{id}. Make your changes and click "Update Transaction" to save them.
                All changes will be reflected immediately in your balance and reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}