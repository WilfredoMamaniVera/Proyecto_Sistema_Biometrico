<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\AccesoController;

// Ruta de prueba
Route::get('/ping', function () {
    return response()->json(['message' => 'API funcionando'], 200);
});

// Rutas para Usuarios
Route::post('/usuarios', [UsuarioController::class, 'store']); // Registrar usuario
Route::get('/usuarios', [UsuarioController::class, 'index']);
Route::get('/usuarios/{id}', [UsuarioController::class, 'show']); // Obtener usuario por ID

// Rutas para Accesos
Route::post('/accesos', [AccesoController::class, 'store']); // Registrar acceso
Route::get('/accesos', [UsuarioController::class, 'index']);
Route::get('/accesos/{id_usuario}', [AccesoController::class, 'showByUser']); // Obtener accesos de un usuario
