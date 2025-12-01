# Super Pomodoro

## Requirements

Docker desktop

## Installation

Run the following commands:

```
docker compose build
docker compose up -d
```

In 'backend' container execute the following commands:
- for updating the database
```
php bin/console doctrine:migration:migrate
```
- for adding the JWT tokens
```
php bin/console lexik:jwt:generate-keypairs
```

Wait till 'frontend' container is finished executing, the access the page through `localhost:8081`
