---
tags:
  - Cybersécurité
  - Avancé
  - Concept
description: "Sécuriser les environnements industriels : Purdue Model, protocoles OT, convergence IT/OT, IEC 62443"
estimated_time: "45 min"
fiche_number: 2
total_fiches: 5
cursus: "Phase 6 - Domaines Avancés"
---

# 02 - Sécurité OT/ICS/SCADA

> **En bref** : À la fin de cette fiche, tu sauras expliquer les différences fondamentales entre la sécurité IT et OT, décrire l'architecture Purdue Model, identifier les protocoles industriels et leurs vulnérabilités, et appliquer les principes de sécurisation des environnements OT selon la norme IEC 62443. Lecture estimée : 45 min.


## Prérequis

- [Phase 2, fiche 03 - Sécurité des réseaux](../02-fondamentaux-securite/03-securite-reseaux.md) (pare-feu, IDS/IPS, segmentation)
- [Phase 3, fiche 01 - Sécurité des systèmes d'exploitation](../03-competences-intermediaires/01-securite-systemes-exploitation.md)
- Connaissances de base en réseau TCP/IP
- Notion de ce qu'est un système d'exploitation temps réel (RTOS) - expliqué ci-dessous

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer les différences fondamentales entre la sécurité IT et OT, décrire l'architecture Purdue Model, identifier les protocoles industriels et leurs vulnérabilités, et appliquer les principes de sécurisation des environnements OT selon la norme IEC 62443.

---

## Concepts

### Qu'est-ce que l'OT (Operational Technology) ?

**Définition** : l'OT (Operational Technology) désigne l'ensemble des matériels et logiciels qui détectent ou provoquent des changements dans des processus physiques. Cela inclut les systèmes de contrôle industriel (ICS), les automates programmables (PLC), les systèmes SCADA et les capteurs/actionneurs qui pilotent des équipements physiques (vannes, moteurs, turbines).

**Le problème que la sécurité OT résout** :

1. **Impact physique** : une attaque sur un système OT peut provoquer des dégâts matériels, des explosions, des déversements de produits chimiques ou des coupures d'énergie affectant des millions de personnes
2. **Systèmes hérités** : les équipements OT ont des durées de vie de 20 à 30 ans. Beaucoup fonctionnent sous Windows XP ou des OS propriétaires sans mise à jour de sécurité
3. **Convergence IT/OT** : la connexion croissante des réseaux industriels à Internet expose des systèmes conçus pour fonctionner en réseau isolé
4. **Manque d'expertise** : peu de professionnels maîtrisent à la fois la cybersécurité et les processus industriels

**Comment la sécurité OT résout ces problèmes** :

| Problème | Solution apportée par la sécurité OT |
| -------- | ------------------------------------ |
| Impact physique | Segmentation stricte, monitoring passif, plans de réponse adaptés |
| Systèmes hérités | Compensation par des contrôles réseau (data diodes, pare-feu OT) |
| Convergence IT/OT | DMZ industrielle, contrôle des flux entre les zones |
| Manque d'expertise | Normes dédiées (IEC 62443), formations spécialisées |

**Analogie concrète** : imagine une centrale électrique comme une cuisine de restaurant. L'IT, c'est le système de caisse et de réservation (si la caisse tombe en panne, le restaurant peut continuer à servir les plats). L'OT, ce sont les fours, les plaques de cuisson et le système de ventilation. Si un four devient incontrôlable, il y a un risque d'incendie réel. On ne peut pas "redémarrer" un four industriel en pleine cuisson comme on redémarre un ordinateur.

**Ce que l'OT n'est PAS** :

- L'OT n'est pas de l'IT avec des machines plus anciennes. Les priorités sont fondamentalement différentes : l'OT privilégie la disponibilité et la sûreté de fonctionnement avant la confidentialité
- L'OT n'est pas un domaine obsolète. Les usines modernes utilisent l'IoT industriel (IIoT), l'IA prédictive et le cloud edge, ce qui crée de nouveaux vecteurs d'attaque

**Comparaison IT vs OT** :

| Critère | IT | OT |
| ------- | -- | -- |
| Priorité CIA | Confidentialité > Intégrité > Disponibilité | Disponibilité > Intégrité > Confidentialité |
| Durée de vie | 3-5 ans | 15-30 ans |
| Mise à jour | Régulière (mensuelle) | Rare (annuelle au mieux, lors d'un arrêt planifié) |
| Tolérance aux pannes | Redémarrage acceptable | Arrêt = perte de production ou danger |
| Protocoles | TCP/IP, HTTP, DNS | Modbus, DNP3, OPC UA, S7comm |
| Scan de vulnérabilités | Standard et automatisé | Risqué : peut planter un automate |
| Temps de réponse | Secondes à minutes | Millisecondes (temps réel) |

---

### Qu'est-ce que le Purdue Model ?

**Définition** : le Purdue Model (aussi appelé Purdue Enterprise Reference Architecture - PERA) est un modèle de référence qui organise les systèmes industriels en niveaux hiérarchiques, du terrain (capteurs/actionneurs) jusqu'aux systèmes d'entreprise. Il sert de base à la segmentation réseau en environnement OT.

**Les niveaux du Purdue Model** :

| Niveau | Nom | Exemples de systèmes | Rôle |
| ------ | --- | -------------------- | ---- |
| 5 | Enterprise Network | ERP, messagerie, Internet | Gestion d'entreprise |
| 4 | Site Business Planning | Serveurs de planification, bases de données | Planification de la production |
| 3.5 | DMZ industrielle | Pare-feu, serveurs de données historiques | Zone tampon entre IT et OT |
| 3 | Site Operations | Historiens, serveurs SCADA | Supervision et gestion des opérations |
| 2 | Area Supervisory Control | HMI, stations d'ingénierie | Interface opérateur, contrôle de zone |
| 1 | Basic Control | PLC, RTU, DCS | Contrôle des processus |
| 0 | Process | Capteurs, actionneurs, vannes, moteurs | Interaction physique avec le processus |

**Analogie concrète** : le Purdue Model fonctionne comme les étages d'un bâtiment sécurisé. Au sous-sol (niveau 0), les machines fonctionnent. Au rez-de-chaussée (niveaux 1-2), les opérateurs les surveillent. Aux étages supérieurs (niveaux 3-5), les managers planifient. Pour monter d'un étage, il faut passer un contrôle de sécurité (pare-feu). Un visiteur du 5e étage ne peut jamais descendre directement au sous-sol : il doit passer par chaque étage intermédiaire.

**Le problème que le Purdue Model résout** :

1. **Communications non contrôlées** : sans segmentation, un poste bureautique infecté pourrait communiquer directement avec un automate
2. **Propagation latérale** : un malware qui entre par le réseau IT pourrait se propager jusqu'aux systèmes de contrôle
3. **Absence de visibilité** : sans structure, il est impossible de savoir quels flux de communication sont légitimes

---

### Quels sont les protocoles industriels ?

**Définition** : les protocoles industriels sont des standards de communication utilisés pour échanger des données entre les systèmes de contrôle (PLC, RTU, SCADA) et les capteurs/actionneurs. La plupart ont été conçus pour la fiabilité, pas pour la sécurité.

**Principaux protocoles** :

| Protocole | Usage | Port | Sécurité native | Vulnérabilités connues |
| --------- | ----- | ---- | ---------------- | ---------------------- |
| Modbus TCP | Le plus répandu, lecture/écriture registres | 502 | Aucune authentification | Replay, injection de commandes |
| DNP3 | Distribution électrique, eau | 20000 | Secure Authentication v5 (optionnel) | Man-in-the-middle |
| OPC UA | Standard moderne, remplacement OPC Classic | 4840 | TLS, authentification par certificats | Complexité d'implémentation |
| S7comm | Automates Siemens (S7-300/400) | 102 | Aucune | Lecture/écriture mémoire à distance |
| EtherNet/IP | Automates Allen-Bradley, Rockwell | 44818 | Aucune (CIP Security en option) | Énumération, DoS |
| BACnet | Bâtiments intelligents (CVC, éclairage) | 47808 | Aucune | Modification de consignes |

**Le problème fondamental** : la majorité des protocoles OT n'ont pas d'authentification. N'importe qui sur le réseau peut envoyer une commande à un automate. C'est comme si la porte de la salle des machines n'avait pas de serrure.

---

### Qu'est-ce que la convergence IT/OT ?

**Définition** : la convergence IT/OT est le processus de connexion des réseaux informatiques d'entreprise (IT) avec les réseaux de contrôle industriel (OT). Cette convergence est motivée par le besoin de données temps réel pour optimiser la production (Industrie 4.0).

**Le problème que la convergence crée** :

1. **Surface d'attaque élargie** : les systèmes OT, autrefois isolés, deviennent accessibles depuis le réseau IT et potentiellement depuis Internet
2. **Incompatibilité des pratiques** : les équipes IT appliquent des patchs régulièrement alors que les systèmes OT ne peuvent pas être arrêtés pour mise à jour
3. **Conflits culturels** : les ingénieurs OT et les informaticiens IT ont des priorités et un vocabulaire différents

**Exemples d'incidents réels liés à la convergence** :

| Incident | Année | Impact |
| -------- | ----- | ------ |
| Stuxnet | 2010 | Destruction de centrifugeuses nucléaires iraniennes via un ver informatique ciblant les PLC Siemens |
| Attaque réseau électrique ukrainien | 2015 | Coupure d'électricité pour 230 000 personnes pendant plusieurs heures |
| TRITON/TRISIS | 2017 | Ciblage du système de sûreté (SIS) d'une usine pétrochimique saoudienne |
| Colonial Pipeline | 2021 | Arrêt du plus grand pipeline de carburant aux États-Unis suite à un ransomware |
| Attaque station de traitement d'eau Oldsmar | 2021 | Tentative de modification du taux de soude caustique dans l'eau potable |

---

### Comment sécuriser un environnement OT ?

**Définition** : la sécurisation OT repose sur des contrôles compensatoires adaptés aux contraintes des systèmes industriels : on ne peut pas patcher facilement, on ne peut pas installer d'antivirus partout, et on ne peut pas scanner les réseaux de manière agressive.

**Stratégies de sécurisation** :

| Stratégie | Description | Outils |
| --------- | ----------- | ------ |
| Segmentation réseau | Séparer les niveaux du Purdue Model avec des pare-feu industriels | Fortinet FortiGate Rugged, Palo Alto PA-220R |
| Data diodes | Dispositifs physiques qui permettent le flux de données dans un seul sens | Waterfall, Owl Cyber Defense |
| Monitoring passif | Écouter le trafic réseau sans injecter de paquets (contrairement au scan actif) | Nozomi Networks, Claroty, Dragos |
| Whitelisting applicatif | N'autoriser que les applications connues et approuvées | CyberArk EPM, Carbon Black |
| Gestion des accès distants | Sécuriser les connexions des fournisseurs et mainteneurs | Jump servers, VPN avec MFA |

**IEC 62443** : la norme internationale de référence pour la sécurité des systèmes d'automatisation et de contrôle industriels. Elle définit :

- Des niveaux de sécurité (SL 1 à SL 4) correspondant au niveau de menace
- Des exigences pour les fabricants de composants, les intégrateurs et les exploitants
- Un cycle de vie de sécurité pour les systèmes industriels

---

## Étapes Pratiques

### Étape 1 : Identifier les protocoles OT avec Wireshark

Wireshark reconnaît nativement les protocoles industriels. Cette étape montre comment analyser une capture réseau OT.

```bash
# Ouvrir Wireshark et charger une capture réseau OT
# Des captures d'exemple sont disponibles sur :
# https://wiki.wireshark.org/SampleCaptures (section Industrial)

# Filtrer le trafic Modbus TCP
# Dans la barre de filtre Wireshark, saisir :
# modbus

# Filtrer le trafic S7comm (Siemens)
# s7comm

# Filtrer le trafic DNP3
# dnp3

# Filtrer le trafic OPC UA
# opcua
```

**Résultat attendu** :

```text
En filtrant sur "modbus", tu verras des trames comme :

No.  Time     Source        Destination   Protocol  Info
1    0.000    192.168.1.10  192.168.1.20  Modbus    Query: Trans: 1; Unit: 1, Func: 3: Read Holding Registers
2    0.003    192.168.1.20  192.168.1.10  Modbus    Response: Trans: 1; Unit: 1, Func: 3: Read Holding Registers

Func: 3 = lecture de registres (lecture d'une valeur de capteur)
Func: 6 = écriture d'un registre unique (envoi d'une commande)
Func: 16 = écriture de registres multiples

ATTENTION : une trame Func: 6 ou Func: 16 non attendue peut indiquer
une injection de commande malveillante.
```

---

### Étape 2 : Cartographier un réseau OT de manière passive

Le scan actif (nmap) est dangereux en environnement OT car il peut faire planter des automates. Il faut utiliser des méthodes passives.

```bash
# Écouter passivement le trafic réseau avec tcpdump
# (ne génère aucun paquet, écoute seulement)
sudo tcpdump -i eth0 -w capture_ot.pcap -c 10000

# Extraire les adresses IP uniques de la capture
# (identifie les équipements présents sur le réseau)
tcpdump -r capture_ot.pcap -nn | awk '{print $3}' | cut -d. -f1-4 | sort -u

# Identifier les protocoles utilisés sur le réseau
tcpdump -r capture_ot.pcap -nn | awk '{print $NF}' | sort | uniq -c | sort -rn
```

**Résultat attendu** :

```text
Adresses IP identifiées :
192.168.1.10    (probablement station SCADA/HMI)
192.168.1.20    (probablement PLC - communique en Modbus)
192.168.1.21    (probablement PLC - communique en Modbus)
192.168.1.30    (probablement historien de données)
192.168.1.1     (probablement switch/routeur)

Protocoles détectés :
  4521 Modbus
  1203 TCP
   342 ARP
    89 DNS
    12 HTTP
```

---

### Étape 3 : Analyser des trames Modbus avec un script Python

Ce script décode les trames Modbus pour détecter des commandes suspectes (écriture sur des registres critiques).

```python
#!/usr/bin/env python3
"""
Analyse de trames Modbus TCP pour détecter des commandes suspectes.
Ce script lit une capture PCAP et identifie les écritures Modbus.
"""

from scapy.all import rdpcap, TCP

# Codes de fonction Modbus
MODBUS_FUNCTIONS = {
    1: "Read Coils",
    2: "Read Discrete Inputs",
    3: "Read Holding Registers",
    4: "Read Input Registers",
    5: "Write Single Coil",
    6: "Write Single Register",
    15: "Write Multiple Coils",
    16: "Write Multiple Registers",
}

# Les fonctions d'écriture sont potentiellement dangereuses
WRITE_FUNCTIONS = {5, 6, 15, 16}

def analyze_modbus_pcap(pcap_file):
    """Analyse un fichier PCAP pour les trames Modbus suspectes."""
    packets = rdpcap(pcap_file)
    alerts = []

    for pkt in packets:
        # Le port standard Modbus TCP est 502
        if TCP in pkt and (pkt[TCP].dport == 502 or pkt[TCP].sport == 502):
            payload = bytes(pkt[TCP].payload)
            if len(payload) >= 8:
                # En-tête Modbus TCP : Transaction ID (2) + Protocol ID (2)
                # + Length (2) + Unit ID (1) + Function Code (1)
                function_code = payload[7]
                func_name = MODBUS_FUNCTIONS.get(
                    function_code, f"Unknown ({function_code})"
                )

                if function_code in WRITE_FUNCTIONS:
                    alerts.append({
                        "src": pkt.sprintf("%IP.src%"),
                        "dst": pkt.sprintf("%IP.dst%"),
                        "function": func_name,
                        "code": function_code,
                    })

    return alerts

# Exemple d'utilisation
if __name__ == "__main__":
    alerts = analyze_modbus_pcap("capture_ot.pcap")
    for alert in alerts:
        print(
            f"[ALERTE] {alert['src']} -> {alert['dst']} : "
            f"{alert['function']} (code {alert['code']})"
        )
    if not alerts:
        print("Aucune commande d'écriture Modbus détectée.")
```

**Résultat attendu** :

```text
[ALERTE] 192.168.1.50 -> 192.168.1.20 : Write Single Register (code 6)
[ALERTE] 192.168.1.50 -> 192.168.1.21 : Write Multiple Registers (code 16)

Si l'adresse 192.168.1.50 n'est pas une station SCADA légitime,
ces commandes d'écriture indiquent une activité malveillante.
```

---

### Étape 4 : Mettre en place une segmentation réseau OT

Cette étape montre la configuration d'un pare-feu entre les niveaux du Purdue Model.

```text
# Architecture cible (Purdue Model simplifié) :
#
# Niveau 5 (IT)     : 10.0.0.0/24  - Réseau d'entreprise
# DMZ               : 10.1.0.0/24  - Zone tampon
# Niveau 3 (SCADA)  : 10.2.0.0/24  - Serveurs SCADA, historien
# Niveau 1-2 (PLC)  : 10.3.0.0/24  - Automates et HMI
# Niveau 0          : 10.4.0.0/24  - Capteurs/actionneurs (réseau dédié)
```

Exemple de règles de pare-feu (syntaxe iptables simplifiée) :

```bash
# Règle 1 : Autoriser le trafic IT vers la DMZ uniquement (pas directement vers l'OT)
iptables -A FORWARD -s 10.0.0.0/24 -d 10.1.0.0/24 -j ACCEPT
iptables -A FORWARD -s 10.0.0.0/24 -d 10.2.0.0/24 -j DROP
iptables -A FORWARD -s 10.0.0.0/24 -d 10.3.0.0/24 -j DROP
iptables -A FORWARD -s 10.0.0.0/24 -d 10.4.0.0/24 -j DROP

# Règle 2 : Autoriser la DMZ vers le SCADA sur des ports spécifiques
iptables -A FORWARD -s 10.1.0.0/24 -d 10.2.0.0/24 -p tcp --dport 443 -j ACCEPT
iptables -A FORWARD -s 10.1.0.0/24 -d 10.2.0.0/24 -j DROP

# Règle 3 : Autoriser le SCADA vers les PLC en Modbus TCP uniquement
iptables -A FORWARD -s 10.2.0.0/24 -d 10.3.0.0/24 -p tcp --dport 502 -j ACCEPT
iptables -A FORWARD -s 10.2.0.0/24 -d 10.3.0.0/24 -j DROP

# Règle 4 : Bloquer tout trafic initié par les PLC vers la DMZ ou l'IT
iptables -A FORWARD -s 10.3.0.0/24 -d 10.1.0.0/24 -j DROP
iptables -A FORWARD -s 10.3.0.0/24 -d 10.0.0.0/24 -j DROP

# Règle 5 : Le réseau capteurs (niveau 0) ne communique qu'avec les PLC
iptables -A FORWARD -s 10.4.0.0/24 -d 10.3.0.0/24 -j ACCEPT
iptables -A FORWARD -s 10.4.0.0/24 -j DROP
```

**Résultat attendu** :

```text
Avec ces règles en place :
- Le réseau IT ne peut PAS communiquer directement avec les PLC ou capteurs
- Le trafic passe obligatoirement par la DMZ puis par le réseau SCADA
- Seul le protocole Modbus TCP (port 502) est autorisé entre SCADA et PLC
- Les PLC ne peuvent pas initier de connexion vers l'IT (unidirectionnel)
- Les capteurs communiquent uniquement avec les PLC de leur zone

Ce modèle en couches limite la propagation d'un malware :
même si le réseau IT est compromis, le réseau OT reste protégé.
```

---

### Étape 5 : Déployer un monitoring passif avec Zeek

Zeek (anciennement Bro) peut analyser le trafic OT sans interférer avec les équipements.

```bash
# Installer Zeek (Linux)
sudo apt install zeek

# Configurer Zeek pour analyser les protocoles OT
# Éditer le fichier /opt/zeek/share/zeek/site/local.zeek
# et ajouter les lignes suivantes :
# @load protocols/modbus
# @load protocols/dnp3
# @load protocols/s7comm

# Lancer Zeek sur une interface réseau (mode passif)
sudo zeek -i eth0 local.zeek

# Analyser les logs générés
# Zeek crée des fichiers de log structurés :
# - conn.log : toutes les connexions réseau
# - modbus.log : trames Modbus décodées
# - dnp3.log : trames DNP3 décodées
# - weird.log : anomalies détectées
```

```bash
# Lire les logs Modbus générés par Zeek
cat modbus.log | zeek-cut ts id.orig_h id.resp_h func

# Chercher les commandes d'écriture Modbus (fonctions 5, 6, 15, 16)
cat modbus.log | zeek-cut ts id.orig_h id.resp_h func | grep -E "WRITE"
```

**Résultat attendu** :

```text
# Contenu typique de modbus.log :
1679012345.123  192.168.1.10  192.168.1.20  READ_HOLDING_REGISTERS
1679012345.456  192.168.1.10  192.168.1.21  READ_HOLDING_REGISTERS
1679012346.789  192.168.1.50  192.168.1.20  WRITE_SINGLE_REGISTER

La dernière ligne montre une écriture depuis 192.168.1.50.
Si cette adresse n'est pas une station de contrôle légitime,
c'est un indicateur d'attaque.
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `tcpdump -i eth0 port 502 -w modbus.pcap` | Capturer le trafic Modbus |
| `tcpdump -i eth0 port 20000 -w dnp3.pcap` | Capturer le trafic DNP3 |
| `tcpdump -i eth0 port 102 -w s7comm.pcap` | Capturer le trafic S7comm (Siemens) |
| `tshark -r capture.pcap -Y modbus` | Filtrer les trames Modbus dans une capture |
| `nmap --script modbus-discover -p 502 10.3.0.0/24` | Découvrir les équipements Modbus (attention : scan actif) |
| `zeek -r capture.pcap local.zeek` | Analyser une capture hors ligne avec Zeek |
| `cat conn.log \| zeek-cut ts id.orig_h id.resp_h id.resp_p` | Lire les connexions Zeek |

---

## Pièges Fréquents

### Piège 1 : Scanner activement un réseau OT

⚠️ **Problème** : lancer un scan nmap ou un scanner de vulnérabilités sur un réseau OT. Les automates industriels (PLC) ont des piles réseau fragiles. Un scan SYN ou un scan de ports peut faire planter un automate et arrêter un processus industriel.

✅ **Solution** : toujours utiliser des méthodes passives en environnement OT. Écouter le trafic sans envoyer de paquets. Si un scan actif est absolument nécessaire, le faire sur un environnement de test ou pendant un arrêt planifié, avec l'accord des équipes de production.

---

### Piège 2 : Appliquer les pratiques IT directement à l'OT

⚠️ **Problème** : installer des mises à jour automatiques, un antivirus avec scan en temps réel, ou redémarrer un serveur SCADA sans coordination. Ces actions peuvent interrompre un processus industriel critique.

✅ **Solution** : toute action sur un système OT doit être planifiée avec les équipes de production. Les mises à jour se font pendant les arrêts planifiés. Les antivirus doivent être en mode passif (pas de quarantaine automatique). Chaque modification doit être testée dans un environnement de qualification.

---

### Piège 3 : Négliger les protocoles série

⚠️ **Problème** : se concentrer uniquement sur les protocoles Ethernet (Modbus TCP, OPC UA) et ignorer les protocoles série (Modbus RTU, RS-485, RS-232) encore largement utilisés. Un attaquant avec un accès physique peut se connecter à un port série non protégé.

✅ **Solution** : inventorier tous les ports série actifs. Désactiver ceux qui ne sont pas utilisés. Sécuriser l'accès physique aux équipements avec ports série exposés. Documenter les communications série légitimes.

---

### Piège 4 : Croire qu'un réseau isolé est sûr (air gap)

⚠️ **Problème** : considérer qu'un réseau OT "air gapped" (physiquement déconnecté d'Internet) est invulnérable. Stuxnet a démontré qu'un malware peut franchir un air gap via une clé USB.

✅ **Solution** : même sur un réseau isolé, appliquer des contrôles de sécurité : whitelisting applicatif, monitoring réseau, contrôle des supports amovibles (clés USB), détection d'anomalies sur les flux réseau internes.

---

## Checklist de Validation

- [ ] Je sais expliquer les différences fondamentales entre IT et OT
- [ ] Je connais les 6 niveaux du Purdue Model et leur rôle
- [ ] Je sais identifier les protocoles Modbus, DNP3, OPC UA et S7comm dans une capture réseau
- [ ] Je comprends pourquoi le scan actif est dangereux en environnement OT
- [ ] Je sais mettre en place une segmentation réseau basée sur le Purdue Model
- [ ] Je connais les principes de monitoring passif (Zeek, Nozomi, Claroty, Dragos)
- [ ] Je comprends le concept de data diode et quand l'utiliser
- [ ] Je connais les grandes lignes de la norme IEC 62443
- [ ] Je peux citer au moins 3 incidents majeurs sur des systèmes OT

---

## Exercice Pratique

**Énoncé** : Tu es chargé d'auditer la sécurité d'un réseau industriel d'une station de traitement d'eau. Voici le schéma réseau actuel :

```text
Internet <---> Routeur <---> Switch principal <---> Tous les équipements :
  - Postes bureautiques (IT)
  - Serveur SCADA
  - Station HMI
  - 5 PLC (Modbus TCP)
  - Historien de données
  - Imprimante réseau
```

Tous les équipements sont sur le même réseau plat 192.168.1.0/24. Il n'y a aucune segmentation.

**Indications** :

- Identifie les problèmes de sécurité (au moins 5)
- Propose une architecture Purdue Model avec les sous-réseaux adaptés
- Définis les règles de pare-feu entre chaque zone
- Propose un plan de monitoring passif
- Identifie les équipements qui nécessitent une attention particulière

**Résultat attendu** : un rapport d'audit structuré avec l'architecture cible, les règles de filtrage et le plan de monitoring.

---

## Solution de l'Exercice

> **Note** : cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**1. Problèmes identifiés** :

| # | Problème | Sévérité | Risque |
| - | -------- | -------- | ------ |
| 1 | Réseau plat sans segmentation | Critique | Un poste bureautique compromis peut atteindre directement les PLC |
| 2 | Pas de DMZ industrielle | Critique | Aucune zone tampon entre IT et OT |
| 3 | PLC accessibles depuis Internet (via le routeur) | Critique | Prise de contrôle à distance des automates |
| 4 | Pas de monitoring réseau | Élevé | Aucune détection des anomalies ou attaques |
| 5 | Imprimante sur le même réseau que les PLC | Modéré | Les imprimantes sont souvent vulnérables et servent de point d'entrée |
| 6 | Pas de contrôle d'accès au réseau | Élevé | N'importe quel appareil branché accède à tout |

**2. Architecture Purdue Model proposée** :

```text
Internet
    |
[Pare-feu périmétrique]
    |
Niveau 5 - Réseau IT (10.0.0.0/24)
  - Postes bureautiques
  - Imprimante
    |
[Pare-feu IT/DMZ]
    |
DMZ industrielle (10.1.0.0/24)
  - Serveur de données (réplique historien)
  - Serveur de mise à jour
    |
[Pare-feu DMZ/OT]
    |
Niveau 3 - SCADA (10.2.0.0/24)
  - Serveur SCADA
  - Historien de données
    |
[Pare-feu SCADA/contrôle]
    |
Niveau 1-2 - Contrôle (10.3.0.0/24)
  - Station HMI
  - 5 PLC (Modbus TCP)
```

**3. Règles de pare-feu** :

```text
# Pare-feu périmétrique :
DENY tout trafic entrant depuis Internet vers le réseau IT (sauf VPN autorisé)
ALLOW trafic sortant IT vers Internet (HTTP/HTTPS)

# Pare-feu IT/DMZ :
ALLOW IT -> DMZ sur port 443 (consultation données)
DENY IT -> SCADA (tout)
DENY IT -> Contrôle (tout)

# Pare-feu DMZ/OT :
ALLOW DMZ -> SCADA sur port 443 (réplication données)
DENY DMZ -> Contrôle (tout)
DENY tout trafic depuis SCADA/Contrôle vers la DMZ (sauf réponses)

# Pare-feu SCADA/Contrôle :
ALLOW SCADA -> PLC sur port 502 (Modbus TCP)
DENY Contrôle -> SCADA (sauf réponses Modbus)
DENY tout trafic initié par les PLC vers d'autres zones
```

**4. Plan de monitoring passif** :

- Installer une sonde Zeek (ou Nozomi/Claroty) sur un port miroir du switch du réseau contrôle (10.3.0.0/24)
- Configurer des alertes pour :
  - Toute nouvelle adresse IP apparaissant sur le réseau OT
  - Toute commande d'écriture Modbus depuis une source non autorisée
  - Tout protocole non attendu sur le réseau OT (ex : HTTP, SSH)
  - Tout trafic entre les zones non conforme aux règles de pare-feu
- Envoyer les logs vers un SIEM dans la DMZ (pas dans le réseau OT)

**5. Équipements nécessitant une attention particulière** :

- **PLC** : vérifier si les firmwares sont à jour, identifier les fonctions de protection disponibles (mode lecture seule, mot de passe)
- **Station HMI** : souvent sous Windows, vérifier les mises à jour et le whitelisting applicatif
- **Historien** : contient l'ensemble des données de production, chiffrer les sauvegardes

---

## Navigation

← Fiche précédente : **[01 - Sécurité Cloud](01-securite-cloud.md)**

→ Fiche suivante : **[03 - Sécurité de l'IA et Machine Learning](03-securite-ia-machine-learning.md)**
