<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Category;

class UpdateCategoryRequest extends FormRequest
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
                        $value=Category::find($value)?->parent_id;
                    }
                }
            ],
            'image' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:active,hidden',
        ];
    }

}
