# Repository Guidelines

## Structure du projet & organisation des modules
- `frontend/` : app Nuxt 4 (Vue 3, Tailwind). Code principal dans `frontend/app/`, assets statiques dans `frontend/public/`.
- `backend/` : API Symfony 7.4. Code applicatif dans `backend/src/`, config dans `backend/config/`, migrations dans `backend/migrations/`.
- `websocket-server/` : serveur Socket.IO (`index.js`) avec son `package.json`.
- Docker : définitions dans `docker-compose.yml` / `docker-compose.prod.yml` et Dockerfiles par service dans `*/docker/`.

## Commandes build, test et développement
- Frontend (depuis `frontend/`) :
  - `npm install` puis `npm run dev` (serveur de dev).
  - `npm run build` (build prod), `npm run preview` (serve la build).
- Backend (depuis `backend/`) :
  - `composer install` puis `php -S localhost:8000 -t public` (serveur simple).
  - `php bin/console cache:clear` et `php bin/console cache:warmup` (cache).
  - `php bin/console doctrine:migrations:migrate` (migrations DB).
- Websockets (depuis `websocket-server/`) :
  - `npm install` puis `node index.js` (démarre Socket.IO).
- Docker (racine du repo) :
  - `docker compose up --build` (lance la stack).

## Style de code & conventions de nommage
- Suivre les conventions existantes ; éviter les gros reformatages isolés.
- Composants Vue : `PascalCase.vue` dans `frontend/app/components/`.
- Stores Pinia : `useXStore.ts` dans `frontend/app/stores/`.
- Symfony : entités en `PascalCase` dans `backend/src/Entity/`, repositories `XRepository.php` dans `backend/src/Repository/`, contrôleurs dans `backend/src/Controller/`.

## Tests
- Aucun framework de test n’est actuellement configuré.
- Si vous ajoutez des tests, placez-les dans `backend/tests/` (autoload `App\\Tests\\`) et documentez le runner ici.

## Commits & Pull Requests
- Les messages de commit suivent des préfixes type Conventional Commits (ex. `feat:`, `fix:`, `refactor:`).
- Les PRs doivent inclure une description concise, l’issue liée (si applicable) et des captures d’écran/GIFs pour les changements UI.

## Configuration & sécurité
- Partir de `.env.example` pour les variables d’environnement locales.
- Les étapes de cache en prod du backend sont décrites dans `backend/README.md`.
