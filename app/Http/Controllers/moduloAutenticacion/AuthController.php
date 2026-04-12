<?php

namespace App\Http\Controllers\moduloAutenticacion;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request){
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales inválidas',
            ], 401);
        }

        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Logout exitoso',
        ]);
    }

    public function me(){
        $usuario = Auth::user();
        return response()->json([
            "name" => $usuario->name,
            "email" => $usuario->email,
            "role" => $usuario->role,
        ]);
    }

    public function cambiarContrasenya(Request $request){
        try{
            $request->validate([
                'oldPassword'=>'required',
                'newPassword' => 'required|min:8',
            ]);
            $user = User::find(Auth::user()->id);
            if(!Hash::check($request->oldPassword, $user->password)){
                return response()->json([
                    'message' => 'Contraseña actual incorrecta',
                ], 401);
            }
            $user->update([
                'password' => Hash::make($request->newPassword),
            ]);
            return response()->json([
                'message' => 'Contraseña cambiada correctamente',
                'data' => $user
            ], 200);
        }catch(Exception $e){
            return response()->json([
                'message' => 'Error al cambiar la contraseña',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
