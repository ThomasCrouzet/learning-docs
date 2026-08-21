---
tags:
  - Systèmes
  - Avancé
  - Concept
description: "Annuaire LDAP : comprendre OpenLDAP, l'arborescence DIT, les entrées, attributs et l'authentification centralisée."
estimated_time: "75 min"
fiche_number: 4
total_fiches: 9
cursus: "Services système"
id: "infrastructure.system-services.annuaire-ldap"
course_id: "infrastructure.system-services"
content_type: "lesson"
order: 4
---

# 04 - Annuaire LDAP

> **En bref** : Tu apprendras à comprendre et configurer un annuaire LDAP avec OpenLDAP, à créer une arborescence DIT, à gérer les entrées et attributs, et à mettre en place une authentification centralisée. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [Serveur de messagerie](03-serveur-mail.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer ce qu'est un annuaire LDAP et son utilité, configurer OpenLDAP dans un conteneur Docker, créer une arborescence (DIT) avec des unités organisationnelles et des utilisateurs, effectuer des recherches LDAP avec `ldapsearch`, et comprendre comment les applications utilisent LDAP pour l'authentification centralisée.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que LDAP ?

**Définition** : LDAP (Lightweight Directory Access Protocol) est un protocole standard pour accéder a un annuaire. Un annuaire LDAP stocke des informations structurees sur des personnes, des machines, des services ou toute autre entité, organisees dans une arborescence hierarchique.

**Le problème que LDAP résout** :

Sans annuaire centralise, voici les problèmes rencontres :

1. **Comptes dupliques** : Chaque application (mail, VPN, wiki, intranet) a sa propre base d'utilisateurs. Un employé a 10 mots de passe différents.
2. **Incoherence** : Quand un employé quitte l'entreprise, il faut supprimer son compte dans chaque application séparément. On en oublie toujours.
3. **Pas de recherche centralisée** : Pour trouver le numéro de telephone d'un collègue, tu dois chercher dans plusieurs systèmes différents.

**Comment LDAP résout ces problèmes** :

| Problème | Solution apportée par LDAP |
| --- | --- |
| Comptes dupliques | Un seul compte utilisateur pour toutes les applications. Chaque application interroge l'annuaire LDAP |
| Incoherence | Supprimer un utilisateur dans LDAP le desactive partout |
| Pas de recherche centralisée | L'annuaire LDAP centralise toutes les informations et permet des recherches rapides |

**Analogie concrète** : Un annuaire LDAP fonctionne comme un organigramme d'entreprise affiche dans le hall d'entrée. L'organigramme est organise en arborescence (direction -> départements -> équipes -> employés). Chaque personne a une fiche avec ses informations (nom, telephone, bureau, poste). N'importe qui peut consulter l'organigramme pour trouver un collègue. Et il n'y a qu'un seul organigramme a mettre a jour quand quelque chose change.

**Ce que LDAP n'est PAS** :

- LDAP n'est pas une base de données relationnelle. LDAP est optimise pour la lecture (recherche rapide) mais pas pour les ecritures fréquentes. Une base SQL est adaptee aux transactions et aux mises à jour fréquentes. LDAP est adapte aux données qui changent peu (comptes utilisateurs, informations d'entreprise).
- LDAP n'est pas Active Directory. Active Directory (Microsoft) utilise LDAP comme protocole d'accès, mais ajoute des fonctionnalités supplémentaires (GPO, Kerberos, DNS integre). OpenLDAP est une implementation open source du protocole LDAP.

**Comparaison LDAP vs base SQL** :

| LDAP | Base SQL |
| --- | --- |
| Optimise pour la lecture | Optimise pour la lecture et l'écriture |
| Données hierarchiques (arborescence) | Données relationnelles (tables) |
| Schéma flexible (objectClass) | Schéma rigide (colonnes) |
| Protocole standard (LDAP) | Protocole spécifique (SQL) |
| Idéal pour les annuaires et l'authentification | Idéal pour les données applicatives |

---

### L'arborescence DIT (Directory Information Tree)

**Définition** : Le DIT est la structure hierarchique de l'annuaire LDAP. Chaque élément de l'arborescence est appelé une entrée. Les entrées sont identifiees par un DN (Distinguished Name) unique.

**Structure typique d'un DIT** :

```text
dc=entreprise,dc=local          (racine du domaine)
├── ou=personnes                 (unite organisationnelle)
│   ├── uid=alice                (utilisateur)
│   └── uid=bob                  (utilisateur)
├── ou=groupes                   (unite organisationnelle)
│   ├── cn=developpeurs          (groupe)
│   └── cn=administrateurs       (groupe)
└── ou=machines                  (unite organisationnelle)
    └── cn=serveur-web           (machine)
```

**Les composants d'un DN** :

| Composant | Signification | Exemple |
| --- | --- | --- |
| dc | Domain Component | `dc=entreprise,dc=local` |
| ou | Organizational Unit | `ou=personnes` |
| cn | Common Name | `cn=developpeurs` |
| uid | User ID | `uid=alice` |

Le DN complet d'Alice est : `uid=alice,ou=personnes,dc=entreprise,dc=local`

Il se lit de gauche a droite (du plus spécifique au plus général), comme une adresse postale inversee : "Alice, dans le service Personnes, de l'entreprise locale".

---

### Les entrées et les attributs

**Définition** : Une entrée LDAP est un enregistrement dans l'annuaire. Chaque entrée possède un DN unique, un ou plusieurs objectClass (qui définissent les attributs autorises) et un ensemble d'attributs avec leurs valeurs.

**Exemple d'entrée utilisateur** :

```text
dn: uid=alice,ou=personnes,dc=entreprise,dc=local
objectClass: inetOrgPerson
objectClass: posixAccount
uid: alice
cn: Alice Martin
sn: Martin
givenName: Alice
mail: alice@entreprise.local
userPassword: {SSHA}xxxxxxxxxx
uidNumber: 1001
gidNumber: 1001
homeDirectory: /home/alice
loginShell: /bin/bash
```

**Les objectClass principaux** :

| objectClass | Usage | Attributs clés |
| --- | --- | --- |
| `top` | Classe de base obligatoire | Aucun attribut propre |
| `organization` | Racine de l'annuaire | `o` (nom de l'organisation) |
| `organizationalUnit` | Unité organisationnelle (département) | `ou` (nom de l'unité) |
| `inetOrgPerson` | Personne dans un annuaire | `cn`, `sn`, `mail`, `uid`, `userPassword` |
| `posixAccount` | Compte Unix/Linux | `uidNumber`, `gidNumber`, `homeDirectory` |
| `groupOfNames` | Groupe d'utilisateurs | `cn`, `member` |

---

### L'authentification centralisée avec LDAP

**Définition** : L'authentification centralisée via LDAP permet a toutes les applications d'un réseau de vérifier les identifiants d'un utilisateur auprès d'un seul annuaire, au lieu de gérer chacune sa propre base de comptes.

**Le processus d'authentification (bind)** :

```text
1. L'utilisateur saisit login/mot de passe dans l'application
2. L'application envoie une requete "bind" au serveur LDAP
   -> bind DN: uid=alice,ou=personnes,dc=entreprise,dc=local
   -> mot de passe: ********
3. Le serveur LDAP verifie le mot de passe
4. Si correct : reponse "bind successful" -> acces autorise
   Si incorrect : reponse "invalid credentials" -> acces refuse
```

**Applications qui supportent LDAP** :

- Serveurs de messagerie (Postfix, Dovecot)
- Serveurs web (Nginx, Apache via modules)
- VPN (OpenVPN)
- Wikis (MediaWiki, Gitea, Nextcloud)
- Outils de monitoring (Grafana, Zabbix)

---

## Étapes Pratiques

### Étape 1 : Démarrer OpenLDAP dans Docker

> **Note - image de démonstration** : L'image `osixia/openldap:1.5.0` utilisée ici est une image communautaire de 2021 (OpenLDAP 2.4.57), adaptée à l'apprentissage. Le dépôt d'origine a été migré vers `osixia/container-openldap` (activement maintenu). Ne l'utilise pas en production ; pour un environnement réel, préfère les paquets OpenLDAP officiels de ta distribution ou une image à jour issue de `osixia/container-openldap`.

```bash
# Cree le dossier de travail
mkdir -p ~/lab-ldap/{ldifs,data,config}

# Lance le conteneur OpenLDAP (image de demonstration)
docker run -d \
  --name lab-ldap \
  -p 3389:389 \
  -p 6636:636 \
  -e LDAP_ORGANISATION="Lab Entreprise" \
  -e LDAP_DOMAIN="lab.local" \
  -e LDAP_ADMIN_PASSWORD="admin123" \
  -v ~/lab-ldap/data:/var/lib/ldap \
  -v ~/lab-ldap/config:/etc/ldap/slapd.d \
  osixia/openldap:1.5.0
```

**Résultat attendu** :

```text
Unable to find image 'osixia/openldap:1.5.0' locally
...
Status: Downloaded newer image for osixia/openldap:1.5.0
```

Verifie que le conteneur fonctionne :

```bash
docker logs lab-ldap 2>&1 | tail -5
```

**Résultat attendu** :

```text
slapd starting
```

---

### Étape 2 : Vérifier la configuration initiale

L'image Docker créé automatiquement la racine du DIT. Verifie avec `ldapsearch` :

```bash
# Recherche la racine de l'annuaire
docker exec lab-ldap ldapsearch -x \
  -H ldap://localhost \
  -b "dc=lab,dc=local" \
  -D "cn=admin,dc=lab,dc=local" \
  -w admin123
```

**Résultat attendu** :

```text
# lab.local
dn: dc=lab,dc=local
objectClass: top
objectClass: dcObject
objectClass: organization
o: Lab Entreprise
dc: lab
```

Explication des options :

- `-x` : authentification simple (pas SASL)
- `-H ldap://localhost` : adresse du serveur LDAP
- `-b "dc=lab,dc=local"` : base de recherche (point de départ dans l'arborescence)
- `-D "cn=admin,dc=lab,dc=local"` : DN de l'administrateur (bind DN)
- `-w admin123` : mot de passe de l'administrateur

---

### Étape 3 : Créer les unités organisationnelles

Créé un fichier LDIF (LDAP Data Interchange Format) pour ajouter les OU :

```bash
# Fichier LDIF pour les unites organisationnelles
cat > ~/lab-ldap/ldifs/01-ous.ldif << 'EOF'
# Unite organisationnelle : personnes
dn: ou=personnes,dc=lab,dc=local
objectClass: organizationalUnit
ou: personnes

# Unite organisationnelle : groupes
dn: ou=groupes,dc=lab,dc=local
objectClass: organizationalUnit
ou: groupes

# Unite organisationnelle : machines
dn: ou=machines,dc=lab,dc=local
objectClass: organizationalUnit
ou: machines
EOF

# Ajoute les OU dans l'annuaire
docker exec lab-ldap ldapadd -x \
  -H ldap://localhost \
  -D "cn=admin,dc=lab,dc=local" \
  -w admin123 \
  -f /container/service/slapd/assets/test/01-ous.ldif
```

Comme le fichier est sur l'hôte, utilise cette méthode alternative :

```bash
# Injecte le fichier LDIF via stdin
docker exec -i lab-ldap ldapadd -x \
  -H ldap://localhost \
  -D "cn=admin,dc=lab,dc=local" \
  -w admin123 < ~/lab-ldap/ldifs/01-ous.ldif
```

**Résultat attendu** :

```text
adding new entry "ou=personnes,dc=lab,dc=local"

adding new entry "ou=groupes,dc=lab,dc=local"

adding new entry "ou=machines,dc=lab,dc=local"
```

---

### Étape 4 : Ajouter des utilisateurs

> **Bonne pratique - Hachage des mots de passe** : Les mots de passe LDIF doivent toujours être stockés sous forme hachée, jamais en clair. Sur l'image de démo OpenLDAP 2.4, `slappasswd` produit `{SSHA}` (SHA-1 salé) par défaut. SHA-1 n'est plus un choix moderne : OpenLDAP 2.5+ peut utiliser `{ARGON2}` via le module argon2. Pour ce labo 2.4, `{SSHA}` reste le schéma disponible sans module supplémentaire. Pour générer un hash SSHA, utilise `slappasswd` :
>
> ```bash
> # Genere un hash SSHA pour un mot de passe
> docker exec lab-ldap slappasswd -h {SSHA} -s alice123
> # Exemple de résultat : {SSHA}W6ph5Mm5Pz8GgiULbPgzG37mj9g=
> ```

```bash
# Genere les hashes SSHA pour les trois utilisateurs
HASH_ALICE=$(docker exec lab-ldap slappasswd -h {SSHA} -s alice123)
HASH_BOB=$(docker exec lab-ldap slappasswd -h {SSHA} -s bob123)
HASH_CHARLIE=$(docker exec lab-ldap slappasswd -h {SSHA} -s charlie123)

# Fichier LDIF pour les utilisateurs (mots de passe haches)
cat > ~/lab-ldap/ldifs/02-users.ldif << EOF
# Utilisateur Alice
dn: uid=alice,ou=personnes,dc=lab,dc=local
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: shadowAccount
uid: alice
cn: Alice Martin
sn: Martin
givenName: Alice
mail: alice@lab.local
userPassword: $HASH_ALICE
uidNumber: 1001
gidNumber: 1001
homeDirectory: /home/alice
loginShell: /bin/bash

# Utilisateur Bob
dn: uid=bob,ou=personnes,dc=lab,dc=local
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: shadowAccount
uid: bob
cn: Bob Dupont
sn: Dupont
givenName: Bob
mail: bob@lab.local
userPassword: $HASH_BOB
uidNumber: 1002
gidNumber: 1002
homeDirectory: /home/bob
loginShell: /bin/bash

# Utilisateur Charlie
dn: uid=charlie,ou=personnes,dc=lab,dc=local
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: shadowAccount
uid: charlie
cn: Charlie Durand
sn: Durand
givenName: Charlie
mail: charlie@lab.local
userPassword: $HASH_CHARLIE
uidNumber: 1003
gidNumber: 1003
homeDirectory: /home/charlie
loginShell: /bin/bash
EOF

# Ajoute les utilisateurs
docker exec -i lab-ldap ldapadd -x \
  -H ldap://localhost \
  -D "cn=admin,dc=lab,dc=local" \
  -w admin123 < ~/lab-ldap/ldifs/02-users.ldif
```

**Résultat attendu** :

```text
adding new entry "uid=alice,ou=personnes,dc=lab,dc=local"

adding new entry "uid=bob,ou=personnes,dc=lab,dc=local"

adding new entry "uid=charlie,ou=personnes,dc=lab,dc=local"
```

---

### Étape 5 : Ajouter un groupe

```bash
# Fichier LDIF pour un groupe
cat > ~/lab-ldap/ldifs/03-groups.ldif << 'EOF'
# Groupe developpeurs
dn: cn=developpeurs,ou=groupes,dc=lab,dc=local
objectClass: groupOfNames
cn: developpeurs
member: uid=alice,ou=personnes,dc=lab,dc=local
member: uid=bob,ou=personnes,dc=lab,dc=local

# Groupe administrateurs
dn: cn=administrateurs,ou=groupes,dc=lab,dc=local
objectClass: groupOfNames
cn: administrateurs
member: uid=charlie,ou=personnes,dc=lab,dc=local
EOF

# Ajoute les groupes
docker exec -i lab-ldap ldapadd -x \
  -H ldap://localhost \
  -D "cn=admin,dc=lab,dc=local" \
  -w admin123 < ~/lab-ldap/ldifs/03-groups.ldif
```

**Résultat attendu** :

```text
adding new entry "cn=developpeurs,ou=groupes,dc=lab,dc=local"

adding new entry "cn=administrateurs,ou=groupes,dc=lab,dc=local"
```

---

### Étape 6 : Rechercher dans l'annuaire

```bash
# Lister toutes les entrees
docker exec lab-ldap ldapsearch -x \
  -H ldap://localhost \
  -b "dc=lab,dc=local" \
  -D "cn=admin,dc=lab,dc=local" \
  -w admin123

# Rechercher uniquement les utilisateurs
docker exec lab-ldap ldapsearch -x \
  -H ldap://localhost \
  -b "ou=personnes,dc=lab,dc=local" \
  -D "cn=admin,dc=lab,dc=local" \
  -w admin123 \
  "(objectClass=inetOrgPerson)" \
  uid cn mail

# Rechercher un utilisateur specifique par uid
docker exec lab-ldap ldapsearch -x \
  -H ldap://localhost \
  -b "dc=lab,dc=local" \
  -D "cn=admin,dc=lab,dc=local" \
  -w admin123 \
  "(uid=alice)" \
  cn mail uidNumber
```

**Résultat attendu pour la recherche d'Alice** :

```text
# alice, personnes, lab.local
dn: uid=alice,ou=personnes,dc=lab,dc=local
cn: Alice Martin
mail: alice@lab.local
uidNumber: 1001
```

---

### Étape 7 : Tester l'authentification (bind)

```bash
# Teste l'authentification d'Alice (bind reussi)
docker exec lab-ldap ldapwhoami -x \
  -H ldap://localhost \
  -D "uid=alice,ou=personnes,dc=lab,dc=local" \
  -w alice123
```

**Résultat attendu** :

```text
dn:uid=alice,ou=personnes,dc=lab,dc=local
```

```bash
# Teste avec un mauvais mot de passe (bind echoue)
docker exec lab-ldap ldapwhoami -x \
  -H ldap://localhost \
  -D "uid=alice,ou=personnes,dc=lab,dc=local" \
  -w mauvais_mdp
```

**Résultat attendu** :

```text
ldap_bind: Invalid credentials (49)
```

---

### Étape 8 : Modifier une entrée

```bash
# Fichier LDIF pour modifier l'email d'Alice
cat > ~/lab-ldap/ldifs/04-modify.ldif << 'EOF'
dn: uid=alice,ou=personnes,dc=lab,dc=local
changetype: modify
replace: mail
mail: alice.martin@lab.local
EOF

# Applique la modification
docker exec -i lab-ldap ldapmodify -x \
  -H ldap://localhost \
  -D "cn=admin,dc=lab,dc=local" \
  -w admin123 < ~/lab-ldap/ldifs/04-modify.ldif
```

**Résultat attendu** :

```text
modifying entry "uid=alice,ou=personnes,dc=lab,dc=local"
```

---

### Étape 9 : Nettoyage

```bash
# Arrete et supprime le conteneur
docker stop lab-ldap
docker rm lab-ldap
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `ldapsearch -x -H ldap://host -b base -D bindDN -w pass` | Recherche dans l'annuaire |
| `ldapadd -x -H ldap://host -D bindDN -w pass -f file.ldif` | Ajoute des entrées depuis un fichier LDIF |
| `ldapmodify -x -H ldap://host -D bindDN -w pass -f file.ldif` | Modifie des entrées depuis un fichier LDIF |
| `ldapdelete -x -H ldap://host -D bindDN -w pass "DN"` | Supprime une entrée |
| `ldapwhoami -x -H ldap://host -D bindDN -w pass` | Teste l'authentification (bind) |
| `ldappasswd -x -H ldap://host -D bindDN -w pass -s newpass "DN"` | Change le mot de passe d'un utilisateur |

---

## Pièges Fréquents

### Piège 1 : Erreur de syntaxe dans les fichiers LDIF

⚠️ **Problème** : Tu as une ligne vide en trop ou en moins dans le fichier LDIF. `ldapadd` refuse l'import avec un message d'erreur cryptique comme `ldap_add: Invalid syntax (21)`.

✅ **Solution** : Dans un fichier LDIF, les entrées sont séparées par une seule ligne vide. Il ne doit pas y avoir de ligne vide a l'intérieur d'une entrée. Verifie aussi qu'il n'y a pas d'espaces en fin de ligne.

```text
# ✅ Correct : une ligne vide entre les entrees
dn: ou=personnes,dc=lab,dc=local
objectClass: organizationalUnit
ou: personnes

dn: ou=groupes,dc=lab,dc=local
objectClass: organizationalUnit
ou: groupes
```

---

### Piège 2 : DN mal forme

⚠️ **Problème** : Tu écris le DN dans le mauvais ordre ou tu oublies un composant. L'entrée n'est pas trouvee ou l'ajout échoue.

✅ **Solution** : Le DN se lit de gauche (le plus spécifique) a droite (le plus général). Le premier composant du DN doit correspondre a un attribut de l'entrée.

```text
# ❌ Incorrect : l'ordre est inverse
dn: dc=local,dc=lab,ou=personnes,uid=alice

# ✅ Correct : du plus specifique au plus general
dn: uid=alice,ou=personnes,dc=lab,dc=local
```

---

### Piège 3 : Oublier l'objectClass

⚠️ **Problème** : Tu créés une entrée sans le bon `objectClass`. Les attributs obligatoires ne sont pas presents et l'ajout échoue avec `ldap_add: Object class violation (65)`.

✅ **Solution** : Chaque entrée doit avoir au moins un `objectClass`. L'objectClass définit quels attributs sont autorises et obligatoires. Par exemple, `inetOrgPerson` exige `sn` (surname) et `cn` (common name).

---

### Piège 4 : Stocker les mots de passe en clair

⚠️ **Problème** : Tu stockes les mots de passe avec `userPassword: monmotdepasse` en texte clair dans le LDIF. Quiconque a accès a l'annuaire peut lire les mots de passe.

✅ **Solution** : Utilise un algorithme de hachage. Sur cette image 2.4, `{SSHA}` (SHA-1 salé) est le défaut de `slappasswd`. Ne le présente pas comme un hash moderne : en production récente, préfère `{ARGON2}` (OpenLDAP 2.5+) :

```bash
# Genere un hash SSHA pour un mot de passe
docker exec lab-ldap slappasswd -s "mon_mot_de_passe"
# Resultat : {SSHA}xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Checklist de Validation

- [ ] Je sais expliquer ce qu'est LDAP et son utilité
- [ ] Je comprends la structure DIT (arborescence) et les DN
- [ ] Je connais les principaux objectClass (inetOrgPerson, posixAccount, groupOfNames)
- [ ] Je sais écrire un fichier LDIF pour ajouter des entrées
- [ ] Je sais utiliser `ldapsearch` pour rechercher dans l'annuaire
- [ ] Je sais tester l'authentification avec `ldapwhoami`
- [ ] Je comprends le principe d'authentification centralisée avec LDAP

---

## Exercice Pratique

**Énoncé** : Créé un annuaire LDAP pour une école avec la structure suivante :

1. Racine : `dc=ecole,dc=local`
2. Trois unités organisationnelles : `eleves`, `professeurs`, `personnel`
3. Deux élevés : `uid=emma` (Emma Petit, `emma@ecole.local`) et `uid=lucas` (Lucas Grand, `lucas@ecole.local`)
4. Un professeur : `uid=prof-math` (Jean Calcul, `jean.calcul@ecole.local`)
5. Un groupe `classe-A` contenant Emma et Lucas
6. Teste l'authentification de chaque utilisateur
7. Recherche tous les élevés dont le nom contient "e"

**Indications** :

- Utilise les objectClass `inetOrgPerson` et `posixAccount`
- Utilise `groupOfNames` pour le groupe
- Le filtre de recherche pour "contient" est `(sn=*e*)`
- Hache les `userPassword` avec `slappasswd` comme à l'étape 4 (la solution ci-dessous montre des mots de passe en clair uniquement pour simplifier le bind de test ; ne les laisse pas ainsi en dehors du labo)

**Résultat attendu** : L'arborescence est créée, les utilisateurs s'authentifient correctement, et la recherche retourne les élevés correspondants.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

Démarrage du conteneur :

```bash
docker run -d --name lab-ldap-ecole \
  -p 3390:389 \
  -e LDAP_ORGANISATION="Ecole Lab" \
  -e LDAP_DOMAIN="ecole.local" \
  -e LDAP_ADMIN_PASSWORD="admin123" \
  osixia/openldap:1.5.0
```

Unités organisationnelles :

```bash
cat << 'EOF' | docker exec -i lab-ldap-ecole ldapadd -x \
  -H ldap://localhost -D "cn=admin,dc=ecole,dc=local" -w admin123
dn: ou=eleves,dc=ecole,dc=local
objectClass: organizationalUnit
ou: eleves

dn: ou=professeurs,dc=ecole,dc=local
objectClass: organizationalUnit
ou: professeurs

dn: ou=personnel,dc=ecole,dc=local
objectClass: organizationalUnit
ou: personnel
EOF
```

Utilisateurs :

```bash
cat << 'EOF' | docker exec -i lab-ldap-ecole ldapadd -x \
  -H ldap://localhost -D "cn=admin,dc=ecole,dc=local" -w admin123
dn: uid=emma,ou=eleves,dc=ecole,dc=local
objectClass: inetOrgPerson
objectClass: posixAccount
uid: emma
cn: Emma Petit
sn: Petit
givenName: Emma
mail: emma@ecole.local
userPassword: emma123
uidNumber: 2001
gidNumber: 2001
homeDirectory: /home/emma
loginShell: /bin/bash

dn: uid=lucas,ou=eleves,dc=ecole,dc=local
objectClass: inetOrgPerson
objectClass: posixAccount
uid: lucas
cn: Lucas Grand
sn: Grand
givenName: Lucas
mail: lucas@ecole.local
userPassword: lucas123
uidNumber: 2002
gidNumber: 2002
homeDirectory: /home/lucas
loginShell: /bin/bash

dn: uid=prof-math,ou=professeurs,dc=ecole,dc=local
objectClass: inetOrgPerson
objectClass: posixAccount
uid: prof-math
cn: Jean Calcul
sn: Calcul
givenName: Jean
mail: jean.calcul@ecole.local
userPassword: prof123
uidNumber: 3001
gidNumber: 3001
homeDirectory: /home/prof-math
loginShell: /bin/bash
EOF
```

Groupe :

```bash
cat << 'EOF' | docker exec -i lab-ldap-ecole ldapadd -x \
  -H ldap://localhost -D "cn=admin,dc=ecole,dc=local" -w admin123
dn: cn=classe-A,ou=eleves,dc=ecole,dc=local
objectClass: groupOfNames
cn: classe-A
member: uid=emma,ou=eleves,dc=ecole,dc=local
member: uid=lucas,ou=eleves,dc=ecole,dc=local
EOF
```

Tests d'authentification :

```bash
# Emma
docker exec lab-ldap-ecole ldapwhoami -x -H ldap://localhost \
  -D "uid=emma,ou=eleves,dc=ecole,dc=local" -w emma123
# dn:uid=emma,ou=eleves,dc=ecole,dc=local

# Professeur
docker exec lab-ldap-ecole ldapwhoami -x -H ldap://localhost \
  -D "uid=prof-math,ou=professeurs,dc=ecole,dc=local" -w prof123
# dn:uid=prof-math,ou=professeurs,dc=ecole,dc=local
```

Recherche :

```bash
# Eleves dont le nom contient "e"
docker exec lab-ldap-ecole ldapsearch -x -H ldap://localhost \
  -b "ou=eleves,dc=ecole,dc=local" \
  -D "cn=admin,dc=ecole,dc=local" -w admin123 \
  "(sn=*e*)" uid cn sn mail
```

Nettoyage :

```bash
docker stop lab-ldap-ecole && docker rm lab-ldap-ecole
```

---

## Navigation

← Fiche précédente : **[03 - Serveur de messagerie](03-serveur-mail.md)**

→ Fiche suivante : **[05 - Serveur DHCP](05-serveur-dhcp.md)**
