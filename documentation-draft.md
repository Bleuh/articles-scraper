# Documentation

## Problemes identifiés

Notre application fonctionne correctement a petite echelle, comme dit dans l'ennoncer, une fois beaucoup d'articles dans la base, on risque d'avoir les problemes suivant :

- Des lenteurs dans nos requetes SQL

Surtout a cause de jointures par exemple (que nous n'avons pas pour le moment)

- La saturation du stockage de la base

Si notre base devient trop grosse, nous n'avons pas de replication, néanmois je pense que ca ne sera pas un tres gros probleme ici pour le moment (je me souviens de notre discution, vous aviez 1GO de mysql, c'etait inquiétant mais supportable) mais dans le cas d'un très très gros volume, ca sera probablement un gros probleme.

Cela entraine aussi une lenteur de l'acces a la base.

## Solutions envisagées

## Simple

Ajouter des index dans Mysql pour des requetes plus rapide.

Avoir un systeme de cache (redis ?) pour repondre a une requete deja effectué (j'imagine que mysql a deja un cache aussi).

**Pourquoi ?**

Permet d'ameliorer la base sans faire un refonte de l'architecture.

Beaucoup mieux si nous sommes dans une architecture impossible a toucher.

## Mes idées

### Migrer vers mongoDB

MongoDB est orienté NOSQL, cela permetrait de gerer un plus gros volument de données.

On peux egalement profité d'une meilleur indexation.

Je lis aussi sur internet que mongoDB propose un "Sharding natif", ce qui est une distribution des données sur plusieurs serveurs, ce qui ressoudrait un monté en charge progressive. (dans le cas d'une croissance imprevu)

Inconvenients :

- Migration

- Perte de relationel (mysql)

- MongoDB utilise plus de mémoire a cause des indexs

### Mon idée la plus complexe : coupler mySQL et MongoDB

Stockage des données relationel / structurées dans mySQL.

- MySQL est performant pour les relations

Stockage des données non relationel / volumineux dans MongoDB

- Recupération rapide des documents

Inconvenients :

- Gérer deux bases
- Complixité de synchronisation / Latence

## Solution implémentée et pourquoi

J'ai choisi la premiere solution ici car ca me semble la plus simple et adapté a se projet.

Je pourrais tres bien ajouter un MongoDB avec Docker et transferer les données / requetes, néanmois ca serait moins interessant dans l'état actuel de l'exercice.

Si je devais choisir sur du long terme, j'utiliserai Mysql pour stocker et enrichir des données importante et répétitive comme la **source** par exemple. (ou utilisateur)

Le reste du gros voluement sur mongoDB.

### Ce que je vais faire

- Ajouter des indexs dans MySql
- Ajouter un cache Redis pour les requetes
