<?php

namespace App\OpenApi\Model;

use ApiPlatform\OpenApi\Model\Operation as ModelOperation;

class OperationCollection extends ToArray
{
    public function __construct(
        public array $operations = [],
    ) {}

    public function addOperation(Operation $operation): void
    {
        $this->operations[] = $operation;
    }

    public function toArray(): array
    {
        $data = [];
        /** @var Operation $operation */
        foreach ($this->operations as $operation) {
            $data[$operation->method->value] = new ModelOperation(
                operationId: $operation->operationId,
                description: $operation->description,
                summary: $operation->summary,
                responses: $operation->responses->toArray(),
                tags: $operation->tags,
            );
        }

        return $data;
    }
}
