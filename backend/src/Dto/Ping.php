<?php

namespace App\Dto;

final class Ping
{
    public function __construct(
        public string $message = 'OK',
    ) { }
}
