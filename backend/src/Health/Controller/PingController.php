<?php

declare(strict_types = 1);

namespace App\Health\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use App\Health\Model\Ping;
use App\Health\Model\Status;
use Nelmio\ApiDocBundle\Attribute\Model;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class PingController extends AbstractController
{
    #[Route(path: '/api/ping', name: 'ping', methods: ['GET'])]
    #[OA\Get(
        path: '/api/ping',
        summary: 'Health check',
        tags: ['Utilities'],
    )]
    #[OA\Parameter(
        parameter: 'fail',
        name: 'fail',
        in: 'query',
        description: 'If set, it returns 500 error',
    )]
    #[OA\Response(
        response: 200,
        description: 'OK',
        content: new OA\JsonContent(
            ref: new Model(type: Ping::class),
        )
    )]
    #[OA\Response(
        response: 500,
        description: 'Internal server error',
        content: new OA\JsonContent(
            ref: new Model(type: Ping::class),
        )
    )]
    public function __invoke(Request $request): Response
    {
        $fail = $request->query->get('fail');
        if ($fail !== null) {
            return $this->json(
                new Ping('error', Status::CRIT),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        return $this->json(new Ping('OK'));
    }
}
