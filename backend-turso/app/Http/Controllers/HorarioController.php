<?php

namespace App\Http\Controllers;

use App\Models\Horario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class HorarioController extends Controller
{
    /**
     * Listar todos los horarios (GET /api/horarios)
     */
    public function index()
    {
        $horarios = Horario::with('departamento')->get();
        return response()->json($horarios);
    }

    /**
     * Mostrar un horario en particular (GET /api/horarios/{id})
     */
    public function show($id)
    {
        $horario = Horario::with('departamento')->find($id);
        if (!$horario) {
            return response()->json(['message' => 'Horario no encontrado'], 404);
        }
        return response()->json($horario);
    }

    /**
     * Registrar un nuevo horario (POST /api/horarios)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'horario_ingreso'   => 'required|date_format:H:i:s',
            'horario_salida'    => 'required|date_format:H:i:s',
            'horario_descanso'  => 'nullable|date_format:H:i:s',
            'id_departamento'   => 'required|exists:departamentos,id_departamento'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $horario = Horario::create([
                'horario_ingreso'   => $request->horario_ingreso,
                'horario_salida'    => $request->horario_salida,
                'horario_descanso'  => $request->horario_descanso,
                'id_departamento'   => $request->id_departamento,
            ]);
            DB::commit();

            return response()->json([
                'message'  => 'Horario creado correctamente',
                'horario'  => $horario
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al crear horario: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Actualizar un horario (PUT/PATCH /api/horarios/{id})
     */
    public function update(Request $request, $id)
    {
        $horario = Horario::find($id);
        if (!$horario) {
            return response()->json(['message' => 'Horario no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'horario_ingreso'   => 'sometimes|required|date_format:H:i:s',
            'horario_salida'    => 'sometimes|required|date_format:H:i:s',
            'horario_descanso'  => 'sometimes|nullable|date_format:H:i:s',
            'id_departamento'   => 'sometimes|required|exists:departamentos,id_departamento'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            if ($request->has('horario_ingreso')) {
                $horario->horario_ingreso = $request->horario_ingreso;
            }
            if ($request->has('horario_salida')) {
                $horario->horario_salida = $request->horario_salida;
            }
            if ($request->has('horario_descanso')) {
                $horario->horario_descanso = $request->horario_descanso;
            }
            if ($request->has('id_departamento')) {
                $horario->id_departamento = $request->id_departamento;
            }
            $horario->save();

            DB::commit();
            return response()->json([
                'message'  => 'Horario actualizado correctamente',
                'horario'  => $horario
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al actualizar horario: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Eliminar un horario (DELETE /api/horarios/{id})
     */
    public function destroy($id)
    {
        $horario = Horario::find($id);
        if (!$horario) {
            return response()->json(['message' => 'Horario no encontrado'], 404);
        }

        DB::beginTransaction();
        try {
            $horario->delete();
            DB::commit();
            return response()->json(['message' => 'Horario eliminado correctamente']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al eliminar horario: ' . $e->getMessage()], 500);
        }
    }
}
