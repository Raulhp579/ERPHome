<?php

namespace App\Http\Controllers\moduloAutenticacion;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\moduloAutenticacion\PermisoController;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            if(Auth::user()->can('ver_usuarios') || Auth::user()->hasPermissionViaRole(PermisoController::getPermisorPorNombre('ver_usuarios'))){
                $usuarios = User::all();
                return response()->json([
                    'message' => 'Usuarios obtenidos correctamente',
                    'data' => $usuarios
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para ver los usuarios',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al obtener los usuarios',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            if(Auth::user()->can('crear_usuarios') || Auth::user()->hasPermissionViaRole(PermisoController::getPermisorPorNombre('crear_usuarios'))){
                $usuario = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password)
                ]);
                return response()->json([
                    'message' => 'Usuario creado correctamente',
                    'data' => $usuario
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para crear usuarios',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al crear el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
            if(Auth::user()->can('ver_usuarios') || Auth::user()->hasPermissionViaRole(PermisoController::getPermisorPorNombre('ver_usuarios'))){
                $usuario = User::find($id);
                return response()->json([
                    'message' => 'Usuario obtenido correctamente',
                    'data' => $usuario
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para ver los usuarios',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al obtener el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try{
            if(Auth::user()->can('actualizar_usuarios') || Auth::user()->hasPermissionViaRole(PermisoController::getPermisorPorNombre('actualizar_usuarios'))){
                $usuario = User::find($id);
                $usuario->update([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password)
                ]);
                return response()->json([
                    'message' => 'Usuario actualizado correctamente',
                    'data' => $usuario
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para actualizar los usuarios',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al actualizar el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            if(Auth::user()->can('eliminar_usuarios') || Auth::user()->hasPermissionViaRole(PermisoController::getPermisorPorNombre('eliminar_usuarios'))){
                $usuario = User::find($id);
                $usuario->delete();
                return response()->json([
                    'message' => 'Usuario eliminado correctamente',
                    'data' => $usuario
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para eliminar los usuarios',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al eliminar el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
