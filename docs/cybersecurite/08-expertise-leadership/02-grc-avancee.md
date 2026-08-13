---
tags:
  - Cybersécurité
  - Expert
  - Concept
description: "Pilotage programme sécurité, FAIR, ISO 27001, SOC 2, NIS2, DORA, KPI sécurité, préparation CISSP/CISM"
estimated_time: "40 min"
fiche_number: 2
total_fiches: 4
cursus: "Phase 8 - Expertise et Leadership"
---

# 02 - GRC Avancée et Management de la Sécurité

> **En bref** : À la fin de cette fiche, tu sauras piloter un programme de sécurité complet, quantifier les risques avec le modèle FAIR, gérer la conformité multi-référentiel (ISO 27001, SOC 2, NIS2, DORA), présenter des KPI sécurité au COMEX, et préparer les certifications CISSP et CISM. Lecture estimée : 40 min.


## Prérequis

- [Phase 2, fiche 04 - Gouvernance, Risque et Conformité (GRC)](../02-fondamentaux-securite/04-gouvernance-risque-conformite.md) : concepts fondamentaux
- [Phase 8, fiche 01 - Architecture de Sécurité](01-architecture-securite.md) : compréhension des architectures et du threat modeling
- Connaissance des principes de sécurité de l'information (triade CIA, défense en profondeur)
- Notions de gestion de projet et de budget

## Objectif de cette fiche

À la fin de cette fiche, tu sauras piloter un programme de sécurité complet, quantifier les risques avec le modèle FAIR, gérer la conformité multi-référentiel (ISO 27001, SOC 2, NIS2, DORA), présenter des KPI sécurité au COMEX, et préparer les certifications CISSP et CISM.

---

## Concepts

### Qu'est-ce qu'un programme de sécurité ?

**Définition** : Un programme de sécurité est l'ensemble structuré des politiques, processus, technologies et personnes qui protègent les actifs informationnels d'une organisation. Il est piloté par le RSSI (Responsable de la Sécurité des Systèmes d'Information) ou le CISO (Chief Information Security Officer).

**Le problème qu'un programme de sécurité résout** :

Sans programme de sécurité structuré, voici les problèmes rencontrés :

1. **Actions dispersées** : chaque équipe gère la sécurité à sa manière, sans coordination
2. **Budget non justifié** : impossible de défendre un budget sécurité devant la direction sans métriques
3. **Conformité non maîtrisée** : l'organisation découvre ses obligations réglementaires lors d'un audit ou d'un incident
4. **Risques non quantifiés** : les décisions de sécurité sont prises "au feeling" plutôt que sur des données

**Comment un programme de sécurité résout ces problèmes** :

| Problème | Solution apportée par le programme |
| -------- | ---------------------------------- |
| Actions dispersées | Gouvernance centralisée avec rôles et responsabilités définis |
| Budget non justifié | Quantification des risques et retour sur investissement mesurable |
| Conformité non maîtrisée | Cartographie des obligations et suivi continu de la conformité |
| Risques non quantifiés | Méthodologie formelle d'analyse de risque (FAIR, EBIOS RM) |

**Analogie concrète** : Un programme de sécurité est comparable au système de santé d'un pays. Il ne suffit pas d'avoir des hôpitaux (outils techniques). Il faut aussi des politiques de prévention (hygiène, vaccination), des indicateurs de suivi (taux de mortalité, espérance de vie), un budget alloué, des formations pour le personnel médical, et une coordination entre tous les acteurs. Sans ce programme global, les hôpitaux fonctionnent en silo et la santé publique se dégrade.

**Ce qu'un programme de sécurité n'est PAS** :

- Un programme de sécurité n'est pas un ensemble d'outils. Acheter un SIEM ou un EDR ne constitue pas un programme
- Un programme de sécurité n'est pas figé. Il évolue chaque année en fonction des menaces, de la réglementation et de la maturité de l'organisation

---

### Qu'est-ce que le modèle FAIR ?

**Définition** : FAIR (Factor Analysis of Information Risk) est une méthodologie de quantification du risque qui exprime les risques en termes financiers (euros, dollars). Contrairement aux méthodes qualitatives (risque Faible/Moyen/Élevé), FAIR produit une estimation chiffrable de la perte annuelle probable.

**Le problème que FAIR résout** :

Sans quantification financière, voici les problèmes rencontrés :

1. **Communication impossible avec la direction** : dire "le risque est élevé" ne suffit pas pour obtenir un budget. La direction a besoin de chiffres
2. **Comparaison impossible** : comment comparer un risque "élevé" de fuite de données avec un risque "moyen" de déni de service ?
3. **Priorisation subjective** : sans chiffres, les priorités dépendent de celui qui parle le plus fort
4. **Retour sur investissement non mesurable** : impossible de prouver qu'un investissement de 100 000 EUR en sécurité a réduit le risque

**Comment FAIR résout ces problèmes** :

| Problème | Solution apportée par FAIR |
| -------- | -------------------------- |
| Communication avec la direction | Risque exprimé en euros : "perte probable de 500 000 EUR/an" |
| Comparaison impossible | Tous les risques sont sur la même échelle (financière) |
| Priorisation subjective | Classement objectif par perte annuelle probable |
| ROI non mesurable | Avant/après : réduction mesurable de la perte probable |

**Analogie concrète** : Un médecin qui dit "votre cholestérol est élevé" est moins utile qu'un médecin qui dit "avec votre taux actuel, vous avez 15% de risque de crise cardiaque dans les 10 ans, ce qui coûterait en moyenne 50 000 EUR en soins". FAIR est le médecin qui quantifie le risque en chiffres exploitables pour prendre des décisions.

**Les composants clés de FAIR** :

| Composant | Définition | Exemple |
| --------- | ---------- | ------- |
| LEF (Loss Event Frequency) | Fréquence probable d'occurrence de l'événement de perte | 0.5 fois/an (une fois tous les 2 ans) |
| PLM (Primary Loss Magnitude) | Perte directe causée par l'événement | 200 000 EUR (réponse à incident, forensique) |
| SLM (Secondary Loss Magnitude) | Perte indirecte (réputation, amendes, litiges) | 800 000 EUR (amende RGPD, perte de clients) |
| ALE (Annualized Loss Expectancy) | Perte annuelle probable = LEF x (PLM + SLM) | 0.5 x 1 000 000 = 500 000 EUR/an |

**Ce que FAIR n'est PAS** :

- FAIR n'est pas une science exacte. Les estimations sont des distributions de probabilité, pas des certitudes
- FAIR ne remplace pas l'analyse qualitative. Il la complète en ajoutant une dimension financière

---

### Qu'est-ce que la conformité multi-référentiel ?

**Définition** : La conformité multi-référentiel est la capacité d'une organisation à respecter simultanément plusieurs normes, standards et réglementations de sécurité (ISO 27001, SOC 2, NIS2, DORA, RGPD, PCI-DSS, etc.).

**Le problème que la conformité multi-référentiel résout** :

Sans approche multi-référentiel, voici les problèmes rencontrés :

1. **Duplication d'efforts** : chaque norme est traitée séparément, avec ses propres contrôles et sa propre documentation
2. **Fatigue d'audit** : les équipes passent leur temps à préparer des audits au lieu de faire de la sécurité
3. **Incohérences** : les contrôles mis en place pour une norme contredisent ceux d'une autre

**Comment la conformité multi-référentiel résout ces problèmes** :

| Problème | Solution apportée |
| -------- | ----------------- |
| Duplication d'efforts | Cartographie des contrôles communs entre référentiels (mapping) |
| Fatigue d'audit | Un seul jeu de preuves sert plusieurs audits |
| Incohérences | Politique unifiée qui couvre toutes les exigences |

**Les principaux référentiels en 2026** :

| Référentiel | Type | Portée | Obligation |
| ----------- | ---- | ------ | ---------- |
| ISO 27001:2022 | Standard international | SMSI (Système de Management de la Sécurité de l'Information) | Volontaire (mais souvent exigé par les clients) |
| SOC 2 Type II | Rapport d'audit (AICPA) | Contrôles de sécurité, disponibilité, confidentialité | Volontaire (exigé par les clients US) |
| NIS2 | Directive européenne | Entités essentielles et importantes (énergie, transport, santé, numérique) | Transposition prévue au 17 oct. 2024 ; vérifier le droit national |
| DORA | Règlement européen | Secteur financier (banques, assurances, fintech) | Obligatoire depuis janvier 2025 |
| RGPD | Règlement européen | Données personnelles | Obligatoire |
| PCI-DSS v4.0 | Standard industriel | Données de cartes de paiement | Obligatoire si traitement de cartes |

**Mapping des contrôles entre référentiels (extrait)** :

| Domaine | ISO 27001 (Annexe A) | SOC 2 (TSC) | NIS2 | DORA |
| ------- | -------------------- | ----------- | ---- | ---- |
| Gestion des accès | A.5.15-5.18 | CC6.1-CC6.3 | Art. 21(2)(i) | Art. 9 |
| Chiffrement | A.8.24 | CC6.1 | Art. 21(2)(e) | Art. 9 |
| Gestion des incidents | A.5.24-5.28 | CC7.3-CC7.5 | Art. 23 | Art. 17 |
| Continuité | A.5.29-5.30 | A1.2 | Art. 21(2)(c) | Art. 11 |
| Supply chain | A.5.19-5.23 | CC9.2 | Art. 21(2)(d) | Art. 28 |

---

### Qu'est-ce que la gestion de crise cyber ?

**Définition** : La gestion de crise cyber est l'ensemble des processus et procédures activés lorsqu'un incident de sécurité dépasse les capacités de réponse opérationnelle normale et menace les activités critiques de l'organisation.

**Le problème que la gestion de crise résout** :

Sans préparation à la crise, voici les problèmes rencontrés :

1. **Panique et désorganisation** : personne ne sait qui fait quoi pendant l'incident
2. **Communication chaotique** : les messages contradictoires aggravent la situation (médias, clients, régulateurs)
3. **Décisions tardives** : l'absence de procédure retarde les décisions critiques (isoler le réseau, notifier les autorités)
4. **Responsabilité floue** : après l'incident, personne n'assume la prise de décision

**Comment la gestion de crise résout ces problèmes** :

| Problème | Solution apportée |
| -------- | ----------------- |
| Panique et désorganisation | Cellule de crise avec rôles prédéfinis et fiches réflexes |
| Communication chaotique | Plan de communication de crise avec messages pré-approuvés |
| Décisions tardives | Critères d'escalade et autorités de décision prédéfinies |
| Responsabilité floue | Chaîne de commandement documentée et testée |

**Analogie concrète** : Un plan de gestion de crise cyber est comme un plan d'évacuation incendie. On ne le crée pas pendant que le bâtiment brûle. Il est affiché à chaque étage, les rôles sont attribués (serre-file, point de rassemblement), et on fait des exercices réguliers. Le jour de l'incendie, chacun sait exactement quoi faire.

---

### Qu'est-ce que les KPI sécurité pour le COMEX ?

**Définition** : Les KPI (Key Performance Indicators) sécurité pour le COMEX sont des indicateurs synthétiques, compréhensibles par des non-techniciens, qui mesurent l'efficacité du programme de sécurité et permettent à la direction de prendre des décisions éclairées.

**Le problème que les KPI sécurité résolvent** :

Sans KPI sécurité :

1. **La direction ne comprend pas** : les rapports techniques (nombre de CVE, score CVSS) ne parlent pas au directeur financier
2. **La sécurité est perçue comme un coût** : sans indicateurs de valeur, la sécurité est la première ligne budgétaire coupée
3. **Pas de progression mesurable** : impossible de montrer que la posture de sécurité s'améliore d'année en année

**Les KPI essentiels pour le COMEX** :

| KPI | Formule | Cible | Fréquence |
| --- | ------- | ----- | --------- |
| MTTD (Mean Time To Detect) | Temps moyen entre intrusion et détection | < 24h | Mensuel |
| MTTR (Mean Time To Respond) | Temps moyen entre détection et remédiation | < 4h | Mensuel |
| Taux de couverture MFA | Comptes avec MFA / Total comptes | > 99% | Mensuel |
| Taux de conformité patches | Systèmes patchés dans les SLA / Total systèmes | > 95% | Mensuel |
| Score de maturité SSI | Score CMMI ou NIST CSF (1-5) | Progression annuelle | Annuel |
| Perte financière estimée (FAIR) | ALE total du portefeuille de risques | Réduction annuelle | Trimestriel |
| Taux de réussite phishing | Clics sur campagne de phishing test / Total cibles | < 5% | Trimestriel |
| Couverture des actifs critiques | Actifs critiques avec contrôles validés / Total actifs critiques | 100% | Trimestriel |

---

## Étapes Pratiques

### Étape 1 : Réaliser une analyse de risque FAIR

Tu vas quantifier le risque d'une fuite de données clients pour une entreprise e-commerce.

```bash
# Créer le répertoire de travail
mkdir -p ~/grc-avancee

# Créer l'analyse FAIR
cat > ~/grc-avancee/analyse-fair.md << 'FAIR_EOF'
# Analyse de Risque FAIR - Fuite de données clients

## Scénario de risque
Un attaquant exfiltre la base de données clients (500 000 enregistrements)
contenant noms, emails, adresses et historique d'achats.

## Étape 1 : Estimer la fréquence (LEF)

### Threat Event Frequency (TEF)
- Source de menace : attaquant externe motivé financièrement
- Capacité de l'attaquant : moyenne à élevée (outils disponibles)
- Estimation TEF : 2 à 5 tentatives/an

### Vulnerability (probabilité de succès)
- Contrôles en place : WAF, segmentation réseau, MFA
- Estimation vulnérabilité : 10% à 30% des tentatives réussissent

### LEF = TEF x Vulnérabilité
- Estimation basse : 2 x 0.10 = 0.2 événements/an (1 fois tous les 5 ans)
- Estimation haute : 5 x 0.30 = 1.5 événements/an
- Estimation probable : 0.5 événements/an (1 fois tous les 2 ans)

## Étape 2 : Estimer les pertes (Loss Magnitude)

### Primary Loss (pertes directes)
| Catégorie | Estimation basse | Estimation probable | Estimation haute |
| --------- | ---------------- | ------------------- | ---------------- |
| Réponse à incident (forensique, juridique) | 50 000 EUR | 100 000 EUR | 200 000 EUR |
| Notification des personnes (RGPD art. 34) | 25 000 EUR | 50 000 EUR | 100 000 EUR |
| Remédiation technique | 30 000 EUR | 75 000 EUR | 150 000 EUR |
| **Total PLM** | **105 000 EUR** | **225 000 EUR** | **450 000 EUR** |

### Secondary Loss (pertes indirectes)
| Catégorie | Estimation basse | Estimation probable | Estimation haute |
| --------- | ---------------- | ------------------- | ---------------- |
| Amende RGPD (jusqu'à 4% du CA) | 100 000 EUR | 500 000 EUR | 2 000 000 EUR |
| Perte de clients (churn) | 200 000 EUR | 500 000 EUR | 1 000 000 EUR |
| Atteinte à la réputation | 100 000 EUR | 300 000 EUR | 500 000 EUR |
| Litiges (class action) | 0 EUR | 200 000 EUR | 1 000 000 EUR |
| **Total SLM** | **400 000 EUR** | **1 500 000 EUR** | **4 500 000 EUR** |

### Total Loss Magnitude
- PLM + SLM probable : 225 000 + 1 500 000 = 1 725 000 EUR

## Étape 3 : Calculer l'ALE (Annualized Loss Expectancy)

ALE = LEF x (PLM + SLM)
ALE probable = 0.5 x 1 725 000 = 862 500 EUR/an

## Étape 4 : Décision d'investissement

Budget sécurité proposé pour réduire ce risque : 200 000 EUR/an
- Mise en place WAF avancé + DLP : 80 000 EUR/an
- Chiffrement base de données + gestion des clés : 40 000 EUR/an
- Tests de pénétration trimestriels : 60 000 EUR/an
- Formation sécurité développeurs : 20 000 EUR/an

Réduction estimée de la vulnérabilité : de 20% à 5%
Nouveau LEF : 3.5 x 0.05 = 0.175 événements/an
Nouveau ALE : 0.175 x 1 725 000 = 301 875 EUR/an

ROI sécurité = (862 500 - 301 875 - 200 000) / 200 000 = 180%

FAIR_EOF

echo "Analyse FAIR complète"
```

**Résultat attendu** :

```text
Analyse FAIR complète
```

---

### Étape 2 : Créer un tableau de bord KPI pour le COMEX

```bash
# Créer le dashboard KPI
cat > ~/grc-avancee/dashboard-kpi-comex.md << 'KPI_EOF'
# Dashboard Sécurité - COMEX T1 2026

## Vue d'ensemble

| Indicateur | Valeur actuelle | Cible | Tendance | Statut |
| ---------- | --------------- | ----- | -------- | ------ |
| Score maturité NIST CSF | 3.2 / 5 | 3.5 | +0.3 vs T4 2025 | En progression |
| ALE total (FAIR) | 2.1 M EUR | < 1.5 M EUR | -400 K EUR vs T4 2025 | En progression |
| MTTD | 18h | < 24h | -6h vs T4 2025 | Atteint |
| MTTR | 6h | < 4h | -2h vs T4 2025 | Non atteint |
| Couverture MFA | 97% | > 99% | +5% vs T4 2025 | En progression |
| Conformité patches critiques | 92% | > 95% | +3% vs T4 2025 | En progression |
| Taux phishing (test) | 8% | < 5% | -2% vs T4 2025 | En progression |

## Risques majeurs (Top 5)

| # | Risque | ALE (FAIR) | Tendance | Action en cours |
| - | ------ | ---------- | -------- | --------------- |
| 1 | Fuite de données clients | 862 K EUR | Stable | Déploiement DLP en cours |
| 2 | Ransomware | 750 K EUR | En baisse | Segmentation réseau terminée |
| 3 | Compromission supply chain | 450 K EUR | En hausse | Audit fournisseurs lancé |
| 4 | Indisponibilité e-commerce | 320 K EUR | Stable | PRA testé en décembre |
| 5 | Non-conformité NIS2 | 200 K EUR | En baisse | Mise en conformité à 80% |

## Conformité multi-référentiel

| Référentiel | Couverture | Prochaine échéance |
| ----------- | ---------- | ------------------ |
| ISO 27001:2022 | 85% (certification prévue T3 2026) | Audit de certification : sept. 2026 |
| NIS2 | 80% | Déclaration d'entité : déjà effectuée |
| RGPD | 95% | Revue annuelle DPO : juin 2026 |
| SOC 2 Type II | 70% | Audit initial : T4 2026 |

## Budget sécurité

| Poste | Budget annuel | Consommé (T1) | Prévision annuelle |
| ----- | ------------- | ------------- | ------------------ |
| Outils et licences | 400 000 EUR | 105 000 EUR | 400 000 EUR |
| Personnel (équipe sécu) | 600 000 EUR | 150 000 EUR | 600 000 EUR |
| Audits et tests | 150 000 EUR | 40 000 EUR | 150 000 EUR |
| Formation | 50 000 EUR | 15 000 EUR | 50 000 EUR |
| **TOTAL** | **1 200 000 EUR** | **310 000 EUR** | **1 200 000 EUR** |

KPI_EOF

echo "Dashboard KPI COMEX créé"
```

**Résultat attendu** :

```text
Dashboard KPI COMEX créé
```

---

### Étape 3 : Préparer un plan de gestion de crise cyber

```bash
# Créer le plan de gestion de crise
cat > ~/grc-avancee/plan-crise-cyber.md << 'CRISE_EOF'
# Plan de Gestion de Crise Cyber

## 1. Critères d'activation de la cellule de crise

| Niveau | Critère | Exemple | Escalade |
| ------ | ------- | ------- | -------- |
| 1 - Incident | Incident géré par le SOC | Malware isolé sur un poste | SOC uniquement |
| 2 - Incident majeur | Impact sur un service critique | Indisponibilité du site web | SOC + RSSI + DSI |
| 3 - Crise | Impact sur l'activité de l'entreprise | Ransomware chiffrant les serveurs | Cellule de crise complète |

## 2. Composition de la cellule de crise

| Rôle | Responsabilité | Titulaire | Suppléant |
| ---- | -------------- | --------- | --------- |
| Directeur de crise | Décisions stratégiques | DG | DGA |
| Coordinateur technique | Pilotage des actions techniques | RSSI | Responsable SOC |
| Communication | Relations médias, clients, régulateurs | Directeur comm. | Responsable RP |
| Juridique | Obligations légales, notifications | DPO / Juriste | Cabinet externe |
| Métier | Impact sur les activités, continuité | Directeur métier | Adjoint |
| RH | Communication interne, support employés | DRH | Adjoint RH |

## 3. Fiches réflexes (premières 4 heures)

### Heure 0 : Détection et qualification
- [ ] Qualifier la nature de l'incident (ransomware, fuite, intrusion)
- [ ] Évaluer le périmètre impacté (systèmes, données, utilisateurs)
- [ ] Activer la cellule de crise si critères de niveau 3

### Heure 1 : Confinement
- [ ] Isoler les systèmes compromis du réseau
- [ ] Préserver les preuves (snapshots, logs)
- [ ] Activer le canal de communication de crise (hors système compromis)

### Heure 2 : Notification
- [ ] Notifier l'ANSSI (obligation NIS2 : alerte précoce sous 24h)
- [ ] Notifier la CNIL si données personnelles (obligation RGPD : sous 72h)
- [ ] Informer la direction générale

### Heure 4 : Communication
- [ ] Préparer le communiqué interne (employés)
- [ ] Préparer le communiqué externe si nécessaire (clients, partenaires)
- [ ] Activer le prestataire de réponse à incident (si externe)

## 4. Obligations de notification (NIS2)

| Échéance | Action | Destinataire |
| -------- | ------ | ------------ |
| 24 heures | Alerte précoce (nature de l'incident, impact potentiel) | ANSSI (CSIRT national) |
| 72 heures | Notification complète (analyse initiale, mesures prises) | ANSSI |
| 1 mois | Rapport final (causes, impact réel, mesures correctives) | ANSSI |

CRISE_EOF

echo "Plan de gestion de crise cyber créé"
```

**Résultat attendu** :

```text
Plan de gestion de crise cyber créé
```

---

### Étape 4 : Construire un business case sécurité

```bash
# Créer le business case
cat > ~/grc-avancee/business-case-securite.md << 'BIZ_EOF'
# Business Case - Programme de Sécurité 2026

## Contexte
L'entreprise est soumise à NIS2 (entité importante) et prépare la certification
ISO 27001. Le COMEX demande une justification financière du budget sécurité.

## Investissement demandé : 1 200 000 EUR/an

## Analyse coût-bénéfice

### Coûts de l'inaction (sans investissement)

| Risque | Probabilité (3 ans) | Impact | Perte attendue (3 ans) |
| ------ | -------------------- | ------ | ---------------------- |
| Ransomware majeur | 60% | 2 000 000 EUR | 1 200 000 EUR |
| Fuite de données | 40% | 3 000 000 EUR | 1 200 000 EUR |
| Amende NIS2 | 30% | 1 000 000 EUR | 300 000 EUR |
| Amende RGPD | 20% | 2 000 000 EUR | 400 000 EUR |
| Perte de contrat (exigence ISO 27001) | 50% | 1 500 000 EUR | 750 000 EUR |
| **TOTAL** | | | **3 850 000 EUR** |

### Bénéfices de l'investissement (sur 3 ans)

| Bénéfice | Valeur estimée |
| -------- | -------------- |
| Réduction du risque (ALE) | 2 500 000 EUR |
| Certification ISO 27001 (accès nouveaux marchés) | 500 000 EUR |
| Conformité NIS2 (évitement amende) | 300 000 EUR |
| Amélioration de la confiance clients | 200 000 EUR |
| **TOTAL bénéfices** | **3 500 000 EUR** |

### ROI sur 3 ans
- Investissement total : 3 x 1 200 000 = 3 600 000 EUR
- Bénéfices totaux : 3 500 000 EUR
- Coût de l'inaction : 3 850 000 EUR
- ROI vs inaction : (3 850 000 - 3 600 000) / 3 600 000 = 7%
- Valeur ajoutée nette : 3 500 000 - 3 600 000 = -100 000 EUR (le programme
  se finance par les risques évités et les opportunités commerciales)

### Argument clé pour le COMEX
"Sans ce programme, la perte attendue sur 3 ans est de 3.85 M EUR.
Avec ce programme (3.6 M EUR sur 3 ans), nous réduisons cette perte
à 1.35 M EUR et gagnons 500 K EUR de nouveaux contrats.
Le programme se finance par les pertes évitées."

BIZ_EOF

echo "Business case sécurité créé"
```

**Résultat attendu** :

```text
Business case sécurité créé
```

---

### Étape 5 : Préparer un plan d'audit interne

```bash
# Créer le plan d'audit interne
cat > ~/grc-avancee/plan-audit-interne.md << 'AUDIT_EOF'
# Plan d'Audit Interne Sécurité - 2026

## Objectif
Vérifier la conformité des contrôles de sécurité avec les exigences
ISO 27001:2022, NIS2 et les politiques internes.

## Planning annuel

| Trimestre | Domaine audité | Référentiel | Auditeur |
| --------- | -------------- | ----------- | -------- |
| T1 | Gestion des accès et identités | ISO A.5.15-5.18, NIS2 Art.21 | Interne |
| T2 | Gestion des incidents et continuité | ISO A.5.24-5.30, NIS2 Art.23 | Interne |
| T3 | Sécurité des développements et supply chain | ISO A.8.25-8.34, NIS2 Art.21(d) | Externe |
| T4 | Revue de direction et amélioration continue | ISO 9.3, 10.1-10.2 | Interne |

## Méthodologie d'audit

### Phase 1 : Préparation (2 semaines avant)
1. Définir le périmètre et les objectifs
2. Collecter la documentation (politiques, procédures, logs)
3. Préparer la checklist d'audit basée sur le référentiel

### Phase 2 : Exécution (1 semaine)
1. Interviews des responsables de processus
2. Revue documentaire (politiques vs pratiques)
3. Tests techniques (échantillonnage de contrôles)
4. Observation des pratiques terrain

### Phase 3 : Rapport (1 semaine après)
1. Rédiger les constats (conformité, non-conformité mineure/majeure, observation)
2. Proposer des actions correctives avec échéances
3. Présenter le rapport à la direction

## Échelle de classification des constats

| Niveau | Définition | Délai de correction |
| ------ | ---------- | ------------------- |
| Non-conformité majeure | Contrôle absent ou totalement inefficace | 30 jours |
| Non-conformité mineure | Contrôle partiellement en place, efficacité réduite | 90 jours |
| Observation | Point d'amélioration, pas de risque immédiat | 180 jours |
| Conformité | Contrôle en place et efficace | N/A |

AUDIT_EOF

echo "Plan d'audit interne créé"
```

**Résultat attendu** :

```text
Plan d'audit interne créé
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `pip install fairquant` | Installer l'outil de calcul FAIR en Python |
| `python3 -c "from fairquant import FairModel; m = FairModel(); print(m)"` | Vérifier l'installation de fairquant |
| `openscap xccdf eval --profile xccdf_org.ssgproject.content_profile_cis /usr/share/xml/scap/ssg/content/ssg-rhel9-ds.xml` | Évaluer la conformité CIS d'un serveur RHEL |
| `lynis audit system` | Auditer la configuration de sécurité d'un système Linux |
| `docker run --rm -v $(pwd):/data aquasec/trivy fs /data` | Scanner les vulnérabilités d'un projet |

---

## Pièges Fréquents

### Piège 1 : Quantifier les risques avec trop de précision

**Problème** : présenter un ALE de "862 437,52 EUR" donne une fausse impression de précision. Les estimations FAIR sont des distributions de probabilité, pas des valeurs exactes.

**Solution** : toujours présenter des fourchettes. Dire "entre 600 000 et 1 100 000 EUR/an" est plus honnête et plus crédible que "862 437,52 EUR". Utilise les percentiles (P10, P50, P90) pour exprimer l'incertitude.

### Piège 2 : Multiplier les KPI sans les exploiter

**Problème** : certains RSSI créent des dashboards avec 50 KPI. Le COMEX ne lit pas un tableau de 50 lignes.

**Solution** : limite-toi à 5-8 KPI pour le COMEX. Choisis des indicateurs actionnables (qui déclenchent une décision si le seuil est dépassé). Les KPI détaillés restent au niveau opérationnel (SOC, équipe infra).

### Piège 3 : Traiter chaque référentiel en silo

**Problème** : monter un projet ISO 27001, un projet NIS2 et un projet SOC 2 séparément triple les efforts et crée des incohérences.

**Solution** : créer un référentiel de contrôles unifié. Chaque contrôle est mappé sur toutes les exigences qu'il couvre. Un seul jeu de preuves alimente tous les audits. Utilise un outil GRC (Vanta, Drata, OneTrust) pour automatiser le mapping.

### Piège 4 : Ne pas tester le plan de crise

**Problème** : le plan de gestion de crise existe sur papier mais n'a jamais été testé. Le jour de la crise, personne ne le connaît.

**Solution** : organiser au minimum 2 exercices de crise par an : un exercice sur table (tabletop) et un exercice technique (simulation d'attaque). Documenter les leçons apprises et mettre à jour le plan.

---

## Checklist de Validation

- [ ] Je sais structurer un programme de sécurité avec ses composantes (politique, processus, technologie, personnes)
- [ ] Je peux réaliser une analyse de risque FAIR et calculer un ALE
- [ ] Je comprends les différences entre ISO 27001, SOC 2, NIS2 et DORA
- [ ] Je sais mapper les contrôles entre plusieurs référentiels
- [ ] Je peux construire un dashboard KPI adapté au COMEX
- [ ] Je sais rédiger un business case sécurité avec ROI
- [ ] Je peux préparer et piloter un audit interne
- [ ] Je comprends les obligations de notification d'incident (NIS2, RGPD)
- [ ] Je connais la structure d'un plan de gestion de crise cyber

---

## Exercice Pratique

**Énoncé** : Tu es RSSI d'une fintech de 150 employés soumise à DORA et NIS2. Le COMEX te demande un rapport trimestriel avec un budget prévisionnel pour l'année prochaine.

**Contexte** :

- L'entreprise traite des données financières et des données personnelles (RGPD + DORA + NIS2)
- L'infrastructure est 100% cloud (AWS)
- L'équipe sécurité : 3 personnes (toi inclus)
- Incidents récents : 2 tentatives de phishing réussies (comptes compromis), 1 alerte ransomware bloquée par l'EDR
- Pas de certification ISO 27001 (demandée par les clients bancaires)

**Travail demandé** :

1. Réaliser une analyse FAIR pour les 3 principaux risques
2. Construire un dashboard de 8 KPI pour le COMEX
3. Rédiger un business case pour augmenter l'équipe de 3 à 5 personnes
4. Proposer un plan de conformité multi-référentiel (DORA + NIS2 + ISO 27001)
5. Rédiger le plan de gestion de crise incluant les obligations de notification DORA

**Indications** :

- DORA impose des tests de résilience numérique (TLPT) et une gestion du risque tiers (ICT third-party)
- NIS2 impose une notification sous 24h
- Le budget actuel est de 400 000 EUR/an (insuffisant pour la certification ISO 27001)
- Les clients bancaires exigent la certification ISO 27001 pour continuer les contrats

**Résultat attendu** :

- Un fichier `fair-fintech.md` avec les 3 analyses de risque quantifiées
- Un fichier `dashboard-comex.md` avec les 8 KPI et leurs valeurs
- Un fichier `business-case-recrutement.md` avec la justification financière
- Un fichier `plan-conformite.md` avec le planning multi-référentiel
- Un fichier `plan-crise-dora.md` avec le plan de crise et les notifications

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### 1. Analyse FAIR - 3 principaux risques

**Risque 1 : Compromission de comptes par phishing**

| Composant | Valeur |
| --------- | ------ |
| TEF | 10 tentatives/an (historique : 2 réussies sur 6 mois) |
| Vulnérabilité | 20% (MFA en place mais contournable par fatigue MFA) |
| LEF | 10 x 0.20 = 2 événements/an |
| PLM | 50 000 EUR (investigation, reset, remédiation) |
| SLM | 150 000 EUR (notification DORA, impact clients) |
| **ALE** | **2 x 200 000 = 400 000 EUR/an** |

**Risque 2 : Ransomware**

| Composant | Valeur |
| --------- | ------ |
| TEF | 5 tentatives/an |
| Vulnérabilité | 5% (EDR efficace, mais 1 alerte récente) |
| LEF | 5 x 0.05 = 0.25 événements/an |
| PLM | 500 000 EUR (arrêt d'activité, forensique, restauration) |
| SLM | 2 000 000 EUR (perte de clients, amende DORA, réputation) |
| **ALE** | **0.25 x 2 500 000 = 625 000 EUR/an** |

**Risque 3 : Non-conformité DORA/NIS2**

| Composant | Valeur |
| --------- | ------ |
| LEF | 0.3 (probabilité d'audit/contrôle dans l'année) |
| Loss Magnitude | 500 000 EUR (amende) + 300 000 EUR (mise en conformité urgente) |
| **ALE** | **0.3 x 800 000 = 240 000 EUR/an** |

**ALE total : 400 000 + 625 000 + 240 000 = 1 265 000 EUR/an**

### 2. Dashboard COMEX

| KPI | Valeur T1 | Cible | Statut |
| --- | --------- | ----- | ------ |
| MTTD | 36h | < 24h | Non atteint |
| MTTR | 8h | < 4h | Non atteint |
| Couverture MFA | 95% | > 99% | En progression |
| Phishing réussi | 12% | < 5% | Non atteint |
| Conformité DORA | 45% | 100% (janv. 2025) | En retard |
| Conformité NIS2 | 60% | 100% | En progression |
| ALE total (FAIR) | 1.27 M EUR | < 800 K EUR | Non atteint |
| Couverture actifs critiques | 80% | 100% | En progression |

### 3. Business case recrutement

```text
Situation actuelle : 3 personnes, ALE = 1.27 M EUR/an
Investissement demandé : +2 ETP = +160 000 EUR/an (2 x 80 000 EUR)
Bénéfice attendu : réduction ALE de 1.27 M à 0.75 M EUR/an (= -520 000 EUR)
ROI = (520 000 - 160 000) / 160 000 = 225%

Profils recherchés :
- 1 analyste SOC senior (MTTD/MTTR)
- 1 responsable conformité GRC (DORA/NIS2/ISO 27001)
```

### 4. Plan de conformité multi-référentiel

| Trimestre | DORA | NIS2 | ISO 27001 |
| --------- | ---- | ---- | --------- |
| T2 2026 | Politique de gestion risque ICT | Déclaration d'entité | Analyse de contexte (clause 4) |
| T3 2026 | Gestion des incidents ICT | Mesures de sécurité (Art.21) | Appréciation des risques (clause 6) |
| T4 2026 | Tests de résilience (TLPT) | Plan de réponse à incident | Déclaration d'applicabilité (SoA) |
| T1 2027 | Gestion du risque tiers ICT | Audit de conformité | Audit de certification |

### 5. Plan de crise DORA

```text
Obligations de notification DORA (Art. 19 + RTS) :
- Notification initiale : dans les 4 heures après la classification
  comme incident majeur, et au plus tard 24 heures après la détection
- Notification intermédiaire : sous 72 heures après la notification initiale
- Rapport final : dans un délai d'un mois après l'incident
  (NIS2 art. 23 a son propre calendrier 24h / 72h / 1 mois)

Critères d'incident majeur DORA :
- Impact sur la continuité des services financiers critiques
- Nombre de clients affectés > 10% de la base
- Perte financière > seuil défini par l'autorité compétente
- Données sensibles compromises
```

---

## Navigation

← Fiche précédente : **[01 - Architecture de Sécurité](01-architecture-securite.md)**

→ Fiche suivante : **[03 - Recherche en Sécurité et Contribution Communautaire](03-recherche-securite.md)**
