# Démarche & décisions techniques

> Journal des choix de conception du projet, documenté au fil de la réflexion.
> Objectif : rendre chaque décision traçable et défendable, plutôt que subie.

## 0. Cadrage

Avant d'écrire une ligne, trois arbitrages structurants ont été posés :

- **Architecture** : front React pur consommant directement une API publique,
  sans backend. Choix justifié par le périmètre (lecture seule de données ouvertes)
  et le temps imparti — à condition de trouver une API compatible CORS et sans clé.
- **Axes de qualité visés** : qualité du code & architecture front, design / UX,
  et chaîne CI/CD.
- **Périmètre** : MVP volontairement resserré, priorisé, assumant qu'il ne sera
  pas terminé — l'important est la cohérence des choix.

## 1. Données & stockage

**Décision : source unique = « Que faire à Paris ? » (API Explore v2.1 Opendatasoft).**

La compatibilité de l'API avec une architecture front pur a été vérifiée comme
prérequis : accès cross-domain via CORS, aucune clé d'API requise, méthode GET,
réponses JSON, langage de requête ODSQL pour le filtrage et les facettes. Ces
propriétés rendent un backend / proxy inutile.

**Réserve empirique assumée.** En inspectant le jeu de données (~3 300 records),
deux limites ont été identifiées et traitées :

- Les champs `date_start` / `date_end` sont **fréquemment `null`**. Un filtre
  « événements à venir » strict viderait la liste : on trie donc par défaut sur
  `updated_at desc` (fraîcheur éditoriale) et le libellé de date privilégie le
  champ `date_description` fourni par la source.
- Le jeu couvre le **Grand Paris** (certains `address_zipcode` valent `75000`) et
  certaines coordonnées valent `0,0` (valeur « vide ») : le mapper écarte ces
  coordonnées et ne déduit l'arrondissement que pour `75001`–`75020`.

**Décision : pas de base de données.** Les données étant en lecture seule et
maintenues à la source, le « stockage » se résume à :
- un **cache client** géré par TanStack Query (dédup, stale-while-revalidate, retry) ;
- les **favoris** en `localStorage` (préférence locale, sans compte utilisateur).

**Décision : couche d'adaptation (mapper) `apiEvent -> DomainEvent`.** L'open data
est hétérogène ; isoler le domaine derrière un mapper typé évite de coupler l'UI à
une source instable. Un seul point à modifier si le schéma source change.

## 2. Architecture front

**Décision : l'URL est la source de vérité de l'état.** Recherche et filtres vivent
dans les `searchParams` (React Router), pas dans un state React global.
Conséquences directes : recherche partageable par simple lien, état persistant au
refresh, navigation « précédent / suivant » gratuite.

**Flux retenu** (action → effet → rendu) :
saisie/​filtre → debounce 300 ms → `setSearchParams` → `useEvents` construit la
requête ODSQL et la clé de cache → TanStack Query sert le cache ou `fetch` →
mapper normalise → `EventList` rend avec états `loading / error / empty` explicites.

**Décision : favoris en flux séparé.** `toggleFavorite` écrit dans un store Zustand
persisté, avec optimistic update pour une réactivité immédiate. Aucun appel réseau.

**Organisation** feature-based (`features/events`, `features/favorites`, `shared/ui`,
`shared/lib`, `app`) pour garder un découpage net API / domaine / UI.

## 3. Identité visuelle

La direction a d'abord été cadrée par un parti-pris éditorial (esprit affiche
culturelle parisienne : fond papier, contraste serif/sans, un accent vif unique),
puis figée sur la palette **« Summer Sorbet »**, mieux adaptée à la tonalité
festive d'une appli d'événements.

**Décision : attribuer un rôle unique à chaque couleur** (cinq teintes vives non
maîtrisées = bruit visuel) :
- Regal Navy `#083d77` → texte ;
- Beige `#ebebd3` → fond ;
- Magenta Bloom `#da4167` → accent / CTA / favori ;
- Coral Glow `#f78764` → tags de catégorie, survols ;
- Royal Gold `#f4d35e` → highlights (badge « Gratuit », mises en avant).

**Décision : règles de contraste intégrées au design system** (a11y) :
- magenta + texte blanc réservé au gros texte (≥ 16 px / 500), sinon magenta foncé
  `#c5395c` ;
- gold et coral → toujours du texte navy, jamais blanc.

**Typographie :** Fraunces (titres) + Inter (UI/texte) — le contraste serif/sans
porte l'identité.

## 4. Landing / hero

**Décision : hero plein écran avec parallax multi-plans piloté au scroll, via Motion
(`useScroll` + `useTransform`)** plutôt qu'une librairie parallax dédiée — une seule
dépendance, déjà présente pour les micro-interactions, et transforms GPU.

Trois contraintes traitées dès la conception :
- **Performance** : animation limitée à `transform` / `opacity` ; `background-attachment:
  fixed` écarté (saccadé / désactivé sur mobile).
- **Accessibilité** : parallax sous `prefers-reduced-motion`, repli hero statique.
- **LCP / SEO** : reste de la page en `loading="lazy"`, images dimensionnées
  (anti-CLS). Le plan arrière du hero est composé de dégradés/halos (aucun asset
  binaire lourd à charger), de sorte que le LCP reste le titre, rendu instantané.

Alternative identifiée mais écartée pour ce projet : les animations CSS *scroll-driven*
(`animation-timeline: scroll()`), élégantes mais au support encore incomplet (Firefox
derrière un flag) ; réservées à un usage purement cosmétique en *progressive
enhancement*.

## 5. Outillage UI

**Décision : socle shadcn/ui (Radix, accessible, code possédé) + Motion pour 2–3
micro-interactions ciblées + au plus un effet de texte sur le hero.**

Les kits d'animation lourds ont été écartés : surcoût de bundle, risques perf/a11y,
et surtout des comportements difficiles à justifier. La sobriété maîtrisée a été
préférée à l'accumulation d'effets.

**Sélecteurs natifs plutôt que custom.** Pour les filtres (catégorie,
arrondissement), un `<select>` natif stylé a été préféré à un composant sur-mesure :
meilleure ergonomie tactile (picker natif mobile) et accessibilité clavier gratuite.

## 6. Mobile & responsive

**Décision : conception mobile-first.** L'usage d'une appli de sorties est
majoritairement mobile. La grille passe de 1 → 2 → 3 colonnes ; la barre de filtres
devient un **bottom-sheet** (feuille ancrée en bas) déclenché par un bouton
« Filtres » avec compteur ; les cibles tactiles font au moins 44 px de haut.

## 7. Déploiement

**Décision : chaîne CI/CD via GitHub Actions + Vercel.**
- CI à chaque push / PR : installation (`npm ci`), lint, typecheck, tests, build.
- CD : Vercel branché sur le dépôt Git déploie automatiquement chaque `main`
  (production) et chaque PR (preview). Aucun secret à gérer côté Actions.

**Décision : Dockerfile multi-stage** (build Node → runtime Nginx) maintenu dans le
repo, même avec une cible de prod statique, pour disposer d'un artefact conteneurisé
reproductible et démontrer la maîtrise de la chaîne.

**Décision : une fonction serverless pour la recherche par IA (entorse assumée).**
L'app reste « front pur » à une exception près : une fonction serverless Vercel
(`/api/ai-search`) qui traduit une envie en langage naturel en *filtres* via un LLM.
Justification : une clé d'API ne peut pas vivre dans un front statique (vol immédiat),
il faut donc un proxy minimal côté serveur. Le LLM n'invente aucun événement (il
produit des filtres, bornés côté serveur), et la fonctionnalité **dégrade
proprement** sans clé — le déploiement par défaut reste sans secret.

## 8. Ce qui resterait à faire

- Vue carte (Leaflet) et partage d'URL enrichi.
- Tests étendus au-delà du mapper, des filtres et du store.
- Migration vers un rendu SSG/SSR si le SEO devenait un enjeu réel.

> _Note d'implémentation :_ les méta dynamiques (titre / description par page) sont
> gérées par un petit hook maison (`Seo`) plutôt qu'une librairie dédiée — une
> dépendance en moins, et une compatibilité React 19 immédiate.
