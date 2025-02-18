<?php

// app/Http/Controllers/UsuarioController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Kreait\Firebase\Contract\Storage;
use Illuminate\Support\Str;

class UsuarioController extends Controller
{
    protected $storage;

    public function __construct(Storage $storage)
    {
        $this->storage = $storage;
    }

    // Método para registrar un usuario y subir su imagen biométrica a Firebase Storage
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:50',
            'apellido_paterno' => 'required|string|max:50',
            'apellido_materno' => 'nullable|string|max:50',
            'fecha_nacimiento' => 'required|date',
            'telefono' => 'nullable|string|max:15',
            'correo' => 'required|email|max:100|unique:usuarios,correo',
            'imagen_biometrica' => 'required|image'  // Archivo de imagen
        ]);

        // Subir imagen a Firebase Storage
        $file = $request->file('imagen_biometrica');
        $filename = 'usuarios/' . Str::random(20) . '.' . $file->getClientOriginalExtension();

        $bucket = $this->storage->getBucket();
        $stream = fopen($file->getPathname(), 'r');

        $object = $bucket->upload($stream, [
            'name' => $filename,
            'predefinedAcl' => 'publicRead' // Opcional: hace la imagen pública
        ]);

        // Obtén la URL pública (puedes generar una URL firmada si lo prefieres)
        $imagenUrl = sprintf('https://storage.googleapis.com/%s/%s', $bucket->name(), $filename);

        // Crear el usuario en la base de datos
        $usuario = Usuario::create([
            'nombre' => $request->nombre,
            'apellido_paterno' => $request->apellido_paterno,
            'apellido_materno' => $request->apellido_materno,
            'fecha_nacimiento' => $request->fecha_nacimiento,
            'telefono' => $request->telefono,
            'correo' => $request->correo,
            'imagen_biometrica' => $imagenUrl
        ]);

        return response()->json([
            'message' => 'Usuario registrado correctamente',
            'usuario' => $usuario
        ], 201);
    }
    // Método para obtener la lista de usuarios
    public function index()
    {
        $usuarios = Usuario::all(); // Obtiene todos los usuarios de la base de datos
        return response()->json($usuarios);
    }
    
}

