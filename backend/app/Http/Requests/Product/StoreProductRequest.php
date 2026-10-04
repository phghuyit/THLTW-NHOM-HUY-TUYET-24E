<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|integer|exists:categories,id',
            'brand_id' => 'nullable|integer|exists:brands,id',
            'name' => 'required|string|max:200|unique:products,name',
            'thumbnail' => 'required|string|max:255',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'rental_price_per_day' => 'required|numeric|min:0',
            'sale_price_per_day' => 'nullable|numeric|gt:0|lt:rental_price_per_day',
            'deposit_rate_percent' => 'required|numeric|min:0',
            'original_value' => 'required|numeric|min:0',
            'is_featured' => 'boolean',
            'status' => [Rule::in(['active', 'hidden'])],
            'sizes' => 'required|array|min:1',
            'sizes.*.size' => [
                'required',
                'distinct',
                Rule::in(['XS', 'S', 'M', 'L', 'XL', '2XL', 'FreeSize']),
            ],
            'sizes.*.stock_quantity' => 'required|integer|min:0',
            'images' => 'nullable|array|min:1',
            'images.*.image_url' => 'required|string|max:255',
        ];
    }
}
