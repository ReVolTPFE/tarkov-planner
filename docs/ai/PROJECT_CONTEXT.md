# PROJECT_CONTEXT

## Vue d’ensemble
Tarkov Planner est une web‑app collaborative pour planifier sur des cartes d’Escape From Tarkov. Le front (Nuxt 4) affiche une carte et un canvas de dessin, l’API (Symfony 7.4) gère les rooms et les maps, et un serveur Socket.IO gère le temps réel.

## Composants majeurs
- Frontend (`frontend/`) : Nuxt 4 + Vue 3 + Pinia, canvas basé sur vue‑konva.
- Backend (`backend/`) : API REST Symfony. Endpoints principaux `/api/rooms` et `/api/maps`.
- Websocket (`websocket-server/`) : Socket.IO dédié, stockage RAM des tracés par room.

## Ce qui est confirmé
- Les rooms sont créées côté API et identifiées par un UUID.
- Les maps (slug + image) sont servies par l’API et utilisées par le front.
- Les tracés sont synchronisés via Socket.IO et stockés en RAM côté serveur WS.

## Points flous / à confirmer
- Persistance long terme des tracés : une entité `Drawing` existe côté backend, mais aucun endpoint ne l’utilise actuellement.
- Authentification/gestion des droits : non observée dans le code actuel.
