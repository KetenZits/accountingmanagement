// Transaction แต่ละรายการ
export interface Transaction {
  id: number;
  title: string,
  type: 'income' | 'expense'; // รายรับหรือรายจ่าย
  amount: number;             // จำนวนเงิน
  category?: string;          // หมวดหมู่ (optional)
  note?: string;              // บันทึก (optional)
  date: string;               // วันที่ (ISO string เช่น 2025-09-15)
  created_at: string;
  updated_at: string;
}

// payload เวลา create หรือ update
export interface TransactionPayload {
  type: 'income' | 'expense';
  amount: number;
  category?: string;
  note?: string;
  date: string;
}

// Response จาก API เวลาดึงข้อมูล
export interface TransactionResponse {
  data: Transaction[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
