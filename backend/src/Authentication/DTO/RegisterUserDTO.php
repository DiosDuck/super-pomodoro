<?php

namespace App\Authentication\DTO;

use OpenApi\Attributes as OA;

#[OA\Schema(
    title: 'Register User Schema',
    description: 'Register User Schema for register into DB',
)]
class RegisterUserDTO {
    #[OA\Property(example: 'john_smith')]
    public string $username;
    #[OA\Property(example: 'password')]
    public string $password;
    #[OA\Property(example: 'john.smith@email.com')]
    public string $email;
    #[OA\Property(example: 'John Smith')]
    public string $displayName;
}
