---
tags:
  - Cybersécurité
  - Expert
  - Concept
description: "Conception d'architectures sécurisées, Zéro Trust, threat modeling STRIDE/PASTA, security by design"
estimated_time: "50 min"
fiche_number: 1
total_fiches: 4
cursus: "Phase 8 - Expertise et Leadership"
---

# 01 - Architecture de Sécurité

> **En bref** : À la fin de cette fiche, tu sauras concevoir une architecture de sécurité complète en appliquant les principes Zéro Trust, modéliser les menaces avec STRIDE et PASTA, et évaluer des solutions de sécurité pour une organisation. Lecture estimée : 50 min.


## Prérequis

- [Phase 1 - Fondamentaux informatiques](../01-fondamentaux-informatiques/index.md), [Phase 2 - Fondamentaux sécurité](../02-fondamentaux-securite/index.md), [Phase 3 - Compétences intermédiaires](../03-competences-intermediaires/index.md), [Phase 4 - Spécialisation offensive](../04-specialisation-offensive/index.md) ou [Phase 5 - Spécialisation défensive](../05-specialisation-defensive/index.md), et [Phase 6 - Domaines avancés](../06-domaines-avances/index.md) complètes
- Connaissance des modèles réseau (OSI, TCP/IP) et des architectures cloud ([Phase 6, fiche 01](../06-domaines-avances/01-securite-cloud.md))
- Maîtrise des concepts de défense en profondeur ([Phase 2, fiche 01](../02-fondamentaux-securite/01-principes-securite.md))
- Compréhension des principes de gouvernance et de gestion des risques ([Phase 2, fiche 04](../02-fondamentaux-securite/04-gouvernance-risque-conformite.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras concevoir une architecture de sécurité complète en appliquant les principes Zéro Trust, modéliser les menaces avec STRIDE et PASTA, et évaluer des solutions de sécurité pour une organisation.

---

## Concepts

### Qu'est-ce qu'une architecture de sécurité ?

**Définition** : Une architecture de sécurité est un plan structuré qui définit comment les composants de sécurité (contrôles, technologies, processus) sont organisés et interconnectés pour protéger les actifs d'une organisation contre les menaces.

**Le problème que l'architecture de sécurité résout** :

Sans architecture de sécurité, voici les problèmes rencontrés :

1. **Sécurité réactive** : les contrôles sont ajoutés après les incidents, sans cohérence globale
2. **Redondances et lacunes** : certains actifs sont sur-protégés tandis que d'autres restent exposés
3. **Coûts incontrôlés** : les achats de solutions se font sans vision d'ensemble, menant à des chevauchements
4. **Complexité ingérable** : sans plan directeur, l'empilement de technologies crée une dette technique de sécurité
5. **Absence de traçabilité** : impossible de prouver que chaque risque identifié est couvert par un contrôle

**Comment l'architecture de sécurité résout ces problèmes** :

| Problème | Solution apportée par l'architecture de sécurité |
| -------- | ------------------------------------------------- |
| Sécurité réactive | Approche proactive : les contrôles sont planifiés avant les incidents |
| Redondances et lacunes | Cartographie complète des actifs et des contrôles associés |
| Coûts incontrôlés | Rationalisation des investissements grâce à une vision d'ensemble |
| Complexité ingérable | Plan directeur qui organise les composants en couches logiques |
| Absence de traçabilité | Matrice de correspondance risques/contrôles documentée |

**Analogie concrète** : Construire un bâtiment sans plan d'architecte, c'est poser des murs au hasard. Certaines pièces auront trois portes blindées, d'autres n'auront pas de serrure. L'architecture de sécurité est le plan de l'architecte : elle décide où placer les murs porteurs (contrôles critiques), les issues de secours (plans de reprise), les détecteurs de fumée (monitoring) et les coffres-forts (chiffrement), avant de poser la première brique.

**Ce que l'architecture de sécurité n'est PAS** :

- L'architecture de sécurité n'est pas une liste de produits à acheter. Elle définit des fonctions de sécurité, pas des noms de produits
- L'architecture de sécurité n'est pas figée. Elle évolue avec les menaces, les technologies et les besoins métier
- L'architecture de sécurité n'est pas un audit. L'audit évalue l'existant, l'architecture conçoit la cible

---

### Qu'est-ce que le Zéro Trust ?

**Définition** : Le Zéro Trust (confiance zéro) est un modèle de sécurité fondé sur le principe "ne jamais faire confiance, toujours vérifier". Chaque accès à une ressource est vérifié explicitement, quel que soit l'emplacement de l'utilisateur ou du périphérique (à l'intérieur ou à l'extérieur du réseau).

**Le problème que le Zéro Trust résout** :

Sans Zéro Trust, voici les problèmes rencontrés :

1. **Modèle périmétrique obsolète** : la sécurité repose sur un firewall de bordure. Une fois à l'intérieur du réseau, un attaquant se déplace librement (mouvement latéral)
2. **Télétravail et cloud** : les employés accèdent aux ressources depuis partout. La notion de "périmètre réseau" n'a plus de sens
3. **Comptes compromis** : un VPN donne accès à tout le réseau interne. Un seul identifiant volé expose l'ensemble des ressources
4. **Menaces internes** : un employé malveillant ou un poste infecté à l'intérieur du réseau contourne les défenses périmétriques

**Comment le Zéro Trust résout ces problèmes** :

| Problème | Solution apportée par le Zéro Trust |
| -------- | ----------------------------------- |
| Modèle périmétrique obsolète | Vérification à chaque accès, pas uniquement au périmètre |
| Télétravail et cloud | L'identité et le contexte remplacent la localisation réseau |
| Comptes compromis | Accès au moindre privilège + MFA + vérification continue |
| Menaces internes | Microsegmentation : chaque ressource est isolée et protégée |

**Analogie concrète** : Dans un hôtel classique (modèle périmétrique), tu montres ta carte d'identité à l'accueil, puis tu circules librement dans tout le bâtiment. Dans un hôtel Zéro Trust, chaque porte (chambre, salle de conférence, piscine) vérifie ton badge, tes droits et l'heure avant de s'ouvrir. Même si quelqu'un vole un badge, il ne peut accéder qu'à des zones limitées.

**Ce que le Zéro Trust n'est PAS** :

- Le Zéro Trust n'est pas un produit. C'est un modèle d'architecture, pas un logiciel à installer
- Le Zéro Trust ne signifie pas "bloquer tout par défaut". Il signifie "vérifier avant d'autoriser"
- Le Zéro Trust ne remplace pas le firewall. Il ajoute des couches de vérification supplémentaires

**Les 7 principes fondamentaux du Zéro Trust (NIST SP 800-207)** :

| # | Principe | Description |
| - | -------- | ----------- |
| 1 | Toute ressource est une source de données | Les données, services et appareils sont tous des ressources à protéger |
| 2 | Toute communication est sécurisée | Chiffrement et authentification même sur le réseau interne |
| 3 | Accès accordé par session | Chaque demande d'accès est évaluée individuellement |
| 4 | Accès déterminé par politique dynamique | L'identité, le contexte, le comportement et l'état du device déterminent l'accès |
| 5 | Surveillance de l'intégrité des assets | L'organisation monitore en continu la posture de sécurité des périphériques |
| 6 | Authentification et autorisation dynamiques | MFA stricte, réévaluation continue pendant la session |
| 7 | Collecte maximale d'informations | Les logs et le contexte alimentent l'amélioration continue des politiques |

---

### Qu'est-ce que le Security by Design ?

**Définition** : Le Security by Design est une approche qui intègre la sécurité dès les premières phases de conception d'un système, d'une application ou d'une infrastructure, plutôt que de l'ajouter après coup.

**Le problème que le Security by Design résout** :

Sans Security by Design, voici les problèmes rencontrés :

1. **Coût de correction exponentiel** : corriger une faille en production coûte 30 à 100 fois plus cher qu'en phase de conception
2. **Vulnérabilités structurelles** : certaines failles sont impossibles à corriger sans refonte complète (ex : absence de chiffrement dans le protocole de base)
3. **Retards de mise en production** : l'audit de sécurité en fin de projet bloque le déploiement

**Comment le Security by Design résout ces problèmes** :

| Problème | Solution apportée par le Security by Design |
| -------- | -------------------------------------------- |
| Coût de correction exponentiel | La sécurité est intégrée dès la conception, réduisant les corrections tardives |
| Vulnérabilités structurelles | Les choix d'architecture intègrent la sécurité dès le départ |
| Retards de mise en production | La sécurité est validée à chaque étape, pas uniquement en fin de projet |

**Analogie concrète** : Construire une maison avec des fondations antisismiques dès le départ coûte 10% de plus. Reprendre les fondations d'une maison déjà construite pour la rendre antisismique coûte plus cher que la maison elle-même. Le Security by Design, c'est couler les fondations antisismiques dès le premier jour.

---

### Qu'est-ce que le Threat Modeling ?

**Définition** : Le threat modeling (modélisation des menaces) est un processus structuré qui identifie les menaces potentielles, les vulnérabilités et les vecteurs d'attaque d'un système, afin de définir les contrôles de sécurité appropriés.

**Le problème que le threat modeling résout** :

Sans threat modeling, voici les problèmes rencontrés :

1. **Menaces invisibles** : les équipes ne réfléchissent pas aux scénarios d'attaque avant qu'ils se produisent
2. **Priorisation impossible** : sans évaluation des menaces, tous les risques semblent équivalents
3. **Contrôles mal dimensionnés** : on protège ce qui est facile à protéger, pas ce qui est le plus exposé

**Comment le threat modeling résout ces problèmes** :

| Problème | Solution apportée par le threat modeling |
| -------- | ---------------------------------------- |
| Menaces invisibles | Identification systématique de toutes les menaces via une méthodologie structurée |
| Priorisation impossible | Classification des menaces par impact et probabilité |
| Contrôles mal dimensionnés | Les contrôles sont alignés sur les menaces identifiées |

**Analogie concrète** : Avant de sécuriser ta maison, tu fais le tour du quartier pour observer : où sont les points d'entrée (portes, fenêtres), quels sont les risques (cambriolage, inondation, incendie), quels voisins sont fiables. Le threat modeling, c'est cette inspection systématique appliquée à un système informatique.

**Les deux méthodologies principales** :

**STRIDE** (Microsoft) : classifie les menaces en 6 catégories :

| Catégorie | Menace | Propriété violée | Exemple |
| --------- | ------ | ----------------- | ------- |
| **S**poofing | Usurpation d'identité | Authentification | Un attaquant se fait passer pour un administrateur |
| **T**ampering | Altération de données | Intégrité | Modification d'un fichier de configuration en transit |
| **R**epudiation | Répudiation | Non-répudiation | Un utilisateur nie avoir effectué une transaction |
| **I**nformation Disclosure | Divulgation d'informations | Confidentialité | Fuite de données personnelles via une API |
| **D**enial of Service | Déni de service | Disponibilité | Surcharge d'un serveur par un botnet |
| **E**levation of Privilege | Élévation de privilèges | Autorisation | Un utilisateur standard obtient les droits admin |

**PASTA** (Process for Attack Simulation and Threat Analysis) : approche en 7 étapes centrée sur le risque métier :

| Étape | Nom | Description |
| ----- | --- | ----------- |
| 1 | Définition des objectifs | Identifier les objectifs métier et les exigences de sécurité |
| 2 | Définition du périmètre technique | Inventorier les composants techniques du système |
| 3 | Décomposition de l'application | Créer un diagramme de flux de données (DFD) |
| 4 | Analyse des menaces | Identifier les menaces à partir de sources de threat intelligence |
| 5 | Analyse des vulnérabilités | Mapper les vulnérabilités connues sur les composants |
| 6 | Modélisation des attaques | Construire des arbres d'attaque pour chaque scénario |
| 7 | Analyse de risque et contre-mesures | Calculer le risque résiduel et définir les contrôles |

**Comparaison STRIDE vs PASTA** :

| STRIDE | PASTA |
| ------ | ----- |
| Centré sur les catégories de menaces | Centré sur le risque métier |
| Rapide à appliquer (workshop 2-4h) | Processus complet (plusieurs jours) |
| Idéal pour une application ou un composant | Idéal pour un système complexe ou une entreprise |
| Résultat : liste de menaces par catégorie | Résultat : arbres d'attaque avec risque quantifié |
| Créé par Microsoft | Créé par Tony UcedaVélez (VerSprite) |

---

### Qu'est-ce que le rôle de Security Architect ?

**Définition** : Le Security Architect est le professionnel responsable de la conception, de la validation et de l'évolution de l'architecture de sécurité d'une organisation. Il traduit les exigences métier et réglementaires en solutions techniques cohérentes.

**Responsabilités principales** :

| Domaine | Responsabilité |
| ------- | -------------- |
| Conception | Définir les architectures de sécurité pour les projets et l'infrastructure |
| Standards | Rédiger et maintenir les guidelines et patterns de sécurité |
| Évaluation | Valider les choix technologiques et les solutions proposées par les équipes |
| Threat modeling | Piloter les exercices de modélisation des menaces |
| Conformité | S'assurer que l'architecture respecte les référentiels (ISO 27001, NIS2, etc.) |
| Communication | Présenter les risques et les recommandations à la direction |

**Compétences clés** :

- Maîtrise des frameworks d'architecture : TOGAF, SABSA, Zachman
- Connaissance approfondie des technologies de sécurité : IAM, PKI, SIEM, EDR, WAF, ZTNA
- Capacité à communiquer avec les équipes techniques ET la direction métier
- Veille continue sur les menaces et les technologies émergentes

---

## Étapes Pratiques

### Étape 1 : Modéliser les menaces avec STRIDE

Dans cet exercice, tu vas appliquer STRIDE à une application web e-commerce classique.

**Description du système** : une application web avec un frontend, une API REST, une base de données PostgreSQL et un service de paiement externe.

Commence par créer un diagramme de flux de données (DFD) en texte :

```text
[Utilisateur] --HTTPS--> [Frontend Web]
[Frontend Web] --API REST--> [Serveur API]
[Serveur API] --SQL--> [Base de données PostgreSQL]
[Serveur API] --HTTPS--> [Service de paiement externe]
[Administrateur] --SSH--> [Serveur API]
```

Identifie les limites de confiance (trust boundaries) :

```text
Limite 1 : Internet <-> Frontend Web (périmètre public)
Limite 2 : Frontend Web <-> Serveur API (réseau interne)
Limite 3 : Serveur API <-> Base de données (réseau données)
Limite 4 : Serveur API <-> Service de paiement (réseau partenaire)
```

Applique STRIDE à chaque flux de données. Crée un fichier de travail :

```bash
# Créer un répertoire de travail pour le threat model
mkdir -p ~/threat-model-ecommerce

# Créer le fichier d'analyse STRIDE
cat > ~/threat-model-ecommerce/stride-analysis.md << 'STRIDE_EOF'
# Analyse STRIDE - Application E-commerce

## Flux 1 : Utilisateur -> Frontend Web (HTTPS)

| Catégorie | Menace identifiée | Sévérité | Contrôle proposé |
| --------- | ----------------- | -------- | ---------------- |
| Spoofing | Phishing : faux site imitant le frontend | Haute | Certificat EV, HSTS, sensibilisation |
| Tampering | Injection XSS via formulaires | Haute | CSP strict, validation côté serveur |
| Repudiation | Utilisateur nie une commande | Moyenne | Logs horodatés, confirmation par email |
| Info Disclosure | Fuite de tokens de session | Haute | HttpOnly, Secure, SameSite cookies |
| DoS | DDoS sur le frontend | Haute | CDN, rate limiting, WAF |
| Elevation | Accès admin via manipulation de cookies | Haute | JWT signé, vérification côté serveur |

## Flux 2 : Frontend Web -> Serveur API (API REST)

| Catégorie | Menace identifiée | Sévérité | Contrôle proposé |
| --------- | ----------------- | -------- | ---------------- |
| Spoofing | Requête forgée (SSRF) vers l'API | Haute | Validation d'origine, mTLS |
| Tampering | Modification du payload JSON | Haute | Signature des requêtes, validation schema |
| Repudiation | Action API sans trace | Moyenne | Logging centralisé de toutes les requêtes |
| Info Disclosure | Erreurs détaillées exposées | Moyenne | Messages d'erreur génériques en production |
| DoS | Requêtes massives sur endpoints lourds | Haute | Rate limiting par endpoint, pagination |
| Elevation | IDOR (accès aux données d'autres users) | Haute | Contrôle d'autorisation systématique |

## Flux 3 : Serveur API -> Base de données (SQL)

| Catégorie | Menace identifiée | Sévérité | Contrôle proposé |
| --------- | ----------------- | -------- | ---------------- |
| Spoofing | Connexion avec identifiants volés | Haute | Secrets manager, rotation des mots de passe |
| Tampering | Injection SQL | Critique | Requêtes préparées exclusivement |
| Info Disclosure | Dump de la base via SQLi | Critique | Chiffrement au repos, segmentation réseau |
| DoS | Requêtes lourdes saturant la base | Haute | Connection pooling, timeouts, query analysis |

STRIDE_EOF

echo "Fichier d'analyse STRIDE créé avec succès"
```

**Résultat attendu** :

```text
Fichier d'analyse STRIDE créé avec succès
```

---

### Étape 2 : Concevoir une architecture Zéro Trust

Tu vas concevoir une architecture Zéro Trust pour un réseau d'entreprise avec 200 employés (50% en télétravail).

```bash
# Créer le document d'architecture Zero Trust
cat > ~/threat-model-ecommerce/zero-trust-architecture.md << 'ZTA_EOF'
# Architecture Zero Trust - Entreprise 200 employés

## 1. Pilier Identité (Identity)

### Composants :
- **IdP (Identity Provider)** : Azure AD / Keycloak
- **MFA obligatoire** : TOTP ou FIDO2 pour tous les accès
- **SSO (Single Sign-On)** : SAML 2.0 / OIDC pour toutes les applications
- **Conditional Access** : règles basées sur le risque

### Politique :
- Aucun accès sans authentification forte (MFA)
- Session maximale : 8 heures, re-authentification obligatoire
- Comptes à privilèges : MFA résistante au phishing (FIDO2 uniquement)

## 2. Pilier Périphérique (Device)

### Composants :
- **MDM (Mobile Device Management)** : Intune / Fleet
- **EDR** : CrowdStrike / Wazuh sur tous les endpoints
- **Compliance check** : état du device vérifié avant chaque accès

### Politique :
- Seuls les devices conformes accèdent aux ressources
- Critères de conformité : OS à jour, EDR actif, chiffrement disque activé
- Devices personnels (BYOD) : accès limité aux applications web uniquement

## 3. Pilier Réseau (Network)

### Composants :
- **ZTNA (Zero Trust Network Access)** : remplace le VPN traditionnel
- **Microsegmentation** : isolation des workloads par application
- **SDP (Software-Defined Perimeter)** : les ressources sont invisibles par défaut

### Architecture réseau :
+------------------+     +------------------+     +------------------+
| Segment Web      |     | Segment API      |     | Segment Données  |
| (DMZ)            |--X--| (Applicatif)     |--X--| (Base de données)|
| WAF, CDN, LB     |     | API Gateway, mTLS|     | Chiffrement, ACL |
+------------------+     +------------------+     +------------------+
        |                         |                         |
        +-------------------------+-------------------------+
                                  |
                        [Policy Engine]
                        [Decision Point]

### Politique :
- Aucun flux réseau autorisé par défaut (deny all)
- Chaque flux est autorisé explicitement par une règle de politique
- Chiffrement TLS 1.3 pour tous les flux internes et externes

## 4. Pilier Application (Application)

### Composants :
- **API Gateway** : validation, authentification, rate limiting
- **Service Mesh** : mTLS entre microservices (Istio / Linkerd)
- **WAF** : protection des applications web exposées

### Politique :
- Chaque application déclare ses dépendances explicitement
- Accès inter-services via mTLS avec certificats courts (24h)
- Aucun accès direct à la base de données depuis le frontend

## 5. Pilier Données (Data)

### Composants :
- **DLP (Data Loss Prevention)** : classification et protection des données
- **Chiffrement** : au repos (AES-256) et en transit (TLS 1.3)
- **Gestion des droits** : RBAC + ABAC selon la sensibilité

### Politique :
- Données classifiées en 4 niveaux : Public, Interne, Confidentiel, Secret
- Accès aux données Confidentiel/Secret : justification obligatoire (just-in-time)
- Logs d'accès aux données conservés 12 mois minimum

ZTA_EOF

echo "Architecture Zero Trust documentée"
```

**Résultat attendu** :

```text
Architecture Zero Trust documentée
```

---

### Étape 3 : Évaluer et sélectionner des solutions de sécurité

Tu vas créer une matrice d'évaluation pour sélectionner une solution ZTNA.

```bash
# Créer la matrice d'évaluation
cat > ~/threat-model-ecommerce/evaluation-ztna.md << 'EVAL_EOF'
# Matrice d'évaluation - Solution ZTNA

## Critères d'évaluation (pondérés sur 100)

| # | Critère | Poids | Description |
| - | ------- | ----- | ----------- |
| 1 | Sécurité | 30% | MFA, chiffrement, Zero Trust natif |
| 2 | Intégration | 20% | Compatibilité avec l'existant (AD, SIEM, EDR) |
| 3 | Performance | 15% | Latence, bande passante, scalabilité |
| 4 | Administration | 15% | Facilité de déploiement et de gestion |
| 5 | Coût | 10% | TCO sur 3 ans (licence + infra + personnel) |
| 6 | Support | 10% | SLA, documentation, communauté |

## Grille de notation (exemple)

| Critère | Solution A (Zscaler ZPA) | Solution B (Cloudflare Access) | Solution C (Tailscale) |
| ------- | ------------------------ | ------------------------------ | ---------------------- |
| Sécurité (30%) | 9/10 = 27 | 8/10 = 24 | 7/10 = 21 |
| Intégration (20%) | 8/10 = 16 | 9/10 = 18 | 6/10 = 12 |
| Performance (15%) | 8/10 = 12 | 9/10 = 13.5 | 8/10 = 12 |
| Administration (15%) | 7/10 = 10.5 | 8/10 = 12 | 9/10 = 13.5 |
| Coût (10%) | 5/10 = 5 | 7/10 = 7 | 9/10 = 9 |
| Support (10%) | 8/10 = 8 | 8/10 = 8 | 6/10 = 6 |
| **TOTAL** | **78.5** | **82.5** | **73.5** |

## Décision
Solution recommandée : Solution B (Cloudflare Access) - meilleur score global.
Justification : bon équilibre sécurité/intégration/performance, coût raisonnable.

EVAL_EOF

echo "Matrice d'évaluation créée"
```

**Résultat attendu** :

```text
Matrice d'évaluation créée
```

---

### Étape 4 : Appliquer PASTA pour un threat model entreprise

```bash
# Créer le threat model PASTA
cat > ~/threat-model-ecommerce/pasta-threat-model.md << 'PASTA_EOF'
# Threat Model PASTA - Plateforme E-commerce

## Étape 1 : Objectifs métier

- Disponibilité 99.9% (perte max : 8.7h/an)
- Conformité PCI-DSS pour le traitement des paiements
- Protection des données personnelles (RGPD)
- Temps de réponse < 200ms pour 95% des requêtes

## Étape 2 : Périmètre technique

| Composant | Technologie | Exposition |
| --------- | ----------- | ---------- |
| Frontend | React, CDN Cloudflare | Internet (public) |
| API Backend | Node.js, Express | Réseau interne |
| Base de données | PostgreSQL 16 | Réseau données (isolé) |
| Cache | Redis | Réseau interne |
| File d'attente | RabbitMQ | Réseau interne |
| Paiement | Stripe API (externe) | HTTPS sortant |
| Monitoring | Prometheus + Grafana | Réseau management |

## Étape 3 : Décomposition (DFD niveau 1)

Processus principaux :
1. Authentification utilisateur
2. Catalogue produits (lecture)
3. Panier et commande (écriture)
4. Paiement (interaction externe)
5. Administration (back-office)

## Étape 4 : Analyse des menaces (sources CTI)

| Source | Menaces identifiées |
| ------ | ------------------- |
| OWASP Top 10 2025 | A01 Broken Access Control (inclut souvent SSRF), A02 Security Misconfiguration, A03 Software Supply Chain Failures, A05 Injection (mapping exact : voir la fiche sécurité web) |
| MITRE ATT&CK | Initial Access (T1190), Lateral Movement (T1021), Exfiltration (T1041) |
| Threat Intel sectoriel | Magecart (skimming JavaScript), credential stuffing |

## Étape 5 : Vulnérabilités mappées

| Composant | Vulnérabilité | CVE/Référence |
| --------- | ------------- | ------------- |
| Node.js | Prototype pollution | CVE-2022-21824 (exemple) |
| PostgreSQL | Escalade de privilèges | CVE-2023-5868 (exemple) |
| Dépendances npm | Supply chain attack | Cas event-stream (2018) |

## Étape 6 : Arbres d'attaque (exemple : vol de données de paiement)

Objectif attaquant : voler les numéros de carte bancaire

Scénario 1 : Injection Magecart
  -> Compromission d'une dépendance npm
    -> Injection de JavaScript malveillant dans le frontend
      -> Exfiltration des données de formulaire de paiement

Scénario 2 : Compromission du serveur API
  -> Exploitation d'une vulnérabilité Node.js
    -> Accès au réseau interne
      -> Pivot vers la base de données
        -> Extraction des données de paiement

## Étape 7 : Risque et contre-mesures

| Scénario | Impact | Probabilité | Risque | Contre-mesure |
| -------- | ------ | ----------- | ------ | ------------- |
| Magecart | Critique | Moyenne | Élevé | SRI, CSP strict, audit npm |
| Compromission API | Critique | Faible | Moyen | WAF, patching, segmentation |
| Credential stuffing | Élevé | Haute | Élevé | MFA, rate limiting, CAPTCHA |
| DDoS | Élevé | Moyenne | Moyen | CDN, auto-scaling, WAF |

PASTA_EOF

echo "Threat model PASTA complet"
```

**Résultat attendu** :

```text
Threat model PASTA complet
```

---

### Étape 5 : Documenter les standards d'architecture

```bash
# Créer un document de standards d'architecture sécurité
cat > ~/threat-model-ecommerce/security-standards.md << 'STD_EOF'
# Standards d'Architecture Sécurité - Organisation

## Standard 1 : Authentification

| Règle | Exigence |
| ----- | -------- |
| AUTH-01 | MFA obligatoire pour tout accès à une ressource interne |
| AUTH-02 | Protocoles autorisés : OIDC, SAML 2.0. LDAP interdit en direct |
| AUTH-03 | Durée maximale de session : 8h (applications), 1h (administration) |
| AUTH-04 | Comptes de service : certificats mTLS, rotation 90 jours |
| AUTH-05 | Mots de passe : minimum 14 caractères, vérification contre dictionnaires compromis |

## Standard 2 : Chiffrement

| Règle | Exigence |
| ----- | -------- |
| CRYPTO-01 | TLS 1.3 pour tout flux réseau (TLS 1.2 toléré temporairement) |
| CRYPTO-02 | Chiffrement au repos AES-256 pour les données Confidentiel et Secret |
| CRYPTO-03 | Gestion des clés via HSM ou KMS cloud (jamais en clair dans le code) |
| CRYPTO-04 | Certificats : durée maximale 1 an, renouvellement automatique (Let's Encrypt / ACME) |

## Standard 3 : Réseau

| Règle | Exigence |
| ----- | -------- |
| NET-01 | Microsegmentation : chaque application dans son propre segment |
| NET-02 | Deny all par défaut, allow list explicite |
| NET-03 | Aucun accès direct Internet depuis les segments internes (proxy obligatoire) |
| NET-04 | DNS interne résolu par des serveurs dédiés (pas de DNS public) |

## Standard 4 : Logging et monitoring

| Règle | Exigence |
| ----- | -------- |
| LOG-01 | Tous les événements d'authentification logués (succès et échecs) |
| LOG-02 | Rétention minimum : 12 mois en ligne, 5 ans en archive |
| LOG-03 | Centralisation dans un SIEM avec corrélation automatique |
| LOG-04 | Alertes temps réel pour les événements critiques (brute force, accès admin, exfiltration) |

STD_EOF

echo "Standards d'architecture documentés"
```

**Résultat attendu** :

```text
Standards d'architecture documentés
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `nmap -sV --script=ssl-enum-ciphers target` | Auditer les suites de chiffrement TLS d'un serveur |
| `testssl.sh target:443` | Analyse complète de la configuration TLS |
| `openssl s_client -connect target:443` | Vérifier le certificat et la chaîne de confiance |
| `curl -I https://target` | Vérifier les en-têtes de sécurité HTTP (HSTS, CSP, X-Frame) |
| `nikto -h https://target` | Scanner les vulnérabilités web courantes |
| `docker run --rm -it threatdragon/threat-dragon` | Lancer OWASP Threat Dragon pour modéliser les menaces graphiquement |
| `pip install pytm && python3 threat_model.py` | Générer un threat model avec pytm (Python) |

---

## Pièges Fréquents

### Piège 1 : Confondre Zéro Trust et "tout bloquer"

**Problème** : certaines équipes implémentent le Zéro Trust en bloquant tous les accès par défaut sans mettre en place les mécanismes de vérification dynamique. Résultat : les utilisateurs ne peuvent plus travailler.

**Solution** : le Zéro Trust ne signifie pas "pas de confiance". Il signifie "confiance vérifiée". Mets en place les piliers dans l'ordre : identité (MFA + SSO) d'abord, puis périphérique (compliance check), puis réseau (microsegmentation). Commence par le mode "monitor" avant de passer en "enforce".

### Piège 2 : Appliquer STRIDE sans DFD

**Problème** : certains appliquent STRIDE en listant des menaces génériques sans avoir d'abord décomposé le système en flux de données. Le résultat est une liste de menaces théoriques sans lien avec l'architecture réelle.

**Solution** : toujours commencer par un Data Flow Diagram (DFD) avec les limites de confiance. Ensuite, appliquer STRIDE à chaque flux qui traverse une limite de confiance.

### Piège 3 : Architecture "papier" sans validation

**Problème** : l'architecture de sécurité est documentée mais jamais testée. Les contrôles théoriques ne fonctionnent pas en pratique.

**Solution** : chaque contrôle documenté dans l'architecture doit être validé par un test technique. Utilise des exercices Red Team ou des tests de pénétration pour vérifier que les contrôles fonctionnent comme prévu.

### Piège 4 : Oublier les flux Est-Ouest

**Problème** : la sécurité se concentre sur les flux Nord-Sud (entrée/sortie du réseau) et ignore les flux Est-Ouest (communication entre services internes).

**Solution** : en Zéro Trust, les flux internes sont aussi surveillés et chiffrés. Utilise un service mesh (Istio, Linkerd) pour le mTLS entre microservices et des règles de microsegmentation pour les communications inter-segments.

---

## Checklist de Validation

- [ ] Je sais définir ce qu'est une architecture de sécurité et ses objectifs
- [ ] Je comprends les 7 principes du Zéro Trust (NIST SP 800-207)
- [ ] Je sais différencier ZTNA, SDP et VPN
- [ ] Je peux appliquer STRIDE à un système en partant d'un DFD
- [ ] Je peux conduire une analyse PASTA en 7 étapes
- [ ] Je sais créer une matrice d'évaluation pondérée pour sélectionner une solution
- [ ] Je comprends les principes du Security by Design
- [ ] Je peux rédiger des standards d'architecture sécurité
- [ ] Je connais les responsabilités d'un Security Architect

---

## Exercice Pratique

**Énoncé** : Tu es Security Architect dans une entreprise de 500 employés. L'entreprise migre ses applications legacy (on-premise) vers le cloud (AWS). Le RSSI te demande de concevoir l'architecture Zéro Trust pour cette migration.

**Contexte** :

- 3 applications critiques : ERP (SAP), CRM (Salesforce), application métier custom (Java/PostgreSQL)
- 50% des employés en télétravail permanent
- Active Directory on-premise existant
- Budget : 200 000 EUR/an pour la sécurité
- Contrainte réglementaire : RGPD + NIS2

**Travail demandé** :

1. Réaliser un threat model STRIDE pour l'application métier custom
2. Concevoir l'architecture Zéro Trust en définissant les 5 piliers (Identité, Périphérique, Réseau, Application, Données)
3. Proposer une matrice d'évaluation pour choisir la solution ZTNA
4. Rédiger 5 standards d'architecture sécurité prioritaires

**Indications** :

- Commence par le DFD de l'application métier
- Pour le Zéro Trust, prends en compte la coexistence cloud/on-premise (hybride)
- Le budget doit couvrir les licences, l'infrastructure et la formation
- NIS2 impose des obligations de notification d'incident sous 24h

**Résultat attendu** :

- Un fichier `stride-erp-migration.md` avec le threat model complet
- Un fichier `zero-trust-hybrid.md` avec l'architecture des 5 piliers
- Un fichier `evaluation-ztna.md` avec la matrice de sélection
- Un fichier `standards-migration.md` avec les 5 standards prioritaires

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### 1. Threat Model STRIDE - Application métier custom

**DFD** :

```text
[Employé] --HTTPS--> [WAF/CDN] --HTTPS--> [ALB AWS]
[ALB AWS] --HTTPS--> [Application Java (ECS)]
[Application Java] --TLS--> [PostgreSQL (RDS)]
[Application Java] --HTTPS--> [S3 (fichiers)]
[Admin] --SSM--> [Application Java (ECS)]
```

**Limites de confiance** :

```text
LC1 : Internet <-> WAF (périmètre public)
LC2 : WAF <-> ALB (réseau AWS public)
LC3 : ALB <-> Application (VPC privé)
LC4 : Application <-> Base de données (subnet données)
```

**Analyse STRIDE sur le flux Employé -> Application** :

| Catégorie | Menace | Sévérité | Contrôle |
| --------- | ------ | -------- | -------- |
| Spoofing | Vol de session SSO | Haute | Token courte durée (15 min), MFA FIDO2 |
| Tampering | Modification des requêtes API | Haute | Signature HMAC, validation côté serveur |
| Repudiation | Action non tracée | Moyenne | CloudTrail + logs applicatifs centralisés |
| Info Disclosure | Fuite de données via API | Haute | Chiffrement TLS 1.3, DLP sur les réponses |
| DoS | Surcharge de l'application | Haute | Auto-scaling ECS, WAF rate limiting |
| Elevation | Exploitation de rôle IAM trop permissif | Critique | Least privilege IAM, revue trimestrielle |

### 2. Architecture Zéro Trust hybride

```text
## Pilier Identité
- Migration AD vers Azure AD (Entra ID) en mode hybride
- MFA : Microsoft Authenticator (FIDO2 pour admins)
- Conditional Access : bloquer si device non conforme ou localisation suspecte
- Coût estimé : 40 000 EUR/an (licences Azure AD P2)

## Pilier Périphérique
- MDM : Microsoft Intune pour tous les postes
- EDR : Microsoft Defender for Endpoint (inclus dans la licence)
- Compliance : OS à jour, BitLocker actif, EDR actif
- Coût estimé : 30 000 EUR/an (inclus dans Microsoft 365 E5)

## Pilier Réseau
- ZTNA : Cloudflare Access pour remplacer le VPN
- Microsegmentation : AWS Security Groups + NACLs
- Interconnexion on-premise/cloud : AWS Direct Connect (chiffré)
- Coût estimé : 50 000 EUR/an

## Pilier Application
- API Gateway : AWS API Gateway avec WAF intégré
- Service mesh : AWS App Mesh pour mTLS inter-services
- CI/CD sécurisé : scan SAST/DAST dans le pipeline
- Coût estimé : 40 000 EUR/an

## Pilier Données
- Chiffrement : AWS KMS pour les clés, RDS chiffré, S3 chiffré
- Classification : Microsoft Purview pour les données Office 365
- DLP : règles sur les données personnelles (RGPD)
- Coût estimé : 20 000 EUR/an

## Budget total : 180 000 EUR/an (marge de 20 000 EUR pour imprévus)
```

### 3. Matrice d'évaluation ZTNA

| Critère (poids) | Cloudflare Access | Zscaler ZPA | Palo Alto Prisma |
| ---------------- | ----------------- | ----------- | ---------------- |
| Sécurité (30%) | 8/10 = 24 | 9/10 = 27 | 9/10 = 27 |
| Intégration Azure AD (20%) | 9/10 = 18 | 8/10 = 16 | 7/10 = 14 |
| Performance (15%) | 9/10 = 13.5 | 8/10 = 12 | 8/10 = 12 |
| Administration (15%) | 9/10 = 13.5 | 7/10 = 10.5 | 7/10 = 10.5 |
| Coût (10%) | 8/10 = 8 | 5/10 = 5 | 5/10 = 5 |
| Support (10%) | 8/10 = 8 | 8/10 = 8 | 8/10 = 8 |
| **TOTAL** | **85** | **78.5** | **76.5** |

Recommandation : Cloudflare Access pour le meilleur rapport qualité/prix.

### 4. Standards prioritaires

```text
SEC-STD-01 : MFA obligatoire pour tout accès (aucune exception)
SEC-STD-02 : Chiffrement TLS 1.3 pour tout flux réseau (interne et externe)
SEC-STD-03 : Least privilege sur tous les rôles IAM (revue trimestrielle)
SEC-STD-04 : Logging centralisé avec rétention 12 mois (CloudTrail + application)
SEC-STD-05 : Notification d'incident sous 24h (conformité NIS2)
```

---

## Navigation

→ Fiche suivante : **[02 - GRC Avancée et Management de la Sécurité](02-grc-avancee.md)**
