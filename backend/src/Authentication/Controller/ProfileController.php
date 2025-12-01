<?php

declare(strict_types=1);

namespace App\Authentication\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;
use App\Authentication\Entity\User;
use App\Authentication\DTO\UserDTO;
use Nelmio\ApiDocBundle\Attribute\Model;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route(path: '/api', name: 'profile_')]
class ProfileController extends AbstractController {

    #[Route(path: '/profile', name: 'fetch', methods: ['GET'])]
    #[OA\Get(
        path: '/api/profile',
        summary: 'Profile user',
        tags: ['Profile'],
        security: [['Bearer' => []]],
    )]
    #[OA\Response(
        response: 200,
        description: 'User\'s profile data',
        content: new OA\JsonContent(
            ref: new Model(type: UserDTO::class),
        )
    )]
    #[OA\Response(
        response: 403,
        description: 'User not logged in ',
    )]
    public function profile(#[CurrentUser] ?User $user): JsonResponse
    {
        if (null === $user) {
            return $this->json(
                ['message' => 'Not logged in'],
                JsonResponse::HTTP_FORBIDDEN,
            );
        }

        return $this->json(UserDTO::fromUser($user));
    }
}
