<?php

// database/migrations/xxxx_create_usuarios_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->string('nombre', 50);
            $table->string('apellido_paterno', 50);
            $table->string('apellido_materno', 50)->nullable();
            $table->date('fecha_nacimiento');
            $table->string('telefono', 15)->nullable();
            $table->string('correo', 100)->unique();
            // Guardaremos la URL de la imagen en lugar de un BLOB
            $table->text('imagen_biometrica');
            $table->timestamp('fecha_registro')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};

