<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\File\MimeType\MimeTypeGuesser;

class UsuarioController extends Controller
{
    // Registrar un usuario (POST /api/usuarios)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:50',
            'apellido_paterno' => 'required|string|max:50',
            'apellido_materno' => 'nullable|string|max:50',
            'fecha_nacimiento' => 'required|date',
            'telefono' => 'nullable|string|max:15',
            'correo' => 'required|email|max:100|unique:usuarios,correo',
            'imagen_biometrica' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $file = $request->file('imagen_biometrica');
            $filename = Str::random(20) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('usuarios', $filename, 'public'); // Guarda la imagen

            $usuario = Usuario::create([
                'nombre' => $request->nombre,
                'apellido_paterno' => $request->apellido_paterno,
                'apellido_materno' => $request->apellido_materno,
                'fecha_nacimiento' => $request->fecha_nacimiento,
                'telefono' => $request->telefono,
                'correo' => $request->correo,
                'imagen_biometrica' => $path, // Guarda el BLOB
            ]);

            DB::commit();
            return response()->json([
                'message' => 'Usuario registrado correctamente',
                'usuario' => $usuario // Puedes incluir los datos del usuario creado
            ], 201); // Código de estado 201 (Created)
        } catch (\Exception $e) {
            // 7. Deshacer la transacción en caso de error
            DB::rollBack();

            // 8. Devolver respuesta de error
            return response()->json(['message' => 'Error al registrar usuario: ' . $e->getMessage()], 500); // Código de estado 500 (Internal Server Error)
        }
    }

    public function mostrarImagen($id)
    {
        $usuario = Usuario::find($id);
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $path = $usuario->imagen_biometrica;

        if (!$path || !Storage::disk('public')->exists($path)) { // Verifica si la imagen existe
            return response()->json(['message' => 'Imagen no encontrada para este usuario'], 404);
        }

        $file = Storage::disk('public')->get($path);
        $guesser = new MimeTypeGuesser(); // Instancia MimeTypeGuesser
        $mimeType = $guesser->guess(storage_path('app/public/' . $path)); // Obtén el tipo MIME real


        return response($file, 200)->header('Content-Type', $mimeType);
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
        $usuario = Usuario::find($id); // Busca el usuario a actualizar

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Valida los datos de entrada (similar a la función store)
        $validator = Validator::make($request->all(), [
            'nombre' => 'sometimes|required|string|max:50',
            'apellido_paterno' => 'sometimes|required|string|max:50',
            'apellido_materno' => 'nullable|string|max:50',
            'fecha_nacimiento' => 'sometimes|required|date',
            'telefono' => 'sometimes|nullable|string|max:15',
            'correo' => 'sometimes|required|email|max:100|unique:usuarios,correo,' . $usuario->id_usuario, // Ignora el correo del usuario actual
            'imagen_biometrica' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction(); // Inicia transacción

        try {
            // Si se proporciona una nueva imagen, la guarda y actualiza la ruta
            if ($request->hasFile('imagen_biometrica')) {
                // Elimina la imagen anterior si existe
                if ($usuario->imagen_biometrica && Storage::disk('public')->exists($usuario->imagen_biometrica)) {
                    Storage::disk('public')->delete($usuario->imagen_biometrica);
                }

                $file = $request->file('imagen_biometrica');
                $filename = Str::random(20) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('usuarios', $filename, 'public');
                $usuario->imagen_biometrica = $path;
            }

            $usuario->update($request->only([ // Actualiza los demás campos
                'nombre',
                'apellido_paterno',
                'apellido_materno',
                'fecha_nacimiento',
                'telefono',
                'correo',
            ]));

            DB::commit(); // Confirma transacción

            return response()->json([
                'message' => 'Usuario actualizado correctamente',
                'usuario' => $usuario
            ]);
        } catch (\Exception $e) {
        DB::rollBack(); // Revierte transacción en caso de error
        return response()->json(['message' => 'Error al actualizar usuario: ' . $e->getMessage()], 500);
        }
    }

    // Eliminar un usuario (DELETE /api/usuarios/{id})
    public function destroy($id)
    {
        $usuario = Usuario::find($id); // Busca el usuario a eliminar

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        DB::beginTransaction(); // Inicia transacción

        try {
            // Elimina la imagen asociada al usuario si existe
            if ($usuario->imagen_biometrica && Storage::disk('public')->exists($usuario->imagen_biometrica)) {
                Storage::disk('public')->delete($usuario->imagen_biometrica);
            }

            $usuario->delete(); // Elimina el usuario de la base de datos

            DB::commit(); // Confirma transacción

            return response()->json(['message' => 'Usuario eliminado correctamente']);
        } catch (\Exception $e) {
            DB::rollBack(); // Revierte transacción en caso de error
            return response()->json(['message' => 'Error al eliminar usuario: ' . $e->getMessage()], 500);
        }
    }
}