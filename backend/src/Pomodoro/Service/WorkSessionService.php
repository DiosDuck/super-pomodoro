<?php

declare(strict_types=1);

namespace App\Pomodoro\Service;

use App\Authentication\Entity\User;
use App\Pomodoro\Repository\SessionSavedRepository;
use App\Pomodoro\Repository\SettingsRepository;
use DateTimeImmutable;

class WorkSessionService {
    public function __construct(
        private readonly SessionSavedRepository $sessionSavedRepository,
        private readonly SettingsRepository $settingsRepository,
    ) { }

    public function isNewWorkSessionValid(User $user, int $workTime): bool
    {
        $settings = $this->settingsRepository->findOneByUser($user);
        if (null === $settings || $settings->getWorkTime() !== $workTime) {
            return false;
        }

        $sessionSaved = $this->sessionSavedRepository->getLastWorkSession($user);
        if (null === $sessionSaved) {
            return true;
        }

        $now = new DateTimeImmutable();
        $diff = $now->getTimestamp() - $sessionSaved->getCreatedAt()->getTimestamp();

        return $diff >= $workTime;
    }
}