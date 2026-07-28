---
tags:
  - Cybersécurité
  - Avancé
description: "Phase 7 du cursus cybersécurité - Red Team et Opérations Avancées"
---

# Phase 7 - Red Team et Opérations Avancées

Durée estimée : 4-6 mois

Cette phase couvre les opérations red team de bout en bout : planification, infrastructure d'attaque, évasion des défenses, développement d'exploits et attaques avancées sur Active Directory. Ces compétences correspondent aux certifications CRTO, OSEP (PEN-300) et OSED (EXP-301).

!!! warning "Cadre légal : lab et autorisation uniquement"
    C2, évasion, exploit development et AD avancé se pratiquent **uniquement** en lab isolé ou engagement red team contractuel avec RoE écrites. Hors de ce cadre, ces techniques contre des systèmes tiers sont illégales en France (Code pénal, art. 323-1 et s.). Ce wiki n'est **pas** une autorisation d'attaque.

## Prérequis

- Phase 1 - Fondamentaux Informatiques (complète)
- Phase 2 - Fondamentaux Sécurité (complète)
- Phase 3 - Compétences Intermédiaires (complète)
- Phase 4 - Spécialisation Offensive (complète)

## Fiches de cette phase

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Red Team Operations](01-red-team-operations.md) | Planification, infrastructure C2, OPSEC, purple teaming, MITRE ATT&CK |
| 02 | [Évasion et Développement d'outils offensifs](02-evasion-outils-offensifs.md) | Bypass AV/EDR, loaders, AMSI/ETW, LOLBAS, évasion réseau |
| 03 | [Exploit Development](03-exploit-development.md) | Buffer overflow avancé, ROP, heap exploitation, fuzzing, kernel |
| 04 | [Sécurité Active Directory - Avancée](04-active-directory-avance.md) | Cross-forest, AD CS, Shadow Credentials, Azure AD, hardening |

## Parcours recommandé

Les fiches doivent être étudiées dans l'ordre proposé. Chaque fiche s'appuie sur les concepts de la précédente :

- **Fiche 01** : pose les bases de la méthodologie red team et de l'infrastructure
- **Fiche 02** : développe les techniques d'évasion nécessaires pour les opérations
- **Fiche 03** : approfondit le développement d'exploits bas niveau
- **Fiche 04** : applique toutes les compétences précédentes à Active Directory en environnement entreprise
