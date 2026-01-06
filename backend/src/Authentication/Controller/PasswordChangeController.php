<?php

declare(strict_types=1);

namespace App\Authentication\Controller;

use App\Authentication\DTO\ResetPasswordTokenRequestDTO;
use App\Authentication\Enum\TokenTypeEnum;
use App\Authentication\Exception\InvalidTokenException;
use App\Authentication\Exception\UserNotFoundException;
use App\Authentication\Service\AuthenticationService;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Attribute\Model;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\BodyRendererInterface;
use Symfony\Component\RateLimiter\RateLimiterFactoryInterface;

#[Route(path: '/api/auth/password', name: 'api_auth_password_')]
class PasswordChangeController extends AbstractController
{
    #[Route(path: '/forgot-password', name: '_forgot-password', methods: ['PUT'])]
    #[OA\Put(
        path: '/api/auth/password/forgot-password',
        summary: 'Send a mail to reset password',
        tags: ['Password'],
    )]
    #[OA\RequestBody(
        content: new OA\JsonContent(
            properties: [
                new OA\Property(
                    property: 'username',
                    type: 'string',
                    example: 'username',
                )
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Reset password request was sent by email',
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid input data',
    )]
    #[OA\Response(
        response: 404,
        description: 'User not found',
    )]
    #[OA\Response(
        response: 429,
        description: 'Too many requests for respective IP',
    )]
    public function forgotPassword(
        Request $request,
        AuthenticationService $authenticationService,
        EntityManagerInterface $entityManager,
        string $frontendBaseUrl,
        RateLimiterFactoryInterface $registerAccountLimiter,
        MailerInterface $mailer,
        BodyRendererInterface $bodyRenderer,
    ): JsonResponse 
    {
        try {
            $user = $authenticationService->getUserByUsername(json_decode($request->getContent(), true)['username'] ?? '');
        } catch (UserNotFoundException) {
            return $this->json(
                ['message' => 'Not Found'],
                JsonResponse::HTTP_NOT_FOUND,
            );
        }

        $limiter = $registerAccountLimiter->create($request->getClientIp());
        if (false === $limiter->consume(1)->isAccepted()) {
            return $this->json(
                ['message' => 'Too many requests'],
                JsonResponse::HTTP_TOO_MANY_REQUESTS,
            );
        }

        $createdToken = $authenticationService->createToken(
            TokenTypeEnum::TOKEN_RESET_PASSWORD,
            $user,
        );

        $entityManager->persist($createdToken->tokenVerification);
        $entityManager->flush();
        $queryParam = http_build_query(
            [
                'token' => $createdToken->unhashedToken, 
                'id' => $user->getId(),
            ]
        );

        $email = new TemplatedEmail();
        $email->to($user->getEmail())
            ->subject('Password Reset')
            ->htmlTemplate('@authentication/email/password-reset.html.twig')
            ->context([
                'displayName' => $user->getDisplayName(),
                'url' => sprintf(
                    '%s/verify-email/password-reset?%s',
                    $frontendBaseUrl,
                    $queryParam,
                ),
                'username' => $user->getUsername(),
            ])
        ;

        $bodyRenderer->render($email);
        $mailer->send($email);

        return $this->json(['message' => $createdToken->unhashedToken]);
    }
    
    #[Route(path: '/reset-password', name: '_reset-password', methods: ['POST'])]
    #[OA\Post(
        path: '/api/auth/password/reset-password',
        summary: 'Reset the password based on the token',
        tags: ['Password'],
    )]
    #[OA\RequestBody(
        content: new OA\JsonContent(
            ref: new Model(type: ResetPasswordTokenRequestDTO::class),
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Password was reseted',
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid token',
    )]
    public function resetPassword(
        #[MapRequestPayload] ResetPasswordTokenRequestDTO $resetPasswordTokenRequest,
        AuthenticationService $authenticationService,
        EntityManagerInterface $entityManager,
    ): JsonResponse
    {
        try {
            $token = $authenticationService->getValidTokenForUser(
                $resetPasswordTokenRequest->id,
                TokenTypeEnum::TOKEN_RESET_PASSWORD,
                $resetPasswordTokenRequest->token,
            );
        } catch (InvalidTokenException) {
            return $this->json(
                ['message' => 'Bad Request'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user = $authenticationService->updatePasswordForUser(
            $token->getUser(),
            $resetPasswordTokenRequest->newPassword
        );

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['message' => 'ok']);
    }
}
