<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Departamento;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DepartamentoController extends Controller
{
    /**
     * Listar todos los departamentos (GET /api/departamentos)
     */
    public function index()
    {
        // Se incluye la relación con "usuarios" para obtener los usuarios asociados a cada departamento
        $departamentos = Departamento::with('usuarios')->get();
        return response()->json($departamentos);
    }

    /**
     * Mostrar un departamento en particular (GET /api/departamentos/{id})
     */
    public function show($id)
    {
        $departamento = Departamento::with('usuarios')->find($id);
        if (!$departamento) {
            return response()->json(['message' => 'Departamento no encontrado'], 404);
        }
        return response()->json($departamento);
    }

    /**
     * Registrar un nuevo departamento (POST /api/departamentos)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre_departamento'      => 'required|string|max:100|unique:departamentos,nombre_departamento',
            'descripcion_departamento' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $departamento = Departamento::create([
                'nombre_departamento'      => $request->nombre_departamento,
                'descripcion_departamento' => $request->descripcion_departamento,
            ]);

            DB::commit();
            return response()->json([
                'message'      => 'Departamento creado correctamente',
                'departamento' => $departamento
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al crear departamento: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Actualizar un departamento (PUT/PATCH /api/departamentos/{id})
     */
    public function update(Request $request, $id)
    {
        $departamento = Departamento::find($id);
        if (!$departamento) {
            return response()->json(['message' => 'Departamento no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre_departamento'      => 'sometimes|required|string|max:100|unique:departamentos,nombre_departamento,' . $departamento->id_departamento,
            'descripcion_departamento' => 'sometimes|nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            if ($request->has('nombre_departamento')) {
                $departamento->nombre_departamento = $request->nombre_departamento;
            }
            if ($request->has('descripcion_departamento')) {
                $departamento->descripcion_departamento = $request->descripcion_departamento;
            }
            $departamento->save();

            DB::commit();
            return response()->json([
                'message'      => 'Departamento actualizado correctamente',
                'departamento' => $departamento
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al actualizar departamento: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Eliminar un departamento (DELETE /api/departamentos/{id})
     */
    public function destroy($id)
    {
        $departamento = Departamento::find($id);
        if (!$departamento) {
            return response()->json(['message' => 'Departamento no encontrado'], 404);
        }

        DB::beginTransaction();
        try {
            $departamento->delete();
            DB::commit();
            return response()->json(['message' => 'Departamento eliminado correctamente']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al eliminar departamento: ' . $e->getMessage()], 500);
        }
    }
}
