<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('investments', function (Blueprint $table) {
            $table->id();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone', 30)->nullable();
            $table->string('contact_address')->nullable();
            $table->string('investment_topic')->nullable();
            $table->decimal('investment_amount', 15, 2);
            $table->decimal('agreed_interest_rate', 5, 2);
            $table->decimal('return_amount', 15, 2);
            $table->string('agreed_time_range', 100);
            $table->text('notes')->nullable();
            $table->foreignId('created_by_admin_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('customer_email');
            $table->index('investment_topic');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investments');
    }
};
