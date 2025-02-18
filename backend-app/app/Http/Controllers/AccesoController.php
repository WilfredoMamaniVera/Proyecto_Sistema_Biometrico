<?php

// app/Http/Controllers/AccesoController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Acceso;

class AccesoController extends Controller
{
    // Registra un evento de acceso
    public function store(Request $request)
    {
        $request->validate([
            'id_usuario' => 'required|exists:usuarios,id_usuario',
            'tipo_acceso' => 'required|in:entrada,salida',
            'area_acceso' => 'required|string|max:100'
        ]);

        $acceso = Acceso::create([
            'id_usuario' => $request->id_usuario,
            'tipo_acceso' => $request->tipo_acceso,
            'area_acceso' => $request->area_acceso
        ]);

        return response()->json([
            'message' => 'Acceso registrado correctamente',
            'acceso' => $acceso
        ], 201);
    }
    public function index()
    {
        $accesos = Acesso::all(); // Obtiene todos los accesos de la base de datos
        return response()->json($accesos);
    }
}

