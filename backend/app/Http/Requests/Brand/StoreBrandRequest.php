<?php

namespace App\Http\Requests\Brand;

use Illuminate\Foundation\Http\FormRequest;

class StoreBrandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['required', 'string', 'max:120', 'unique:brands,slug'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:active,hidden'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Vui lòng nhập tên thương hiệu.',
            'name.string' => 'Tên thương hiệu phải là chuỗi.',
            'name.max' => 'Tên thương hiệu không được quá 100 ký tự.',
            'slug.required' => 'Vui lòng nhập slug.',
            'slug.string' => 'Slug phải là chuỗi.',
            'slug.max' => 'Slug không được quá 120 ký tự.',
            'slug.unique' => 'Slug này đã tồn tại. Vui lòng chọn slug khác.',
            'logo.image' => 'Logo phải là một ảnh hợp lệ.',
            'logo.mimes' => 'Logo chỉ nhận ảnh JPG, PNG hoặc WebP.',
            'logo.max' => 'Ảnh logo không được lớn hơn 2 MB.',
            'description.string' => 'Mô tả phải là chuỗi.',
            'status.required' => 'Vui lòng chọn trạng thái.',
            'status.in' => 'Trạng thái chỉ nhận active hoặc hidden.',
        ];
    }
}
