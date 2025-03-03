<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UsuarioController extends Controller
{
    /**
     * Listar todos los usuarios (GET /api/usuarios)
     */
    public function index()
    {
        // Se incluyen las relaciones con persona, rol y departamento
        $usuarios = Usuario::with('persona', 'rol', 'departamento')->get();
        return response()->json($usuarios);
    }

    /**
     * Mostrar un usuario en particular (GET /api/usuarios/{id})
     */
    public function show($id)
    {
        $usuario = Usuario::with('persona', 'rol', 'departamento')->find($id);
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        return response()->json($usuario);
    }

    /**
     * Registrar un usuario (POST /api/usuarios)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre_usuario'   => 'required|string|max:50|unique:usuarios,nombre_usuario',
            'contraseña'       => 'required|string|min:6',
            'id_persona'       => 'required|integer|exists:personas,id',
            'id_rol'           => 'required|integer|exists:roles,id_rol',
            'id_departamento'  => 'required|integer|exists:departamentos,id_departamento'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $usuario = Usuario::create([
                'nombre_usuario'  => $request->nombre_usuario,
                'contraseña'      => bcrypt($request->contraseña),
                'id_persona'      => $request->id_persona,
                'id_rol'          => $request->id_rol,
                'id_departamento' => $request->id_departamento
            ]);

            DB::commit();
            return response()->json([
                'message' => 'Usuario registrado correctamente',
                'usuario' => $usuario
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al registrar usuario: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Actualizar un usuario (PUT/PATCH /api/usuarios/{id})
     */
    public function update(Request $request, $id)
    {
        $usuario = Usuario::find($id);
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre_usuario'   => 'sometimes|required|string|max:50|unique:usuarios,nombre_usuario,' . $usuario->id_usuario,
            'contraseña'       => 'sometimes|required|string|min:6',
            'id_persona'       => 'sometimes|required|integer|exists:personas,id',
            'id_rol'           => 'sometimes|required|integer|exists:roles,id_rol',
            'id_departamento'  => 'sometimes|required|integer|exists:departamentos,id_departamento'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            if ($request->has('nombre_usuario')) {
                $usuario->nombre_usuario = $request->nombre_usuario;
            }
            if ($request->has('contraseña')) {
                $usuario->contraseña = bcrypt($request->contraseña);
            }
            if ($request->has('id_persona')) {
                $usuario->id_persona = $request->id_persona;
            }
            if ($request->has('id_rol')) {
                $usuario->id_rol = $request->id_rol;
            }
            if ($request->has('id_departamento')) {
                $usuario->id_departamento = $request->id_departamento;
            }
            $usuario->save();

            DB::commit();
            return response()->json([
                'message' => 'Usuario actualizado correctamente',
                'usuario' => $usuario
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al actualizar usuario: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Eliminar un usuario (DELETE /api/usuarios/{id})
     */
    public function destroy($id)
    {
        $usuario = Usuario::find($id);
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        DB::beginTransaction();
        try {
            $usuario->delete();
            DB::commit();
            return response()->json(['message' => 'Usuario eliminado correctamente']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al eliminar usuario: ' . $e->getMessage()], 500);
        }
    }
}
