<?php

namespace App\Controller;

use App\Dto\Ping;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;


class PingController extends AbstractController {
    public function __invoke(): Response
    {
        return $this->json(new Ping());
    }
}
