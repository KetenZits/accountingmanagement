'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTransaction } from "@/lib/services/transactionService";
import { TransactionPayload } from "@/types/transaction";

export default function CreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<TransactionPayload>({
    type: "income",
    amount: 0,
    category: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTransaction(form);
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add Transaction</h1>
      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
      />
      <input
        type="text"
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />
      <input
        type="text"
        placeholder="Note"
        value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
      />
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />
      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value as "income" | "expense" })}
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <button type="submit">Save</button>
    </form>
  );
}
