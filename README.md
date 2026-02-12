# CodeRevision - MVP PWA (tests only)

Application web mobile-first d'entraînement au code de la route français, centrée uniquement sur la pratique via modules de tests intégrés en iframe.

## Fonctionnalités

- Navigation simple avec menu bas mobile:
  - `Accueil`
  - `Tests`
  - `Progression`
  - `Paramètres`
- 10 modules de tests externes (iframe plein écran + bouton retour)
- Rappels affichés avant chaque lancement de test
- Validation interne obligatoire après test via mini questionnaire
- Progression locale persistée en `localStorage`:
  - statut validé / non validé
  - date de validation
  - compteur total validé
  - streak simple (jours consécutifs)
- Paramètres:
  - mode sombre
  - réinitialisation de progression
  - placeholder publicité
- PWA installable:
  - `manifest.webmanifest`
  - `service-worker.js` (cache UI offline)

## Stack

- HTML, CSS, JavaScript (vanilla)
- Aucun backend, aucune API, aucun scraping

## Lancer localement

Utiliser un serveur statique local (recommandé pour tester correctement le service worker):

```bash
python3 -m http.server 8080
```

Puis ouvrir [http://localhost:8080](http://localhost:8080).

## Déploiement GitHub Pages

1. Pousser le code sur la branche `main`.
2. Sur GitHub: `Settings` -> `Pages`.
3. Source: `Deploy from a branch`.
4. Branch: `main`, dossier `/ (root)`.
5. Sauvegarder puis ouvrir l'URL Pages fournie.

## Limites connues

- Le contenu externe en iframe dépend du site source et de sa politique de frame.
- Le mode offline concerne uniquement l'interface locale de l'app; les tests iframe externes nécessitent Internet.
