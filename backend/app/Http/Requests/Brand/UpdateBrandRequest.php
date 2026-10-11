<?php

namespace App\Http\Requests\Brand;

use Illuminate\Validation\Rule;

class UpdateBrandRequest extends StoreBrandRequest
{
    public function rules(): array
    {
        $rules = parent::rules();
        $rules['slug'] = [
            'required',
            'string',
            'max:120',
            Rule::unique('brands', 'slug')->ignore($this->route('brand')->id),
        ];

        return $rules;
    }
}
