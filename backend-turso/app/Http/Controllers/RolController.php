<?php

namespace App\Http\Controllers;

use App\Models\Rol;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RolController extends Controller
{
    // Listar todos los roles (GET /api/roles)
    public function index()
    {
        $roles = Rol::all();
        return response()->json($roles);
    }

    // Mostrar un rol en particular (GET /api/roles/{id})
    public function show($id)
    {
        $rol = Rol::find($id);
        if (!$rol) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }
        return response()->json($rol);
    }

    // Registrar un nuevo rol (POST /api/roles)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre_de_rol' => 'required|string|unique:roles,nombre_de_rol'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $rol = Rol::create([
            'nombre_de_rol' => $request->nombre_de_rol
        ]);

        return response()->json([
            'message' => 'Rol creado exitosamente',
            'rol'     => $rol
        ], 201);
    }

    // Actualizar un rol (PUT/PATCH /api/roles/{id})
    public function update(Request $request, $id)
    {
        $rol = Rol::find($id);
        if (!$rol) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre_de_rol' => 'required|string|unique:roles,nombre_de_rol,' . $rol->id_rol
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $rol->update($request->only('nombre_de_rol'));

        return response()->json([
            'message' => 'Rol actualizado correctamente',
            'rol'     => $rol
        ]);
    }

    // Eliminar un rol (DELETE /api/roles/{id})
    public function destroy($id)
    {
        $rol = Rol::find($id);
        if (!$rol) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        $rol->delete();
        return response()->json(['message' => 'Rol eliminado correctamente']);
    }
}
