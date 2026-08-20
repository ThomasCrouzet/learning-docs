---
tags:
  - Cybersécurité
  - Expert
  - Pratique
description: "Publication de CVE, CTF compétitifs, bug bounty, conférences, contribution open-source, mentorat"
estimated_time: "50 min"
fiche_number: 3
total_fiches: 4
cursus: "Phase 8 - Expertise et Leadership"
---

# 03 - Recherche en Sécurité et Contribution Communautaire

> **En bref** : À la fin de cette fiche, tu sauras publier un CVE via le processus de responsible disclosure, participer à des CTF compétitifs, contribuer à des programmes de bug bounty, rédiger des write-ups techniques, contribuer à des projets open-source de sécurité, et préparer des interventions en conférence. Lecture estimée : 50 min.


## Prérequis

- Au moins une spécialisation complète : [Phase 4 - Spécialisation offensive](../04-specialisation-offensive/index.md) ou [Phase 5 - Spécialisation défensive](../05-specialisation-defensive/index.md)
- Maîtrise d'un langage de scripting (Python, Bash) pour l'automatisation
- Connaissance des vulnérabilités courantes (OWASP Top 10, CWE Top 25)
- Compréhension du fonctionnement des CVE et des bases de vulnérabilités ([Phase 3 - Compétences intermédiaires](../03-competences-intermediaires/index.md))
- Capacité à rédiger un rapport technique structuré en anglais

## Objectif de cette fiche

À la fin de cette fiche, tu sauras publier un CVE via le processus de responsible disclosure, participer à des CTF compétitifs, contribuer à des programmes de bug bounty, rédiger des write-ups techniques, contribuer à des projets open-source de sécurité, et préparer des interventions en conférence.

---

## Concepts

### Qu'est-ce que la recherche en sécurité ?

**Définition** : La recherche en sécurité est l'activité de découvrir, analyser et documenter de nouvelles vulnérabilités, techniques d'attaque ou méthodes de défense dans les systèmes informatiques. Elle contribue à améliorer la sécurité globale de l'écosystème numérique.

**Le problème que la recherche en sécurité résout** :

Sans recherche en sécurité, voici les problèmes rencontrés :

1. **Vulnérabilités inconnues exploitées** : les attaquants découvrent et exploitent des failles avant les défenseurs (zéro-day)
2. **Stagnation des défenses** : sans nouvelles techniques documentées, les outils de défense ne progressent pas
3. **Asymétrie d'information** : les attaquants partagent leurs techniques (forums, dark web), mais les défenseurs restent isolés
4. **Manque de confiance** : sans audit indépendant, les logiciels contiennent des failles non détectées

**Comment la recherche en sécurité résout ces problèmes** :

| Problème | Solution apportée par la recherche |
| -------- | ---------------------------------- |
| Vulnérabilités inconnues | Découverte proactive via bug bounty, audit de code, fuzzing |
| Stagnation des défenses | Publication de techniques et d'outils open-source |
| Asymétrie d'information | Conférences, write-ups, partage communautaire |
| Manque de confiance | Audit indépendant et responsible disclosure |

**Analogie concrète** : La recherche en sécurité est comparable à la recherche médicale. Les chercheurs médicaux découvrent de nouvelles maladies, développent des traitements et publient leurs résultats pour que tous les médecins puissent en bénéficier. Sans cette recherche, la médecine resterait au niveau du Moyen Âge. Les chercheurs en sécurité jouent le même rôle pour le monde numérique.

**Ce que la recherche en sécurité n'est PAS** :

- La recherche en sécurité n'est pas du piratage illégal. Elle respecte un cadre légal et éthique strict (responsible disclosure, autorisation préalable)
- La recherche en sécurité n'est pas réservée aux génies. Elle s'apprend par la pratique (CTF, bug bounty, labs)

---

### Qu'est-ce que le Responsible Disclosure ?

**Définition** : Le responsible disclosure (divulgation responsable) est le processus par lequel un chercheur en sécurité informe le vendeur ou le développeur d'une vulnérabilité avant de la rendre publique, lui laissant le temps de corriger le problème.

**Le problème que le responsible disclosure résout** :

Sans responsible disclosure, voici les problèmes rencontrés :

1. **Full disclosure immédiat** : la vulnérabilité est publiée sans avertissement, exposant tous les utilisateurs
2. **Pas de disclosure du tout** : le chercheur garde la faille pour lui ou la vend sur le marché noir
3. **Conflit chercheur/vendeur** : sans processus établi, les relations sont conflictuelles

**Comment le responsible disclosure résout ces problèmes** :

| Problème | Solution apportée |
| -------- | ----------------- |
| Full disclosure immédiat | Délai de correction (90 jours selon la politique standard (Google Project Zero)) avant publication |
| Pas de disclosure | Processus structuré qui encourage la publication après correction |
| Conflit chercheur/vendeur | Cadre clair avec rôles et délais définis pour les deux parties |

**Le processus standard de responsible disclosure** :

| Étape | Action | Délai |
| ----- | ------ | ----- |
| 1 | Découverte de la vulnérabilité | Jour 0 |
| 2 | Rédaction du rapport technique | Jour 1-7 |
| 3 | Contact du vendeur (email security@, security.txt, plateforme bug bounty) | Jour 7 |
| 4 | Accusé de réception du vendeur | Jour 7-14 |
| 5 | Développement et test du correctif par le vendeur | Jour 14-80 |
| 6 | Publication du correctif (patch) | Jour 80-90 |
| 7 | Attribution du CVE | Jour 85-90 |
| 8 | Publication du write-up par le chercheur | Jour 90+ (après le patch) |

**Le fichier security.txt (RFC 9116)** :

```text
# Exemple de fichier .well-known/security.txt
Contact: mailto:security@example.com
Contact: https://hackerone.com/example
Encryption: https://example.com/.well-known/pgp-key.txt
Acknowledgments: https://example.com/hall-of-fame
Preferred-Languages: fr, en
Canonical: https://example.com/.well-known/security.txt
Policy: https://example.com/security-policy
Expires: 2027-01-01T00:00:00.000Z
```

---

### Qu'est-ce qu'un CVE ?

**Définition** : Un CVE (Common Vulnerabilities and Exposures) est un identifiant unique attribué à une vulnérabilité de sécurité publiquement connue. Le format est CVE-ANNÉE-NUMÉRO (ex : CVE-2024-12345).

**Le problème que les CVE résolvent** :

Sans identifiants CVE :

1. **Confusion** : une même vulnérabilité est décrite différemment par chaque vendeur, chercheur et outil
2. **Suivi impossible** : pas de référence commune pour suivre le statut d'une vulnérabilité (découverte, patch, exploitation active)
3. **Communication inefficace** : les équipes sécurité ne parlent pas le même langage

**Comment obtenir un CVE pour ta découverte** :

| Étape | Action | Détail |
| ----- | ------ | ------ |
| 1 | Identifier le CNA approprié | Le vendeur du logiciel est souvent CNA (CVE Numbering Authority). Sinon, contacter MITRE |
| 2 | Soumettre la demande | Via le formulaire du CNA ou via [cve.org/ResourcesSupport/ReportRequest](https://www.cve.org/ResourcesSupport/ReportRequest) (le formulaire historique cveform.mitre.org redirige vers le programme CVE actuel) |
| 3 | Fournir les informations | Description, produit affecté, versions, impact, PoC |
| 4 | Recevoir le CVE ID | Identifiant réservé (statut RESERVED) |
| 5 | Publication | Le CVE passe en statut PUBLISHED après la divulgation coordonnée |

**Les CNA (CVE Numbering Authorities) principaux** :

| CNA | Périmètre |
| --- | --------- |
| MITRE | CNA racine, tous les logiciels sans CNA dédié |
| Microsoft | Produits Microsoft |
| Google | Produits Google, Chrome, Android |
| Red Hat | Produits Red Hat et Fedora |
| Apache | Projets Apache Software Foundation |
| GitHub | Vulnérabilités découvertes via GitHub Security Advisories |

---

### Qu'est-ce qu'un CTF ?

**Définition** : Un CTF (Capture The Flag) est une compétition de cybersécurité où les participants résolvent des épreuves techniques pour obtenir des "flags" (chaînes de caractères à soumettre). Les CTF développent des compétences pratiques dans un cadre légal et compétitif.

**Les deux formats de CTF** :

| Format | Description | Durée | Exemple |
| ------ | ----------- | ----- | ------- |
| Jeopardy | Épreuves indépendantes par catégorie (web, crypto, pwn, reverse, forensics) | 24-48h | picoCTF, Google CTF |
| Attack-Defense | Chaque équipe défend ses services et attaque ceux des autres | 8-12h | DEFCON CTF Finals, RuCTF |

**Les catégories classiques d'épreuves** :

| Catégorie | Compétences testées | Outils courants |
| --------- | ------------------- | --------------- |
| Web | Injection SQL, XSS, SSRF, auth bypass | Burp Suite, curl, sqlmap |
| Crypto | Chiffrement, hachage, attaques mathématiques | Python, SageMath, CyberChef |
| Pwn (Binary Exploitation) | Buffer overflow, ROP, heap exploitation | GDB, pwntools, Ghidra |
| Reverse Engineering | Analyse de binaires, désobfuscation | Ghidra, IDA Free, radare2 |
| Forensics | Analyse mémoire, disque, réseau, stéganographie | Volatility, Wireshark, Autopsy |
| OSINT | Recherche d'informations en sources ouvertes | Google Dorks, Maltego, Shodan |
| Misc | Épreuves variées (programmation, logique, scripting) | Python, bash |

**Les compétitions majeures** :

| Compétition | Lieu | Niveau | Particularité |
| ----------- | ---- | ------ | ------------- |
| DEFCON CTF | Las Vegas (USA) | Elite | La plus ancienne et prestigieuse |
| Google CTF | En ligne | Avancé | Épreuves de qualité, qualifie pour DEFCON |
| Insomni'Hack | Genève (Suisse) | Avancé | Principale compétition francophone en Europe |
| European Cyber Cup (EC2) | France | Intermédiaire-Avancé | Compétition européenne professionnelle |
| LeHACK CTF | Paris (France) | Intermédiaire | Associé à la conférence LeHACK |
| picoCTF | En ligne | Débutant-Intermédiaire | Idéal pour commencer, orienté éducation |
| HTB CTF | En ligne | Intermédiaire-Avancé | Organisé par HackTheBox |

---

### Qu'est-ce que le Bug Bounty ?

**Définition** : Un programme de bug bounty est un dispositif par lequel une organisation récompense financièrement les chercheurs en sécurité qui découvrent et signalent des vulnérabilités dans ses systèmes.

**Le problème que le bug bounty résout** :

Sans bug bounty :

1. **Vulnérabilités non signalées** : les chercheurs qui trouvent des failles n'ont aucune incitation à les signaler au vendeur
2. **Marché noir** : les failles sont vendues sur le dark web au lieu d'être corrigées
3. **Coût d'audit prohibitif** : embaucher des pentesters pour tester en continu coûte très cher

**Comment le bug bounty résout ces problèmes** :

| Problème | Solution apportée |
| -------- | ----------------- |
| Vulnérabilités non signalées | Récompense financière qui incite au signalement |
| Marché noir | Alternative légale et rentable pour les chercheurs |
| Coût d'audit prohibitif | Crowdsourcing : des centaines de chercheurs testent en continu |

**Les plateformes principales** :

| Plateforme | Siège | Particularité |
| ---------- | ----- | ------------- |
| HackerOne | USA | Plus grande plateforme mondiale, programmes publics et privés |
| Bugcrowd | USA | Forte présence entreprise, programmes managés |
| YesWeHack | France | Plateforme européenne, conformité RGPD, programmes gouvernementaux français |
| Intigriti | Belgique | Plateforme européenne, forte communauté |

**Échelle de récompenses typique** :

| Sévérité | CVSS | Récompense typique | Exemple |
| -------- | ---- | ------------------- | ------- |
| Critique | 9.0-10.0 | 5 000 - 100 000 EUR | RCE, injection SQL avec exfiltration massive |
| Haute | 7.0-8.9 | 1 000 - 10 000 EUR | IDOR avec accès aux données d'autres utilisateurs |
| Moyenne | 4.0-6.9 | 500 - 2 000 EUR | XSS stocké, CSRF avec impact |
| Basse | 0.1-3.9 | 100 - 500 EUR | Information disclosure mineure |

---

### Qu'est-ce que la contribution open-source en sécurité ?

**Définition** : La contribution open-source en sécurité consiste à participer au développement, à l'amélioration et à la maintenance d'outils de sécurité dont le code source est public et librement accessible.

**Le problème que la contribution open-source résout** :

Sans contribution open-source :

1. **Outils propriétaires coûteux** : seules les grandes organisations peuvent se payer des outils de sécurité avancés
2. **Manque de transparence** : impossible de vérifier ce que fait un outil propriétaire
3. **Innovation lente** : un éditeur seul progresse moins vite qu'une communauté mondiale

**Projets open-source majeurs auxquels contribuer** :

| Projet | Domaine | Langage | Type de contribution recherchée |
| ------ | ------- | ------- | ------------------------------- |
| OWASP ZAP | Test de sécurité web | Java | Règles de scan, scripts, documentation |
| Metasploit | Framework d'exploitation | Ruby | Modules d'exploit, payloads, auxiliaires |
| Suricata | IDS/IPS réseau | C/Rust | Règles de détection, parsing de protocoles |
| Sigma | Règles de détection SIEM | YAML | Règles de détection universelles |
| YARA | Détection de malware | C | Règles de classification de malware |
| Wazuh | EDR/SIEM open-source | C/Python | Décodeurs, règles, intégrations |
| TheHive | Plateforme de réponse à incident | Scala | Responders, analyseurs, intégrations |
| Nuclei | Scanner de vulnérabilités | Go | Templates de détection |

---

### Qu'est-ce que le mentorat en cybersécurité ?

**Définition** : Le mentorat en cybersécurité est l'accompagnement structuré d'un professionnel débutant ou intermédiaire par un expert, pour accélérer le développement de ses compétences techniques et de sa carrière.

**Le problème que le mentorat résout** :

Sans mentorat :

1. **Apprentissage lent** : le débutant passe du temps sur des impasses que l'expert aurait identifiées en minutes
2. **Isolement** : la cybersécurité peut être un domaine solitaire sans réseau professionnel
3. **Manque de vision** : le débutant ne sait pas quelles compétences prioriser pour sa carrière

**Formats de mentorat** :

| Format | Description | Investissement |
| ------ | ----------- | -------------- |
| 1-to-1 | Sessions régulières avec un mentoré | 2-4h/mois |
| Coaching CTF | Accompagner une équipe CTF junior | 4-8h/mois pendant les compétitions |
| Création de contenu | Écrire des tutoriels, des write-ups, des cours | Variable |
| Encadrement de stage | Superviser un stagiaire en sécurité | Quotidien pendant la durée du stage |

---

## Étapes Pratiques

### Étape 1 : Configurer un environnement de recherche

```bash
# Créer un répertoire de recherche structuré
mkdir -p ~/security-research/{cves,ctf,bug-bounty,writeups,tools}

# Créer un template de rapport de vulnérabilité
cat > ~/security-research/cves/vulnerability-report-template.md << 'VULN_EOF'
# Rapport de Vulnérabilité

## Informations générales
- **Date de découverte** : YYYY-MM-DD
- **Chercheur** : [Ton nom / pseudo]
- **Produit affecté** : [Nom du produit]
- **Version(s) affectée(s)** : [Version(s)]
- **Version corrigée** : [Si connue]
- **CVE ID** : [Si attribué]

## Classification
- **Type** : [CWE-XXX : Nom de la faiblesse]
- **Sévérité CVSS v3.1** : [Score] ([Vecteur])
- **Impact** : [Confidentialité / Intégrité / Disponibilité]

## Description
[Description technique claire de la vulnérabilité en 2-3 paragraphes]

## Preuve de concept (PoC)

### Prérequis
- [Environnement nécessaire pour reproduire]

### Étapes de reproduction
1. [Étape 1]
2. [Étape 2]
3. [Étape 3]

### Résultat observé
[Ce qui se passe quand on exploite la vulnérabilité]

### Résultat attendu
[Ce qui se passe quand le système fonctionne sans la vulnérabilité]

## Impact
[Description de l'impact réel sur la sécurité]

## Recommandation de correction
[Comment corriger la vulnérabilité]

## Chronologie
| Date | Action |
| ---- | ------ |
| YYYY-MM-DD | Découverte |
| YYYY-MM-DD | Rapport envoyé au vendeur |
| YYYY-MM-DD | Accusé de réception |
| YYYY-MM-DD | Correctif publié |
| YYYY-MM-DD | Publication du write-up |

VULN_EOF

echo "Template de rapport de vulnérabilité créé"
```

**Résultat attendu** :

```text
Template de rapport de vulnérabilité créé
```

---

### Étape 2 : S'inscrire et résoudre un premier CTF

```bash
# Installer les outils de base pour les CTF
# (ces commandes supposent un système Debian/Ubuntu ou macOS avec Homebrew)

# Créer un script d'installation des outils CTF
cat > ~/security-research/ctf/setup-ctf-tools.sh << 'CTF_EOF'
#!/bin/bash
# Script d'installation des outils CTF essentiels

echo "=== Installation des outils CTF ==="

# Python et pwntools (exploitation binaire)
pip3 install pwntools

# CyberChef CLI (encodage/décodage)
pip3 install cyberchef-cli 2>/dev/null || echo "CyberChef : utiliser la version web"

# Outils forensiques
pip3 install volatility3

# Outils crypto
pip3 install pycryptodome gmpy2 sympy

# Outils web
pip3 install requests beautifulsoup4 flask

echo "=== Outils CTF installés ==="
echo ""
echo "Outils supplémentaires à installer manuellement :"
echo "  - Ghidra : https://ghidra-sre.org/"
echo "  - Burp Suite Community : https://portswigger.net/burp"
echo "  - Wireshark : https://www.wireshark.org/"
echo ""
echo "Plateformes d'entraînement :"
echo "  - picoCTF : https://picoctf.org/"
echo "  - HackTheBox : https://www.hackthebox.com/"
echo "  - TryHackMe : https://tryhackme.com/"
echo "  - Root-Me : https://www.root-me.org/"

CTF_EOF

chmod +x ~/security-research/ctf/setup-ctf-tools.sh
echo "Script d'installation CTF créé"

# Créer un template de write-up CTF
cat > ~/security-research/ctf/writeup-template.md << 'WU_EOF'
# [Nom du CTF] - [Nom du challenge]

Informations :
- CTF : [Nom de la compétition]
- Catégorie : [Web / Crypto / Pwn / Reverse / Forensics / Misc]
- Difficulté : [Easy / Medium / Hard]
- Points : [Nombre de points]

Énoncé : [Copier l'énoncé du challenge]

Analyse :
- Première observation : [Ce que tu remarques en premier]
- Hypothèse : [Ta théorie sur la vulnérabilité]

Solution :
- Étape 1 : [Titre] - [Commande ou code]
- Étape 2 : [Titre] - [Commande ou code]

Flag : flag{exemple_de_flag}

Ce que j'ai appris : [Résumé des compétences acquises]
WU_EOF

echo "Template de write-up CTF créé"
```

**Résultat attendu** :

```text
Script d'installation CTF créé
Template de write-up CTF créé
```

---

### Étape 3 : Configurer un profil bug bounty

```bash
# Créer un guide de démarrage bug bounty
cat > ~/security-research/bug-bounty/getting-started.md << 'BB_EOF'
# Guide de Démarrage - Bug Bounty

## 1. Créer tes profils

### Plateformes à rejoindre (dans cet ordre)
1. **YesWeHack** (yeswehack.com) - plateforme européenne, programmes francophones
2. **HackerOne** (hackerone.com) - plus grande plateforme mondiale
3. **Bugcrowd** (bugcrowd.com) - programmes managés de qualité
4. **Intigriti** (intigriti.com) - plateforme européenne

### Informations du profil
- Pseudo cohérent sur toutes les plateformes
- Bio technique (spécialités, certifications)
- Lien vers tes write-ups et CVE publiés

## 2. Choisir ton premier programme

### Critères de sélection pour débuter
- Scope large (*.example.com plutôt qu'un seul endpoint)
- Programme mature (réponse rapide, pas de faux positifs ignorés)
- Récompenses raisonnables (pas seulement des "kudos")
- VDP (Vulnerability Disclosure Program) si tu veux de la pratique sans pression

### Programmes recommandés pour débuter
- US Department of Defense (HackerOne) : scope très large, pas de récompense mais CVE possible
- GitLab (HackerOne) : scope large, bonne réactivité
- OVH/OVHcloud (YesWeHack) : programme français, bon pour commencer

## 3. Méthodologie de test

### Reconnaissance (1-2 heures)
1. Énumérer les sous-domaines : subfinder, amass
2. Scanner les ports : nmap (dans le scope uniquement)
3. Identifier les technologies : Wappalyzer, whatweb
4. Chercher les endpoints cachés : dirsearch, ffuf

### Test (2-4 heures par fonctionnalité)
1. Tester l'authentification : brute force, bypass MFA, token predictable
2. Tester les autorisations : IDOR, privilege escalation
3. Tester les injections : SQLi, XSS, SSTI, SSRF
4. Tester la logique métier : race conditions, price manipulation

### Rapport (30-60 minutes)
1. Titre clair et descriptif
2. Sévérité avec justification CVSS
3. Étapes de reproduction précises (1, 2, 3...)
4. Impact démontré (pas théorique)
5. Suggestion de correction

## 4. Erreurs courantes des débutants

| Erreur | Conséquence | Solution |
| ------ | ----------- | -------- |
| Tester hors scope | Ban de la plateforme | Lire le scope 3 fois avant de commencer |
| Rapport en double | Marqué "Duplicate", frustration | Chercher les rapports publics avant de signaler |
| Rapport sans impact | Marqué "Informative", pas de reward | Toujours démontrer l'impact réel |
| Automatisation agressive | IP bloquée, ban possible | Rate limiting sur tes outils, respecter robots.txt |
| Rapport peu clair | Renvoyé pour clarification, délai | Utiliser le template, inclure des captures d'écran |

BB_EOF

echo "Guide bug bounty créé"
```

**Résultat attendu** :

```text
Guide bug bounty créé
```

---

### Étape 4 : Préparer une soumission de conférence

```bash
# Créer un template de proposition de conférence (CFP)
cat > ~/security-research/writeups/cfp-template.md << 'CFP_EOF'
# Proposition de Conférence (CFP)

## Titre de la présentation
[Titre accrocheur en une ligne, max 80 caractères]

## Résumé (Abstract) - 200 mots max
[Description concise du sujet, de la problématique et de ce que le public
va apprendre. Ce résumé est lu par le comité de sélection.]

## Description détaillée - 500 mots max
[Développement du résumé avec le plan de la présentation, les points clés
et les démonstrations prévues.]

## Plan de la présentation
1. Introduction et contexte (5 min)
2. [Section 1] (10 min)
3. [Section 2] (10 min)
4. Démonstration live (10 min)
5. Contre-mesures et recommandations (5 min)
6. Questions/Réponses (5 min)

## Durée demandée
- [ ] Lightning talk (15 min)
- [ ] Présentation courte (30 min)
- [ ] Présentation longue (45 min)
- [ ] Workshop (2-4 heures)

## Public cible
- [ ] Débutant
- [ ] Intermédiaire
- [ ] Avancé

## Biographie du speaker - 100 mots max
[Ton parcours, tes spécialités, tes contributions notables (CVE, outils,
publications).]

## Présentations précédentes
[Liste des conférences où tu as déjà présenté, avec liens vers les slides/vidéos]

## Matériel nécessaire
- Projecteur HDMI
- Accès réseau local (si démo live)
- [Autre besoin spécifique]

CFP_EOF

echo "Template CFP créé"

# Créer un calendrier des conférences sécurité
cat > ~/security-research/writeups/conferences-calendar.md << 'CONF_EOF'
# Calendrier des Conférences Cybersécurité

## Conférences majeures internationales

| Conférence | Lieu | Période | CFP deadline | Niveau |
| ---------- | ---- | ------- | ------------ | ------ |
| Black Hat USA | Las Vegas | Août | Mars | Avancé-Expert |
| DEFCON | Las Vegas | Août | Mai | Tous niveaux |
| Black Hat Europe | Londres | Décembre | Août | Avancé-Expert |
| RSA Conference | San Francisco | Avril | Octobre | Professionnel |
| CCC (Chaos Communication Congress) | Hambourg | Décembre | Septembre | Avancé |

## Conférences européennes et francophones

| Conférence | Lieu | Période | CFP deadline | Niveau |
| ---------- | ---- | ------- | ------------ | ------ |
| SSTIC | Rennes | Juin | Février | Avancé-Expert (recherche) |
| LeHACK | Paris | Juillet | Mars | Intermédiaire-Avancé |
| Hack.lu | Luxembourg | Octobre | Juillet | Intermédiaire-Avancé |
| GreHack | Grenoble | Novembre | Juillet | Intermédiaire-Avancé |
| Insomni'Hack | Genève | Mars | Novembre | Avancé |
| Pass the SALT | Lille | Juillet | Mars | Avancé (open-source) |
| BotConf | France (ville variable) | Avril | Décembre | Avancé (malware/botnet) |
| Barbhack | Hyères | Août | Mai | Intermédiaire |
| THCon | Toulouse | Avril | Janvier | Intermédiaire |

## Conseils pour un premier CFP

1. Commence par des conférences locales ou de niveau intermédiaire
2. Propose un sujet que tu maîtrises parfaitement (pas de bluff)
3. Inclus une démonstration live (les comités adorent)
4. Fais relire ta proposition par un pair avant de soumettre
5. Si refusé, demande un feedback et réessaie à la prochaine édition

CONF_EOF

echo "Calendrier des conférences créé"
```

**Résultat attendu** :

```text
Template CFP créé
Calendrier des conférences créé
```

---

### Étape 5 : Contribuer à un projet open-source de sécurité

```bash
# Créer un guide de contribution open-source
mkdir -p ~/security-research/tools
cat > ~/security-research/tools/opensource-contribution-guide.md << 'OSS_EOF'
# Guide de Contribution Open-Source en Sécurité

## Choisir un projet
- Projet que tu utilises déjà (tu connais ses forces et faiblesses)
- Communauté active (réponse aux issues < 1 semaine)
- Documentation de contribution (CONTRIBUTING.md)
- Issues taguées "good first issue" ou "help wanted"

## Projets recommandés pour débuter
- Sigma Rules (github.com/SigmaHQ/sigma) : écrire une règle de détection YAML
- Nuclei Templates (github.com/projectdiscovery/nuclei-templates) : écrire un template de scan YAML
- YARA Rules (github.com/Yara-Rules/rules) : écrire une règle de détection de malware
- OWASP CheatSheets (github.com/OWASP/CheatSheetSeries) : améliorer la documentation sécurité

## Workflow Git standard
1. Fork le repository sur ton compte GitHub
2. Clone ton fork en local
3. Crée une branche descriptive (feat/add-sigma-rule-xxx)
4. Fais tes modifications
5. Teste localement (si tests disponibles)
6. Commit avec un message clair
7. Pousse ta branche et crée une Pull Request
8. Réponds aux commentaires de review
OSS_EOF

echo "Guide de contribution open-source créé"
```

**Résultat attendu** :

```text
Guide de contribution open-source créé
```

**Exemple concret : écrire une règle Sigma**

Voici un exemple de règle Sigma pour détecter un téléchargement suspect via PowerShell :

```yaml
title: Suspicious PowerShell Download Cradle
id: unique-uuid-here
status: experimental
description: Detects PowerShell commands commonly used to download
  and execute payloads from the internet
references:
  - https://attack.mitre.org/techniques/T1059/001/
author: Ton Nom
date: 2026/03/19
tags:
  - attack.execution
  - attack.t1059.001
logsource:
  category: process_creation
  product: windows
detection:
  selection_cmd:
    CommandLine|contains:
      - 'IEX'
      - 'Invoke-Expression'
  selection_download:
    CommandLine|contains:
      - 'Net.WebClient'
      - 'DownloadString'
      - 'Invoke-WebRequest'
      - 'iwr '
      - 'wget '
      - 'curl '
  condition: selection_cmd and selection_download
falsepositives:
  - Legitimate administrative scripts that download and execute code
level: high
```

---

### Étape 6 : Mettre en place une veille sécurité structurée

```bash
# Créer un système de veille
cat > ~/security-research/tools/veille-securite.md << 'VEILLE_EOF'
# Système de Veille Sécurité

## Sources quotidiennes (15 min/jour)

| Source | URL | Contenu |
| ------ | --- | ------- |
| CERT-FR | cert.fr | Alertes et avis de sécurité (France) |
| US-CERT (CISA) | cisa.gov/known-exploited-vulnerabilities | KEV : vulnérabilités activement exploitées |
| The Hacker News | thehackernews.com | Actualités cybersécurité grand public |
| BleepingComputer | bleepingcomputer.com | Actualités, analyses de malware, breaches |

## Sources hebdomadaires (1h/semaine)

| Source | URL | Contenu |
| ------ | --- | ------- |
| SANS ISC | isc.sans.edu | Analyse technique quotidienne |
| Krebs on Security | krebsonsecurity.com | Investigations approfondies |
| Risky Business | risky.biz | Podcast cybersécurité (30 min/semaine) |
| Darknet Diaries | darknetdiaries.com | Podcast : histoires de hacking (mensuel) |

## Sources techniques mensuelles (2h/mois)

| Source | Type | Contenu |
| ------ | ---- | ------- |
| arXiv cs.CR | Papers | Recherche académique en sécurité |
| Google Project Zero Blog | Blog | Recherche de vulnérabilités |
| Trail of Bits Blog | Blog | Audits, outils, recherche |
| PortSwigger Research | Blog | Recherche en sécurité web |

## Flux RSS recommandés

Pour agréger ces sources, utilise un lecteur RSS local (compatible offline) :
- **Miniflux** (self-hosted) : léger, API, compatible mobile
- **NewsFlash** (Linux) : client RSS natif GTK
- **NetNewsWire** (macOS) : gratuit, open-source, sync iCloud

VEILLE_EOF

echo "Système de veille sécurité créé"
```

**Résultat attendu** :

```text
Système de veille sécurité créé
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `subfinder -d example.com -o subdomains.txt` | Énumérer les sous-domaines d'un domaine |
| `nmap -sC -sV -oA scan target` | Scanner les ports avec détection de version et scripts |
| `ffuf -u https://target/FUZZ -w wordlist.txt` | Fuzzer des endpoints web |
| `sqlmap -u "https://target/page?id=1" --batch` | Tester les injections SQL automatiquement |
| `python3 -c "from pwn import *; print(cyclic(200))"` | Générer un pattern cyclique pour buffer overflow |
| `volatility3 -f dump.raw windows.pslist` | Lister les processus d'un dump mémoire |
| `nuclei -u https://target -t cves/` | Scanner les CVE connues sur une cible |
| `gh repo fork SigmaHQ/sigma --clone` | Forker et cloner un repo pour contribuer |

---

## Pièges Fréquents

### Piège 1 : Tester sans autorisation

**Problème** : tester un système sans autorisation explicite peut être illégal, même si tu trouves une vulnérabilité. En France, l'article 323-1 du Code pénal punit l'accès frauduleux à un système de traitement automatisé de données ; d'autres textes ou règles (CGU, contrats, droit étranger) peuvent aussi s'appliquer selon le cas.

**Solution** : avant de tester, assure-toi d'avoir une autorisation écrite. Pour le bug bounty, le programme publié sur la plateforme constitue en général cette autorisation **uniquement dans le scope défini**. Pour la recherche, utilise tes propres systèmes ou des plateformes dédiées (HackTheBox, TryHackMe, VulnHub).

### Piège 2 : Publier un write-up avant le correctif

**Problème** : publier les détails d'une vulnérabilité avant que le vendeur ait publié un correctif expose tous les utilisateurs.

**Solution** : respecte le délai de responsible disclosure (90 jours standard). Si le vendeur ne répond pas après 90 jours, tu peux publier avec un avertissement. Si le vendeur demande un délai supplémentaire raisonnable (30 jours), accepte. Documente toute la chronologie dans ton write-up.

### Piège 3 : Se concentrer uniquement sur les outils automatiques

**Problème** : lancer des scanners automatiques (Nuclei, Burp Scanner) sur un programme bug bounty ne différencie pas du bruit. Les vulnérabilités faciles sont déjà trouvées.

**Solution** : les outils automatiques sont un point de départ. Les vulnérabilités intéressantes se trouvent dans la logique métier, les cas limites, les interactions entre composants. Lis le code source (si disponible), comprends la logique, et teste manuellement les scénarios inhabituels.

### Piège 4 : Négliger la rédaction

**Problème** : un rapport de vulnérabilité mal rédigé est renvoyé pour clarification ou classé "Informative". Un write-up confus n'est pas lu par la communauté.

**Solution** : investis autant de temps dans la rédaction que dans la recherche technique. Un bon rapport suit le template : titre clair, étapes de reproduction numérotées, impact démontré, suggestion de correction. Fais relire par un pair avant de soumettre.

---

## Checklist de Validation

- [ ] Je comprends le processus de responsible disclosure et ses délais
- [ ] Je sais rédiger un rapport de vulnérabilité complet
- [ ] Je connais le processus d'attribution d'un CVE
- [ ] Je peux participer à un CTF et résoudre des épreuves de niveau débutant
- [ ] Je suis inscrit sur au moins une plateforme de bug bounty
- [ ] Je connais les principales conférences de cybersécurité françaises et internationales
- [ ] Je sais préparer une proposition de conférence (CFP)
- [ ] Je peux contribuer à un projet open-source de sécurité (fork, PR, review)
- [ ] J'ai mis en place un système de veille sécurité structuré
- [ ] Je comprends les obligations légales liées à la recherche en sécurité

---

## Exercice Pratique

**Énoncé** : Tu vas simuler un parcours complet de chercheur en sécurité en réalisant les 4 activités suivantes.

**Activité 1 : Résoudre 5 challenges CTF**

- Inscris-toi sur picoCTF (picoctf.org) ou Root-Me (root-me.org)
- Résous 5 challenges dans des catégories différentes (web, crypto, forensics, misc, reverse)
- Rédige un write-up pour chaque challenge en utilisant le template fourni

**Activité 2 : Analyser un CVE récent**

- Choisis un CVE publié dans les 6 derniers mois (NVD : nvd.nist.gov)
- Analyse la vulnérabilité : type (CWE), impact (CVSS), produit affecté
- Reproduis la vulnérabilité dans un environnement de test (Docker ou VM)
- Rédige un write-up technique complet

**Activité 3 : Contribuer à un projet open-source**

- Forke le projet Sigma Rules (github.com/SigmaHQ/sigma)
- Écris une nouvelle règle de détection pour une technique MITRE ATT&CK
- Soumets une Pull Request en suivant les guidelines du projet
- Réponds aux commentaires de review

**Activité 4 : Préparer une proposition de conférence**

- Choisis un sujet basé sur tes activités précédentes (write-up CTF, analyse CVE, contribution open-source)
- Rédige une proposition complète en utilisant le template CFP fourni
- Identifie 3 conférences auxquelles soumettre ta proposition
- Fais relire ta proposition par un pair

**Indications** :

- Pour picoCTF, commence par les challenges "picoGym" (disponibles en permanence)
- Pour le CVE, choisis une vulnérabilité avec un PoC public (référence dans la fiche NVD)
- Pour Sigma, lis les règles existantes pour comprendre le format avant d'écrire la tienne
- Pour le CFP, la conférence THCon (Toulouse) ou Barbhack (Hyères) sont accessibles pour un premier talk

**Résultat attendu** :

- 5 fichiers write-up CTF dans `~/security-research/ctf/`
- 1 fichier write-up CVE dans `~/security-research/cves/`
- 1 Pull Request soumise sur le repo Sigma
- 1 proposition de conférence dans `~/security-research/writeups/`

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Activité 1 : Exemple de write-up CTF (Web)

```text
# picoCTF - SQL Direct

## Informations
- CTF : picoCTF 2024
- Catégorie : Web
- Difficulté : Easy
- Points : 200

## Énoncé
"Connect to this PostgreSQL server and find the flag."
Connexion : psql -h saturn.picoctf.net -p 12345 -U ctf_player pico

## Analyse
Le challenge donne un accès direct à une base PostgreSQL.
L'objectif est de trouver le flag dans les tables.

## Solution

### Étape 1 : Se connecter
psql -h saturn.picoctf.net -p 12345 -U ctf_player pico

### Étape 2 : Lister les tables
\dt
Résultat : une table "flags"

### Étape 3 : Lire la table
SELECT * FROM flags;
Résultat : picoCTF{L3arN_S0m3_5QL_ch4ll3ng3}

## Flag
picoCTF{L3arN_S0m3_5QL_ch4ll3ng3}

## Ce que j'ai appris
- Énumération de base PostgreSQL (\dt, \d table)
- Importance de vérifier l'accès direct aux bases de données
```

### Activité 2 : Exemple d'analyse CVE

```text
# Analyse CVE-2024-3094 (xz/liblzma backdoor)

## Informations
- CVE : CVE-2024-3094
- Produit : xz Utils / liblzma
- Versions : 5.6.0 et 5.6.1
- CVSS : 10.0 (Critique)
- CWE : CWE-506 (Embedded Malicious Code)

## Description
Un mainteneur compromis a injecté une backdoor dans xz Utils via des
fichiers de test obfusqués. La backdoor ciblait le processus sshd via
systemd, permettant une exécution de code à distance pré-authentification.

## Impact
- Exécution de code arbitraire à distance sur les serveurs SSH
- Affecte les distributions Linux utilisant systemd + sshd + liblzma

## Chronologie
- 2024-02-24 : xz 5.6.0 publié (avec backdoor)
- 2024-03-09 : xz 5.6.1 publié (backdoor toujours présente)
- 2024-03-28 : Découverte par Andres Freund (Microsoft)
- 2024-03-29 : CVE-2024-3094 publié, alerte mondiale

## Leçon
Cet incident illustre le risque de supply chain sur les projets
open-source maintenus par un seul développeur. Contrôle de code,
reproductibilité des builds et audit des dépendances sont essentiels.
```

### Activité 3 : Exemple de règle Sigma

```yaml
title: Suspicious Certutil Download
id: e5b5c5a0-1234-5678-9abc-def012345678
status: experimental
description: Detects the use of certutil.exe to download files from
  the internet, a technique commonly used by attackers to bypass
  application whitelisting
references:
  - https://attack.mitre.org/techniques/T1105/
  - https://lolbas-project.github.io/lolbas/Binaries/Certutil/
author: Ton Nom
date: 2026/03/19
tags:
  - attack.command_and_control
  - attack.t1105
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    Image|endswith: '\certutil.exe'
    CommandLine|contains:
      - 'urlcache'
      - '-split'
      - 'http'
  condition: selection
falsepositives:
  - Legitimate certificate operations using certutil
level: high
```

### Activité 4 : Exemple de proposition de conférence

```text
Titre : "xz Backdoor : Anatomie d'une Attaque Supply Chain et Détection"

Résumé : En mars 2024, la backdoor xz (CVE-2024-3094) a mis en lumière
la fragilité de la supply chain open-source. Cette présentation analyse
le vecteur d'attaque (social engineering du mainteneur), la technique
d'obfuscation (fichiers de test binaires), et le mécanisme de la
backdoor (détournement de sshd via liblzma). Nous démontrerons comment
détecter ce type d'attaque avec Sigma et YARA, et proposerons des
contrôles concrets pour sécuriser votre supply chain logicielle.

Conférences cibles : THCon (Toulouse), GreHack (Grenoble), Pass the SALT (Lille)
```

---

## Navigation

← Fiche précédente : **[02 - GRC Avancée et Management de la Sécurité](02-grc-avancee.md)**

→ Fiche suivante : **[04 - Tendances 2026 et Au-delà](04-tendances-2026.md)**
