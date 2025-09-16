'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTransaction } from "@/lib/services/transactionService";
import { TransactionPayload } from "@/types/transaction";
import Link from "next/link";

export default function CreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<TransactionPayload>({
    type: "income",
    amount: 0,
    category: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      await createTransaction(form);
      router.push("/");
    } catch (error) {
      console.error("Failed to create transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumberInput = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    return numericValue;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumberInput(e.target.value);
    setForm({ ...form, amount: parseFloat(formattedValue) || 0 });
  };

  const commonCategories = {
    income: ["Salary", "Bonus", "Investment", "Gift", "Other Income"],
    expense: ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Healthcare", "Other Expense"]
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Add Transaction</h1>
                <p className="text-gray-600 text-sm mt-1">เพิ่มรายการรายรับรายจ่าย</p>
              </div>
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
                  onClick={() => setForm({ ...form, type: "income", category: "" })}
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
                  onClick={() => setForm({ ...form, type: "expense", category: "" })}
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
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
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
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
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
                onChange={(e) => setForm({ ...form, date: e.target.value })}
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
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-600"
              />
            </div>

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
                    : form.type === "income" 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Transaction
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">Quick Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• You can select from common categories or create your own</li>
                <li>• Add detailed notes to help you remember what this transaction was for</li>
                <li>• Make sure to set the correct date for accurate reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}