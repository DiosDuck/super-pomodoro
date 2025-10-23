<?php

namespace App\OpenApi\Model;

class Schema extends ToArray {
    public function __construct(
        private ?string $type = null,
        private ?string $description = null,
        private ?string $example = null,
        private ?array $properties = null,
        private ?string $ref = null,
    ) {
    }

    public function addProperties(array $schemas): void
    {
        $this->properties = $schemas;
    }

    public function addProperty(string $name, Schema $schema): void
    {
        if ($this->properties === null) {
            $this->properties = [];
        }

        $this->properties[$name] = $schema;
    }

    public function toArray(): array
    {
        $properties = null;
        if ($this->properties) {
            $properties = [];

            /** @var Schema $property */
            foreach ($this->properties as $name => $property) {
                $properties[$name] = $property->toArray();
            }
        }

        $data = [];
        foreach ($this as $property => $value) {
            if (!$value) {
                continue;
            }

            switch ($property) {
                case 'properties':
                    $data[$property] = $properties;
                    break;
                case 'ref':
                    $data['$ref'] = $value;
                    break;
                default:
                    $data[$property] = $value;
            }
        }

        return $data;
    }
}
