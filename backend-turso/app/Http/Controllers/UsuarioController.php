<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UsuarioController extends Controller
{
    // Registrar un usuario (POST /api/usuarios)
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:50',
            'apellido_paterno' => 'required|string|max:50',
            'apellido_materno' => 'nullable|string|max:50',
            'fecha_nacimiento' => 'required|date',
            'telefono' => 'nullable|string|max:15',
            'correo' => 'required|email|max:100|unique:usuarios,correo',
            'imagen_biometrica' => 'required|image'
        ]);

        $file = $request->file('imagen_biometrica');
        $filename = Str::random(20) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('usuarios', $filename, 'public');
        $imagenUrl = asset('storage/' . $path);

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

    // Listar todos los usuarios (GET /api/usuarios)
    public function index()
    {
        $usuarios = Usuario::all();
        return response()->json($usuarios);
    }

    // Mostrar un usuario en particular (GET /api/usuarios/{id})
    public function show($id)
    {
        $usuario = Usuario::find($id);
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        return response()->json($usuario);
    }

    // Actualizar un usuario (PUT/PATCH /api/usuarios/{id})
    public function update(Request $request, $id)
    {
        $usuario = Usuario::find($id);
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $request->validate([
            'nombre' => 'sometimes|required|string|max:50',
            'apellido_paterno' => 'sometimes|required|string|max:50',
            'apellido_materno' => 'sometimes|nullable|string|max:50',
            'fecha_nacimiento' => 'sometimes|required|date',
            'telefono' => 'sometimes|nullable|string|max:15',
            'correo' => 'sometimes|required|email|max:100|unique:usuarios,correo,' . $usuario->id_usuario . ',id_usuario',
            'imagen_biometrica' => 'sometimes|image'
        ]);

        // Si se envía una nueva imagen, sube la imagen y actualiza la URL
        if ($request->hasFile('imagen_biometrica')) {
            $file = $request->file('imagen_biometrica');
            $filename = Str::random(20) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('usuarios', $filename, 'public');
            $imagenUrl = asset('storage/' . $path);
            $usuario->imagen_biometrica = $imagenUrl;
        }

        $usuario->update($request->only([
            'nombre',
            'apellido_paterno',
            'apellido_materno',
            'fecha_nacimiento',
            'telefono',
            'correo'
        ]));

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'usuario' => $usuario
        ]);
    }

    // Eliminar un usuario (DELETE /api/usuarios/{id})
    public function destroy($id)
    {
        $usuario = Usuario::find($id);
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        $usuario->delete();
        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }
}