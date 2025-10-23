<?php

namespace App\Controller;

use App\Dto\Ping;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PingController extends AbstractController {
    #[Route(path: '/api/ping', name: 'api_ping', methods: ['GET'])]
    public function __invoke(): Response
    {
        return $this->json(new Ping());
    }
}
