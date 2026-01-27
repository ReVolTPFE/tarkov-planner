# ARCHITECTURE

## Architecture générale (haut niveau)
Client Nuxt → API Symfony pour les données (rooms, maps) + Client Socket.IO → serveur WS pour les tracés temps réel.

## Modules et responsabilités
- `frontend/app/pages/index.vue` : création de room via API puis redirection vers `/rooms/:uuid`.
- `frontend/app/pages/rooms/[uuid].vue` : connexion WS, join room, chargement des maps, rendu du canvas.
- `frontend/app/components/Canva.vue` : rendu du canvas Konva + images de map + formes.
- `frontend/app/stores/useDrawingStore.ts` : état local des tracés + émission des événements Socket.IO.
- `websocket-server/index.js` : maintient l’état en RAM par room et diffuse les updates.
- `backend/src/Controller` : endpoints REST pour rooms et maps.

## Données clés
- Room : `uuid`, `createdAt` (côté API).
- Map : `id`, `slug`, `image`.
- Shape : objet JS (id, type, points, stroke, strokeWidth, etc.) stocké côté client et relayé au serveur WS.

## Flux “un joueur rejoint une room”
1. L’utilisateur crée une room (`POST /api/rooms`) puis est redirigé vers `/rooms/:uuid`.
2. La page room appelle `fetchRoom(uuid)` (API) et `fetchMaps()`.
3. Le client Socket.IO se connecte puis émet `join-room` avec l’UUID.
4. Le serveur WS ajoute le socket à la room et renvoie `init-state` s’il existe un état RAM.
5. Le front injecte les formes reçues dans le store local et le canvas les rend.

## Points flous / à confirmer
- Synchronisation au-delà de la RAM WS (aucune persistance observée côté API).
