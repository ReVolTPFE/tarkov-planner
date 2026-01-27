# CANVAS_MODEL

## Où est le canvas de dessin
- Composant principal : `frontend/app/components/Canva.vue`.
- Basé sur `vue-konva` (`<v-stage>`, `<v-layer>`, `<v-line>`, `<v-arrow>`, `<v-rect>`, `<v-ellipse>`).

## Modèle de données des tracés (client)
- Store Pinia : `frontend/app/stores/useDrawingStore.ts`.
- Structure : `drawings` = `Record<mapSlug, Shape[]>`.
- Getter `activeMapShapes` expose les formes de la map courante.

## Shape (structure observée)
- Champs communs : `id` (timestamp string), `type`, `points`, `stroke`, `strokeWidth`, `lineCap`, `lineJoin`, `draggable`.
- `pen` : `points` = liste [x1, y1, x2, y2, ...].
- `arrow` / `square` : `points` = [x1, y1, x2, y2].
- `circle` : stocke `centerX`, `centerY`, `radiusX`, `radiusY` (ellipse).

## Cycle de dessin
- `useCanvaEvents.ts` gère mouse down/move/up.
- `startShape` crée une shape locale et l’ajoute au store.
- `updateShape` modifie en live la shape active.
- `stopDrawing` émet `send-shape` via Socket.IO pour synchroniser.

## Échelle & épaisseur
- `REFERENCE_WIDTH = 5000`.
- L’épaisseur réelle est ajustée selon la largeur réelle de la map (`currentMapWidth / REFERENCE_WIDTH`).

## Effacement
- Outil “eraser” : détecte les intersections Konva et appelle `removeShape(mapSlug, shapeId, localOnly=false)`.

## Points flous / à confirmer
- Aucun mode “undo/redo” activé (code partiellement commenté).
