---
tags:
  - Droit
  - Intermédiaire
  - Pratique
description: "RGPD pour développeurs : privacy by design, minimisation des données, gestion du consentement et anonymisation dans le code"
estimated_time: "75 min"
fiche_number: 2
total_fiches: 4
cursus: "Droit et RGPD"
---

# 02 - RGPD pour développeurs

> **En bref** : Cette fiche traduit les principes du RGPD en pratiques concrètes de développement : privacy by design, minimisation des données dans les bases et formulaires, gestion du consentement, cookies et anonymisation dans le code. Lecture estimée : 75 min.


!!! warning "Périmètre"
    Cette fiche est pédagogique. Elle **ne constitue pas** un conseil juridique. Pour une conformité réelle, consulte un juriste ou un DPO.

## Prérequis

- Avoir lu la fiche [01 - Introduction au RGPD](01-introduction-rgpd.md) (principes fondamentaux, droits, bases légales)
- Connaissances de base en HTML et en bases de données relationnelles
- Connaissances de base en PHP ou JavaScript

## Objectif de cette fiche

À la fin de cette fiche, tu sauras appliquer les principes du RGPD dans ton code : concevoir des formulaires conformes, gérer le consentement utilisateur, implémenter des bannières de cookies et choisir entre anonymisation et pseudonymisation.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le Privacy by Design ?

**Définition** : Le Privacy by Design est un cadre de 7 principes formulé par Ann Cavoukian. L'**article 25** du RGPD impose la protection des données dès la conception et par défaut. Il ne recopie pas la liste des 7 principes : ne les attribue pas à l'article 25.

**Le problème que le Privacy by Design résout** :

Sans Privacy by Design, voici les problèmes rencontrés :

1. **Correctifs coûteux** : Modifier un système existant pour le rendre conforme au RGPD est beaucoup plus cher que de le concevoir conforme dès le départ.

2. **Données inutiles accumulées** : Sans réflexion en amont, les développeurs collectent souvent plus de données que nécessaire "au cas où".

3. **Failles de sécurité structurelles** : Une architecture qui n'intègre pas la protection des données dès le début contient souvent des failles difficiles à corriger.

**Comment le Privacy by Design résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Correctifs coûteux | La protection est intégrée dès la conception |
| Données inutiles accumulées | Chaque donnée est justifiée avant d'être collectée |
| Failles structurelles | L'architecture est pensée pour la sécurité dès le départ |

**Analogie concrète** : Le Privacy by Design est comme la plomberie dans une maison. Si tu construis une maison sans prévoir la plomberie, il faudra casser les murs pour l'installer après. C'est cher, long et le résultat est fragile. Si tu intègres la plomberie dans les plans dès le début, tout s'emboîte naturellement.

**Les 7 principes du Privacy by Design** :

| # | Principe | Traduction pour un développeur |
| - | -------- | ------------------------------ |
| 1 | Proactif, pas réactif | Anticiper les risques dans l'architecture |
| 2 | Protection par défaut | Les paramètres les plus protecteurs sont activés par défaut |
| 3 | Protection intégrée | La sécurité fait partie de l'architecture, pas d'un patch |
| 4 | Fonctionnalité complète | La protection n'est pas un frein au service |
| 5 | Sécurité de bout en bout | Protection pendant tout le cycle de vie des données |
| 6 | Visibilité et transparence | Le code et les pratiques sont vérifiables |
| 7 | Respect de l'utilisateur | L'utilisateur garde le contrôle |

---

### Qu'est-ce que le Privacy by Default ?

**Définition** : Le Privacy by Default (protection des données par défaut) signifie que, sans action de l'utilisateur, le système doit utiliser les paramètres les plus protecteurs possibles.

**Exemple concret** :

| Situation | Privacy by Default NON respecté | Privacy by Default respecté |
| --------- | ------------------------------- | --------------------------- |
| Profil utilisateur | Profil public par défaut | Profil privé par défaut |
| Newsletter | Case pré-cochée "Oui, inscrivez-moi" | Case non cochée |
| Cookies | Tous les cookies activés par défaut | Seuls les cookies essentiels activés |
| Géolocalisation | Activée dès l'installation | Désactivée, activation sur demande |

---

### La minimisation des données

**Définition** : La minimisation consiste à ne collecter et stocker que les données strictement nécessaires à la finalité déclarée du traitement.

**Le problème que la minimisation résout** :

Sans minimisation, voici les problèmes rencontrés :

1. **Surface d'attaque élargie** : Plus tu stockes de données, plus les conséquences d'une fuite sont graves.

2. **Complexité de maintenance** : Des colonnes inutiles dans la base alourdissent les migrations, les sauvegardes et les exports.

3. **Non-conformité RGPD** : Collecter des données sans finalité légitime est une violation du principe de minimisation.

**Comment la minimisation résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Surface d'attaque | Moins de données stockées = moins de données exposées en cas de fuite |
| Complexité de maintenance | Schéma de base plus simple et plus léger |
| Non-conformité | Chaque donnée a une finalité documentée |

**Analogie concrète** : La minimisation est comme préparer un sac de randonnée. Tu n'emportes que ce dont tu as réellement besoin. Un sac trop lourd te ralentit et te fatigue. Si tu perds le sac, les dégâts sont limités à l'essentiel.

---

### La gestion du consentement

**Définition** : La gestion du consentement est l'ensemble des mécanismes techniques qui permettent de recueillir, stocker et respecter les choix de l'utilisateur concernant le traitement de ses données.

**Ce que le consentement n'est PAS** :

- Le consentement n'est pas un simple bouton "OK" ou "J'accepte" sans détail
- Le consentement n'est pas la poursuite de la navigation sur un site
- Le consentement n'est pas une case pré-cochée

**Règles techniques du consentement** :

| Règle | Implémentation |
| ----- | -------------- |
| Libre | Pas de blocage du service si refus des cookies non essentiels |
| Spécifique | Un choix par finalité (analytics, publicité, etc.) |
| Éclairé | Texte clair expliquant chaque finalité |
| Univoque | Action positive (clic sur un bouton, cocher une case) |
| Retirable | Lien accessible pour modifier ses choix à tout moment |
| Prouvable | Stocker la preuve du consentement (date, version, choix) |

---

### Les cookies et le RGPD

**Définition** : Un cookie est un petit fichier texte stocké sur le navigateur de l'utilisateur par un site web. Certains cookies sont nécessaires au fonctionnement du site, d'autres servent au suivi et à la publicité.

**Classification des cookies** :

| Catégorie | Exemples | Consentement requis ? |
| --------- | -------- | --------------------- |
| Strictement nécessaires | Session, panier d'achat, CSRF token | Non |
| Fonctionnels | Préférence de langue, thème | Recommandé par la CNIL |
| Analytiques | Google Analytics, Matomo | Oui |
| Publicitaires | Facebook Pixel, Google Ads | Oui |
| Réseaux sociaux | Boutons de partage intégrés | Oui |

**Recommandations CNIL pour les bannières de cookies** :

1. L'utilisateur doit pouvoir refuser aussi facilement qu'accepter (bouton "Refuser" aussi visible que "Accepter")
2. La poursuite de la navigation ne vaut pas consentement
3. Les choix de consentement ont une durée de validité limitée (ordre de grandeur courant : jusqu'à environ 6 mois selon les recommandations CNIL ; au-delà, il faut redemander le consentement). Ce n'est pas un « minimum obligatoire de conservation de 6 mois »
4. Un lien pour modifier ses choix doit rester accessible en permanence
5. Aucun cookie non essentiel ne doit être déposé avant le consentement

---

### Anonymisation vs pseudonymisation

**Définition** :

- **Anonymisation** : Processus irréversible qui rend impossible l'identification d'une personne, même en croisant les données avec d'autres sources.
- **Pseudonymisation** : Remplacement des identifiants directs par des pseudonymes, tout en conservant la possibilité de ré-identifier la personne avec des informations supplémentaires.

**Le problème que ces techniques résolvent** :

1. **Fuite de données** : Si les données sont anonymisées, une fuite n'expose aucune information personnelle.

2. **Analyses statistiques** : Permettre l'analyse de données sans compromettre la vie privée.

**Comparaison anonymisation vs pseudonymisation** :

| Critère | Anonymisation | Pseudonymisation |
| ------- | ------------- | ---------------- |
| Réversibilité | Irréversible | Réversible avec la clé |
| Soumis au RGPD | Non (données hors champ) | Oui (toujours des données personnelles) |
| Utilité des données | Réduite (agrégats) | Préservée (analyses individuelles possibles) |
| Technique | Agrégation, bruit statistique, k-anonymat | Remplacement par UUID, hashing avec sel |
| Exemple | "150 utilisateurs ont visité la page" | "User_a8f3b2 a visité la page à 14h30" |

**Analogie concrète** : La pseudonymisation est comme porter un masque à un bal masqué : tu es difficile à reconnaître, mais quelqu'un qui te connaît bien peut te retrouver. L'anonymisation est comme fondre dans une foule de statistiques : il est impossible de retrouver un individu précis.

---

## Étapes Pratiques

### Étape 1 : Concevoir un formulaire conforme

Voici un formulaire d'inscription qui viole le principe de minimisation, suivi de sa version corrigée.

**Formulaire non conforme** :

```html
<!-- NON CONFORME : trop de données collectées sans justification -->
<form action="/register" method="POST">
  <input type="text" name="nom" required placeholder="Nom">
  <input type="text" name="prenom" required placeholder="Prénom">
  <input type="email" name="email" required placeholder="E-mail">
  <input type="text" name="telephone" required placeholder="Téléphone">
  <input type="date" name="date_naissance" required placeholder="Date de naissance">
  <input type="text" name="adresse" required placeholder="Adresse postale">
  <input type="text" name="profession" required placeholder="Profession">
  <input type="password" name="password" required placeholder="Mot de passe">

  <!-- Case pré-cochée = NON CONFORME -->
  <label>
    <input type="checkbox" name="newsletter" checked>
    Je souhaite recevoir la newsletter
  </label>

  <button type="submit">S'inscrire</button>
</form>
```

**Formulaire conforme** :

```html
<!-- CONFORME : seules les données nécessaires sont collectées -->
<form action="/register" method="POST">
  <!-- Données nécessaires à la création du compte -->
  <input type="email" name="email" required placeholder="E-mail">
  <input type="password" name="password" required placeholder="Mot de passe">

  <!-- Données optionnelles clairement indiquées -->
  <input type="text" name="nom" placeholder="Nom (optionnel)">

  <!-- Consentement explicite : case NON pré-cochée -->
  <label>
    <input type="checkbox" name="newsletter">
    Je souhaite recevoir la newsletter (1 e-mail par semaine, désabonnement à tout moment)
  </label>

  <!-- Lien vers la politique de confidentialité -->
  <p>
    En créant un compte, tu acceptes nos
    <a href="/politique-confidentialite">conditions d'utilisation</a>.
    Tes données sont traitées conformément à notre
    <a href="/politique-confidentialite#donnees">politique de confidentialité</a>.
  </p>

  <button type="submit">Créer mon compte</button>
</form>
```

**Résultat attendu** : Le formulaire ne collecte que l'e-mail et le mot de passe (nécessaires au compte), le nom est optionnel, et la newsletter requiert un acte positif.

---

### Étape 2 : Concevoir un schéma de base de données conforme

```sql
-- Table utilisateur : seules les données nécessaires
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,        -- Jamais le mot de passe en clair
    display_name VARCHAR(100),                   -- Optionnel
    newsletter_consent BOOLEAN DEFAULT FALSE,    -- Consentement explicite
    consent_date TIMESTAMP,                      -- Preuve du consentement
    consent_version VARCHAR(20),                 -- Version des CGU acceptées
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP                         -- Soft delete pour le droit à l'effacement
);

-- Table séparée pour les preuves de consentement (traçabilité)
CREATE TABLE consent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    consent_type VARCHAR(50) NOT NULL,           -- 'newsletter', 'cookies_analytics', etc.
    granted BOOLEAN NOT NULL,                    -- true = accepté, false = refusé
    ip_address INET,                             -- IP au moment du choix
    user_agent TEXT,                              -- Navigateur au moment du choix
    policy_version VARCHAR(20) NOT NULL,         -- Version de la politique acceptée
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les requêtes de droit d'accès
CREATE INDEX idx_consent_logs_user ON consent_logs(user_id);
```

**Résultat attendu** : La base stocke uniquement les données nécessaires, trace les consentements et permet le soft delete pour gérer le droit à l'effacement.

---

### Étape 3 : Implémenter une bannière de cookies conforme

```javascript
// Gestionnaire de consentement cookies
// Respecte les recommandations CNIL : aucun cookie non essentiel avant consentement

const CookieConsent = {
  // Catégories de cookies
  categories: {
    essential: { name: "Essentiels", required: true },
    analytics: { name: "Analytiques", required: false },
    marketing: { name: "Publicitaires", required: false }
  },

  // Vérifier si l'utilisateur a déjà fait un choix
  hasConsent() {
    return localStorage.getItem("cookie_consent") !== null;
  },

  // Récupérer les choix de l'utilisateur
  getConsent() {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) return null;
    return JSON.parse(consent);
  },

  // Enregistrer les choix
  saveConsent(choices) {
    const consent = {
      choices: choices,
      date: new Date().toISOString(),
      version: "2025-01"                   // Version de la politique
    };
    localStorage.setItem("cookie_consent", JSON.stringify(consent));

    // Appliquer les choix
    this.applyConsent(choices);
  },

  // Appliquer les choix : activer/désactiver les scripts
  applyConsent(choices) {
    // Les cookies essentiels sont toujours actifs
    if (choices.analytics) {
      this.loadAnalytics();                // Charger le script analytics
    }
    if (choices.marketing) {
      this.loadMarketing();                // Charger les scripts publicitaires
    }
  },

  // Accepter tout
  acceptAll() {
    this.saveConsent({
      essential: true,
      analytics: true,
      marketing: true
    });
    this.hideBanner();
  },

  // Refuser tout (sauf essentiels)
  refuseAll() {
    this.saveConsent({
      essential: true,
      analytics: false,
      marketing: false
    });
    this.hideBanner();
  },

  // Sauvegarder les choix personnalisés
  saveCustom() {
    const choices = {
      essential: true,                     // Toujours actif
      analytics: document.getElementById("consent-analytics").checked,
      marketing: document.getElementById("consent-marketing").checked
    };
    this.saveConsent(choices);
    this.hideBanner();
  },

  loadAnalytics() {
    // Charger le script analytics uniquement après consentement
    console.log("Analytics activé");
  },

  loadMarketing() {
    // Charger les scripts marketing uniquement après consentement
    console.log("Marketing activé");
  },

  hideBanner() {
    document.getElementById("cookie-banner").style.display = "none";
  },

  // Initialisation au chargement de la page
  init() {
    if (this.hasConsent()) {
      // L'utilisateur a déjà fait un choix : appliquer silencieusement
      const consent = this.getConsent();
      this.applyConsent(consent.choices);
    } else {
      // Afficher la bannière
      document.getElementById("cookie-banner").style.display = "block";
    }
  }
};

// Lancer au chargement de la page
document.addEventListener("DOMContentLoaded", () => CookieConsent.init());
```

**Structure HTML de la bannière** :

```html
<div id="cookie-banner" style="display: none;">
  <h3>Gestion des cookies</h3>
  <p>
    Ce site utilise des cookies. Les cookies essentiels sont nécessaires
    au fonctionnement du site. Tu peux choisir d'activer les cookies
    analytiques et publicitaires.
  </p>

  <!-- Boutons Accepter et Refuser au même niveau de visibilité -->
  <button onclick="CookieConsent.acceptAll()">Tout accepter</button>
  <button onclick="CookieConsent.refuseAll()">Tout refuser</button>
  <button onclick="toggleDetails()">Personnaliser</button>

  <div id="cookie-details" style="display: none;">
    <label>
      <input type="checkbox" checked disabled> Essentiels (obligatoires)
    </label>
    <label>
      <input type="checkbox" id="consent-analytics"> Analytiques
    </label>
    <label>
      <input type="checkbox" id="consent-marketing"> Publicitaires
    </label>
    <button onclick="CookieConsent.saveCustom()">Sauvegarder mes choix</button>
  </div>
</div>
```

**Résultat attendu** : La bannière s'affiche au premier chargement, le bouton "Tout refuser" est aussi visible que "Tout accepter", et aucun cookie non essentiel n'est chargé avant le consentement.

---

### Étape 4 : Implémenter le droit à l'effacement

```php
<?php

// Gestionnaire du droit à l'effacement (article 17 du RGPD)
// Anonymise les données plutôt que de supprimer le compte brutalement

class UserDeletionService
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Supprime les données personnelles d'un utilisateur.
     * Conserve les données nécessaires aux obligations légales (factures, etc.)
     */
    public function deleteUserData(string $userId): void
    {
        $this->db->beginTransaction();

        try {
            // Étape 1 : Anonymiser les données personnelles
            $stmt = $this->db->prepare("
                UPDATE users SET
                    email = CONCAT('deleted_', id, '@anonymized.local'),
                    display_name = 'Utilisateur supprimé',
                    password_hash = 'DELETED',
                    deleted_at = NOW()
                WHERE id = :id
            ");
            $stmt->execute(['id' => $userId]);

            // Étape 2 : Supprimer les données non soumises à obligation légale
            $stmt = $this->db->prepare("
                DELETE FROM user_preferences WHERE user_id = :id
            ");
            $stmt->execute(['id' => $userId]);

            // Étape 3 : Supprimer les consentements (plus nécessaires)
            $stmt = $this->db->prepare("
                DELETE FROM consent_logs WHERE user_id = :id
            ");
            $stmt->execute(['id' => $userId]);

            // Étape 4 : Conserver les factures (obligation légale de 10 ans)
            // On anonymise le lien mais on garde la facture
            $stmt = $this->db->prepare("
                UPDATE invoices SET
                    customer_name = 'Anonymisé',
                    customer_email = 'anonymized@deleted.local'
                WHERE user_id = :id
            ");
            $stmt->execute(['id' => $userId]);

            // Étape 5 : Journaliser la suppression
            $stmt = $this->db->prepare("
                INSERT INTO deletion_logs (user_id, deleted_at, reason)
                VALUES (:id, NOW(), 'Demande utilisateur (art. 17 RGPD)')
            ");
            $stmt->execute(['id' => $userId]);

            $this->db->commit();
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
}
```

**Résultat attendu** : Les données personnelles sont anonymisées, les données soumises à obligation légale sont conservées avec des identifiants anonymisés, et la suppression est journalisée.

---

### Étape 5 : Gérer les données personnelles dans les logs

```php
<?php

// Bonnes pratiques pour les logs : ne jamais stocker de données personnelles en clair

class GdprLogger
{
    /**
     * Masque les données personnelles avant journalisation.
     * Les logs ne doivent JAMAIS contenir de données identifiantes.
     */
    public static function sanitize(string $message): string
    {
        // Masquer les adresses e-mail
        $message = preg_replace(
            '/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/',
            '[EMAIL_MASQUÉ]',
            $message
        );

        // Masquer les numéros de téléphone (format français)
        $message = preg_replace(
            '/(?:(?:\+33|0)\s?[1-9])(?:[\s.-]?\d{2}){4}/',
            '[TEL_MASQUÉ]',
            $message
        );

        // Masquer les adresses IP
        $message = preg_replace(
            '/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/',
            '[IP_MASQUÉ]',
            $message
        );

        return $message;
    }

    /**
     * Journalise un événement en masquant les données personnelles.
     */
    public static function log(string $level, string $message): void
    {
        $sanitized = self::sanitize($message);
        $timestamp = date('Y-m-d H:i:s');
        // Écriture dans le fichier de log
        error_log("[{$timestamp}] [{$level}] {$sanitized}");
    }
}

// Utilisation
GdprLogger::log('INFO', 'Connexion de jean.dupont@example.com depuis 192.168.1.100');
// Résultat dans les logs : [2025-01-15 14:30:00] [INFO] Connexion de [EMAIL_MASQUÉ] depuis [IP_MASQUÉ]
```

**Résultat attendu** : Les logs ne contiennent aucune donnée personnelle identifiable. Les adresses e-mail, numéros de téléphone et adresses IP sont masqués.

---

### Étape 6 : Pseudonymiser des données pour l'analyse

```php
<?php

// Pseudonymisation : remplacer les identifiants par des pseudonymes réversibles
// Les données restent utilisables pour l'analyse mais ne sont plus directement identifiantes

class Pseudonymizer
{
    private string $secret;

    public function __construct(string $secret)
    {
        // La clé de pseudonymisation doit être stockée séparément des données
        $this->secret = $secret;
    }

    /**
     * Génère un pseudonyme à partir d'un identifiant.
     * Le même identifiant produit toujours le même pseudonyme (déterministe).
     */
    public function pseudonymize(string $identifier): string
    {
        return hash_hmac('sha256', $identifier, $this->secret);
    }

    /**
     * Exporte les données utilisateur pseudonymisées pour l'analyse.
     */
    public function exportForAnalytics(array $userData): array
    {
        return [
            'pseudo_id' => $this->pseudonymize($userData['email']),
            'age_range' => $this->ageToRange($userData['age']),  // Généralisation
            'city' => $userData['department'],                    // Département au lieu de la ville
            'signup_month' => date('Y-m', strtotime($userData['created_at'])),
            'purchases_count' => $userData['purchases_count']
        ];
    }

    /**
     * Généralise l'âge en tranche (technique de k-anonymat).
     */
    private function ageToRange(int $age): string
    {
        if ($age < 18) return 'moins de 18';
        if ($age < 25) return '18-24';
        if ($age < 35) return '25-34';
        if ($age < 45) return '35-44';
        if ($age < 55) return '45-54';
        return '55+';
    }
}

// Utilisation
$pseudonymizer = new Pseudonymizer('clé_secrète_stockée_dans_vault');

$user = [
    'email' => 'jean.dupont@example.com',
    'age' => 32,
    'department' => '69',
    'created_at' => '2024-06-15',
    'purchases_count' => 12
];

$anonymized = $pseudonymizer->exportForAnalytics($user);
// Résultat :
// [
//     'pseudo_id' => 'a8f3b2...', (hash irréversible sans la clé)
//     'age_range' => '25-34',
//     'city' => '69',
//     'signup_month' => '2024-06',
//     'purchases_count' => 12
// ]
```

**Résultat attendu** : Les données exportées ne contiennent plus d'identifiants directs. L'âge est généralisé en tranches et l'e-mail est remplacé par un pseudonyme hashé.

---

## Commandes Utiles

| Outil | Description |
| ----- | ----------- |
| `tarteaucitron.js` | Bibliothèque JavaScript open source de gestion des cookies (conforme CNIL) |
| `Matomo` | Alternative à Google Analytics respectueuse de la vie privée |
| `OWASP ZAP` | Scanner de sécurité pour détecter les fuites de données |
| `php artisan db:seed --class=GdprSeeder` | Exemple de commande pour générer des données de test anonymisées (Laravel) |
| `npx cypress run --spec "cookie-consent"` | Tester automatiquement la bannière de cookies |

---

## Pièges Fréquents

### Piège 1 : Stocker le consentement uniquement dans un cookie

⚠️ **Problème** : Si l'utilisateur efface ses cookies, la preuve du consentement disparaît.

✅ **Solution** : Stocker le consentement en base de données côté serveur, avec la date, la version de la politique et les choix effectués. Le cookie côté client sert uniquement à ne pas réafficher la bannière.

---

### Piège 2 : Charger les scripts analytics avant le consentement

⚠️ **Problème** : Google Analytics (ou tout autre outil de tracking) est chargé dans le `<head>` de la page, avant même que l'utilisateur ait vu la bannière.

✅ **Solution** : Ne charger les scripts de tracking qu'après avoir vérifié que l'utilisateur a donné son consentement. Utiliser un gestionnaire de consentement qui bloque les scripts par défaut.

```html
<!-- NON CONFORME : script chargé avant consentement -->
<script src="https://www.googletagmanager.com/gtag/js"></script>

<!-- CONFORME : chargement conditionnel -->
<script>
  if (CookieConsent.getConsent()?.choices?.analytics) {
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js';
    document.head.appendChild(script);
  }
</script>
```

---

### Piège 3 : Le soft delete qui ne supprime rien

⚠️ **Problème** : Implémenter un `deleted_at` mais garder toutes les données personnelles intactes dans la base.

✅ **Solution** : Le soft delete doit anonymiser les données personnelles, pas simplement marquer la ligne comme supprimée. L'utilisateur attend que ses données disparaissent réellement.

---

### Piège 4 : Exposer des données personnelles dans les URLs

⚠️ **Problème** : Des URL du type `/users/jean.dupont@example.com/profile` exposent l'e-mail dans les logs serveur, l'historique du navigateur et les rapports analytics.

✅ **Solution** : Utiliser des identifiants techniques (UUID) dans les URL : `/users/a8f3b2c1-4d5e-6f7a/profile`.

---

### Piège 5 : Oublier les données dans les backups

⚠️ **Problème** : L'utilisateur demande la suppression de ses données, mais celles-ci restent dans les sauvegardes pendant des mois ou des années.

✅ **Solution** : Documenter la politique de rétention des backups. Informer l'utilisateur que ses données peuvent subsister dans les sauvegardes pendant une durée définie (par exemple 30 jours) avant d'être purgées par rotation.

---

## Checklist de Validation

- [ ] Je sais expliquer le Privacy by Design et le Privacy by Default
- [ ] Je sais concevoir un formulaire qui respecte la minimisation des données
- [ ] Je sais concevoir un schéma de base de données avec traçabilité du consentement
- [ ] Je sais implémenter une bannière de cookies conforme aux recommandations CNIL
- [ ] Je sais implémenter le droit à l'effacement avec anonymisation
- [ ] Je sais masquer les données personnelles dans les logs
- [ ] Je connais la différence entre anonymisation et pseudonymisation
- [ ] Je sais que les scripts de tracking ne doivent pas se charger avant le consentement

---

## Exercice Pratique

**Énoncé** : Tu développes un site de petites annonces. Les utilisateurs peuvent créer un compte, publier des annonces et contacter d'autres utilisateurs. Conçois l'architecture RGPD de ce site.

**Indications** :

1. Liste les données personnelles collectées et justifie chacune (finalité + base légale)
2. Conçois le schéma SQL des tables `users` et `consent_logs`
3. Écris le code JavaScript d'une bannière de cookies avec 3 catégories (essentiels, analytics, publicité)
4. Écris le code PHP de la fonction de suppression de compte (anonymisation des données + conservation des annonces déjà publiées sous forme anonymisée)

**Résultat attendu** : Un dossier complet couvrant la minimisation, le consentement, le droit à l'effacement et les cookies.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**1. Données collectées et justification** :

| Donnée | Finalité | Base légale | Obligatoire ? |
| ------ | -------- | ----------- | ------------- |
| E-mail | Création de compte et notifications | Contrat | Oui |
| Mot de passe (hashé) | Authentification | Contrat | Oui |
| Pseudo | Affichage sur les annonces | Contrat | Oui |
| Ville | Localisation des annonces | Contrat | Oui |
| Téléphone | Contact entre utilisateurs | Consentement | Non |
| Photo de profil | Personnalisation | Consentement | Non |

**2. Schéma SQL** :

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    pseudo VARCHAR(50) NOT NULL,
    city VARCHAR(100),
    phone VARCHAR(20),                          -- Optionnel, consentement requis
    profile_photo_url VARCHAR(500),             -- Optionnel
    phone_consent BOOLEAN DEFAULT FALSE,
    phone_consent_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE consent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    consent_type VARCHAR(50) NOT NULL,
    granted BOOLEAN NOT NULL,
    ip_address INET,
    user_agent TEXT,
    policy_version VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**3. Bannière de cookies** :

```javascript
const CookieManager = {
  init() {
    if (!localStorage.getItem("cookie_consent")) {
      document.getElementById("cookie-banner").style.display = "block";
    } else {
      this.applyChoices(JSON.parse(localStorage.getItem("cookie_consent")));
    }
  },

  acceptAll() {
    this.save({ essential: true, analytics: true, ads: true });
  },

  refuseAll() {
    this.save({ essential: true, analytics: false, ads: false });
  },

  saveCustom() {
    this.save({
      essential: true,
      analytics: document.getElementById("ck-analytics").checked,
      ads: document.getElementById("ck-ads").checked
    });
  },

  save(choices) {
    const data = { choices, date: new Date().toISOString(), version: "v1.0" };
    localStorage.setItem("cookie_consent", JSON.stringify(data));
    this.applyChoices(choices);
    document.getElementById("cookie-banner").style.display = "none";
  },

  applyChoices(choices) {
    if (choices.analytics) {
      // Charger Matomo ou autre outil analytics
    }
    if (choices.ads) {
      // Charger les scripts publicitaires
    }
  }
};

document.addEventListener("DOMContentLoaded", () => CookieManager.init());
```

**4. Suppression de compte** :

```php
<?php

class AccountDeletionService
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function deleteAccount(string $userId): void
    {
        $this->db->beginTransaction();

        try {
            // Anonymiser le profil utilisateur
            $this->db->prepare("
                UPDATE users SET
                    email = CONCAT('deleted_', id, '@anonymized.local'),
                    password_hash = 'DELETED',
                    pseudo = 'Utilisateur supprimé',
                    city = NULL,
                    phone = NULL,
                    profile_photo_url = NULL,
                    deleted_at = NOW()
                WHERE id = :id
            ")->execute(['id' => $userId]);

            // Anonymiser les annonces (on les conserve pour l'historique du site)
            $this->db->prepare("
                UPDATE listings SET
                    author_name = 'Utilisateur supprimé',
                    contact_info = NULL
                WHERE user_id = :id
            ")->execute(['id' => $userId]);

            // Supprimer les messages privés
            $this->db->prepare("
                DELETE FROM messages WHERE sender_id = :id OR recipient_id = :id
            ")->execute(['id' => $userId]);

            // Supprimer les consentements
            $this->db->prepare("
                DELETE FROM consent_logs WHERE user_id = :id
            ")->execute(['id' => $userId]);

            // Journaliser
            $this->db->prepare("
                INSERT INTO deletion_logs (user_id, deleted_at, reason)
                VALUES (:id, NOW(), 'Demande utilisateur art. 17 RGPD')
            ")->execute(['id' => $userId]);

            $this->db->commit();
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
}
```

---

## Navigation

← Fiche précédente : **[Introduction au RGPD](01-introduction-rgpd.md)**

→ Fiche suivante : **[Sécurité des données personnelles](03-securite-donnees.md)**
