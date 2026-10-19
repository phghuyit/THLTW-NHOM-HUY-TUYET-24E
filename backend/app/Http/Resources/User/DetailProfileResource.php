<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DetailProfileResource extends JsonResource
{


    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
