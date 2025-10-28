<?php

declare(strict_types = 1);

namespace App\Health\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;

class PingController extends AbstractController
{
    #[Route(path: '/api/ping', name: 'ping', methods: ['GET'])]
    #[OA\Get(
        path: '/api/ping',
        summary: 'Health check',
        tags: ['Utilities'],
    )]
    #[OA\Response(
        response: 200,
        description: 'OK',
        content: new OA\JsonContent(
            type: 'object',
            properties: [
                new OA\Property(
                    property: 'message',
                    type: 'string',
                    example: 'OK'
                )
            ]
        )
    )]
    public function __invoke()
    {
        return $this->json(['message' => 'OK']);
    }
}
