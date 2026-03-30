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
});


