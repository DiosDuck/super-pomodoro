<?php

namespace App\OpenApi;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\OpenApi;
use ApiPlatform\OpenApi\Model\Tag;
use ApiPlatform\OpenApi\Model\PathItem;
use App\OpenApi\Model\Operation;
use App\OpenApi\Model\OperationCollection;
use App\OpenApi\Model\Schema;
use App\OpenApi\Model\Method;
use App\OpenApi\Model\Response;
use App\OpenApi\Model\ResponseCollection;
use App\OpenApi\Model\Content;
use App\OpenApi\Model\ContentType;
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
            new Schema(
                type: 'object', 
                description: 'Used for testing if API works',
                properties: [
                    'message' => new Schema(
                        type: 'string',
                        example: 'OK',
                    ),
                ]
            ),
        );

        $openApi = $this->addTag($openApi, $tag);

        $openApi = $this->addEndpoint(
            $openApi,
            '/api/ping',
            new OperationCollection(
                operations: [
                    new Operation(
                        method: Method::GET,
                        operationId: 'api_ping',
                        description: 'Used to check if servers are alive',
                        summary: 'Ping',
                        tags: ['Ping'],
                        responses: new ResponseCollection(
                            [
                                new Response(
                                    status: 200,
                                    description: 'OK',
                                    content: new Content(
                                        type: ContentType::APPLICATION_JSON,
                                        schema: new Schema(ref: '#/components/schemas/Ping'),
                                    )
                                )
                            ]
                        )
                    )
                ]
            ),
        );

        return $openApi;
    }

    private function addComponent(OpenApi $openApi, string $name, Schema $schema): OpenApi
    {
        $components = $openApi->getComponents();
        $schemas = $components->getSchemas() ?? [];
        $schemas[$name] = $schema->toArray();
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

    private function addEndpoint(OpenApi $openApi, string $route, OperationCollection $operationCollection): OpenApi
    {
        $pathItem = $this->getPathItem($operationCollection);
        $openApi->getPaths()->addPath($route, $pathItem);

        return $openApi;
    }

    private function getPathItem(OperationCollection $operationCollection): PathItem
    {
        $pathItem = new PathItem();
        $operations = $operationCollection->toArray();

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
} 
