<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('name'))) {
            $this->merge(['slug' => Str::slug($this->input('name'))]);
        }
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', Rule::exists('categories', 'id')->whereNull('deleted_at')],
            'brand_id' => ['nullable', 'integer', Rule::exists('brands', 'id')->whereNull('deleted_at')],
            'name' => ['required', 'string', 'max:200', 'unique:products,name'],
            'slug' => ['required', 'string', 'max:220', 'unique:products,slug'],
            'thumbnail' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'rental_price_per_day' => ['required', 'numeric', 'min:0', 'max:9999999999.99'],
            'deposit_rate_percent' => ['required', 'integer', 'between:0,100'],
            'original_value' => ['required', 'numeric', 'min:0', 'max:9999999999.99'],
            'is_featured' => ['sometimes', 'boolean'],
            'status' => ['sometimes', 'required', 'in:active,hidden'],
            'sizes' => ['required', 'array', 'min:1', 'max:7'],
            'sizes.*.size' => ['required', 'distinct', Rule::in(['XS', 'S', 'M', 'L', 'XL', '2XL', 'FreeSize'])],
            'sizes.*.stock_quantity' => ['required', 'integer', 'min:0', 'max:2147483647'],
            'images' => ['nullable', 'array', 'max:8'],
            'images.*.image_url' => ['required', 'string', 'max:255'],
            'images.*.sort_order' => ['sometimes', 'integer', 'min:0'],
            'gallery_files' => ['nullable', 'array', 'max:8'],
            'gallery_files.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'Vui lòng nhập :attribute.',
            'string' => ':attribute phải là chuỗi.',
            'integer' => ':attribute phải là số nguyên.',
            'numeric' => ':attribute phải là số.',
            'min' => ':attribute không được nhỏ hơn :min.',
            'max' => ':attribute vượt quá giới hạn :max.',
            'category_id.exists' => 'Danh mục không tồn tại hoặc đã bị xóa.',
            'brand_id.exists' => 'Thương hiệu không tồn tại hoặc đã bị xóa.',
            'name.unique' => 'Tên sản phẩm đã tồn tại.',
            'slug.unique' => 'Tên này tạo ra slug đã tồn tại. Hãy chọn tên khác.',
            'slug.required' => 'Tên sản phẩm phải có chữ hoặc số để tạo slug.',
            'thumbnail.image' => 'Ảnh đại diện không hợp lệ.',
            'thumbnail.mimes' => 'Ảnh đại diện chỉ nhận JPG, PNG hoặc WebP.',
            'thumbnail.max' => 'Ảnh đại diện không được quá 2 MB.',
            'deposit_rate_percent.between' => 'Tỷ lệ cọc phải từ 0 đến 100%.',
            'status.in' => 'Trạng thái chỉ nhận active hoặc hidden.',
            'sizes.required' => 'Chọn ít nhất một size.',
            'sizes.min' => 'Chọn ít nhất một size.',
            'sizes.*.size.distinct' => 'Size không được trùng nhau.',
            'sizes.*.size.in' => 'Size không hợp lệ.',
            'is_featured.boolean' => 'Trạng thái nổi bật không hợp lệ.',
            'gallery_files.max' => 'Chọn tối đa 8 ảnh bổ sung.',
            'gallery_files.*.image' => 'Ảnh bổ sung không hợp lệ.',
            'gallery_files.*.mimes' => 'Ảnh bổ sung chỉ nhận JPG, PNG hoặc WebP.',
            'gallery_files.*.max' => 'Mỗi ảnh bổ sung không được quá 2 MB.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'tên sản phẩm', 'category_id' => 'danh mục', 'brand_id' => 'thương hiệu',
            'thumbnail' => 'ảnh đại diện', 'rental_price_per_day' => 'giá thuê',
            'original_value' => 'giá trị sản phẩm', 'deposit_rate_percent' => 'tỷ lệ cọc',
            'short_description' => 'mô tả ngắn', 'description' => 'mô tả',
            'sizes.*.stock_quantity' => 'tồn kho', 'sizes.*.size' => 'size',
        ];
    }
}
