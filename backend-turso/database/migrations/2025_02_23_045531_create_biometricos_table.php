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
        Schema::create('biometricos', function (Blueprint $table) {
            $table->id(); // Crea la columna 'id' como PRIMARY KEY autoincrementable
            $table->unsignedBigInteger('id_persona');
            $table->binary('imagen')->nullable();
            $table->foreign('id_persona')->references('id')->on('personas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biometricos');
    }
};
