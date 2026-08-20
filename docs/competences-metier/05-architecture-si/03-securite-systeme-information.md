---
tags:
  - Méthodologie
  - Débutant
  - Concept
description: "03 - La Sécurité du Système d'Information"
estimated_time: "25 min"
fiche_number: 3
total_fiches: 4
cursus: "Architecture SI"
---

# 03 - La Sécurité du Système d'Information

> **En bref** : À la fin de cette fiche, tu sauras identifier les menaces pesant sur un système d'information, appliquer les bonnes pratiques de sécurité, et comprendre les obligations réglementaires (RGPD, ISO 27001). Lecture estimée : 25 min.


## Prérequis

- Fiche **[01 - L'Infrastructure Réseau](01-infrastructure-reseau.md)**
- Fiche **[02 - La Supervision et le Monitoring](02-supervision-monitoring.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras identifier les menaces pesant sur un système d'information, appliquer les bonnes pratiques de sécurité, et comprendre les obligations réglementaires (RGPD, ISO 27001).

---

## Concepts

### Qu'est-ce que la sécurité du SI ?

**Définition** : La sécurité du système d'information (SSI) est l'ensemble des mesures techniques et organisationnelles qui protègent les données et les systèmes contre les menaces : accès non autorisés, pertes, vols, ou destructions.

**Les 3 piliers de la sécurité (CIA)** :

| Pilier | Signification | Exemple de menace |
| ------ | ------------- | ----------------- |
| **Confidentialité** | Seules les personnes autorisées accèdent aux données | Vol de données clients |
| **Intégrité** | Les données ne sont pas modifiées de façon non autorisée | Altération de factures |
| **Disponibilité** | Les systèmes sont accessibles quand on en a besoin | Attaque DDoS |

**Analogie concrète** : La sécurité SI est comme la sécurité d'une maison. La confidentialité = seules les personnes avec la clé entrent. L'intégrité = personne ne peut modifier les documents dans ton coffre-fort. La disponibilité = tu peux toujours entrer chez toi (pas de serrure bloquée).

---

### Quelles sont les menaces principales ?

| Menace | Description | Impact |
| ------ | ----------- | ------ |
| **Phishing** | Email frauduleux pour voler des identifiants | Vol de credentials |
| **Ransomware** | Logiciel qui chiffre les données et demande une rançon | Perte de données, coût |
| **Injection SQL** | Code malveillant dans les requêtes base de données | Vol/modification de données |
| **XSS** | Code JavaScript malveillant injecté dans les pages web | Vol de sessions |
| **DDoS** | Surcharge de requêtes pour rendre un service indisponible | Indisponibilité |
| **Ingénierie sociale** | Manipulation psychologique pour obtenir des informations | Accès non autorisé |
| **Fuite interne** | Employé malveillant ou négligent | Vol de données |

---

### Qu'est-ce que le principe du moindre privilège ?

**Définition** : Le principe du moindre privilège stipule qu'un utilisateur ou un programme ne doit avoir que les permissions strictement nécessaires pour accomplir sa tâche, et pas plus.

**Exemple** :

| Utilisateur | Besoin | Droits à accorder | Droits à NE PAS accorder |
| ----------- | ------ | ----------------- | ------------------------ |
| Développeur | Lire/écrire le code | Accès Git, serveur dev | Accès production, BDD prod |
| Comptable | Consulter les factures | Lecture module compta | Modification des comptes utilisateurs |
| Stagiaire | Observer | Lecture seule | Aucun droit d'écriture |

**Pourquoi c'est important** : Si un compte est compromis, l'attaquant n'a accès qu'à ce que ce compte pouvait faire. Un stagiaire piraté = dégâts limités. Un admin piraté = catastrophe.

---

### Qu'est-ce que le RGPD ?

**Définition** : Le RGPD (Règlement Général sur la Protection des Données) est un règlement européen qui encadre le traitement des données personnelles. Il est obligatoire depuis mai 2018.

**Principes clés** :

| Principe | Signification |
| -------- | ------------- |
| **Finalité** | Les données sont collectées pour un objectif précis |
| **Minimisation** | Ne collecter que le nécessaire |
| **Limitation de conservation** | Supprimer les données après leur utilité |
| **Sécurité** | Protéger les données contre les accès non autorisés |
| **Base légale** | Chaque traitement repose sur une base de l'article 6 (contrat, obligation légale, intérêt légitime, consentement, etc.) |
| **Droits des personnes** | Accès, rectification, suppression, portabilité |

**Consentement** : le consentement explicite est **une** base légale possible, pas la seule. Pour un compte client lié à un contrat, la base est souvent l'exécution du contrat. Le consentement s'impose surtout pour le marketing non essentiel, certains cookies non techniques, ou des traitements non nécessaires au service.

**Sanctions** : Jusqu'à 20 millions d'euros ou 4% du chiffre d'affaires mondial.

**Données personnelles** = toute information permettant d'identifier une personne :

| Donnée personnelle | Donnée non personnelle |
| ------------------ | ---------------------- |
| Nom, prénom | Statistiques agrégées |
| Email nominatif | Données anonymisées |
| Adresse IP | Données d'entreprise (sans lien avec une personne) |
| Numéro de téléphone | |
| Photo | |

---

### Qu'est-ce que la norme ISO 27001 ?

**Définition** : ISO 27001 est une norme internationale qui définit les exigences pour un Système de Management de la Sécurité de l'Information (SMSI).

**Ce qu'apporte ISO 27001** :

| Aspect | Bénéfice |
| ------ | -------- |
| Cadre structuré | Méthodologie éprouvée pour la sécurité |
| Certification | Preuve reconnue internationalement |
| Amélioration continue | Processus d'audit et de correction |
| Confiance | Rassure les clients et partenaires |

**Les 93 contrôles de l'Annexe A** (ISO 27001:2022) sont répartis en 4 thèmes :

1. **Contrôles organisationnels** (37 contrôles) : politiques, rôles, gestion des actifs, relations fournisseurs, gestion des incidents, continuité d'activité, conformité
2. **Contrôles liés aux personnes** (8 contrôles) : sécurité des ressources humaines, sensibilisation, télétravail
3. **Contrôles physiques** (14 contrôles) : sécurité des locaux, équipements, supports de stockage
4. **Contrôles technologiques** (34 contrôles) : contrôle d'accès, cryptographie, sécurité des opérations et des communications, développement sécurisé

**Note** : la version ISO 27001:2013 comptait 114 mesures réparties en 14 domaines. La révision **ISO 27001:2022** a restructuré l'Annexe A en 93 contrôles regroupés en 4 thèmes. La période de transition des certificats 2013 vers la version 2022 s'est terminée le **31 octobre 2025** : seuls les certificats ISO/IEC 27001:2022 restent valides après cette date (référence IAF / organismes d'accréditation).

---

## Étapes Pratiques

### Étape 1 : Analyser les risques (méthode simplifiée)

Avant de sécuriser, identifie ce qui doit être protégé :

```markdown
## Analyse de risques simplifiée

### Actifs à protéger

| Actif | Type | Criticité |
| ----- | ---- | --------- |
| Base clients | Données | Critique |
| Code source | Données | Haute |
| Serveur web | Infrastructure | Haute |
| Emails | Communication | Moyenne |

### Menaces identifiées

| Menace | Probabilité | Impact | Risque |
| ------ | ----------- | ------ | ------ |
| Phishing | Haute | Moyen | Élevé |
| Ransomware | Moyenne | Critique | Élevé |
| Fuite interne | Basse | Critique | Moyen |
| DDoS | Basse | Haute | Moyen |

### Calcul du risque

Risque = Probabilité × Impact

| | Impact Faible | Impact Moyen | Impact Critique |
| --- | ------------- | ------------ | --------------- |
| Proba Haute | Moyen | Élevé | Critique |
| Proba Moyenne | Faible | Moyen | Élevé |
| Proba Basse | Faible | Faible | Moyen |
```

---

### Étape 2 : Appliquer les bonnes pratiques de base

**Checklist de sécurité minimale** :

```markdown
## Checklist sécurité serveur

### Authentification
- [ ] Mots de passe forts (12+ caractères, complexes)
- [ ] Authentification à deux facteurs (2FA) pour les admins
- [ ] Pas de compte partagé
- [ ] Verrouillage après 5 tentatives échouées

### Accès
- [ ] SSH par clé uniquement (pas de mot de passe)
- [ ] Port SSH non standard (pas 22)
- [ ] Firewall configuré (seuls les ports nécessaires)
- [ ] Principe du moindre privilège appliqué

### Mises à jour
- [ ] Système d'exploitation à jour
- [ ] Applications et frameworks à jour
- [ ] Mises à jour de sécurité automatiques (ou processus défini)

### Sauvegardes
- [ ] Sauvegardes quotidiennes
- [ ] Sauvegardes testées (restauration vérifiée)
- [ ] Sauvegardes hors site (autre datacenter ou cloud)
- [ ] Sauvegardes chiffrées

### Logs
- [ ] Journalisation activée
- [ ] Logs centralisés
- [ ] Rétention suffisante (30+ jours)
- [ ] Alertes sur événements suspects
```

---

### Étape 3 : Sécuriser SSH

```bash
# Éditer la configuration SSH
sudo nano /etc/ssh/sshd_config
```

**Configuration recommandée** :

```text
# Désactiver l'authentification par mot de passe
PasswordAuthentication no

# Désactiver la connexion root
PermitRootLogin no

# Changer le port par défaut
Port 2222

# Autoriser uniquement certains utilisateurs
AllowUsers deploy admin

# Limiter les tentatives
MaxAuthTries 3
```

```bash
# Redémarrer SSH
sudo systemctl restart sshd
```

---

### Étape 4 : Configurer un firewall basique (UFW)

```bash
# Installer UFW (si pas présent)
sudo apt install ufw

# Politique par défaut : tout bloquer en entrée
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Autoriser SSH (sur le port personnalisé)
sudo ufw allow 2222/tcp

# Autoriser HTTP et HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Activer le firewall
sudo ufw enable

# Vérifier le statut
sudo ufw status verbose
```

**Résultat attendu** :

```text
Status: active

To                         Action      From
--                         ------      ----
2222/tcp                   ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

---

### Étape 5 : Mettre en place une politique de mots de passe

```markdown
## Politique de mots de passe

### Règles obligatoires

| Règle | Valeur |
| ----- | ------ |
| Longueur minimale | 12 caractères (idéalement 15+ selon NIST SP 800-63B) |
| Complexité | Préférer longueur + liste noire des mots de passe connus ; éviter les règles de composition trop rigides qui poussent aux patterns prévisibles |
| Historique | Pas de réutilisation des 5 derniers mots de passe |
| Expiration | Pas de rotation périodique arbitraire (NIST SP 800-63B) ; changer immédiatement en cas de compromission suspectée |
| MFA | Obligatoire pour les comptes à privilèges |
| Verrouillage | Après 5 tentatives échouées (ou throttling progressif) |

### Mots de passe interdits

- Nom de l'entreprise
- Prénoms des employés
- Dates de naissance
- Mots du dictionnaire seuls
- Séquences simples (123456, azerty, etc.)

### Gestionnaire de mots de passe

L'utilisation d'un gestionnaire de mots de passe est obligatoire :
- KeePass (auto-hébergé)
- Bitwarden (cloud ou auto-hébergé)
- 1Password (équipes)
```

---

### Étape 6 : Sensibiliser les utilisateurs

La sécurité technique ne suffit pas. La principale faille est humaine.

```markdown
## Programme de sensibilisation

### Formation initiale (nouveaux employés)

| Sujet | Durée | Support |
| ----- | ----- | ------- |
| Politique de sécurité | 30 min | Présentation |
| Reconnaître le phishing | 30 min | Exemples réels |
| Gestion des mots de passe | 20 min | Démo gestionnaire |
| Signaler un incident | 10 min | Procédure |

### Rappels périodiques

| Fréquence | Action |
| --------- | ------ |
| Mensuel | Email de sensibilisation (1 menace focus) |
| Trimestriel | Simulation de phishing |
| Annuel | Reformation complète |

### Simulation de phishing

Envoyer de faux emails de phishing pour :
1. Mesurer le taux de clic (objectif : < 5%)
2. Identifier les personnes à former
3. Améliorer la vigilance

**Important** : Pas de sanction, c'est de la formation.
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `sudo ufw status` | Voir l'état du firewall |
| `sudo fail2ban-client status` | Voir les IPs bannies |
| `last` | Voir les dernières connexions |
| `sudo cat /var/log/auth.log` | Voir les tentatives de connexion |
| `sudo lynis audit system` | Audit de sécurité automatique |
| `sudo chkrootkit` | Vérifier la présence de rootkits |

---

## Pièges Fréquents

### Piège 1 : Sécurité = complexité

⚠️ **Problème** : Des règles trop complexes poussent les utilisateurs à contourner (post-it avec mot de passe).

✅ **Solution** : Équilibrer sécurité et utilisabilité. Un gestionnaire de mots de passe résout ce problème.

---

### Piège 2 : Se croire à l'abri

⚠️ **Problème** : "On est une petite boîte, personne ne va nous attaquer."

✅ **Solution** : Les attaques automatisées ciblent tout le monde. Les ransomwares ne font pas de tri.

---

### Piège 3 : Sauvegardes non testées

⚠️ **Problème** : Les sauvegardes existent mais la restauration échoue le jour J.

✅ **Solution** : Tester une restauration complète au moins une fois par trimestre.

---

### Piège 4 : Tout miser sur le technique

⚠️ **Problème** : Firewall et antivirus au top, mais un employé donne son mot de passe par téléphone.

✅ **Solution** : La sensibilisation est aussi importante que la technique.

---

## Checklist de Validation

- [ ] Je connais les 3 piliers de la sécurité (CIA)
- [ ] Je sais identifier les principales menaces (phishing, ransomware, etc.)
- [ ] Je comprends le principe du moindre privilège
- [ ] Je connais les obligations RGPD de base
- [ ] Je sais sécuriser un accès SSH
- [ ] Je sais configurer un firewall basique
- [ ] Je comprends l'importance de la sensibilisation

---

## Exercice Pratique

**Énoncé** : Tu dois rédiger une politique de sécurité simplifiée pour une PME de 20 personnes.

1. Liste 5 règles de sécurité prioritaires
2. Décris le contenu d'une formation de sensibilisation (3 sujets)
3. Crée une checklist RGPD pour un nouveau projet

**Résultat attendu** : Un document Markdown d'environ 50 lignes.

---

## Solution de l'Exercice

> **Note** : Cette section contient une solution possible.

---

```markdown
# Politique de sécurité - PME 20 personnes

## 1. Règles de sécurité prioritaires

| Règle | Description | Responsable |
| ----- | ----------- | ----------- |
| Mots de passe forts | 12+ caractères, gestionnaire obligatoire | Tous |
| Authentification 2FA | Obligatoire pour email et outils critiques | Tous |
| Verrouillage session | Verrouiller son poste dès qu'on s'éloigne | Tous |
| Mises à jour | Appliquer les MAJ dans les 7 jours | IT |
| Signalement incidents | Signaler immédiatement tout email suspect | Tous |

## 2. Formation de sensibilisation

### Sujet 1 : Reconnaître le phishing (20 min)

- Exemples d'emails frauduleux réels
- Indices à vérifier : expéditeur, liens, urgence artificielle
- Procédure : ne pas cliquer, transférer à IT

### Sujet 2 : Gestion des mots de passe (15 min)

- Démonstration du gestionnaire (KeePass/Bitwarden)
- Création d'un mot de passe fort
- Ne jamais partager, même à "l'IT qui appelle"

### Sujet 3 : Protection des données clients (15 min)

- Ce qu'est une donnée personnelle
- Ce qu'on peut/ne peut pas faire
- Chiffrer les fichiers sensibles

## 3. Checklist RGPD - Nouveau projet

- [ ] Quelles données personnelles seront collectées ?
- [ ] Finalité légitime et documentée ?
- [ ] Données minimisées (seulement le nécessaire) ?
- [ ] Durée de conservation définie ?
- [ ] Base légale du traitement identifiée (consentement si applicable, sinon contrat / intérêt légitime / obligation légale) ?
- [ ] Mentions légales rédigées ?
- [ ] Droits des personnes (accès, suppression) implémentés ?
- [ ] Données chiffrées en transit (HTTPS) et au repos ?
- [ ] Sous-traitants conformes RGPD (DPA signé) ?
- [ ] Registre des traitements mis à jour ?
```

---

## Navigation

← Fiche précédente : **[02 - La Supervision et le Monitoring](02-supervision-monitoring.md)**

→ Fiche suivante : **[04 - L'Audit de Sécurité](04-audit-securite.md)**
