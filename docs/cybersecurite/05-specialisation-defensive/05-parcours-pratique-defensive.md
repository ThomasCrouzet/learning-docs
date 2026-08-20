---
tags:
  - Cybersécurité
  - Avancé
  - Concept
description: "Labs et parcours de pratique défensive : DFIR, SOC, threat hunting et forensique"
estimated_time: "45 min"
fiche_number: 5
total_fiches: 5
cursus: "Phase 5 - Spécialisation Défensive"
---

# 05 - Parcours de pratique défensive

> **En bref** : À la fin de cette fiche, tu sauras choisir un parcours de labs défensifs adapté à ton niveau, planifier ta pratique, et relier DFIR, malware, hunting et endpoint à des exercices réalistes. Lecture estimée : 45 min.

!!! note "Limite honnête"
    Cette fiche est un **repère pédagogique**. Elle n'est **pas** une formation officielle CompTIA, Security Blue Team, GIAC/SANS ou Microsoft. Formats, codes d'examen, prix et dates de retrait évoluent : vérifie toujours les pages officielles. Lire ce wiki ne garantit pas la réussite d'un examen ni un titre professionnel.

## Prérequis

- [Phase 5](index.md) - fiches 01 à 04 complétées (DFIR, Analyse de Malware, Threat Hunting, Sécurité Endpoint)
- Expérience pratique en analyse de logs, investigation d'incidents et utilisation d'un SIEM
- Compréhension des concepts MITRE ATT&CK, IoC/IoA, forensique mémoire et disque
- Budget et temps de préparation identifiés

## Objectif de cette fiche

À la fin de cette fiche, tu sauras choisir un parcours de labs défensifs adapté à ton niveau, planifier ta pratique, et relier DFIR, malware, hunting et endpoint à des exercices réalistes.

---

## Concepts

### Qu'est-ce qu'un parcours de pratique défensive ?

**Définition** : Un parcours de pratique défensive est un enchaînement de labs et d'exercices qui entraîne les compétences SOC, DFIR, analyse de malware et threat hunting, avec un plan de travail réaliste.

**Le problème que les certifications résolvent** :

Sans certifications, voici les problèmes rencontrés :

1. **Crédibilité difficile à prouver** : sans titre reconnu, il est difficile de démontrer ses compétences à un recruteur ou un client
2. **Parcours de progression flou** : sans roadmap claire, on ne sait pas quoi apprendre ensuite ni dans quel ordre
3. **Lacunes non identifiées** : sans examen structuré, on ignore ses points faibles
4. **Compétitivité réduite** : sur le marché de l'emploi, les candidats certifiés sont souvent privilégiés pour les postes avancés

**Comment les certifications résolvent ces problèmes** :

| Problème | Solution apportée |
| -------- | ----------------- |
| Crédibilité difficile | Titre reconnu mondialement, vérifiable par l'employeur |
| Parcours flou | Chaque certification définit un scope précis de compétences |
| Lacunes non identifiées | L'examen révèle les domaines à améliorer |
| Compétitivité réduite | Différenciation sur le marché de l'emploi |

**Analogie concrète** : Les certifications sont comme le permis de conduire. Tu peux savoir conduire sans permis, mais le permis prouve officiellement que tu as les compétences requises. De plus, passer le permis t'oblige à structurer ton apprentissage et à valider chaque compétence (code de la route, manoeuvres, conduite sur route).

**Ce que les certifications ne sont PAS** :

- Les certifications ne sont pas une garantie de compétence pratique. Certaines certifications sont principalement théoriques (QCM). Elles prouvent la connaissance, pas nécessairement la capacité à appliquer
- Les certifications ne remplacent pas l'expérience. Un analyste avec 3 ans d'expérience SOC sans certification est souvent plus compétent qu'un certifié sans expérience pratique

### Quel est le parcours recommandé ?

**Définition** : Le parcours de certifications défensives suit une progression logique, du généraliste au spécialiste. Chaque certification construit sur les compétences de la précédente.

**Le parcours en 4 niveaux** :

| Niveau | Certification | Organisme | Difficulté | Prérequis recommandé | Budget |
| ------ | ------------- | --------- | ---------- | -------------------- | ------ |
| 1 - Entrée | CompTIA CySA+ | CompTIA | Intermédiaire | Security+ ou équivalent | ~370 EUR |
| 2 - Pratique | BTL1 (Blue Team Level 1) | Security Blue Team | Intermédiaire-Avancé | CySA+ ou expérience SOC | ~400 GBP |
| 3 - Avancé | GCIH (Incident Handler) | GIAC/SANS | Avancé | BTL1 + expérience IR | ~2400 EUR (exam seul) |
| 4 - Expert | GCFA (Forensic Analyst) | GIAC/SANS | Expert | GCIH + expérience DFIR | ~2400 EUR (exam seul) |

**Certifications complémentaires** :

| Certification | Spécialisation | Quand la passer |
| ------------- | -------------- | --------------- |
| GNFA (Network Forensic Analyst) | Forensique réseau | Après GCIH |
| GREM (Reverse Engineering Malware) | Analyse de malware | Après GCFA |
| SC-200 (Microsoft Security Operations) | SOC Microsoft | À tout moment (si environnement Microsoft) |
| Splunk Core Certified User | SIEM Splunk | À tout moment (si environnement Splunk) |
| BTL2 (Blue Team Level 2) | DFIR avancé | Après BTL1 + 1 an d'expérience |

### Qu'est-ce que CompTIA CySA+ ?

**Définition** : CompTIA CySA+ (Cybersecurity Analyst) est une certification intermédiaire qui valide les compétences en détection de menaces, analyse de sécurité, réponse aux incidents et conformité. C'est le point d'entrée recommandé pour les rôles défensifs.

**Détails de l'examen** :

| Critère | Détail (CS0-003, version V3 encore courante en 2026) |
| ------- | ------ |
| Code | CS0-003 (V3) ; CompTIA a aussi lancé CySA+ V4 (CS0-004) - vérifier la version à passer |
| Format | QCM + questions basées sur des scénarios (PBQ) |
| Nombre de questions | 85 maximum |
| Durée | 165 minutes |
| Score minimum | 750/900 |
| Langue | Anglais (et autres) |
| Validité | 3 ans (renouvellement par CEUs) |
| Prix | ~370-400 EUR (indicatif, évolutif) |
| Retrait V3 | examen anglais CS0-003 : 22 décembre 2026 (produits d'apprentissage anglais : 22 novembre 2026 ; traductions : 23 mars 2027) |

**Domaines couverts** :

| Domaine | Poids | Contenu |
| ------- | ----- | ------- |
| Security Operations | 33% | SIEM, monitoring, analyse de logs, triage d'alertes |
| Vulnerability Management | 30% | Scans, priorisation, remédiation, CVSS |
| Incident Response | 20% | Méthodologie IR, forensique basique, chain of custody |
| Reporting & Communication | 17% | Rapports, métriques, communication aux parties prenantes |

### Qu'est-ce que BTL1 ?

**Définition** : BTL1 (Blue Team Level 1) est une certification pratique délivrée par Security Blue Team. L'examen est un exercice d'investigation de 24 heures où le candidat doit analyser un incident réel dans un lab en ligne et rédiger un rapport.

**Détails de l'examen** :

| Critère | Détail |
| ------- | ------ |
| Format | Investigation pratique dans un lab (24 heures) |
| Score minimum | 70% |
| Validité | À vie (pas de renouvellement) |
| Prix | ~400 GBP (incluant la formation en ligne) |

**Domaines couverts** :

| Domaine | Contenu |
| ------- | ------- |
| Phishing Analysis | Analyse d'emails malveillants, headers, pièces jointes |
| Threat Intelligence | OSINT, IoCs, MITRE ATT&CK, threat feeds |
| Digital Forensics | Forensique disque, mémoire, artefacts Windows |
| SIEM | Analyse de logs, requêtes Splunk, corrélation |
| Incident Response | Méthodologie, containment, éradication, rapport |
| Network Analysis | Analyse PCAP, détection C2, Wireshark |

**Pourquoi BTL1 est le meilleur point d'entrée pratique** :

| CySA+ | BTL1 |
| ----- | ---- |
| Examen QCM (théorique) | Examen pratique (lab de 24h) |
| Valide la connaissance | Valide la capacité à investiguer |
| Reconnu par CompTIA (HR-friendly) | Reconnu par la communauté technique |
| Plus adapté pour le CV | Plus adapté pour le travail réel |

### Qu'est-ce que les certifications GIAC/SANS ?

**Définition** : GIAC (Global Information Assurance Certification) est l'organisme de certification de SANS Institute. Les certifications GIAC sont considérées comme les plus exigeantes et les plus respectées dans l'industrie de la cybersécurité.

**Certifications GIAC défensives** :

| Certification | Code | Cours SANS associé | Spécialisation |
| ------------- | ---- | ------------------ | -------------- |
| GCIH | GIAC Certified Incident Handler | SEC504 | Réponse aux incidents, techniques d'attaque |
| GCFA | GIAC Certified Forensic Analyst | FOR508 | Forensique avancée Windows, timeline, APT |
| GNFA | GIAC Network Forensic Analyst | FOR572 | Forensique réseau, PCAP, NetFlow |
| GREM | GIAC Reverse Engineering Malware | FOR610 | Analyse de malware, reverse engineering |
| GCFE | GIAC Certified Forensic Examiner | FOR500 | Forensique Windows fondamentale |

**Détails communs aux examens GIAC** :

| Critère | Détail |
| ------- | ------ |
| Format | QCM (questions techniques approfondies) |
| Nombre de questions | 106-115 |
| Durée | 4-5 heures |
| Score minimum | 63-71% (varie selon la certification) |
| Open book | Oui (tu peux apporter tes notes papier) |
| Prix (exam seul) | ~2400 EUR |
| Prix (cours + exam) | ~8000-9000 EUR |
| Validité | 4 ans (renouvellement par CEUs ou re-examen) |

**Particularité : les examens GIAC sont open book**. Tu peux apporter un index papier. La stratégie de préparation inclut donc la création d'un index détaillé de tes notes de cours.

---

## Étapes Pratiques

### Étape 1 : Évaluer ton niveau actuel

Avant de choisir une certification, évalue tes compétences actuelles pour identifier ton point de départ.

```bash
# Auto-évaluation par domaine (note de 1 à 5)

# Domaine 1 : Analyse de logs et SIEM
# - Je sais écrire des requêtes SIEM (Splunk/Elastic)     : __/5
# - Je sais corréler des événements de plusieurs sources   : __/5
# - Je sais identifier les faux positifs                   : __/5

# Domaine 2 : Forensique
# - Je sais analyser un dump mémoire avec Volatility       : __/5
# - Je sais analyser des artefacts Windows                 : __/5
# - Je sais analyser une capture PCAP                      : __/5

# Domaine 3 : Réponse aux incidents
# - Je connais la méthodologie PICERL                      : __/5
# - Je sais rédiger un rapport d'investigation             : __/5
# - Je sais contenir et éradiquer une menace               : __/5

# Domaine 4 : Threat Intelligence
# - Je connais MITRE ATT&CK                               : __/5
# - Je sais utiliser des plateformes TI (MISP, OpenCTI)   : __/5
# - Je sais mener un threat hunt                           : __/5

# Interprétation :
# Moyenne < 2 → Commence par CySA+
# Moyenne 2-3 → BTL1 est adapté
# Moyenne 3-4 → Tu peux viser GCIH
# Moyenne > 4 → GCFA ou certifications spécialisées
```

**Résultat attendu** :

```text
Score total : __/60
Moyenne : __/5
Recommandation : [CySA+ | BTL1 | GCIH | GCFA]
```

### Étape 2 : Préparer CompTIA CySA+

La préparation au CySA+ prend 2 à 3 mois d'étude régulière.

```bash
# Planning de préparation CySA+ (12 semaines)

# Semaines 1-4 : Security Operations (33%)
# - SIEM : requêtes, corrélation, dashboards
# - Monitoring : sources de logs, baseline, anomalies
# - Triage d'alertes : classification, priorisation
# Ressources :
#   - Livre : "CompTIA CySA+ Study Guide" (Sybex)
#   - Labs : TryHackMe "SOC Level 1" path
#   - Vidéos : Professor Messer CySA+ (gratuit sur YouTube)

# Semaines 5-8 : Vulnerability Management (30%)
# - Scans de vulnérabilités : Nessus, OpenVAS
# - CVSS : calcul de score, priorisation
# - Remédiation : patching, hardening, compensating controls
# Ressources :
#   - Labs : TryHackMe "Vulnerability Research" room
#   - Practice : scanner un lab vulnérable et rédiger un rapport

# Semaines 9-10 : Incident Response & Forensics (20%)
# - Méthodologie NIST/PICERL
# - Forensique basique : acquisition, analyse, rapport
# - Chain of custody
# Ressources :
#   - Labs : CyberDefenders (challenges forensiques gratuits)
#   - Révision des fiches 01-04 de cette phase

# Semaines 11-12 : Révision et examens blancs
# - Examens blancs : CompTIA CertMaster Practice
# - Révision des domaines faibles
# - Simulation de PBQ (Performance-Based Questions)
# Objectif : obtenir > 80% aux examens blancs avant de passer l'examen
```

**Résultat attendu** :

```text
Semaine 12 : Score examens blancs > 80%
→ Prêt pour passer l'examen CySA+
```

### Étape 3 : Préparer BTL1

La préparation au BTL1 est principalement pratique. L'examen est un lab de 24 heures.

```bash
# Planning de préparation BTL1 (8-12 semaines)

# Le cours BTL1 inclut 6 domaines avec des labs pratiques :

# Domaine 1 : Phishing Analysis (2 semaines)
# - Analyser les headers email (SPF, DKIM, DMARC)
# - Extraire et analyser les pièces jointes
# - Identifier les techniques de social engineering
# Practice :
#   - PhishMe/PhishTool (analyse d'emails)
#   - VirusTotal, URLhaus (vérification d'URLs)

# Domaine 2 : Digital Forensics (3 semaines)
# - Volatility : analyse mémoire (processus, réseau, DLLs)
# - Autopsy : analyse disque (timeline, file recovery)
# - Artefacts Windows : Event Logs, Prefetch, MFT
# Practice :
#   - CyberDefenders : "Seized", "DumpMe", "Hammered"
#   - MemLabs (challenges Volatility)

# Domaine 3 : SIEM (2 semaines)
# - Requêtes Splunk (SPL)
# - Corrélation d'événements
# - Création de dashboards et alertes
# Practice :
#   - Splunk BOTS (Boss of the SOC) - challenges gratuits
#   - TryHackMe "Splunk" rooms

# Domaine 4 : Network Analysis (2 semaines)
# - Wireshark : filtres, suivi de flux, extraction de fichiers
# - tshark : analyse en ligne de commande
# - Détection C2, exfiltration DNS
# Practice :
#   - Malware Traffic Analysis (malware-traffic-analysis.net)
#   - CyberDefenders challenges réseau

# Domaine 5 : Threat Intelligence (1 semaine)
# - MITRE ATT&CK, Diamond Model, Cyber Kill Chain
# - OSINT : Shodan, Censys, whois, réseaux sociaux
# Practice :
#   - TryHackMe "Threat Intelligence" path

# Domaine 6 : Incident Response (2 semaines)
# - Méthodologie PICERL
# - Containment, éradication, recovery
# - Rédaction de rapport d'incident
# Practice :
#   - Rédiger 3 rapports d'incident complets sur des challenges précédents
```

**Résultat attendu** :

```text
Avant l'examen BTL1 :
- 10+ challenges forensiques complétés
- 5+ analyses PCAP réalisées
- 3+ rapports d'incident rédigés
- Confort avec Volatility, Wireshark, Splunk, Autopsy
```

### Étape 4 : Préparer GCIH (GIAC Certified Incident Handler)

Le GCIH est la certification de référence pour la réponse aux incidents. La préparation est intensive.

```bash
# Planning de préparation GCIH (3-4 mois)

# Option 1 : Avec le cours SANS SEC504 (recommandé si budget disponible)
# - 6 jours de formation intensive (en ligne ou en présentiel)
# - Labs pratiques inclus
# - Accès aux supports de cours (indispensables pour l'index)

# Option 2 : Auto-formation (budget réduit)
# Ressources alternatives :
#   - Livre : "GCIH GIAC Certified Incident Handler All-in-One Exam Guide"
#   - Labs : TryHackMe, CyberDefenders, LetsDefend
#   - Practice tests : GIAC practice exams (2 inclus avec l'exam)

# Domaines GCIH :
# 1. Incident Handling Process
#    - PICERL, NIST 800-61
#    - Documentation, chain of custody
#    - Communication avec le management

# 2. Computer and Network Hacker Exploits
#    - Reconnaissance (active/passive)
#    - Scanning (Nmap, vulnérabilités)
#    - Exploitation (côté défenseur : comprendre les attaques)

# 3. Hacker Tools
#    - Metasploit (vue défensive)
#    - Techniques de persistence, lateral movement
#    - Password attacks, privilege escalation

# 4. Incident Handling Scenarios
#    - Malware incidents
#    - Web application attacks
#    - Insider threats
#    - DDoS

# STRATÉGIE CLÉ : Créer un index papier détaillé
# L'examen GCIH est open book. Un bon index fait la différence.
# Format recommandé :
# - Alphabétique par concept
# - Pour chaque concept : page du cours, définition courte, commande clé
# - Temps de création de l'index : 20-30 heures
```

**Résultat attendu** :

```text
Index GCIH :
- 200+ entrées
- Organisé alphabétiquement
- Chaque entrée : concept, page, résumé 1 ligne, commande
- Testé avec les 2 practice exams GIAC (score > 75%)
```

### Étape 5 : Préparer GCFA (GIAC Certified Forensic Analyst)

Le GCFA est la certification la plus poussée en forensique. Elle est associée au cours SANS FOR508 (Advanced Incident Response, Threat Hunting, and Digital Forensics).

```bash
# Planning de préparation GCFA (4-6 mois)

# Le GCFA couvre la forensique Windows avancée et le threat hunting :

# 1. Advanced Incident Response
#    - Triage forensique à grande échelle
#    - Analyse de compromission APT
#    - Threat hunting dans l'Enterprise

# 2. Memory Forensics
#    - Volatility avancé : rootkits, injection, hooks
#    - Analyse de processus malveillants
#    - Détection de techniques d'évasion en mémoire

# 3. Timeline Analysis
#    - Super Timeline (plaso/log2timeline)
#    - Corrélation multi-sources
#    - Reconstruction de la chaîne d'attaque

# 4. Advanced Windows Forensics
#    - NTFS advanced : $MFT, $UsnJrnl, $LogFile
#    - Registre avancé : UserAssist, BAM, ShellBags
#    - Amcache, ShimCache, Prefetch deep dive
#    - Event Log advanced : lateral movement, RDP, WMI

# 5. Anti-Forensics
#    - Timestomping, log clearing, secure deletion
#    - Détection des techniques anti-forensiques

# Ressources :
#   - Cours SANS FOR508 (si budget)
#   - SANS Workbooks et challenges DFIR
#   - CyberDefenders : challenges avancés
#   - 13Cubed YouTube (forensique Windows gratuit)
#   - SANS DFIR Poster (référence rapide)
```

**Résultat attendu** :

```text
Avant l'examen GCFA :
- Index papier de 300+ entrées
- 20+ investigations forensiques réalisées
- Maîtrise de Volatility, plaso, KAPE, Eric Zimmerman tools
- Score > 75% aux practice exams GIAC
```

### Étape 6 : Certifications complémentaires

Ces certifications sont optionnelles mais ajoutent de la valeur selon ton environnement de travail.

```bash
# SC-200 : Microsoft Security Operations Analyst
# Pertinent si ton environnement utilise Microsoft Sentinel/Defender

# Détails :
# - Format : QCM + labs pratiques
# - Durée : 120 minutes
# - Score minimum : 700/1000
# - Prix : ~165 EUR
# - Contenu : Microsoft Sentinel, Defender for Endpoint, KQL

# Préparation :
# - Microsoft Learn (modules gratuits)
# - Labs : Microsoft Learn sandbox
# - Durée : 4-6 semaines

# ---

# Splunk Core Certified User
# Pertinent si ton SOC utilise Splunk

# Détails :
# - Format : QCM
# - Durée : 60 minutes
# - Score minimum : 70%
# - Prix : ~130 EUR
# - Contenu : SPL basique, recherche, visualisation, dashboards

# Préparation :
# - Splunk Fundamentals 1 (gratuit sur Splunk Education)
# - Labs : Splunk BOTS challenges
# - Durée : 2-3 semaines

# ---

# GREM : GIAC Reverse Engineering Malware
# Pour la spécialisation en analyse de malware

# Détails :
# - Cours associé : SANS FOR610
# - Format : QCM open book
# - Durée : 4 heures
# - Contenu : analyse statique/dynamique avancée, déobfuscation,
#   unpacking, analyse de documents malveillants, analyse de scripts
# - Budget : ~2400 EUR (exam) ou ~9000 EUR (cours + exam)
# - Préparation : 4-6 mois
```

### Étape 7 : Stratégies d'examen

Des stratégies concrètes pour structurer ta préparation (sans promesse de réussite).

```bash
# Stratégie générale (toutes certifications) :

# 1. Planification
# - Réserver une date d'examen 4-6 semaines à l'avance
# - Avoir une date fixe force la discipline d'étude
# - Si pas prêt : reporter (pas annuler)

# 2. Practice exams
# - Passer au minimum 2 examens blancs complets
# - Objectif : score > 80% sur les examens blancs
# - Analyser CHAQUE question ratée (comprendre pourquoi)

# 3. Gestion du temps
# - CySA+ : 85 questions en 165 min = ~2 min/question
# - GCIH/GCFA : 106 questions en 4h = ~2.3 min/question
# - BTL1 : 24 heures, mais rédiger le rapport prend du temps
# - Règle : ne jamais passer plus de 3 minutes sur une question QCM

# 4. Stratégie GIAC (open book)
# - L'index papier est TON outil principal
# - Format recommandé : classeur à onglets A-Z
# - Chaque page de cours indexée par concept clé
# - Tester l'index : chercher 20 concepts aléatoires en < 30 secondes chacun
# - Ne pas trop se reposer sur l'index : si tu dois chercher chaque
#   question, tu manqueras de temps

# 5. Stratégie BTL1 (lab pratique)
# - Lire l'énoncé ENTIÈREMENT avant de toucher au clavier
# - Prendre des notes et des captures d'écran dès le début
# - Rédiger le rapport au fil de l'investigation (pas à la fin)
# - Garder 4-6 heures pour la rédaction du rapport final
# - Le rapport compte autant que l'investigation technique

# 6. Jour de l'examen
# - Bien dormir la veille (pas de révision de dernière minute)
# - Arriver 30 minutes en avance (ou préparer l'environnement online)
# - Lire chaque question deux fois avant de répondre
# - Marquer les questions incertaines pour y revenir
```

**Résultat attendu** :

```text
Checklist pré-examen :
- [ ] 2+ examens blancs passés (score > 80%)
- [ ] Index papier complet et testé (GIAC uniquement)
- [ ] Toutes les questions ratées analysées et comprises
- [ ] Date d'examen réservée
- [ ] Bonne nuit de sommeil planifiée
```

### Étape 8 : Construire un planning global

Un planning réaliste sur 18-24 mois pour passer les certifications principales.

```bash
# Planning sur 24 mois (exemple)

# Mois 1-3 : CompTIA CySA+
# - Étude : 10h/semaine
# - Examen : fin du mois 3
# - Budget : ~370 EUR

# Mois 4-7 : BTL1
# - Cours + labs : 10h/semaine
# - Examen : mois 7
# - Budget : ~400 GBP

# Mois 8-9 : Pause pratique
# - Appliquer les compétences en environnement réel
# - Participer à des CTF Blue Team (Blue Team Labs Online)
# - Contribuer à des projets open source (Sigma rules, YARA rules)

# Mois 10-13 : GCIH
# - Cours SANS SEC504 (ou auto-formation)
# - Création de l'index : 30 heures
# - Examen : mois 13
# - Budget : ~2400 EUR (exam) ou ~8500 EUR (cours + exam)

# Mois 14-15 : Pause pratique
# - CyberDefenders challenges avancés
# - Rédaction de write-ups

# Mois 16-20 : GCFA
# - Cours SANS FOR508 (ou auto-formation)
# - Création de l'index : 40 heures
# - Examen : mois 20
# - Budget : ~2400 EUR (exam) ou ~9000 EUR (cours + exam)

# Mois 21-24 : Spécialisation
# - GREM (malware) ou GNFA (réseau) selon spécialisation choisie
# - SC-200 ou Splunk si pertinent pour l'environnement de travail

# Budget total estimé :
# Option économique (exams seuls) : ~5570 EUR + ~400 GBP
# Option complète (cours + exams) : ~18000+ EUR
```

**Résultat attendu** :

```text
Planning personnalisé :
Mois  Certification    Budget      Heures/sem
1-3   CySA+           370 EUR     10h
4-7   BTL1            400 GBP     10h
10-13 GCIH            2400+ EUR   15h
16-20 GCFA            2400+ EUR   15h
21-24 Spécialisation  Variable    10h
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| TryHackMe | Labs pratiques pour CySA+, BTL1 |
| CyberDefenders | Challenges forensiques (BTL1, GCFA) |
| LetsDefend | Simulation SOC (CySA+, BTL1) |
| Blue Team Labs Online | CTF Blue Team |
| Malware Traffic Analysis | PCAPs pour analyse réseau |
| MemLabs | Challenges Volatility |
| Splunk BOTS | Challenges SIEM Splunk |
| SANS DFIR Poster | Références rapides forensique |

---

## Pièges Fréquents

### Piège 1 : Commencer par une certification trop avancée

**Problème** : Passer directement le GCIH ou GCFA sans bases solides mène à l'échec et au découragement. Le coût d'un échec GIAC est élevé (~2400 EUR perdus).

**Solution** : Suivre la progression recommandée. CySA+ ou BTL1 d'abord pour valider les fondamentaux. Les certifications GIAC ensuite, avec au moins 6 mois d'expérience pratique entre chaque niveau.

### Piège 2 : Se préparer uniquement avec des QCM

**Problème** : Mémoriser des réponses QCM sans comprendre les concepts ne fonctionne pas pour les certifications pratiques (BTL1) ni pour les examens GIAC (questions techniques profondes).

**Solution** : Combiner théorie et pratique. Pour chaque concept étudié, réaliser un lab pratique correspondant. Les challenges CyberDefenders et TryHackMe sont indispensables.

### Piège 3 : Sous-estimer le temps de préparation de l'index GIAC

**Problème** : Un index mal préparé est inutile pendant l'examen. L'étudiant perd du temps à chercher et ne trouve pas les réponses.

**Solution** : Commencer l'index dès le premier jour d'étude. Ajouter chaque concept au fur et à mesure. Tester l'index régulièrement en simulant des recherches chronométrées. Prévoir 30-40 heures dédiées à la création et au test de l'index.

### Piège 4 : Ignorer le rapport dans l'examen BTL1

**Problème** : L'étudiant passe 20 heures sur l'investigation technique et bâclé le rapport en 4 heures. Le rapport est noté et un rapport incomplet fait échouer l'examen.

**Solution** : Rédiger le rapport au fil de l'investigation. Pour chaque découverte technique, ajouter immédiatement une section au rapport avec captures d'écran et explications. Garder au minimum 4-6 heures pour la mise en forme finale.

---

## Checklist de Validation

- [ ] J'ai évalué mon niveau actuel avec l'auto-évaluation par domaine
- [ ] J'ai choisi ma première certification cible avec un planning de préparation
- [ ] Je connais le format d'examen de chaque certification (QCM, lab, open book)
- [ ] Je connais les domaines couverts par CySA+ et leur poids respectif
- [ ] Je sais expliquer pourquoi BTL1 est recommandé comme premier examen pratique
- [ ] Je connais les certifications GIAC défensives et leurs spécialisations
- [ ] Je sais comment construire un index papier pour un examen GIAC
- [ ] J'ai identifié les ressources de préparation (livres, labs, vidéos) pour ma certification cible
- [ ] J'ai un planning réaliste sur 18-24 mois pour mon parcours de certifications
- [ ] Je connais les stratégies d'examen pour chaque type de certification

---

## Exercice Pratique

**Énoncé** : Tu es analyste SOC depuis 8 mois dans une entreprise qui utilise Splunk comme SIEM et Microsoft Defender comme EDR. Tu veux faire évoluer ta carrière vers un rôle de DFIR Analyst. Ton budget annuel de formation est de 5000 EUR.

Réalise les tâches suivantes :

1. Évalue ton niveau actuel avec l'auto-évaluation par domaine
2. Choisis les 2-3 certifications à passer dans les 18 prochains mois
3. Crée un planning mensuel détaillé (certification, heures/semaine, ressources)
4. Calcule le budget total et vérifie qu'il rentre dans les 5000 EUR/an
5. Identifie les ressources gratuites et payantes pour chaque certification
6. Planifie 3 milestones intermédiaires avec des critères de validation

**Indications** :

- Ton expérience Splunk est un atout : considère la certification Splunk en complément
- Avec 8 mois d'expérience SOC, BTL1 est atteignable
- Pour le DFIR, le parcours BTL1 puis GCIH est optimal
- Le budget de 5000 EUR/an limite les options GIAC (exam seul, pas le cours)

**Résultat attendu** : Un plan de développement professionnel complet avec planning, budget et ressources.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```text
=== PLAN DE DÉVELOPPEMENT PROFESSIONNEL ===

Profil : Analyste SOC, 8 mois d'expérience, Splunk + Defender
Objectif : DFIR Analyst
Budget : 5000 EUR/an (10000 EUR sur 18 mois)

AUTO-ÉVALUATION (exemple) :
Analyse de logs/SIEM : 3/5 (expérience Splunk quotidienne)
Forensique : 2/5 (bases théoriques, peu de pratique)
Réponse aux incidents : 2/5 (participation à quelques incidents)
Threat Intelligence : 2/5 (utilisation basique de MITRE)
Moyenne : 2.25/5 → Recommandation : BTL1

CERTIFICATIONS RETENUES (18 mois) :
1. Splunk Core Certified User (mois 1-2) - 130 EUR
2. BTL1 (mois 3-7) - ~470 EUR (400 GBP)
3. GCIH exam only (mois 10-14) - 2400 EUR
Total : ~3000 EUR (dans le budget)

PLANNING :
Mois 1-2 : Splunk Certified User
  - 5h/semaine
  - Ressources : Splunk Fundamentals 1 (gratuit), BOTS
  - Milestone 1 : Score > 85% au practice exam

Mois 3-7 : BTL1
  - 10h/semaine
  - Ressources : Cours BTL1 inclus, CyberDefenders, MemLabs
  - Milestone 2 : 10 challenges forensiques complétés

Mois 8-9 : Pause pratique
  - CTF Blue Team, CyberDefenders avancés
  - Rédaction de 3 write-ups d'investigation

Mois 10-14 : GCIH (auto-formation + exam)
  - 15h/semaine
  - Ressources : livre GCIH, labs TryHackMe, index papier
  - Milestone 3 : Score > 80% aux 2 practice exams GIAC

BUDGET DÉTAILLÉ :
Splunk User :        130 EUR
BTL1 (cours+exam) :  470 EUR
GCIH (exam only) :  2400 EUR
Livres/ressources :  200 EUR
Total :             3200 EUR (budget respecté)

RESSOURCES GRATUITES :
- TryHackMe (rooms gratuites)
- CyberDefenders (challenges gratuits)
- Professor Messer YouTube
- Splunk Fundamentals 1
- 13Cubed YouTube (forensique)
- SANS webcasts (gratuits)
- Malware Traffic Analysis (PCAPs gratuits)
```

---

## Navigation

← Fiche précédente : **[04 - Sécurité du Endpoint (EDR/XDR)](04-securite-endpoint.md)**
