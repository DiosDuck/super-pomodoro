<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;

class PingController extends AbstractController
{
    #[Route(path: '/api/ping', name: 'ping', methods: ['GET'])]
    public function __invoke()
    {
        return $this->json(['message' => 'OK']);
    }
}
