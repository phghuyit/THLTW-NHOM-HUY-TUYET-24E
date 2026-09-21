<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index()
    {
        
        return Banner::where('status', 'active')
            ->where('position', 'home_main_slider')
            ->orderBy('sort_order')
            ->get();
    }
    
    
}

    