<?php

namespace App\Http\Requests\Product;

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
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $productId = $this->route('product')?->id ?? $this->route('product');

        return [
            'category_id' => 'sometimes|required|integer|exists:categories,id',
            'brand_id' => 'nullable|integer|exists:brands,id',
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:200',
                Rule::unique('products', 'name')->ignore($productId),
            ],
            'thumbnail' => 'sometimes|required|string|max:255',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'rental_price_per_day' => 'sometimes|required|numeric|min:0',
            'sale_price_per_day' => 'sometimes|nullable|numeric|gt:0',
            'deposit_rate_percent' => 'sometimes|required|numeric|min:0',
            'original_value' => 'sometimes|required|numeric|min:0',
            'is_featured' => 'boolean',
            'status' => ['sometimes', Rule::in(['active', 'hidden'])],
            'sizes' => 'sometimes|required|array|min:1',
            'sizes.*.size' => [
                'sometimes',
                'required',
                'distinct',
                Rule::in(['XS', 'S', 'M', 'L', 'XL', '2XL', 'FreeSize']),
            ],
            'sizes.*.stock_quantity' => 'sometimes|required|integer|min:0',
            'images' => 'nullable|array|min:1',
            'images.*.image_url' => 'sometimes|required|string|max:255',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $product = $this->route('product');

            $price = $this->input(
                'rental_price_per_day',
                $product->rental_price_per_day
            );

            $salePrice = $this->input(
                'sale_price_per_day',
                $product->sale_price_per_day
            );

            if ($salePrice !== null && $salePrice >= $price) {
                $validator->errors()->add(
                    'sale_price_per_day',
                    'Giá khuyến mãi phải nhỏ hơn giá thuê gốc.'
                );
            }
        });
    }
}
