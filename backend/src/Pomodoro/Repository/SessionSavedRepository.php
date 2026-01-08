<?php

declare(strict_types=1);

namespace App\Pomodoro\Repository;

use App\Authentication\Entity\User;
use App\Pomodoro\Entity\SessionSaved;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends SessionSavedRepository<SessionSaved>
 */
class SessionSavedRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        return parent::__construct($registry, SessionSaved::class);
    }

    public function getLastWorkSession(User $user): ?SessionSaved
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->orderBy('s.createdAt', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
