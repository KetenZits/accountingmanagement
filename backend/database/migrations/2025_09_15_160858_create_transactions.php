<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // ชื่อรายการ เช่น "เงินเดือน", "ค่าอาหาร"
            $table->enum('type', ['income', 'expense']); // ประเภท รายรับ/รายจ่าย
            $table->decimal('amount', 12, 2); // จำนวนเงิน
            $table->date('date'); // วันที่บันทึก
            $table->text('note')->nullable(); // โน้ตเพิ่มเติม (ใส่ก็ได้ ไม่ใส่ก็ได้)
            $table->timestamps(); // created_at, updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
