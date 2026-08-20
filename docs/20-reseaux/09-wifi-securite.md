---
tags:
  - Réseaux
  - Intermédiaire
  - Concept
description: "Wi-Fi et sécurité sans fil : normes 802.11, WPA2/WPA3, canaux, débit, sécurisation des réseaux sans fil."
estimated_time: "60 min"
fiche_number: 9
total_fiches: 14
cursus: "Réseaux"
---

# 09 - Wi-Fi et sécurité sans fil

> **En bref** : Tu découvriras comment fonctionne le Wi-Fi (normes 802.11), les différences entre WPA2 et WPA3, comment les canaux et les fréquences affectent le débit, et comment sécuriser un réseau sans fil. Lecture estimée : 60 min.

## Prérequis

- Avoir lu la fiche [08 - Services réseau](08-services-reseau.md)
- Connaître les bases de TCP/IP (adresses IP, adresses MAC)
- Comprendre les notions de chiffrement (clé, algorithme)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer le fonctionnement du Wi-Fi, choisir le bon protocole de sécurité, analyser les canaux et les fréquences disponibles, et configurer un réseau sans fil sécurisé.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le Wi-Fi ?

**Définition** : Le Wi-Fi est une technologie de réseau local sans fil basée sur la norme IEEE 802.11. Il permet a des appareils de communiquer par ondes radio sans cable Ethernet. Un point d'accès (AP - Access Point) fait le lien entre le réseau sans fil et le réseau cable.

**Le problème que le Wi-Fi résout** :

Sans Wi-Fi, voici les problèmes rencontres :

1. **Cables partout** : Chaque appareil doit être relie physiquement au réseau par un cable Ethernet. Les appareils mobiles (ordinateurs portables, telephones, tablettes) ne peuvent pas être utilises en deplacement dans un bâtiment.
2. **Infrastructure lourde** : Ajouter un poste de travail necessite de tirer un cable supplémentaire, ce qui implique des travaux.
3. **Pas de mobilite** : Un poste cable est fixe. Changer de bureau signifie debrancher, deplacer et rebrancher le cable.

**Comment le Wi-Fi résout ces problèmes** :

| Problème | Solution apportée par le Wi-Fi |
| --- | --- |
| Cables partout | Les appareils se connectent par ondes radio |
| Infrastructure lourde | Un seul point d'accès couvre une zone entière |
| Pas de mobilite | L'appareil se deplace librement dans la zone de couverture |

**Analogie concrète** : Le Wi-Fi fonctionne comme une radio FM. La station de radio (le point d'accès) emet un signal sur une fréquence spécifique (le canal). Ton poste de radio (ton ordinateur) capte ce signal dans un rayon donne. Si tu t'eloignes trop, le signal faiblit et la qualité diminue. Si une autre station emet sur la même fréquence, il y a des interférences.

**Ce que le Wi-Fi n'est PAS** :

- Le Wi-Fi n'est pas Internet. C'est une technologie de réseau local. Un point d'accès Wi-Fi sans connexion Internet te permet de communiquer avec les autres appareils du réseau local, mais pas de naviguer sur le web.
- Le Wi-Fi n'est pas le Bluetooth. Le Bluetooth est conçu pour les connexions courte portée (quelques metres) entre deux appareils. Le Wi-Fi couvre des dizaines de metres et connecte plusieurs appareils a un réseau.

---

### Quelles sont les normes 802.11 ?

**Définition** : Les normes IEEE 802.11 définissent les specifications techniques du Wi-Fi. Chaque génération apporte des ameliorations en débit, portée et fiabilité.

**Tableau des normes Wi-Fi** :

| Norme | Nom commercial | Fréquence | Débit max theorique | Année |
| --- | --- | --- | --- | --- |
| 802.11b | Wi-Fi 1 | 2.4 GHz | 11 Mbit/s | 1999 |
| 802.11a | Wi-Fi 2 | 5 GHz | 54 Mbit/s | 1999 |
| 802.11g | Wi-Fi 3 | 2.4 GHz | 54 Mbit/s | 2003 |
| 802.11n | Wi-Fi 4 | 2.4 + 5 GHz | 600 Mbit/s | 2009 |
| 802.11ac | Wi-Fi 5 | 5 GHz | 6.9 Gbit/s | 2013 |
| 802.11ax | Wi-Fi 6 | 2.4 + 5 GHz | 9.6 Gbit/s | 2019 |
| 802.11ax | Wi-Fi 6E | 2.4 + 5 + 6 GHz | 9.6 Gbit/s | 2021 |
| 802.11be | Wi-Fi 7 | 2.4 + 5 + 6 GHz | 46 Gbit/s | 2024 |

**Fréquences 2.4 GHz vs 5 GHz** :

| Caractéristique | 2.4 GHz | 5 GHz |
| --- | --- | --- |
| Portee | Plus longue (traverse mieux les murs) | Plus courte |
| Débit | Plus faible | Plus élevé |
| Interférences | Plus d'interférences (micro-ondes, Bluetooth, voisins) | Moins d'interférences |
| Canaux disponibles | 3 canaux non chevauchants (1, 6, 11) | 25 canaux non chevauchants |

---

### Qu'est-ce qu'un canal Wi-Fi ?

**Définition** : Un canal Wi-Fi est une subdivision de la bande de fréquence utilisée. Chaque point d'accès emet sur un canal spécifique. Si deux points d'accès voisins utilisent le meme canal ou des canaux chevauchants, il y a des interférences qui reduisent le débit.

**Le problème que les canaux résolvent** :

Sans canaux separes, tous les points d'accès emettraient sur la même fréquence exacte. Les signaux se superposeraient et aucun appareil ne pourrait communiquer correctement. Les canaux divisent la bande de fréquence en segments distincts pour réduire les interférences.

**Canaux recommandes en 2.4 GHz** :

```text
Canal 1   Canal 6   Canal 11
  |         |         |
  v         v         v
|-----|   |-----|   |-----|
  2412     2437     2462   MHz

Les canaux 1, 6 et 11 ne se chevauchent pas.
Les canaux intermediaires (2, 3, 4, 5, 7, 8, 9, 10)
chevauchent les canaux voisins et causent des interferences.
```

**Analogie concrète** : Les canaux Wi-Fi sont comme les voies d'une autoroute. Si tout le monde roule sur la même voie, c'est l'embouteillage. En repartissant les voitures sur trois voies séparées (canaux 1, 6, 11), le trafic est fluide. Mais si quelqu'un roule entre deux voies (canal 3), il gene les deux voies adjacentes.

---

### Qu'est-ce que WPA2/WPA3 ?

**Définition** : WPA2 (Wi-Fi Protected Access 2) et WPA3 sont des protocoles de sécurité qui chiffrent les communications Wi-Fi et authentifient les appareils qui se connectent.

**Le problème que WPA2/WPA3 résolvent** :

Sans chiffrement Wi-Fi, voici les problèmes rencontres :

1. **Écoute passive** : N'importe qui a portée du signal peut capturer tout le trafic réseau avec un simple outil comme Wireshark. Mots de passe, e-mails, pages web : tout est lisible.
2. **Connexion non autorisée** : N'importe quel appareil peut se connecter au réseau sans mot de passe et utiliser la bande passante ou accéder aux ressources partagées.
3. **Usurpation de point d'accès** : Un attaquant peut créer un faux point d'accès avec le même nom (SSID) et intercepter le trafic des victimes qui s'y connectent.

**Comment WPA2/WPA3 résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Écoute passive | Chiffrement AES de tout le trafic |
| Connexion non autorisée | Authentification par mot de passe ou certificat |
| Usurpation de point d'accès | WPA3 ajoute l'authentification mutuelle (SAE) |

**Évolution des protocoles de sécurité Wi-Fi** :

| Protocole | Chiffrement | Année | Sécurité |
| --- | --- | --- | --- |
| WEP | RC4 (64 ou 128 bits) | 1999 | Casse en quelques minutes - ne jamais utiliser |
| WPA | TKIP (RC4 ameliore) | 2003 | Vulnérable - ne plus utiliser |
| WPA2 | AES-CCMP (128 bits) | 2004 | Sécurisé avec un mot de passe fort |
| WPA3 | SAE + AES-CCMP-128 (minimum) ; GCMP-256 en WPA3-Enterprise 192-bit | 2018 | Plus sécurisé, protection contre les attaques par dictionnaire hors-ligne |

**Comparaison WPA2 vs WPA3** :

| WPA2 | WPA3 |
| --- | --- |
| Échange de clés PSK (4-way handshake) | Échange de clés SAE (Simultaneous Authentication of Equals) |
| Vulnérable aux attaques par dictionnaire hors-ligne | Resistant aux attaques par dictionnaire hors-ligne |
| Pas de chiffrement individuel | Chiffrement individuel par appareil (forward secrecy) |
| Pas de protection contre les evil twins | Protection contre les evil twins via PMF (Protected Management Frames) |
| Supporte par tous les appareils | Necessite des appareils recents |

**Ce que WPA2/WPA3 ne sont PAS** :

- WPA2/WPA3 ne protegent pas contre les attaques sur les applications (injection SQL, XSS). Ils protegent uniquement la couche de transport sans fil.
- WPA2/WPA3 ne remplacent pas un VPN. Le chiffrement Wi-Fi protégé le trafic entre ton appareil et le point d'accès. Après le point d'accès, le trafic circule normalement sur le réseau cable.

---

## Étapes Pratiques

### Étape 1 : Identifier les interfaces Wi-Fi

```bash
# Liste les interfaces reseau sans fil
iw dev
```

**Résultat attendu** :

```text
phy#0
    Interface wlan0
        ifindex 3
        wdev 0x1
        addr aa:bb:cc:dd:ee:ff
        type managed
        channel 6 (2437 MHz), width: 20 MHz, center1: 2437 MHz
```

```bash
# Affiche les capacites de la carte Wi-Fi
iw phy phy0 info | grep -E "Band|Frequencies|max"
```

---

### Étape 2 : Scanner les réseaux Wi-Fi disponibles

```bash
# Scanne les reseaux Wi-Fi a portee
sudo iw dev wlan0 scan | grep -E "SSID:|signal:|freq:|RSN:" | head -20
```

**Résultat attendu** :

```text
    freq: 2437
    signal: -45.00 dBm
    SSID: MonReseau
    RSN:     * Version: 1
    freq: 5180
    signal: -62.00 dBm
    SSID: Voisin_5GHz
    RSN:     * Version: 1
```

```bash
# Alternative plus lisible avec nmcli
nmcli device wifi list
```

**Résultat attendu** :

```text
IN-USE  BSSID              SSID           MODE   CHAN  RATE       SIGNAL  BARS  SECURITY
*       AA:BB:CC:DD:EE:FF  MonReseau      Infra  6     270 Mbit/s  89     ****  WPA2
        11:22:33:44:55:66  Voisin_5GHz    Infra  36    540 Mbit/s  45     **    WPA2
        77:88:99:AA:BB:CC  CafeLibre      Infra  1     54 Mbit/s   30     *     --
```

---

### Étape 3 : Analyser les canaux Wi-Fi

```bash
# Affiche l'utilisation des canaux 2.4 GHz autour de toi
sudo iw dev wlan0 scan | grep -E "freq:|SSID:" | paste - - | sort
```

```bash
# Utilise wavemon pour une vue en temps reel (si installe)
sudo apt install -y wavemon
wavemon
```

```bash
# Affiche le canal et la qualite de la connexion actuelle
iwconfig wlan0
```

**Résultat attendu** :

```text
wlan0     IEEE 802.11  ESSID:"MonReseau"
          Mode:Managed  Frequency:2.437 GHz  Access Point: AA:BB:CC:DD:EE:FF
          Bit Rate=270 Mbit/s   Tx-Power=20 dBm
          Link Quality=65/70  Signal level=-45 dBm
          Rx invalid nwid:0  Rx invalid crypt:0  Rx invalid frag:0
```

---

### Étape 4 : Se connecter a un réseau Wi-Fi en ligne de commande

```bash
# Connexion avec nmcli (NetworkManager)
nmcli device wifi connect "MonReseau" password "mot_de_passe_wifi"
```

**Résultat attendu** :

```text
Device 'wlan0' successfully activated with 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.
```

```bash
# Verifie la connexion
nmcli connection show --active
```

**Résultat attendu** :

```text
NAME        UUID                                  TYPE   DEVICE
MonReseau   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  wifi   wlan0
```

```bash
# Alternative avec wpa_supplicant (sans NetworkManager)
# Cree le fichier de configuration
wpa_passphrase "MonReseau" "mot_de_passe_wifi" | sudo tee /etc/wpa_supplicant/wpa_supplicant.conf

# Lance la connexion
sudo wpa_supplicant -B -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf

# Obtiens une adresse IP via DHCP
sudo dhclient wlan0
```

---

### Étape 5 : Verifier la sécurité d'un réseau Wi-Fi

```bash
# Affiche les details de securite du reseau connecte
nmcli -f GENERAL,WIFI-PROPERTIES,AP connection show "MonReseau"
```

```bash
# Verifie le protocole de securite utilise
iw dev wlan0 link
```

**Résultat attendu** :

```text
Connected to aa:bb:cc:dd:ee:ff (on wlan0)
    SSID: MonReseau
    freq: 2437
    RX: 123456 bytes (1234 packets)
    TX: 654321 bytes (4321 packets)
    signal: -45 dBm
    tx bitrate: 270.0 MBit/s MCS 15 short GI
```

```bash
# Teste la force du signal en te deplacant
watch -n 1 "iw dev wlan0 link | grep signal"
```

---

### Étape 6 : Configurer un point d'accès Wi-Fi (hostapd)

```bash
# Installe hostapd
sudo apt install -y hostapd

# Cree la configuration du point d'acces
sudo tee /etc/hostapd/hostapd.conf << 'EOF'
# Interface sans fil
interface=wlan0

# Nom du reseau (SSID)
ssid=MonAP

# Mode de fonctionnement (a = 5 GHz, g = 2.4 GHz)
hw_mode=g

# Canal
channel=6

# Securite WPA2
wpa=2
wpa_passphrase=MotDePasseSecurise123
wpa_key_mgmt=WPA-PSK
rsn_pairwise=CCMP

# Active la norme 802.11n
ieee80211n=1
wmm_enabled=1
EOF
```

```bash
# Demarre le point d'acces
sudo systemctl unmask hostapd
sudo systemctl start hostapd
sudo systemctl status hostapd
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `iw dev` | Liste les interfaces sans fil |
| `iw dev wlan0 scan` | Scanne les réseaux Wi-Fi |
| `iw dev wlan0 link` | Affiche la connexion Wi-Fi en cours |
| `iwconfig wlan0` | Affiche les paramètres Wi-Fi (canal, débit, signal) |
| `nmcli device wifi list` | Liste les réseaux disponibles |
| `nmcli device wifi connect "SSID" password "pass"` | Se connecte a un réseau |
| `nmcli connection show --active` | Affiche les connexions actives |
| `wavemon` | Monitoring Wi-Fi en temps réel |
| `sudo hostapd /etc/hostapd/hostapd.conf` | Lance un point d'accès |
| `wpa_supplicant -B -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf` | Connexion manuelle |

---

## Pièges Fréquents

### Piège 1 : Canal Wi-Fi sature

⚠️ **Problème** : Ton réseau Wi-Fi est lent alors que la connexion Internet est rapide. En 2.4 GHz, tous tes voisins utilisent le meme canal que toi.

✅ **Solution** : Scanne les canaux utilises et choisis un canal libre parmi 1, 6 ou 11 :

```bash
# Regarde quels canaux sont utilises
sudo iw dev wlan0 scan | grep -E "freq:|SSID:" | paste - -
```

Change le canal dans la configuration de ton point d'accès (interface web du routeur ou fichier hostapd.conf).

---

### Piège 2 : Réseau ouvert (sans mot de passe)

⚠️ **Problème** : Tu te connectes a un réseau Wi-Fi public sans mot de passe (cafe, hôtel). Tout ton trafic non chiffre (HTTP) est lisible par n'importe qui sur le meme réseau.

✅ **Solution** : Utilise un VPN ou verifie que tous les sites sont en HTTPS. Ne transmets jamais d'informations sensibles sur un réseau ouvert sans protection supplémentaire.

---

### Piège 3 : WEP ou WPA encore utilise

⚠️ **Problème** : Ton routeur utilise encore WEP ou WPA (sans le "2"). Ces protocoles sont casses et un attaquant peut récupérer le mot de passe en quelques minutes.

✅ **Solution** : Configure ton routeur en WPA2-AES minimum. Si tes appareils le supportent, utilise WPA3 :

```text
Securite recommandee (du meilleur au pire) :
1. WPA3 (si tous les appareils le supportent)
2. WPA2-AES (WPA2-CCMP) - standard minimum
3. WPA2-TKIP - acceptable mais a eviter
4. WPA - ne plus utiliser
5. WEP - dangereux, ne jamais utiliser
6. Ouvert - aucune securite
```

---

### Piège 4 : SSID cache = fausse sécurité

⚠️ **Problème** : Tu caches le SSID (nom du réseau) en pensant que cela empêche les attaquants de le trouver. En réalité, le SSID est transmis en clair dans les trames de probe request/response a chaque fois qu'un appareil se connecte.

✅ **Solution** : Un SSID cache n'apporte aucune sécurité réelle. Concentre-toi sur un mot de passe fort et WPA2/WPA3 plutôt que sur la dissimulation du nom du réseau.

---

## Checklist de Validation

- [ ] Je sais expliquer la difference entre les fréquences 2.4 GHz et 5 GHz
- [ ] Je connais les canaux non chevauchants en 2.4 GHz (1, 6, 11)
- [ ] Je sais scanner les réseaux Wi-Fi avec iw ou nmcli
- [ ] Je connais les differences entre WEP, WPA, WPA2 et WPA3
- [ ] Je sais me connecter a un réseau Wi-Fi en ligne de commande
- [ ] Je comprends pourquoi un SSID cache n'est pas une mesure de sécurité
- [ ] Je sais configurer un point d'accès avec hostapd
- [ ] Je sais choisir le bon canal pour éviter les interférences

---

## Exercice Pratique

**Énoncé** : Réalise un audit de sécurité du réseau Wi-Fi de ton environnement. Tu dois :

1. Scanner tous les réseaux Wi-Fi a portée
2. Pour chaque réseau, noter : SSID, canal, fréquence, signal, protocole de sécurité
3. Identifier les réseaux qui utilisent un protocole obsolète (WEP, WPA)
4. Identifier les canaux les plus utilises en 2.4 GHz et recommander un canal optimal
5. Verifier la configuration de sécurité de ton propre réseau

**Indications** :

- Utilise `nmcli device wifi list` ou `sudo iw dev wlan0 scan`
- Les canaux non chevauchants en 2.4 GHz sont 1, 6 et 11
- Un signal supérieur a -50 dBm est excellent, entre -50 et -70 dBm est correct, en dessous de -70 dBm est faible
- Verifie que ton réseau utilise au minimum WPA2-AES

**Résultat attendu** : Un rapport d'audit avec la liste des réseaux, l'analyse des canaux et des recommandations de sécurité.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**Étape 1 - Scanner les réseaux** :

```bash
nmcli device wifi list
```

**Étape 2 - Tableau des réseaux** :

| SSID | Canal | Fréquence | Signal | Sécurité |
| --- | --- | --- | --- | --- |
| MonReseau | 6 | 2.4 GHz | -45 dBm | WPA2 |
| Voisin1 | 6 | 2.4 GHz | -62 dBm | WPA2 |
| Voisin2 | 1 | 2.4 GHz | -70 dBm | WEP |
| Voisin3 | 11 | 2.4 GHz | -68 dBm | WPA |
| Bureau_5G | 36 | 5 GHz | -55 dBm | WPA3 |

**Étape 3 - Réseaux avec protocole obsolète** :

- Voisin2 utilise WEP : ce protocole est casse. Le mot de passe peut être récupère en quelques minutes.
- Voisin3 utilise WPA (sans "2") : vulnérable, a mettre a jour vers WPA2 minimum.

**Étape 4 - Analyse des canaux 2.4 GHz** :

```text
Canal 1  : 1 reseau (Voisin2)
Canal 6  : 2 reseaux (MonReseau, Voisin1) - sature
Canal 11 : 1 reseau (Voisin3)
```

Recommandation : si possible, changer MonReseau vers le canal 11 ou le canal 1 pour réduire les interférences avec Voisin1 sur le canal 6.

**Étape 5 - Vérification de la sécurité** :

```bash
# Verifie la securite de la connexion active
iw dev wlan0 link
nmcli -f WIFI-SEC connection show "MonReseau"
```

Recommandation : WPA2 est acceptable. Migrer vers WPA3 si tous les appareils le supportent. Utiliser un mot de passe d'au moins 12 caractères.

---

## Navigation

← Fiche précédente : **[08 - Services réseau](08-services-reseau.md)**

→ Fiche suivante : **[10 - Diagnostic et outils](10-diagnostic-outils.md)**
