import { Transaction, TransactionPayload, TransactionResponse } from "@/types/transaction";

const API_URL = "http://localhost:8000/api"; // ของมึง Laravel

// ดึง transaction ทั้งหมด
export async function getTransactions(): Promise<TransactionResponse> {
  const res = await fetch(`${API_URL}/transactions`);
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}

// ดึง transaction เดี่ยว
export async function getTransaction(id: number): Promise<Transaction> {
  const res = await fetch(`${API_URL}/transactions/${id}`);
  if (!res.ok) throw new Error("Transaction not found");
  return res.json();
}

// สร้าง transaction ใหม่
export async function createTransaction(payload: TransactionPayload): Promise<Transaction> {
  const res = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create transaction");
  return res.json();
}

// อัพเดท transaction
export async function updateTransaction(id: number, payload: TransactionPayload): Promise<Transaction> {
  const res = await fetch(`${API_URL}/transactions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update transaction");
  return res.json();
}

// ลบ transaction
export async function deleteTransaction(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/transactions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete transaction");
}
