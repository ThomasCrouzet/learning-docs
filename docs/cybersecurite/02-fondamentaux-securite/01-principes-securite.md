---
tags:
  - Cybersécurité
  - Intermédiaire
  - Concept
description: "Triade CIA, modèles de menaces, principes de défense et frameworks de sécurité"
estimated_time: "40 min"
fiche_number: 1
total_fiches: 4
cursus: "Phase 2 - Fondamentaux sécurité"
---

# 01 - Principes de sécurité de l'information

> **En bref** : À la fin de cette fiche, tu sauras identifier et expliquer les principes fondamentaux de la sécurité de l'information, utiliser les modèles de menaces pour analyser un système, et choisir le framework de sécurité adapté à un contexte donné. Lecture estimée : 40 min.


## Prérequis

- [Phase 1 - Fondamentaux Informatiques](../01-fondamentaux-informatiques/index.md) : toutes les fiches complétées (architecture matérielle, systèmes d'exploitation, réseaux et protocoles, programmation et scripting)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras identifier et expliquer les principes fondamentaux de la sécurité de l'information, utiliser les modèles de menaces pour analyser un système, et choisir le framework de sécurité adapté à un contexte donné.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la Triade CIA ?

**Définition** : La triade CIA (Confidentiality, Integrity, Availability) est le modèle fondamental de la sécurité de l'information. Elle définit les trois propriétés essentielles que tout système d'information doit garantir : la confidentialité, l'intégrité et la disponibilité des données.

**Le problème que la triade CIA résout** :

Sans un modèle structuré pour penser la sécurité, voici les problèmes rencontrés :

1. **Oubli de dimensions critiques** : on protège les données contre le vol, mais on oublie de garantir qu'elles ne sont pas modifiées
2. **Priorisation impossible** : sans cadre, on ne sait pas quoi protéger en premier
3. **Communication difficile** : les équipes techniques et les décideurs n'ont pas de langage commun pour parler de sécurité

**Comment la triade CIA résout ces problèmes** :

| Problème | Solution apportée par la triade CIA |
| -------- | ----------------------------------- |
| Oubli de dimensions critiques | Trois axes obligent à couvrir tous les aspects |
| Priorisation impossible | Chaque système peut être évalué sur chaque axe |
| Communication difficile | Vocabulaire universel compris par tous les acteurs |

**Analogie concrète** : Imagine un coffre-fort dans une banque. La **confidentialité**, c'est que seul le propriétaire peut voir le contenu. L'**intégrité**, c'est la garantie que personne n'a modifié ou remplacé le contenu. La **disponibilité**, c'est que le propriétaire peut accéder à son coffre quand il en a besoin (la banque ne ferme pas indéfiniment).

Le diagramme suivant illustre les trois piliers de la triade CIA et la question centrale que chacun adresse :

<div class="diagram-design">
<p><a href="../../../diagrams/cybersecurite-02-fondamentaux-securite-01-principes-securite-1.html">Qu&#x27;est-ce que la Triade CIA ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/cybersecurite-02-fondamentaux-securite-01-principes-securite-1.html" title="Qu&#x27;est-ce que la Triade CIA ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Ce que la triade CIA n'est PAS** :

- La triade CIA n'est pas une checklist de sécurité complète. Elle ne couvre pas l'authentification, la traçabilité ou la non-répudiation (voir les extensions ci-dessous)
- La triade CIA n'est pas un standard de conformité. Elle ne dit pas _comment_ atteindre ces propriétés, seulement _quoi_ protéger

#### Confidentialité (Confidentiality)

**Définition** : La confidentialité garantit que l'information n'est accessible qu'aux personnes autorisées.

**Exemples concrets** :

- Un dossier médical ne doit être lu que par le médecin et le patient
- Un mot de passe stocké en base de données ne doit pas être lisible en clair
- Un email chiffré ne doit être déchiffrable que par le destinataire

**Mécanismes de protection** :

| Mécanisme | Ce qu'il protège |
| --------- | ---------------- |
| Chiffrement (AES, RSA) | Données en transit et au repos |
| Contrôle d'accès (ACL, RBAC) | Accès aux ressources |
| Classification des données | Niveau de protection adapté |
| Anonymisation / pseudonymisation | Données personnelles |

#### Intégrité (Integrity)

**Définition** : L'intégrité garantit que l'information n'a pas été modifiée de manière non autorisée, que ce soit accidentellement ou volontairement.

**Exemples concrets** :

- Un virement bancaire de 100 euros ne doit pas devenir 10 000 euros en transit
- Un fichier de configuration serveur ne doit pas être modifié par un attaquant
- Un log d'audit ne doit pas pouvoir être effacé pour masquer une intrusion

**Mécanismes de protection** :

| Mécanisme | Ce qu'il protège |
| --------- | ---------------- |
| Hachage (SHA-256) | Détection de modification |
| Signatures numériques | Preuve de non-modification |
| Contrôle de version | Traçabilité des changements |
| Sommes de contrôle (checksums) | Intégrité des fichiers |

#### Disponibilité (Availability)

**Définition** : La disponibilité garantit que l'information et les systèmes sont accessibles quand les utilisateurs autorisés en ont besoin.

**Exemples concrets** :

- Un site e-commerce doit rester en ligne pendant le Black Friday
- Un système de santé doit être disponible 24h/24 pour les urgences
- Les sauvegardes doivent être restaurables quand un serveur tombe en panne

**Mécanismes de protection** :

| Mécanisme | Ce qu'il protège |
| --------- | ---------------- |
| Redondance (RAID, clusters) | Panne matérielle |
| Sauvegardes régulières | Perte de données |
| Plan de reprise d'activité (PRA) | Sinistres majeurs |
| Protection anti-DDoS | Attaques par saturation |

### Extensions de la Triade CIA

La triade CIA couvre les trois piliers de base, mais la sécurité moderne ajoute trois propriétés supplémentaires.

#### Authenticité

**Définition** : L'authenticité garantit que l'identité d'un utilisateur, d'un système ou d'une information est vérifiable et réelle.

**Exemple** : Quand tu reçois un email signé numériquement, la signature prouve que l'expéditeur est bien celui qu'il prétend être.

#### Non-répudiation

**Définition** : La non-répudiation garantit qu'une action ou une transaction ne peut pas être niée par son auteur après coup.

**Exemple** : Un contrat signé électroniquement avec un certificat qualifié. Le signataire ne peut pas prétendre qu'il n'a pas signé.

#### Accountability (Imputabilité)

**Définition** : L'accountability garantit que chaque action dans un système peut être attribuée à un utilisateur ou un processus identifié.

**Exemple** : Les logs d'accès à un serveur enregistrent quel utilisateur a fait quelle action, à quelle heure et depuis quelle adresse IP.

### Qu'est-ce qu'un modèle de menaces ?

**Définition** : Un modèle de menaces (threat model) est une méthode structurée pour identifier, catégoriser et prioriser les menaces qui pèsent sur un système.

**Le problème que les modèles de menaces résolvent** :

Sans modèle de menaces, voici les problèmes rencontrés :

1. **Menaces oubliées** : on se concentre sur les attaques connues et on oublie les autres vecteurs
2. **Ressources mal allouées** : on dépense du budget sur des risques faibles et on ignore les risques critiques
3. **Réaction au lieu de prévention** : on découvre les failles après l'attaque, pas avant

**Comment les modèles de menaces résolvent ces problèmes** :

| Problème | Solution apportée |
| -------- | ----------------- |
| Menaces oubliées | Catégorisation systématique qui force l'exhaustivité |
| Ressources mal allouées | Scoring des risques pour prioriser les investissements |
| Réaction au lieu de prévention | Analyse en amont, avant le développement ou le déploiement |

**Analogie concrète** : Avant de construire une maison, tu fais un diagnostic des risques du terrain : inondation, séisme, cambriolage. Pour chaque risque identifié, tu prévois une protection (fondations renforcées, alarme, assurance). Un modèle de menaces fait la même chose pour un système informatique.

#### STRIDE

**Définition** : STRIDE est un modèle de menaces créé par Microsoft qui catégorise les menaces en six types.

| Lettre | Menace | Propriété CIA visée | Exemple |
| ------ | ------ | ------------------- | ------- |
| **S** | Spoofing (usurpation d'identité) | Authenticité | Se faire passer pour un administrateur |
| **T** | Tampering (falsification) | Intégrité | Modifier un fichier de configuration |
| **R** | Repudiation (répudiation) | Non-répudiation | Nier avoir effectué une transaction |
| **I** | Information Disclosure (divulgation) | Confidentialité | Fuiter une base de données clients |
| **D** | Denial of Service (déni de service) | Disponibilité | Saturer un serveur web |
| **E** | Elevation of Privilege (élévation de privilèges) | Autorisation | Un utilisateur standard obtient les droits admin |

#### DREAD

**Définition** : DREAD est un modèle de scoring qui évalue la gravité d'une menace sur cinq critères, chacun noté de 1 à 10.

| Critère | Question posée |
| ------- | -------------- |
| **D**amage | Quel est le niveau de dégât si l'attaque réussit ? |
| **R**eproducibility | L'attaque est-elle facile à reproduire ? |
| **E**xploitability | L'exploitation est-elle facile ? |
| **A**ffected users | Combien d'utilisateurs sont touchés ? |
| **D**iscoverability | La vulnérabilité est-elle facile à découvrir ? |

Le score final est la moyenne des cinq critères. Un score supérieur à 7 indique un risque critique.

**Note** : DREAD est un modèle historique (popularisé par Microsoft au début des années 2000). Microsoft l'a depuis abandonné dans ses propres pratiques, car le scoring de 1 à 10 reste très subjectif et peu reproductible d'un évaluateur à l'autre.

Il garde un intérêt pédagogique pour comprendre la notion de scoring de menace, mais il n'est aujourd'hui plus recommandé comme méthode de référence. On lui préfère STRIDE (pour l'identification) combiné à des barèmes objectifs comme le CVSS (pour la priorisation).

#### PASTA (Process for Attack Simulation and Threat Analysis)

**Définition** : PASTA est une méthodologie en 7 étapes qui combine la vision métier et la vision technique pour modéliser les menaces.

Les 7 étapes de PASTA :

1. **Définir les objectifs** : identifier les enjeux métier et les exigences de sécurité
2. **Définir le périmètre technique** : inventorier les composants, flux de données, dépendances
3. **Décomposer l'application** : analyser l'architecture en détail (diagrammes de flux de données)
4. **Analyser les menaces** : identifier les menaces possibles en utilisant des sources de renseignement
5. **Analyser les vulnérabilités** : scanner et auditer pour trouver les failles existantes
6. **Modéliser les attaques** : simuler les scénarios d'attaque et leurs impacts
7. **Analyser les risques et prioriser** : évaluer le risque résiduel et recommander des contre-mesures

### Qu'est-ce que la défense en profondeur ?

**Définition** : La défense en profondeur (defense in depth) est une stratégie de sécurité qui superpose plusieurs couches de protection indépendantes. Si une couche est compromise, les suivantes continuent de protéger le système.

**Le problème que la défense en profondeur résout** :

Sans défense en profondeur, voici les problèmes rencontrés :

1. **Point de défaillance unique** : si la seule protection (ex: le firewall) est contournée, tout le système est exposé
2. **Fausse sensation de sécurité** : une seule mesure donne l'illusion d'être protégé
3. **Attaques multi-vecteurs** : un attaquant combine plusieurs techniques qui dépassent une protection unique

**Comment la défense en profondeur résout ces problèmes** :

| Problème | Solution apportée |
| -------- | ----------------- |
| Point de défaillance unique | Chaque couche est indépendante : la chute d'une couche n'entraîne pas les autres |
| Fausse sensation de sécurité | Plusieurs contrôles obligent à réfléchir à chaque niveau |
| Attaques multi-vecteurs | Chaque vecteur rencontre sa propre barrière |

**Analogie concrète** : Imagine un château médiéval. Il a des douves (première barrière), des murailles (deuxième barrière), des gardes aux portes (troisième barrière), et un donjon (dernière barrière). Un attaquant qui franchit les douves doit encore passer les murailles, puis les gardes, puis le donjon. Chaque couche ralentit et affaiblit l'attaque.

**Les couches typiques de la défense en profondeur** :

| Couche | Exemples |
| ------ | -------- |
| Physique | Badges, caméras, serrures |
| Périmètre réseau | Firewall, DMZ, proxy |
| Réseau interne | Segmentation, VLAN, IDS/IPS |
| Hôte | Antivirus, durcissement OS, EDR |
| Application | WAF, validation des entrées, authentification |
| Données | Chiffrement, classification, DLP |
| Humain | Formation, sensibilisation, procédures |

### Principe du moindre privilège

**Définition** : Le principe du moindre privilège (least privilege) stipule qu'un utilisateur, un processus ou un programme ne doit disposer que des droits strictement nécessaires à l'accomplissement de sa tâche, et rien de plus.

**Exemple** : Un développeur n'a pas besoin d'accès administrateur au serveur de production. Il a besoin d'un accès en lecture aux logs et d'un accès en déploiement via un pipeline CI/CD. Lui donner les droits root "au cas où" viole le moindre privilège.

### Séparation des responsabilités

**Définition** : La séparation des responsabilités (separation of duties) impose qu'une tâche critique nécessite l'intervention de plusieurs personnes distinctes, de sorte qu'aucune personne seule ne puisse compromettre le système.

**Exemple** : Dans une banque, la personne qui prépare un virement n'est pas celle qui le valide. Si une seule personne fait les deux, elle peut transférer de l'argent vers son propre compte sans contrôle.

### Surface d'attaque

**Définition** : La surface d'attaque (attack surface) est l'ensemble des points d'entrée qu'un attaquant peut utiliser pour accéder à un système ou en extraire des données.

**Réduire la surface d'attaque signifie** :

- Fermer les ports réseau inutilisés
- Supprimer les logiciels et services non utilisés
- Désactiver les comptes inactifs
- Limiter les API exposées
- Minimiser les permissions

### Vocabulaire essentiel de la cybersécurité

Ce vocabulaire est utilisé dans toutes les fiches suivantes. Apprends-le maintenant.

| Terme | Définition | Exemple |
| ----- | ---------- | ------- |
| **Vulnérabilité** | Faiblesse dans un système qui peut être exploitée | Un serveur web avec une version de PHP non patchée |
| **Exploit** | Code ou technique qui tire parti d'une vulnérabilité | Un script qui utilise la faille CVE-2021-44228 (Log4Shell) |
| **Threat Actor** | Individu ou groupe qui conduit une attaque | Un groupe APT étatique, un hacker isolé, un employé malveillant |
| **TTP** | Tactiques, Techniques et Procédures : les méthodes d'un attaquant | Le framework MITRE ATT&CK documente les TTP connues |
| **IOC** | Indicateur de compromission : preuve qu'une attaque a eu lieu | Une adresse IP malveillante dans les logs, un hash de malware |
| **Kill Chain** | Séquence des étapes d'une cyberattaque (modèle Lockheed Martin) | Reconnaissance, armement, livraison, exploitation, installation, C2, actions |

#### La Cyber Kill Chain en détail

La Cyber Kill Chain, développée par Lockheed Martin, décompose une attaque en 7 étapes séquentielles :

1. **Reconnaissance** : l'attaquant collecte des informations sur la cible (OSINT, scan de ports)
2. **Armement (Weaponization)** : création de l'outil d'attaque (malware, exploit)
3. **Livraison (Delivery)** : envoi de l'attaque à la cible (email de phishing, clé USB)
4. **Exploitation** : exécution du code malveillant via une vulnérabilité
5. **Installation** : installation d'un accès persistant (backdoor, RAT)
6. **Commande et Contrôle (C2)** : établissement d'un canal de communication avec l'attaquant
7. **Actions sur l'objectif** : exfiltration de données, destruction, chiffrement (ransomware)

**Intérêt pour la défense** : chaque étape est un point où le défenseur peut détecter et interrompre l'attaque. Plus tôt l'attaque est détectée dans la chaîne, moins les dégâts sont importants.

### Frameworks de sécurité

#### NIST Cybersecurity Framework 2.0 (NIST CSF 2.0)

**Définition** : Le NIST CSF 2.0 est un cadre de référence publié par le National Institute of Standards and Technology (États-Unis) en 2024. Il organise la cybersécurité en 6 fonctions.

| Fonction | Objectif |
| -------- | -------- |
| **Govern** (Gouverner) | Définir la stratégie, les rôles et la supervision de la cybersécurité |
| **Identify** (Identifier) | Inventorier les actifs, les risques et l'environnement |
| **Protect** (Protéger) | Mettre en place les mesures de protection |
| **Detect** (Détecter) | Surveiller et identifier les incidents |
| **Respond** (Répondre) | Agir face à un incident détecté |
| **Recover** (Récupérer) | Restaurer les services après un incident |

#### ISO 27001 / ISO 27002

**Définition** : ISO 27001 est la norme internationale pour les systèmes de management de la sécurité de l'information (SMSI). ISO 27002 fournit les bonnes pratiques détaillées pour les contrôles de sécurité.

| ISO 27001 | ISO 27002 |
| --------- | --------- |
| Exigences pour le SMSI (ce qu'il faut faire) | Recommandations détaillées (comment le faire) |
| Certifiable (audit externe) | Non certifiable (guide de bonnes pratiques) |
| Obligatoire pour la certification | Complémentaire à ISO 27001 |
| 93 contrôles dans l'Annexe A | Détaille chacun des 93 contrôles |

#### CIS Controls v8 / v8.1

**Définition** : Les CIS Controls sont une liste de 18 contrôles de sécurité prioritaires, classés par ordre d'importance, publiés par le Center for Internet Security. La version actuelle est **v8.1** (même numérotation 1-18 que v8, avec un alignement Governance / CSF).

Les 6 premiers contrôles (les plus critiques) :

1. **Inventaire des actifs matériels** : savoir ce qui est connecté au réseau
2. **Inventaire des logiciels** : savoir ce qui est installé
3. **Protection des données** : classifier et protéger les données sensibles
4. **Configuration sécurisée** : durcir les configurations par défaut
5. **Gestion des comptes** : contrôler les accès et les privilèges
6. **Gestion du contrôle d'accès** : authentification, autorisation, moindre privilège (CIS Control 6)

La **gestion continue des vulnérabilités** est le **CIS Control 7**, pas le 6.

---

## Étapes Pratiques

### Étape 1 : Classer un système selon la triade CIA

Choisis un système que tu connais (un site web, une application mobile, un serveur de fichiers) et évalue-le sur chaque axe de la triade CIA.

```bash
# Crée un fichier d'analyse CIA pour un système
cat << 'EOF' > analyse-cia.md
# Analyse CIA - [Nom du système]

## Confidentialité
- Données sensibles présentes : [oui/non]
- Types de données : [liste]
- Niveau requis : [faible / moyen / élevé / critique]
- Mesures en place : [liste]
- Mesures manquantes : [liste]

## Intégrité
- Données critiques : [liste]
- Conséquence d'une modification non autorisée : [description]
- Niveau requis : [faible / moyen / élevé / critique]
- Mesures en place : [liste]
- Mesures manquantes : [liste]

## Disponibilité
- SLA requis : [99% / 99.9% / 99.99%]
- Conséquence d'une indisponibilité : [description]
- Niveau requis : [faible / moyen / élevé / critique]
- Mesures en place : [liste]
- Mesures manquantes : [liste]
EOF
```

**Résultat attendu** :

```text
Un fichier analyse-cia.md structuré avec l'évaluation des trois axes pour ton système.
```

### Étape 2 : Appliquer le modèle STRIDE à une application web

Prenons l'exemple d'une application web avec formulaire de connexion, base de données et API.

```bash
# Crée un fichier d'analyse STRIDE
cat << 'EOF' > analyse-stride.md
# Analyse STRIDE - Application Web

## Spoofing (Usurpation d'identité)
- Composant visé : formulaire de connexion
- Menace : un attaquant se connecte avec les identifiants volés d'un autre utilisateur
- Contre-mesure : authentification multi-facteurs (MFA)

## Tampering (Falsification)
- Composant visé : base de données
- Menace : un attaquant modifie les prix des produits via une injection SQL
- Contre-mesure : requêtes préparées, validation des entrées

## Repudiation (Répudiation)
- Composant visé : transactions utilisateur
- Menace : un utilisateur nie avoir passé une commande
- Contre-mesure : logs horodatés, signatures numériques

## Information Disclosure (Divulgation)
- Composant visé : API
- Menace : l'API retourne des données sensibles dans les messages d'erreur
- Contre-mesure : messages d'erreur génériques, logging côté serveur

## Denial of Service (Déni de service)
- Composant visé : serveur web
- Menace : un attaquant envoie des milliers de requêtes pour saturer le serveur
- Contre-mesure : rate limiting, CDN, protection anti-DDoS

## Elevation of Privilege (Élévation de privilèges)
- Composant visé : gestion des rôles
- Menace : un utilisateur standard accède aux fonctions d'administration
- Contre-mesure : contrôle d'accès côté serveur (RBAC), vérification systématique
EOF
```

**Résultat attendu** :

```text
Un fichier analyse-stride.md avec les 6 catégories de menaces identifiées et leurs contre-mesures.
```

### Étape 3 : Calculer un score DREAD

```bash
# Crée un script Python pour calculer un score DREAD
cat << 'PYEOF' > calcul-dread.py
#!/usr/bin/env python3
"""Calculateur de score DREAD pour évaluer la gravité d'une menace."""

def calculer_dread(nom_menace, damage, reproducibility, exploitability,
                   affected_users, discoverability):
    """Calcule le score DREAD moyen et retourne le niveau de risque."""
    score = (damage + reproducibility + exploitability
             + affected_users + discoverability) / 5

    if score >= 7:
        niveau = "CRITIQUE"
    elif score >= 4:
        niveau = "MOYEN"
    else:
        niveau = "FAIBLE"

    print(f"\n--- Analyse DREAD : {nom_menace} ---")
    print(f"  Damage:          {damage}/10")
    print(f"  Reproducibility: {reproducibility}/10")
    print(f"  Exploitability:  {exploitability}/10")
    print(f"  Affected Users:  {affected_users}/10")
    print(f"  Discoverability: {discoverability}/10")
    print(f"  Score moyen:     {score:.1f}/10")
    print(f"  Niveau de risque: {niveau}")
    return score

# Exemple 1 : Injection SQL sur un formulaire de recherche
calculer_dread(
    "Injection SQL - formulaire de recherche",
    damage=9,            # Accès complet à la base de données
    reproducibility=8,   # Facile à reproduire une fois trouvée
    exploitability=6,    # Nécessite des connaissances SQL
    affected_users=10,   # Tous les utilisateurs sont touchés
    discoverability=7    # Découvrable par un scanner automatique
)

# Exemple 2 : XSS stocké dans un champ commentaire
calculer_dread(
    "XSS stocké - champ commentaire",
    damage=6,            # Vol de session, redirection
    reproducibility=9,   # Très facile à reproduire
    exploitability=7,    # Connaissances HTML/JS de base suffisent
    affected_users=8,    # Tous les visiteurs de la page
    discoverability=8    # Visible dans le code source
)

# Exemple 3 : Mot de passe par défaut sur un panel admin
calculer_dread(
    "Mot de passe par défaut - panel admin",
    damage=10,           # Contrôle total du système
    reproducibility=10,  # Trivial à reproduire
    exploitability=10,   # Aucune compétence requise
    affected_users=10,   # Tout le système
    discoverability=5    # Nécessite de connaître l'URL du panel
)
PYEOF
python3 calcul-dread.py
```

**Résultat attendu** :

```text
--- Analyse DREAD : Injection SQL - formulaire de recherche ---
  Damage:          9/10
  Reproducibility: 8/10
  Exploitability:  6/10
  Affected Users:  10/10
  Discoverability: 7/10
  Score moyen:     8.0/10
  Niveau de risque: CRITIQUE

--- Analyse DREAD : XSS stocké - champ commentaire ---
  Damage:          6/10
  Reproducibility: 9/10
  Exploitability:  7/10
  Affected Users:  8/10
  Discoverability: 8/10
  Score moyen:     7.6/10
  Niveau de risque: CRITIQUE

--- Analyse DREAD : Mot de passe par défaut - panel admin ---
  Damage:          10/10
  Reproducibility: 10/10
  Exploitability:  10/10
  Affected Users:  10/10
  Discoverability: 5/10
  Score moyen:     9.0/10
  Niveau de risque: CRITIQUE
```

### Étape 4 : Mapper les contrôles CIS sur un système

```bash
# Crée un fichier d'audit basé sur les CIS Controls
cat << 'EOF' > audit-cis-controls.md
# Audit CIS Controls v8 - [Nom du système]

## Contrôle 1 : Inventaire des actifs matériels
- [ ] Tous les appareils connectés au réseau sont inventoriés
- [ ] Les appareils non autorisés sont détectés et bloqués
- [ ] L'inventaire est mis à jour régulièrement

## Contrôle 2 : Inventaire des logiciels
- [ ] Tous les logiciels installés sont inventoriés
- [ ] Les logiciels non autorisés sont détectés et supprimés
- [ ] Seuls les logiciels approuvés peuvent être installés

## Contrôle 3 : Protection des données
- [ ] Les données sont classifiées (public, interne, confidentiel, secret)
- [ ] Les données sensibles sont chiffrées au repos et en transit
- [ ] Les procédures de suppression sécurisée sont en place

## Contrôle 4 : Configuration sécurisée
- [ ] Les configurations par défaut sont modifiées
- [ ] Les services inutiles sont désactivés
- [ ] Les benchmarks CIS sont appliqués

## Contrôle 5 : Gestion des comptes
- [ ] Les comptes inactifs sont désactivés
- [ ] Le MFA est activé pour les comptes à privilèges
- [ ] Les mots de passe respectent la politique de sécurité

## Contrôle 7 : Gestion continue des vulnérabilités
- [ ] Des scans de vulnérabilités sont effectués régulièrement
- [ ] Les correctifs critiques sont appliqués sous 48h
- [ ] Un processus de suivi des vulnérabilités est en place
EOF
```

**Résultat attendu** :

```text
Un fichier audit-cis-controls.md avec une checklist pour les 6 premiers contrôles CIS.
```

### Étape 5 : Cartographier une attaque sur la Cyber Kill Chain

```bash
# Crée un fichier d'analyse d'attaque selon la Kill Chain
cat << 'EOF' > analyse-kill-chain.md
# Analyse Kill Chain - Attaque par Ransomware

## 1. Reconnaissance
- L'attaquant identifie les employés sur LinkedIn
- Il trouve les adresses email via des outils OSINT
- Il repère le logiciel de messagerie utilisé

## 2. Armement
- Création d'un document Word avec une macro malveillante
- La macro télécharge un loader depuis un serveur C2

## 3. Livraison
- Envoi d'un email de phishing ciblé (spear phishing)
- Le sujet imite un fournisseur connu de l'entreprise

## 4. Exploitation
- L'employé ouvre le document et active les macros
- Le loader exploite une vulnérabilité non patchée

## 5. Installation
- Le ransomware s'installe et crée une persistance (clé registre)
- Il désactive l'antivirus local

## 6. Commande et Contrôle
- Communication chiffrée avec le serveur C2
- Téléchargement de modules supplémentaires

## 7. Actions sur l'objectif
- Chiffrement de tous les fichiers accessibles
- Exfiltration des données sensibles
- Affichage de la demande de rançon

## Détection possible à chaque étape
| Étape | Méthode de détection |
| ----- | -------------------- |
| Reconnaissance | Surveillance OSINT, alertes sur les requêtes inhabituelles |
| Armement | Threat intelligence, partage d'IOC |
| Livraison | Filtre email, sandbox pour pièces jointes |
| Exploitation | EDR, patching régulier |
| Installation | Détection comportementale, HIDS |
| C2 | Analyse du trafic réseau, DNS monitoring |
| Actions | Détection de chiffrement massif, alertes DLP |
EOF
```

**Résultat attendu** :

```text
Un fichier analyse-kill-chain.md avec les 7 étapes d'une attaque et les méthodes de détection correspondantes.
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `nmap -sV <cible>` | Scanner les ports et services (surface d'attaque réseau) |
| `nmap --script vuln <cible>` | Scanner les vulnérabilités connues |
| `nikto -h <url>` | Scanner les vulnérabilités d'un serveur web |
| `lynis audit system` | Auditer la configuration de sécurité d'un système Linux |
| `ss -tlnp` | Lister les ports en écoute (surface d'attaque locale) |
| `systemctl list-unit-files --state=enabled` | Lister les services actifs (réduction de surface) |

---

## Pièges Fréquents

### Piège 1 : Confondre confidentialité et intégrité

**Problème** : Beaucoup de débutants pensent que chiffrer les données suffit à les protéger. Le chiffrement protège la confidentialité (personne ne peut lire), mais pas l'intégrité (quelqu'un peut modifier les données chiffrées sans les lire).

**Solution** : Utilise le chiffrement authentifié (AES-GCM) qui protège à la fois la confidentialité et l'intégrité. Ou combine chiffrement + signature/HMAC.

### Piège 2 : Penser que la sécurité est uniquement technique

**Problème** : On installe des firewalls et des antivirus, mais les employés cliquent sur des liens de phishing. La majorité des attaques commencent par un facteur humain.

**Solution** : La défense en profondeur inclut obligatoirement une couche humaine : formation, sensibilisation, procédures. La technologie seule ne suffit pas.

### Piège 3 : Appliquer le moindre privilège uniquement aux utilisateurs humains

**Problème** : On restreint les droits des utilisateurs, mais les applications tournent avec des droits root ou des clés API avec tous les privilèges.

**Solution** : Le moindre privilège s'applique à tout : utilisateurs, services, conteneurs, API, scripts. Un conteneur Docker ne doit pas tourner en root. Une clé API ne doit avoir que les permissions nécessaires.

### Piège 4 : Utiliser un seul framework comme vérité absolue

**Problème** : On choisit NIST CSF et on ignore tout le reste. Chaque framework a ses forces et ses limites.

**Solution** : Les frameworks sont complémentaires. NIST CSF donne la structure, CIS Controls donne les priorités techniques, ISO 27001 donne le cadre de management. Utilise-les ensemble.

---

## Checklist de Validation

- [ ] Je sais définir chaque composant de la triade CIA avec un exemple concret
- [ ] Je sais expliquer la différence entre confidentialité et intégrité
- [ ] Je connais les 3 extensions de la triade CIA (authenticité, non-répudiation, accountability)
- [ ] Je sais appliquer le modèle STRIDE à un système
- [ ] Je sais calculer un score DREAD et interpréter le résultat
- [ ] Je connais les 7 étapes de PASTA
- [ ] Je sais expliquer la défense en profondeur avec un exemple concret
- [ ] Je comprends le principe du moindre privilège et la séparation des responsabilités
- [ ] Je sais définir : vulnérabilité, exploit, threat actor, TTP, IOC, kill chain
- [ ] Je connais les 7 étapes de la Cyber Kill Chain
- [ ] Je sais décrire le rôle de NIST CSF 2.0, ISO 27001 et CIS Controls v8

---

## Exercice Pratique

**Énoncé** : Tu es chargé d'évaluer la sécurité d'une application web de gestion de notes pour une école. L'application permet aux professeurs de saisir des notes et aux étudiants de consulter les leurs. Elle utilise un serveur web, une base de données PostgreSQL et un formulaire de connexion.

Réalise les tâches suivantes :

1. Évalue le système sur la triade CIA (quel axe est le plus critique et pourquoi ?)
2. Applique le modèle STRIDE pour identifier au moins une menace par catégorie
3. Choisis la menace la plus grave et calcule son score DREAD
4. Propose un plan de défense en profondeur avec au moins 4 couches
5. Identifie 3 actions prioritaires en utilisant les CIS Controls v8

**Indications** :

- Pour la triade CIA, pense aux conséquences pour les étudiants si leurs notes sont modifiées (intégrité) ou consultées par d'autres (confidentialité)
- Pour STRIDE, concentre-toi sur le formulaire de connexion, la base de données et l'affichage des notes
- Pour la défense en profondeur, couvre au minimum : réseau, hôte, application et données

**Résultat attendu** : Un document structuré avec l'analyse CIA, le tableau STRIDE, le calcul DREAD de la menace la plus grave, le plan de défense en profondeur et les 3 priorités CIS.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### 1. Analyse CIA

| Axe | Niveau requis | Justification |
| --- | ------------- | ------------- |
| Confidentialité | **Élevé** | Les notes sont des données personnelles (RGPD). Seul l'étudiant concerné et ses professeurs doivent y accéder |
| Intégrité | **Critique** | Une note modifiée frauduleusement peut invalider un bulletin. C'est l'axe le plus critique |
| Disponibilité | **Moyen** | L'application doit être disponible pendant les périodes de saisie et de consultation, mais une indisponibilité de quelques heures est tolérable |

L'axe le plus critique est l'**intégrité** : une modification non autorisée des notes a des conséquences juridiques et académiques graves.

### 2. Analyse STRIDE

| Catégorie | Menace identifiée | Composant visé |
| --------- | ----------------- | -------------- |
| Spoofing | Un étudiant se connecte avec les identifiants d'un professeur | Formulaire de connexion |
| Tampering | Un attaquant modifie ses notes via une injection SQL | Base de données |
| Repudiation | Un professeur nie avoir modifié une note | Système de saisie |
| Info Disclosure | Les notes d'autres étudiants s'affichent via un IDOR | Page d'affichage |
| DoS | Un attaquant sature le serveur pendant la période d'examens | Serveur web |
| Elevation of Privilege | Un étudiant accède à l'interface de saisie des professeurs | Gestion des rôles |

### 3. Score DREAD - Injection SQL sur les notes

| Critère | Score | Justification |
| ------- | ----- | ------------- |
| Damage | 9 | Modification de toutes les notes en base |
| Reproducibility | 8 | Facile à reproduire une fois le point d'injection trouvé |
| Exploitability | 6 | Nécessite des connaissances en SQL |
| Affected Users | 9 | Tous les étudiants et professeurs |
| Discoverability | 7 | Testable avec un scanner comme sqlmap |

**Score moyen : 7.8/10 - CRITIQUE**

### 4. Plan de défense en profondeur

| Couche | Mesure proposée |
| ------ | --------------- |
| Réseau | Firewall restrictif, accès uniquement depuis le réseau de l'école, TLS obligatoire |
| Hôte | Serveur durci (CIS benchmark), mises à jour automatiques, EDR |
| Application | Requêtes préparées (anti-SQLi), validation des entrées, RBAC strict, rate limiting |
| Données | Chiffrement de la base au repos, sauvegardes quotidiennes signées, logs d'audit immuables |

### 5. Trois priorités CIS Controls

1. **Contrôle 5 - Gestion des comptes** : activer le MFA pour les comptes professeurs, désactiver les comptes des anciens étudiants
2. **Contrôle 4 - Configuration sécurisée** : durcir PostgreSQL (désactiver les connexions distantes non nécessaires, changer les mots de passe par défaut)
3. **Contrôle 7 - Gestion continue des vulnérabilités** : scanner l'application avec un outil comme OWASP ZAP, corriger les failles critiques sous 48h

---

## Navigation

→ Fiche suivante : **[02 - Cryptographie - Fondements et Applications](02-cryptographie.md)**
