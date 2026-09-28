<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();
        
            $data['role']='member';
            $data['status']='active';

            $user=User::create($data);
    

        return response()->json([
            'message'=>'Đăng ký thành công',
            'data'=>$user,
        ],201);
    }
}
