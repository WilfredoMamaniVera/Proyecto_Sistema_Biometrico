<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Usuario;
use Illuminate\Http\UploadedFile; // Para simular la subida de archivos
use Illuminate\Support\Facades\Storage; // Para limpiar archivos de prueba

class UsuarioTest extends TestCase
{
    use RefreshDatabase; // Para reiniciar la base de datos después de cada prueba

    public function testCrearUsuario()
    {
        Storage::fake('public'); // Simula el sistema de archivos

        $data = [
            'nombre' => 'Juan',
            'apellido_paterno' => 'Pérez',
            'apellido_materno' => 'Gómez',
            'fecha_nacimiento' => '2000-01-01',
            'telefono' => '123456789',
            'correo' => 'correo@ejemplo.com',
            'imagen_biometrica' => UploadedFile::fake()->image('test.jpg') // Simula la subida de una imagen
        ];

        $response = $this->postJson('/api/usuarios', $data);

        $response->assertStatus(201)
            ->assertJsonStructure(['message', 'usuario'])
            ->assertJsonFragment(['nombre' => 'Juan']);

        $this->assertDatabaseHas('usuarios', ['correo' => 'correo@ejemplo.com']); // Verifica que el usuario se haya guardado en la base de datos

        Storage::disk('public')->assertExists('usuarios/' . $data['imagen_biometrica']->hashName()); // Verifica que la imagen se haya guardado
    }

    public function testObtenerUsuarios()
    {
        Usuario::factory(3)->create(); // Crea 3 usuarios de prueba

        $response = $this->getJson('/api/usuarios');

        $response->assertStatus(200)
            ->assertJsonCount(3); // Verifica que se devuelvan 3 usuarios
    }

    // ... Puedes añadir más pruebas para las otras funciones (actualizar, eliminar, etc.)
}