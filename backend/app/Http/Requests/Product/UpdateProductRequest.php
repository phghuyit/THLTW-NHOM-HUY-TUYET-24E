<?php

namespace App\Http\Requests\Product;

use Illuminate\Validation\Rule;

class UpdateProductRequest extends StoreProductRequest
{
    public function rules(): array
    {
        $rules = parent::rules();
        foreach (['category_id', 'name', 'thumbnail', 'rental_price_per_day', 'deposit_rate_percent', 'original_value', 'sizes'] as $field) {
            array_unshift($rules[$field], 'sometimes');
        }
        $id = $this->route('product')->id;
        $rules['name'] = ['sometimes', 'required', 'string', 'max:200', Rule::unique('products', 'name')->ignore($id)];
        $rules['slug'] = ['sometimes', 'required', 'string', 'max:220', Rule::unique('products', 'slug')->ignore($id)];

        return $rules;
    }
}
