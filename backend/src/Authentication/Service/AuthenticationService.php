<?php

declare(strict_types=1);

namespace App\Authentication\Service;

use App\Authentication\DTO\CreatedTokenDTO;
use App\Authentication\DTO\RegisterUserDTO;
use App\Authentication\Entity\TokenVerification;
use App\Authentication\Entity\User;
use App\Authentication\Enum\TokenTypeEnum;
use App\Authentication\Exception\InvalidRegisterDataException;
use App\Authentication\Exception\InvalidTokenException;
use App\Authentication\Repository\TokenVerificationRepository;
use App\Authentication\Repository\UserRepository;
use DateTimeImmutable;
use Symfony\Component\DependencyInjection\Attribute\Target;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\PasswordHasher\PasswordHasherInterface;

class AuthenticationService {
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly TokenVerificationRepository $tokenVerificationRepository,
        #[Target('token_hasher')]
        private readonly PasswordHasherInterface $tokenHasher,
    ) { }

    public function getUserFromRegisterData(RegisterUserDTO $registerUser): User
    {
        if (
            !$registerUser->isValid() ||
            $this->userRepository->findOneBy(['username' => $registerUser->username])
        ) {
            throw new InvalidRegisterDataException();
        }

        $user = new User();
        
        $user->setDisplayName($registerUser->displayName)
            ->setEmail($registerUser->email)
            ->setUsername($registerUser->username)
            ->setRoles(['ROLE_USER'])
            ->setIsActive(false)
            ->setActivatedAt(null)
            ->setLastLoggedIn(null)
        ;

        $hashedPassword = $this->passwordHasher->hashPassword($user, $registerUser->password);
        $user->setPassword($hashedPassword);

        return $user;
    }

    public function createRegisterTokenForUser(User $user): CreatedTokenDTO
    {
        $token = bin2hex(random_bytes(32));
        $tokenVerification = new TokenVerification();

        $tokenVerification
            ->setUser($user)
            ->setExpiresAt(new DateTimeImmutable("+24 hours"))
            ->setType(TokenTypeEnum::TOKEN_EMAIL_VERIFICATION)
            ->setIsUsed(false)
            ->setToken($this->tokenHasher->hash($token))
        ;

        return new CreatedTokenDTO(
            tokenVerification: $tokenVerification,
            unhashedToken: $token,
        );
    }

    public function getValidTokenForUser(int $userId, TokenTypeEnum $type, string $token): TokenVerification
    {
        $user = $this->userRepository->find($userId);
        if (!$user) {
            throw new InvalidTokenException('user not found');
        }

        $tokenVerification = $this->tokenVerificationRepository->findValidTokenByUserAndType($user, $type);
        if (
            !$tokenVerification
            || !$this->tokenHasher->verify($tokenVerification->getToken(), $token)
         ) {
            throw new InvalidTokenException('token invalid');
        }

        return $tokenVerification;
    }
}
