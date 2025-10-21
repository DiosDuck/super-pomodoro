<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class TestApiController extends AbstractController {
    #[Route('/api/test')]
    public function getCollection(): Response
    {
        return $this->json(['message' => 'OK']);
    }
}
