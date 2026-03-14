<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('investments', function (Blueprint $table) {
            $table->string('balance_confirmation_pdf_path')->nullable()->after('certificate_pdf_path');
        });
    }

    public function down(): void
    {
        Schema::table('investments', function (Blueprint $table) {
            $table->dropColumn('balance_confirmation_pdf_path');
        });
    }
};
