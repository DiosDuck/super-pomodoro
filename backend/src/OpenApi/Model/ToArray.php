<?php

namespace App\OpenApi\Model;

use ArrayObject;

abstract class ToArray {
    public function toArrayObject(): ArrayObject
    {
        return new ArrayObject($this->toArray());
    }

    abstract function toArray(): array;
}
