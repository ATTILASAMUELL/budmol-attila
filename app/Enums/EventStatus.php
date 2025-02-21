<?php

namespace App\Enums;

enum EventStatus: string
{
    case OPEN = 'open';
    case CLOSED = 'closed';
    case CANCELED = 'canceled';
}
