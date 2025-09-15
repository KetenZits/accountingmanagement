'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTransaction, updateTransaction } from "@/lib/services/transactionService";
import { Transaction, TransactionPayload } from "@/types/transaction";

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [form, setForm] = useState<TransactionPayload | null>(null);

  useEffect(() => {
    getTransaction(id).then((tx: Transaction) => {
      setForm({
        type: tx.type,
        amount: tx.amount,
        category: tx.category,
        note: tx.note,
        date: tx.date,
      });
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form) {
      await updateTransaction(id, form);
      router.push("/");
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Transaction</h1>
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
      <button type="submit">Update</button>
    </form>
  );
}
