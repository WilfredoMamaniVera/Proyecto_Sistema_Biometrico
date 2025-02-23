<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Acceso;

class AccesoController extends Controller
{
    // Registrar un acceso (POST /api/accesos)
    public function store(Request $request)
    {
        $request->validate([
            'id_persona'  => 'required|exists:personas,id',
            'area_acceso' => 'required|string|max:100'
        ]);

        $acceso = Acceso::create([
            'id_persona'  => $request->id_persona,
            'area_acceso' => $request->area_acceso
        ]);

        return response()->json([
            'message' => 'Acceso registrado correctamente',
            'acceso'  => $acceso
        ], 201);
    }

    // Listar todos los accesos (GET /api/accesos)
    public function index()
    {
        $accesos = Acceso::all();
        return response()->json($accesos);
    }

    // Mostrar un acceso en particular (GET /api/accesos/{id})
    public function show($id)
    {
        $acceso = Acceso::find($id);
        if (!$acceso) {
            return response()->json(['message' => 'Acceso no encontrado'], 404);
        }
        return response()->json($acceso);
    }

    // Actualizar un acceso (PUT/PATCH /api/accesos/{id})
    public function update(Request $request, $id)
    {
        $acceso = Acceso::find($id);
        if (!$acceso) {
            return response()->json(['message' => 'Acceso no encontrado'], 404);
        }

        $request->validate([
            'id_persona'  => 'sometimes|required|exists:personas,id',
            'area_acceso' => 'sometimes|required|string|max:100'
        ]);

        $acceso->update($request->only([
            'id_persona',
            'area_acceso'
        ]));

        return response()->json([
            'message' => 'Acceso actualizado correctamente',
            'acceso'  => $acceso
        ]);
    }

    // Eliminar un acceso (DELETE /api/accesos/{id})
    public function destroy($id)
    {
        $acceso = Acceso::find($id);
        if (!$acceso) {
            return response()->json(['message' => 'Acceso no encontrado'], 404);
        }
        $acceso->delete();
        return response()->json(['message' => 'Acceso eliminado correctamente']);
    }
}
