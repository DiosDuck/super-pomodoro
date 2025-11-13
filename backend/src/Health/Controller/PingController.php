<?php

declare(strict_types = 1);

namespace App\Health\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use App\Health\Model\Ping;
use Nelmio\ApiDocBundle\Attribute\Model;
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
            ref: new Model(type: Ping::class),
        )
    )]
    public function __invoke()
    {
        sleep(2);
        return $this->json(new Ping('OK'));
    }
}
