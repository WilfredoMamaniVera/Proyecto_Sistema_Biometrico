<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Registro;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RegistroController extends Controller
{
    /**
     * Listar todos los registros (GET /api/registros)
     */
    public function index()
    {
        $registros = Registro::with('usuario')->get();
        return response()->json($registros);
    }

    /**
     * Mostrar un registro en particular (GET /api/registros/{id})
     */
    public function show($id)
    {
        $registro = Registro::with('usuario')->find($id);
        if (!$registro) {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }
        return response()->json($registro);
    }

    /**
     * Registrar un nuevo registro (POST /api/registros)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_usuario' => 'required|exists:usuarios,id_usuario',
            'estado'     => 'required|in:activo,inactivo'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $registro = Registro::create([
                // 'fecha_ingreso' se asigna automáticamente con CURRENT_TIMESTAMP.
                'id_usuario' => $request->id_usuario,
                'estado'     => $request->estado,
            ]);
            DB::commit();
            return response()->json([
                'message'  => 'Registro creado correctamente',
                'registro' => $registro
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al crear registro: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Actualizar un registro (PUT/PATCH /api/registros/{id})
     */
    public function update(Request $request, $id)
    {
        $registro = Registro::find($id);
        if (!$registro) {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'id_usuario' => 'sometimes|required|exists:usuarios,id_usuario',
            'estado'     => 'sometimes|required|in:activo,inactivo'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            if ($request->has('id_usuario')) {
                $registro->id_usuario = $request->id_usuario;
            }
            if ($request->has('estado')) {
                $registro->estado = $request->estado;
            }
            $registro->save();

            DB::commit();
            return response()->json([
                'message'  => 'Registro actualizado correctamente',
                'registro' => $registro
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al actualizar registro: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Eliminar un registro (DELETE /api/registros/{id})
     */
    public function destroy($id)
    {
        $registro = Registro::find($id);
        if (!$registro) {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }

        DB::beginTransaction();
        try {
            $registro->delete();
            DB::commit();
            return response()->json(['message' => 'Registro eliminado correctamente']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al eliminar registro: ' . $e->getMessage()], 500);
        }
    }
}
