<?php

namespace App\OpenApi\Model;

class Content extends ToArray
{
    public function __construct(
        public ContentType $type = ContentType::APPLICATION_JSON,
        public Schema $schema = new Schema(),
    ) {}

    public function toArray(): array
    {
        $data = [
            $this->type->value => [
                'schema' => $this->schema->toArray(),
            ],
        ];

        return $data;
    }
}
