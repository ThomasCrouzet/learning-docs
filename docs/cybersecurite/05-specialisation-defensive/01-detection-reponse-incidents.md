---
tags:
  - Cybersécurité
  - Avancé
  - Pratique
description: "Méthodologie DFIR, forensique mémoire/disque/réseau/Windows, chain of custody"
estimated_time: "55 min"
fiche_number: 1
total_fiches: 5
cursus: "Phase 5 - Spécialisation Défensive"
---

# 01 - Détection et Réponse aux Incidents (DFIR)

> **En bref** : À la fin de cette fiche, tu sauras mener une investigation forensique complète : de la détection d'un incident à la production d'un rapport, en utilisant les méthodologies NIST et PICERL, les outils de forensique mémoire (Volatility 3), disque (Autopsy) et réseau (Wireshark/tshark). Lecture estimée : 55 min.

⚠️ **Cadre légal** : extraire des hashes (`windows.hashdump.Hashdump`) ou analyser un dump hors labo autorisé peut constituer un accès frauduleux (art. 323-1 du Code pénal). Limite-toi à tes propres machines ou à un environnement pédagogique dédié.


## Prérequis

- [Phase 1 - Fondamentaux Informatiques](../01-fondamentaux-informatiques/index.md) : toutes les fiches complétées
- [Phase 2 - Fondamentaux de la Sécurité](../02-fondamentaux-securite/index.md) : toutes les fiches complétées
- [Phase 3 - Compétences Intermédiaires](../03-competences-intermediaires/index.md) : toutes les fiches complétées, en particulier la [fiche 04 (Détection et Monitoring)](../03-competences-intermediaires/04-introduction-soc-monitoring.md)
- Connaissances de base en systèmes d'exploitation Windows et Linux (processus, fichiers, registre, journaux)
- Python installé (version 3.10+) pour les outils forensiques

## Objectif de cette fiche

À la fin de cette fiche, tu sauras mener une investigation forensique complète : de la détection d'un incident à la production d'un rapport, en utilisant les méthodologies NIST et PICERL, les outils de forensique mémoire (Volatility 3), disque (Autopsy) et réseau (Wireshark/tshark).

---

## Concepts

### Qu'est-ce que le DFIR ?

**Définition** : Le DFIR (Digital Forensics and Incident Response) est la discipline qui combine la forensique numérique (collecte et analyse de preuves numériques) et la réponse aux incidents (détection, containment, éradication et récupération après une attaque).

**Le problème que le DFIR résout** :

Sans DFIR, voici les problèmes rencontrés :

1. **Attaques non détectées** : sans méthodologie, les intrusions passent inaperçues pendant des semaines ou des mois. Le chiffre « 207 jours » (IBM Cost of a Data Breach, millésime ~2020) n'est plus le délai d'identification des rapports 2024-2025 ; cite toujours l'année du rapport.
2. **Preuves détruites** : sans procédure forensique, les analystes modifient ou détruisent involontairement les preuves en intervenant sur le système compromis
3. **Récupération chaotique** : sans plan structuré, la remise en service est désorganisée et risque de laisser des portes dérobées en place
4. **Récidive garantie** : sans analyse des causes racines, le même vecteur d'attaque sera réexploité

**Comment le DFIR résout ces problèmes** :

| Problème | Solution apportée par le DFIR |
| -------- | ----------------------------- |
| Attaques non détectées | Monitoring continu, alertes SIEM, investigation proactive |
| Preuves détruites | Chain of custody, acquisition forensique, images bit-à-bit |
| Récupération chaotique | Méthodologie structurée (NIST/PICERL) avec phases définies |
| Récidive garantie | Analyse des causes racines, rapport de lessons learned |

**Analogie concrète** : Le DFIR fonctionne comme une enquête de police après un cambriolage. La forensique numérique est l'équivalent de la police scientifique : elle relève les empreintes, photographie la scène et collecte les indices sans rien déplacer. La réponse aux incidents est l'équivalent de l'enquêteur : il coordonne les opérations, sécurise les lieux, identifie le coupable et rédige le rapport.

**Ce que le DFIR n'est PAS** :

- Le DFIR n'est pas du pentest. Le pentest simule une attaque pour trouver des vulnérabilités _avant_ qu'elles soient exploitées. Le DFIR intervient _après_ qu'une attaque a eu lieu
- Le DFIR n'est pas uniquement de la forensique. La forensique seule collecte des preuves. Le DFIR ajoute la dimension opérationnelle : contenir l'attaque, éradiquer la menace et restaurer les systèmes

### Qu'est-ce que la méthodologie NIST SP 800-61 ?

**Définition** : Le NIST SP 800-61 (Computer Security Incident Handling Guide) est le guide de référence publié par le National Institute of Standards and Technology. Il définit 4 phases pour gérer un incident de sécurité.

**Les 4 phases du NIST SP 800-61** :

1. **Preparation** : mettre en place les outils, former les équipes, définir les procédures
2. **Détection & Analysis** : détecter l'incident, analyser sa nature et son périmètre
3. **Containment, Eradication & Recovery** : contenir la menace, l'éradiquer et restaurer les systèmes
4. **Post-Incident Activity** : documenter, faire le bilan, améliorer les procédures

**Note sur la révision** : ce découpage en 4 phases correspond à la révision 2 (Rev. 2) du guide.
La **révision 3 (NIST SP 800-61 Rev. 3, avril 2025)** réaligne la réponse à incident sur les 6 fonctions du NIST CSF 2.0 (Govern, Identify, Protect, Detect, Respond, Recover) et abandonne le découpage strict en 4 phases.
Le modèle en 4 phases reste largement utilisé et pédagogiquement valable (PICERL ci-dessous le détaille bien), mais sache que les publications récentes raisonnent désormais en fonctions CSF.

### Qu'est-ce que le modèle PICERL ?

**Définition** : PICERL est un acronyme mnémotechnique qui découpe la réponse aux incidents en 6 phases distinctes. C'est une extension pratique du NIST SP 800-61.

**Les 6 phases de PICERL** :

| Phase | Nom | Description |
| ----- | --- | ----------- |
| P | Preparation | Outils prêts, équipe formée, procédures documentées |
| I | Identification | Détecter et confirmer qu'un incident est en cours |
| C | Containment | Isoler les systèmes compromis pour stopper la propagation |
| E | Eradication | Supprimer la menace (malware, backdoors, comptes compromis) |
| R | Recovery | Restaurer les systèmes et vérifier leur intégrité |
| L | Lessons Learned | Documenter, analyser les causes racines, améliorer |

**Analogie concrète** : PICERL est comme le protocole d'intervention des pompiers. Preparation : les camions sont vérifiés et les pompiers entraînés. Identification : l'alarme sonne et la nature du feu est identifiée. Containment : on empêche le feu de se propager. Eradication : on éteint le feu. Recovery : on vérifie que le bâtiment est sûr. Lessons Learned : on rédige le rapport et on adapte les procédures.

### Qu'est-ce que la chain of custody ?

**Définition** : La chain of custody (chaîne de traçabilité) est le processus documenté qui enregistre chaque personne ayant manipulé une preuve numérique, quand, pourquoi et comment. Elle garantit l'intégrité et la recevabilité des preuves.

**Le problème que la chain of custody résout** :

Sans chain of custody, voici les problèmes rencontrés :

1. **Preuves irrecevables** : un tribunal peut rejeter des preuves si leur intégrité n'est pas prouvée
2. **Modification non détectée** : sans hash de vérification, impossible de prouver qu'une preuve n'a pas été altérée
3. **Responsabilité floue** : sans journal de manipulation, impossible de déterminer qui a fait quoi

**Comment la chain of custody résout ces problèmes** :

| Problème | Solution apportée |
| -------- | ----------------- |
| Preuves irrecevables | Documentation complète de chaque transfert |
| Modification non détectée | Hash SHA-256 calculé à chaque étape |
| Responsabilité floue | Journal signé avec identité, date, action |

**Ce que la chain of custody n'est PAS** :

- La chain of custody n'est pas une sauvegarde. La sauvegarde copie les données. La chain of custody documente qui a touché l'original et les copies
- La chain of custody n'est pas optionnelle en contexte juridique. Sans elle, toute l'investigation peut être invalidée

---

## Étapes Pratiques

Le diagramme suivant résume le pipeline d'analyse forensique, de la découverte de l'incident jusqu'au rapport final.

<div class="diagram-design">
<p><a href="../../../diagrams/cybersecurite-05-specialisation-defensive-01-detection-reponse-incidents-1.html">Étapes Pratiques (HTML + SVG)</a></p>
<iframe src="../../../diagrams/cybersecurite-05-specialisation-defensive-01-detection-reponse-incidents-1.html" title="Étapes Pratiques" style="width:100%;min-height:616px;border:0;background:transparent"></iframe>
</div>

### Étape 1 : Installer Volatility 3

Volatility 3 est l'outil de référence pour la forensique mémoire. Il analyse les dumps mémoire (RAM) pour extraire les processus, connexions réseau, DLLs chargées et artefacts malveillants.

```bash
# Cloner le dépôt Volatility 3
git clone https://github.com/volatilityfoundation/volatility3.git
cd volatility3

# Installer les dépendances
pip3 install -r requirements.txt

# Vérifier l'installation
python3 vol.py --help
```

**Résultat attendu** :

```text
Volatility 3 Framework 2.x.x
usage: vol.py [-h] [-c CONFIG] [--parallelism [{processes,threads,off}]]
              [-e EXTEND] [-p PLUGIN_DIRS] [-s SYMBOL_DIRS] [-v] [-l LOG]
              [-o OUTPUT_DIR] [-q] [-r RENDERER] [-f FILE] [--write-config]
              [--save-config SAVE_CONFIG] [--clear-cache]
              [--cache-path CACHE_PATH] [--offline]
              [--single-location SINGLE_LOCATION]
              [--stackers [STACKERS ...]]
              [--single-swap-locations [SINGLE_SWAP_LOCATIONS ...]]
              plugin ...
```

### Étape 2 : Acquérir un dump mémoire

Avant d'analyser la mémoire, il faut la capturer. En environnement Windows, on utilise des outils comme WinPmem ou DumpIt.

```bash
# Sur Windows (avec WinPmem) - exécuter en tant qu'administrateur
winpmem_mini_x64.exe memdump.raw

# Sur Linux (avec LiME)
sudo insmod lime-$(uname -r).ko "path=/tmp/memdump.lime format=lime"

# Calculer le hash SHA-256 pour la chain of custody
sha256sum memdump.raw > memdump.raw.sha256
```

**Résultat attendu** :

```text
# WinPmem affiche la progression
[INFO] Acquiring memory image...
[INFO] 100% complete
[INFO] Memory image written to memdump.raw

# Le hash SHA-256 produit une empreinte unique
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  memdump.raw
```

### Étape 3 : Analyser les processus avec Volatility 3

La liste des processus révèle les programmes en cours d'exécution au moment de la capture. Un processus suspect peut indiquer un malware.

```bash
# Lister tous les processus (Windows)
python3 vol.py -f memdump.raw windows.pslist.PsList

# Lister les processus avec leur arborescence parent-enfant
python3 vol.py -f memdump.raw windows.pstree.PsTree

# Détecter les processus cachés (rootkits)
python3 vol.py -f memdump.raw windows.psscan.PsScan
```

**Résultat attendu** :

```text
PID     PPID    ImageFileName   Offset(V)       Threads Handles
4       0       System          0xfa8000c14040  104     512
308     4       smss.exe        0xfa800108a780  2       29
392     384     csrss.exe       0xfa8001a1a2f0  10      489
440     384     wininit.exe     0xfa8001a5e060  3       74
448     432     csrss.exe       0xfa8001a62b00  12      291
7824    1204    svchost.exe     0xfa8003c12340  8       156
3456    7824    cmd.exe         0xfa8004a23100  1       23
```

**Ce qu'il faut chercher** :

- Un processus `cmd.exe` ou `powershell.exe` lancé par `svchost.exe` (suspect)
- Des processus avec des noms proches de processus légitimes (`svch0st.exe` au lieu de `svchost.exe`)
- Des processus sans parent visible (PPID qui ne correspond à rien)

### Étape 4 : Analyser les connexions réseau

Les connexions réseau révèlent les communications actives au moment du dump, y compris les connexions vers des serveurs de commande et contrôle (C2).

```bash
# Lister les connexions réseau actives
python3 vol.py -f memdump.raw windows.netscan.NetScan

# Filtrer les connexions ESTABLISHED (actives)
python3 vol.py -f memdump.raw windows.netscan.NetScan | grep ESTABLISHED
```

**Résultat attendu** :

```text
Offset          Proto   LocalAddr       LocalPort   ForeignAddr     ForeignPort State       PID     Owner
0xfa8003d12340  TCPv4   192.168.1.100   49234       185.220.101.45  443         ESTABLISHED 3456    cmd.exe
0xfa8003d15670  TCPv4   192.168.1.100   49235       10.0.0.1        53          CLOSED      1204    svchost.exe
```

**Ce qu'il faut chercher** :

- Des connexions vers des adresses IP externes inconnues (vérifier avec des bases de threat intelligence)
- Un processus `cmd.exe` qui ouvre des connexions réseau (comportement anormal)
- Des connexions sur des ports inhabituels (4444, 8080, 1337)

### Étape 5 : Extraire les DLLs et détecter l'injection de code

L'injection de code est une technique où un malware insère du code malveillant dans un processus légitime.

```bash
# Lister les DLLs chargées par un processus suspect (PID 3456)
python3 vol.py -f memdump.raw windows.dlllist.DllList --pid 3456

# Détecter les injections de code (malinject)
python3 vol.py -f memdump.raw windows.malfind.Malfind

# Extraire les régions mémoire suspectes
python3 vol.py -f memdump.raw windows.malfind.Malfind --pid 3456 --dump
```

**Résultat attendu** :

```text
PID     Process         Start VPN       End VPN         Tag     Protection      Content
3456    cmd.exe         0x400000        0x401000        VadS    PAGE_EXECUTE_READWRITE
4d 5a 90 00 03 00 00 00  MZ......
04 00 00 00 ff ff 00 00  ........
```

**Ce qu'il faut chercher** :

- Des régions mémoire avec la protection `PAGE_EXECUTE_READWRITE` (RWX) : c'est un indicateur fort d'injection de code
- Le magic byte `MZ` (0x4d5a) au début d'une région RWX : un exécutable PE a été injecté en mémoire
- Des DLLs chargées depuis des chemins inhabituels (`C:\Temp\`, `C:\Users\Public\`)

### Étape 6 : Forensique disque - Analyser la timeline avec Autopsy

Autopsy est un outil graphique de forensique disque. Il analyse les images disque (E01, dd, raw) pour reconstruire l'activité du système.

```bash
# Créer une image disque avec dd (Linux)
sudo dd if=/dev/sda of=/evidence/disk.raw bs=4M status=progress

# Calculer le hash pour la chain of custody
sha256sum /evidence/disk.raw > /evidence/disk.raw.sha256

# Lancer Autopsy (interface web)
autopsy
```

**Résultat attendu** :

```text
# dd affiche la progression
4294967296 bytes (4.3 GB, 4.0 GiB) copied, 45 s, 95.4 MB/s

# Autopsy démarre le serveur web
Autopsy Forensic Browser
http://localhost:9999/autopsy
```

### Étape 7 : Forensique Windows - Analyser les artefacts

Windows conserve de nombreux artefacts qui tracent l'activité du système. Ces artefacts sont essentiels pour reconstruire la timeline d'une attaque.

```bash
# Extraire les Event Logs Windows (sur un montage forensique)
# Les logs sont dans C:\Windows\System32\winevt\Logs\

# Analyser les logs Security avec evtx_dump (outil Rust)
evtx_dump Security.evtx | grep -i "4624\|4625\|4648\|4672"

# Analyser le registre Amcache (programmes exécutés)
python3 vol.py -f memdump.raw windows.registry.hivelist.HiveList

# Extraire les fichiers Prefetch (traces d'exécution)
# Les fichiers Prefetch sont dans C:\Windows\Prefetch\
ls -la /mnt/evidence/Windows/Prefetch/*.pf
```

**Résultat attendu** :

```text
# Event ID importants
4624 - Connexion réussie (Type 3=réseau, Type 10=RDP)
4625 - Connexion échouée
4648 - Connexion avec des identifiants explicites
4672 - Privilèges spéciaux attribués (admin)

# Fichiers Prefetch
-rw-r--r-- 1 root root 23456 Jan 15 14:23 CMD.EXE-4A81B364.pf
-rw-r--r-- 1 root root 34567 Jan 15 14:25 POWERSHELL.EXE-022A1004.pf
-rw-r--r-- 1 root root 12345 Jan 15 14:30 MIMIKATZ.EXE-1A2B3C4D.pf
```

**Artefacts Windows critiques** :

| Artefact | Emplacement | Ce qu'il révèle |
| -------- | ----------- | ---------------- |
| Event Logs | `C:\Windows\System32\winevt\Logs\` | Connexions, créations de processus, modifications |
| Prefetch | `C:\Windows\Prefetch\` | Programmes exécutés avec timestamp |
| Amcache | `C:\Windows\AppCompat\Programs\Amcache.hve` | Historique des programmes installés/exécutés |
| ShimCache | Registre SYSTEM | Programmes exécutés (même après suppression) |
| MFT | `$MFT` à la racine du volume NTFS | Métadonnées de tous les fichiers (création, modification, suppression) |
| NTUSER.DAT | `C:\Users\<user>\NTUSER.DAT` | Activité utilisateur (programmes récents, chemins accédés) |

### Étape 8 : Forensique réseau - Analyser les captures PCAP

L'analyse réseau permet de détecter les communications avec les serveurs C2, l'exfiltration de données et les mouvements latéraux.

```bash
# Capturer le trafic réseau (si l'incident est en cours)
sudo tcpdump -i eth0 -w /evidence/capture.pcap -s 0

# Analyser avec tshark (version CLI de Wireshark)
# Lister les conversations TCP
tshark -r capture.pcap -q -z conv,tcp

# Détecter les requêtes DNS suspectes (exfiltration DNS)
tshark -r capture.pcap -Y "dns" -T fields -e dns.qry.name | sort | uniq -c | sort -rn | head -20

# Extraire les fichiers transférés
tshark -r capture.pcap --export-objects http,/evidence/extracted_files/

# Détecter le beaconing C2 (intervalles réguliers)
tshark -r capture.pcap -Y "ip.dst==185.220.101.45" -T fields -e frame.time_relative
```

**Résultat attendu** :

```text
# Conversations TCP
192.168.1.100:49234 <-> 185.220.101.45:443    Frames:1247  Bytes:523456

# Requêtes DNS suspectes (exfiltration)
    847 aGVsbG8gd29ybGQ.evil-domain.com
    523 dGhpcyBpcyBhIHRlc3Q.evil-domain.com

# Beaconing C2 (intervalles réguliers = suspect)
0.000000
60.012345
120.024567
180.036789
```

**Indicateurs de C2 (Command & Control)** :

- Beaconing régulier : connexions à intervalles fixes (toutes les 60 secondes par exemple)
- Trafic DNS avec des sous-domaines encodés en Base64 (exfiltration DNS)
- Trafic HTTPS vers des adresses IP sans nom de domaine
- Volumes de données asymétriques (beaucoup de données sortantes)

### Étape 9 : Documenter la chain of custody

Chaque preuve collectée doit être documentée avec un formulaire de chain of custody.

```bash
# Créer un fichier de chain of custody
cat << 'CUSTODY' > chain_of_custody.txt
=== CHAIN OF CUSTODY RECORD ===

Case ID: INC-2026-0042
Case Name: Compromission serveur web PROD-WEB-01

Evidence #1:
  Description: Dump mémoire RAM du serveur PROD-WEB-01
  Filename: memdump.raw
  SHA-256: e3b0c44298fc1c149afbf4c8996fb924...
  Size: 16 GB
  Acquired by: [Nom de l'analyste]
  Date/Time: 2026-03-19 14:30 UTC
  Method: WinPmem 4.0
  Storage: /evidence/INC-2026-0042/memory/

Transfer Log:
  2026-03-19 14:30 UTC - Acquired by [Analyste A] - Stored on forensic workstation
  2026-03-19 15:00 UTC - Verified hash by [Analyste B] - Hash matches
  2026-03-19 16:00 UTC - Copied to analysis VM by [Analyste A] - Hash verified
CUSTODY

echo "Chain of custody créée"
```

**Résultat attendu** :

```text
Chain of custody créée
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `python3 vol.py -f dump.raw windows.pslist.PsList` | Lister les processus |
| `python3 vol.py -f dump.raw windows.pstree.PsTree` | Arborescence des processus |
| `python3 vol.py -f dump.raw windows.psscan.PsScan` | Détecter les processus cachés |
| `python3 vol.py -f dump.raw windows.netscan.NetScan` | Connexions réseau |
| `python3 vol.py -f dump.raw windows.malfind.Malfind` | Détecter l'injection de code |
| `python3 vol.py -f dump.raw windows.dlllist.DllList --pid X` | DLLs d'un processus |
| `python3 vol.py -f dump.raw windows.cmdline.CmdLine` | Lignes de commande des processus |
| `python3 vol.py -f dump.raw windows.filescan.FileScan` | Scanner les fichiers en mémoire |
| `python3 vol.py -f dump.raw windows.registry.hivelist.HiveList` | Lister les ruches registre |
| `python3 vol.py -f dump.raw windows.hashdump.Hashdump` | Extraire les hashes (labo autorisé seulement ; art. 323-1 du Code pénal) |
| `tshark -r capture.pcap -q -z conv,tcp` | Conversations TCP |
| `tshark -r capture.pcap -Y "dns" -T fields -e dns.qry.name` | Requêtes DNS |
| `sha256sum fichier` | Calculer le hash SHA-256 |
| `dd if=/dev/sda of=disk.raw bs=4M status=progress` | Image disque bit-à-bit |

---

## Pièges Fréquents

### Piège 1 : Analyser le système compromis directement

**Problème** : Travailler directement sur le système compromis modifie les timestamps, écrase des preuves en mémoire et invalide la chain of custody.

**Solution** : Toujours travailler sur une copie forensique. Acquérir d'abord un dump mémoire (la RAM est volatile), puis une image disque. Analyser uniquement les copies, jamais l'original.

### Piège 2 : Oublier de calculer les hashes

**Problème** : Sans hash SHA-256 calculé immédiatement après l'acquisition, impossible de prouver que la preuve n'a pas été modifiée.

**Solution** : Calculer le hash SHA-256 immédiatement après chaque acquisition et le noter dans le formulaire de chain of custody. Recalculer le hash avant chaque analyse pour vérifier l'intégrité.

```bash
# Calculer le hash immédiatement après acquisition
sha256sum memdump.raw > memdump.raw.sha256

# Vérifier le hash avant analyse
sha256sum -c memdump.raw.sha256
```

### Piège 3 : Confondre PsList et PsScan

**Problème** : `PsList` parcourt la liste doublement chaînée des processus dans le noyau Windows. Un rootkit peut retirer un processus de cette liste. L'analyste ne voit pas le processus malveillant.

**Solution** : Toujours exécuter `PsScan` en complément de `PsList`. `PsScan` scanne toute la mémoire à la recherche de structures `_EPROCESS`, y compris celles qui ont été déliées de la liste. Comparer les deux résultats pour identifier les processus cachés.

### Piège 4 : Ignorer les timestamps des artefacts Windows

**Problème** : Les timestamps NTFS (MFT) sont en UTC. Les Event Logs Windows utilisent le fuseau horaire local. Mélanger les deux sans conversion crée une timeline incohérente.

**Solution** : Convertir tous les timestamps en UTC avant de les intégrer dans la timeline. Documenter le fuseau horaire du système compromis dans le rapport.

---

## Checklist de Validation

- [ ] Je sais expliquer les 6 phases de PICERL et leur ordre
- [ ] Je sais acquérir un dump mémoire avec WinPmem et calculer son hash SHA-256
- [ ] Je sais analyser les processus avec Volatility 3 (PsList, PsTree, PsScan)
- [ ] Je sais détecter les connexions réseau suspectes avec NetScan
- [ ] Je sais identifier une injection de code avec Malfind (régions RWX, magic byte MZ)
- [ ] Je sais créer une image disque forensique avec dd
- [ ] Je sais identifier les artefacts Windows clés (Event Logs, Prefetch, Amcache, ShimCache, MFT)
- [ ] Je sais analyser une capture PCAP pour détecter du beaconing C2
- [ ] Je sais rédiger un formulaire de chain of custody
- [ ] Je sais expliquer la différence entre PsList et PsScan

---

## Exercice Pratique

**Énoncé** : Tu reçois un dump mémoire Windows (`incident.raw`) provenant d'un serveur suspecté d'être compromis. L'alerte initiale signale des connexions réseau inhabituelles vers l'adresse IP `185.220.101.45`.

Réalise les étapes suivantes :

1. Vérifie l'intégrité du dump avec son hash SHA-256
2. Liste tous les processus et identifie les processus suspects
3. Analyse les connexions réseau pour trouver les communications vers l'IP suspecte
4. Identifie le processus responsable de ces connexions
5. Vérifie si ce processus contient du code injecté
6. Extrais les DLLs chargées par ce processus
7. Rédige un résumé de tes findings

**Indications** :

- Commence par `PsTree` pour voir l'arborescence parent-enfant
- Un processus légitime (`svchost.exe`, `explorer.exe`) qui lance `cmd.exe` ou `powershell.exe` est suspect
- Vérifie les régions mémoire RWX avec `Malfind`
- Note chaque commande exécutée et son résultat pour le rapport

**Résultat attendu** : Un rapport structuré identifiant le processus malveillant, ses connexions réseau, la présence ou non d'injection de code, et une recommandation de containment.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# Étape 1 : Vérifier l'intégrité
sha256sum -c incident.raw.sha256

# Étape 2 : Lister les processus avec arborescence
python3 vol.py -f incident.raw windows.pstree.PsTree

# Observation : svchost.exe (PID 1204) → cmd.exe (PID 3456)
# C'est suspect : svchost.exe ne lance jamais cmd.exe en fonctionnement normal

# Étape 3 : Analyser les connexions réseau
python3 vol.py -f incident.raw windows.netscan.NetScan | grep "185.220.101.45"

# Résultat : PID 3456 (cmd.exe) connecté à 185.220.101.45:443

# Étape 4 : Le processus responsable est cmd.exe (PID 3456)
# Son parent est svchost.exe (PID 1204), ce qui confirme la compromission

# Étape 5 : Vérifier l'injection de code
python3 vol.py -f incident.raw windows.malfind.Malfind --pid 3456

# Résultat : Région RWX détectée avec magic byte MZ → exécutable PE injecté

# Étape 6 : Extraire les DLLs
python3 vol.py -f incident.raw windows.dlllist.DllList --pid 3456

# Chercher des DLLs inhabituelles (chemins temporaires, noms aléatoires)

# Étape 7 : Ligne de commande du processus
python3 vol.py -f incident.raw windows.cmdline.CmdLine --pid 3456
```

**Rapport de findings** :

```text
=== RAPPORT D'INVESTIGATION PRÉLIMINAIRE ===

Incident: INC-2026-0042
Date d'analyse: 2026-03-19

FINDINGS:
1. Processus suspect: cmd.exe (PID 3456)
   - Parent: svchost.exe (PID 1204) - relation parent-enfant anormale
   - Connexion active vers 185.220.101.45:443 (C2 probable)

2. Injection de code confirmée:
   - Région mémoire RWX détectée dans cmd.exe
   - Magic byte MZ présent → exécutable PE injecté

3. Recommandations immédiates:
   - Isoler le serveur du réseau (containment)
   - Bloquer l'IP 185.220.101.45 au niveau firewall
   - Vérifier les autres serveurs du même segment réseau
   - Acquérir une image disque avant toute action supplémentaire
```

---

## Navigation

→ Fiche suivante : **[02 - Analyse de Malware](02-analyse-malware.md)**
