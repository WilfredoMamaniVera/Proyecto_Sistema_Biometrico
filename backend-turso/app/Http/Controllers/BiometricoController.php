<?php

namespace App\Http\Controllers;

use App\Models\Biometrico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BiometricoController extends Controller
{
    // Registrar una nueva imagen biométrica (POST /api/biometricos)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_persona' => 'required|exists:personas,id',
            'imagen'     => 'required|file|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Obtener el contenido binario del archivo
            $binaryImage = file_get_contents($request->file('imagen')->getRealPath());

            $biometrico = Biometrico::create([
                'id_persona' => $request->id_persona,
                'imagen'     => $binaryImage,
            ]);

            return response()->json([
                'message'    => 'Imagen biométrica registrada correctamente',
                'biometrico' => $biometrico
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al registrar imagen biométrica: ' . $e->getMessage()], 500);
        }
    }

    // Listar todos los biometricos (GET /api/biometricos)
    public function index()
    {
        $biometrico = Biometrico::all();
        return response()->json($biometrico);
    }

    // Mostrar un registro biométrico en particular (GET /api/biometricos/{id})
    public function show($id)
    {
        $biometrico = Biometrico::find($id);
        if (!$biometrico) {
            return response()->json(['message' => 'Registro biométrico no encontrado'], 404);
        }
        return response()->json($biometrico);
    }

    // Actualizar la imagen biométrica (PUT/PATCH /api/biometricos/{id})
    public function update(Request $request, $id)
    {
        $biometrico = Biometrico::find($id);
        if (!$biometrico) {
            return response()->json(['message' => 'Registro biométrico no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'imagen' => 'required|file|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $binaryImage = file_get_contents($request->file('imagen')->getRealPath());
            $biometrico->imagen = $binaryImage;
            $biometrico->save();

            return response()->json([
                'message'    => 'Imagen biométrica actualizada correctamente',
                'biometrico' => $biometrico
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar imagen biométrica: ' . $e->getMessage()], 500);
        }
    }

    // Eliminar un registro biométrico (DELETE /api/biometricos/{id})
    public function destroy($id)
    {
        $biometrico = Biometrico::find($id);
        if (!$biometrico) {
            return response()->json(['message' => 'Registro biométrico no encontrado'], 404);
        }

        try {
            $biometrico->delete();
            return response()->json(['message' => 'Registro biométrico eliminado correctamente']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar registro biométrico: ' . $e->getMessage()], 500);
        }
    }

}
