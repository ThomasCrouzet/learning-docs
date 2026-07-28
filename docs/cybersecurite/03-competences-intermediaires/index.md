---
tags:
  - Cybersécurité
  - Intermédiaire
description: "Phase 3 du cursus cybersécurité - Compétences techniques intermédiaires"
---

# Phase 3 - Compétences Techniques Intermédiaires

Durée estimée : 3-4 mois

Cette phase approfondit les compétences techniques en sécurité : durcissement des systèmes, sécurité applicative, analyse de vulnérabilités et introduction au SOC.

!!! warning "Cadre légal : lab et autorisation uniquement"
    Les outils et techniques de cette phase (scans, Burp/ZAP, Nmap, analyse de vulnérabilités, etc.) se pratiquent **uniquement** sur lab isolé, plateforme d'entraînement autorisée (DVWA, Juice Shop, HTB, TryHackMe, etc.) ou cible couverte par une **autorisation écrite**. Sans autorisation, scanner ou tester un système tiers est illégal en France (Code pénal, art. 323-1 et s.). Ce wiki n'est **pas** une autorisation d'attaque, ni une promesse d'expertise professionnelle.

## Prérequis

- Phase 1 - Fondamentaux Informatiques : toutes les fiches complétées
- Phase 2 - Fondamentaux Sécurité : toutes les fiches complétées

## Fiches de cette phase

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Sécurité des systèmes d'exploitation](01-securite-systemes-exploitation.md) | Hardening Linux et Windows, détection d'activité suspecte, sécurisation de serveurs |
| 02 | [Sécurité Web et Applicative](02-securite-web-applicative.md) | OWASP Top 10, Burp Suite, OWASP ZAP, architectures modernes, labs pratiques |
| 03 | [Analyse de vulnérabilités et Reconnaissance](03-analyse-vulnerabilites.md) | OSINT, Nmap avancé, Nessus, OpenVAS, énumération, CVSS, veille |
| 04 | [Introduction au SOC et Monitoring](04-introduction-soc-monitoring.md) | Architecture SOC, SIEM, règles de détection, threat intelligence, triage |

## Parcours recommandé

Les fiches sont conçues pour être suivies dans l'ordre. La fiche 04 (SOC et Monitoring) s'appuie sur les connaissances des trois fiches précédentes.

```text
01 - Sécurité des systèmes d'exploitation
    ↓
02 - Sécurité Web et Applicative
    ↓
03 - Analyse de vulnérabilités et Reconnaissance
    ↓
04 - Introduction au SOC et Monitoring
    ↓
Phase 4 - Spécialisation Offensive
```
