<?php

namespace App\Enums;

enum EnrollmentStatus: string
{
    case Enrolled = 'enrolled';
    case InProgress = 'in_progress';
    case Completed = 'completed';
}
