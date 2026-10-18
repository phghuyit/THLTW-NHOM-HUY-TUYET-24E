<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\RegisterRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\User\DetailProfileResource;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::query()->active()->paginate(10);

        return response()->json([
            'message' => 'Lấy toàn bộ người dùng thành công!',
            'data' => UserResource::collection($users),
        ], 200);
    }

    public function store(RegisterRequest $request)
    {
        $validated = $request->validated();
        $user = User::create($validated);

        return response()->json([
            'message' => 'Đăng ký tài khoản thành công',
            'data' => new UserResource($user),
        ], 201);
    }

    public function show(string $id)
    {
        $user = User::query()->active()->findOrFail($id);

        return response()->json([
            'message' => 'Lấy thông tin người dùng thành công',
            'data' => new DetailProfileResource($user),
        ], 200);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $validated = $request->validated();
        $user->update($validated);

        return response()->json([
            'message' => 'Cập nhật thông tin người dùng thành công',
            'data' => new UserResource($user),
        ], 200);
    }

    public function destroy(User $user)
    {
        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'message' => 'Chuyển người dùng vào thùng rác thành công',
            'code' => 200,
        ], 200);
    }

    public function trash()
    {
        $users = User::onlyTrashed()->latest()->paginate(10);

        return response()->json([
            'message' => 'Lấy danh sách người dùng trong thùng rác thành công',
            'data' => UserResource::collection($users),
        ], 200);
    }

    public function restore(string $id)
    {
        $user = User::onlyTrashed()->findOrFail($id);
        $user->restore();

        return response()->json([
            'message' => 'Khôi phục người dùng thành công',
            'code' => 200,
        ], 200);
    }

    public function forceDelete(string $id)
    {
        $user = User::onlyTrashed()->findOrFail($id);
        $user->tokens()->forceDelete();
        $user->cart()?->delete();
        $user->forceDelete();

        return response()->json([
            'message' => 'Xóa người dùng vĩnh viễn thành công',
            'code' => 200,
        ], 200);
    }
}
