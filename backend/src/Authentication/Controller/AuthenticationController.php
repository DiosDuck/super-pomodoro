<?php

declare(strict_types=1);

namespace App\Authentication\Controller;

use App\Authentication\DTO\RegisterUserDTO;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Authentication\Entity\User;
use App\Authentication\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Attribute\Model;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;

#[Route(path: '/api/auth', name: 'api_auth_')]
class AuthenticationController extends AbstractController {
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
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher,
        MailerInterface $mailer,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        if ($userRepository->findOneBy(['username' => $registerUser->username])) {
            return $this->json(['message' => 'Invalid user data'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = new User();
        
        $user->setDisplayName($registerUser->displayName);
        $user->setEmail($registerUser->email);
        $user->setUsername($registerUser->username);
        $user->setRoles(['ROLE_USER']);

        $hashedPassword = $passwordHasher->hashPassword($user, $registerUser->password);
        $user->setPassword($hashedPassword);

        $email = new TemplatedEmail();
        $email->to($user->getEmail())
            ->subject('Test Register Email')
            ->htmlTemplate('@authentication/email/register.html.twig')
            ->context([
                'displayName' => $user->getDisplayName(),
            ])
        ;

        $mailer->send($email);

        //$entityManager->persist($user);
        //$entityManager->flush();

        return $this->json(['message' => 'ok']);
    }
}
