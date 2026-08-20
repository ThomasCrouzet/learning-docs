---
tags:
  - Unix/Bash
  - Débutant
  - Référence
description: "Guide tmux - multiplexeur de terminal"
estimated_time: "55 min"
fiche_number: 6
total_fiches: 18
cursus: "Fiches de référence"
---

# Guide tmux

> **En bref** : À la fin de cette fiche, tu sauras utiliser tmux pour gérer plusieurs sessions, fenêtres et panneaux dans un seul terminal. Lecture estimée : 55 min.


## Prérequis

- Avoir Ghostty installé sur macOS
- Utiliser zsh comme shell (c'est le shell par défaut sur macOS)
- Connaître les commandes de base du shell : `cd`, `ls`, `pwd`
- Aucune connaissance préalable de tmux n'est requise (tout est expliqué ci-dessous)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser tmux pour gérer plusieurs sessions, fenêtres et panneaux dans un seul terminal.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que tmux ?

**Définition** : tmux (terminal multiplexer) est un programme qui permet de créer plusieurs terminaux virtuels à l'intérieur d'un seul terminal physique, et de les garder actifs même après déconnexion.

**Le problème que tmux résout** :

Sans tmux, voici les problèmes rencontrés :

1. **Perte de travail à la déconnexion** : si tu fermes ton terminal ou si ta connexion SSH se coupe, tous les processus en cours s'arrêtent.
2. **Un seul espace de travail** : pour travailler sur plusieurs tâches en parallèle (éditer du code, surveiller des logs, lancer un serveur), il faut ouvrir plusieurs fenêtres de terminal.
3. **Pas de partage d'écran** : impossible de montrer ton terminal à distance à quelqu'un d'autre en temps réel.

**Comment tmux résout ces problèmes** :

| Problème | Solution apportée par tmux |
| --- | --- |
| Perte de travail à la déconnexion | Les sessions tmux restent actives en arrière-plan. Tu peux te reconnecter et retrouver ton travail intact |
| Un seul espace de travail | tmux permet de diviser un terminal en plusieurs panneaux et fenêtres |
| Pas de partage d'écran | Plusieurs utilisateurs peuvent se connecter à la même session tmux |

**Analogie concrète** : Imagine un bureau physique avec un seul écran d'ordinateur. Sans tmux, tu ne peux afficher qu'une seule application à la fois. Avec tmux, c'est comme si tu ajoutais un système de bureaux virtuels : tu peux diviser ton écran en plusieurs zones, basculer entre des espaces de travail différents, et même éteindre ton écran puis le rallumer en retrouvant tout exactement comme tu l'avais laissé.

**Ce que tmux n'est PAS** :

- tmux n'est pas un shell. tmux ne remplace pas zsh. C'est un programme qui **contient** des shells. Quand tu ouvres un panneau tmux, il lance automatiquement zsh à l'intérieur. Tu tapes tes commandes dans ce zsh.
- tmux n'est pas un émulateur de terminal. Ghostty est ton émulateur de terminal : c'est le programme graphique qui affiche le texte. tmux fonctionne à l'intérieur de Ghostty.

**Comparaison tmux vs screen** :

| tmux | screen |
| --- | --- |
| Interface plus moderne | Plus ancien, interface basique |
| Division en panneaux facile | Division en panneaux limitée |
| Barre de statut intégrée | Pas de barre de statut par défaut |
| Configuration claire (`~/.tmux.conf`) | Configuration moins intuitive |
| Raccourci préfixe : `Ctrl+b` | Raccourci préfixe : `Ctrl+a` |

---

### Qu'est-ce qu'une session tmux ?

**Définition** : Une session est le conteneur principal de tmux. Elle regroupe un ou plusieurs fenêtres et persiste même après la fermeture du terminal.

**Le problème que les sessions résolvent** :

Sans sessions, voici les problèmes rencontrés :

1. **Pas de contexte de travail** : impossible de regrouper les terminaux par projet ou par tâche.
2. **Tout est perdu en fermant le terminal** : les processus en cours s'arrêtent.

**Comment les sessions résolvent ces problèmes** :

| Problème | Solution apportée par les sessions |
| --- | --- |
| Pas de contexte de travail | Chaque session peut être nommée (ex: "projet-web", "monitoring") |
| Tout est perdu en fermant le terminal | La session continue en arrière-plan. On peut s'y reconnecter |

**Analogie concrète** : Une session tmux est comme un bureau dans un espace de coworking. Tu peux y laisser tes affaires (fichiers ouverts, programmes en cours), quitter la pièce, revenir le lendemain, et tout est resté en place.

**Ce qu'une session n'est PAS** :

- Une session n'est pas une fenêtre. Une session **contient** une ou plusieurs fenêtres. La fenêtre est un niveau en dessous dans la hiérarchie.

---

### Qu'est-ce qu'une fenêtre tmux ?

**Définition** : Une fenêtre (window) est un écran complet à l'intérieur d'une session. Chaque fenêtre occupe toute la surface du terminal et peut être divisée en panneaux.

**Analogie concrète** : Si la session est un bureau, une fenêtre est un écran d'ordinateur sur ce bureau. Tu peux avoir plusieurs écrans, mais tu n'en regardes qu'un seul à la fois. Tu bascules de l'un à l'autre avec un raccourci clavier.

---

### Qu'est-ce qu'un panneau tmux ?

**Définition** : Un panneau (pane) est une subdivision d'une fenêtre. Chaque panneau affiche son propre shell indépendant.

**Analogie concrète** : Si la fenêtre est un écran, les panneaux sont des zones de cet écran séparées par des lignes. Par exemple, tu peux couper l'écran en deux : à gauche ton éditeur de code, à droite un terminal pour exécuter tes commandes.

---

### Hiérarchie complète : de Ghostty à zsh

Voici comment les différentes couches s'emboîtent, de l'extérieur vers l'intérieur :

```text
Ghostty (émulateur de terminal - la fenêtre graphique)
└── tmux (multiplexeur - gère les sessions/fenêtres/panneaux)
    └── Session (conteneur principal)
        ├── Fenêtre 1 (écran complet)
        │   ├── Panneau 1 → zsh (ton shell)
        │   └── Panneau 2 → zsh (ton shell)
        └── Fenêtre 2 (écran complet)
            └── Panneau 1 → zsh (ton shell)
```

Chaque panneau lance automatiquement zsh. Tu peux donc avoir plusieurs shells zsh indépendants dans une seule fenêtre Ghostty.

---

### Qu'est-ce que le préfixe tmux ?

**Définition** : Le préfixe est la combinaison de touches que tu dois appuyer **avant** chaque raccourci tmux. Par défaut, le préfixe est `Ctrl+b`.

**Le problème que le préfixe résout** :

Sans préfixe, les raccourcis tmux entreraient en conflit avec les raccourcis du shell et des programmes qui tournent dans les panneaux.

**Comment utiliser le préfixe** :

1. Appuie sur `Ctrl+b` (maintiens Ctrl, appuie sur b)
2. **Relâche les deux touches**
3. Appuie sur la touche du raccourci (ex: `c` pour créer une fenêtre)

Le préfixe n'est pas une combinaison à trois touches. C'est une séquence en deux temps : d'abord le préfixe, puis la commande.

---

## Étapes Pratiques

### Étape 1 : Installer tmux

tmux s'installe via Homebrew, le gestionnaire de paquets de macOS.

Si Homebrew n'est pas installé, ouvre Ghostty et exécute :

```bash
# Installe Homebrew (le gestionnaire de paquets de macOS)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Ensuite, installe tmux :

```bash
# Installe tmux via Homebrew
brew install tmux
```

Vérifie que l'installation a fonctionné :

```bash
# Affiche la version de tmux installée
tmux -V
```

**Résultat attendu** :

```text
tmux 3.7c
```

Le numéro de version peut être légèrement différent selon la date d'installation. L'important est qu'une version s'affiche sans erreur.

---

### Étape 2 : Créer et quitter une session

Crée ta première session tmux :

```bash
# Crée une nouvelle session tmux nommée "test"
tmux new-session -s test
```

Tu es maintenant dans tmux. Tu remarques une **barre verte en bas** de ton terminal. C'est la barre de statut de tmux. Elle affiche le nom de la session et la liste des fenêtres.

Pour quitter cette session **en la gardant active** (detach) :

1. Appuie sur `Ctrl+b`
2. Relâche les touches
3. Appuie sur `d`

**Résultat attendu** :

```text
[detached (from session test)]
```

Tu es revenu dans ton terminal normal. La session "test" continue de tourner en arrière-plan.

---

### Étape 3 : Lister et se reconnecter aux sessions

Liste les sessions actives :

```bash
# Affiche toutes les sessions tmux en cours
tmux list-sessions
```

**Résultat attendu** :

```text
test: 1 windows (created Fri Mar 13 10:00:00 2026)
```

Reconnecte-toi à la session :

```bash
# Se rattache à la session nommée "test"
tmux attach-session -t test
```

Tu retrouves ton terminal exactement comme tu l'avais laissé.

---

### Étape 4 : Créer et naviguer entre les fenêtres

Depuis l'intérieur d'une session tmux :

Crée une nouvelle fenêtre :

1. Appuie sur `Ctrl+b`
2. Appuie sur `c`

La barre de statut en bas affiche maintenant deux fenêtres (0 et 1). L'astérisque (`*`) indique la fenêtre active.

Navigue entre les fenêtres :

- `Ctrl+b` puis `n` : fenêtre **suivante** (next)
- `Ctrl+b` puis `p` : fenêtre **précédente** (previous)
- `Ctrl+b` puis `0` : aller à la fenêtre numéro 0
- `Ctrl+b` puis `1` : aller à la fenêtre numéro 1

---

### Étape 5 : Diviser une fenêtre en panneaux

Divise la fenêtre **horizontalement** (un panneau en haut, un en bas) :

1. Appuie sur `Ctrl+b`
2. Appuie sur `"` (guillemet double)

Divise la fenêtre **verticalement** (un panneau à gauche, un à droite) :

1. Appuie sur `Ctrl+b`
2. Appuie sur `%` (symbole pourcentage)

Pour naviguer entre les panneaux :

- `Ctrl+b` puis flèche directionnelle (haut, bas, gauche, droite)

Pour fermer un panneau :

```bash
# Tape exit dans le panneau que tu veux fermer
exit
```

---

### Étape 6 : Renommer une session et une fenêtre

Renomme la session courante :

1. Appuie sur `Ctrl+b`
2. Appuie sur `$`
3. Tape le nouveau nom
4. Appuie sur `Entrée`

Renomme la fenêtre courante :

1. Appuie sur `Ctrl+b`
2. Appuie sur `,` (virgule)
3. Tape le nouveau nom
4. Appuie sur `Entrée`

---

### Étape 7 : Supprimer une session

D'abord, détache-toi de la session (`Ctrl+b` puis `d`), puis :

```bash
# Supprime la session nommée "test"
tmux kill-session -t test
```

**Résultat attendu** : aucune sortie si la commande a réussi.

Vérifie :

```bash
# Vérifie qu'il n'y a plus de session active
tmux list-sessions
```

**Résultat attendu** :

```text
no server running on /tmp/tmux-501/default
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `tmux new-session -s nom` | Crée une nouvelle session nommée "nom" |
| `tmux attach-session -t nom` | Se rattache à la session "nom" |
| `tmux list-sessions` | Liste toutes les sessions actives |
| `tmux kill-session -t nom` | Supprime la session "nom" |
| `tmux kill-server` | Arrête tmux et toutes les sessions |

| Raccourci (préfixe `Ctrl+b`) | Action |
| --- | --- |
| `d` | Se détacher de la session |
| `c` | Créer une nouvelle fenêtre |
| `n` | Fenêtre suivante |
| `p` | Fenêtre précédente |
| `0-9` | Aller à la fenêtre numéro N |
| `"` | Diviser horizontalement (haut/bas) |
| `%` | Diviser verticalement (gauche/droite) |
| Flèches | Naviguer entre les panneaux |
| `,` | Renommer la fenêtre courante |
| `$` | Renommer la session courante |
| `x` | Fermer le panneau courant (avec confirmation) |
| `z` | Zoomer/dézoomer le panneau courant (plein écran) |

---

## Pièges Fréquents

### Piège 1 : Oublier de relâcher les touches avant la commande

⚠️ **Problème** : Tu appuies sur `Ctrl+b+c` en même temps (les trois touches simultanément). Rien ne se passe ou un caractère bizarre apparaît.

✅ **Solution** : Le préfixe est une **séquence**, pas une combinaison. Appuie sur `Ctrl+b`, relâche, **puis** appuie sur la touche de commande.

---

### Piège 2 : Confondre "quitter" et "détacher"

⚠️ **Problème** : Tu tapes `exit` dans le dernier panneau de la dernière fenêtre. La session est **supprimée**, pas détachée.

✅ **Solution** : Pour garder la session active en arrière-plan, utilise toujours `Ctrl+b` puis `d` (detach). Réserve `exit` pour fermer un panneau spécifique quand tu en as plusieurs.

---

### Piège 3 : Session "perdue" après une déconnexion

⚠️ **Problème** : Tu te déconnectes d'un serveur SSH et tu crois que ta session tmux est perdue.

✅ **Solution** : La session est toujours active sur le serveur. Reconnecte-toi en SSH, puis :

```bash
# Liste les sessions toujours actives
tmux list-sessions

# Rattache-toi à ta session
tmux attach-session -t nom-de-ta-session
```

---

### Piège 4 : Problème d'affichage avec Ghostty (variable TERM)

⚠️ **Problème** : Ghostty utilise la variable `TERM=xterm-ghostty`. Certains programmes lancés dans tmux ne reconnaissent pas ce type de terminal et affichent des caractères bizarres ou des erreurs comme `WARNING: terminal is not fully functional`.

✅ **Solution** : tmux utilise sa propre variable TERM (`screen-256color` par défaut). Si tu rencontres des problèmes d'affichage, ajoute cette ligne dans ton fichier `~/.tmux.conf` :

```bash
# Force tmux à utiliser un type de terminal compatible avec 256 couleurs
set -g default-terminal "tmux-256color"
```

Puis recharge la configuration (depuis l'intérieur de tmux) :

1. Appuie sur `Ctrl+b`
2. Appuie sur `:` (deux-points)
3. Tape `source-file ~/.tmux.conf`
4. Appuie sur `Entrée`

---

### Piège 5 : Le fichier .zshrc n'est pas chargé dans tmux

⚠️ **Problème** : Tes alias zsh ou ta configuration personnelle (prompt, PATH) ne fonctionnent pas dans les panneaux tmux.

✅ **Solution** : tmux lance zsh comme shell de connexion (login shell). Vérifie que ta configuration est bien dans `~/.zshrc` (et pas uniquement dans `~/.zprofile`). Pour vérifier quel fichier est chargé :

```bash
# Affiche le type de shell dans un panneau tmux
echo $0
```

**Résultat attendu** :

```text
-zsh
```

Le tiret devant `zsh` signifie que c'est un login shell. Dans ce cas, zsh charge `~/.zprofile` **puis** `~/.zshrc`. Si ton résultat est `zsh` (sans tiret), c'est un shell interactif non-login et seul `~/.zshrc` est chargé.

---

### Piège 6 : Le terminal semble bloqué après Ctrl+s

⚠️ **Problème** : Par réflexe, tu appuies sur `Ctrl+s` (raccourci de sauvegarde dans beaucoup d'éditeurs). Le terminal ne répond plus.

✅ **Solution** : `Ctrl+s` active le contrôle de flux du terminal (XOFF). Pour débloquer, appuie sur `Ctrl+q`. Ce n'est pas un problème tmux, mais il arrive souvent quand on utilise tmux.

---

## Checklist de Validation

- [ ] J'ai installé tmux et vérifié la version avec `tmux -V`
- [ ] J'ai créé une session nommée avec `tmux new-session -s`
- [ ] J'ai su me détacher d'une session avec `Ctrl+b` puis `d`
- [ ] J'ai listé mes sessions avec `tmux list-sessions`
- [ ] J'ai su me rattacher à une session avec `tmux attach-session -t`
- [ ] J'ai créé plusieurs fenêtres et navigué entre elles
- [ ] J'ai divisé une fenêtre en panneaux (horizontal et vertical)
- [ ] J'ai supprimé une session avec `tmux kill-session -t`

---

## Exercice Pratique

**Énoncé** : Crée un espace de travail tmux qui simule un environnement de développement avec trois zones visibles en même temps.

**Indications** :

- Crée une session nommée "dev"
- Dans cette session, divise la fenêtre en trois panneaux :
  - Un grand panneau à gauche (pour l'éditeur)
  - Un panneau en haut à droite (pour les commandes)
  - Un panneau en bas à droite (pour les logs)
- Renomme la fenêtre en "workspace"
- Détache-toi de la session
- Rattache-toi pour vérifier que tout est resté en place
- Supprime la session à la fin

**Résultat attendu** : Un terminal divisé en trois zones, avec la fenêtre nommée "workspace" visible dans la barre de statut.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1** : Crée la session.

```bash
# Crée une session nommée "dev"
tmux new-session -s dev
```

**Étape 2** : Divise verticalement pour avoir un panneau gauche et un panneau droit.

1. Appuie sur `Ctrl+b`
2. Appuie sur `%`

Tu as maintenant deux panneaux côte à côte. Le curseur est dans le panneau de droite.

**Étape 3** : Divise le panneau de droite horizontalement.

1. Vérifie que le curseur est dans le panneau de droite
2. Appuie sur `Ctrl+b`
3. Appuie sur `"`

Tu as maintenant trois panneaux : un grand à gauche, deux petits à droite (haut et bas).

**Étape 4** : Renomme la fenêtre.

1. Appuie sur `Ctrl+b`
2. Appuie sur `,`
3. Efface le nom actuel avec la touche Retour arrière
4. Tape `workspace`
5. Appuie sur `Entrée`

**Étape 5** : Détache-toi.

1. Appuie sur `Ctrl+b`
2. Appuie sur `d`

**Étape 6** : Vérifie et rattache-toi.

```bash
# Vérifie que la session existe
tmux list-sessions

# Rattache-toi
tmux attach-session -t dev
```

Tu retrouves tes trois panneaux et le nom "workspace" dans la barre de statut.

**Étape 7** : Nettoyage.

1. Détache-toi (`Ctrl+b` puis `d`)

```bash
# Supprime la session
tmux kill-session -t dev
```

---

## Navigation

← Fiche précédente : **[Aide-mémoire Git](05-aide-memoire-git.md)**

→ Fiche suivante : **[Aide-mémoire PHP](07-aide-memoire-php.md)**

