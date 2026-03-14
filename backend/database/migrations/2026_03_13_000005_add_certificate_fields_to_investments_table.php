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
        Schema::table('investments', function (Blueprint $table) {
            $table->string('certificate_code', 80)->nullable()->unique()->after('notes');
            $table->string('certificate_pdf_path')->nullable()->after('certificate_code');
            $table->string('certificate_qr_path')->nullable()->after('certificate_pdf_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('investments', function (Blueprint $table) {
            $table->dropUnique(['certificate_code']);
            $table->dropColumn(['certificate_code', 'certificate_pdf_path', 'certificate_qr_path']);
        });
    }
};
