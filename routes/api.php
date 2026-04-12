<?php

use App\Http\Controllers\moduloAutenticacion\AuthController;
use App\Http\Controllers\moduloAutenticacion\PermisoController;
use App\Http\Controllers\moduloAutenticacion\RolController;
use App\Http\Controllers\moduloAutenticacion\UserController;
use App\Http\Controllers\ModuloController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('user', UserController::class);
    Route::apiResource('rol', RolController::class);
    Route::apiResource('permiso', PermisoController::class);
    Route::apiResource('modulo', ModuloController::class);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('permiso/modulo/{id}', [PermisoController::class, 'getPermisoPorModulo']);
    Route::get('permiso/usuario/{id}', [PermisoController::class, 'getPermisosDeUnUsuario']);
    Route::post('permiso/asignar/{idUser}', [PermisoController::class, 'asignarPermisoUsuario']);
    Route::post('permiso/quitar/{idUser}', [PermisoController::class, 'quitarPermisoUsuario']);
    Route::get('rol/usuario/{id}', [RolController::class, 'obtenerRolUsuario']);
    Route::put('rol/usuario/{id}', [RolController::class, 'updateRolUsuario']);
    Route::get('permiso/rol/{id}', [PermisoController::class, 'getPermisosRol']);
    Route::post('permiso/asignar-rol/{idRol}', [PermisoController::class, 'asignarPermisoRol']);
    Route::post('permiso/quitar-rol/{idRol}', [PermisoController::class, 'quitarPermisoRol']);
    Route::get('me', [AuthController::class, 'me']);
    Route::put('cambiar-contrasena', [AuthController::class, 'cambiarContrasenya']);
});


