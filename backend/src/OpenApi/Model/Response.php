<?php

namespace App\OpenApi\Model;

class Response
{
    public function __construct(
        public int $status = 200,
        public Content $content = new Content(),
        public ?string $description = '',
    ) {}
}
