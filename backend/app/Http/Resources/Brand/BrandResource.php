<?php

namespace App\Http\Resources\Brand;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class BrandResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' =>$this->id,
            'name' =>$this->name,
            'slug' =>$this->slug,
            'logo' => $this->logo && !Str::startsWith($this->logo, ['http://', 'https://'])
                ? url('storage/'.ltrim($this->logo, '/'))
                : $this->logo,
            'description' =>$this->description,
            'status' =>$this->status,
            'deleted_at' => $this->when($this->trashed(), fn () => $this->deleted_at?->toISOString()),
        ];
    }
}
