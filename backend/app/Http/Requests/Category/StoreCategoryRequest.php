<?php

namespace App\Http\Requests\Category;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
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
            'name' => 'required|string|max:100',
            'parent_id' => ['bail','nullable','integer',
            Rule::exists('categories', 'id')->whereNull('deleted_at'),],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:active,hidden',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Vui lòng nhập tên danh mục.',
            'name.string' => 'Tên danh mục phải là chuỗi.',
            'name.max' => 'Tên danh mục không được quá 100 ký tự.',
            'parent_id.integer' => 'Danh mục cha không hợp lệ.',
            'parent_id.exists' => 'Danh mục cha không tồn tại hoặc đã bị xóa.',
            'image.image' => 'Vui lòng chọn một ảnh hợp lệ.',
            'image.mimes' => 'Ảnh chỉ nhận JPG, PNG hoặc WebP.',
            'image.max' => 'Ảnh không được lớn hơn 2 MB.',
            'description.string' => 'Mô tả phải là chuỗi.',
            'status.required' => 'Vui lòng chọn trạng thái.',
            'status.in' => 'Trạng thái chỉ nhận active hoặc hidden.',
        ];
    }
}
