<?php

namespace App\Http\Resources\Post;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'category' => new PostCategoryResource($this->whenLoaded('category')),
            'author' => $this->author ? [
                'id' => $this->author->id,
                'fullname' => $this->author->fullname,
                'avatar' => $this->author->avatar,
            ] : null,
            'title' => $this->title,
            'slug' => $this->slug,
            'thumbnail' => $this->thumbnail,
            'summary' => $this->summary,
            'content' => $this->content,
            'is_hot' => (bool) $this->is_hot,
            'views' => (int) $this->views,
            'status' => $this->status,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
