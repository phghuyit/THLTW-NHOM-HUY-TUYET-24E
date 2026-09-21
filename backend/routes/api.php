<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/products',[ProductController::class,'index']);