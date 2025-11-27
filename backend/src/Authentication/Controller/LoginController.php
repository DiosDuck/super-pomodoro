<?php

declare(strict_types=1);

namespace App\Authentication\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;

#[Route(path: '/api/auth', name: 'auth_')]
class LoginController extends AbstractController {

    #[Route(path: '/login', name: 'login', methods: ['POST'])]
    #[OA\Post(
        path: '/api/auth/login',
        summary: 'Login user',
        tags: ['Authentication'],
    )]
    #[OA\Response(
        response: 200,
        description: 'OK',
    )]
    public function login(Request $request): JsonResponse
    {
        return $this->json(['message' => 'ok']);
    }
}
