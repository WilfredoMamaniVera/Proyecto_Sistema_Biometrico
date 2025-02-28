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
        Schema::create('horarios', function (Blueprint $table) {
            $table->id('id_horario');
            $table->time('horario_ingreso');
            $table->time('horario_salida');
            $table->time('horario_descanso')->nullable();
            $table->unsignedBigInteger('id_departamento');
            $table->foreign('id_departamento')->references('id_departamento')->on('departamentos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('horarios');
    }
};
