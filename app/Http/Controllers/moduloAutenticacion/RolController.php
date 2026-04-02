<?php

namespace App\Http\Controllers\moduloAutenticacion;

use App\Http\Controllers\Controller;
use Exception;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use App\Http\Controllers\moduloAutenticacion\PermisoController;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;

class RolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            if(Auth::user()->can('ver_roles') || Auth::user()->hasPermissionViaRole(PermisoController::getPermisorPorNombre('ver_roles'))){
                $role = DB::query();

                return DataTables::of($role)
                    ->editColumn('name', function($role){
                        return $role->name;
                    })
                    ->editColumn('created_at', function($role){
                        return $role->created_at->format('d/m/Y');
                    })
                    ->addColumn('actions', function(){
                        return '<button id="editarRol" class="btn btn-primary btn-sm">Editar</button> <button id="eliminarRol" class="btn btn-danger btn-sm">Eliminar</button>';
                    })
                    ->rawColumns(['actions'])
                    ->make(true);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para ver los roles',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al obtener los roles',
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
            if(Auth::user()->can('crear_roles') || Auth::user()->hasPermissionViaRole(PermisoController::getPermisorPorNombre('crear_roles'))){
                $rol = Role::create([
                    'name' => $request->name
                ]);
                return response()->json([
                    'message' => 'Rol creado correctamente',
                    'data' => $rol
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para crear roles',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al crear el rol',
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
            if(Auth::user()->can('ver_roles') || Auth::user()->hasPermissionViaRole(PermisoController::getPermisorPorNombre('ver_roles'))){
                $rol = Role::find($id);
                return response()->json([
                    'message' => 'Rol obtenido correctamente',
                    'data' => $rol
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para ver los roles',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al obtener el rol',
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
            if(Auth::user()->can('actualizar_roles') || Auth::user()->hasPermissionViaRole(PermisoController::getPermisorPorNombre('actualizar_roles'))){
                $rol = Role::find($id);
                $rol->update([
                    'name' => $request->name
                ]);
                return response()->json([
                    'message' => 'Rol actualizado correctamente',
                    'data' => $rol
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para actualizar los roles',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al actualizar el rol',
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
            if(Auth::user()->can('eliminar_roles') || Auth::user()->hasPermissionViaRole(PermisoController::getPermisorPorNombre('eliminar_roles'))){
                $rol = Role::find($id);
                $rol->delete();
                return response()->json([
                    'message' => 'Rol eliminado correctamente',
                    'data' => $rol
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para eliminar los roles',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al eliminar el rol',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function assignPermissionRole(Request $request)
    {
        try{
            $rol = Role::find($request->role_id);
            $rol->givePermissionTo($request->permission_id);
            app()[PermissionRegistrar::class]->forgetCachedPermissions();
            return response()->json([
                'message' => 'Permiso asignado correctamente',
                'data' => $rol
            ], 200);
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al asignar el permiso',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function removePermissionRole(Request $request)
    {
        try{
            $rol = Role::find($request->role_id);
            $rol->revokePermissionTo($request->permission_id);
            app()[PermissionRegistrar::class]->forgetCachedPermissions();
            return response()->json([
                'message' => 'Permiso eliminado correctamente',
                'data' => $rol
            ], 200);
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al eliminar el permiso',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
