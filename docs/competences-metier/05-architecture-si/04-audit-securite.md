---
tags:
  - Méthodologie
  - Intermédiaire
  - Concept
description: "04 - L'Audit de Sécurité"
estimated_time: "20 min"
fiche_number: 4
total_fiches: 4
cursus: "Architecture SI"
---

# 04 - L'Audit de Sécurité

> **En bref** : À la fin de cette fiche, tu sauras ce qu'est un audit de sécurité, comment le préparer et le réaliser, et comment rédiger un rapport d'audit avec des recommandations. Lecture estimée : 20 min.

!!! warning "Cadre légal : lab et autorisation uniquement"
    Les commandes d'audit offensif de cette fiche (`nmap`, `nikto`, etc.) ne s'utilisent que sur un **lab que tu contrôles** ou avec une **autorisation écrite**. Sans autorisation, le scan d'un système tiers peut être illégal (Code pénal, art. 323-1 et s.). Les hôtes d'exemple sont fictifs.

## Prérequis

- Fiche **[03 - La Sécurité du Système d'Information](03-securite-systeme-information.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras ce qu'est un audit de sécurité, comment le préparer et le réaliser, et comment rédiger un rapport d'audit avec des recommandations.

---

## Concepts

### Qu'est-ce qu'un audit de sécurité ?

**Définition** : Un audit de sécurité est une évaluation systématique et documentée de la sécurité d'un système d'information, visant à identifier les vulnérabilités, évaluer les risques, et formuler des recommandations d'amélioration.

**Le problème que l'audit résout** :

Sans audit, voici les problèmes rencontrés :

1. **Faux sentiment de sécurité** : On pense être protégé, mais des failles existent.
2. **Pas de vision globale** : On connaît des morceaux, pas l'ensemble.
3. **Conformité incertaine** : On ne sait pas si on respecte les réglementations.
4. **Priorités floues** : On ne sait pas quoi corriger en premier.

**Comment l'audit résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Faux sentiment de sécurité | Vérification objective par des tests |
| Pas de vision globale | Analyse de tous les composants |
| Conformité incertaine | Vérification des exigences réglementaires |
| Priorités floues | Classement des vulnérabilités par risque |

**Analogie concrète** : Un audit de sécurité est comme un contrôle technique pour une voiture. Tu peux penser que ta voiture est en bon état, mais le contrôle vérifie objectivement les freins, les pneus, les feux. Il te dit ce qui doit être réparé en priorité.

---

### Quels sont les types d'audit ?

| Type | Description | Méthode |
| ---- | ----------- | ------- |
| **Audit organisationnel** | Évalue les processus et politiques | Entretiens, documentation |
| **Audit technique** | Évalue la sécurité des systèmes | Scans, tests techniques |
| **Test d'intrusion (pentest)** | Simule une attaque réelle | Exploitation de vulnérabilités |
| **Audit de conformité** | Vérifie le respect d'une norme | Checklist (ISO 27001, RGPD) |
| **Audit de code** | Analyse le code source | Revue manuelle et automatique |

**Différence audit vs pentest** :

| Audit | Pentest |
| ----- | ------- |
| Vue complète du SI | Focus sur les vulnérabilités exploitables |
| Documentaire + technique | Principalement technique |
| Vérifie la conformité | Vérifie la résistance aux attaques |
| Plus large, moins profond | Plus profond, moins large |

---

### Comment évalue-t-on une vulnérabilité ?

**Score CVSS** (Common Vulnerability Scoring System) :

| Score | Sévérité | Action |
| ----- | -------- | ------ |
| 0.0 | Aucune | - |
| 0.1 - 3.9 | Basse | Planifier la correction |
| 4.0 - 6.9 | Moyenne | Corriger rapidement |
| 7.0 - 8.9 | Haute | Corriger en priorité |
| 9.0 - 10.0 | Critique | Corriger immédiatement |

**Facteurs d'évaluation** :

| Facteur | Question |
| ------- | -------- |
| Exploitabilité | Est-ce facile à exploiter ? |
| Impact | Quelles sont les conséquences ? |
| Existence d'un exploit | Y a-t-il un outil disponible pour exploiter ? |
| Authentification requise | Faut-il être connecté ? |
| Complexité | Faut-il des conditions particulières ? |

---

## Étapes Pratiques

### Étape 1 : Définir le périmètre de l'audit

Avant de commencer, définis clairement ce qui sera audité :

```markdown
## Périmètre de l'audit

### Informations générales

| Élément | Valeur |
| ------- | ------ |
| Client | Entreprise XYZ |
| Date | 15/01/2024 - 19/01/2024 |
| Type d'audit | Technique + Organisationnel |
| Auditeur | [Ton nom] |

### Systèmes inclus

| Système | Type | IP/URL | Criticité |
| ------- | ---- | ------ | --------- |
| Site web | Application | www.example.com | Haute |
| API | Service | api.example.com | Haute |
| Serveur BDD | Infrastructure | 192.168.1.10 | Critique |
| Poste admin | Endpoint | 192.168.1.50 | Moyenne |

### Systèmes exclus

| Système | Raison de l'exclusion |
| ------- | --------------------- |
| Serveur de sauvegarde | Maintenance prévue |
| Environnement de dev | Hors production |

### Limites de l'audit

- Pas de test d'intrusion destructif (DDoS)
- Pas d'ingénierie sociale sur les employés
- Tests uniquement pendant les heures ouvrées
- Exploitation limitée (proof of concept, pas d'exfiltration réelle)
```

---

### Étape 2 : Réaliser la collecte d'informations

**Audit organisationnel** - Questions à poser :

```markdown
## Grille d'entretien - Responsable IT

### Politique de sécurité

| Question | Réponse |
| -------- | ------- |
| Existe-t-il une politique de sécurité écrite ? | |
| Quand a-t-elle été mise à jour ? | |
| Les employés ont-ils signé une charte informatique ? | |

### Gestion des accès

| Question | Réponse |
| -------- | ------- |
| Comment sont créés les comptes utilisateurs ? | |
| Processus de départ d'un employé ? | |
| Qui a des droits administrateur ? | |
| Authentification à deux facteurs activée ? | |

### Sauvegardes

| Question | Réponse |
| -------- | ------- |
| Fréquence des sauvegardes ? | |
| Dernière restauration testée ? | |
| Sauvegardes stockées où ? | |

### Mises à jour

| Question | Réponse |
| -------- | ------- |
| Processus de mise à jour des serveurs ? | |
| Délai d'application des correctifs critiques ? | |
```

---

### Étape 3 : Réaliser un scan de vulnérabilités

Utilise des outils pour identifier les failles techniques :

```bash
# Scanner les ports ouverts avec nmap
nmap -sV -sC -oN scan_results.txt 192.168.1.10

# Scanner les vulnérabilités web avec nikto
nikto -h https://www.example.com -output nikto_report.txt

# Scanner les vulnérabilités SSL/TLS
testssl.sh https://www.example.com
```

**Outils d'audit courants** :

| Outil | Usage | Type |
| ----- | ----- | ---- |
| Nmap | Scan de ports et services | Réseau |
| Nessus/OpenVAS | Scan de vulnérabilités | Infrastructure |
| Nikto | Scan de vulnérabilités web | Web |
| OWASP ZAP | Test d'applications web | Web |
| Lynis | Audit de configuration Linux | Système |
| testssl.sh | Audit de configuration SSL | Chiffrement |

---

### Étape 4 : Analyser les résultats

Classe les vulnérabilités trouvées :

```markdown
## Synthèse des vulnérabilités

### Vue d'ensemble

| Sévérité | Nombre |
| -------- | ------ |
| Critique | 1 |
| Haute | 3 |
| Moyenne | 5 |
| Basse | 8 |
| **Total** | **17** |

### Vulnérabilités critiques et hautes

| ID | Vulnérabilité | Système | CVSS | Impact |
| -- | ------------- | ------- | ---- | ------ |
| V-001 | Injection SQL | API | 9.8 | Accès complet à la BDD |
| V-002 | SSH root autorisé | Serveur BDD | 8.1 | Accès administrateur |
| V-003 | WordPress obsolète | Site web | 7.5 | Compromission du site |
| V-004 | Certificat expiré | Site web | 7.2 | Interception de données |
```

---

### Étape 5 : Rédiger le rapport d'audit

Structure standard d'un rapport d'audit :

```markdown
# Rapport d'Audit de Sécurité

## Entreprise XYZ - Janvier 2024

---

## 1. Synthèse exécutive

### Objectif de l'audit
[1 paragraphe résumant pourquoi l'audit a été réalisé]

### Périmètre
[Liste des systèmes audités]

### Résultat global
[Appréciation générale : Satisfaisant / À améliorer / Insuffisant]

### Chiffres clés

| Métrique | Valeur |
| -------- | ------ |
| Vulnérabilités critiques | X |
| Vulnérabilités hautes | X |
| Conformité RGPD | X% |
| Score de maturité sécurité | X/5 |

### Top 3 des actions prioritaires

1. [Action 1 - délai recommandé]
2. [Action 2 - délai recommandé]
3. [Action 3 - délai recommandé]

---

## 2. Méthodologie

### Approche
[Description de la méthodologie utilisée]

### Outils utilisés
[Liste des outils]

### Limites
[Ce qui n'a pas été testé et pourquoi]

---

## 3. Résultats détaillés

### 3.1 Audit organisationnel

#### Politique de sécurité
- **Constat** : [Ce qui a été observé]
- **Risque** : [Conséquence potentielle]
- **Recommandation** : [Action à mener]

#### Gestion des accès
[Même structure]

### 3.2 Audit technique

#### Vulnérabilité V-001 : Injection SQL

| Élément | Détail |
| ------- | ------ |
| Système affecté | api.example.com |
| Sévérité | Critique (CVSS 9.8) |
| Description | Le paramètre "id" n'est pas filtré |
| Preuve | `curl "api.example.com/user?id=1' OR '1'='1"` |
| Impact | Accès complet à la base de données |
| Recommandation | Utiliser des requêtes préparées |
| Référence | OWASP Top 10:2025 - A05 Injection (équivalent A03:2021) |

[Répéter pour chaque vulnérabilité]

---

## 4. Plan de remédiation

| ID | Action | Priorité | Responsable | Délai |
| -- | ------ | -------- | ----------- | ----- |
| V-001 | Corriger injection SQL | Critique | Dev | 48h |
| V-002 | Désactiver SSH root | Haute | Ops | 1 semaine |
| V-003 | Mettre à jour WordPress | Haute | Web | 1 semaine |

---

## 5. Annexes

### A. Détail des scans
[Extraits des rapports d'outils]

### B. Preuves
[Screenshots, logs]

### C. Glossaire
[Définitions des termes techniques]
```

---

### Étape 6 : Présenter les résultats

Prépare une présentation pour la direction :

```markdown
## Présentation des résultats d'audit

### Slide 1 : Contexte
- Objectif de l'audit
- Période et périmètre

### Slide 2 : Résultat global
- Appréciation générale (feu tricolore)
- Chiffres clés en grand

### Slide 3 : Vulnérabilités critiques
- Top 3 avec impact métier
- Pas de jargon technique

### Slide 4 : Points positifs
- Ce qui fonctionne bien
- Efforts reconnus

### Slide 5 : Plan d'action
- Actions prioritaires
- Responsables et délais
- Budget estimé si nécessaire

### Slide 6 : Prochaines étapes
- Suivi des corrections
- Date du prochain audit
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `nmap -sV -sC <ip>` | Scan de ports et services |
| `nikto -h <url>` | Scan de vulnérabilités web |
| `testssl.sh <url>` | Audit de configuration SSL |
| `lynis audit system` | Audit de configuration Linux |
| `wpscan --url <url>` | Audit de site WordPress |
| `sqlmap -u <url>` | Test d'injection SQL |

---

## Pièges Fréquents

### Piège 1 : Rapport incompréhensible

⚠️ **Problème** : Rapport rempli de jargon technique que la direction ne comprend pas.

✅ **Solution** : Synthèse exécutive en langage métier, détails techniques en annexe.

---

### Piège 2 : Lister sans prioriser

⚠️ **Problème** : 50 vulnérabilités sans indication de priorité = paralysie.

✅ **Solution** : Toujours classer par criticité et donner un top 5 d'actions.

---

### Piège 3 : Audit one-shot

⚠️ **Problème** : Un audit puis plus rien pendant 3 ans.

✅ **Solution** : Planifier des audits réguliers (annuel minimum).

---

### Piège 4 : Ne pas vérifier les corrections

⚠️ **Problème** : Les recommandations ne sont jamais appliquées.

✅ **Solution** : Audit de suivi 3 mois après pour vérifier les corrections.

---

## Checklist de Validation

- [ ] Je comprends les différents types d'audit
- [ ] Je sais définir un périmètre d'audit
- [ ] Je connais les outils de scan de vulnérabilités
- [ ] Je sais classer les vulnérabilités par criticité (CVSS)
- [ ] Je sais rédiger un rapport d'audit structuré
- [ ] Je comprends l'importance du suivi des recommandations

---

## Exercice Pratique

**Énoncé** : Rédige la synthèse exécutive d'un rapport d'audit fictif pour une PME.

L'audit a révélé :

- 2 vulnérabilités critiques (injection SQL, mot de passe admin par défaut)
- 4 vulnérabilités hautes
- Politique de sécurité inexistante
- Sauvegardes non testées depuis 1 an

**Résultat attendu** : Une synthèse d'environ 30-40 lignes.

---

## Solution de l'Exercice

> **Note** : Cette section contient une solution possible.

---

```markdown
# Rapport d'Audit de Sécurité - PME ABC

## Synthèse Exécutive

### Contexte

Un audit de sécurité a été réalisé du 15 au 19 janvier 2024 sur le système
d'information de la PME ABC, comprenant le site web, l'API, et l'infrastructure
serveur.

### Résultat global

**Appréciation : INSUFFISANT**

Le niveau de sécurité actuel présente des risques majeurs pour l'entreprise.
Des vulnérabilités critiques permettraient à un attaquant d'accéder à
l'ensemble des données clients.

### Chiffres clés

| Métrique | Valeur | Appréciation |
| -------- | ------ | ------------ |
| Vulnérabilités critiques | 2 | Inacceptable |
| Vulnérabilités hautes | 4 | À corriger |
| Politique de sécurité | Inexistante | Non conforme |
| Test de restauration | > 1 an | Risqué |

### Risques identifiés

1. **Vol de données clients** : L'injection SQL permet d'extraire toute la base
2. **Prise de contrôle** : Le mot de passe admin par défaut donne un accès total
3. **Perte de données** : Sans test de sauvegarde, la restauration est incertaine

### Actions prioritaires

| Priorité | Action | Délai | Impact si non fait |
| -------- | ------ | ----- | ------------------ |
| 1 | Corriger l'injection SQL | 48h | Fuite de données |
| 2 | Changer le mot de passe admin | Immédiat | Compromission totale |
| 3 | Tester les sauvegardes | 1 semaine | Perte de données |
| 4 | Rédiger une politique de sécurité | 1 mois | Non-conformité |

### Prochaines étapes

1. Réunion de restitution avec la direction
2. Correction des vulnérabilités critiques sous 48h
3. Audit de contrôle dans 3 mois
```

---

## Navigation

← Fiche précédente : **[03 - La Sécurité du Système d'Information](03-securite-systeme-information.md)**
