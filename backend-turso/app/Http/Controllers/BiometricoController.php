<?php

namespace App\Http\Controllers;

use App\Models\Biometrico;
use App\Models\Persona;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BiometricoController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_persona' => 'required|exists:personas,id',
            'imagen'     => 'required|file|mimes:jpeg,png,jpg,gif|max:2048',
            'descriptor' => 'required|json'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $binaryImage = file_get_contents($request->file('imagen')->getRealPath());
            $biometrico = Biometrico::create([
                'id_persona' => $request->id_persona,
                'imagen'     => $binaryImage,
                'descriptor' => $request->descriptor
            ]);

            return response()->json([
                'message'    => 'Imagen biométrica registrada correctamente',
                'biometrico' => $biometrico
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al registrar imagen biométrica: ' . $e->getMessage()], 500);
        }
    }

    public function index()
    {
        $biometricos = Biometrico::all();
        return response()->json($biometricos);
    }

    public function show($id)
    {
        $biometrico = Biometrico::find($id);
        if (!$biometrico) {
            return response()->json(['message' => 'Registro biométrico no encontrado'], 404);
        }
        return response()->json($biometrico);
    }

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

    // Nuevo método para autenticación facial
    public function authenticateFace(Request $request)
    {
    $validator = Validator::make($request->all(), [
        'descriptor' => 'required|array|size:128'
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    try {
        $inputDescriptor = $request->input('descriptor');
        $biometricos = Biometrico::with('persona')->get();

        foreach ($biometricos as $biometrico) {
            $storedDescriptor = json_decode($biometrico->descriptor, true);
            if ($this->compareDescriptors($inputDescriptor, $storedDescriptor)) {
                $persona = $biometrico->persona;
                $usuario = Usuario::where('id_persona', $persona->id)->first();

                if (!$usuario) {
                    return response()->json(['message' => 'Usuario no encontrado'], 404);
                }

                $token = base64_encode("{$usuario->id_usuario}:" . time());
                return response()->json([
                    'token' => $token,
                    'persona' => $persona,
                    'usuario' => $usuario,
                    'message' => 'Autenticación facial exitosa'
                ]);
            }
        }

        return response()->json(['message' => 'No se encontró coincidencia facial'], 401);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error al procesar la autenticación facial: ' . $e->getMessage()], 500);
    }
    }

    // Método para comparar descriptores usando distancia euclidiana
    private function compareDescriptors($desc1, $desc2, $threshold = 0.6)
    {
        if (!$desc1 || !$desc2 || count($desc1) !== count($desc2)) {
            return false;
        }
        $distance = 0;
        foreach (array_map(null, $desc1, $desc2) as [$a, $b]) {
            $distance += pow($a - $b, 2);
        }
        $distance = sqrt($distance);
        return $distance < $threshold;
    }

    // Método simulado para generar descriptor (esto debe hacerse en el frontend)
    private function generateDescriptorFromBinary($binaryImage)
    {
        // NOTA: En un entorno real, necesitarías una librería PHP como OpenCV o ejecutar un script JS
        // Aquí asumimos que el descriptor viene del frontend, pero para completar el ejemplo:
        // Este método no es funcional en PHP puro sin una extensión adecuada.
        // El descriptor real se genera en el frontend con face-api.js
        return null; // Placeholder, el descriptor debe generarse en el frontend
    }
}