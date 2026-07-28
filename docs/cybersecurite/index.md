---
tags:
  - Cybersécurité
description: "Cursus cybersécurité en 8 phases - Introduction structurée, de la lecture à la pratique guidée"
---

# Cursus Cybersécurité 2026 - Introduction structurée

Curriculum structuré en **8 phases progressives**. Chaque phase est conçue pour être lue et pratiquée avant de passer à la suivante.

**Durée estimée totale** : 18-36 mois selon intensité (lecture des fiches + labs hors wiki).

> **Limite honnête** : parcourir ce cursus permet de **comprendre** le domaine et de **pratiquer** sur des labs autorisés. Ce n'est **pas** une promesse de devenir « expert » ni un titre professionnel. Voir [À propos](../a-propos.md) et le [parcours cybersécurité](../parcours.md).

---

## Phase 1 - Fondamentaux Informatiques (2-3 mois)

Les bases indispensables : architecture matérielle, systèmes d'exploitation, réseaux et programmation.

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Architecture matérielle](01-fondamentaux-informatiques/01-architecture-materielle.md) | CPU, mémoire, bus, boot process, rings |
| 02 | [Systèmes d'exploitation](01-fondamentaux-informatiques/02-systemes-exploitation.md) | Processus, fichiers, permissions, Linux/Windows |
| 03 | [Réseaux et protocoles](01-fondamentaux-informatiques/03-reseaux-protocoles.md) | OSI, TCP/IP, routage, switching, Wireshark |
| 04 | [Programmation et scripting](01-fondamentaux-informatiques/04-programmation-scripting.md) | Python, Bash, C, JavaScript pour la sécurité |

---

## Phase 2 - Fondamentaux de la Sécurité (2-3 mois)

Les principes fondateurs de la cybersécurité : CIA, cryptographie, sécurité réseau et gouvernance.

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Principes de sécurité](02-fondamentaux-securite/01-principes-securite.md) | CIA, STRIDE, défense en profondeur, frameworks |
| 02 | [Cryptographie](02-fondamentaux-securite/02-cryptographie.md) | Symétrique, asymétrique, hachage, PKI, TLS |
| 03 | [Sécurité des réseaux](02-fondamentaux-securite/03-securite-reseaux.md) | Firewalls, IDS/IPS, VPN, segmentation |
| 04 | [Gouvernance, Risque et Conformité](02-fondamentaux-securite/04-gouvernance-risque-conformite.md) | RGPD, NIS2, EBIOS, ISO 27001, PCA/PRA |

---

## Phase 3 - Compétences Techniques Intermédiaires (3-4 mois)

Hardening, sécurité web, analyse de vulnérabilités et introduction au SOC.

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Sécurité des OS](03-competences-intermediaires/01-securite-systemes-exploitation.md) | Hardening Linux/Windows, détection, CIS Benchmarks |
| 02 | [Sécurité Web](03-competences-intermediaires/02-securite-web-applicative.md) | OWASP Top 10, Burp Suite, DVWA, bug bounty |
| 03 | [Analyse de vulnérabilités](03-competences-intermediaires/03-analyse-vulnerabilites.md) | OSINT, Nmap, Nessus, CVSS, énumération |
| 04 | [Introduction au SOC](03-competences-intermediaires/04-introduction-soc-monitoring.md) | SIEM, Sigma, YARA, MITRE ATT&CK, triage |

---

## Phase 4 - Spécialisation Offensive (4-6 mois)

Pentest, exploitation, Active Directory et sécurité web avancée.

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Méthodologie de Pentest](04-specialisation-offensive/01-methodologie-pentest.md) | PTES, cadre légal, phases, reporting |
| 02 | [Exploitation et Post-Exploitation](04-specialisation-offensive/02-exploitation-post-exploitation.md) | Metasploit, privesc, pivoting, persistence |
| 03 | [Active Directory](04-specialisation-offensive/03-active-directory.md) | Kerberoasting, DCSync, BloodHound, mouvement latéral |
| 04 | [Sécurité Web Avancée](04-specialisation-offensive/04-securite-web-avancee.md) | SSTI, request smuggling, fuzzing, OSWE |
| 05 | [Certifications Offensives](04-specialisation-offensive/05-certifications-offensives.md) | OSCP, OSEP, OSWE, PNPT, CRTP |

---

## Phase 5 - Spécialisation Défensive (4-6 mois)

DFIR, analyse de malware, threat hunting et sécurité endpoint.

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [DFIR](05-specialisation-defensive/01-detection-reponse-incidents.md) | Forensique mémoire/disque/réseau, Volatility, PICERL |
| 02 | [Analyse de Malware](05-specialisation-defensive/02-analyse-malware.md) | Ghidra, sandbox, YARA, reverse engineering |
| 03 | [Threat Hunting](05-specialisation-defensive/03-threat-hunting-intelligence.md) | MITRE ATT&CK, Diamond Model, MISP, TheHive |
| 04 | [Sécurité Endpoint](05-specialisation-defensive/04-securite-endpoint.md) | EDR/XDR, Sysmon, SOAR, Wazuh, Velociraptor |
| 05 | [Certifications Défensives](05-specialisation-defensive/05-certifications-defensives.md) | CySA+, BTL1, GCIH, GCFA, SC-200 |

---

## Phase 6 - Domaines Avancés et Spécialisations (4-6 mois)

Cloud, OT/ICS, IA, Mobile/IoT et DevSecOps.

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Sécurité Cloud](06-domaines-avances/01-securite-cloud.md) | AWS/Azure/GCP, IAM, conteneurs, IaC security |
| 02 | [Sécurité OT/ICS/SCADA](06-domaines-avances/02-securite-ot-ics-scada.md) | Purdue Model, Modbus, IEC 62443, convergence IT/OT |
| 03 | [Sécurité IA/ML](06-domaines-avances/03-securite-ia-machine-learning.md) | Adversarial ML, prompt injection, MITRE ATLAS |
| 04 | [Sécurité Mobile/IoT](06-domaines-avances/04-securite-mobile-iot.md) | Android/iOS, firmware, SDR, OWASP Mobile Top 10 |
| 05 | [DevSecOps](06-domaines-avances/05-devsecops.md) | CI/CD security, SAST/DAST/SCA, SBOM, shift-left |

---

## Phase 7 - Red Team et Opérations Avancées (3-6 mois)

Opérations red team, évasion, développement d'exploits et AD avancé.

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Red Team Operations](07-red-team-avance/01-red-team-operations.md) | C2, OPSEC, purple teaming, planification |
| 02 | [Évasion et outils offensifs](07-red-team-avance/02-evasion-outils-offensifs.md) | Bypass AV/EDR, loaders, AMSI, LOLBAS |
| 03 | [Exploit Development](07-red-team-avance/03-exploit-development.md) | ROP, heap exploitation, fuzzing, OSED |
| 04 | [Active Directory Avancé](07-red-team-avance/04-active-directory-avance.md) | AD CS, Azure AD, cross-forest, hybrid |

---

## Phase 8 - Expertise et Leadership (continu)

Architecture, GRC avancée, recherche et tendances futures.

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Architecture de Sécurité](08-expertise-leadership/01-architecture-securite.md) | Zéro Trust, security by design, threat modeling |
| 02 | [GRC Avancée](08-expertise-leadership/02-grc-avancee.md) | FAIR, CISSP, KPI sécurité, gestion de crise |
| 03 | [Recherche en Sécurité](08-expertise-leadership/03-recherche-securite.md) | CVE, CTF, bug bounty, conférences, mentorat |
| 04 | [Tendances 2026+](08-expertise-leadership/04-tendances-2026.md) | Post-quantum, IA, edge computing, réglementation |

---

## Plateformes de Pratique Recommandées

| Plateforme | Niveau | Focus |
| ---------- | ------ | ----- |
| TryHackMe | Débutant → Intermédiaire | Parcours guidés, labs browser-based |
| Hack The Box | Intermédiaire → Avancé | Machines réalistes, AD labs |
| PortSwigger Academy | Tous niveaux | Web security (gratuit) |
| Proving Grounds (OffSec) | Intermédiaire | Préparation OSCP |
| CryptoHack / Cryptopals | Tous niveaux | Cryptographie appliquée |
| PentesterLab | Intermédiaire | Web + infrastructure |
| LetsDefend | Débutant → Intermédiaire | SOC analyst training |
| CyberDefenders | Intermédiaire | Forensique / DFIR |
| Blue Team Labs Online | Tous niveaux | Blue team, incident response |
| OverTheWire | Débutant | Linux, exploitation basique |
| VulnHub | Tous niveaux | VMs vulnérables offline |

---

## Parcours Certifications Suggéré

| Niveau | Certifications |
| ------ | -------------- |
| Débutant | CompTIA Security+ → CompTIA Network+ |
| Intermédiaire | CySA+ (blue) ou PenTest+ (red) |
| Confirmé | OSCP+ (red) ou BTL1/GCIH (blue) |
| Avancé | OSEP/OSWE (red) ou GCFA/GREM (blue) |
| Expert | CISSP ou CISM (management) + spécialisation |
