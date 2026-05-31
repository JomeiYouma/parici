<div align="center">

# Parici ?

**Sortir à Paris, c’est par ici.**

Une application web single-page pour trouver facilement concerts, expositions,
spectacles et sorties à Paris — propulsée par l’agenda open data de la Ville de Paris.

<!-- Remplacez OWNER par votre identifiant GitHub une fois le dépôt poussé -->
[![CI](https://github.com/OWNER/parici/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/parici/actions/workflows/ci.yml)

</div>

---

## ✨ Fonctionnalités

- 🔎 **Recherche instantanée** (debounce 300 ms) sur le titre et la description.
- 🎛️ **Filtres** par catégorie, tarif (gratuit / payant) et arrondissement.
- 🔗 **L’URL est la source de vérité** : toute recherche est partageable, persiste
  au rafraîchissement et fonctionne avec les boutons précédent / suivant.
- ❤️ **Favoris** enregistrés localement (sans compte), avec mise à jour optimiste.
- 📄 **Page détail** par événement (`/event/:id`), avec infos d’accessibilité.
- 🤖 **Recherche par IA** *(optionnelle)* : décrivez votre envie en langage
  naturel, un LLM la traduit en **filtres** — la donnée affichée reste 100 % réelle.
- 🗼 **Hero animé** : une Tour Eiffel (vrai SVG) se déconstruit au scroll, désactivé
  sous `prefers-reduced-motion`.
- 📱 **Mobile-first** : grille fluide, filtres en bottom-sheet, cibles tactiles ≥ 44 px.
- ♿ **Accessibilité** : primitives Radix, navigation clavier, contrastes AA.
- ⚖️ **Pages légales** : mentions légales + politique de confidentialité.

## 🧱 Stack

| Domaine        | Choix                                                        |
| -------------- | ----------------------------------------------------------- |
| Build / langage | [Vite](https://vite.dev) · React 19 · TypeScript (`strict`) |
| Données        | [TanStack Query](https://tanstack.com/query) (cache, retry) |
| Routing / état | [React Router](https://reactrouter.com) v7 (URL = source de vérité) |
| Favoris        | [Zustand](https://zustand.docs.pmnd.rs) (persisté localStorage) |
| UI             | [Tailwind CSS v4](https://tailwindcss.com) · primitives Radix possédées |
| Animations     | [Motion](https://motion.dev)                                |
| Tests          | [Vitest](https://vitest.dev) · Testing Library              |

## 📡 Source de données

[**« Que faire à Paris ? »**](https://opendata.paris.fr/explore/dataset/que-faire-a-paris-/)
— agenda participatif de la Ville de Paris, exposé via l’API Explore v2.1
d’Opendatasoft (CORS activé, **aucune clé requise**, GET/JSON, requêtes ODSQL).

> La réponse brute de l’API n’est **jamais** consommée directement par les
> composants : une couche d’adaptation (`mapper`) traduit `apiEvent → DomainEvent`.
> C’est l’*anti-corruption layer* du projet — un seul point à modifier si la Ville
> renomme un champ.

## 🏗️ Architecture & flux de données

Organisation **feature-based** :

```
api/                    fonction serverless Vercel (recherche IA, optionnelle)
src/
├─ app/                 providers (QueryClient, Router), layout, routing, Seo
├─ features/
│  ├─ events/           api · mapper · types · hooks · filtres · composants (dont Hero)
│  ├─ favorites/        store Zustand persisté + bouton favori
│  └─ ai/               client + champ de recherche IA (traduction envie → filtres)
├─ pages/               Home, EventDetail, Favorites, légal, NotFound
├─ shared/
│  ├─ ui/               design system (Button, Badge, Dialog, Select…)
│  └─ lib/              client HTTP, stripHtml, utils, hooks transverses
└─ test/                setup Vitest
```

Flux d’une recherche / d’un filtre :

```
saisie / filtre
   └─▶ debounce 300 ms
        └─▶ setSearchParams  (l’URL devient la source de vérité)
             └─▶ useEvents lit les params → construit la requête ODSQL + la clé de cache
                  └─▶ TanStack Query  (cache stale-while-revalidate, retry, dédup)
                       └─▶ mapper  apiEvent → DomainEvent
                            └─▶ EventList  (états explicites : skeleton / error / empty)
```

Les **favoris** suivent un flux séparé, sans réseau : `toggle(event)` écrit dans le
store Zustand (persisté en `localStorage`) de façon synchrone — l’UI réagit
immédiatement.

## 🚀 Démarrage

Prérequis : **Node ≥ 20**.

```bash
npm install      # installe les dépendances
npm run dev      # serveur de dev (http://localhost:5173)
```

### Scripts disponibles

| Script               | Rôle                                            |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Serveur de développement (HMR)                  |
| `npm run build`      | Typecheck + build de production dans `dist/`    |
| `npm run preview`    | Sert le build de production en local            |
| `npm run lint`       | ESLint                                          |
| `npm run typecheck`  | Vérification des types (sans émission)          |
| `npm run test`       | Tests en mode watch                             |
| `npm run test:run`   | Tests une fois (utilisé en CI)                  |
| `npm run format`     | Formatage Prettier                              |

## ✅ Tests

Tests ciblés sur la logique critique (pure, sans réseau) :

- `mapper.test.ts` — la couche anti-corruption (nettoyage HTML, arrondissement,
  géo `0,0`, tags, gratuité).
- `filters.test.ts` — parsing / sérialisation des filtres dans l’URL.
- `api.test.ts` — construction de la clause ODSQL `where`.
- `store.test.ts` — toggle des favoris.

```bash
npm run test:run
```

## 🔄 Intégration continue

La [CI GitHub Actions](.github/workflows/ci.yml) s’exécute à chaque push / PR sur
`main` : `npm ci` → **lint** → **typecheck** → **tests** → **build**.

## ☁️ Déploiement

### Vercel (cible de production)

L’application est déployée sur **Vercel**, branché sur le dépôt Git : `main` part en
production et chaque PR obtient une URL de preview. Le *rewrite* SPA nécessaire à
`/event/:id` est fourni par [`vercel.json`](./vercel.json). La CI valide le code,
l’intégration Git de Vercel assure la livraison (aucun secret à gérer).

### Docker (artefact statique Nginx)

Un [`Dockerfile`](./Dockerfile) multi-stage (build Node → runtime Nginx) est fourni :

```bash
docker build -t parici .
docker run --rm -p 8080:80 parici   # http://localhost:8080
```

## 🤖 Recherche par IA (optionnelle)

Une fonction serverless [`api/ai-search.ts`](./api/ai-search.ts) traduit une envie
en langage naturel (« un concert gratuit ce week-end ») en **filtres structurés**,
ensuite appliqués à la vraie API Paris. Le LLM **n’invente aucun événement** : il ne
produit que des filtres, et le serveur les borne avant de répondre.

- **La clé OpenAI reste côté serveur** (variable d’env `OPENAI_API_KEY` sur Vercel),
  jamais exposée au navigateur — c’est la seule entorse au « front pur », assumée.
- **Sans clé, l’app fonctionne normalement** : la recherche IA affiche un message
  « non configuré ». Le déploiement par défaut ne requiert donc aucun secret.
- Pour l’activer : ajoutez `OPENAI_API_KEY` dans les variables d’environnement Vercel
  (voir [`.env.example`](./.env.example)). Pour masquer l’UI : `VITE_AI_ENABLED=false`.

> En local, `npm run dev` ne sert pas les fonctions `/api` ; utilisez `vercel dev`
> pour les tester.

## ♿ Accessibilité & SEO

- HTML sémantique, primitives Radix (ARIA / focus), navigation clavier, skip-link,
  contrastes AA, `alt` sur les images, respect de `prefers-reduced-motion`.
- SEO : limite assumée d’une SPA en rendu client, mitigée par des méta dynamiques
  (titre / description par page via un hook maison léger), des URLs propres et une
  structure sémantique. En production réelle, on passerait à du SSG/SSR.

## 📄 Licence & crédits

Code sous licence [MIT](./LICENSE).
Données : [« Que faire à Paris ? »](https://opendata.paris.fr/explore/dataset/que-faire-a-paris-/)
— Ville de Paris, sous licence **ODbL**.

> Les choix de conception sont documentés dans [`docs/DEMARCHE.md`](./docs/DEMARCHE.md).
