<?php

namespace App\OpenApi\Model;

class Operation {
    public function __construct(
        public Method $method = Method::GET,
        public ?string $operationId = null,
        public string $description = '',
        public string $summary = '',
        public ResponseCollection $responses = new ResponseCollection(),
        public array $tags = [],
    ) { }

    public function addTag(string $tag): void
    {
        $this->tags[] = $tag;
    }
}
