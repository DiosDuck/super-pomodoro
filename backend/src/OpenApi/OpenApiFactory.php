<?php

namespace App\OpenApi;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\OpenApi;
use ApiPlatform\OpenApi\Model\Tag;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\OpenApi\Model\PathItem;
use ApiPlatform\OpenApi\Model\Response;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;

#[AsDecorator(decorates: 'api_platform.openapi.factory')]
class OpenApiFactory implements OpenApiFactoryInterface {
    public function __construct(
        private OpenApiFactoryInterface $decorated,
    ) { }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = $this->decorated->__invoke($context);
        $openApi = $this->addPing($openApi);
        return $openApi;
    }

    private function addPing(OpenApi $openApi): OpenApi
    {
        $tag = new Tag(name: 'Ping', description: 'Ping endpoint, used for checking if server works');
        $openApi = $this->addComponent(
            $openApi, 'Ping', 
            [
                'type' => 'object',
                'description' => 'Used for testing if API works',
                'required' => ['message'],
                'properties' => [
                    'message' => ['type' => 'string', 'example' => 'ok'],
                ],
            ],
        );

        $openApi = $this->addTag(
            $openApi,
            $tag,
        );

        $openApi = $this->addEndpoint(
            $openApi,
            '/api/ping',
            [
                'GET' => [
                    'operationId' => 'api_ping',
                    'summary' => 'Ping',
                    'description' => 'Used to check if servers are alive',
                    'responses' => [
                        [
                            'status' => 200,
                            'description' => 'OK',
                            'content' => [
                                'application/json' => [
                                    'schema' => ['$ref' => '#/components/schemas/Ping'],
                                ]
                            ]
                        ]
                    ]
                ],
            ],
            ['Ping'],
        );

        return $openApi;
    }

    private function addComponent(OpenApi $openApi, string $name, array $schema): OpenApi
    {
        $components = $openApi->getComponents();
        $schemas = $components->getSchemas() ?? [];
        $schemas[$name] = $schema;
        $openApi = $openApi->withComponents($components->withSchemas($schemas));

        return $openApi;
    }

    private function addTag(OpenApi $openApi, Tag $tag): OpenApi
    {
        $tags = $openApi->getTags();
        $tags[] = $tag;
        $openApi = $openApi->withTags($tags);

        return $openApi;
    }

    private function addEndpoint(OpenApi $openApi, string $route, array $routeData, array $tags = []): OpenApi
    {
        $pathItem = $this->getPathItem($routeData, $tags);
        $openApi->getPaths()->addPath($route, $pathItem);

        return $openApi;
    }

    private function getPathItem(array $routeData, array $tags): PathItem
    {
        $pathItem = new PathItem();
        $operations = [];

        foreach ($routeData as $method => $value) {
            $responses = $this->getResponses($value['responses'] ?? []);

            $operations[$method] = new Operation(
                operationId: $value['operationId'],
                description: $value['description'] ?? '',
                summary: $value['summary'] ?? '',
                responses: $responses,
                tags: $tags,
            );
        }

        if (array_key_exists('GET', $operations)) {
            $pathItem = $pathItem->withGet($operations['GET']);
        }

        if (array_key_exists('POST', $operations)) {
            $pathItem = $pathItem->withPost($operations['POST']);
        }

        if (array_key_exists('PUT', $operations)) {
            $pathItem = $pathItem->withPut($operations['PUT']);
        }

        if (array_key_exists('DELETE', $operations)) {
            $pathItem = $pathItem->withDelete($operations['DELETE']);
        }

        return $pathItem;
    }

    private function getResponses(array $data): array
    {
        $responses = [];
        foreach ($data as $item) {
            $responses[(string) $item['status']] = new Response(
                description: $item['description'],
                content: new \ArrayObject($item['content']),
            );
        }

        return $responses;
    }
} 
