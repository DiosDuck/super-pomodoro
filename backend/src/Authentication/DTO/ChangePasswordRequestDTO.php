<?php

declare(strinct_type=1);

namespace App\Authentication\DTO;

use OpenApi\Attributes as OA;

#[OA\Schema(
    title: 'Change Password Request',
    description: 'POST Body request for changing password'
)]
class ChangePasswordRequestDTO {
    #[OA\Property(example: 'password')]
    public string $password;
    #[OA\Property(example: 'newPassword')]
    public string $newPassword;
}
