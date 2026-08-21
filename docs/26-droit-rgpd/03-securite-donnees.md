---
tags:
  - Droit
  - Intermédiaire
  - Pratique
description: "Sécurité des données personnelles : chiffrement, hashing, pseudonymisation, journalisation et notification de violation"
estimated_time: "60 min"
fiche_number: 3
total_fiches: 4
cursus: "Droit et RGPD"
id: "transversal.gdpr.securite-donnees"
course_id: "transversal.gdpr"
content_type: "lesson"
order: 3
---

# 03 - Sécurité des données personnelles

> **En bref** : Cette fiche couvre les mesures techniques de sécurité exigées par le RGPD : chiffrement au repos et en transit, hashing des mots de passe, pseudonymisation technique, journalisation des accès et procédure de notification en cas de violation de données. Lecture estimée : 60 min.


!!! warning "Périmètre"
    Cette fiche est pédagogique. Elle **ne constitue pas** un conseil juridique. Pour une conformité réelle, consulte un juriste ou un DPO.

## Prérequis

- Avoir lu la fiche [01 - Introduction au RGPD](01-introduction-rgpd.md) (principes fondamentaux)
- Avoir lu la fiche [02 - RGPD pour développeurs](02-rgpd-pour-developpeurs.md) (privacy by design, minimisation)
- Connaissances de base en développement web (PHP ou JavaScript)
- Notions de base sur les protocoles réseau (HTTP/HTTPS)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras implémenter les mesures de sécurité techniques exigées par le RGPD : chiffrer les données, hasher correctement les mots de passe, pseudonymiser les données, journaliser les accès et gérer une violation de données.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le chiffrement ?

**Définition** : Le chiffrement est un processus qui transforme des données lisibles (texte clair) en données illisibles (texte chiffré) à l'aide d'une clé. Seul le détenteur de la clé de déchiffrement peut retrouver les données originales.

**Le problème que le chiffrement résout** :

Sans chiffrement, voici les problèmes rencontrés :

1. **Interception en transit** : Un attaquant sur le réseau peut lire les données échangées entre le navigateur et le serveur.

2. **Vol de données au repos** : Si un disque dur ou une base de données est volé, toutes les données sont lisibles.

3. **Non-conformité RGPD** : L'article 32 exige des mesures techniques appropriées pour protéger les données personnelles.

**Comment le chiffrement résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Interception en transit | HTTPS (TLS) chiffre les communications |
| Vol de données au repos | Chiffrement de la base de données ou des fichiers |
| Non-conformité | Le chiffrement est une mesure technique reconnue par le RGPD |

**Analogie concrète** : Le chiffrement est comme un coffre-fort. Tu mets tes documents importants dans le coffre et tu le verrouilles avec une clé. Même si quelqu'un vole le coffre, il ne peut pas lire les documents sans la clé. Le chiffrement en transit, c'est comme envoyer un colis dans un coffre-fort verrouillé plutôt qu'en carte postale lisible par tous.

**Les deux types de chiffrement à connaître** :

| Type | Chiffrement en transit | Chiffrement au repos |
| ---- | ---------------------- | -------------------- |
| Objectif | Protéger les données pendant le transfert | Protéger les données stockées |
| Technologie | TLS 1.3 (HTTPS) | AES-256, luks, BitLocker |
| Quand | Communication navigateur-serveur, API | Base de données, fichiers, backups |
| Exemple | Formulaire de connexion via HTTPS | Colonne "email" chiffrée dans PostgreSQL |

---

### Qu'est-ce que le hashing ?

**Définition** : Le hashing est une transformation à sens unique qui convertit une donnée en une empreinte fixe (hash). Contrairement au chiffrement, le hashing est irréversible : on ne peut pas retrouver la donnée originale à partir du hash.

**Le problème que le hashing résout** :

Sans hashing, voici les problèmes rencontrés :

1. **Mots de passe en clair** : Si la base de données est compromise, tous les mots de passe sont lisibles.

2. **Attaques par tables arc-en-ciel** : Des dictionnaires pré-calculés permettent de retrouver les mots de passe hashés avec des algorithmes faibles.

3. **Réutilisation de mots de passe** : Si un utilisateur utilise le même mot de passe partout, une fuite compromet tous ses comptes.

**Comment le hashing résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Mots de passe en clair | Le hash stocké est illisible, le mot de passe original est inconnu |
| Tables arc-en-ciel | Les algorithmes modernes (bcrypt, argon2) utilisent un sel unique par hash |
| Réutilisation | Le même mot de passe produit des hashs différents grâce au sel |

**Ce que le hashing n'est PAS** :

- Le hashing n'est pas du chiffrement. Le chiffrement est réversible (on peut déchiffrer), le hashing est irréversible.
- MD5 et SHA-1 ne sont pas des algorithmes de hashing de mots de passe. Ils sont trop rapides et vulnérables aux attaques par force brute.

**Comparaison des algorithmes de hashing** :

| Algorithme | Sécurité | Performance | Recommandé ? |
| ---------- | -------- | ----------- | ------------ |
| MD5 | Très faible | Très rapide | Non, jamais pour les mots de passe |
| SHA-256 | Moyenne | Rapide | Non, pas conçu pour les mots de passe |
| bcrypt | Bonne | Lent (configurable) | Oui |
| Argon2id | Excellente | Lent, utilise beaucoup de mémoire | Oui (recommandé OWASP 2024) |

**Analogie concrète** : Le hashing est comme une empreinte digitale. À partir de ton doigt, on peut créer une empreinte. Mais à partir de l'empreinte, on ne peut pas recréer ton doigt. Pour vérifier ton identité, on compare ta nouvelle empreinte avec celle enregistrée.

---

### Qu'est-ce que la pseudonymisation technique ?

**Définition** : La pseudonymisation technique consiste à remplacer les identifiants directs (nom, e-mail) par des identifiants artificiels (pseudonymes) tout en conservant la possibilité de ré-identifier les personnes si nécessaire.

**Le problème que la pseudonymisation résout** :

Sans pseudonymisation, voici les problèmes rencontrés :

1. **Exposition maximale** : En cas de fuite, toutes les données sont directement identifiantes.

2. **Analyse impossible sans accès aux données brutes** : Les équipes d'analyse doivent accéder aux données personnelles réelles.

**Comment la pseudonymisation résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Exposition maximale | Les données pseudonymisées ne révèlent pas directement l'identité |
| Analyse et données brutes | Les équipes travaillent sur des pseudonymes, seuls les responsables autorisés détiennent la clé de correspondance |

**Point RGPD important** : La pseudonymisation est encouragée par le RGPD (article 25 et considérant 28) comme mesure de sécurité, mais les données pseudonymisées restent des données personnelles au sens du règlement. La clé de correspondance doit être stockée séparément et protégée.

---

### Qu'est-ce que la journalisation des accès ?

**Définition** : La journalisation (logging) des accès aux données personnelles consiste à enregistrer qui a accédé à quelles données, quand et dans quel but. C'est une mesure de traçabilité exigée par le RGPD.

**Le problème que la journalisation résout** :

Sans journalisation, voici les problèmes rencontrés :

1. **Accès non détectés** : Impossible de savoir si un employé a consulté des données sans autorisation.

2. **Enquête impossible** : En cas de violation, impossible de retracer ce qui s'est passé.

3. **Non-conformité** : Le principe de responsabilité (accountability) exige de pouvoir démontrer que les accès sont contrôlés.

**Comment la journalisation résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Accès non détectés | Chaque accès est enregistré et peut déclencher une alerte |
| Enquête impossible | Les logs permettent de reconstituer la chronologie |
| Non-conformité | Les logs constituent une preuve de contrôle |

**Ce qu'il faut journaliser** :

| Événement | Données à enregistrer |
| --------- | --------------------- |
| Connexion réussie | Identifiant utilisateur, date/heure, IP (masquée) |
| Connexion échouée | Identifiant tenté, date/heure, IP (masquée) |
| Consultation de données personnelles | Identifiant de l'administrateur, type de donnée consultée, date/heure |
| Export de données | Identifiant, volume exporté, date/heure |
| Modification de données | Identifiant, champs modifiés (sans les valeurs), date/heure |
| Suppression de données | Identifiant, type de donnée supprimée, date/heure |

**Attention** : Les logs eux-mêmes ne doivent pas contenir de données personnelles identifiantes (voir la fiche précédente sur le masquage des données dans les logs).

---

### Qu'est-ce qu'une violation de données ?

**Définition** : Une violation de données personnelles est un incident de sécurité qui entraîne, de manière accidentelle ou illicite, la destruction, la perte, l'altération, la divulgation non autorisée ou l'accès non autorisé à des données personnelles.

**Les 3 types de violation** :

| Type | Définition | Exemple |
| ---- | ---------- | ------- |
| Violation de confidentialité | Accès non autorisé aux données | Un pirate accède à la base clients |
| Violation d'intégrité | Altération non autorisée des données | Un bug corrompt les adresses e-mail |
| Violation de disponibilité | Perte d'accès aux données | Un ransomware chiffre la base de données |

**Procédure de notification (article 33 et 34)** :

<div class="diagram-design">
<p><a href="../../diagrams/26-droit-rgpd-03-securite-donnees-1.html">Qu&#x27;est-ce qu&#x27;une violation de données ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/26-droit-rgpd-03-securite-donnees-1.html" title="Qu&#x27;est-ce qu&#x27;une violation de données ?" style="width:100%;min-height:700px;border:0;background:transparent"></iframe>
</div>

**Délais et obligations** :

| Action | Délai | Destinataire |
| ------ | ----- | ------------ |
| Documentation interne | Immédiat | Registre interne des violations |
| Notification à la CNIL | 72 heures **si la violation est susceptible d'engendrer un risque** (art. 33) | CNIL (via téléservice en ligne) |
| Notification aux personnes | Dans les meilleurs délais | Personnes concernées (si risque élevé) |

---

### Les mesures techniques et organisationnelles

**Définition** : L'article 32 du RGPD exige la mise en place de mesures techniques et organisationnelles appropriées pour garantir un niveau de sécurité adapté au risque.

**Vue d'ensemble des mesures** :

| Catégorie | Mesures techniques | Mesures organisationnelles |
| --------- | ------------------ | -------------------------- |
| Confidentialité | Chiffrement, contrôle d'accès | Politique de mots de passe, sensibilisation |
| Intégrité | Hashing, signatures numériques | Procédures de validation, revue de code |
| Disponibilité | Backups, redondance | Plan de continuité, tests de restauration |
| Traçabilité | Journalisation, monitoring | Procédure d'alerte, audit régulier |

---

## Étapes Pratiques

### Étape 1 : Configurer HTTPS (chiffrement en transit)

La première mesure de sécurité est de s'assurer que toutes les communications sont chiffrées via HTTPS.

**Configuration Nginx avec TLS** :

```nginx
server {
    listen 80;
    server_name example.com;

    # Rediriger tout le trafic HTTP vers HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name example.com;

    # Certificat TLS (Let's Encrypt recommandé)
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # Configuration TLS sécurisée
    ssl_protocols TLSv1.2 TLSv1.3;           # Désactiver TLS 1.0 et 1.1
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;

    # En-têtes de sécurité
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;

    # Application
    location / {
        proxy_pass http://127.0.0.1:8080;
    }
}
```

**Résultat attendu** : Toutes les requêtes HTTP sont redirigées vers HTTPS. Le navigateur affiche un cadenas dans la barre d'adresse.

---

### Étape 2 : Hasher correctement les mots de passe

**Avec PHP (bcrypt)** :

```php
<?php

// CRÉATION DU HASH (à l'inscription)
$password = 'mot_de_passe_utilisateur';

// password_hash utilise bcrypt par défaut avec un sel automatique
// Le coût (cost) détermine la lenteur du hashing (12 est un bon compromis)
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

// Le hash ressemble à : $2y$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW
// Il contient : l'algorithme ($2y$), le coût (12$), le sel et le hash

// VÉRIFICATION (à la connexion)
$passwordFromForm = 'mot_de_passe_utilisateur';

if (password_verify($passwordFromForm, $hash)) {
    echo "Mot de passe correct";
} else {
    echo "Mot de passe incorrect";
}

// MISE À JOUR si l'algorithme ou le coût a changé
if (password_needs_rehash($hash, PASSWORD_BCRYPT, ['cost' => 13])) {
    // Le coût a été augmenté, on re-hashe avec le nouveau paramètre
    $newHash = password_hash($passwordFromForm, PASSWORD_BCRYPT, ['cost' => 13]);
    // Sauvegarder $newHash en base de données
}
```

**Avec PHP (Argon2id - recommandé)** :

```php
<?php

// Argon2id est l'algorithme recommandé par OWASP en 2024
// Il résiste aux attaques par GPU et par canal auxiliaire

$hash = password_hash($password, PASSWORD_ARGON2ID, [
    'memory_cost' => 65536,    // 64 Mo de mémoire
    'time_cost' => 4,          // 4 itérations
    'threads' => 3             // 3 threads parallèles
]);

// La vérification est identique
if (password_verify($passwordFromForm, $hash)) {
    echo "Mot de passe correct";
}
```

**Avec JavaScript (bcrypt via la bibliothèque bcryptjs)** :

```javascript
// Installation : npm install bcryptjs
const bcrypt = require('bcryptjs');

// CRÉATION DU HASH (à l'inscription)
const password = 'mot_de_passe_utilisateur';
const saltRounds = 12;    // Nombre de tours de salage

// Version asynchrone (recommandée)
const hash = await bcrypt.hash(password, saltRounds);
// Résultat : $2a$12$LJ3m4ys...

// VÉRIFICATION (à la connexion)
const isValid = await bcrypt.compare(password, hash);
if (isValid) {
  console.log('Mot de passe correct');
} else {
  console.log('Mot de passe incorrect');
}
```

**Ce qu'il ne faut JAMAIS faire** :

```php
<?php

// JAMAIS : stocker le mot de passe en clair
$query = "INSERT INTO users (email, password) VALUES ('user@example.com', 'motdepasse123')";

// JAMAIS : utiliser MD5 ou SHA-1
$hash = md5($password);           // Craqué en quelques secondes
$hash = sha1($password);          // Vulnérable aux attaques par collision

// JAMAIS : hashing maison
$hash = sha256($password . 'mon_sel_secret');  // Le sel est identique pour tous les utilisateurs
```

**Résultat attendu** : Les mots de passe sont hashés avec bcrypt (coût >= 12) ou Argon2id. La vérification utilise `password_verify()`, jamais de comparaison directe de hashs.

---

### Étape 3 : Chiffrer des données au repos

```php
<?php

// Chiffrement AES-256-GCM pour les données sensibles en base
// Exemple : chiffrer un numéro de sécurité sociale

class DataEncryptor
{
    private string $key;

    public function __construct(string $encryptionKey)
    {
        // La clé doit faire 32 octets pour AES-256
        // Stockée dans une variable d'environnement, JAMAIS dans le code
        $this->key = $encryptionKey;
    }

    /**
     * Chiffre une donnée avec AES-256-GCM.
     * Retourne le texte chiffré encodé en base64 avec le nonce et le tag.
     */
    public function encrypt(string $plaintext): string
    {
        $nonce = random_bytes(12);             // Nonce unique pour chaque chiffrement
        $tag = '';                              // Tag d'authentification

        $ciphertext = openssl_encrypt(
            $plaintext,
            'aes-256-gcm',
            $this->key,
            OPENSSL_RAW_DATA,
            $nonce,
            $tag
        );

        // On stocke nonce + tag + ciphertext ensemble
        return base64_encode($nonce . $tag . $ciphertext);
    }

    /**
     * Déchiffre une donnée chiffrée avec AES-256-GCM.
     */
    public function decrypt(string $encoded): string
    {
        $data = base64_decode($encoded);

        $nonce = substr($data, 0, 12);         // 12 premiers octets = nonce
        $tag = substr($data, 12, 16);          // 16 octets suivants = tag
        $ciphertext = substr($data, 28);       // Le reste = texte chiffré

        $plaintext = openssl_decrypt(
            $ciphertext,
            'aes-256-gcm',
            $this->key,
            OPENSSL_RAW_DATA,
            $nonce,
            $tag
        );

        if ($plaintext === false) {
            throw new \RuntimeException('Échec du déchiffrement');
        }

        return $plaintext;
    }
}

// Utilisation
$key = getenv('ENCRYPTION_KEY');               // Clé stockée dans l'environnement
$encryptor = new DataEncryptor($key);

// Chiffrement
$encrypted = $encryptor->encrypt('1 85 12 75 108 042 33');
// Résultat : "dGhpcyBpcyBhbiBlbmNyeXB0ZWQ=" (base64)

// Déchiffrement
$decrypted = $encryptor->decrypt($encrypted);
// Résultat : "1 85 12 75 108 042 33"
```

**Résultat attendu** : Les données sensibles (numéro de sécurité sociale, coordonnées bancaires) sont chiffrées en base de données. La clé de chiffrement est stockée séparément (variable d'environnement ou gestionnaire de secrets).

---

### Étape 4 : Journaliser les accès aux données personnelles

```php
<?php

// Journalisation des accès aux données personnelles
// Chaque consultation, modification ou export doit être tracé

class AuditLogger
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Enregistre un accès aux données personnelles.
     */
    public function logAccess(
        string $adminId,      // Qui a accédé
        string $action,       // Quel type d'action (view, edit, export, delete)
        string $dataType,     // Quel type de donnée (user_profile, email, etc.)
        string $targetId,     // L'identifiant de la donnée concernée
        ?string $details = null
    ): void {
        $stmt = $this->db->prepare("
            INSERT INTO audit_logs
                (admin_id, action, data_type, target_id, details, created_at)
            VALUES
                (:admin_id, :action, :data_type, :target_id, :details, NOW())
        ");

        $stmt->execute([
            'admin_id' => $adminId,
            'action' => $action,
            'data_type' => $dataType,
            'target_id' => $targetId,
            'details' => $details
        ]);
    }

    /**
     * Vérifie si un utilisateur a des accès suspects.
     * Exemple : plus de 50 consultations de profils en une heure.
     */
    public function detectSuspiciousActivity(string $adminId): bool
    {
        $stmt = $this->db->prepare("
            SELECT COUNT(*) as count
            FROM audit_logs
            WHERE admin_id = :admin_id
              AND action = 'view'
              AND created_at > NOW() - INTERVAL '1 hour'
        ");
        $stmt->execute(['admin_id' => $adminId]);
        $result = $stmt->fetch();

        return $result['count'] > 50;    // Seuil d'alerte
    }
}

// Schéma de la table audit_logs
// CREATE TABLE audit_logs (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     admin_id VARCHAR(100) NOT NULL,
//     action VARCHAR(20) NOT NULL,
//     data_type VARCHAR(50) NOT NULL,
//     target_id VARCHAR(100) NOT NULL,
//     details TEXT,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// CREATE INDEX idx_audit_admin ON audit_logs(admin_id, created_at);
```

**Résultat attendu** : Chaque accès aux données personnelles est tracé. Les accès suspects déclenchent une alerte. Les logs d'audit sont conservés séparément des logs applicatifs.

---

### Étape 5 : Documenter la procédure de notification de violation

Voici un modèle de procédure à implémenter dans ton organisation :

```text
PROCÉDURE DE NOTIFICATION DE VIOLATION DE DONNÉES

1. DÉTECTION (immédiat)
   - L'employé qui détecte la violation alerte le DPO (ou le responsable)
   - Le DPO ouvre un ticket d'incident

2. ÉVALUATION (dans les 24 premières heures)
   - Nature de la violation (confidentialité, intégrité, disponibilité)
   - Catégories de données concernées
   - Nombre de personnes concernées (estimation)
   - Conséquences probables pour les personnes
   - Mesures correctives prises ou envisagées

3. NOTIFICATION CNIL (sous 72h si risque)
   Informations obligatoires :
   - Nature de la violation
   - Catégories et nombre approximatif de personnes concernées
   - Nom et coordonnées du DPO
   - Conséquences probables
   - Mesures prises pour remédier à la violation

4. NOTIFICATION DES PERSONNES (si risque élevé)
   - Communication claire et en langage simple
   - Description de la nature de la violation
   - Recommandations pour se protéger (changement de mot de passe, etc.)
   - Coordonnées du DPO

5. DOCUMENTATION
   - Consigner la violation dans le registre interne
   - Documenter les mesures correctives
   - Planifier les actions préventives
```

**Résultat attendu** : Un document de procédure clair, accessible à toute l'équipe, avec les délais et responsabilités définis.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `openssl rand -base64 32` | Générer une clé de chiffrement AES-256 |
| `openssl s_client -connect example.com:443` | Vérifier le certificat TLS d'un serveur |
| `certbot --nginx -d example.com` | Installer un certificat Let's Encrypt avec Nginx |
| `php -r "echo password_hash('test', PASSWORD_BCRYPT, ['cost' => 12]);"` | Tester le hashing bcrypt en PHP |
| `node -e "console.log(require('bcryptjs').hashSync('test', 12))"` | Tester le hashing bcrypt en JavaScript |

---

## Pièges Fréquents

### Piège 1 : Utiliser MD5 ou SHA-1 pour les mots de passe

⚠️ **Problème** : MD5 et SHA-1 sont des fonctions de hashing rapides, conçues pour la vérification d'intégrité de fichiers. Leur rapidité les rend vulnérables aux attaques par force brute (des milliards de tentatives par seconde).

✅ **Solution** : Utiliser exclusivement bcrypt (coût >= 12) ou Argon2id pour les mots de passe. Ces algorithmes sont volontairement lents pour résister aux attaques.

---

### Piège 2 : Stocker la clé de chiffrement avec les données chiffrées

⚠️ **Problème** : Chiffrer les données mais stocker la clé dans le même fichier de configuration ou la même base de données annule la protection.

✅ **Solution** : La clé de chiffrement doit être stockée séparément des données : variable d'environnement, gestionnaire de secrets (HashiCorp Vault, AWS KMS) ou fichier de configuration non versionné et avec des permissions restrictives.

---

### Piège 3 : Journaliser les données personnelles dans les logs d'audit

⚠️ **Problème** : Les logs d'audit contiennent les valeurs des données consultées ("L'admin a consulté l'e-mail `jean.dupont@example.com`").

✅ **Solution** : Les logs doivent enregistrer l'identifiant de la donnée, pas sa valeur. Écrire "L'admin A a consulté le profil de l'utilisateur U-12345" et non "L'admin a consulté `jean.dupont@example.com`".

---

### Piège 4 : Ne pas tester les sauvegardes

⚠️ **Problème** : Des sauvegardes sont effectuées régulièrement mais n'ont jamais été testées. Le jour d'un incident, la restauration échoue.

✅ **Solution** : Tester la restauration des sauvegardes au moins une fois par trimestre. Documenter la procédure et mesurer le temps de restauration.

---

### Piège 5 : Ignorer le délai de 72 heures

⚠️ **Problème** : L'équipe technique corrige la faille en silence sans notifier la CNIL, pensant que le problème est résolu.

✅ **Solution** : L'article 33 n'oblige la notification à la CNIL que si la violation est **susceptible d'engendrer un risque** pour les personnes. Corriger la faille n'annule pas cette obligation lorsqu'elle existe. Le délai de 72 heures court à partir de la prise de connaissance, pas de la résolution. Documente toujours l'incident (art. 33.5), même sans notification.

---

## Checklist de Validation

- [ ] Je sais expliquer la différence entre chiffrement et hashing
- [ ] Je sais configurer HTTPS avec TLS 1.2 ou 1.3
- [ ] Je sais hasher un mot de passe avec bcrypt ou Argon2id
- [ ] Je sais pourquoi MD5 et SHA-1 sont inappropriés pour les mots de passe
- [ ] Je sais chiffrer des données au repos avec AES-256-GCM
- [ ] Je sais que la clé de chiffrement doit être stockée séparément des données
- [ ] Je sais journaliser les accès aux données personnelles sans exposer les données
- [ ] Je connais la procédure de notification de violation (72h pour la CNIL)
- [ ] Je connais les 3 types de violation de données

---

## Exercice Pratique

**Énoncé** : Tu es développeur dans une entreprise qui gère un service en ligne avec 10 000 utilisateurs. Un matin, tu découvres qu'un accès non autorisé a permis à un attaquant de télécharger la table `users` de la base de données. Cette table contient : e-mail, mot de passe hashé (MD5 sans sel), nom, prénom, date de naissance et adresse postale.

**Indications** :

1. Classe cette violation (confidentialité, intégrité, disponibilité)
2. Évalue le niveau de risque pour les personnes concernées
3. Rédige la notification à la CNIL (les informations obligatoires)
4. Rédige le message de notification aux utilisateurs
5. Liste les mesures correctives immédiates et à moyen terme

**Résultat attendu** : Un dossier complet de gestion de la violation, avec les notifications et le plan de remédiation.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**1. Classification de la violation** :

- **Type** : Violation de confidentialité (accès non autorisé et exfiltration de données)
- La disponibilité et l'intégrité ne sont pas affectées (les données sont toujours en place et non modifiées)

**2. Évaluation du risque** :

Le risque est **élevé** pour les personnes concernées :

| Facteur de risque | Évaluation |
| ----------------- | ---------- |
| Nature des données | Identification directe (nom, prénom, e-mail, adresse) |
| Mots de passe en MD5 sans sel | Craquables en quelques minutes par un attaquant |
| Volume | 10 000 personnes |
| Combinaison des données | Usurpation d'identité possible (nom + adresse + date de naissance) |
| Réutilisation de mots de passe | Accès probable aux autres comptes des utilisateurs |

**Risque élevé** : notification CNIL **et** notification des personnes obligatoires.

**3. Notification CNIL** :

```text
NOTIFICATION DE VIOLATION DE DONNÉES PERSONNELLES

Date de détection : [date]
Date de notification : [date, dans les 72h]

Nature de la violation : Accès non autorisé à la base de données
via [vecteur d'attaque identifié].

Données concernées : Adresses e-mail, noms, prénoms, dates de naissance,
adresses postales et mots de passe hashés (MD5 sans sel).

Nombre de personnes concernées : environ 10 000.

Conséquences probables :
- Risque d'usurpation d'identité
- Risque de compromission de comptes sur d'autres services
  (réutilisation de mots de passe)
- Risque de phishing ciblé

Mesures prises :
- Fermeture de la faille d'accès
- Réinitialisation forcée de tous les mots de passe
- Migration de MD5 vers Argon2id
- Notification des personnes concernées

Contact DPO : [nom], [email], [téléphone]
```

**4. Notification aux utilisateurs** :

```text
Objet : Information importante concernant la sécurité de votre compte

Bonjour [Prénom],

Nous vous informons qu'un incident de sécurité a été détecté le [date].
Un accès non autorisé a permis la consultation de certaines données
de notre base d'utilisateurs, dont votre adresse e-mail, votre nom
et votre adresse postale.

Ce que nous avons fait :
- La faille a été corrigée immédiatement
- Votre mot de passe a été réinitialisé par précaution
- La CNIL a été notifiée

Ce que nous vous recommandons :
- Définir un nouveau mot de passe sur notre service (lien : ...)
- Changer votre mot de passe sur tout autre service où vous utilisez
  le même mot de passe
- Être vigilant face aux e-mails de phishing qui pourraient utiliser
  vos informations personnelles

Pour toute question, contactez notre DPO : [email]
Vous pouvez également adresser une réclamation à la CNIL (www.cnil.fr).

Cordialement,
[Nom de l'entreprise]
```

**5. Mesures correctives** :

| Délai | Mesure |
| ----- | ------ |
| Immédiat | Fermer la faille d'accès |
| Immédiat | Réinitialiser tous les mots de passe |
| 1 semaine | Migrer le hashing de MD5 vers Argon2id |
| 1 semaine | Mettre en place la journalisation des accès |
| 1 mois | Audit de sécurité complet de l'application |
| 1 mois | Chiffrement des données sensibles au repos |
| 3 mois | Test d'intrusion par un prestataire externe |
| En continu | Sensibilisation de l'équipe à la sécurité |

---

## Navigation

← Fiche précédente : **[RGPD pour développeurs](02-rgpd-pour-developpeurs.md)**

→ Fiche suivante : **[Conformité en pratique](04-conformite-pratique.md)**
