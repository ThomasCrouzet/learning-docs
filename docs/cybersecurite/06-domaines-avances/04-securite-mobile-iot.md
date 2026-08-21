---
tags:
  - Cybersécurité
  - Avancé
  - Pratique
description: "Sécurité des applications mobiles et objets connectés : analyse APK, firmware, hardware hacking, radio"
estimated_time: "70 min"
fiche_number: 4
total_fiches: 5
cursus: "Phase 6 - Domaines Avancés"
id: "security.cybersecurity.advanced.securite-mobile-iot"
course_id: "security.cybersecurity"
module_id: "security.cybersecurity.advanced"
content_type: "lesson"
order: 4
---

# 04 - Sécurité Mobile et IoT

> **En bref** : À la fin de cette fiche, tu sauras analyser la sécurité d'une application mobile Android (décompilation, interception de trafic, analyse statique), identifier les vulnérabilités des objets connectés (IoT), extraire et analyser un firmware, et comprendre les attaques hardware et radio les plus courantes. Lecture estimée : 70 min.


## Prérequis

- [Phase 1, fiche 01 - Architecture matérielle](../01-fondamentaux-informatiques/01-architecture-materielle.md) (CPU, mémoire, bus)
- [Phase 1, fiche 03 - Réseaux et protocoles](../01-fondamentaux-informatiques/03-reseaux-protocoles.md) (TCP/IP, Wireshark)
- [Phase 3, fiche 02 - Sécurité Web et Applicative](../03-competences-intermediaires/02-securite-web-applicative.md)
- Connaissances de base en programmation (Python, Bash)
- Aucune connaissance préalable en développement mobile ou en électronique n'est requise (tout est expliqué ci-dessous)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras analyser la sécurité d'une application mobile Android (décompilation, interception de trafic, analyse statique), identifier les vulnérabilités des objets connectés (IoT), extraire et analyser un firmware, et comprendre les attaques hardware et radio les plus courantes.

---

## Concepts

### Qu'est-ce que la sécurité mobile ?

**Définition** : la sécurité mobile couvre la protection des applications, des données et des communications sur les appareils mobiles (smartphones, tablettes). Elle inclut l'analyse des applications (APK pour Android, IPA pour iOS), l'interception du trafic réseau, et la vérification des mécanismes de protection du système d'exploitation.

**Le problème que la sécurité mobile résout** :

1. **Données sensibles sur l'appareil** : les smartphones contiennent des données bancaires, médicales, personnelles et professionnelles
2. **Applications malveillantes** : les stores contiennent des applications qui volent des données ou espionnent les utilisateurs
3. **Trafic réseau non sécurisé** : certaines applications transmettent des données en clair ou acceptent des certificats invalides
4. **Surface d'attaque étendue** : Bluetooth, Wi-Fi, NFC, GPS, caméra, microphone sont autant de vecteurs d'attaque

**Comment la sécurité mobile résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Données sensibles | Chiffrement du stockage, KeyStore/Keychain, détection de root/jailbreak |
| Applications malveillantes | Analyse statique et dynamique, sandboxing, permissions granulaires |
| Trafic non sécurisé | Certificate pinning, TLS obligatoire, détection de proxy |
| Surface d'attaque | Réduction des permissions, hardening de l'OS, MDM (Mobile Device Management) |

**Analogie concrète** : un smartphone est comme un portefeuille connecté à Internet. Il contient tes cartes bancaires, tes papiers d'identité, tes photos et tes conversations privées. La sécurité mobile, c'est s'assurer que ce portefeuille a un bon cadenas (chiffrement), que les applications que tu y mets ne sont pas des pickpockets déguisés (analyse des apps), et que personne ne regarde par-dessus ton épaule quand tu l'utilises (sécurité réseau).

**Ce que la sécurité mobile n'est PAS** :

- La sécurité mobile n'est pas uniquement l'installation d'un antivirus. La majorité des vulnérabilités viennent des applications elles-mêmes, pas de malwares classiques
- La sécurité mobile n'est pas identique à la sécurité desktop. Les architectures mobiles (sandboxing, permissions) sont fondamentalement différentes

---

### Comment fonctionne la sécurité Android et iOS ?

**Définition** : Android et iOS utilisent des modèles de sécurité différents pour protéger les applications et les données des utilisateurs. Comprendre ces modèles est essentiel pour identifier les faiblesses.

**Comparaison des modèles de sécurité** :

| Mécanisme | Android | iOS |
| --------- | ------- | --- |
| Sandboxing | Chaque app a son propre UID Linux | Chaque app dans une sandbox App Sandbox |
| Permissions | Déclarées dans le manifest, accordées par l'utilisateur | Demandées à l'exécution, accordées par l'utilisateur |
| Distribution | Google Play + APK sideloading possible | App Store uniquement (sauf jailbreak/AltStore) |
| Chiffrement stockage | FBE (File-Based Encryption) depuis Android 10 | Data Protection API avec clés hardware |
| Stockage sécurisé | Android Keystore (TEE/StrongBox) | iOS Keychain (Secure Enclave) |
| Vérification d'intégrité | Play Integrity API (ex-SafetyNet) | DeviceCheck, App Attest |
| Code source | Open source (AOSP) | Propriétaire |
| Root/Jailbreak | Root possible (Magisk) | Jailbreak possible (Checkm8, Checkra1n) |

**Architecture de sécurité Android (couches)** :

| Couche | Protection | Rôle |
| ------ | ---------- | ---- |
| Application | Sandbox, permissions | Isoler les apps entre elles |
| Framework | API sécurisées, vérification des permissions | Contrôler l'accès aux ressources système |
| HAL | Keymaster/StrongBox | Opérations cryptographiques matérielles |
| Kernel | SELinux, seccomp | Contrôle d'accès obligatoire |
| Hardware | TEE (TrustZone), Titan M | Racine de confiance matérielle |

---

### Qu'est-ce que l'OWASP Mobile Top 10 ?

**Définition** : l'OWASP Mobile Top 10 est une liste des 10 vulnérabilités les plus critiques dans les applications mobiles. C'est le référentiel standard pour l'audit de sécurité mobile.

**OWASP Mobile Top 10 (2024)** :

| # | Vulnérabilité | Description | Exemple |
| - | ------------- | ----------- | ------- |
| M1 | Improper Credential Usage | Identifiants codés en dur, clés API dans le code | Clé API Google Maps dans le fichier `strings.xml` |
| M2 | Inadequate Supply Chain Security | Dépendances et SDK tiers vulnérables | SDK publicitaire qui exfiltre des données |
| M3 | Insecure Authentication/Authorization | Authentification contournable, absence de vérification côté serveur | Token JWT validé uniquement côté client |
| M4 | Insufficient Input/Output Validation | Injection SQL, XSS via WebView | `loadUrl()` avec des données utilisateur non filtrées |
| M5 | Insecure Communication | Trafic en clair, absence de certificate pinning | API appelée en HTTP au lieu de HTTPS |
| M6 | Inadequate Privacy Controls | Collecte excessive de données, absence de consentement | Géolocalisation partagée sans nécessité |
| M7 | Insufficient Binary Protections | Pas d'obfuscation, absence de détection de root/tampering | APK décompilable avec code source lisible |
| M8 | Security Misconfiguration | Backup autorisé, debug mode activé en production | `android:debuggable="true"` dans le manifest |
| M9 | Insecure Data Storage | Données sensibles en clair dans SharedPreferences ou SQLite | Mot de passe stocké en texte clair dans une base locale |
| M10 | Insufficient Cryptography | Algorithmes obsolètes, clés faibles | Utilisation de MD5 pour hasher les mots de passe |

---

### Qu'est-ce que la sécurité IoT ?

**Définition** : la sécurité IoT (Internet of Things) couvre la protection des objets connectés : caméras IP, thermostats, montres connectées, serrures intelligentes, dispositifs médicaux, véhicules connectés, capteurs industriels. Ces appareils sont souvent sous-protégés à cause de contraintes matérielles (peu de mémoire, peu de CPU) et d'un manque de culture sécurité chez les fabricants.

**Le problème que la sécurité IoT résout** :

1. **Mots de passe par défaut** : la majorité des appareils IoT sont livrés avec des identifiants par défaut (admin/admin) que les utilisateurs ne changent jamais
2. **Absence de mises à jour** : beaucoup d'appareils n'ont pas de mécanisme de mise à jour sécurisé, ou le fabricant cesse de publier des patchs
3. **Communication non chiffrée** : des appareils transmettent des données sensibles (vidéo, audio, position) en clair sur le réseau
4. **Surface d'attaque physique** : un attaquant avec un accès physique peut extraire le firmware, lire la mémoire flash, ou se connecter aux ports de debug

**Comment la sécurité IoT résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Mots de passe par défaut | Identifiants uniques par appareil, obligation de changement au premier usage |
| Absence de mises à jour | Mécanisme OTA (Over-The-Air) sécurisé avec signature du firmware |
| Communication non chiffrée | TLS obligatoire, certificats d'appareil, mutual TLS |
| Surface d'attaque physique | Secure boot, chiffrement de la flash, désactivation des ports de debug (JTAG/UART) |

**Analogie concrète** : un objet connecté est comme une petite maison dans un village. Chaque maison a une porte (interface réseau), des fenêtres (ports de communication) et dans certains cas une trappe au sous-sol (port de debug). Si la porte n'a pas de serrure (mot de passe par défaut), que les fenêtres sont ouvertes (pas de chiffrement) et que la trappe n'est pas verrouillée (JTAG actif), n'importe qui peut entrer. Le problème : il y a des milliards de ces petites maisons sur Internet.

---

### Quelles sont les attaques hardware sur les appareils IoT ?

**Définition** : les attaques hardware exploitent les interfaces physiques et les composants électroniques d'un appareil pour en extraire des données, modifier son comportement ou prendre le contrôle.

**Interfaces d'attaque courantes** :

| Interface | Description | Ce qu'un attaquant peut faire |
| --------- | ----------- | ----------------------------- |
| JTAG | Interface de debug standard pour les circuits intégrés | Lire/écrire la mémoire, arrêter le processeur, contourner l'authentification |
| UART | Port série pour les communications de debug | Accéder à une console root, lire les logs de boot |
| SPI | Bus série pour les mémoires flash | Extraire le firmware complet de la mémoire |
| I2C | Bus série pour les capteurs et périphériques | Lire les données des capteurs, interagir avec les composants |
| Chip-off | Dessouder la mémoire flash du PCB | Lire le contenu complet de la mémoire, même si le firmware est protégé |

**Processus d'analyse hardware (du moins invasif au plus invasif)** :

| Étape | Action | Outils |
| ----- | ------ | ------ |
| 1. Reconnaissance | Identifier les composants (CPU, flash, connecteurs) | Loupe, appareil photo, datasheets |
| 2. UART | Chercher un port série (4 pins : VCC, GND, TX, RX) | Multimètre, adaptateur USB-UART |
| 3. JTAG | Identifier les pins JTAG et se connecter | JTAGulator, OpenOCD |
| 4. SPI/Flash | Lire la mémoire flash | Flashrom, Bus Pirate, CH341A |
| 5. Chip-off | Dessouder et lire la puce mémoire | Station de soudure, lecteur de flash |

---

### Quelles sont les attaques radio sur les appareils IoT ?

**Définition** : les attaques radio exploitent les protocoles de communication sans fil des appareils IoT. Ces protocoles utilisent différentes fréquences et présentent chacun des vulnérabilités spécifiques.

**Protocoles radio et vulnérabilités** :

| Protocole | Fréquence | Portée | Vulnérabilités connues |
| --------- | --------- | ------ | ---------------------- |
| Bluetooth / BLE | 2.4 GHz | 10-100 m | BlueBorne, KNOB attack, pairing faible |
| Zigbee | 2.4 GHz | 10-100 m | Clé de réseau en clair lors du pairing, rejoin attack |
| Z-Wave | 868 MHz (EU) / 908 MHz (US) | 30-100 m | Downgrade S2 vers S0, interception S0 |
| LoRa / LoRaWAN | 868 MHz (EU) / 915 MHz (US) | 2-15 km | Replay si compteur mal implémenté, ABP vs OTAA |
| Wi-Fi | 2.4 / 5 GHz | 50-100 m | WPA2 KRACK, PMKID, evil twin |
| RFID/NFC | 13.56 MHz (HF) | < 10 cm | Clonage, relay attack, lecture non autorisée |

**Outils SDR (Software Defined Radio)** :

| Outil | Prix | Fréquences | Usage |
| ----- | ---- | ---------- | ----- |
| RTL-SDR | 25 € | 24 MHz - 1.7 GHz | Réception uniquement, analyse passive |
| HackRF One | 300 € | 1 MHz - 6 GHz | Émission et réception, replay attacks |
| YARD Stick One | 100 € | Sub-GHz (300-928 MHz) | Attaques sur télécommandes, capteurs |
| Flipper Zero | 170 € | Multi-protocoles | RFID, Sub-GHz, NFC, infrarouge, GPIO |
| Ubertooth One | 120 € | 2.4 GHz | Sniffing Bluetooth |

---

## Étapes Pratiques

### Étape 1 : Décompiler une application Android (APK)

La décompilation permet d'analyser le code source d'une application pour y chercher des vulnérabilités.

```bash
# Installer les outils de décompilation
# jadx : décompilateur Java/Kotlin pour APK
# apktool : déassemblage et réassemblage d'APK

# macOS
brew install jadx apktool

# Linux (télécharger depuis les repos GitHub)
# jadx : https://github.com/skylot/jadx/releases
# apktool : https://apktool.org/docs/install
```

```bash
# Extraire l'APK depuis un appareil Android connecté en USB
# Lister les packages installés
adb shell pm list packages | grep "nom.appli"

# Trouver le chemin de l'APK
adb shell pm path com.example.application

# Copier l'APK sur le PC
adb pull /data/app/com.example.application/base.apk ./app.apk
```

```bash
# Décompiler avec jadx (produit du code Java/Kotlin lisible)
jadx -d output_jadx/ app.apk

# L'arborescence générée :
# output_jadx/
# ├── resources/    (fichiers XML, images, configurations)
# │   ├── AndroidManifest.xml
# │   ├── res/
# │   └── assets/
# └── sources/      (code Java/Kotlin décompilé)
#     └── com/
#         └── example/
#             └── application/
```

```bash
# Décompiler avec apktool (préserve les ressources et le smali)
apktool d app.apk -o output_apktool/

# Le smali est le bytecode Dalvik désassemblé
# Plus précis que jadx mais moins lisible
```

**Résultat attendu** :

```text
Jadx génère un dossier avec :
- Le code Java/Kotlin décompilé (lisible comme du code source normal)
- Le fichier AndroidManifest.xml (permissions, activités, services)
- Les fichiers de ressources (strings.xml, configurations)

Tu peux maintenant chercher des vulnérabilités :
- Clés API ou mots de passe dans le code
- Endpoints d'API (URLs)
- Mécanismes d'authentification
- Stockage de données sensibles
```

---

### Étape 2 : Rechercher des secrets dans un APK décompilé

Après la décompilation, il faut chercher les données sensibles codées en dur.

```bash
# Chercher des clés API dans le code décompilé
grep -rn "api_key\|apikey\|API_KEY\|secret\|password\|token" output_jadx/sources/

# Chercher des URLs d'API
grep -rn "https\?://\|http://" output_jadx/sources/ | grep -v "schemas.android.com"

# Chercher dans les fichiers de ressources
grep -rn "api_key\|secret\|password" output_jadx/resources/

# Chercher les certificats embarqués
find output_jadx/ -name "*.crt" -o -name "*.pem" -o -name "*.p12" -o -name "*.bks"

# Analyser le AndroidManifest.xml
# Vérifier les permissions excessives
grep "uses-permission" output_jadx/resources/AndroidManifest.xml

# Vérifier si le debug est activé
grep "debuggable" output_jadx/resources/AndroidManifest.xml

# Vérifier si le backup est autorisé (risque de fuite de données)
grep "allowBackup" output_jadx/resources/AndroidManifest.xml
```

**Résultat attendu** :

```text
# Exemples de trouvailles fréquentes :

# Clé API codée en dur
sources/com/example/app/ApiClient.java:42:
    private static final String API_KEY = "AIzaSyD1234567890abcdefghijklmnop";

# URL d'API interne
sources/com/example/app/Config.java:15:
    private static final String BASE_URL = "https://api-internal.example.com/v2/";

# Debug activé en production
AndroidManifest.xml:
    android:debuggable="true"

# Backup autorisé
AndroidManifest.xml:
    android:allowBackup="true"

# Permissions excessives
<uses-permission android:name="android.permission.READ_CONTACTS"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.RECORD_AUDIO"/>
```

---

### Étape 3 : Intercepter le trafic réseau d'une application mobile

mitmproxy permet d'intercepter et d'analyser le trafic HTTPS entre une application mobile et son serveur.

```bash
# Installer mitmproxy
pip install mitmproxy

# Lancer mitmproxy en mode proxy
# Le proxy écoute sur le port 8080
mitmproxy --listen-port 8080
```

```bash
# Configuration de l'appareil mobile :
# 1. Connecter le mobile et le PC au même réseau Wi-Fi
# 2. Sur le mobile, configurer le proxy Wi-Fi :
#    - Proxy : adresse IP du PC (ex: 192.168.1.100)
#    - Port : 8080
# 3. Installer le certificat CA de mitmproxy sur le mobile :
#    - Ouvrir http://mitm.it dans le navigateur du mobile
#    - Télécharger et installer le certificat pour Android ou iOS

# Pour Android 7+ : le certificat utilisateur n'est plus suffisant
# Il faut installer le certificat comme certificat système (nécessite root)
# ou utiliser Frida pour contourner le certificate pinning
```

```bash
# Filtrer le trafic pour voir uniquement les requêtes API
# Dans mitmproxy, taper 'f' puis le filtre :
# ~d api.example.com    (filtrer par domaine)
# ~m POST               (filtrer les requêtes POST)
# ~b password            (filtrer les réponses contenant "password")

# Sauvegarder le trafic pour analyse ultérieure
mitmproxy --listen-port 8080 -w capture.flow

# Relire une capture sauvegardée
mitmproxy -r capture.flow
```

**Résultat attendu** :

```text
mitmproxy affiche chaque requête/réponse interceptée :

>> POST https://api.example.com/auth/login
   Content-Type: application/json
   Body: {"email": "user@test.com", "password": "MonMotDePasse123"}

<< 200 OK
   Body: {"token": "eyJhbGciOiJIUzI1NiIs...", "user_id": 12345}

Ce que tu peux identifier :
- Mots de passe transmis en clair dans le body (même si HTTPS)
- Tokens d'authentification et leur format
- Endpoints d'API et leurs paramètres
- Données personnelles envoyées au serveur
- Appels à des services tiers (analytics, publicité)
```

---

### Étape 4 : Analyser dynamiquement une app avec Frida

Frida est un framework d'instrumentation dynamique qui permet de modifier le comportement d'une application en temps réel.

```bash
# Installer Frida (côté PC)
pip install frida-tools

# Installer le serveur Frida sur le téléphone Android (nécessite root)
# Télécharger la version correspondante depuis :
# https://github.com/frida/frida/releases
# Pousser le serveur sur l'appareil
adb push frida-server-16.x.x-android-arm64 /data/local/tmp/frida-server
adb shell "chmod 755 /data/local/tmp/frida-server"
adb shell "/data/local/tmp/frida-server &"
```

```bash
# Lister les applications en cours d'exécution
frida-ps -U

# Se connecter à une application spécifique
frida -U com.example.application
```

Script Frida pour contourner le certificate pinning et la détection de root :

```javascript
// bypass-ssl-root.js
// Ce script contourne le certificate pinning SSL et la détection de root

Java.perform(function() {
    console.log("[*] Script de bypass chargé");

    // Contourner le certificate pinning (OkHttp3)
    try {
        var CertificatePinner = Java.use("okhttp3.CertificatePinner");
        CertificatePinner.check.overload(
            "java.lang.String",
            "java.util.List"
        ).implementation = function(hostname, peerCertificates) {
            console.log("[+] Certificate pinning contourné pour : " + hostname);
            // Ne rien faire = accepter tous les certificats
        };
    } catch(e) {
        console.log("[-] OkHttp3 CertificatePinner non trouvé");
    }

    // Contourner la détection de root (vérification classique)
    try {
        var RootBeer = Java.use("com.scottyab.rootbeer.RootBeer");
        RootBeer.isRooted.implementation = function() {
            console.log("[+] Détection de root contournée (RootBeer)");
            return false;
        };
    } catch(e) {
        console.log("[-] RootBeer non trouvé");
    }

    // Contourner la vérification de fichier su
    try {
        var File = Java.use("java.io.File");
        File.exists.implementation = function() {
            var path = this.getAbsolutePath();
            if (path.indexOf("su") !== -1 ||
                path.indexOf("Superuser") !== -1 ||
                path.indexOf("magisk") !== -1) {
                console.log("[+] Masqué fichier root : " + path);
                return false;
            }
            return this.exists.call(this);
        };
    } catch(e) {
        console.log("[-] Erreur bypass fichier");
    }
});
```

```bash
# Lancer le script Frida contre l'application
# -f spawn l'application. Depuis Frida 14, le processus n'est plus
# mis en pause par défaut. L'option --no-pause a été retirée (Frida 17).
frida -U -f com.example.application -l bypass-ssl-root.js
```

**Résultat attendu** :

```text
[*] Script de bypass chargé
[+] Certificate pinning contourné pour : api.example.com
[+] Certificate pinning contourné pour : analytics.example.com
[+] Détection de root contournée (RootBeer)
[+] Masqué fichier root : /system/xbin/su

L'application fonctionne sans erreur visible, mais :
- Le trafic HTTPS est interceptable par mitmproxy
- L'application ne détecte plus que l'appareil est rooté
- Tu peux analyser toutes les communications réseau
```

---

### Étape 5 : Extraire et analyser un firmware IoT

L'extraction de firmware permet d'analyser le système d'exploitation et les applications d'un appareil IoT.

```bash
# Installer binwalk (outil d'extraction de firmware)
pip install binwalk

# Analyser un fichier firmware sans l'extraire
binwalk firmware.bin

# Extraire le contenu du firmware
binwalk -e firmware.bin

# L'extraction crée un dossier _firmware.bin.extracted/
# contenant le système de fichiers (souvent squashfs ou cramfs)
```

```bash
# Analyser le contenu extrait
# Chercher des mots de passe par défaut
grep -rn "password\|passwd\|admin\|root" _firmware.bin.extracted/

# Chercher les clés privées
find _firmware.bin.extracted/ -name "*.pem" -o -name "*.key" -o -name "id_rsa"

# Chercher les fichiers de configuration
find _firmware.bin.extracted/ -name "*.conf" -o -name "*.cfg" -o -name "*.ini"

# Analyser le fichier /etc/passwd (comptes utilisateurs)
cat _firmware.bin.extracted/squashfs-root/etc/passwd

# Analyser le fichier /etc/shadow (hash des mots de passe)
cat _firmware.bin.extracted/squashfs-root/etc/shadow

# Chercher les binaires avec des permissions SUID
find _firmware.bin.extracted/ -perm -4000 -type f
```

```bash
# Utiliser firmwalker pour un audit automatisé du firmware
# https://github.com/craigz28/firmwalker
git clone https://github.com/craigz28/firmwalker.git
cd firmwalker
./firmwalker.sh /chemin/vers/_firmware.bin.extracted/squashfs-root/
```

**Résultat attendu** :

```text
# Résultat de binwalk :
DECIMAL       HEXADECIMAL     DESCRIPTION
0             0x0             uImage header, header size: 64 bytes
64            0x40            LZMA compressed data
1048576       0x100000        Squashfs filesystem, little endian, version 4.0

# Trouvailles fréquentes dans un firmware :
/etc/passwd:
root:$1$abc123:0:0:root:/root:/bin/sh
admin:$1$xyz789:0:0:admin:/home/admin:/bin/sh

/etc/default_config.conf:
ADMIN_PASSWORD=admin123
WIFI_KEY=DefaultWifiPassword
API_SERVER=http://cloud.vendor.com:8080

/usr/bin/update_firmware:
# Script de mise à jour téléchargeant via HTTP (pas HTTPS)
wget http://updates.vendor.com/latest.bin
```

---

### Étape 6 : Se connecter à un port UART sur un appareil IoT

Le port UART permet souvent d'accéder à une console root sur un appareil IoT.

```bash
# Matériel nécessaire :
# - Adaptateur USB-UART (CH340, CP2102 ou FT232RL) : environ 5-10 €
# - Fils de connexion (jumper wires)
# - Multimètre (pour identifier les pins)

# Étape 1 : Identifier les pins UART sur le PCB
# Chercher un connecteur à 3 ou 4 pins :
# - VCC (3.3V ou 5V) - ne pas connecter
# - GND (masse) - à identifier avec le multimètre (continuité avec le ground)
# - TX (transmission de l'appareil) - connecter au RX de l'adaptateur
# - RX (réception de l'appareil) - connecter au TX de l'adaptateur

# Étape 2 : Déterminer le baud rate
# Les baud rates courants : 9600, 19200, 38400, 57600, 115200
# Utiliser l'outil baudrate.py pour auto-détecter :
# https://github.com/devttys0/baudrate
```

```bash
# Étape 3 : Se connecter avec screen ou minicom
# macOS / Linux avec screen :
screen /dev/ttyUSB0 115200

# Linux avec minicom :
minicom -D /dev/ttyUSB0 -b 115200

# Si la connexion fonctionne, tu devrais voir les logs de boot
# ou un prompt de connexion :
```

**Résultat attendu** :

```text
U-Boot 2019.04 (Jan 15 2020)
DRAM: 128 MiB
Loading kernel from flash...
Starting kernel ...
[    0.000000] Linux version 4.14.90
[    0.000000] Booting Linux on physical CPU 0x0
...
[    3.456789] Starting network...
[    4.567890] Starting web server...

Welcome to IoTDevice
IoTDevice login: root
Password: (vide ou "root" ou "admin")

root@IoTDevice:~#

Tu as maintenant un accès root complet à l'appareil.
Tu peux explorer le système de fichiers, les processus,
les configurations réseau et les services actifs.
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `jadx -d output/ app.apk` | Décompiler un APK Android |
| `apktool d app.apk -o output/` | Désassembler un APK (préserve les ressources) |
| `adb shell pm list packages` | Lister les packages installés sur un appareil Android |
| `adb pull /chemin/fichier ./local` | Copier un fichier depuis l'appareil Android |
| `frida-ps -U` | Lister les processus sur l'appareil connecté en USB |
| `frida -U -f com.app -l script.js` | Injecter un script Frida dans une application |
| `mitmproxy --listen-port 8080` | Lancer un proxy d'interception HTTP/HTTPS |
| `binwalk -e firmware.bin` | Extraire le contenu d'un firmware |
| `screen /dev/ttyUSB0 115200` | Connexion série UART à 115200 bauds |
| `nmap -sV --script=ble-discover` | Scanner les appareils Bluetooth à proximité |

---

## Pièges Fréquents

### Piège 1 : Analyser un APK sans vérifier le certificate pinning

⚠️ **Problème** : tenter d'intercepter le trafic HTTPS sans contourner le certificate pinning. L'application refuse de communiquer avec le serveur car le certificat de mitmproxy n'est pas accepté. On pense alors à tort que l'application est sécurisée.

✅ **Solution** : utiliser Frida pour contourner le certificate pinning avant l'interception. Ce n'est pas parce que l'interception échoue que l'application est sécurisée : le certificate pinning est un contrôle de sécurité côté client qui peut être contourné sur un appareil rooté.

---

### Piège 2 : Connecter VCC sur un port UART

⚠️ **Problème** : connecter le pin VCC (alimentation) de l'adaptateur USB-UART au pin VCC de l'appareil IoT. Si les tensions sont différentes (3.3V vs 5V), cela peut détruire le composant de l'appareil.

✅ **Solution** : ne jamais connecter VCC. Connecter uniquement GND, TX et RX. L'appareil est déjà alimenté par sa propre source. Vérifier la tension avec un multimètre avant toute connexion.

---

### Piège 3 : Scanner le réseau d'appareils IoT en production

⚠️ **Problème** : lancer un scan nmap intensif sur un réseau contenant des appareils IoT. Beaucoup d'appareils IoT ont des piles réseau fragiles et peuvent crasher ou redémarrer lors d'un scan.

✅ **Solution** : utiliser des scans passifs (écoute réseau) ou des scans très légers (`nmap -sn` pour le ping scan uniquement). Tester d'abord sur un appareil isolé avant de scanner un réseau complet.

---

### Piège 4 : Oublier de re-signer un APK modifié

⚠️ **Problème** : modifier un APK (avec apktool) et essayer de l'installer sans le re-signer. Android refuse d'installer un APK dont la signature ne correspond pas.

✅ **Solution** : après modification, re-signer l'APK avec un certificat de debug.

```bash
# Reconstruire l'APK modifié
apktool b output_apktool/ -o modified.apk

# Signer avec un certificat de debug
apksigner sign --ks ~/.android/debug.keystore --ks-pass pass:android modified.apk

# Installer sur l'appareil
adb install modified.apk
```

---

## Checklist de Validation

- [ ] Je sais décompiler un APK Android avec jadx et apktool
- [ ] Je sais chercher des secrets (clés API, mots de passe) dans un APK décompilé
- [ ] Je sais intercepter le trafic HTTPS d'une application mobile avec mitmproxy
- [ ] Je comprends le rôle de Frida pour l'analyse dynamique et le bypass de protections
- [ ] Je connais l'OWASP Mobile Top 10 et ses 10 catégories
- [ ] Je sais extraire un firmware IoT avec binwalk
- [ ] Je comprends les interfaces hardware (UART, JTAG, SPI) et leur rôle
- [ ] Je connais les principaux protocoles radio IoT et leurs vulnérabilités
- [ ] Je sais utiliser screen ou minicom pour une connexion UART
- [ ] Je comprends les différences de modèle de sécurité entre Android et iOS

---

## Exercice Pratique

**Énoncé** : Tu audites une caméra IP connectée destinée à la surveillance domestique. Le fabricant t'a fourni le fichier firmware (firmware_camera_v2.3.bin) et un exemplaire physique de l'appareil. Réalise un audit de sécurité complet.

**Indications** :

- Commence par l'extraction et l'analyse du firmware
- Cherche les identifiants par défaut, clés codées en dur et services exposés
- Analyse l'architecture réseau de la caméra (ports ouverts, protocoles)
- Identifie les interfaces physiques (UART, JTAG) sur le PCB
- Vérifie le mécanisme de mise à jour du firmware
- Rédige un rapport avec les vulnérabilités trouvées et les recommandations

**Résultat attendu** : un rapport d'audit structuré couvrant les aspects firmware, réseau, hardware et recommandations.

---

## Solution de l'Exercice

> **Note** : cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**1. Analyse du firmware** :

```bash
# Extraction
binwalk -e firmware_camera_v2.3.bin

# Résultat de l'extraction :
# squashfs-root/ contenant un Linux embarqué (BusyBox)
```

**Vulnérabilités firmware trouvées** :

| # | Vulnérabilité | Sévérité | Détail |
| - | ------------- | -------- | ------ |
| F1 | Mot de passe root codé en dur | Critique | `/etc/shadow` : `root:$1$camera:0:0:root:/root:/bin/sh` - hash cassable en secondes |
| F2 | Clé privée SSL embarquée | Critique | `/etc/ssl/private/camera.key` - identique sur tous les appareils du même modèle |
| F3 | Mise à jour en HTTP | Élevé | Script `/usr/bin/update.sh` télécharge via `http://` sans vérification de signature |
| F4 | Service Telnet activé | Élevé | `/etc/init.d/S50telnet` - Telnet démarre automatiquement au boot |
| F5 | BusyBox obsolète | Modéré | Version 1.28.0 avec CVE connues |

**2. Analyse réseau** :

```text
Ports ouverts sur la caméra :
PORT     SERVICE        REMARQUE
23/tcp   Telnet         Accès shell en clair (à désactiver)
80/tcp   HTTP           Interface web sans HTTPS
554/tcp  RTSP           Flux vidéo sans authentification
8080/tcp HTTP API       API REST sans authentification
8554/tcp RTSP alt       Flux vidéo secondaire
```

**3. Analyse hardware** :

```text
PCB de la caméra :
- Port UART identifié (4 pins, baud rate 115200)
- Console root accessible sans mot de passe via UART
- Puce flash SPI (Winbond W25Q128) lisible avec CH341A
- Pas de secure boot : firmware modifiable et réinstallable
```

**4. Recommandations** :

| # | Recommandation | Priorité |
| - | -------------- | -------- |
| R1 | Générer un mot de passe unique par appareil (basé sur le numéro de série) | Critique |
| R2 | Générer un certificat SSL unique par appareil | Critique |
| R3 | Passer la mise à jour en HTTPS avec vérification de signature | Critique |
| R4 | Désactiver Telnet, utiliser SSH si un accès distant est nécessaire | Élevé |
| R5 | Activer l'authentification sur les flux RTSP et l'API REST | Élevé |
| R6 | Implémenter le secure boot pour empêcher la modification du firmware | Élevé |
| R7 | Désactiver le port UART en production ou protéger par mot de passe | Modéré |
| R8 | Mettre à jour BusyBox vers la dernière version | Modéré |

---

## Navigation

← Fiche précédente : **[03 - Sécurité de l'IA et Machine Learning](03-securite-ia-machine-learning.md)**

→ Fiche suivante : **[05 - DevSecOps et Sécurité Applicative](05-devsecops.md)**
