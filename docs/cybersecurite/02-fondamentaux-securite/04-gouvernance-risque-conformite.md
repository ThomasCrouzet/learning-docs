---
tags:
  - Cybersécurité
  - Intermédiaire
  - Concept
description: "RGPD, NIS2, analyse de risque, politiques de sécurité, PCA/PRA et rôle du RSSI"
estimated_time: "45 min"
fiche_number: 4
total_fiches: 4
cursus: "Phase 2 - Fondamentaux sécurité"
---

# 04 - Gouvernance, Risque et Conformité (GRC) - Introduction

> **En bref** : À la fin de cette fiche, tu sauras identifier les principales réglementations de cybersécurité (RGPD, NIS2, DORA), conduire une analyse de risque simplifiée avec EBIOS RM, rédiger une politique de sécurité, et comprendre les mécanismes de continuité d'activité (PCA/PRA). Lecture estimée : 45 min.


## Prérequis

- [Phase 2, Fiche 01 - Principes de sécurité de l'information](01-principes-securite.md) (triade CIA, frameworks NIST/ISO/CIS)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras identifier les principales réglementations de cybersécurité (RGPD, NIS2, DORA), conduire une analyse de risque simplifiée avec EBIOS RM, rédiger une politique de sécurité, et comprendre les mécanismes de continuité d'activité (PCA/PRA).

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la GRC ?

**Définition** : La GRC (Gouvernance, Risque, Conformité) est un cadre intégré qui aligne la stratégie de sécurité d'une organisation (Gouvernance), l'identification et le traitement des menaces (Risque) et le respect des obligations légales et réglementaires (Conformité).

**Le problème que la GRC résout** :

Sans GRC, voici les problèmes rencontrés :

1. **Sécurité sans direction** : les équipes techniques installent des outils sans stratégie d'ensemble
2. **Risques ignorés** : personne n'évalue systématiquement les menaces et leurs impacts
3. **Non-conformité** : l'organisation viole des réglementations sans le savoir, s'exposant à des amendes et poursuites

**Comment la GRC résout ces problèmes** :

| Problème | Solution apportée par la GRC |
| -------- | ---------------------------- |
| Sécurité sans direction | La gouvernance définit la stratégie, les rôles et les responsabilités |
| Risques ignorés | Le management du risque identifie, évalue et traite les menaces |
| Non-conformité | La conformité assure le respect des lois et des normes |

**Analogie concrète** : Imagine la construction d'un immeuble. La **gouvernance**, c'est l'architecte qui définit le plan et supervise le chantier. Le **risque**, c'est l'ingénieur structure qui calcule les charges et identifie les points faibles. La **conformité**, c'est l'inspecteur qui vérifie que le bâtiment respecte les normes de construction et le code de l'urbanisme.

**Ce que la GRC n'est PAS** :

- La GRC n'est pas uniquement de la paperasserie. Les documents (politiques, procédures) sont des outils, pas une fin en soi. L'objectif est de protéger l'organisation
- La GRC n'est pas réservée aux grandes entreprises. Même une PME doit respecter le RGPD et protéger ses données. L'ampleur varie, les principes restent les mêmes

### Réglementations principales

#### RGPD (Règlement Général sur la Protection des Données)

**Définition** : Le RGPD est un règlement européen (2016/679), en vigueur depuis le 25 mai 2018, qui encadre le traitement des données personnelles des résidents de l'Union Européenne.

**Les 7 principes du RGPD** :

| Principe | Signification |
| -------- | ------------- |
| **Licéité, loyauté, transparence** | Le traitement est légal, honnête et l'individu est informé |
| **Limitation des finalités** | Les données sont collectées pour un objectif précis et déclaré |
| **Minimisation des données** | Seules les données nécessaires sont collectées |
| **Exactitude** | Les données sont maintenues à jour et corrigées si nécessaire |
| **Limitation de la conservation** | Les données ne sont pas conservées au-delà de la durée nécessaire |
| **Intégrité et confidentialité** | Les données sont protégées contre les accès non autorisés et les pertes |
| **Responsabilité (accountability)** | Le responsable du traitement doit démontrer sa conformité |

**Droits des personnes concernées** :

| Droit | Description |
| ----- | ----------- |
| Droit d'accès | Savoir quelles données sont collectées et comment elles sont utilisées |
| Droit de rectification | Demander la correction de données inexactes |
| Droit à l'effacement | Demander la suppression des données ("droit à l'oubli") |
| Droit à la portabilité | Recevoir ses données dans un format réutilisable |
| Droit d'opposition | Refuser le traitement de ses données |
| Droit à la limitation | Restreindre temporairement le traitement |

**Sanctions** : Jusqu'à 20 millions d'euros ou 4% du chiffre d'affaires mondial annuel (le montant le plus élevé).

#### NIS2 (Network and Information Security Directive 2)

**Définition** : NIS2 est une directive européenne (2022/2555), entrée en vigueur en octobre 2024, qui impose des obligations de cybersécurité aux entités essentielles et importantes dans l'UE.

**Qui est concerné ?** :

| Catégorie | Exemples de secteurs |
| --------- | -------------------- |
| Entités essentielles | Énergie, transport, santé, eau, infrastructure numérique, espace, administration publique |
| Entités importantes | Services postaux, gestion des déchets, industrie alimentaire, fabrication, services numériques |

**Obligations principales** :

1. **Gestion des risques** : mettre en place des mesures techniques et organisationnelles proportionnées
2. **Notification des incidents** : alerte précoce sous 24h, notification sous 72h, rapport final sous 1 mois (directive NIS2, art. 23)
3. **Responsabilité de la direction** : les dirigeants doivent superviser et approuver les mesures de cybersécurité
4. **Sécurité de la chaîne d'approvisionnement** : évaluer les risques liés aux fournisseurs
5. **Coopération** : partager les informations sur les menaces avec les autorités

**Sanctions NIS2** : Jusqu'à 10 millions d'euros ou 2% du chiffre d'affaires mondial (entités essentielles).

#### DORA (Digital Operational Resilience Act)

**Définition** : DORA est un règlement européen (2022/2554), en application depuis janvier 2025, qui impose des exigences de résilience numérique au secteur financier (banques, assurances, gestionnaires d'actifs, fintechs).

**Les 5 piliers de DORA** :

| Pilier | Contenu |
| ------ | ------- |
| Gestion des risques TIC | Cadre complet de gestion des risques informatiques |
| Tests de résilience | Tests réguliers incluant des tests d'intrusion avancés (TLPT) |
| Gestion des incidents | Classification, signalement et gestion des incidents TIC |
| Gestion des tiers | Surveillance des prestataires TIC critiques |
| Partage d'information | Échange de renseignements sur les menaces |

#### Autres réglementations importantes

| Réglementation | Pays/Région | Secteur | Point clé |
| -------------- | ----------- | ------- | --------- |
| **HIPAA** | États-Unis | Santé | Protection des données de santé (PHI) |
| **SOX** | États-Unis | Toutes les entreprises cotées | Contrôles internes sur le reporting financier |
| **PCI DSS** | International | Paiement par carte | Sécurisation des données de carte bancaire |
| **LPM** | France | Opérateurs d'importance vitale | Obligations de sécurité pour les OIV |

### Qu'est-ce que l'analyse de risque ?

**Définition** : L'analyse de risque est un processus structuré qui identifie les menaces pesant sur une organisation, évalue leur probabilité et leur impact, et définit les mesures de traitement appropriées.

**Le problème que l'analyse de risque résout** :

Sans analyse de risque, voici les problèmes rencontrés :

1. **Budget mal utilisé** : on investit dans des protections contre des menaces peu probables et on ignore les risques critiques
2. **Décisions arbitraires** : les choix de sécurité sont basés sur l'intuition ou la mode, pas sur des données
3. **Absence de priorisation** : toutes les menaces sont traitées de la même façon, sans hiérarchie

**Comment l'analyse de risque résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Budget mal utilisé | Le scoring permet d'allouer les ressources aux risques les plus critiques |
| Décisions arbitraires | La méthodologie fournit un cadre objectif et reproductible |
| Absence de priorisation | La matrice de risque classe les menaces par gravité |

**Analogie concrète** : Avant de prendre une assurance, tu fais l'inventaire de tes biens (identification), tu évalues la probabilité d'un sinistre (cambriolage, incendie, inondation) et son impact financier (évaluation), puis tu choisis les garanties adaptées (traitement). Tu n'assures pas ta voiture contre les météorites si tu vis en ville.

#### Formule du risque

**Risque = Menace x Vulnérabilité x Impact**

| Composante | Question | Exemple |
| ---------- | -------- | ------- |
| **Menace** | Qui ou quoi peut attaquer ? | Un groupe de hackers, un employé mécontent, une catastrophe naturelle |
| **Vulnérabilité** | Quelle faiblesse peut être exploitée ? | Un serveur non mis à jour, un mot de passe faible |
| **Impact** | Quel est le dommage si l'attaque réussit ? | Perte de données clients, arrêt d'activité, amende RGPD |

#### Traitement du risque

Après évaluation, il y a 4 options pour traiter un risque :

| Option | Description | Exemple |
| ------ | ----------- | ------- |
| **Réduire** (Mitigate) | Mettre en place des mesures pour diminuer la probabilité ou l'impact | Installer un firewall, former les employés |
| **Transférer** (Transfer) | Déléguer le risque à un tiers | Souscrire une cyber-assurance |
| **Accepter** (Accept) | Reconnaître le risque et décider de ne rien faire | Le coût de protection dépasse l'impact potentiel |
| **Éviter** (Avoid) | Supprimer l'activité qui génère le risque | Ne pas stocker de données sensibles si ce n'est pas nécessaire |

#### EBIOS RM (Expression des Besoins et Identification des Objectifs de Sécurité - Risk Manager)

**Définition** : EBIOS RM est la méthode d'analyse de risque recommandée par l'ANSSI (Agence Nationale de la Sécurité des Systèmes d'Information). Elle est adaptée au contexte français et européen.

**Les 5 ateliers EBIOS RM** :

| Atelier | Objectif | Livrable |
| ------- | -------- | -------- |
| 1. Cadrage et socle de sécurité | Définir le périmètre, identifier les biens essentiels | Cartographie des biens, socle de sécurité |
| 2. Sources de risque | Identifier qui pourrait attaquer et pourquoi | Liste des sources de risque et objectifs visés |
| 3. Scénarios stratégiques | Déterminer les chemins d'attaque de haut niveau | Cartographie des menaces, écosystème |
| 4. Scénarios opérationnels | Détailler les scénarios techniques d'attaque | Scénarios d'attaque détaillés avec modes opératoires |
| 5. Traitement du risque | Définir les mesures de sécurité | Plan de traitement du risque, risques résiduels |

#### ISO 27005

**Définition** : ISO 27005 est la norme internationale qui fournit des lignes directrices pour la gestion des risques de sécurité de l'information. Elle s'intègre au SMSI d'ISO 27001.

**Processus ISO 27005** :

1. Établir le contexte
2. Identifier les risques (actifs, menaces, vulnérabilités)
3. Analyser les risques (estimer probabilité et impact)
4. Évaluer les risques (comparer au critère d'acceptation)
5. Traiter les risques (choisir l'option de traitement)
6. Communiquer et consulter
7. Surveiller et réviser

#### NIST RMF (Risk Management Framework)

**Définition** : Le NIST RMF est le cadre de gestion des risques du NIST américain, obligatoire pour les agences fédérales américaines et très utilisé dans le secteur privé.

**Les 7 étapes du NIST RMF** :

| Étape | Action |
| ----- | ------ |
| 1. Prepare | Préparer l'organisation à la gestion des risques |
| 2. Categorize | Classifier le système d'information |
| 3. Select | Choisir les contrôles de sécurité appropriés |
| 4. Implement | Implémenter les contrôles sélectionnés |
| 5. Assess | Évaluer l'efficacité des contrôles |
| 6. Authorize | Autoriser la mise en service du système |
| 7. Monitor | Surveiller en continu les contrôles et les risques |

### Politiques de sécurité

**Définition** : Une politique de sécurité est un document formel qui définit les règles, les responsabilités et les comportements attendus en matière de sécurité de l'information dans une organisation.

**Hiérarchie des documents de sécurité** :

| Niveau | Document | Contenu | Exemple |
| ------ | -------- | ------- | ------- |
| 1 | **Politique** | Principes et objectifs (le "quoi") | "Les mots de passe doivent respecter des critères de complexité" |
| 2 | **Standard** | Exigences mesurables (le "combien") | "Minimum 12 caractères, majuscule, minuscule, chiffre, symbole" |
| 3 | **Procédure** | Instructions détaillées (le "comment") | "Pour changer son mot de passe : aller dans Paramètres > Sécurité > ..." |
| 4 | **Guide** | Recommandations et bonnes pratiques | "Utilisez un gestionnaire de mots de passe comme KeePass" |

**Politiques de sécurité essentielles** :

| Politique | Contenu |
| --------- | ------- |
| Politique de sécurité de l'information (PSSI) | Document principal qui définit la stratégie de sécurité |
| Politique d'utilisation acceptable | Règles d'utilisation des ressources informatiques |
| Politique de classification des données | Niveaux de classification et règles de traitement par niveau |
| Politique de gestion des accès | Règles d'attribution, de modification et de révocation des accès |
| Politique de gestion des incidents | Procédure de détection, d'escalade et de réponse aux incidents |
| Politique de sauvegarde | Fréquence, rétention, tests de restauration |

### Classification des données

**Définition** : La classification des données consiste à catégoriser les informations selon leur niveau de sensibilité, et à définir les règles de protection adaptées à chaque niveau.

**Exemple de schéma de classification à 4 niveaux** :

| Niveau | Description | Exemples | Mesures de protection |
| ------ | ----------- | -------- | --------------------- |
| **Public** | Diffusion libre | Site web, brochures | Aucune restriction |
| **Interne** | Usage interne uniquement | Annuaire, procédures | Accès authentifié |
| **Confidentiel** | Accès restreint | Données clients, contrats | Chiffrement, accès nominatif |
| **Secret** | Accès très restreint | Données stratégiques, brevets | Chiffrement fort, MFA, audit |

### Rôle du RSSI/CISO

**Définition** : Le RSSI (Responsable de la Sécurité des Systèmes d'Information), ou CISO en anglais (Chief Information Security Officer), est le responsable de la stratégie de cybersécurité d'une organisation.

**Responsabilités principales** :

| Domaine | Responsabilité |
| ------- | -------------- |
| Stratégie | Définir et porter la stratégie de sécurité auprès de la direction |
| Gouvernance | Rédiger et maintenir les politiques de sécurité |
| Risque | Piloter les analyses de risque et le traitement des risques |
| Conformité | Assurer le respect des réglementations (RGPD, NIS2, etc.) |
| Incidents | Superviser la gestion des incidents de sécurité |
| Sensibilisation | Organiser la formation et la sensibilisation des employés |
| Technique | Valider les choix techniques et les architectures de sécurité |

**Où se situe le RSSI dans l'organigramme** : Idéalement, le RSSI rapporte directement au directeur général ou au comité de direction (pas au DSI). Cette indépendance est nécessaire pour éviter les conflits d'intérêts entre les objectifs IT (rapidité, coût) et les objectifs de sécurité (protection, conformité).

### PCA/PRA et Gestion de Crise

#### PCA (Plan de Continuité d'Activité)

**Définition** : Le PCA est un ensemble de procédures documentées qui permettent à une organisation de maintenir ses activités essentielles pendant et après un sinistre majeur.

**Métriques clés du PCA** :

| Métrique | Définition | Exemple |
| -------- | ---------- | ------- |
| **RPO** (Recovery Point Objective) | Quantité maximale de données que l'on accepte de perdre | RPO de 1h = les sauvegardes sont faites toutes les heures |
| **RTO** (Recovery Time Objective) | Durée maximale d'interruption acceptable | RTO de 4h = le service doit être restauré en 4h maximum |
| **MTPD** (Maximum Tolerable Period of Disruption) | Durée maximale avant que l'impact devienne inacceptable | MTPD de 24h = au-delà de 24h, l'entreprise est en danger |

#### PRA (Plan de Reprise d'Activité)

**Définition** : Le PRA est le volet technique du PCA. Il détaille les procédures de restauration des systèmes informatiques après un sinistre.

**Contenu typique d'un PRA** :

- Inventaire des systèmes critiques et leurs dépendances
- Procédures de restauration pas à pas
- Coordonnées des personnes clés et des prestataires
- Lieux de repli et matériel de secours
- Procédures de communication de crise

#### Gestion de crise

**Les 4 phases de la gestion de crise** :

| Phase | Actions |
| ----- | ------- |
| **Détection** | Identifier l'incident, évaluer sa gravité, activer la cellule de crise |
| **Réponse** | Contenir l'incident, protéger les systèmes non touchés, communiquer |
| **Restauration** | Restaurer les services selon les priorités du PRA, vérifier l'intégrité |
| **Retour d'expérience** | Analyser les causes, documenter les leçons, améliorer les procédures |

### Responsabilité partagée dans le cloud

**Définition** : Le modèle de responsabilité partagée définit qui (le fournisseur cloud ou le client) est responsable de la sécurité de chaque couche de l'infrastructure.

| Couche | IaaS (ex: AWS EC2) | PaaS (ex: Heroku) | SaaS (ex: Gmail) |
| ------ | ------------------- | ------------------ | ----------------- |
| Données | Client | Client | Client |
| Applications | Client | Client | Fournisseur |
| Middleware/Runtime | Client | Fournisseur | Fournisseur |
| OS | Client | Fournisseur | Fournisseur |
| Virtualisation | Fournisseur | Fournisseur | Fournisseur |
| Réseau | Fournisseur | Fournisseur | Fournisseur |
| Physique | Fournisseur | Fournisseur | Fournisseur |

**Règle clé** : Les données sont toujours sous la responsabilité du client, quel que soit le modèle cloud. Le fournisseur cloud n'est pas responsable de tes données si tu ne les chiffres pas.

### Audit et Gap Analysis

**Définition** : Un audit de sécurité évalue la conformité d'une organisation par rapport à un référentiel (ISO 27001, CIS Controls, etc.). Le gap analysis identifie les écarts entre l'état actuel et l'état souhaité.

**Types d'audit** :

| Type | Description | Réalisé par |
| ---- | ----------- | ----------- |
| **Audit interne** | Évaluation par l'organisation elle-même | Équipe sécurité interne |
| **Audit externe** | Évaluation par un tiers indépendant | Cabinet d'audit certifié |
| **Audit de certification** | Évaluation pour obtenir ou renouveler une certification | Organisme certificateur accrédité |

---

## Étapes Pratiques

### Étape 1 : Réaliser un inventaire des données personnelles (registre RGPD)

```bash
# Créer un registre de traitement RGPD simplifié
cat << 'EOF' > registre-rgpd.md
# Registre des traitements de données personnelles

## Traitement 1 : Gestion des clients

| Champ | Valeur |
| ----- | ------ |
| Responsable du traitement | [Nom de l'entreprise] |
| Finalité | Gestion de la relation client et facturation |
| Base légale | Exécution du contrat (Art. 6.1.b RGPD) |
| Catégories de personnes | Clients |
| Catégories de données | Nom, prénom, email, téléphone, adresse, historique d'achats |
| Destinataires | Service commercial, service comptabilité |
| Transfert hors UE | Non |
| Durée de conservation | 3 ans après la fin de la relation commerciale |
| Mesures de sécurité | Chiffrement BDD, accès par rôle, sauvegardes chiffrées |

## Traitement 2 : Gestion des employés

| Champ | Valeur |
| ----- | ------ |
| Responsable du traitement | [Nom de l'entreprise] |
| Finalité | Gestion RH et paie |
| Base légale | Obligation légale (Art. 6.1.c RGPD) |
| Catégories de personnes | Employés |
| Catégories de données | Nom, prénom, adresse, n° SS, RIB, contrat de travail |
| Destinataires | Service RH, comptabilité, prestataire de paie |
| Transfert hors UE | Non |
| Durée de conservation | 5 ans après le départ de l'employé |
| Mesures de sécurité | Accès restreint RH, chiffrement des bulletins, coffre-fort numérique |
EOF

echo "Registre RGPD créé : registre-rgpd.md"
```

**Résultat attendu** :

```text
Registre RGPD créé : registre-rgpd.md
```

### Étape 2 : Conduire une analyse de risque simplifiée (EBIOS RM - Atelier 1 et 2)

```bash
# Créer une analyse de risque simplifiée
cat << 'EOF' > analyse-risque-ebios.md
# Analyse de Risque EBIOS RM - Application Web E-commerce

## Atelier 1 : Cadrage et socle de sécurité

### Périmètre
- Application web e-commerce (site, API, base de données)
- Hébergement : serveur dédié chez un hébergeur français
- 5000 clients, 50 000 transactions/mois

### Biens essentiels
| Bien | Type | Criticité |
| ---- | ---- | --------- |
| Données clients (nom, email, adresse) | Données personnelles | Élevée |
| Données de paiement | Données sensibles | Critique |
| Catalogue produits | Données métier | Moyenne |
| Disponibilité du site | Service | Élevée |
| Code source | Propriété intellectuelle | Moyenne |

### Socle de sécurité
- [x] HTTPS obligatoire (TLS 1.3)
- [x] Mots de passe hashés (Argon2id)
- [x] Sauvegardes quotidiennes chiffrées
- [ ] MFA pour les comptes admin (à implémenter)
- [ ] WAF en place (à implémenter)
- [ ] Tests d'intrusion annuels (à planifier)

## Atelier 2 : Sources de risque

| Source de risque | Motivation | Capacité | Niveau de menace |
| ---------------- | ---------- | -------- | ---------------- |
| Cybercriminels | Gain financier (vol de CB, ransomware) | Élevée | Critique |
| Concurrent malveillant | Déni de service, vol de données | Moyenne | Élevé |
| Employé mécontent | Sabotage, vol de données | Élevée (accès interne) | Élevé |
| Script kiddies | Défi, vandalisme | Faible | Moyen |
| Erreur humaine | Non intentionnel | Variable | Élevé |
EOF

echo "Analyse de risque EBIOS RM créée : analyse-risque-ebios.md"
```

**Résultat attendu** :

```text
Analyse de risque EBIOS RM créée : analyse-risque-ebios.md
```

### Étape 3 : Créer une matrice de risque

```bash
# Script Python pour générer et afficher une matrice de risque
cat << 'PYEOF' > matrice-risque.py
#!/usr/bin/env python3
"""Génère une matrice de risque et évalue les risques identifiés."""

# Définition des échelles
PROBABILITES = {1: "Rare", 2: "Peu probable", 3: "Possible", 4: "Probable", 5: "Quasi certain"}
IMPACTS = {1: "Négligeable", 2: "Mineur", 3: "Modéré", 4: "Majeur", 5: "Critique"}

def niveau_risque(probabilite, impact):
    """Calcule le niveau de risque et retourne le libellé."""
    score = probabilite * impact
    if score >= 15:
        return score, "CRITIQUE"
    elif score >= 9:
        return score, "ÉLEVÉ"
    elif score >= 4:
        return score, "MOYEN"
    else:
        return score, "FAIBLE"

# Risques identifiés pour l'application e-commerce
risques = [
    {
        "nom": "Injection SQL sur le formulaire de recherche",
        "probabilite": 3,
        "impact": 5,
        "traitement": "Réduire",
        "mesure": "Requêtes préparées, WAF, tests d'intrusion"
    },
    {
        "nom": "Ransomware via phishing sur un administrateur",
        "probabilite": 4,
        "impact": 5,
        "traitement": "Réduire",
        "mesure": "MFA, sensibilisation, sauvegardes offline"
    },
    {
        "nom": "DDoS pendant les soldes",
        "probabilite": 3,
        "impact": 4,
        "traitement": "Réduire + Transférer",
        "mesure": "CDN anti-DDoS, assurance cyber"
    },
    {
        "nom": "Fuite de données clients par employé",
        "probabilite": 2,
        "impact": 5,
        "traitement": "Réduire",
        "mesure": "DLP, accès moindre privilège, monitoring"
    },
    {
        "nom": "Panne serveur hébergeur",
        "probabilite": 2,
        "impact": 3,
        "traitement": "Réduire",
        "mesure": "PRA, sauvegardes géo-répliquées"
    },
]

# Affichage
print("=" * 80)
print("MATRICE DE RISQUE - Application E-commerce")
print("=" * 80)
print()
print(f"{'Risque':<50} {'P':>3} {'I':>3} {'Score':>6} {'Niveau':<10} {'Traitement'}")
print("-" * 100)

for r in sorted(risques, key=lambda x: x["probabilite"] * x["impact"], reverse=True):
    score, niveau = niveau_risque(r["probabilite"], r["impact"])
    print(f"{r['nom']:<50} {r['probabilite']:>3} {r['impact']:>3} {score:>6} {niveau:<10} {r['traitement']}")

print()
print("Légende : P = Probabilité (1-5), I = Impact (1-5)")
print()

# Plan de traitement
print("=" * 80)
print("PLAN DE TRAITEMENT DES RISQUES")
print("=" * 80)
print()
for r in sorted(risques, key=lambda x: x["probabilite"] * x["impact"], reverse=True):
    score, niveau = niveau_risque(r["probabilite"], r["impact"])
    print(f"[{niveau}] {r['nom']}")
    print(f"  Traitement : {r['traitement']}")
    print(f"  Mesure : {r['mesure']}")
    print()
PYEOF
python3 matrice-risque.py
```

**Résultat attendu** :

```text
================================================================================
MATRICE DE RISQUE - Application E-commerce
================================================================================

Risque                                              P   I  Score Niveau     Traitement
----------------------------------------------------------------------------------------------------
Ransomware via phishing sur un administrateur       4   5     20 CRITIQUE   Réduire
Injection SQL sur le formulaire de recherche        3   5     15 CRITIQUE   Réduire
DDoS pendant les soldes                             3   4     12 ÉLEVÉ      Réduire + Transférer
Fuite de données clients par employé                2   5     10 ÉLEVÉ      Réduire
Panne serveur hébergeur                             2   3      6 MOYEN      Réduire

Légende : P = Probabilité (1-5), I = Impact (1-5)

================================================================================
PLAN DE TRAITEMENT DES RISQUES
================================================================================

[CRITIQUE] Ransomware via phishing sur un administrateur
  Traitement : Réduire
  Mesure : MFA, sensibilisation, sauvegardes offline

[CRITIQUE] Injection SQL sur le formulaire de recherche
  Traitement : Réduire
  Mesure : Requêtes préparées, WAF, tests d'intrusion

[ÉLEVÉ] DDoS pendant les soldes
  Traitement : Réduire + Transférer
  Mesure : CDN anti-DDoS, assurance cyber

[ÉLEVÉ] Fuite de données clients par employé
  Traitement : Réduire
  Mesure : DLP, accès moindre privilège, monitoring

[MOYEN] Panne serveur hébergeur
  Traitement : Réduire
  Mesure : PRA, sauvegardes géo-répliquées
```

### Étape 4 : Rédiger une politique de sécurité des mots de passe

```bash
# Créer une politique de mots de passe
cat << 'EOF' > politique-mots-de-passe.md
# Politique de sécurité des mots de passe

**Version** : 1.0
**Date** : 2026-03-19
**Approuvé par** : [Nom du RSSI]
**Prochaine révision** : 2027-03-19

## 1. Objectif

Cette politique définit les exigences de création, d'utilisation et de gestion des mots de passe pour protéger les systèmes d'information de l'organisation.

## 2. Périmètre

Cette politique s'applique à tous les employés, prestataires et partenaires ayant accès aux systèmes d'information de l'organisation.

## 3. Exigences

### 3.1 Complexité

- Longueur minimale : 12 caractères (16 pour les comptes à privilèges)
- Au moins 3 des 4 catégories suivantes : majuscules, minuscules, chiffres, symboles
- Interdit : nom, prénom, date de naissance, nom de l'entreprise
- Interdit : mots de passe des listes de mots de passe compromis (haveibeenpwned)

### 3.2 Renouvellement

- Les mots de passe standard ne sont pas soumis à expiration obligatoire (conformément aux recommandations ANSSI 2024)
- Les mots de passe doivent être changés immédiatement en cas de compromission suspectée
- Les comptes à privilèges sont soumis à une rotation de 90 jours

### 3.3 Authentification multi-facteurs (MFA)

- Obligatoire pour tous les comptes à privilèges (administrateurs, root)
- Obligatoire pour l'accès distant (VPN, SSH)
- Recommandé pour tous les comptes utilisateur

### 3.4 Stockage technique

- Les mots de passe sont hashés avec Argon2id (paramètres : m=65536, t=3, p=4)
- Les mots de passe ne sont jamais stockés en clair ni chiffrés de manière réversible
- Les mots de passe ne sont jamais transmis en clair (TLS obligatoire)

### 3.5 Gestionnaire de mots de passe

- L'utilisation d'un gestionnaire de mots de passe approuvé est obligatoire
- Gestionnaires approuvés : KeePassXC (local), Bitwarden (si auto-hébergé)
- Le mot de passe principal du gestionnaire doit être une passphrase d'au moins 20 caractères

## 4. Sanctions

Le non-respect de cette politique peut entraîner des sanctions disciplinaires conformément au règlement intérieur.
EOF

echo "Politique de mots de passe créée : politique-mots-de-passe.md"
```

**Résultat attendu** :

```text
Politique de mots de passe créée : politique-mots-de-passe.md
```

### Étape 5 : Créer un plan de continuité d'activité simplifié

```bash
# Créer un PCA/PRA simplifié
cat << 'EOF' > plan-continuite-activite.md
# Plan de Continuité d'Activité (PCA)

## 1. Systèmes critiques et objectifs de reprise

| Système | RTO | RPO | Criticité |
| ------- | --- | --- | --------- |
| Site e-commerce | 2h | 1h | Critique |
| Base de données clients | 2h | 15 min | Critique |
| Système de paiement | 1h | 0 min (aucune perte) | Critique |
| Email | 8h | 4h | Élevée |
| ERP interne | 24h | 24h | Moyenne |

## 2. Stratégies de sauvegarde

| Système | Type | Fréquence | Rétention | Lieu |
| ------- | ---- | --------- | --------- | ---- |
| Base de données | Complète + WAL | Complète : quotidien, WAL : continu | 30 jours | Site distant chiffré |
| Fichiers serveur | Incrémentale | Toutes les 6h | 14 jours | Site distant chiffré |
| Configuration | Versionnée (Git) | À chaque modification | Illimité | Dépôt Git distant |

## 3. Procédure de reprise - Scénario : panne serveur principal

### Étape 1 : Détection et alerte (0-15 min)
- Le monitoring (Uptime Kuma) détecte l'indisponibilité
- Alerte envoyée par SMS au responsable d'astreinte
- Le responsable confirme la panne et active le PRA

### Étape 2 : Bascule sur le site de secours (15 min - 1h)
- Activer le serveur de secours (standby)
- Restaurer la dernière sauvegarde de la base de données
- Rediriger le DNS vers le site de secours (TTL court de 300s)

### Étape 3 : Vérification (1h - 2h)
- Vérifier le fonctionnement du site sur le serveur de secours
- Tester le processus de commande complet
- Vérifier l'intégrité des données restaurées

### Étape 4 : Communication
- Informer les équipes internes
- Publier un message sur la page de statut
- Si données compromises : notification CNIL sous 72h (RGPD Art. 33)

## 4. Tests du PCA

| Type de test | Fréquence | Description |
| ------------ | --------- | ----------- |
| Test de restauration | Mensuel | Restaurer une sauvegarde et vérifier l'intégrité |
| Test de bascule | Trimestriel | Basculer sur le site de secours et vérifier le fonctionnement |
| Exercice de crise complet | Annuel | Simuler un scénario de sinistre avec toutes les équipes |
EOF

echo "Plan de continuité d'activité créé : plan-continuite-activite.md"
```

**Résultat attendu** :

```text
Plan de continuité d'activité créé : plan-continuite-activite.md
```

### Étape 6 : Réaliser un gap analysis simplifié

```bash
# Script Python pour un audit gap analysis
cat << 'PYEOF' > gap-analysis.py
#!/usr/bin/env python3
"""Gap analysis simplifié basé sur les CIS Controls v8."""

# Contrôles CIS v8 et état actuel
controles = [
    {
        "id": "CIS 1",
        "nom": "Inventaire des actifs matériels",
        "cible": "Inventaire automatisé et à jour",
        "etat": "Inventaire Excel manuel, mis à jour trimestriellement",
        "score_cible": 5,
        "score_actuel": 2,
    },
    {
        "id": "CIS 2",
        "nom": "Inventaire des logiciels",
        "cible": "Inventaire automatisé avec whitelist",
        "etat": "Pas d'inventaire logiciel",
        "score_cible": 5,
        "score_actuel": 0,
    },
    {
        "id": "CIS 3",
        "nom": "Protection des données",
        "cible": "Classification complète, chiffrement des données sensibles",
        "etat": "Chiffrement TLS en transit, pas de classification formelle",
        "score_cible": 5,
        "score_actuel": 2,
    },
    {
        "id": "CIS 4",
        "nom": "Configuration sécurisée",
        "cible": "Benchmarks CIS appliqués, durcissement automatisé",
        "etat": "Configuration par défaut avec quelques ajustements manuels",
        "score_cible": 5,
        "score_actuel": 2,
    },
    {
        "id": "CIS 5",
        "nom": "Gestion des comptes",
        "cible": "MFA partout, revue trimestrielle, moindre privilège",
        "etat": "MFA pour les admins uniquement, pas de revue régulière",
        "score_cible": 5,
        "score_actuel": 3,
    },
    {
        "id": "CIS 6",
        "nom": "Gestion du contrôle d'accès",
        "cible": "Scan hebdomadaire, patch sous 48h pour les critiques",
        "etat": "Mises à jour manuelles, pas de scan régulier",
        "score_cible": 5,
        "score_actuel": 1,
    },
]

print("=" * 80)
print("GAP ANALYSIS - CIS Controls v8")
print("=" * 80)
print()
print(f"{'Contrôle':<40} {'Actuel':>7} {'Cible':>7} {'Écart':>7} {'Priorité'}")
print("-" * 75)

total_actuel = 0
total_cible = 0

for c in controles:
    ecart = c["score_cible"] - c["score_actuel"]
    total_actuel += c["score_actuel"]
    total_cible += c["score_cible"]

    if ecart >= 4:
        priorite = "URGENT"
    elif ecart >= 3:
        priorite = "HAUTE"
    elif ecart >= 2:
        priorite = "MOYENNE"
    else:
        priorite = "BASSE"

    print(f"{c['id'] + ' - ' + c['nom']:<40} {c['score_actuel']:>5}/5 {c['score_cible']:>5}/5 {ecart:>5} {priorite}")

print("-" * 75)
maturite = (total_actuel / total_cible) * 100
print(f"{'Score global':<40} {total_actuel:>5}/{total_cible}          Maturité : {maturite:.0f}%")
print()

# Recommandations
print("=" * 80)
print("RECOMMANDATIONS PRIORITAIRES")
print("=" * 80)
print()
for c in sorted(controles, key=lambda x: x["score_cible"] - x["score_actuel"], reverse=True):
    ecart = c["score_cible"] - c["score_actuel"]
    if ecart >= 3:
        print(f"[PRIORITAIRE] {c['id']} - {c['nom']}")
        print(f"  État actuel : {c['etat']}")
        print(f"  Cible : {c['cible']}")
        print(f"  Écart : {ecart} points")
        print()
PYEOF
python3 gap-analysis.py
```

**Résultat attendu** :

```text
================================================================================
GAP ANALYSIS - CIS Controls v8
================================================================================

Contrôle                                 Actuel   Cible   Écart Priorité
---------------------------------------------------------------------------
CIS 1 - Inventaire des actifs matériels    2/5     5/5     3 HAUTE
CIS 2 - Inventaire des logiciels           0/5     5/5     5 URGENT
CIS 3 - Protection des données             2/5     5/5     3 HAUTE
CIS 4 - Configuration sécurisée            2/5     5/5     3 HAUTE
CIS 5 - Gestion des comptes                3/5     5/5     2 MOYENNE
CIS 6 - Gestion du contrôle d'accès         1/5     5/5     4 URGENT
---------------------------------------------------------------------------
Score global                              10/30          Maturité : 33%

================================================================================
RECOMMANDATIONS PRIORITAIRES
================================================================================

[PRIORITAIRE] CIS 2 - Inventaire des logiciels
  État actuel : Pas d'inventaire logiciel
  Cible : Inventaire automatisé avec whitelist
  Écart : 5 points

[PRIORITAIRE] CIS 6 - Gestion du contrôle d'accès
  État actuel : Mises à jour manuelles, pas de scan régulier
  Cible : Scan hebdomadaire, patch sous 48h pour les critiques
  Écart : 4 points

[PRIORITAIRE] CIS 1 - Inventaire des actifs matériels
  État actuel : Inventaire Excel manuel, mis à jour trimestriellement
  Cible : Inventaire automatisé et à jour
  Écart : 3 points

[PRIORITAIRE] CIS 3 - Protection des données
  État actuel : Chiffrement TLS en transit, pas de classification formelle
  Cible : Classification complète, chiffrement des données sensibles
  Écart : 3 points

[PRIORITAIRE] CIS 4 - Configuration sécurisée
  État actuel : Configuration par défaut avec quelques ajustements manuels
  Cible : Benchmarks CIS appliqués, durcissement automatisé
  Écart : 3 points
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `lynis audit system` | Auditer la conformité de sécurité d'un système Linux |
| `openscap xccdf eval --profile cis fichier.xml` | Évaluer la conformité CIS avec OpenSCAP |
| `grep -r "password" /etc/ --include="*.conf"` | Chercher des mots de passe en clair dans les configurations |
| `find / -perm -4000 -type f 2>/dev/null` | Lister les fichiers avec le bit SUID (risque d'élévation de privilèges) |
| `lastlog` | Voir les dernières connexions des utilisateurs |
| `ausearch -m avc -ts recent` | Chercher les événements SELinux récents |

---

## Pièges Fréquents

### Piège 1 : Confondre conformité et sécurité

**Problème** : Une organisation passe l'audit ISO 27001 et pense être en sécurité. La conformité est une photo à un instant T. Les attaquants ne respectent pas les calendriers d'audit.

**Solution** : La conformité est un minimum, pas un maximum. Elle doit être complétée par une surveillance continue, des tests d'intrusion réguliers et une culture de sécurité.

### Piège 2 : Rédiger des politiques que personne ne lit

**Problème** : La PSSI fait 200 pages. Personne ne la lit. Personne ne la respecte. Elle existe uniquement pour satisfaire les auditeurs.

**Solution** : Rédige des politiques courtes, claires et applicables. Complète-les par des standards et procédures opérationnelles. Forme les employés aux règles essentielles.

### Piège 3 : Ne jamais tester le PCA/PRA

**Problème** : Le PRA est documenté mais jamais testé. Le jour du sinistre, on découvre que les sauvegardes sont corrompues, que les procédures sont obsolètes ou que personne ne connaît le processus.

**Solution** : Teste le PRA au minimum une fois par trimestre (restauration de sauvegarde). Réalise un exercice de crise complet au moins une fois par an.

### Piège 4 : Ignorer le RGPD parce que "on n'est pas une grande entreprise"

**Problème** : Le RGPD s'applique à toute organisation qui traite des données personnelles de résidents européens, quelle que soit sa taille. Une PME de 5 personnes avec un fichier clients est concernée.

**Solution** : Applique les principes de base du RGPD : registre des traitements, base légale, durée de conservation, droits des personnes, notification en cas de violation. La CNIL propose des guides adaptés aux TPE/PME.

### Piège 5 : Penser que le cloud transfère toute la responsabilité

**Problème** : "Nos données sont chez AWS, c'est leur problème." Non. Le modèle de responsabilité partagée signifie que le client est toujours responsable de ses données, de ses configurations et de ses accès.

**Solution** : Comprends précisément quel modèle cloud tu utilises (IaaS, PaaS, SaaS) et ce qui relève de ta responsabilité. Chiffre tes données, gère tes accès, surveille tes logs.

---

## Checklist de Validation

- [ ] Je sais expliquer ce qu'est la GRC et pourquoi c'est important
- [ ] Je connais les 7 principes du RGPD et les droits des personnes
- [ ] Je sais ce qu'impose NIS2 (obligations, notification, sanctions)
- [ ] Je connais les 5 piliers de DORA
- [ ] Je sais conduire une analyse de risque simplifiée (EBIOS RM ateliers 1 et 2)
- [ ] Je connais les 4 options de traitement du risque
- [ ] Je sais rédiger une politique de sécurité structurée
- [ ] Je comprends la classification des données (4 niveaux)
- [ ] Je connais le rôle du RSSI et son positionnement dans l'organisation
- [ ] Je sais ce qu'est un PCA/PRA et les métriques RPO/RTO
- [ ] Je comprends le modèle de responsabilité partagée dans le cloud
- [ ] Je sais réaliser un gap analysis basé sur un référentiel

---

## Exercice Pratique

**Énoncé** : Tu es consultant GRC pour une clinique médicale de 30 employés qui souhaite se mettre en conformité. La clinique gère des dossiers patients (données de santé), utilise un logiciel métier hébergé en SaaS, et n'a aucune politique de sécurité formalisée.

Réalise les tâches suivantes :

1. Identifie les réglementations applicables et justifie pourquoi
2. Crée le registre des traitements RGPD (au moins 3 traitements)
3. Conduis une analyse de risque simplifiée (identifie 5 risques, évalue-les et propose des traitements)
4. Rédige une politique de classification des données adaptée au contexte médical
5. Définis les métriques RPO/RTO pour les 3 systèmes les plus critiques
6. Identifie les responsabilités de la clinique dans le modèle de responsabilité partagée avec le fournisseur SaaS

**Indications** :

- Les données de santé sont des données sensibles au sens du RGPD (Art. 9)
- Une clinique est un établissement de santé : vérifie si NIS2 s'applique
- Le fournisseur SaaS héberge les données en France
- Pense aux risques humains (erreur, malveillance) autant qu'aux risques techniques

**Résultat attendu** : Un dossier GRC complet avec les 6 livrables demandés.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### 1. Réglementations applicables

| Réglementation | Applicable ? | Justification |
| -------------- | ------------ | ------------- |
| **RGPD** | Oui | Traitement de données personnelles de résidents UE (données de santé = Art. 9) |
| **NIS2** | Oui | Le secteur santé fait partie des entités essentielles (Annexe I) |
| **Code de la santé publique** | Oui | Obligations spécifiques au secret médical et à l'hébergement des données de santé |
| **HDS** | Oui (fournisseur) | L'hébergeur SaaS doit être certifié HDS (Hébergeur de Données de Santé) |
| **DORA** | Non | La clinique n'est pas un acteur du secteur financier |

### 2. Registre des traitements RGPD

**Traitement 1 : Gestion des dossiers patients**

| Champ | Valeur |
| ----- | ------ |
| Finalité | Suivi médical des patients |
| Base légale | Intérêt vital (Art. 6.1.d) + Médecine préventive (Art. 9.2.h) |
| Données | Identité, coordonnées, n° SS, antécédents, diagnostics, traitements, résultats d'examens |
| Durée | 20 ans après le dernier passage (Code de la santé publique) |
| Mesures | Chiffrement, accès par rôle médical, logs d'accès, hébergement HDS |

**Traitement 2 : Gestion des rendez-vous**

| Champ | Valeur |
| ----- | ------ |
| Finalité | Planification des consultations |
| Base légale | Exécution du contrat (Art. 6.1.b) |
| Données | Nom, prénom, téléphone, email, motif de consultation |
| Durée | 2 ans après le dernier rendez-vous |
| Mesures | Accès authentifié, TLS, sauvegardes chiffrées |

**Traitement 3 : Gestion du personnel**

| Champ | Valeur |
| ----- | ------ |
| Finalité | Gestion RH et paie |
| Base légale | Obligation légale (Art. 6.1.c) |
| Données | Identité, coordonnées, n° SS, RIB, contrat, diplômes |
| Durée | 5 ans après le départ |
| Mesures | Accès restreint au service RH, chiffrement |

### 3. Analyse de risque

| Risque | P | I | Score | Traitement | Mesure |
| ------ | - | - | ----- | ---------- | ------ |
| Ransomware chiffrant les dossiers patients | 4 | 5 | 20 (C) | Réduire | Sauvegardes offline, EDR, sensibilisation |
| Fuite de données de santé par email | 3 | 5 | 15 (C) | Réduire | DLP, chiffrement email, formation |
| Accès non autorisé au logiciel métier | 3 | 4 | 12 (E) | Réduire | MFA, revue des accès trimestrielle |
| Indisponibilité du fournisseur SaaS | 2 | 4 | 8 (M) | Transférer | SLA contractuel, plan de bascule |
| Erreur de saisie dans un dossier patient | 3 | 3 | 9 (E) | Réduire | Double vérification, historique des modifications |

### 4. Politique de classification des données

| Niveau | Exemples clinique | Mesures |
| ------ | ----------------- | ------- |
| Public | Horaires, adresse | Aucune restriction |
| Interne | Procédures internes, planning | Accès authentifié |
| Confidentiel | Données employés, contrats fournisseurs | Chiffrement, accès nominatif |
| Secret médical | Dossiers patients, résultats d'examens | Chiffrement fort, MFA, audit d'accès, hébergement HDS |

### 5. Métriques RPO/RTO

| Système | RPO | RTO | Justification |
| ------- | --- | --- | ------------- |
| Logiciel métier (dossiers patients) | 15 min | 2h | Données vitales, consultations en continu |
| Système de rendez-vous | 1h | 4h | Impact sur l'organisation mais pas sur les soins |
| Messagerie | 4h | 8h | Communication importante mais non critique |

### 6. Responsabilité partagée avec le fournisseur SaaS

| Responsabilité | Fournisseur SaaS | Clinique |
| -------------- | ---------------- | -------- |
| Infrastructure physique | Oui | Non |
| Sécurité réseau de l'hébergement | Oui | Non |
| Disponibilité de l'application | Oui (selon SLA) | Vérification du SLA |
| Sauvegardes des données | Oui (selon contrat) | Vérification et tests de restauration |
| Gestion des accès utilisateurs | Non | Oui (créer/supprimer les comptes) |
| Complexité des mots de passe | Fournit la fonctionnalité | Configure et applique la politique |
| Classification des données | Non | Oui |
| Formation des utilisateurs | Non | Oui |
| Conformité RGPD (données) | Sous-traitant (Art. 28) | Responsable du traitement |
| Certification HDS | Oui (obligation légale) | Vérifier la certification |

---

## Navigation

← Fiche précédente : **[03 - Sécurité des réseaux - Fondamentaux](03-securite-reseaux.md)**
