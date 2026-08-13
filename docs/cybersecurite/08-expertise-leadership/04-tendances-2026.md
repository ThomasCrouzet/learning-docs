---
tags:
  - Cybersécurité
  - Expert
  - Concept
description: "IA offensive/défensive, cryptographie post-quantique, 5G/edge, réglementation européenne, convergence cyber-physique"
estimated_time: "45 min"
fiche_number: 4
total_fiches: 4
cursus: "Phase 8 - Expertise et Leadership"
---

# 04 - Tendances 2026 et Au-delà

> **En bref** : À la fin de cette fiche, tu sauras anticiper les menaces émergentes liées à l'IA offensive, comprendre les enjeux de la cryptographie post-quantique et planifier une transition, évaluer l'impact sécuritaire du edge computing et de la 5G, naviguer dans le paysage réglementaire européen (Cyber Resilience Act, AI Act), et identifier les risques de convergence cyber-physique. Lecture estimée : 45 min.


## Prérequis

- Phase 8 : [fiche 01 - Architecture de Sécurité](01-architecture-securite.md), [fiche 02 - GRC Avancée](02-grc-avancee.md) et [fiche 03 - Recherche en Sécurité](03-recherche-securite.md) complètes
- Compréhension des fondamentaux de la cryptographie ([Phase 2, fiche 02](../02-fondamentaux-securite/02-cryptographie.md))
- Connaissance des architectures cloud et réseau ([Phase 6, fiche 01](../06-domaines-avances/01-securite-cloud.md))
- Notions de machine learning et d'intelligence artificielle ([Phase 6, fiche 03](../06-domaines-avances/03-securite-ia-machine-learning.md))
- Connaissance des réglementations européennes (NIS2, RGPD) ([Phase 2, fiche 04](../02-fondamentaux-securite/04-gouvernance-risque-conformite.md) et [Phase 8, fiche 02](02-grc-avancee.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras anticiper les menaces émergentes liées à l'IA offensive, comprendre les enjeux de la cryptographie post-quantique et planifier une transition, évaluer l'impact sécuritaire du edge computing et de la 5G, naviguer dans le paysage réglementaire européen (Cyber Resilience Act, AI Act), et identifier les risques de convergence cyber-physique.

---

## Concepts

### Qu'est-ce que l'IA offensive ?

**Définition** : L'IA offensive désigne l'utilisation de techniques d'intelligence artificielle et de machine learning par les attaquants pour automatiser, accélérer et améliorer les cyberattaques. Cela inclut la génération automatique d'exploits, le phishing personnalisé par IA, et les deepfakes.

**Le problème que l'IA offensive pose** :

L'IA offensive crée de nouveaux problèmes pour les défenseurs :

1. **Vitesse d'attaque** : les agents IA autonomes peuvent scanner, identifier et exploiter des vulnérabilités en minutes au lieu de jours
2. **Personnalisation du phishing** : les LLM génèrent des emails de phishing personnalisés, contextuels et souvent sans fautes, ce qui **rend la détection plus difficile** (sans la rendre impossible)
3. **Deepfakes convaincants** : la voix et l'image d'un dirigeant peuvent être reproduites pour autoriser des virements frauduleux
4. **Évasion de détection** : les malwares générés par IA mutent automatiquement pour échapper aux signatures et aux heuristiques
5. **Agentic AI threats** : des agents IA autonomes enchaînent reconnaissance, exploitation et exfiltration sans intervention humaine

**Les catégories d'attaques IA** :

| Catégorie | Description | Exemple concret |
| --------- | ----------- | --------------- |
| Autonomous exploit agents | Agents IA qui découvrent et exploitent des vulnérabilités automatiquement | Agent utilisant un LLM pour analyser du code, identifier une SQLi et générer l'exploit |
| AI-powered phishing | Phishing généré par LLM, personnalisé à partir de données OSINT | Email de phishing imitant le style d'écriture du CEO, référençant un projet interne réel |
| Deepfake audio/vidéo | Synthèse vocale ou vidéo pour usurper l'identité | Appel téléphonique avec la voix clonée du directeur financier demandant un virement |
| Adversarial malware | Malware qui utilise l'IA pour muter et échapper à la détection | Polymorphisme piloté par un modèle qui réécrit le code à chaque exécution |
| Automated vulnerability research | Fuzzing et analyse de code pilotés par l'IA | Modèle entraîné pour identifier des patterns de vulnérabilités dans le code source |
| Password cracking IA | Modèles entraînés sur des fuites pour prédire les mots de passe | PassGAN : réseau génératif adversarial entraîné sur des listes de mots de passe réels |

**Analogie concrète** : Avant l'IA offensive, un cambrioleur devait repérer chaque maison une par une, forcer chaque serrure manuellement. Avec l'IA offensive, le cambrioleur a un robot qui scanne tout le quartier en parallèle, identifie les serrures les plus faibles, fabrique les clés adaptées et entre simultanément dans 100 maisons. La vitesse et l'échelle changent fondamentalement la nature de la menace.

---

### Qu'est-ce que l'IA défensive ?

**Définition** : L'IA défensive désigne l'utilisation de techniques d'intelligence artificielle pour détecter, prévenir et répondre aux cyberattaques plus rapidement et plus efficacement que les méthodes traditionnelles.

**Le problème que l'IA défensive résout** :

Sans IA défensive, voici les problèmes rencontrés :

1. **Volume d'alertes élevé** : un SOC reçoit souvent un grand volume d'alertes par jour, avec une proportion importante de faux positifs (le taux exact dépend de l'outillage et du tuning)
2. **Attaques inconnues non détectées** : les signatures ne détectent que les menaces connues
3. **Temps de réponse trop long** : l'analyse manuelle prend des heures, l'attaquant progresse en minutes
4. **Pénurie de personnel** : les études sectorielles (ex. ISC2) rapportent un déficit mondial de centaines de milliers à plusieurs millions de postes cyber selon les années et les définitions - le chiffre exact évolue

**Comment l'IA défensive résout ces problèmes** :

| Problème | Solution apportée par l'IA défensive |
| -------- | ------------------------------------- |
| Volume d'alertes | Corrélation et priorisation automatique, réduction significative des faux positifs (ordre de grandeur selon le contexte, pas une garantie chiffrée) |
| Attaques inconnues | Détection comportementale (anomalies) sans besoin de signatures |
| Temps de réponse | Réponse automatisée (SOAR piloté par IA) en secondes |
| Pénurie de personnel | Augmentation des analystes : l'IA traite le volume, l'humain traite les cas complexes |

**Applications concrètes de l'IA défensive** :

| Application | Technologie | Exemple d'outil |
| ----------- | ----------- | --------------- |
| AI-powered hunting | LLM pour interroger les logs en langage naturel | Microsoft Security Copilot, Google SecOps AI |
| Détection de deepfakes | Analyse de micro-expressions, artefacts visuels | Microsoft Video Authenticator, Intel FakeCatcher |
| Analyse de malware | Classification automatique par ML | VirusTotal ML, CrowdStrike Charlotte AI |
| Gestion de vulnérabilités | Priorisation par IA basée sur le contexte | Qualys TruRisk, Tenable AI |
| Réponse automatisée | Playbooks SOAR déclenchés par ML | Palo Alto XSOAR, Splunk SOAR |
| Analyse de code | Détection de vulnérabilités dans le code source | GitHub Copilot Security, Snyk DeepCode |

**Ce que l'IA défensive n'est PAS** :

- L'IA défensive n'est pas infaillible. Les modèles ont des faux positifs et des faux négatifs
- L'IA défensive ne remplace pas les analystes humains. Elle les augmente en traitant le volume
- L'IA défensive peut être trompée. Les attaques adversariales ciblent les modèles de détection eux-mêmes

---

### Qu'est-ce que la cryptographie post-quantique ?

**Définition** : La cryptographie post-quantique (PQC) désigne les algorithmes cryptographiques conçus pour résister aux attaques d'ordinateurs quantiques. Les ordinateurs quantiques menacent les algorithmes à clé publique actuels (RSA, ECC, Diffie-Hellman) car ils pourront les casser en temps polynomial grâce à l'algorithme de Shor.

**Le problème que la cryptographie post-quantique résout** :

Sans transition vers la PQC, voici les problèmes à venir :

1. **"Harvest now, decrypt later"** : les adversaires collectent aujourd'hui des données chiffrées pour les déchiffrer quand ils auront un ordinateur quantique
2. **Effondrement de la PKI** : les certificats TLS, les signatures numériques et le chiffrement email reposent tous sur RSA ou ECC, qui seront cassés
3. **Données à longue durée de vie exposées** : les secrets d'État, les données de santé et les brevets ont une durée de vie de 20-50 ans. S'ils sont collectés aujourd'hui, ils seront lisibles dans 10-15 ans

**Comment la cryptographie post-quantique résout ces problèmes** :

| Problème | Solution apportée par la PQC |
| -------- | ---------------------------- |
| Harvest now, decrypt later | Chiffrement résistant dès maintenant, les données collectées restent protégées |
| Effondrement de la PKI | Nouveaux algorithmes standardisés par le NIST pour remplacer RSA/ECC |
| Données à longue durée de vie | Transition anticipée pour protéger les données avant l'arrivée des QC |

**Analogie concrète** : Imagine un coffre-fort dont la serrure sera crochetable dans 10 ans grâce à un nouvel outil (l'ordinateur quantique). Deux choix : attendre que l'outil existe et paniquer, ou changer la serrure maintenant pour une version résistante. La cryptographie post-quantique, c'est changer la serrure avant que l'outil ne soit disponible.

**Les algorithmes standardisés par le NIST (2024)** :

| Algorithme | Type | Usage | Standard NIST |
| ---------- | ---- | ----- | ------------- |
| CRYSTALS-Kyber (ML-KEM) | Lattice-based | Échange de clés (KEM) | FIPS 203 |
| CRYSTALS-Dilithium (ML-DSA) | Lattice-based | Signature numérique | FIPS 204 |
| SPHINCS+ (SLH-DSA) | Hash-based | Signature numérique (backup) | FIPS 205 |
| FALCON (FN-DSA) | Lattice-based | Signature numérique (compact) | En cours de standardisation |

**Comparaison des tailles de clés** :

| Algorithme | Taille clé publique | Taille signature | Sécurité |
| ---------- | ------------------- | ---------------- | -------- |
| RSA-2048 (classique) | 256 octets | 256 octets | Cassé par QC |
| ECDSA P-256 (classique) | 64 octets | 64 octets | Cassé par QC |
| ML-KEM-768 (post-quantique) | 1 184 octets | N/A (KEM) | Résistant QC |
| ML-DSA-65 (post-quantique) | 1 952 octets | 3 293 octets | Résistant QC |
| SLH-DSA-128s (post-quantique) | 32 octets | 7 856 octets | Résistant QC |

**Ce que la cryptographie post-quantique n'est PAS** :

- La PQC n'est pas de la cryptographie quantique. La PQC utilise des mathématiques classiques résistantes aux QC. La cryptographie quantique (QKD) utilise la physique quantique pour distribuer des clés
- La PQC ne nécessite pas un ordinateur quantique. Les algorithmes PQC s'exécutent sur des ordinateurs classiques

---

### Qu'est-ce que la sécurité du edge computing et de la 5G ?

**Définition** : Le edge computing déplace le traitement des données du cloud centralisé vers la périphérie du réseau (près des utilisateurs et des objets connectés). La 5G fournit la connectivité haute performance nécessaire pour ces architectures distribuées. Ensemble, ils créent de nouvelles surfaces d'attaque.

**Le problème que la sécurité edge/5G doit résoudre** :

Le edge computing et la 5G introduisent de nouveaux risques :

1. **Surface d'attaque élargie** : des milliers de nœuds edge distribués au lieu d'un cloud centralisé
2. **Network slicing** : la 5G permet de créer des réseaux virtuels isolés (slices). Une compromission de slice peut affecter les autres
3. **Latence critique** : certaines applications edge (véhicules autonomes, chirurgie à distance) ne tolèrent aucune interruption de sécurité
4. **Dispositifs hétérogènes** : les nœuds edge vont du micro-contrôleur au serveur, avec des capacités de sécurité très variables

**Risques spécifiques** :

| Risque | Description | Impact |
| ------ | ----------- | ------ |
| Compromission d'un nœud edge | Un attaquant prend le contrôle d'un point de traitement local | Accès aux données locales, pivot vers le cloud |
| Attaque sur le network slicing 5G | Évasion d'une slice 5G vers une autre | Accès à des services critiques (urgences, industrie) |
| Interception radio 5G | Écoute des communications via station de base pirate (IMSI catcher évolué) | Interception de données, localisation |
| Supply chain des équipements 5G | Backdoor dans les équipements réseau (débat Huawei/ZTE) | Accès national aux communications |
| MEC (Multi-access Edge Computing) | Compromission de la couche d'orchestration | Contrôle de tous les services edge |

---

### Qu'est-ce que le paysage réglementaire européen 2026 ?

**Définition** : L'Union européenne a adopté un ensemble de réglementations qui transforment les obligations de cybersécurité pour les organisations opérant en Europe. Trois textes majeurs s'ajoutent au RGPD existant : le Cyber Resilience Act (CRA), l'AI Act et NIS2/DORA (déjà en vigueur).

**Les textes clés et leur calendrier** :

| Texte | Entrée en vigueur | Cible | Obligation principale |
| ----- | ------------------ | ----- | --------------------- |
| NIS2 | Transposition 17 oct. 2024 (entrée en vigueur 16 janv. 2023) | Entités essentielles et importantes (18 secteurs) | Mesures de sécurité, alerte 24h / notification 72h / rapport 1 mois, responsabilité dirigeants |
| DORA | Janvier 2025 | Secteur financier | Résilience numérique, tests TLPT, gestion risque tiers ICT |
| AI Act | Août 2025 (progressif) | Fournisseurs et utilisateurs de systèmes d'IA | Classification des risques IA, obligations par niveau de risque |
| Cyber Resilience Act (CRA) | 2027 (progressif) | Fabricants de produits numériques (logiciels, IoT, hardware) | Sécurité by design, mises à jour pendant 5 ans, marquage CE |

**Le Cyber Resilience Act (CRA) en détail** :

Le CRA impose des obligations de cybersécurité à tous les produits contenant des éléments numériques vendus dans l'UE :

| Obligation | Description | Échéance |
| ---------- | ----------- | -------- |
| Security by design | Analyse de risque et architecture sécurisée dès la conception | Dès 2027 |
| Gestion des vulnérabilités | Processus de signalement et correction des vulnérabilités | Dès 2026 (notification) |
| Mises à jour de sécurité | Fournir des patches pendant 5 ans minimum ou la durée de vie du produit | Dès 2027 |
| SBOM (Software Bill of Materials) | Documenter toutes les dépendances logicielles | Dès 2027 |
| Marquage CE cyber | Conformité requise pour le marquage CE | Dès 2027 |
| Notification de vulnérabilités | Signaler les vulnérabilités activement exploitées sous 24h à l'ENISA | Dès 2026 |

**L'AI Act en détail** :

L'AI Act classifie les systèmes d'IA par niveau de risque :

| Niveau de risque | Exemples | Obligations |
| ---------------- | -------- | ----------- |
| Inacceptable (interdit) | Score social, manipulation subliminale, identification biométrique en temps réel dans l'espace public | Interdit |
| Haut risque | Recrutement, scoring crédit, véhicules autonomes, dispositifs médicaux | Évaluation de conformité, données d'entraînement documentées, supervision humaine |
| Risque limité | Chatbots, deepfakes | Obligation de transparence (informer que c'est de l'IA) |
| Risque minimal | Filtres spam, jeux vidéo | Aucune obligation spécifique |

---

### Qu'est-ce que la convergence cyber-physique ?

**Définition** : La convergence cyber-physique désigne l'intégration croissante entre les systèmes informatiques (cyber) et les systèmes physiques (machines, véhicules, infrastructures). Une cyberattaque peut désormais avoir des conséquences physiques : blessures, dommages matériels, impact environnemental.

**Le problème que la convergence cyber-physique pose** :

Cette convergence crée de nouveaux risques :

1. **Impact physique des cyberattaques** : pirater un véhicule autonome peut tuer. Pirater une station d'épuration peut contaminer l'eau
2. **Surface d'attaque élargie** : drones, robots industriels, implants médicaux, smart cities : chaque objet connecté est un point d'entrée
3. **Sûreté vs sécurité** : les systèmes physiques ont des contraintes de sûreté (safety) que la cybersécurité ne doit pas compromettre
4. **Temps de réponse critique** : un véhicule autonome qui reçoit un faux signal doit réagir en millisecondes

**Domaines de convergence** :

| Domaine | Systèmes concernés | Risque cyber-physique | Exemple d'attaque |
| ------- | ------------------- | --------------------- | ----------------- |
| Véhicules autonomes | Capteurs LiDAR, caméras, GPS, V2X | Accident, prise de contrôle | Spoofing GPS pour dévier la trajectoire |
| Drones | Contrôle de vol, capteurs, communications | Détournement, collision, espionnage | Hijacking du protocole de commande |
| Smart Cities | Feux de circulation, éclairage, eau, énergie | Perturbation des services urbains | Manipulation des feux de circulation |
| Santé connectée | Pacemakers, pompes à insuline, IRM | Danger pour la vie du patient | Modification des paramètres d'un pacemaker |
| Industrie 4.0 | Robots, automates, cobots | Dommages matériels, blessures | Reprogrammation d'un bras robotique |
| Infrastructure énergétique | Smart grid, compteurs connectés, éoliennes | Blackout, surcharge réseau | Attaque de type Ukraine 2015/2016 |

**Analogie concrète** : Avant la convergence, pirater un système informatique causait des pertes de données ou d'argent (le monde numérique). Avec la convergence, pirater un système informatique peut causer un accident de voiture, une panne d'électricité dans une ville ou un empoisonnement de l'eau potable (le monde physique). La frontière entre le numérique et le réel s'efface.

---

## Étapes Pratiques

### Étape 1 : Évaluer la maturité PQC de ton organisation

```bash
# Créer le répertoire de travail
mkdir -p ~/tendances-2026

# Créer un outil d'évaluation de la maturité PQC
cat > ~/tendances-2026/audit-pqc.md << 'PQC_EOF'
# Audit de Maturité Post-Quantique

## 1. Inventaire cryptographique

### Checklist d'inventaire

| Élément | Algorithme actuel | Quantité | Risque PQ | Priorité migration |
| ------- | ----------------- | -------- | --------- | ------------------ |
| Certificats TLS serveurs | RSA 2048 / ECDSA P-256 | ??? | Élevé | Haute |
| VPN (IPsec/IKEv2) | RSA 2048 + AES-256 | ??? | Moyen (AES OK) | Moyenne (échange clés) |
| Signatures de code | RSA 4096 | ??? | Élevé | Haute |
| Email (S/MIME) | RSA 2048 | ??? | Élevé | Moyenne |
| SSH | RSA 4096 / Ed25519 | ??? | Élevé | Haute |
| Base de données chiffrée | AES-256 | ??? | Faible (AES OK) | Basse |
| Blockchain/tokens | ECDSA | ??? | Élevé | Haute |

### Commandes d'inventaire

Inventorier les certificats TLS :
  openssl s_client -connect serveur:443 | openssl x509 -text | grep "Public Key Algorithm"

Inventorier les clés SSH :
  find /etc/ssh -name "*.pub" -exec ssh-keygen -l -f {} \;

Inventorier les algorithmes IPsec :
  ipsec statusall | grep "IKE proposal"

## 2. Évaluation du risque "Harvest Now, Decrypt Later"

| Catégorie de données | Durée de confidentialité | Risque HNDL | Action |
| -------------------- | ------------------------ | ----------- | ------ |
| Données personnelles (RGPD) | 10+ ans | Élevé | Migration PQC prioritaire |
| Secrets commerciaux | 5-20 ans | Élevé | Migration PQC prioritaire |
| Données financières | 7 ans (légal) | Moyen | Migration PQC planifiée |
| Données opérationnelles | < 1 an | Faible | Migration PQC différée |
| Communications internes | < 6 mois | Faible | Migration PQC différée |

## 3. Plan de migration PQC

### Phase 1 : Préparation (2026)
- Inventaire cryptographique complet
- Formation des équipes aux algorithmes PQC
- Tests de compatibilité (liboqs, openssl PQC)

### Phase 2 : Mode hybride (2027)
- Déploiement en mode hybride (classique + PQC en parallèle)
- TLS avec KEM hybride : X25519 + ML-KEM-768
- Signatures hybrides : ECDSA + ML-DSA-65

### Phase 3 : Migration (2028-2030)
- Migration progressive vers PQC natif
- Retrait des algorithmes classiques vulnérables
- Audit de conformité PQC

PQC_EOF

echo "Audit de maturité PQC créé"
```

**Résultat attendu** :

```text
Audit de maturité PQC créé
```

---

### Étape 2 : Tester les algorithmes post-quantiques

```bash
# Créer un script de test PQC avec OpenSSL
cat > ~/tendances-2026/test-pqc.sh << 'TEST_EOF'
#!/bin/bash
# Test des algorithmes post-quantiques avec OpenSSL 3.x + liboqs

echo "=== Test de Cryptographie Post-Quantique ==="

# Vérifier la version d'OpenSSL
echo "Version OpenSSL :"
openssl version

# Vérifier si le provider oqs est disponible
echo ""
echo "Providers disponibles :"
openssl list -providers 2>/dev/null

# Lister les algorithmes PQC disponibles
echo ""
echo "Algorithmes KEM disponibles :"
openssl list -kem-algorithms 2>/dev/null | head -20

echo ""
echo "Algorithmes de signature disponibles :"
openssl list -signature-algorithms 2>/dev/null | grep -i "dilithium\|falcon\|sphincs\|ml-" | head -20

# Test de génération de clé ML-DSA (si disponible)
echo ""
echo "=== Test ML-DSA-65 (CRYSTALS-Dilithium) ==="
if openssl genpkey -algorithm ml-dsa-65 -out /tmp/ml-dsa-65-key.pem 2>/dev/null; then
    echo "Clé ML-DSA-65 générée avec succès"
    openssl pkey -in /tmp/ml-dsa-65-key.pem -text -noout 2>/dev/null | head -5
    rm -f /tmp/ml-dsa-65-key.pem
else
    echo "ML-DSA-65 non disponible (installer liboqs-provider)"
    echo "Installation : https://github.com/open-quantum-safe/oqs-provider"
fi

# Test de performance comparatif
echo ""
echo "=== Comparaison de performance ==="
echo "RSA-2048 (signature) :"
openssl speed rsa2048 2>/dev/null | tail -3

echo ""
echo "ECDSA P-256 (signature) :"
openssl speed ecdsap256 2>/dev/null | tail -3

echo ""
echo "=== Fin des tests PQC ==="

TEST_EOF

chmod +x ~/tendances-2026/test-pqc.sh
echo "Script de test PQC créé"
```

**Résultat attendu** :

```text
Script de test PQC créé
```

---

### Étape 3 : Analyser les menaces IA avec STRIDE

```bash
# Créer une analyse de menaces IA
cat > ~/tendances-2026/stride-ia-threats.md << 'IA_EOF'
# Analyse STRIDE - Menaces IA pour une Organisation

## Système analysé
Organisation utilisant :
- LLM interne pour l'assistance aux employés (chatbot)
- Modèle ML pour la détection de fraude (scoring)
- Outils IA tiers (Copilot, ChatGPT via API)

## Analyse STRIDE des menaces IA

### Spoofing (Usurpation)

| Menace | Vecteur | Impact | Contrôle |
| ------ | ------- | ------ | -------- |
| Deepfake audio CEO | Clone vocal via échantillons publics | Virement frauduleux | Double validation, mot de passe verbal |
| Faux email par LLM | Phishing hyper-personnalisé sans fautes | Compromission de comptes | MFA FIDO2, formation IA |
| Usurpation du chatbot | Injection de prompt | Fuite de données internes | Guardrails LLM, limitation du contexte |

### Tampering (Altération)

| Menace | Vecteur | Impact | Contrôle |
| ------ | ------- | ------ | -------- |
| Data poisoning | Injection de données malveillantes dans le dataset | Fraudes non détectées | Validation des données, monitoring du modèle |
| Prompt injection | Commandes injectées dans les entrées utilisateur | Actions non autorisées | Sanitisation, séparation instruction/données |
| Model tampering | Modification du modèle ML en production | Décisions faussées | Signature des modèles, vérification d'intégrité |

### Repudiation (Répudiation)

| Menace | Vecteur | Impact | Contrôle |
| ------ | ------- | ------ | -------- |
| Décision IA non traçable | Raisonnement non logué | Non-conformité AI Act | Logging des inférences avec features d'entrée |
| Deepfake comme preuve | Deepfake présenté comme preuve d'action | Contestation de preuves | Watermarking, certification C2PA |

### Information Disclosure (Divulgation)

| Menace | Vecteur | Impact | Contrôle |
| ------ | ------- | ------ | -------- |
| Extraction de données | Membership inference, model inversion | Fuite de données personnelles | Differential privacy, entraînement fédéré |
| Fuite via chatbot | Données confidentielles dans le prompt | Données chez le fournisseur IA | DLP sur les prompts, instances privées |
| Exfiltration via API IA | Requêtes API pour extraire le contexte | Fuite base de connaissances | Rate limiting, monitoring, moindre privilège |

### Denial of Service (Déni de service)

| Menace | Vecteur | Impact | Contrôle |
| ------ | ------- | ------ | -------- |
| Surcharge du LLM | Requêtes massives ou prompts très longs | Indisponibilité du chatbot interne | Rate limiting, quotas par utilisateur, file d'attente |
| Poisoning du modèle de détection | Rendre le modèle de fraude inopérant | Fraudes non détectées | Modèle de backup, monitoring de performance, rollback automatique |

### Elevation of Privilege (Élévation de privilèges)

| Menace | Vecteur | Impact | Contrôle |
| ------ | ------- | ------ | -------- |
| Jailbreak du LLM | Techniques de contournement des guardrails (DAN, roleplay) | Le LLM exécute des instructions interdites | Guardrails multicouches, red teaming continu du modèle |
| Manipulation du scoring | Adversarial input pour obtenir un score favorable | Fraude validée par le modèle | Détection d'inputs adversariaux, validation humaine des cas limites |

IA_EOF

echo "Analyse STRIDE des menaces IA créée"
```

**Résultat attendu** :

```text
Analyse STRIDE des menaces IA créée
```

---

### Étape 4 : Cartographier la conformité réglementaire 2026

```bash
# Créer la cartographie réglementaire
cat > ~/tendances-2026/cartographie-reglementaire.md << 'REG_EOF'
# Cartographie Réglementaire Cybersécurité - 2026

## Matrice de conformité par type d'organisation

| Réglementation | Éditeur logiciel | Fintech | Industrie | Santé | PME généraliste |
| -------------- | ---------------- | ------- | --------- | ----- | --------------- |
| RGPD | Oui | Oui | Oui | Oui | Oui |
| NIS2 | Si entité importante | Oui | Si > 50 employés | Oui | Selon secteur/taille |
| DORA | Non (sauf fournisseur ICT) | Oui | Non | Non | Non |
| CRA | Oui (si produit numérique) | Non (sauf produit) | Oui (si produit connecté) | Oui (si dispositif médical) | Selon activité |
| AI Act | Oui (si IA dans le produit) | Oui (scoring crédit = haut risque) | Selon usage IA | Oui (IA médicale = haut risque) | Selon usage IA |

## Plan d'action par texte

### NIS2 - Actions immédiates
| Action | Priorité | Échéance | Responsable |
| ------ | -------- | -------- | ----------- |
| Identifier si l'organisation est entité essentielle ou importante | Critique | Fait | DG + Juridique |
| Enregistrement auprès de l'ANSSI | Critique | Fait (oct. 2024) | RSSI |
| Mesures de gestion des risques (Art. 21) | Haute | En cours | RSSI |
| Procédure de notification d'incident (24h) | Haute | En cours | RSSI + SOC |
| Sécurité de la supply chain | Haute | T2 2026 | RSSI + Achats |
| Formation et sensibilisation des dirigeants | Haute | T1 2026 | RSSI + DG |

### CRA - Actions préparatoires (2026-2027)
| Action | Priorité | Échéance | Responsable |
| ------ | -------- | -------- | ----------- |
| Identifier les produits numériques concernés | Haute | T2 2026 | Product + Juridique |
| Mettre en place le processus de gestion des vulnérabilités | Haute | T3 2026 | RSSI + Dev |
| Générer les SBOM pour chaque produit | Haute | T4 2026 | DevSecOps |
| Intégrer la sécurité dans le cycle de développement (SDLC) | Haute | T1 2027 | Dev + RSSI |
| Préparer la documentation technique pour le marquage CE | Moyenne | T2 2027 | Product + RSSI |
| Notification de vulnérabilités exploitées à l'ENISA (24h) | Haute | T3 2026 | RSSI + SOC |

### AI Act - Actions selon le niveau de risque
| Niveau de risque identifié | Actions | Échéance |
| -------------------------- | ------- | -------- |
| Haut risque | Évaluation de conformité, documentation technique, supervision humaine | Août 2026 |
| Risque limité | Obligation de transparence (informer l'utilisateur) | Août 2025 |
| Usage IA générative | Marquage des contenus générés, respect du droit d'auteur | Août 2025 |
| Risque minimal | Aucune obligation spécifique, code de conduite volontaire | N/A |

REG_EOF

echo "Cartographie réglementaire créée"
```

**Résultat attendu** :

```text
Cartographie réglementaire créée
```

---

### Étape 5 : Créer un plan d'apprentissage continu

```bash
# Créer un plan d'apprentissage continu
cat > ~/tendances-2026/plan-apprentissage-continu.md << 'LEARN_EOF'
# Plan d'Apprentissage Continu en Cybersécurité

## Principe : la règle des 20%

Consacre 20% de ton temps professionnel à l'apprentissage.
Pour une semaine de 40h : 8h par semaine dédiées à la veille et à la montée
en compétences.

## Planning hebdomadaire type

| Jour | Durée | Activité |
| ---- | ----- | -------- |
| Lundi | 30 min | Veille quotidienne (CERT-FR, CISA KEV, actualités) |
| Mardi | 30 min | Veille quotidienne + lecture d'un write-up technique |
| Mercredi | 2h | Pratique technique (CTF, lab, outil) |
| Jeudi | 30 min | Veille quotidienne |
| Vendredi | 2h | Apprentissage structuré (cours, certification, livre) |
| Weekend | 2h (optionnel) | Projet personnel (outil, blog, contribution open-source) |

## Certifications recommandées par niveau

### Niveau confirmé / certifications avancées (horizon 2026-2027)

| Certification | Organisme | Domaine | Durée de préparation |
| ------------- | --------- | ------- | -------------------- |
| CISSP | (ISC)2 | Management de la sécurité | 3-6 mois |
| CISM | ISACA | Gouvernance et management | 3-4 mois |
| OSCP | OffSec | Pentest avancé | 3-6 mois |
| GCIH | GIAC/SANS | Incident handling | 2-3 mois |
| CCSP | (ISC)2 | Sécurité cloud | 2-3 mois |

### Niveau spécialisé (objectif 2027-2028)

| Certification | Organisme | Domaine | Durée de préparation |
| ------------- | --------- | ------- | -------------------- |
| OSWE | OffSec | Sécurité applicative web | 3-6 mois |
| OSED | OffSec | Exploitation de binaires | 4-6 mois |
| GXPN | GIAC/SANS | Exploitation avancée | 3-6 mois |
| GREM | GIAC/SANS | Reverse engineering malware | 3-4 mois |
| AWS Security Specialty | AWS | Sécurité cloud AWS | 2-3 mois |

## Livres recommandés (disponibles offline)

| Titre | Auteur | Domaine |
| ----- | ------ | ------- |
| The Web Application Hacker's Handbook | Stuttard & Pinto | Sécurité web |
| Practical Malware Analysis | Sikorski & Honig | Analyse de malware |
| Threat Modeling: Designing for Security | Adam Shostack | Threat modeling |
| Security Engineering | Ross Anderson | Architecture de sécurité |
| The Art of Software Security Assessment | Dowd, McDonald, Schuh | Audit de code |
| Cryptography Engineering | Ferguson, Schneier, Kohno | Cryptographie appliquée |
| Blue Team Handbook | Don Murdoch | Réponse aux incidents |

## Communautés à rejoindre

| Communauté | Format | Langue | URL |
| ---------- | ------ | ------ | --- |
| Discord Hack The Box | Chat | EN | discord.gg/hackthebox |
| Reddit r/netsec | Forum | EN | reddit.com/r/netsec |
| MUSIC (Meetup Sécurité) | Meetup | FR | Selon ville |
| CLUSIF | Association | FR | clusif.fr |
| OSSIR | Association | FR | ossir.org |
| FIRST | Association | EN | first.org |

LEARN_EOF

echo "Plan d'apprentissage continu créé"
```

**Résultat attendu** :

```text
Plan d'apprentissage continu créé
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `openssl list -kem-algorithms` | Lister les algorithmes KEM disponibles (dont PQC) |
| `openssl genpkey -algorithm ml-dsa-65 -out key.pem` | Générer une clé ML-DSA (Dilithium) post-quantique |
| `ssh-keygen -t ed25519` | Générer une clé SSH Ed25519 (préparer la transition PQC) |
| `pip install liboqs` | Installer la bibliothèque Open Quantum Safe en Python |
| `python3 -c "import oqs; print(oqs.get_enabled_kem_mechanisms())"` | Lister les algorithmes PQC disponibles via liboqs |
| `curl -s https://www.cert.ssi.gouv.fr/feed/ \| head -50` | Consulter le flux RSS du CERT-FR |
| `nmap --script ssl-enum-ciphers -p 443 target` | Inventorier les suites de chiffrement d'un serveur |

---

## Pièges Fréquents

### Piège 1 : Paniquer sur la menace quantique

**Problème** : certains vendeurs utilisent la peur de l'ordinateur quantique pour vendre des solutions PQC prématurées ou propriétaires. En 2026, aucun ordinateur quantique ne peut casser RSA-2048.

**Solution** : la menace est réelle mais pas immédiate. L'horizon est 10-15 ans pour les ordinateurs quantiques cryptographiquement pertinents. Le risque immédiat est le "harvest now, decrypt later" pour les données à longue durée de vie. Commence par l'inventaire cryptographique, puis planifie une migration hybride (classique + PQC) en utilisant uniquement les algorithmes standardisés par le NIST (FIPS 203, 204, 205).

### Piège 2 : Croire que l'IA résout tout

**Problème** : les éditeurs de sécurité ajoutent "AI-powered" à tous leurs produits. Certaines organisations pensent qu'un outil IA remplace une équipe SOC.

**Solution** : l'IA est un multiplicateur de force, pas un remplacement. Un modèle de détection mal entraîné génère plus de faux positifs qu'un SIEM bien configuré. L'IA défensive est efficace quand elle est combinée avec des analystes humains qualifiés, des processus solides et des données de qualité. Évalue chaque solution IA sur ses métriques (taux de détection, faux positifs) et pas sur son marketing.

### Piège 3 : Ignorer les nouvelles réglementations

**Problème** : NIS2, DORA, CRA, AI Act : le volume réglementaire est intimidant. Certaines organisations repoussent la mise en conformité "à plus tard".

**Solution** : les sanctions sont significatives (NIS2 : jusqu'à 10 M EUR ou 2% du CA ; CRA : jusqu'à 15 M EUR ou 2.5% du CA). Commence par identifier quels textes s'appliquent à ton organisation. Puis mappe les exigences sur tes contrôles existants (beaucoup sont déjà en place si tu appliques les bonnes pratiques). Priorise les gaps les plus critiques.

### Piège 4 : Négliger la convergence cyber-physique

**Problème** : les équipes IT/sécurité et les équipes OT/ingénierie travaillent en silo. Les risques cyber-physiques tombent entre les deux.

**Solution** : établis une gouvernance conjointe IT/OT. Forme les équipes OT aux risques cyber et les équipes cyber aux contraintes industrielles (disponibilité, sûreté). Utilise le framework NIST CSF qui s'applique aux deux domaines.

---

## Checklist de Validation

- [ ] Je comprends les menaces posées par l'IA offensive (deepfakes, agents autonomes, phishing IA)
- [ ] Je connais les applications de l'IA défensive (hunting, détection d'anomalies, SOAR)
- [ ] Je sais expliquer pourquoi les algorithmes RSA et ECC seront cassés par un ordinateur quantique
- [ ] Je connais les algorithmes PQC standardisés par le NIST (ML-KEM, ML-DSA, SLH-DSA)
- [ ] Je peux planifier une migration vers la cryptographie post-quantique
- [ ] Je comprends les risques de sécurité du edge computing et de la 5G
- [ ] Je connais les obligations du Cyber Resilience Act (CRA)
- [ ] Je connais la classification des risques de l'AI Act
- [ ] Je comprends les enjeux de la convergence cyber-physique
- [ ] J'ai un plan d'apprentissage continu structuré

---

## Exercice Pratique

**Énoncé** : Tu es RSSI d'un éditeur de logiciel SaaS (200 employés) qui utilise l'IA dans son produit (scoring de risque pour des clients bancaires). Tu dois préparer l'organisation pour 2027.

**Contexte** :

- Le produit est un SaaS B2B vendu à des banques européennes
- Le modèle ML de scoring de risque utilise des données personnelles (RGPD)
- Les clients bancaires sont soumis à DORA
- Le produit utilise du chiffrement RSA-2048 pour les communications et le stockage
- L'entreprise est classée "entité importante" au sens de NIS2
- Le produit contient des composants open-source (dépendances npm et Python)

**Travail demandé** :

1. Réaliser une analyse de menaces IA (STRIDE) pour le modèle ML de scoring
2. Créer un plan de migration vers la cryptographie post-quantique
3. Cartographier les obligations réglementaires (RGPD + NIS2 + DORA fournisseur ICT + CRA + AI Act)
4. Proposer un plan d'action prioritaire pour 2026-2027
5. Identifier les compétences à acquérir et les certifications à préparer

**Indications** :

- Le modèle ML de scoring est classé "haut risque" par l'AI Act (scoring de crédit)
- En tant que fournisseur ICT de banques, certaines obligations DORA s'appliquent
- Le CRA s'applique car c'est un produit numérique avec des éléments logiciels
- Les données de scoring ont une durée de vie de 7 ans (obligation bancaire)
- Le budget sécurité est de 500 000 EUR/an

**Résultat attendu** :

- Un fichier `stride-ml-scoring.md` avec l'analyse de menaces IA
- Un fichier `migration-pqc-saas.md` avec le plan de migration PQC
- Un fichier `conformite-2027.md` avec la cartographie réglementaire
- Un fichier `plan-action-2026-2027.md` avec les priorités et le budget
- Un fichier `plan-competences.md` avec les certifications et formations

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### 1. Analyse de menaces IA - Modèle ML de scoring

| Catégorie STRIDE | Menace | Sévérité | Contrôle |
| ---------------- | ------ | -------- | -------- |
| Spoofing | Injection de fausses données client pour obtenir un score favorable | Critique | Validation d'identité forte, corrélation multi-sources |
| Tampering | Data poisoning du dataset d'entraînement | Critique | Audit du pipeline de données, versioning des datasets |
| Repudiation | Décision de scoring non traçable (non-conformité AI Act) | Haute | Logging complet des features d'entrée et du score de sortie |
| Info Disclosure | Model inversion : extraire des données personnelles du modèle | Haute | Differential privacy, limitation des requêtes API |
| DoS | Surcharge de l'API de scoring | Moyenne | Rate limiting, auto-scaling, dégradation gracieuse |
| Elevation | Adversarial input pour manipuler le score | Critique | Détection d'anomalies sur les entrées, validation humaine des cas limites |

### 2. Plan de migration PQC

```text
Phase 1 - Inventaire (T1-T2 2026) : 0 EUR
- Inventorier tous les usages de RSA-2048 (TLS, API, stockage)
- Identifier les données à longue durée de vie (7 ans min pour le bancaire)
- Évaluer la compatibilité des clients avec les algorithmes PQC

Phase 2 - Mode hybride (T3-T4 2026) : 30 000 EUR
- Déployer TLS hybride : X25519 + ML-KEM-768 (avec liboqs/OpenSSL)
- Tester la compatibilité avec les navigateurs et clients API
- Documenter la procédure de rollback

Phase 3 - Migration stockage (2027) : 50 000 EUR
- Ré-chiffrer les données au repos avec des clés PQC (ou clés hybrides)
- Mettre à jour les signatures de code et les certificats

Total sur 2 ans : 80 000 EUR
```

### 3. Cartographie réglementaire

| Texte | Applicable | Raison | Obligation clé |
| ----- | ---------- | ------ | -------------- |
| RGPD | Oui | Données personnelles dans le scoring | Minimisation, DPIA, droit d'explication |
| NIS2 | Oui | Entité importante | Mesures de sécurité Art. 21, notification 24h |
| DORA | Partiellement | Fournisseur ICT de banques | Gestion des risques ICT pour les tiers (Art. 28-30) |
| CRA | Oui | Produit numérique SaaS | Security by design, SBOM, patches 5 ans |
| AI Act | Oui | Scoring de crédit = haut risque | Évaluation de conformité, documentation, supervision humaine |

### 4. Plan d'action prioritaire

| Priorité | Action | Budget | Échéance |
| -------- | ------ | ------ | -------- |
| 1 | Conformité AI Act (documentation, supervision humaine) | 80 000 EUR | T3 2026 |
| 2 | Notification d'incident NIS2 (procédure + exercice) | 20 000 EUR | T2 2026 |
| 3 | SBOM et gestion des vulnérabilités (CRA) | 50 000 EUR | T4 2026 |
| 4 | Migration PQC (mode hybride) | 30 000 EUR | T4 2026 |
| 5 | Audit DORA fournisseur ICT | 40 000 EUR | T1 2027 |
| 6 | Sécurité du modèle ML (adversarial testing) | 60 000 EUR | T2 2027 |
| 7 | Formation et certifications | 30 000 EUR | Continue |
| **Total** | | **310 000 EUR** | |

### 5. Plan de compétences

| Compétence | Certification cible | Pour qui | Échéance |
| ---------- | ------------------- | -------- | -------- |
| Management sécurité | CISSP | RSSI | T4 2026 |
| Conformité AI | AI Ethics Professional (IAPP) | Responsable conformité | T2 2027 |
| Sécurité cloud AWS | AWS Security Specialty | Ingénieur DevSecOps | T3 2026 |
| Pentest applicatif | OSWE | Ingénieur sécurité | T1 2027 |
| PQC | Formation ANSSI/NIST (quand disponible) | Équipe crypto | 2027 |

---

## Fin du cursus

Cette fiche conclut le **parcours de lecture** du cursus cybersécurité. Tu as parcouru les 8 phases, des fondamentaux informatiques jusqu'à l'architecture, la GRC et les tendances.

**Rappel du parcours complet** :

| Phase | Thème | Statut lecture |
| ----- | ----- | -------------- |
| 1 | Fondamentaux Informatiques | Parcouru |
| 2 | Fondamentaux de la Sécurité | Parcouru |
| 3 | Compétences Intermédiaires | Parcouru |
| 4 | Spécialisation Offensive | Parcouru |
| 5 | Spécialisation Défensive | Parcouru |
| 6 | Domaines Avancés | Parcouru |
| 7 | Red Team Avancé | Parcouru |
| 8 | Expertise et Leadership | Parcouru |

La cybersécurité est un domaine en évolution permanente. Lire ces fiches n'équivaut pas à un niveau professionnel : la suite repose sur labs autorisés, projets, veille et, le cas échéant, certifications. Utilise le plan d'apprentissage continu de cette fiche pour rester à jour.

---

## Navigation

← Fiche précédente : **[03 - Recherche en Sécurité et Contribution Communautaire](03-recherche-securite.md)**
