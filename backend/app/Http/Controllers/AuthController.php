<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\LoginInputRequest;
use App\Http\Requests\User\RegisterRequest;
use App\Http\Resources\User\LoginUserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        $data['role'] = 'member';
        $data['status'] = 'active';

        $user = User::create($data);

        return response()->json([
            'message' => 'Đăng ký thành công',
            'data' => new LoginUserResource($user),
        ], 201);
    }

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

    public function adminLogin(LoginInputRequest $request)
    {
        $credentials = $request->validated();
        if (!Auth::attempt([...$credentials, 'status' => 'active', 'role' => 'admin'])) {
            return response()->json([
                'message' => 'Tai khoan khong co quyen han dang nhap vui long quay lai trang nguoi dung'
            ], 401);
        }
        /** @var \App\Models\User $admin */
        $admin = Auth::user();
        $admin->tokens()->delete();
        $adminToken = $admin->createToken('auth_admin_token')->plainTextToken;

        return response()->json([
            'message' => 'Dang nhap tai khoan quan tri vien thanh cong',
            'token' => $adminToken,
            'data' => new LoginUserResource($admin)
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();
        return response()->json(['message' => 'Dang xuat thanh cong'], 200);
    }
}
