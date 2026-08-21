---
tags:
  - Cybersécurité
  - Avancé
  - Concept
description: "Labs et parcours de pratique offensive : pentest, exploitation, web et Active Directory"
estimated_time: "45 min"
fiche_number: 5
total_fiches: 5
cursus: "Phase 4 - Spécialisation Offensive"
id: "security.cybersecurity.offensive.parcours-pratique-offensive"
course_id: "security.cybersecurity"
module_id: "security.cybersecurity.offensive"
content_type: "lesson"
order: 5
---

# 05 - Parcours de pratique offensive

> **En bref** : À la fin de cette fiche, tu sauras choisir un parcours de labs offensifs adapté à ton niveau, structurer un plan de pratique de 3 à 6 mois, et relier les compétences déjà vues (pentest, AD, web) à des exercices réalistes. Lecture estimée : 45 min.

!!! note "Limite honnête"
    Cette fiche est un **repère pédagogique** pour t'orienter. Elle n'est **pas** une formation officielle OffSec, CompTIA, TCM Security, Altered Security ou GIAC. Les formats, prix et règles d'examen évoluent : vérifie toujours les pages officielles avant de t'inscrire. Lire ce wiki ne garantit pas la réussite d'un examen ni un titre professionnel.

## Prérequis

- [01 - Méthodologie de Pentest](01-methodologie-pentest.md) (cette phase)
- [02 - Exploitation et Post-Exploitation](02-exploitation-post-exploitation.md) (cette phase)
- [03 - Active Directory - Attaque et Sécurisation](03-active-directory.md) (cette phase)
- [04 - Sécurité Web Avancée](04-securite-web-avancee.md) (cette phase)
- Expérience pratique sur des plateformes de lab (Hack The Box, TryHackMe, Proving Grounds)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras choisir un parcours de labs offensifs adapté à ton niveau, structurer un plan de pratique de 3 à 6 mois, et relier les compétences déjà vues (pentest, AD, web) à des exercices réalistes.

---

## Concepts

### Qu'est-ce qu'un parcours de pratique offensive ?

**Définition** : Un parcours de pratique offensive est un enchaînement de labs et d'exercices qui entraîne les compétences de test d'intrusion : compromission de systèmes, post-exploitation, Active Directory et sécurité web, dans un temps limité.

**Le problème que les certifications offensives résolvent** :

Sans certification, voici les problèmes rencontrés :

1. **Crédibilité professionnelle** : Les employeurs et les clients ne peuvent pas évaluer objectivement les compétences d'un pentester sans référence standardisée.
2. **Lacunes non identifiées** : Sans parcours structuré, un autodidacte peut avoir des compétences solides dans certains domaines mais des lacunes critiques dans d'autres.
3. **Accès au marché** : De nombreuses offres d'emploi en pentest exigent explicitement une certification (OSCP en tête).

**Comment les certifications offensives résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Crédibilité professionnelle | La certification est reconnue mondialement et prouve des compétences pratiques vérifiées par un examen |
| Lacunes non identifiées | Le cursus de préparation couvre tous les domaines nécessaires de manière structurée |
| Accès au marché | La certification ouvre les portes des postes de pentester junior et senior |

**Analogie concrète** : Les certifications offensives sont comme le permis de conduire. Tu peux savoir conduire sans permis (compétences autodidactes), mais le permis prouve à un employeur, un assureur ou un client que tu as passé un examen standardisé qui couvre tous les aspects de la conduite (théorie et pratique). Sans permis, tu ne peux pas conduire professionnellement (transport, livraison), même si tu conduis bien.

**Ce qu'une certification n'est PAS** :

- Une certification n'est pas une garantie de compétence absolue. Un certifié OSCP peut avoir des faiblesses dans des domaines non couverts par l'examen. La certification valide un niveau minimal de compétence dans un périmètre défini.
- Une certification n'est pas suffisante sans expérience. Les employeurs cherchent la combinaison certification + expérience pratique. La certification seule ne remplace pas des mois de pratique sur des labs.
- Une certification n'est pas permanente pour certaines (CompTIA PenTest+ nécessite un renouvellement tous les 3 ans). Depuis novembre 2024, l'examen PEN-200 délivre **OSCP** (durée de vie indéfinie) et **OSCP+** (valide 3 ans, renouvelable via CPE OffSec, recertification ou un autre examen OffSec éligible). Si l'OSCP+ expire, le titre OSCP de base est en principe conservé. Vérifie toujours les règles en vigueur sur le site OffSec.

---

### Quel est le parcours recommandé ?

**Parcours progressif** :

```text
Niveau 1 (Fondamentaux)
├── CompTIA PenTest+ (PT0-003)
│   └── Valide les bases du pentest et de la méthodologie
│
Niveau 2 (Professionnel)
├── PNPT (Practical Network Penetration Tester)
│   └── Alternative accessible avant l'OSCP
├── OSCP+ (PEN-200)
│   └── Standard de l'industrie, le plus demandé
│
Niveau 3 (Spécialisation)
├── OSWE (WEB-300) - Spécialisation web
│   └── Exploitation web avancée, revue de code
├── CRTP / CRTE - Spécialisation Active Directory
│   └── Attaque AD en profondeur
├── OSEP (PEN-300) - Spécialisation évasion
│   └── Bypass EDR, AMSI, exploitation AD complexe
│
Niveau 4 (Expert)
├── OSED (EXP-301) - Développement d'exploits
├── OSEE (EXP-401) - Exploitation avancée
└── GXPN (GIAC) - Expert en pentest
```

**Comparaison des certifications principales** :

| Certification | Organisme | Durée examen | Format | Difficulté | Prix (approx.) |
| ------------- | --------- | ------------ | ------ | ---------- | --------------- |
| CompTIA PenTest+ | CompTIA | 2h45 | QCM + simulations | Moyenne | 370 EUR |
| PNPT | TCM Security | 5 jours | Pratique + rapport | Moyenne-haute | 400 USD |
| OSCP+ (PEN-200) | OffSec | 23h45 + rapport | Pratique | Haute | 1 749 USD (90j lab) |
| OSWE (WEB-300) | OffSec | 47h45 + rapport | Pratique | Très haute | 1 749 USD (90j lab) |
| OSEP (PEN-300) | OffSec | 47h45 + rapport | Pratique | Très haute | 1 749 USD (90j lab) |
| CRTP | Altered Security | 24h | Pratique | Haute | 249 USD |
| CRTE | Altered Security | 48h | Pratique | Très haute | 299 USD |
| GPEN | GIAC/SANS | 3h | QCM (open book) | Moyenne-haute | 2 499 USD (avec formation) |

---

### Qu'est-ce que l'OSCP+ (PEN-200) ?

**Définition** : L'OSCP / OSCP+ (Offensive Security Certified Professional) est l'une des certifications de pentest les plus demandées dans l'industrie, délivrée par OffSec (anciennement Offensive Security). L'examen pratique de 23h45 (PEN-200) exige la compromission de machines dans un environnement contrôlé. Depuis novembre 2024, la réussite de l'examen délivre en principe **OSCP** (sans expiration) et **OSCP+** (valide 3 ans).

**Format de l'examen OSCP+** :

| Aspect | Détail |
| ------ | ------ |
| Durée | 23 heures 45 minutes de pratique + 24 heures pour le rapport |
| Environnement | Réseau de machines virtuelles (Windows et Linux) |
| Objectif | Obtenir au moins 70 points sur 100 |
| Machines standalone | 3 machines indépendantes (60 points au total : 20 chacune, 10 pour l'accès initial, 10 pour l'élévation de privilèges) |
| Ensemble Active Directory | 1 set AD de 3 machines (40 points : 10 + 10 + 20). Points partiels possibles depuis le 1er novembre 2024. Compromission assumée : OffSec fournit un nom d'utilisateur et un mot de passe de départ |
| Points bonus | Aucun depuis le 1er novembre 2024. Les exercices du cours et les 30 machines du lab restent recommandés pour l'entraînement, mais ils n'ajoutent plus de points à l'examen |
| Rapport | Obligatoire, documenter chaque étape avec captures d'écran |
| Outils autorisés | Tous sauf les outils d'exploitation automatique commerciaux (pas de Cobalt Strike, pas de sqlmap en mode automatique sur l'AD) |
| Interdictions | Pas de spoilers, pas d'outils automatisés de scan d'AD (BloodHound autorisé), pas de métasploit/meterpreter sauf sur 1 machine |

**Domaines couverts par le PEN-200** :

| Module | Contenu |
| ------ | ------- |
| Reconnaissance | OSINT, scan de ports, énumération de services |
| Exploitation web | SQLi, XSS, LFI/RFI, command injection, upload |
| Exploitation système | Buffer overflow (Windows), exploitation de services |
| Élévation de privilèges | Linux (SUID, sudo, cron, kernel) et Windows (services, tokens, UAC) |
| Active Directory | Énumération, Kerberoasting, AS-REP, PtH, mouvement latéral |
| Post-exploitation | Pivoting, tunneling, file transfer |
| Rapport | Documentation professionnelle des findings |

**Préparation recommandée (3-6 mois)** :

| Phase | Durée | Activités |
| ----- | ----- | --------- |
| Mois 1 | 4 semaines | Lire le cours PEN-200, faire les exercices, commencer les labs |
| Mois 2 | 4 semaines | Compléter 30+ machines du lab OffSec (entraînement recommandé ; plus de points bonus à l'examen depuis novembre 2024) |
| Mois 3 | 4 semaines | Hack The Box : machines "Easy" et "Medium" (20+ machines) |
| Mois 4 | 4 semaines | Proving Grounds Practice : machines OSCP-like (20+ machines) |
| Mois 5 | 4 semaines | Révision des techniques faibles, pratique du buffer overflow, machines AD |
| Mois 6 | 4 semaines | Examens blancs (3-4), révision du rapport, prise de notes |

---

### Qu'est-ce que le PNPT ?

**Définition** : Le PNPT (Practical Network Penetration Tester) est une certification délivrée par TCM Security qui valide les compétences en pentest réseau dans un format pratique sur 5 jours, incluant un rapport professionnel et une débrief orale.

**Pourquoi le PNPT avant l'OSCP** :

| Aspect | PNPT | OSCP |
| ------ | ---- | ---- |
| Difficulté | Moyenne-haute | Haute |
| Durée de préparation | 2-3 mois | 3-6 mois |
| Coût | 400 USD | 1 749 USD |
| Format | 5 jours + rapport + débrief oral | 24h + rapport écrit |
| Reconnaissance | Croissante | Standard de l'industrie |
| Bon pour | Premier certificat pratique | Certification phare du CV |
| Contenu | Réseau, AD, OSINT, web basique | Réseau, AD, web, buffer overflow |

**Format de l'examen PNPT** :

| Aspect | Détail |
| ------ | ------ |
| Durée | 5 jours pour compromettre le réseau + 2 jours pour le rapport |
| Environnement | Réseau d'entreprise simulé avec Active Directory |
| Objectif | Partir de l'extérieur et devenir Domain Admin |
| Rapport | Rapport professionnel obligatoire |
| Débrief | Entretien oral de 15 minutes pour présenter les résultats |
| Outils | Tous les outils autorisés |

---

### Qu'est-ce que l'OSWE (WEB-300) ?

**Définition** : L'OSWE (Offensive Security Web Expert) est une certification avancée spécialisée dans l'exploitation web, la revue de code source et le développement d'exploits pour les applications web.

**Format de l'examen OSWE** :

| Aspect | Détail |
| ------ | ------ |
| Durée | 47 heures 45 minutes de pratique + 24 heures pour le rapport |
| Environnement | Applications web avec accès au code source |
| Objectif | Identifier les vulnérabilités dans le code, les exploiter et écrire des scripts d'exploitation |
| Langages | PHP, Java, JavaScript (Node.js), C#, Python |
| Compétences testées | Revue de code, exploitation de logique métier, chaînes d'exploitation, SQLi avancé, désérialisation |

**Différences avec l'OSCP** :

| Aspect | OSCP | OSWE |
| ------ | ---- | ---- |
| Focus | Pentest réseau et système | Exploitation web et revue de code |
| Accès au code | Non (black/grey box) | Oui (white box) |
| Durée examen | 24h | 48h |
| Programmation requise | Basique (Python, Bash) | Avancée (lire et écrire des exploits en plusieurs langages) |
| Exploitation mémoire | Oui (buffer overflow basique) | Non |
| Active Directory | Oui | Non |

---

### Qu'est-ce que l'OSEP (PEN-300) ?

**Définition** : L'OSEP (Offensive Security Experienced Penetration Tester) est une certification avancée qui couvre l'évasion des défenses (EDR, AMSI, antivirus), l'exploitation avancée d'Active Directory et les techniques de Red Team.

**Format de l'examen OSEP** :

| Aspect | Détail |
| ------ | ------ |
| Durée | 47 heures 45 minutes de pratique + 24 heures pour le rapport |
| Environnement | Réseau d'entreprise avec défenses actives (EDR, AV, AppLocker) |
| Objectif | Compromettre l'environnement en contournant les défenses |
| Secret flag | Trouver le fichier `secret.txt` sur le DC ou un objectif final |

**Domaines couverts par le PEN-300** :

| Module | Contenu |
| ------ | ------- |
| Évasion AV/EDR | Techniques pour contourner les antivirus et EDR modernes |
| AMSI bypass | Contournement de l'Antimalware Scan Interface de Windows |
| AppLocker bypass | Contournement des politiques de restriction applicative |
| Développement C# | Écriture de payloads personnalisés en C# (.NET) |
| Active Directory avancé | Délégation abuse, forest trusts, SID history, ACL abuse |
| Mouvement latéral avancé | Techniques furtives de mouvement latéral |
| Process injection | Injection de code dans des processus légitimes |
| Lateral movement via MSSQL | Exploitation de liens MSSQL pour le mouvement latéral |

---

### Qu'est-ce que le CRTP / CRTE ?

**Définition** : Le CRTP (Certified Red Team Professional) et le CRTE (Certified Red Team Expert) sont des certifications d'Altered Security (anciennement Pentester Academy) spécialisées exclusivement dans l'attaque d'Active Directory.

**Comparaison CRTP vs CRTE** :

| Aspect | CRTP | CRTE |
| ------ | ---- | ---- |
| Niveau | Intermédiaire | Avancé |
| Durée examen | 24 heures | 48 heures |
| Environnement | 1 forêt AD | Multi-forêt AD |
| Attaques couvertes | Kerberoasting, PtH, Golden Ticket, DCSync | Forest trusts, SID History, délégation abuse, ACL chains |
| Prix | 249 USD | 299 USD |
| Prérequis recommandé | Bases AD (cette fiche) | CRTP |
| Outils | PowerView, Rubeus, Mimikatz | BloodHound, PowerView, Rubeus, Mimikatz, ADModule |

**Pourquoi le CRTP est un excellent complément** :

Le CRTP se concentre uniquement sur Active Directory, couvrant les attaques en profondeur. Il complète parfaitement l'OSCP (qui couvre l'AD de manière plus superficielle) et coûte beaucoup moins cher. C'est souvent le premier certificat AD que passent les pentesters.

---

## Étapes Pratiques

### Étape 1 : Évaluer ton niveau actuel

Avant de choisir une certification, évalue honnêtement tes compétences. Pour chaque domaine, note ton niveau de 1 (débutant) à 5 (expert) :

```text
=== AUTO-ÉVALUATION ===

RECONNAISSANCE ET ÉNUMÉRATION
[ ] OSINT (whois, theHarvester, Google Dorks)          : _/5
[ ] Scan de ports (nmap, scripts NSE)                   : _/5
[ ] Énumération web (gobuster, ffuf, nikto)             : _/5
[ ] Énumération SMB/LDAP/RPC                            : _/5

EXPLOITATION
[ ] Exploitation web (SQLi, XSS, LFI, upload)          : _/5
[ ] Metasploit (modules, payloads, sessions)            : _/5
[ ] Buffer overflow basique (stack-based, Windows)      : _/5
[ ] Exploitation manuelle (scripts Python, curl)        : _/5

ÉLÉVATION DE PRIVILÈGES
[ ] Linux (SUID, sudo, cron, capabilities, kernel)     : _/5
[ ] Windows (services, tokens, UAC, SeImpersonate)     : _/5

ACTIVE DIRECTORY
[ ] Énumération (BloodHound, PowerView)                 : _/5
[ ] Kerberoasting / AS-REP Roasting                     : _/5
[ ] Pass-the-Hash / Pass-the-Ticket                     : _/5
[ ] Golden/Silver Ticket, DCSync                        : _/5
[ ] Mouvement latéral (PsExec, WMI, WinRM)             : _/5

POST-EXPLOITATION
[ ] Pivoting et tunneling (Chisel, Ligolo, SSH)         : _/5
[ ] Persistence (Linux et Windows)                      : _/5
[ ] Credential harvesting (Mimikatz, SAM)               : _/5

REPORTING
[ ] Documentation structurée des findings               : _/5
[ ] Executive summary                                   : _/5

SCORE TOTAL : _/100
```

**Résultat attendu** :

```text
Interprétation du score :
- 20-40/100 : Commence par CompTIA PenTest+ ou continue la pratique sur TryHackMe
- 40-60/100 : Prêt pour le PNPT ou le CRTP
- 60-80/100 : Prêt pour l'OSCP
- 80+/100   : Prêt pour l'OSWE ou l'OSEP
```

---

### Étape 2 : Planifier la préparation OSCP (3-6 mois)

```text
=== PLANNING DE PRÉPARATION OSCP ===

MOIS 1 : COURS ET EXERCICES
Semaine 1-2 : Modules 1-8 (reconnaissance, web, système)
- Lire chaque module du cours PEN-200
- Faire TOUS les exercices (entraînement recommandé ; plus de points bonus à l'examen depuis novembre 2024)
- Prendre des notes structurées (CherryTree ou Obsidian)

Semaine 3-4 : Modules 9-16 (exploitation, privesc, AD)
- Compléter les exercices
- Commencer les machines du lab OffSec

MOIS 2 : LAB OFFSEC
Semaine 5-8 : Machines du lab
- Objectif : 30+ machines (entraînement recommandé ; plus de points bonus à l'examen depuis novembre 2024)
- Commencer par les machines "Easy" puis "Medium"
- Documenter chaque machine avec la méthodologie complète
- Si bloqué > 2h sur une machine, consulter les forums OffSec

MOIS 3 : HACK THE BOX
Semaine 9-12 : Machines HTB retired
- Faire 20+ machines Easy/Medium
- Priorité : machines avec des techniques OSCP (web, privesc, pivoting)
- Machines recommandées : Lame, Legacy, Blue, Optimum, Bashed, Nibbles,
  Beep, Cronos, Shocker, Nineveh, Sense, Solidstate, Node, Valentine,
  Poison, Sunday, Irked, FriendZone, SwagShop

MOIS 4 : PROVING GROUNDS
Semaine 13-16 : Machines PG Practice
- Faire 20+ machines (Play et Practice)
- Ces machines sont les plus proches du format OSCP
- Priorité aux machines Windows et aux sets AD

MOIS 5 : RÉVISION ET RENFORCEMENT
Semaine 17-20 : Combler les lacunes
- Identifier tes 3 points faibles (auto-évaluation)
- Pratiquer spécifiquement ces domaines
- Réviser le buffer overflow (doit être automatique)
- Pratiquer les machines AD complètes

MOIS 6 : EXAMENS BLANCS
Semaine 21-24 : Simulation d'examen
- Faire 3-4 examens blancs de 24h
  (choisir 4 machines au hasard + 1 set AD sur PG/HTB)
- Chronométrer : 24h maximum
- Rédiger le rapport complet à chaque fois
- Ajuster ta méthodologie en fonction des résultats
```

**Résultat attendu** :

```text
À la fin des 6 mois, tu dois pouvoir :
- Compromettre une machine Easy en < 1h
- Compromettre une machine Medium en < 2h
- Compromettre un set AD complet en < 4h
- Rédiger un rapport complet en < 4h
- Buffer overflow automatique en < 30min (si présent)
```

---

### Étape 3 : Structurer tes notes pour l'examen

```text
=== STRUCTURE DES NOTES ===

Utilise CherryTree, Obsidian ou un wiki personnel avec cette structure :

notes/
├── 01-enumeration/
│   ├── nmap-cheatsheet.md
│   ├── web-enumeration.md
│   ├── smb-enumeration.md
│   ├── ldap-enumeration.md
│   └── dns-enumeration.md
├── 02-exploitation/
│   ├── web-attacks/
│   │   ├── sqli.md
│   │   ├── xss.md
│   │   ├── lfi-rfi.md
│   │   ├── file-upload.md
│   │   └── command-injection.md
│   ├── buffer-overflow.md
│   └── metasploit-cheatsheet.md
├── 03-privesc/
│   ├── linux-privesc.md
│   └── windows-privesc.md
├── 04-active-directory/
│   ├── enumeration.md
│   ├── kerberos-attacks.md
│   ├── lateral-movement.md
│   └── persistence.md
├── 05-pivoting/
│   ├── chisel.md
│   ├── ligolo-ng.md
│   └── ssh-tunneling.md
├── 06-file-transfer/
│   ├── linux-transfer.md
│   └── windows-transfer.md
├── 07-shells/
│   ├── reverse-shells.md
│   └── shell-stabilization.md
└── 08-reporting/
    ├── template-finding.md
    └── template-report.md
```

Pour chaque technique, note les informations suivantes :

```text
=== TEMPLATE DE NOTE ===

TECHNIQUE : [Nom]
QUAND L'UTILISER : [Contexte]
PRÉREQUIS : [Ce qu'il faut avoir avant]

COMMANDES :
[Commande 1 avec explication]
[Commande 2 avec explication]

VARIANTES :
[Variante pour des cas particuliers]

PIÈGES :
[Erreurs courantes et solutions]

EXEMPLE CONCRET :
[Copier-coller d'un cas réel sur un lab]
```

**Résultat attendu** :

```text
Des notes complètes et facilement consultables pendant l'examen.
Tu dois pouvoir trouver n'importe quelle commande en < 30 secondes.
```

---

### Étape 4 : Simuler un examen OSCP

```bash
# === Préparer l'environnement ===
# Choisir 3 machines standalone + 1 set AD sur Proving Grounds ou HTB
# Exemples de sets :
# - PG : Nickel (Windows) + Peppo (Linux) + Hunit (Linux) + set AD "Heist"
# - HTB : Active (AD) + Bashed (Linux) + Optimum (Windows) + Irked (Linux)

# === Chronométrage ===
# Démarrer un timer de 24h (23h45 exactement)
# Allocation recommandée :
# - Set AD : 6-8h (40 points partiels : 10 + 10 + 20 ; identifiants de départ fournis)
# - Machine 1 : 3-4h (20 points)
# - Machine 2 : 3-4h (20 points)
# - Machine 3 : 3-4h (20 points)
# - Pauses : 2-3h (manger, dormir 2h si nécessaire)

# === Méthodologie par machine ===
# 1. Scan initial (5 min)
nmap -sC -sV -oA initial TARGET

# 2. Scan complet en arrière-plan
nmap -p- -oA full TARGET

# 3. Énumérer les services découverts (30-60 min)
# HTTP -> gobuster/ffuf, nikto, exploration manuelle
# SMB -> enum4linux-ng, smbclient
# Autres -> scripts NSE spécifiques

# 4. Identifier le vecteur d'exploitation (variable)
# 5. Exploiter et obtenir l'accès initial (variable)
# 6. Énumérer pour l'élévation de privilèges (30 min)
# 7. Élever les privilèges (variable)
# 8. Capturer les flags (proof.txt / local.txt)
# 9. DOCUMENTER CHAQUE ÉTAPE (en continu)
```

**Résultat attendu** :

```text
Score simulé : ≥ 70/100 pour considérer que tu es prêt

Exemple de résultat :
- Set AD : 40/40 (compromis en 5h)
- Machine 1 (Linux Easy) : 20/20 (compromis en 1h30)
- Machine 2 (Windows Medium) : 20/20 (compromis en 3h)
- Machine 3 (Linux Medium) : 10/20 (accès initial mais pas de privesc)
- Total : 90/100 -> RÉUSSI
```

---

### Étape 5 : Rédiger le rapport d'examen

```text
=== TEMPLATE DE RAPPORT OSCP ===

1. INFORMATIONS GÉNÉRALES
- Candidat : [Ton nom]
- OS ID : [Numéro fourni par OffSec]
- Date de l'examen : [Date]

2. MÉTHODOLOGIE
- Outils utilisés
- Approche générale

3. MACHINE 1 : [Nom/IP]
   3.1 Service Enumeration
       [Sortie nmap complète]
       [Captures d'écran de l'énumération]

   3.2 Initial Access
       [Description de la vulnérabilité]
       [Commandes exactes utilisées]
       [Capture d'écran du shell obtenu]
       [Capture du fichier local.txt avec la commande hostname && whoami && type local.txt]

   3.3 Privilege Escalation
       [Description du vecteur]
       [Commandes exactes]
       [Capture d'écran du shell root/SYSTEM]
       [Capture du fichier proof.txt avec la commande hostname && whoami && type proof.txt]

4. MACHINE 2 : [Nom/IP]
   [Même structure]

5. MACHINE 3 : [Nom/IP]
   [Même structure]

6. SET ACTIVE DIRECTORY
   6.1 Énumération du domaine
   6.2 Compromission Machine 1 (client)
   6.3 Mouvement latéral vers Machine 2 (serveur)
   6.4 Compromission du Domain Controller
   [Capture de proof.txt sur chaque machine]
```

**Points critiques pour le rapport** :

| Règle | Pourquoi |
| ----- | -------- |
| Capture d'écran de chaque flag avec `hostname && whoami && cat proof.txt` | OffSec vérifie que le flag correspond à la bonne machine |
| Commandes exactes et reproductibles | L'examinateur doit pouvoir reproduire chaque étape |
| Pas de capture d'écran de Metasploit sauf pour 1 machine | Metasploit/Meterpreter ne sont autorisés que sur 1 machine standalone |
| Rapport en PDF ou docx | Format requis par OffSec |

---

### Étape 6 : Ressources de préparation par certification

```text
=== RESSOURCES OSCP ===

Cours officiels :
- PEN-200 (inclus avec l'inscription) : cours PDF + vidéos + lab

Plateformes de pratique :
- Proving Grounds Practice (même éditeur qu'OSCP) : le plus proche de l'examen
- Hack The Box : machines "TJ Null's OSCP list" (liste de machines recommandées)
- TryHackMe : parcours "Offensive Pentesting"
- VulnHub : machines téléchargeables pour entraînement offline

Chaînes YouTube (complémentaires, pas de spoilers d'examen) :
- IppSec : walkthroughs HTB détaillés
- John Hammond : techniques de pentest variées
- The Cyber Mentor : cours TCM Academy

=== RESSOURCES PNPT ===

Cours officiels (TCM Academy) :
- Practical Ethical Hacking
- Linux Privilege Escalation
- Windows Privilege Escalation
- Movement, Pivoting and Persistence
- External Pentest Playbook

=== RESSOURCES CRTP ===

Cours officiel :
- Attacking and Defending Active Directory (Altered Security)

Compléments :
- Hack The Box : machines AD (Active, Forest, Cascade, Sauna, Blackfield)
- Livre : "Active Directory Attacks" de Yassine Oukhouya

=== RESSOURCES OSWE ===

Cours officiel :
- WEB-300 (inclus avec l'inscription)

Compléments :
- PortSwigger Web Security Academy (gratuit)
- Hack The Box : machines web avancées
- OWASP WebGoat
- Livre : "The Web Application Hacker's Handbook"
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `nmap -sC -sV -oA scan target` | Scan initial de reconnaissance |
| `gobuster dir -u URL -w wordlist` | Énumération de répertoires |
| `ffuf -u URL/FUZZ -w wordlist` | Fuzzing rapide |
| `searchsploit service version` | Chercher des exploits connus |
| `msfvenom -p payload LHOST=IP LPORT=PORT -f format -o file` | Générer un payload |
| `chisel server --reverse --port 8080` | Serveur de pivoting |
| `proxychains nmap -sT -Pn target` | Scan à travers un tunnel |
| `impacket-GetUserSPNs domain/user:pass -dc-ip IP` | Kerberoasting |
| `netexec smb CIDR -u user -p pass` | Test d'identifiants sur le réseau (ex-CrackMapExec / nxc) |
| `evil-winrm -i IP -u user -p pass` | Shell WinRM |

---

## Pièges Fréquents

### Piège 1 : Se lancer dans l'OSCP trop tôt

**Problème** : Tu achètes le PEN-200 sans avoir pratiqué sur des labs gratuits. Tu trouves le cours difficile, tu n'arrives pas à compromettre les machines du lab et tu gaspilles tes 90 jours d'accès.

**Solution** : Avant d'acheter l'OSCP, compromets au moins 20 machines sur TryHackMe ou Hack The Box (machines Easy et Medium). Si tu arrives à les résoudre avec l'aide des writeups (en essayant d'abord seul pendant 2h), tu es prêt pour le PEN-200.

---

### Piège 2 : Négliger la prise de notes

**Problème** : Tu fais 50 machines sur HTB mais tu ne notes rien. Le jour de l'examen, tu ne te souviens plus de la commande exacte pour un transfert de fichiers Windows ou un tunnel Chisel.

**Solution** : Crée un système de notes _dès le premier jour_. Pour chaque technique apprise, note la commande exacte, le contexte d'utilisation et un exemple concret. Pendant l'examen, tes notes sont ta ressource principale.

---

### Piège 3 : Passer trop de temps sur une machine

**Problème** : Tu bloques 8h sur une machine pendant l'examen. Même si tu la résous, tu n'as plus le temps pour les autres et tu échoues.

**Solution** : Fixe un timer par machine. Si tu n'as pas d'accès initial après 2h, passe à la suivante. Reviens-y plus tard avec un regard neuf. La gestion du temps est aussi importante que les compétences techniques.

---

### Piège 4 : Oublier de capturer les preuves

**Problème** : Tu compromets 4 machines mais tu oublies de faire les captures d'écran avec `hostname && whoami && cat proof.txt`. Sans preuve, OffSec ne valide pas les points.

**Solution** : Dès que tu obtiens un shell, _avant toute autre action_, capture le flag. Prends une capture d'écran avec la commande complète et la sortie. Vérifie que l'adresse IP de la machine est visible.

---

### Piège 5 : Ne pas préparer le rapport à l'avance

**Problème** : Tu finis l'examen pratique à 3h du matin. Tu as 24h pour le rapport mais tu es épuisé. Tu bâclés le rapport et tu perds des points.

**Solution** : Prépare ton template de rapport _avant_ l'examen. Pendant l'examen, prends des notes et des captures d'écran au fur et à mesure. Le rapport final sera un assemblage de tes notes, pas une rédaction depuis zéro.

---

## Checklist de Validation

- [ ] J'ai évalué mon niveau avec l'auto-évaluation
- [ ] J'ai choisi la certification adaptée à mon niveau et mes objectifs
- [ ] J'ai un planning de préparation de 3-6 mois
- [ ] J'ai un système de prise de notes structuré
- [ ] J'ai compromis au moins 20 machines sur des plateformes de lab
- [ ] Je connais le format exact de l'examen ciblé (durée, scoring, restrictions)
- [ ] J'ai fait au moins 2 examens blancs chronométrés
- [ ] J'ai un template de rapport prêt
- [ ] Je sais gérer mon temps pendant l'examen (timer par machine)
- [ ] Je connais les erreurs courantes et comment les éviter

---

## Exercice Pratique

**Énoncé** : Prépare un plan de préparation personnalisé pour ta prochaine certification offensive.

**Tâches** :

1. Complète l'auto-évaluation de l'étape 1 honnêtement
2. En fonction de ton score, identifie la certification la plus adaptée
3. Crée un planning de préparation semaine par semaine (minimum 12 semaines)
4. Identifie 30 machines de lab à compromettre (avec les plateformes correspondantes)
5. Crée ton système de notes avec la structure proposée
6. Planifie 3 examens blancs à des dates précises
7. Prépare ton template de rapport

**Indications** :

- Sois honnête dans l'auto-évaluation. Sous-estimer tes lacunes te coûtera du temps et de l'argent
- Prévois du temps pour les imprévus (vacances, obligations professionnelles)
- Inclus au moins 2h de pratique par jour en semaine et 4-6h le week-end
- Priorise la pratique (labs) sur la théorie (vidéos, lectures) dans un ratio 70/30

**Résultat attendu** : Un document contenant l'auto-évaluation, le choix de certification justifié, le planning détaillé, la liste des machines de lab et le template de rapport.

---

## Solution de l'Exercice

> **Note** : Cette section contient un exemple de solution. Adapte-la à ta situation personnelle.

---

**1. Auto-évaluation (exemple)** :

```text
RECONNAISSANCE : 3/5 (solide sur nmap et web, faible sur LDAP/RPC)
EXPLOITATION : 2/5 (web basique OK, buffer overflow pas maîtrisé)
PRIVESC LINUX : 3/5 (SUID et sudo OK, kernel exploits à travailler)
PRIVESC WINDOWS : 2/5 (théorie OK, pratique insuffisante)
ACTIVE DIRECTORY : 2/5 (Kerberoasting OK, reste théorique)
POST-EXPLOITATION : 1/5 (pivoting non pratiqué)
REPORTING : 3/5 (expérience de rédaction, pas de template)

SCORE TOTAL : 45/100
-> Recommandation : PNPT d'abord, puis OSCP dans 6-9 mois
```

**2. Choix : PNPT** :

```text
Justification :
- Score de 45/100 : entre le seuil PNPT (40) et OSCP (60)
- Lacunes en AD et pivoting : le PNPT couvre ces domaines
- Budget limité : 400 USD vs 1 749 USD pour l'OSCP
- Le PNPT servira de validation avant d'investir dans l'OSCP
```

**3. Planning (12 semaines)** :

```text
Semaines 1-3 : Cours TCM Academy
- Practical Ethical Hacking (30h)
- Prendre des notes structurées

Semaines 4-6 : Pratique Linux
- 10 machines Linux Easy/Medium sur HTB
- Linux PrivEsc course (TCM)
- Focus : SUID, sudo, cron, kernel

Semaines 7-9 : Pratique Windows + AD
- 10 machines Windows Easy/Medium sur HTB
- Windows PrivEsc course (TCM)
- 5 machines AD sur HTB (Active, Forest, Cascade, Sauna, Resolute)

Semaines 10-11 : Pivoting + Post-exploitation
- Movement, Pivoting and Persistence course (TCM)
- Pratique avec Chisel et Ligolo-ng sur des labs

Semaine 12 : Examen blanc + Passage de l'examen
- Examen blanc de 5 jours
- Passage de l'examen PNPT
```

**4. Liste de 30 machines** :

```text
HTB Easy (10) : Lame, Legacy, Blue, Optimum, Bashed, Nibbles, Beep, Shocker, Irked, SwagShop
HTB Medium (10) : Cronos, Nineveh, Solidstate, Valentine, Poison, Sunday, FriendZone, Active, Forest, Cascade
PG Play (5) : Potato, InfosecPrep, Blogger, FunboxEasyEnum, Stapler
PG Practice (5) : Nickel, Hunit, Peppo, DVR4, Slort
```

---

## Navigation

← Fiche précédente : **[04 - Sécurité Web Avancée](04-securite-web-avancee.md)**
