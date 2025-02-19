<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\AccesoController;

Route::get('/ping', function () {
    return response()->json(['message' => 'API funcionando']);
});

// Rutas de Usuario (CRUD)
Route::post('/usuarios', [UsuarioController::class, 'store']);
Route::get('/usuarios', [UsuarioController::class, 'index']);
Route::get('/usuarios/{id}', [UsuarioController::class, 'show']);
Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
Route::patch('/usuarios/{id}', [UsuarioController::class, 'update']);
Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']);

// Rutas de Acceso (CRUD)
Route::post('/accesos', [AccesoController::class, 'store']);
Route::get('/accesos', [AccesoController::class, 'index']);
Route::get('/accesos/{id}', [AccesoController::class, 'show']);
Route::put('/accesos/{id}', [AccesoController::class, 'update']);
Route::patch('/accesos/{id}', [AccesoController::class, 'update']);
Route::delete('/accesos/{id}', [AccesoController::class, 'destroy']);