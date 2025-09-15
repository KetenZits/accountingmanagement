<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;

class TransactionController extends Controller
{
    // ดึงข้อมูลทั้งหมด + summary
    public function index()
    {
        $transactions = Transaction::orderBy('date', 'desc')->get();

        $totalIncome = Transaction::where('type', 'income')->sum('amount');
        $totalExpense = Transaction::where('type', 'expense')->sum('amount');
        $balance = $totalIncome - $totalExpense;

        return response()->json([
            'data' => $transactions,
            'totalIncome' => $totalIncome,
            'totalExpense' => $totalExpense,
            'balance' => $balance
        ]);
    }

    // ดึงข้อมูลรายการเดียว
    public function show($id)
    {
        $transaction = Transaction::findOrFail($id);
        return response()->json($transaction);
    }

    // สร้าง transaction ใหม่
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:255',
            'note' => 'nullable|string|max:500',
            'date' => 'required|date',
        ]);

        $transaction = Transaction::create($validated);

        return response()->json($transaction, 201);
    }

    // อัพเดท transaction
    public function update(Request $request, $id)
    {
        $transaction = Transaction::findOrFail($id);

        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:255',
            'note' => 'nullable|string|max:500',
            'date' => 'required|date',
        ]);

        $transaction->update($validated);

        return response()->json($transaction);
    }

    // ลบ transaction
    public function destroy($id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->delete();

        return response()->json(['message' => 'Transaction deleted']);
    }
}
