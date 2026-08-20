---
hide:
  - navigation
  - toc
description: "Cursus Analyse réseau : Wireshark, tshark, filtres BPF et d'affichage, lecture des couches, TCP, confidentialité des pcap, articulation avec tcpdump, ss, ip, dig, mtr et Nmap."
---

# Analyse réseau

> **En bref** : Ce mini-cursus te montre comment capturer et lire du trafic avec Wireshark et tshark, sans confondre filtres de capture et filtres d'affichage, et sans oublier les limites du chiffrement, du droit et de la vie privée. 8 fiches progressives.

---

## Progression

| # | Fiche | Durée |
| - | ----- | ----- |
| 1 | [Analyseur de protocoles et limites](01-analyseur-limites.md) | 50 min |
| 2 | [Installation et capture sûre](02-installation-capture-sure.md) | 60 min |
| 3 | [Filtres BPF et filtres d'affichage](03-filtres-bpf-et-affichage.md) | 70 min |
| 4 | [Lire les couches d'Ethernet à TLS](04-lire-couches-ethernet-tls.md) | 75 min |
| 5 | [Flux TCP, réassemblage et retransmissions](05-flux-tcp-retransmissions.md) | 75 min |
| 6 | [tshark et automatisation](06-tshark-automatisation.md) | 70 min |
| 7 | [Articulation avec tcpdump, ss, ip, dig, mtr et Nmap](07-articulation-tcpdump-ss-ip-dig-mtr-nmap.md) | 70 min |
| 8 | [Confidentialité des pcap et exercice de diagnostic](08-confidentialite-pcap-et-exercice.md) | 80 min |

---

## Prérequis

- Cursus [Réseaux](../20-reseaux/index.md), au moins [03 - Protocoles de transport](../20-reseaux/03-protocoles-transport.md) et [10 - Diagnostic et outils](../20-reseaux/10-diagnostic-outils.md)
- Cursus [Unix/Bash](../fondamentaux/02-unix-bash/index.md) (terminal, droits, redirection)
- Un ordinateur dont tu contrôles le réseau local, ou au minimum l'interface de boucle locale (`lo` / `lo0`)

## Durée totale estimée

~9 heures de lecture et pratique (somme des durées des 8 fiches).

## Cadre de travail

- Tu captures uniquement sur un réseau que tu possèdes ou pour lequel tu as une autorisation écrite.
- Tu ne télécharges pas de pcap malveillants. Les captures d'exemple publiques du wiki Wireshark [SampleCaptures](https://wiki.wireshark.org/SampleCaptures) sont optionnelles et hors ligne tu génères tes propres fichiers.
- Tu ne déchiffres du TLS qu'avec des clés que tu contrôles (laboratoire, `SSLKEYLOGFILE`). Tu ne fais pas de MITM sur des tiers.
- Nmap ne vise que des cibles de laboratoire que tu possèdes (en pratique : `127.0.0.1` et tes propres machines).

## Public visé

Personne qui sait déjà ce qu'est une adresse IP, un port et un handshake TCP, et qui a besoin d'un analyseur de paquets pour diagnostiquer, pas pour attaquer.
