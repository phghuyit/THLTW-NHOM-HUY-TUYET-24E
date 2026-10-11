<?php

namespace App\Http\Resources\Category;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'parent_id' => $this->parent_id,
            'parent_name' => $this->whenLoaded('parent', fn () => $this->parent->name),
            'products_count' => $this->whenCounted('products'),
            'image' => $this->image && !Str::startsWith($this->image, ['http://', 'https://'])
                ? url('storage/'.ltrim($this->image, '/'))
                : $this->image,
            'description' => $this->description,
            'status' => $this->status,
            'deleted_at' => $this->when($this->trashed(), fn () => $this->deleted_at?->toISOString()),
        ];
    }
}
