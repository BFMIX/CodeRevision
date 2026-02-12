# CodeRevision - Base Web & Mobile (PWA)

Base de projet pour une application d'entraînement au code de la route, orientée "tests only" avec interface moderne, flat et mobile-first.

## Livrables

- `index.html`
- `styles.css`
- `app.js`
- `manifest.webmanifest`
- `service-worker.js`

## Fonctionnalités UI/UX

- SPA front-only avec hash routing:
  - `#/home`
  - `#/tests`
  - `#/progress`
  - `#/settings`
- Bottom nav fixe (icônes + labels)
- Cards modernes pour les modules
- Micro-animations (entrée de page, hover/active, transitions badges)
- Mode clair/sombre persistant (`localStorage`)
- Responsive mobile-first

## Tests intégrés en iframe

Modules inclus:

1. Conducteur
2. Réglementation générale
3. Respect de l'environnement
4. Circulation routière
5. Mécanique
6. Quitter et s'installer dans le véhicule
7. Premiers secours
8. La route
9. Équipements de sécurité
10. Autres usagers

Chaque module propose:

- `Ouvrir le test` -> pré-test -> écran iframe plein écran
- `Valider ce module` -> mini questionnaire interne

## Logique de validation interne

Questionnaire après test:

- J'ai terminé le test en entier
- J'ai eu au moins 35/40

Règle:

- Si la case score `35/40` est cochée -> module validé
- Sinon -> message: `Tu peux le refaire 💪`

## Stockage local (`localStorage`)

Clé: `codeRevision.local.ui.v2`

Structure:

- `darkMode` (bool)
- `modules[moduleId].validated` (bool)
- `modules[moduleId].validatedAt` (date ISO ou `null`)

## Progression

- Anneau visuel de progression (%)
- Compteur validés `/10`
- Liste des modules avec badges colorés
- Mention: `Progression interne (non officielle)`

## Lancer localement

Utiliser un serveur statique (nécessaire pour service worker):

```bash
python3 -m http.server 8080
```

Puis ouvrir:

- [http://localhost:8080](http://localhost:8080)

## Notes

- Aucun backend, aucune API, aucun scraping
- L'iframe dépend de la politique du site externe (headers de sécurité)
- Le mode offline couvre uniquement l'UI locale de l'app
