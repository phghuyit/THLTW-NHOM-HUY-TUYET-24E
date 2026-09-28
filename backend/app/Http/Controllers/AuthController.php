<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\LoginInputRequest;
use App\Http\Resources\User\LoginUserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    //
    public function login(LoginInputRequest $request)
    {
        $credentials = $request->validated();
        if (!Auth::attempt([...$credentials, 'status' => 'active'])) {
            return response()->json([
                'message' => 'Email, mat khau khong dung hoac chua duoc kich hoat',
            ], 401);
        }
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->tokens()->delete();
        $token = $user->createToken('auth_member_token')->plainTextToken;

        return response()->json([
            'message' => "Dang nhap tai khoan thanh cong",
            'token' => $token,
            'data' => new LoginUserResource($user),
        ], 200);
    }
}
