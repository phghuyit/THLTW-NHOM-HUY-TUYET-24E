<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(){
        $categoris = Category::with('parent')
        ->orderBy('parent_id')
        ->orderBy('name')
        ->get();

    return response()->json([
        'message'=>'Lay danh muc thanh cong',
        'data'=>$categoris,
    ]);
    }
}
