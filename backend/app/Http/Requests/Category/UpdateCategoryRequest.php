<?php

namespace App\Http\Requests\Category;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use App\Models\Category;

class UpdateCategoryRequest extends StoreCategoryRequest
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
            'name' => 'sometimes|required|string|max:100',
            'parent_id' =>
            [
                'bail',
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('categories', 'id')->whereNull('deleted_at'),
                Rule::notIn([$this->route('category')->id]),
                function($attribute,$value,$fail){
                    $checkedID = [$this->route('category')->id];
                    while($value !==null){
                        if(in_array($value,$checkedID)){
                            $fail("Không thể chọn danh mục này làm cha");
                            return;
                        }
                        $checkedID[]=$value;
                        $value=Category::withTrashed()->find($value)?->parent_id;
                    }
                }
            ],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:active,hidden',
        ];
    }

    public function messages(): array
    {
        return array_merge(parent::messages(), [
            'parent_id.not_in' => 'Không thể chọn chính danh mục này làm danh mục cha.',
        ]);
    }
}

