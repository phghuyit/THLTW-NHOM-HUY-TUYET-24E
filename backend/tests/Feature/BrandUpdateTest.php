<?php

namespace Tests\Feature;

use App\Models\Brand;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BrandUpdateTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');

        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 120)->unique();
            $table->string('logo')->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function test_update_keeps_own_slug_and_existing_logo(): void
    {
        $brand = Brand::create([
            'name' => 'Original', 'slug' => 'original', 'logo' => 'brands/old.png',
            'description' => 'Old description', 'status' => 'active',
        ]);

        $this->patchJson("/api/admin/brands/{$brand->id}", [
            'name' => 'Updated', 'slug' => 'original', 'description' => '', 'status' => 'hidden',
        ])->assertOk()->assertJsonPath('data.name', 'Updated')->assertJsonPath('data.status', 'hidden');

        $this->assertSame('brands/old.png', $brand->fresh()->logo);
        $this->assertNull($brand->fresh()->description);
    }

    public function test_duplicate_slug_is_rejected_even_for_deleted_brands(): void
    {
        $brand = Brand::create(['name' => 'First', 'slug' => 'first', 'status' => 'active']);
        $other = Brand::create(['name' => 'Second', 'slug' => 'second', 'status' => 'active']);
        $other->delete();

        $this->patchJson("/api/admin/brands/{$brand->id}", [
            'name' => 'Changed', 'slug' => 'second', 'status' => 'active',
        ])->assertUnprocessable()->assertJsonValidationErrors('slug');

        $this->assertSame('first', $brand->fresh()->slug);
        $this->assertSame('First', $brand->fresh()->name);
    }

    public function test_invalid_fields_are_rejected_without_updating_brand(): void
    {
        $brand = Brand::create(['name' => 'Original', 'slug' => 'original', 'status' => 'active']);

        $this->patchJson("/api/admin/brands/{$brand->id}", [
            'name' => '', 'slug' => str_repeat('a', 121), 'status' => 'invalid',
            'logo' => 'https://example.com/not-an-upload.png',
        ])->assertUnprocessable()->assertJsonValidationErrors(['name', 'slug', 'status', 'logo']);

        $this->assertSame('Original', $brand->fresh()->name);
    }

    public function test_multipart_update_replaces_logo_and_removes_old_upload(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('brands/old.png', 'old image');
        $brand = Brand::create([
            'name' => 'Original', 'slug' => 'original', 'logo' => 'brands/old.png', 'status' => 'active',
        ]);
        $image = UploadedFile::fake()->createWithContent('logo.png', base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='
        ));

        $this->post("/api/admin/brands/{$brand->id}", [
            '_method' => 'PATCH', 'name' => 'Updated', 'slug' => 'original',
            'status' => 'active', 'logo' => $image,
        ], ['Accept' => 'application/json'])->assertOk();

        Storage::disk('public')->assertExists($brand->fresh()->logo);
        Storage::disk('public')->assertMissing('brands/old.png');
    }

    public function test_missing_and_soft_deleted_brands_cannot_be_updated(): void
    {
        $data = ['name' => 'Updated', 'slug' => 'updated', 'status' => 'active'];
        $this->patchJson('/api/admin/brands/999999', $data)->assertNotFound();
        $brand = Brand::create(['name' => 'Original', 'slug' => 'original', 'status' => 'active']);
        $brand->delete();

        $this->patchJson("/api/admin/brands/{$brand->id}", $data)->assertNotFound();
    }
}
