<?php

declare(strict_types=1);

namespace App\Authentication\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;
use App\Authentication\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route(path: '/api/auth', name: 'auth_')]
class LoginController extends AbstractController {

    #[Route(path: '/login', name: 'login', methods: ['POST'])]
    #[OA\Post(
        path: '/api/auth/login',
        summary: 'Login user',
        tags: ['Authentication'],
    )]
    #[OA\RequestBody(
        description: 'Request Body',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(
                    property: 'username',
                    type: 'string',
                    example: 'username'
                ),
                new OA\Property(
                    property: 'password',
                    type: 'string',
                    example: 'password',
                )
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'User is logged in',
    )]
    #[OA\Response(
        response: 401,
        description: 'Bad credentials',
    )]
    public function login(#[CurrentUser] ?User $user): JsonResponse
    {
        if (null === $user) {
            return $this->json(
                ['message' => 'Wrong credentials'],
                JsonResponse::HTTP_UNAUTHORIZED,
            );
        }
        
        return $this->json([
            'message' => 'ok',
            'displayName' => $user->getDisplayName(),
        ]);
    }

    public function devRegister(UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = new User();
        
        $user->setDisplayName('Test User');
        $user->setEmail('test@email.com');
        $user->setUsername('username');

        $hashedPassword = $passwordHasher->hashPassword($user, 'password');
        $user->setPassword($hashedPassword);

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['message' => 'ok']);
    }
}
