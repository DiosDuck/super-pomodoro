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
# from docker desktop
php bin/console doctrine:migration:migrate
# from CLI
(sudo) docker exec -ti backend php bin/console doctrine:migration:migrate
```
- for adding the JWT tokens
```
# from docker desktop
php bin/console lexik:jwt:generate-keypair
#from CLI
(sudo) docker exec -ti backend php bin/console lexik:jwt:generate-keypair
```

Wait till 'frontend' container is finished executing, the access the page through `localhost:8081`
