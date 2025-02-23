<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PersonaController extends Controller
{
    // Listar todas las personas (GET /api/personas)
    public function index()
    {
        $personas = Persona::all();
        return response()->json($personas);
    }

    // Mostrar una persona en particular (GET /api/personas/{id})
    public function show($id)
    {
        $persona = Persona::find($id);
        if (!$persona) {
            return response()->json(['message' => 'Persona no encontrada'], 404);
        }
        return response()->json($persona);
    }

    // Registrar una nueva persona (POST /api/personas)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre'             => 'required|string|max:50',
            'apellido_paterno'   => 'required|string|max:50',
            'apellido_materno'   => 'required|string|max:50',
            'fecha_nacimiento'   => 'nullable|date',
            'telefono'           => 'nullable|string|max:15',
            'correo'             => 'required|email|max:100|unique:personas,correo'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $persona = Persona::create([
                'nombre'             => $request->nombre,
                'apellido_paterno'   => $request->apellido_paterno,
                'apellido_materno'   => $request->apellido_materno,
                'fecha_nacimiento'   => $request->fecha_nacimiento,
                'telefono'           => $request->telefono,
                'correo'             => $request->correo
            ]);

            DB::commit();
            return response()->json([
                'message' => 'Persona registrada correctamente',
                'persona' => $persona
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al registrar persona: ' . $e->getMessage()], 500);
        }
    }

    // Actualizar una persona (PUT/PATCH /api/personas/{id})
    public function update(Request $request, $id)
    {
        $persona = Persona::find($id);
        if (!$persona) {
            return response()->json(['message' => 'Persona no encontrada'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre'             => 'sometimes|required|string|max:50',
            'apellido_paterno'   => 'sometimes|required|string|max:50',
            'apellido_materno'   => 'sometimes|required|string|max:50',
            'fecha_nacimiento'   => 'sometimes|nullable|date',
            'telefono'           => 'sometimes|nullable|string|max:15',
            'correo'             => 'sometimes|required|email|max:100|unique:personas,correo,' . $persona->id
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $persona->update($request->only([
                'nombre',
                'apellido_paterno',
                'apellido_materno',
                'fecha_nacimiento',
                'telefono',
                'correo'
            ]));

            return response()->json([
                'message' => 'Persona actualizada correctamente',
                'persona' => $persona
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar persona: ' . $e->getMessage()], 500);
        }
    }

    // Eliminar una persona (DELETE /api/personas/{id})
    public function destroy($id)
    {
        $persona = Persona::find($id);
        if (!$persona) {
            return response()->json(['message' => 'Persona no encontrada'], 404);
        }

        try {
            $persona->delete();
            return response()->json(['message' => 'Persona eliminada correctamente']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar persona: ' . $e->getMessage()], 500);
        }
    }
}
