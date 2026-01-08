<?php

declare(strict_types=1);

namespace App\Pomodoro\Service;

use App\Authentication\Entity\User;
use App\Pomodoro\Repository\SessionSavedRepository;
use DateTimeImmutable;

class WorkSessionService {
    public function __construct(
        private readonly SessionSavedRepository $sessionSavedRepository,
    ) { }

    public function isNewWorkSessionValid(User $user, int $workTime): bool
    {
        $sessionSaved = $this->sessionSavedRepository->getLastWorkSession($user);
        if (null === $sessionSaved) {
            return true;
        }

        $now = new DateTimeImmutable();
        $diff = $now->getTimestamp() - $sessionSaved->getCreatedAt()->getTimestamp();

        return $diff >= $workTime;
    }
}