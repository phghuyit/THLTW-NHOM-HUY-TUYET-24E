<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


class StoreProductRequest extends FormRequest
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
            'category_id' => 'required|integer|exists:categories,id',
            'brand_id' => 'nullable|integer|exists:brands,id',
            'name' => 'required|string|max:256',
            'thumbnail' => 'required|string|max:2048',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'rental_price_per_day' => 'required|numeric|min:0',
            'deposit_rate_percent' => 'required|numeric|min:0',
            'original_value' => 'required|numeric|min:0',
            'is_featured' => 'boolean',
            'status' => [Rule::in('active', 'hidden')],
            'sizes' => 'required|array|min:1',
            'sizes.*.size' => [
                'required',
                'distinct',
                Rule::in('S', 'M', 'L', 'XL', '2XL', 'FreeSize'),
            ],
            'sizes.*.stock_quantity' => 'required|integer|min:0',
            'images' => 'nullable|array|min:1',
            'images.*.image_url' => 'required|string|max:2048',
        ];
    }

    public function messages()
    {
        return parent::messages();
    }
}
