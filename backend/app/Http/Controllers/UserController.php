<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\ChangePasswordRequest;
use App\Http\Requests\User\RegisterRequest;
use App\Http\Requests\User\UpdateProfileRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\User\DetailProfileResource;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // ==========================================
    // Client / Profile
    // ==========================================

    public function profile(Request $request)
    {
        $user = $request->user()->load(['orders.items.productSize.product']);

        return response()->json([
            'message' => 'Lấy thông tin người dùng thành công',
            'data' => new DetailProfileResource($user),
        ], 200);
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = $request->user();
        $user->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật thông tin cá nhân thành công',
            'data' => new DetailProfileResource($user),
        ], 200);
    }

    public function changePassword(ChangePasswordRequest $request)
    {
        $user = $request->user();
        $user->update([
            'password' => $request->new_password,
        ]);

        return response()->json([
            'message' => 'Đổi mật khẩu thành công',
        ], 200);
    }

    // ==========================================
    // Admin
    // ==========================================

    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('status') && $request->status !== 'all' && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('role') && $request->role !== 'all' && $request->role !== '') {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('fullname', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate($request->integer('per_page', 12));

        return response()->json([
            'message' => 'Lấy toàn bộ người dùng thành công!',
            'data' => UserResource::collection($users),
            'pagination' => [
                'total' => $users->total(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
            ],
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
        $user = User::with(['orders.items.productSize.product'])->findOrFail($id);

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
        $users = User::onlyTrashed()->latest()->paginate(12);

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
