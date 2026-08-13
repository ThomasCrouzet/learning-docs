---
hide:
  - toc
description: "Comment les contenus périssables sont datés, revalidés et signalés."
---

# Politique de fraîcheur et de revalidation

> **En bref** : Les versions et pratiques évoluent. Cette page explique comment le projet date le contenu, ce qui est contrôlé automatiquement, et ce qui reste une relecture humaine. Lecture estimée : 5 min.

## Date de référence

La date de référence éditoriale actuelle est **août 2026**. Elle apparaît dans [À propos](a-propos.md). Les outils d'audit peuvent générer des rapports locaux non versionnés sous `audit-reports/`.

Le rapport technique d'accessibilité (campagne WCAG 2.2 AA) est dans [Audit d'accessibilité](accessibility-audit.md) (page mainteneur, hors parcours pédagogique).

Une date de référence n'est pas une promesse que chaque phrase a été re-vérifiée ce jour-là. Elle indique le cadre temporel des versions et des contrôles de campagne.

## Ce qui est stable vs périssable

| Type | Exemples | Traitement |
| ---- | -------- | ---------- |
| Concepts stables | variables, HTTP, processus, normalisation SQL de base | Peuvent vieillir sans changement majeur |
| Versions LTS | PHP, Symfony LTS, Node LTS, Java LTS | Tableau de référence du dépôt ; mise à jour quand le LTS enseigné sort du support |
| Interfaces changeantes | CLI cloud, flags Docker/K8s, APIs SaaS | Préférer l'idée + noter que la CLI exacte peut varier |
| Droit / conformité | RGPD, fiscalité crypto | Toujours daté ; ce n'est pas un conseil juridique |
| Sécurité | OWASP, outils offensifs | Cadre éthique ; revalidation périodique |

## Contrôles automatiques

Les commandes du dépôt (voir README) vérifient notamment :

- structure des fiches, frontmatter, navigation, noms de fichiers
- accents, em dashes, liens de prérequis
- cohérence des effectifs (`carte-cursus.md`)
- tests unitaires des scripts
- build MkDocs strict
- registre de revue (couverture des pages) lorsque présent

Ces contrôles **ne prouvent pas** l'exactitude de chaque affirmation technique.

Un **registre de revue** local (généré sous `audit-reports/`, non versionné) peut attester qu'une page a une entrée de couverture. Une entrée de registre n'équivaut pas à une expertise humaine ligne à ligne ni à une certification. Les sources attachées au niveau d'un lot de domaine peuvent être trop génériques pour une fiche précise : traiter le registre comme un **outil de traçabilité**, pas comme une preuve d'exactitude.

## Revalidation recommandée

| Domaine | Période indicative |
| ------- | ------------------ |
| Stack web de référence (PHP, Symfony, Node, React) | à chaque fin de support LTS ou majeures annuelles |
| Cloud, K8s, CI SaaS | 6-12 mois |
| Cybersécurité outillage | 6-12 mois |
| IA / LLM / agents | 3-6 mois (écosystème rapide) |
| Droit / RGPD / fiscalité | dès qu'un texte change, sinon revue annuelle |
| Faust / DSP | annuelle ou sur release majeure |

## Signaler un contenu périmé

Utilise le modèle d'issue « Contenu obsolète » ou une PR avec source primaire (documentation officielle, note de version).

## Limites

Cette politique décrit une **méthode de maintenance**. Elle ne constitue pas une certification professionnelle, juridique, fiscale ou de sécurité du corpus.
