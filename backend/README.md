# Production mode steps :

Once deployed in production, the API needs several steps to work :

- `php bin/console c:c`
- To warmup the cache for nelmio/cors to authorize the frontend app specified in the .env.prod file :
  - `php bin/console c:w`
- `php bin/console d:m:m`
