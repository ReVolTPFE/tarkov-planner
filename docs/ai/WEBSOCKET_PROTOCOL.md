# WEBSOCKET_PROTOCOL

## Connexion
- Client : `frontend/app/plugins/socket.client.ts` (autoConnect: false)
- URL : `runtimeConfig.public.WS_URL`

## Événements entrants (client → serveur)
- `join-room` : payload `roomId` (UUID). Le serveur rejoint la room et renvoie l’état si disponible.
- `send-shape` : `{ roomId, shape, mapSlug }` ajoute un tracé en RAM et notifie les autres.
- `delete-shape` : `{ roomId, mapSlug, shapeId }` supprime une forme en RAM + broadcast.
- `clear-canva` : `{ roomId, mapSlug }` supprime toutes les formes de la map dans la room.

## Événements sortants (serveur → client)
- `init-state` : tableau de `{ shape, mapSlug }` envoyé au nouvel arrivant.
- `new-shape` : `{ shape, mapSlug }` pour synchroniser un nouveau tracé.
- `delete-shape` : `{ shapeId, mapSlug }` pour suppression à distance.
- `canva-cleared` : `mapSlug` quand une map est vidée.

## Persistance RAM côté serveur
- L’état est conservé dans `roomStates` (objet en mémoire) par room.
- Structure : `{ [roomId]: Array<{ shape, mapSlug }> }`.
- Aucun TTL ni sauvegarde disque observée : si le serveur WS redémarre, l’état est perdu.

## Points flous / à confirmer
- Auth des sockets et validation de payloads (non observées).
