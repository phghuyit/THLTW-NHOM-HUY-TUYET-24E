<?php

namespace App\Http\Requests\Cart;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SyncCartRequest extends FormRequest
{


    public function authorize(): bool
    {
        return false;
    }



    public function rules(): array
    {
        return [

        ];
    }
}
