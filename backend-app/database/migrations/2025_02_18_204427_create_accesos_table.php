<?php

// database/migrations/xxxx_create_accesos_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('accesos', function (Blueprint $table) {
            $table->id('id_acceso');
            $table->unsignedBigInteger('id_usuario');
            $table->enum('tipo_acceso', ['entrada', 'salida']);
            $table->timestamp('fecha_hora')->useCurrent();
            $table->string('area_acceso', 100);
            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accesos');
    }
};
