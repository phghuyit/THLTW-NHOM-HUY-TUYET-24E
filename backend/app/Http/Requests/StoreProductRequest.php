<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Override;

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
            'brand_id' => 'nullable|int|exists:brands,id',
            'name' => 'required|string|max:256',
            'slug' => ['required', Rule::unique('products'), 'max:221'],
            'thumbnail' => 'required|string|max:256',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'rental_price_per_day' => 'required|numeric|min:0',
            'deposit_rate_percent' => 'required|numeric|min:0',
            'original_value' => 'required|decimal:2',
            'is_featured' => 'boolean',
            'view_count' => 'int',
            'status' => [Rule::in('active', 'hidden')]
        ];
    }

    public function messages()
    {
        return parent::messages();
    }
}
