<?php

namespace App\Http\Controllers\moduloAutenticacion;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\moduloAutenticacion\PermisoController;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            if(Auth::user()->can('ver_usuarios') || Auth::user()->hasPermissionViaRole(PermisoController::getPermisorPorNombre('ver_usuarios'))){
                $usuarios = User::query();

                return DataTables::of($usuarios)
                    ->editColumn('name', function($usuario){
                        return $usuario->name;
                    })
                    ->editColumn('email', function($usuario){
                        return $usuario->email;
                    })
                    ->editColumn('rol', function($usuario){
                        return $usuario->roles->first()->name ?? 'Sin Rol';
                    })
                    ->editColumn('created_at', function($usuario){
                        return $usuario->created_at->format('d/m/Y');
                    })
                    ->addColumn('actions', function($usuario){
                        return '<div class="action-buttons">
                            <button class="btn-icon edit" title="Editar" data-id="'.$usuario->id.'">
                                <i class="material-icons">edit_note</i>
                            </button>
                            <button class="btn-icon delete" title="Eliminar" data-id="'.$usuario->id.'">
                                <i class="material-icons">delete_outline</i>
                            </button>
                        </div>';
                    })
                    ->rawColumns(['actions'])
                    ->make(true);
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
                $usuario->assignRole($request->rol);
                $usuario->refresh();
                $user = [
                    "id"=>$usuario->id,
                    "name"=>$usuario->name,
                    "email"=>$usuario->email,
                    "password"=>$usuario->password,
                    "rol"=>$usuario->roles->first()->name??""
                ];
                return response()->json([
                    'message' => 'Usuario creado correctamente',
                    'data' => $user
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
                $user = [
                    "id"=>$usuario->id,
                    "name"=>$usuario->name,
                    "email"=>$usuario->email,
                    "password"=>$usuario->password,
                    "rol"=>$usuario->roles->first()->name??""
                ];
                return response()->json([
                    'message' => 'Usuario obtenido correctamente',
                    'data' => $user
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
                if(isset($request->password)){
                    $usuario->update([
                        'name' => $request->name,
                        'email' => $request->email,
                        'password' => Hash::make($request->password)
                    ]);
                }else{
                    $usuario->update([
                        'name' => $request->name,
                        'email' => $request->email
                    ]);
                }

                if(isset($request->rol)){
                    $usuario->roles()->detach();
                    $usuario->assignRole($request->rol);
                }else{
                    $usuario->roles()->detach();
                }

                $usuario->refresh();

                $user = [
                    "id"=>$usuario->id,
                    "name"=>$usuario->name,
                    "email"=>$usuario->email,
                    "password"=>$usuario->password,
                    "rol"=>$usuario->roles->first()->name??""
                ];
                return response()->json([
                    'message' => 'Usuario actualizado correctamente',
                    'data' => $user
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
