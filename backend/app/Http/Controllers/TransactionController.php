<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use Carbon\Carbon;

class TransactionController extends Controller
{
    // ดึงข้อมูลทั้งหมด + summary + filter ตาม period
    public function index(Request $request)
    {
        $period = $request->query('period', 'all'); // daily, weekly, monthly, yearly, all

        $query = Transaction::query();

        $now = Carbon::now();

        switch ($period) {
            case 'daily':
                $query->whereDate('date', $now->toDateString());
                break;
            case 'weekly':
                $query->whereBetween('date', [$now->startOfWeek()->toDateString(), $now->endOfWeek()->toDateString()]);
                break;
            case 'monthly':
                $query->whereYear('date', $now->year)
                      ->whereMonth('date', $now->month);
                break;
            case 'yearly':
                $query->whereYear('date', $now->year);
                break;
            case 'all':
            default:
                // ไม่ filter
                break;
        }

        // เอา transactions ออกมาก่อน
        $transactions = $query->orderBy('date', 'desc')->get();

        // clone query สำหรับ summary
        $summaryQuery = clone $query;

        $totalIncome = (clone $summaryQuery)->where('type', 'income')->sum('amount');
        $totalExpense = (clone $summaryQuery)->where('type', 'expense')->sum('amount');
        $balance = $totalIncome - $totalExpense;

        return response()->json([
            'data' => $transactions,
            'totalIncome' => $totalIncome,
            'totalExpense' => $totalExpense,
            'balance' => $balance,
        ]);
    }

    public function show($id)
    {
        $transaction = Transaction::findOrFail($id);
        return response()->json($transaction);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'category' => 'required',
            'note' => 'nullable|string|max:500',
            'date' => 'required|date',
        ]);

        $transaction = Transaction::create($validated);

        return response()->json($transaction, 201);
    }

    public function update(Request $request, $id)
    {
        $transaction = Transaction::findOrFail($id);

        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'category' => 'required',
            'note' => 'nullable|string|max:500',
            'date' => 'required|date',
        ]);

        $transaction->update($validated);

        return response()->json($transaction);
    }

    public function destroy($id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->delete();

        return response()->json(['message' => 'Transaction deleted']);
    }
}
