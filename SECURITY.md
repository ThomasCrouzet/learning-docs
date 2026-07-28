# Politique de sécurité

## Versions supportées

Ce dépôt est un projet de **documentation pédagogique statique** (Markdown + MkDocs + outillage Node). Aucun serveur d'application n'est fourni pour un usage production au-delà de la prévisualisation locale optionnelle.

Surface pertinente pour la sécurité :

- workflows GitHub Actions ;
- devDependencies Node.js utilisées pour lint/test ;
- paquets Python utilisés pour les builds MkDocs ;
- commandes et configurations d'exemple dans `docs/` (illustratives uniquement).

| Composant | Support |
| --------- | ------- |
| Documentation et outillage de la branche par défaut | Courant |
| Anciennes tags / forks | Meilleur effort seulement |

## Signaler une vulnérabilité

**Ne pas** ouvrir une issue publique pour une fuite réelle de secret, une exposition d'identifiants, ou une vulnérabilité actionnable dans l'outillage qui pourrait nuire aux utilisateurs.

Préférer l'une des options suivantes :

1. **Security Advisories** GitHub / signalement privé de vulnérabilité sur le dépôt (si activé)
2. Contacter le propriétaire du dépôt via son profil GitHub pour une coordination privée

Inclure si possible :

- description et impact ;
- chemin ou workflow concerné ;
- étapes de reproduction non destructives ;
- si un secret a été exposé et si une rotation est nécessaire.

Tu devrais recevoir un accusé de réception lorsque le signalement est vu. Il n'y a pas de bug bounty payant.

## Ce qui n'est pas une vulnérabilité

- Exemples pédagogiques de clés API, mots de passe, JWT ou chaînes de vault dans `docs/**/*.md` clairement fictifs / de démonstration (voir la logique d'allowlist dans `.gitleaks.toml`)
- Versions de bibliothèques mentionnées **dans le texte de cours** pour apprendre du code legacy (signaler plutôt comme problème de contenu si elles sont présentées comme pratique actuelle sans avertissement)
- Fonctionnalités manquantes ou lacunes pédagogiques

## Secrets et données privées

Les contributeurs ne doivent pas committer :

- de vraies clés API, tokens, mots de passe, clés privées, ou fichiers `.env` avec secrets ;
- de données personnelles sur des personnes réelles sans consentement ;
- de noms d'hôtes de labo privé, d'IP Tailscale, ou de webhooks internes dans la documentation publique.

Si tu trouves un **vrai** secret dans l'historique Git :

1. le considérer comme compromis ;
2. le faire tourner / révoquer à la source ;
3. signaler en privé pour que les mainteneurs planifient un nettoyage d'historique si besoin.

## Sécurité des exemples de code

Les exemples doivent privilégier des commandes non destructives. Lorsqu'une commande peut détruire des données (volumes, bases, force-push), la fiche doit indiquer le risque explicitement. Ne jamais présenter `docker compose down -v` comme étape de routine dans la maintenance de ce projet.
