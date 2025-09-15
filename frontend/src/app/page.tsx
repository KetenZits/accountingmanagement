'use client';

import { useEffect, useState } from "react";
import { getTransactions, deleteTransaction } from "@/lib/services/transactionService";
import { Transaction, TransactionResponse } from "@/types/transaction";
import Link from "next/link";

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Omit<TransactionResponse, "data">>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  useEffect(() => {
    getTransactions().then((res) => {
      setTransactions(res.data);
      setSummary({
        totalIncome: res.totalIncome,
        totalExpense: res.totalExpense,
        balance: res.balance,
      });
    });
  }, []);

  const handleDelete = async (id: number) => {
    await deleteTransaction(id);
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <div>
      <h1>Transactions</h1>
      <Link href="/create">+ Add Transaction</Link>
      <ul>
        {transactions.map((tx) => (
          <li key={tx.id}>
            {tx.type.toUpperCase()} - {tx.amount} ({tx.category}) {tx.note}{" "}
            <Link href={`/edit/${tx.id}`}>Edit</Link>{" "}
            <button onClick={() => handleDelete(tx.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Summary</h2>
      <p>Total Income: {summary.totalIncome}</p>
      <p>Total Expense: {summary.totalExpense}</p>
      <p>Balance: {summary.balance}</p>
    </div>
  );
}
