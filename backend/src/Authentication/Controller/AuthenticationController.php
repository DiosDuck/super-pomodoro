<?php

declare(strict_types=1);

namespace App\Authentication\Controller;

use App\Authentication\DTO\RegisterUserDTO;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Authentication\Exception\InvalidRegisterDataException;
use App\Authentication\Service\AuthenticationService;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Attribute\Model;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;

#[Route(path: '/api/auth', name: 'api_auth_')]
class AuthenticationController extends AbstractController {
    public function __construct(
        private readonly AuthenticationService $authenticationService,
    ) { }

    #[Route(path: '/register', name: 'register', methods: ['PUT'])]
    #[OA\Put(
        path: '/api/auth/register',
        summary: 'Register user',
        tags: ['Authentication'],
    )]
    #[OA\RequestBody(
        content: new OA\JsonContent(
            ref: new Model(type: RegisterUserDTO::class),
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'User has been registered',
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid user data',
    )]
    public function register(
        #[MapRequestPayload] RegisterUserDTO $registerUser,
        MailerInterface $mailer,
        EntityManagerInterface $entityManager,
        Request $request,
    ): JsonResponse {
        try {
            $user = $this->authenticationService->getUserFromRegisterData($registerUser);
        } catch (InvalidRegisterDataException) {
            return $this->json(
                ['message' => 'Invalid user data'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $createdToken = $this->authenticationService->createRegisterTokenForUser($user);

        $entityManager->persist($user);
        //$entityManager->persist($createdToken->tokenVerification);
        $entityManager->flush();

        $queryParam = http_build_query(
            [
                'token' => $createdToken->unhashedToken, 
                'id' => $user->getId(),
            ]
        );

        $email = new TemplatedEmail();
        $email->to($user->getEmail())
            ->subject('Test Register Email')
            ->htmlTemplate('@authentication/email/register.html.twig')
            ->context([
                'displayName' => $user->getDisplayName(),
                'url' => sprintf(
                    '%s/verify-email?%s',
                    $request->getSchemeAndHttpHost(),
                    $queryParam,
                ),
            ])
        ;

        $mailer->send($email);

        return $this->json(['message' => 'ok']);
    }
}
