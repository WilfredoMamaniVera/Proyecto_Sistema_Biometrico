<?php

namespace Database\Factories;

use App\Models\Usuario; // Importa el modelo Usuario
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UsuarioFactory extends Factory
{
    protected $model = Usuario::class; // Especifica el modelo

    public function definition()
    {
        return [
            'nombre' => $this->faker->firstName,
            'apellido_paterno' => $this->faker->lastName,
            'apellido_materno' => $this->faker->lastName,
            'fecha_nacimiento' => $this->faker->date(),
            'telefono' => $this->faker->phoneNumber,
            'correo' => $this->faker->unique()->safeEmail(),
            'imagen_biometrica' => null, // O puedes generar una URL de imagen falsa si lo prefieres
        ];
    }
}