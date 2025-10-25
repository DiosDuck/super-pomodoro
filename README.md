# Super Pomodoro

## Requirements

Docker desktop

## Installation

Run the following commands:

```
docker compose build
docker compose up -d
```

Wait till 'frontend' container is finished executing, the access the page through `localhost:8081`

If you want in the future to skip the `composer install` and `npm ci`, rename or make a copy of `dc.override.yml` file and rename it into `docker-compose.override.yml`