<?php

namespace App\Http\Controllers;

use App\Models\Modulo;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ModuloController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            if(Auth::user()->hasRole('admin')){
                $modulos = Modulo::all();
                return response()->json([
                    'message' => 'Modulos obtenidos correctamente',
                    'data' => $modulos
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para ver los modulos',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al obtener los modulos',
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
                $modulo = Modulo::create([
                    'nombre' => $request->nombre
                ]);
                return response()->json([
                    'message' => 'Modulo creado correctamente',
                    'data' => $modulo
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para crear modulos',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al crear el modulo',
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
                $modulo = Modulo::find($id);
                return response()->json([
                    'message' => 'Modulo obtenido correctamente',
                    'data' => $modulo
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para ver los modulos',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al obtener el modulo',
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
                $modulo = Modulo::find($id);
                $modulo->update([
                    'nombre' => $request->nombre
                ]);
                return response()->json([
                    'message' => 'Modulo actualizado correctamente',
                    'data' => $modulo
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para actualizar los modulos',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al actualizar el modulo',
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
                $modulo = Modulo::find($id);
                $modulo->delete();
                return response()->json([
                    'message' => 'Modulo eliminado correctamente',
                    'data' => null
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No tienes permiso para eliminar los modulos',
                    'data' => null
                ], 403);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al eliminar el modulo',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
