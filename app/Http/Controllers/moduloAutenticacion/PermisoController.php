<?php

namespace App\Http\Controllers\moduloAutenticacion;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermisoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            if(Auth::user()->hasRole('admin')){
                $permisos = Permission::all();
                return response()->json([
                    'message' => 'Permisos obtenidos correctamente',
                    'data' => $permisos
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para ver los permisos',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al obtener los permisos',
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
            if(Auth::user()->hasRole('admin')){
                app()[PermissionRegistrar::class]->forgetCachedPermissions();
                $permiso = Permission::create([
                    'name' => $request->name
                ]);
                $rol = Role::where('name', 'admin')->first();
                $rol->givePermissionTo($permiso);
                app()[PermissionRegistrar::class]->forgetCachedPermissions();
                return response()->json([
                    'message' => 'Permiso creado correctamente',
                    'data' => $permiso
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para crear permisos',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al crear el permiso',
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
            if(Auth::user()->hasRole('admin')){
                $permiso = Permission::find($id);
                return response()->json([
                    'message' => 'Permiso obtenido correctamente',
                    'data' => $permiso
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para ver los permisos',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al obtener el permiso',
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
            if(Auth::user()->hasRole('admin')){
                $permiso = Permission::find($id);
                $permiso->update([
                    'name' => $request->name
                ]);
                app()[PermissionRegistrar::class]->forgetCachedPermissions();
                return response()->json([
                    'message' => 'Permiso actualizado correctamente',
                    'data' => $permiso
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para actualizar los permisos',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al actualizar el permiso',
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
            if(Auth::user()->hasRole('admin')){
                $permiso = Permission::find($id);
                $permiso->delete();
                app()[PermissionRegistrar::class]->forgetCachedPermissions();
                return response()->json([
                    'message' => 'Permiso eliminado correctamente',
                    'data' => $permiso
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para eliminar los permisos',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al eliminar el permiso',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public static function getPermisorPorNombre(string $nombre)
    {
        try{
            $permiso = Permission::where('name', $nombre)->first();
            return $permiso;
        }catch(Exception $e){
            return $e->getMessage();
        }
    }

    public function getPermisoPorModulo(string $id){
        try{
            $permisos = Permission::where('id_modulo', $id)->get();
            return response()->json([
                'message' => 'Permisos obtenidos correctamente',
                'data' => $permisos
            ], 200);
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al obtener los permisos',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
