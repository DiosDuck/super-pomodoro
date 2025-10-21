<?php

namespace App\Dto;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\Get;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/ping',
            description: 'Test if getting API calls work',
            controller: \App\Controller\PingController::class,
            output: Ping::class,
        ),
    ],
    
)]
final class Ping
{
    public function __construct(
        #[ApiProperty(
            identifier: false,
            description: 'Message of the response',
            openapiContext: [
                'type' => 'string',
                'example' => 'OK',
            ]
        )]
        public string $message = 'OK',
    ) { }
}
