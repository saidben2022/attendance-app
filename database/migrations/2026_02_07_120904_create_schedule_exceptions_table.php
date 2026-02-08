<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schedule_exceptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cohort_id')->constrained()->cascadeOnDelete();
            $table->date('exception_date');
            $table->enum('type', ['holiday', 'extra_session', 'cancelled']);
            $table->boolean('has_am_slot')->default(false);
            $table->boolean('has_pm_slot')->default(false);
            $table->string('reason')->nullable();
            $table->timestamps();

            $table->unique(['cohort_id', 'exception_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedule_exceptions');
    }
};
