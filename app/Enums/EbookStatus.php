<?php

namespace App\Enums;

enum EbookStatus: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Archived = 'archived';
}
