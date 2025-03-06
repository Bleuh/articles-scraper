# Documentation

## Problèmes identifiés

Notre application fonctionne correctement à petite échelle. Comme indiqué dans l'énoncé, si le nombre d'articles dans la base de données augmente considérablement, nous risquons de rencontrer les problèmes suivants :

- **Lenteur des requêtes SQL**
  - Cela peut être particulièrement problématique en cas de jointures complexes (que nous n'avons pas encore, mais qui pourraient être nécessaires à l'avenir).

- **Saturation du stockage de la base de données**
  - Si la base devient trop volumineuse, le manque de réplication pourrait poser problème. Cela dit, à ce stade, ce n'est pas encore un enjeu critique (je me souviens de notre discussion où vous aviez 1 Go de MySQL ; c'était préoccupant mais encore gérable).
  - Toutefois, en cas de très forte croissance, cela deviendrait probablement un problème majeur, entraînant également des ralentissements dans l'accès aux données.

---

## Solutions envisagées

### **Solution simple**

- **Ajout d'index dans MySQL** pour optimiser les requêtes et améliorer la vitesse d'exécution.
- **Mise en place d'un système de cache** (Redis ?) afin de stocker les réponses des requêtes déjà effectuées (MySQL possède également un mécanisme de cache interne).

**Pourquoi cette solution ?**

- Elle permet d'améliorer les performances sans refondre entièrement l'architecture.
- Elle est particulièrement adaptée si l'infrastructure actuelle ne permet pas de grands changements.

---

## **Mes idées**

### **Migrer vers MongoDB**

MongoDB étant une base NoSQL, il permettrait de gérer un volume de données beaucoup plus important.

- Il offre une **indexation plus performante** et une récupération rapide des documents.
- Il propose un **sharding natif**, permettant de distribuer les données sur plusieurs serveurs et donc de mieux gérer une montée en charge progressive (notamment en cas de croissance imprévue).

**Inconvénients :**

- **Migration complexe** depuis MySQL.
- **Perte du relationnel** (MySQL gère mieux les relations entre données).
- **Consommation mémoire plus élevée** à cause des index.

---

### **Coupler MySQL et MongoDB**

L'idée serait d'utiliser chaque base pour ses forces spécifiques :

- **Stockage des données relationnelles / structurées dans MySQL**
  - MySQL est performant pour la gestion des relations et l'intégrité des données.

- **Stockage des données non relationnelles / volumineuses dans MongoDB**
  - Permet une récupération rapide des documents et une meilleure gestion des gros volumes.

**Inconvénients :**

- **Gestion de deux bases de données** (maintenance plus lourde).
- **Complexité de synchronisation et risque de latence**.

---

## **Solution implémentée et justification**

J'ai choisi d'implémenter la **première solution** (ajout d'index et mise en place d'un cache) car elle me semble **la plus simple et adaptée** à ce projet.

Je pourrais ajouter MongoDB via Docker et transférer les données et requêtes, mais dans le cadre de cet exercice, cela serait moins pertinent.

Sur le long terme, je choisirais une approche hybride :

- **MySQL** pour stocker et enrichir les **données critiques et répétitives** (ex: sources, utilisateurs).
- **MongoDB** pour gérer les **données volumineuses et moins structurées** (ex: contenu des articles).

---

### **Actions à venir**

- ✅ Ajouter des **index** dans MySQL.
- ✅ Mettre en place un **cache Redis** pour optimiser les requêtes.
