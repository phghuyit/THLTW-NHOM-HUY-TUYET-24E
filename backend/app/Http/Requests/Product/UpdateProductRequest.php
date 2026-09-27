<?php

namespace App\Http\Requests\Product;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            'category_id' => 'sometimes|required|integer|exists:categories,id',
            'brand_id' => 'nullable|integer|exists:brands,id',
            'name' => 'sometimes|required|string|max:256',
            'thumbnail' => 'sometimes|required|string|max:2048',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'rental_price_per_day' => 'sometimes|required|numeric|min:0',
            'deposit_rate_percent' => 'sometimes|required|numeric|min:0',
            'original_value' => 'sometimes|required|numeric|min:0',
            'is_featured' => 'boolean',
            'status' => [Rule::in('active', 'hidden'), 'sometimes'],
            'sizes' => 'sometimes|required|array|min:1',
            'sizes.*.size' => [
                'sometimes|required',
                'distinct',
                Rule::in('S', 'M', 'L', 'XL', '2XL', 'FreeSize'),
            ],
            'sizes.*.stock_quantity' => 'sometimes|required|integer|min:0',
            'images' => 'nullable|array|min:1',
            'images.*.image_url' => 'sometimes|required|string|max:2048',
        ];
    }
}
