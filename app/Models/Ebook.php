<?php

namespace App\Models;

use App\Enums\EbookStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'ebook_category_id',
    'title',
    'slug',
    'author',
    'short_description',
    'description',
    'cover_url',
    'file_url',
    'file_name',
    'file_type',
    'file_size',
    'total_pages',
    'status',
    'published_at',
])]
class Ebook extends Model
{
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'status' => EbookStatus::class,
            'file_size' => 'integer',
            'total_pages' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<EbookCategory, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(EbookCategory::class, 'ebook_category_id');
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
