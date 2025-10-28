<?php

declare(strict_types = 1);

namespace App\Health\Model;

use OpenApi\Attributes as OA;

#[OA\Schema(schema: 'Ping')]
class Ping {
    #[OA\Property(type: 'string', example: 'OK')]
    public string $message;
}
