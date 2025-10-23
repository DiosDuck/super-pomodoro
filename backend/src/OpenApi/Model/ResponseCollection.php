<?php

namespace App\OpenApi\Model;

use ApiPlatform\OpenApi\Model\Response as ModelResponse;

class ResponseCollection extends ToArray {
    public function __construct(
        public array $responses = []
    ) {}

    public function addResponse(Response $response): void
    {
        $this->responses[] = $response;
    }

    public function toArray(): array
    {
        $data = [];
        /** @var Response $response */
        foreach ($this->responses as $response) {
            $data[$response->status] = new ModelResponse(
                description: $response->description,
                content: $response->content->toArrayObject(),
            );
        }

        return $data;
    }
}
