# Scrapeur d'articles

## Objectif

L’objectif de ce test est de concevoir un scrapeur et une API REST avec NestJS pour collecter et stocker des infos sur des articles d’actualité depuis un site donné dans une base MySQL. Et d’identifier les éventuels problèmes de performance et de proposer des optimisations adaptées.

## Missions

1. **Développer une API REST** permettant de stocker et récupérer la liste des articles.
2. **Analyser les problèmes potentiels** liés au stockage et aux performances. ([documentation.md](./documentation.md))
3. **Proposer une solution d’optimisation** et l’implémenter.

## Installation

Pour installer les dépendances requises, exécutez :

```bash
npm install
```

## Utilisation

Pour exécuter le scraper avec docker avec les bases pré-configuré, utilisez la commande suivante :

```bash
docker compose up
```

---

Pour exécuter le scraper en mode normal, utilisez la commande suivante :

```bash
npm run start
```

Il faut bien penser lancer vos bases et changer les hosts correcpondant dans l'application. (data-source.ts et app.module.ts)
