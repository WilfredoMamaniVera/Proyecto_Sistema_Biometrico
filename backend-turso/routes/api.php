<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\AccesoController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\BiometricoController;
use App\Http\Controllers\RegistroController;
use App\Http\Controllers\DepartamentoController;
use App\Http\Controllers\HorarioController;


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

// Rutas de Persona (CRUD)
Route::post('/personas', [PersonaController::class, 'store']);
Route::get('/personas', [PersonaController::class, 'index']);
Route::get('/personas/{id}', [PersonaController::class, 'show']);
Route::put('/personas/{id}', [PersonaController::class, 'update']);
Route::patch('/personas/{id}', [PersonaController::class, 'update']);
Route::delete('/personas/{id}', [PersonaController::class, 'destroy']);

// Rutas de Rol (CRUD)
Route::post('/roles', [RolController::class, 'store']);
Route::get('/roles', [RolController::class, 'index']);
Route::get('/roles/{id}', [RolController::class, 'show']);
Route::put('/roles/{id}', [RolController::class, 'update']);
Route::patch('/roles/{id}', [RolController::class, 'update']);
Route::delete('/roles/{id}', [RolController::class, 'destroy']);

// Rutas de Biometrico (CRUD)
Route::post('/biometricos', [BiometricoController::class, 'store']);
Route::get('/biometricos', [BiometricoController::class, 'index']); // Asegúrate de implementar este método en el controlador
Route::get('/biometricos/{id}', [BiometricoController::class, 'show']);
Route::put('/biometricos/{id}', [BiometricoController::class, 'update']);
Route::patch('/biometricos/{id}', [BiometricoController::class, 'update']);
Route::delete('/biometricos/{id}', [BiometricoController::class, 'destroy']);

// Rutas para registros
Route::post('/registros', [RegistroController::class, 'store']);
Route::get('/registros', [RegistroController::class, 'index']);
Route::get('/registros/{id}', [RegistroController::class, 'show']);
Route::put('/registros/{id}', [RegistroController::class, 'update']);
Route::patch('/registros/{id}', [RegistroController::class, 'update']);
Route::delete('/registros/{id}', [RegistroController::class, 'destroy']);

// Rutas para departamentos
Route::post('/departamentos', [DepartamentoController::class, 'store']);
Route::get('/departamentos', [DepartamentoController::class, 'index']);
Route::get('/departamentos/{id}', [DepartamentoController::class, 'show']);
Route::put('/departamentos/{id}', [DepartamentoController::class, 'update']);
Route::patch('/departamentos/{id}', [DepartamentoController::class, 'update']);
Route::delete('/departamentos/{id}', [DepartamentoController::class, 'destroy']);

// Rutas para horarios
Route::post('/horarios', [HorarioController::class, 'store']);
Route::get('/horarios', [HorarioController::class, 'index']);
Route::get('/horarios/{id}', [HorarioController::class, 'show']);
Route::put('/horarios/{id}', [HorarioController::class, 'update']);
Route::patch('/horarios/{id}', [HorarioController::class, 'update']);
Route::delete('/horarios/{id}', [HorarioController::class, 'destroy']);