<?php

namespace App\Http\Controllers\modulomovimiento;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\modulomovimiento\Movimiento;
use Carbon\Carbon;
class MovimientoController extends Controller
{
    public function index(Request $request)
    {
        try {
            if (Auth::user()->can('ver_movimiento')) {
                $query = Movimiento::query()
                ->with('user');

                if ($request->has('tipo')) {
                    $query->where('tipo', $request->tipo);
                }
                if ($request->has('fecha_inicio')) {
                    $query->where('created_at', '>=', $request->fecha_inicio);
                }
                if ($request->has('fecha_fin')) {
                    $query->where('created_at', '<=', $request->fecha_fin . ' 23:59:59');
                }

                if ($request->has('cantidad_min')) {
                    $query->where('cantidad', '>=', $request->cantidad_min);
                }
                if ($request->has('cantidad_max')) {
                    $query->where('cantidad', '<=', $request->cantidad_max);
                }

                $query->orderBy('created_at', 'desc');
                return response()->json($query->paginate(10));
            }else{
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para ver los movimientos',
                ], 403);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los movimientos',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            if (Auth::user()->can('crear_movimiento')) {
                $validar = Validator::make($request->all(), [
                    'cantidad'=> 'numeric|required',
                    'categoria'=>'string|required',
                    'tipo'=> 'in:INGRESO,GASTO|required',
                    'fecha'=> 'required|date',
                ],
                [
                    'cantidad.required'=>'La cantidad es requerida',
                    'cantidad.numeric'=>'La cantidad debe ser un numero',
                    'categoria.required'=>'La categoria es requerida',
                    'categoria.string'=>'La categoria debe ser un texto',
                    'tipo.required'=>'El tipo es requerido',
                    'tipo.in'=>'El tipo debe ser INGRESO o GASTO',
                    'fecha.required'=>'La fecha es requerida',
                    'fecha.date'=>'La fecha debe ser valida',
                ]
            );

            if($validar->fails()){
                return response()->json([
                    'success' => false,
                    'message' => 'Error al validar los datos',
                    'error' => $validar->errors(),
                ], 400);
            }

            $movimiento = new Movimiento();
            $movimiento->cantidad = $request->cantidad;
            $request->otros ? $movimiento->categoria = $request->otros : $movimiento->categoria = $request->categoria;
            $movimiento->tipo = $request->tipo;
            $movimiento->fecha = Carbon::parse($request->fecha)->toDateString();
            $movimiento->user_id = Auth::user()->id;
            $movimiento->historial = [[
                'fecha'=> now()->toDayDateTimeString(),
                'accion'=>'creacion',
                'usuario'=>Auth::user()->name
            ]];
            $movimiento->save();
            return response()->json($movimiento);
            }else{
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para crear movimientos',
                ], 403);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el movimiento',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            if (Auth::user()->can('ver_movimiento')) {
                $movimiento = Movimiento::find($id);
                if($movimiento){
                    return response()->json($movimiento);
                }else{
                    return response()->json([
                        'success' => false,
                        'message' => 'Movimiento no encontrado',
                    ], 404);
                }
            }else{
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para ver el movimiento',
                ], 403);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el movimiento',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            if (Auth::user()->can('actualizar_movimiento')) {
                $movimiento = Movimiento::find($id);
                if ($movimiento) {
                    $validar = Validator::make(
                        $request->all(),
                        [
                            'cantidad' => 'numeric|required',
                            'descripcion' => 'string|required',
                            'tipo' => 'in:INGRESO,GASTO|required',
                        ],
                        [
                            'cantidad.required' => 'La cantidad es requerida',
                            'cantidad.numeric' => 'La cantidad debe ser un numero',
                            'descripcion.required' => 'La descripcion es requerida',
                            'descripcion.string' => 'La descripcion debe ser un texto',
                            'tipo.required' => 'El tipo es requerido',
                            'tipo.in' => 'El tipo debe ser INGRESO o GASTO',
                        ]
                    );

                    if ($validar->fails()) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Error al validar los datos',
                            'error' => $validar->errors(),
                        ], 400);
                    }

                    $movimiento->cantidad = $request->cantidad;
                    $movimiento->descripcion = $request->descripcion;
                    $movimiento->tipo = $request->tipo;
                    $movimiento->user_id = Auth::user()->id;
                    $historial = $movimiento->historial ?? [];
                    array_push($historial, [
                        'fecha' => now()->toDayDateTimeString(),
                        'accion' => 'actualizacion',
                        'usuario' => Auth::user()->name
                    ]);
                    $movimiento->historial = $historial;

                    $movimiento->save();
                    return response()->json($movimiento);
                }else{
                    return response()->json([
                        'success' => false,
                        'message' => 'Movimiento no encontrado',
                    ], 404);
                }
            }else{
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para actualizar el movimiento',
                ], 403);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el movimiento',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            if (Auth::user()->can('eliminar_movimiento')) {
                $movimiento = Movimiento::find($id);
                if($movimiento){
                    $movimiento->delete();
                    return response()->json([
                        'success' => true,
                        'message' => 'Movimiento eliminado exitosamente',
                    ]);
                }else{
                    return response()->json([
                        'success' => false,
                        'message' => 'Movimiento no encontrado',
                    ], 404);
                }
            }else{
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para eliminar el movimiento',
                ], 403);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el movimiento',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function getTotalIngresos(Request $request){
        try {
            $validar = Validator::make($request->all(), [
                'fecha_inicio' => 'date',
                'fecha_fin' => 'date|after_or_equal:fecha_inicio',
            ],
            [
                'fecha_inicio.date' => 'La fecha de inicio debe ser una fecha valida',
                'fecha_fin.date' => 'La fecha de fin debe ser una fecha valida',
                'fecha_fin.after_or_equal' => 'La fecha de fin debe ser mayor o igual a la fecha de inicio',
            ]
        );
            if ($validar->fails()) {
                return response()->json(['success' => false, 'error' => $validar->errors()], 400);
            }

            if (Auth::user()->can('ver_movimiento')) {
                $query = Movimiento::where('tipo', 'INGRESO');
                if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
                    $query->whereBetween('created_at', [$request->fecha_inicio, $request->fecha_fin . ' 23:59:59']);
                } else if ($request->has('fecha_inicio')) {
                    $query->where('created_at', '>=', $request->fecha_inicio);
                } else if ($request->has('fecha_fin')) {
                    $query->where('created_at', '<=', $request->fecha_fin . ' 23:59:59');
                }
                return response()->json($query->sum('cantidad'));
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para ver los ingresos',
                ], 403);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los ingresos',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getTotalGastos(Request $request){
        try {
            $validar = Validator::make($request->all(), [
                'fecha_inicio' => 'date',
                'fecha_fin' => 'date|after_or_equal:fecha_inicio',
            ],
            [
                'fecha_inicio.date' => 'La fecha de inicio debe ser una fecha valida',
                'fecha_fin.date' => 'La fecha de fin debe ser una fecha valida',
                'fecha_fin.after_or_equal' => 'La fecha de fin debe ser mayor o igual a la fecha de inicio',
            ]
        );
            if ($validar->fails()) {
                return response()->json(['success' => false, 'error' => $validar->errors()], 400);
            }
            if (Auth::user()->can('ver_movimiento')) {
                $query = Movimiento::where('tipo', 'GASTO');
                if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
                    $query->whereBetween('created_at', [$request->fecha_inicio, $request->fecha_fin . ' 23:59:59']);
                } else if ($request->has('fecha_inicio')) {
                    $query->where('created_at', '>=', $request->fecha_inicio);
                } else if ($request->has('fecha_fin')) {
                    $query->where('created_at', '<=', $request->fecha_fin . ' 23:59:59');
                }
                return response()->json($query->sum('cantidad'));
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para ver los gastos',
                ], 403);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los gastos',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getTotalBalance(Request $request){
        try {
            $validar = Validator::make($request->all(), [
                'fecha_inicio' => 'date',
                'fecha_fin' => 'date|after_or_equal:fecha_inicio',
            ],
            [
                'fecha_inicio.date' => 'La fecha de inicio debe ser una fecha valida',
                'fecha_fin.date' => 'La fecha de fin debe ser una fecha valida',
                'fecha_fin.after_or_equal' => 'La fecha de fin debe ser mayor o igual a la fecha de inicio',
            ]
        );
            if ($validar->fails()) {
                return response()->json(['success' => false, 'error' => $validar->errors()], 400);
            }
            if (Auth::user()->can('ver_movimiento')) {
                $queryIngresos = Movimiento::where('tipo', 'INGRESO');
                $queryGastos = Movimiento::where('tipo', 'GASTO');
                if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
                    $queryIngresos->whereBetween('created_at', [$request->fecha_inicio, $request->fecha_fin . ' 23:59:59']);
                    $queryGastos->whereBetween('created_at', [$request->fecha_inicio, $request->fecha_fin . ' 23:59:59']);
                } else if ($request->has('fecha_inicio')) {
                    $queryIngresos->where('created_at', '>=', $request->fecha_inicio);
                    $queryGastos->where('created_at', '>=', $request->fecha_inicio);
                } else if ($request->has('fecha_fin')) {
                    $queryIngresos->where('created_at', '<=', $request->fecha_fin . ' 23:59:59');
                    $queryGastos->where('created_at', '<=', $request->fecha_fin . ' 23:59:59');
                }
                $balance = $queryIngresos->sum('cantidad') - $queryGastos->sum('cantidad');
                return response()->json($balance);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para ver el balance',
                ], 403);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el balance',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
