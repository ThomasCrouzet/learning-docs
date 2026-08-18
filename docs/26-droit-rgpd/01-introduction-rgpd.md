---
tags:
  - Droit
  - Débutant
  - Concept
description: "Introduction au RGPD : historique, principes fondamentaux, droits des personnes et bases légales du traitement"
estimated_time: "60 min"
fiche_number: 1
total_fiches: 4
cursus: "Droit et RGPD"
---

# 01 - Introduction au RGPD

> **En bref** : Cette fiche présente le Règlement Général sur la Protection des Données (RGPD) : son historique, ses 7 principes fondamentaux, les droits des personnes concernées et les 6 bases légales du traitement. Lecture estimée : 60 min.

!!! warning "Pas un conseil juridique"
    Ce cursus est une **introduction pédagogique** pour développeurs. Il ne remplace pas un avis juridique, un DPO ni un cabinet spécialisé. Les règles évoluent (jurisprudence, recommandations CNIL, décisions européennes) : en situation réelle, vérifie les textes officiels et fais-toi accompagner si besoin.

## Prérequis

- Aucune connaissance préalable du droit ou du RGPD n'est requise (tout est expliqué ci-dessous)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer les principes fondamentaux du RGPD, les droits des personnes sur leurs données et les bases légales qui autorisent le traitement de données personnelles.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le RGPD ?

**Définition** : Le RGPD (Règlement Général sur la Protection des Données) est un règlement européen entré en application le 25 mai 2018. Il encadre le traitement des données personnelles sur le territoire de l'Union européenne.

**Le problème que le RGPD résout** :

Sans le RGPD, voici les problèmes rencontrés :

1. **Collecte sans limites** : Les entreprises récoltaient des données personnelles sans aucune restriction ni justification.

2. **Absence de contrôle** : Les individus ne savaient pas quelles données étaient collectées ni comment elles étaient utilisées.

3. **Législations fragmentées** : Chaque pays européen avait ses propres règles, rendant la protection incohérente d'un pays à l'autre.

4. **Sanctions insuffisantes** : Les amendes prévues par les anciennes lois étaient trop faibles pour dissuader les grandes entreprises.

**Comment le RGPD résout ces problèmes** :

| Problème | Solution apportée par le RGPD |
| -------- | ----------------------------- |
| Collecte sans limites | Obligation de justifier chaque traitement par une base légale |
| Absence de contrôle | Droits des personnes (accès, suppression, portabilité) |
| Législations fragmentées | Un seul texte applicable dans toute l'Union européenne |
| Sanctions insuffisantes | Amendes jusqu'à 20 millions d'euros ou 4% du chiffre d'affaires mondial |

**Analogie concrète** : Le RGPD fonctionne comme un contrat de location. Quand tu loues un appartement, le propriétaire ne peut pas entrer chez toi quand il veut, il doit te prévenir, respecter certaines règles et tu peux résilier le bail. De la même manière, le RGPD impose des règles aux entreprises qui "utilisent" tes données : elles doivent te dire ce qu'elles en font, respecter des limites et te laisser reprendre le contrôle.

**Ce que le RGPD n'est PAS** :

- Le RGPD n'est pas une interdiction de collecter des données. Il encadre la collecte et le traitement, il ne les interdit pas.
- Le RGPD n'est pas réservé aux grandes entreprises. Toute organisation qui traite des données personnelles est concernée, quelle que soit sa taille.
- Le RGPD n'est pas uniquement européen dans ses effets. Il s'applique aussi aux entreprises hors UE qui traitent des données de résidents européens.

---

### Historique et contexte

**Définition** : Le RGPD est l'aboutissement d'une longue évolution de la protection des données personnelles en Europe, depuis la loi française Informatique et Libertés de 1978 jusqu'au règlement européen de 2016.

**Chronologie clé** :

| Date | Événement |
| ---- | --------- |
| 1978 | Loi Informatique et Libertés (France) - création de la CNIL |
| 1995 | Directive européenne 95/46/CE sur la protection des données |
| 2012 | Proposition de règlement européen (début des discussions) |
| 2016 | Adoption du RGPD par le Parlement européen |
| 25 mai 2018 | Entrée en application du RGPD |
| 2018-2025 | Sanctions majeures (Google, Meta, Amazon) |

**Pourquoi une loi européenne ?** :

La directive de 1995 laissait chaque pays libre de transposer les règles à sa manière. Résultat : une entreprise présente dans 10 pays devait respecter 10 législations différentes. Le RGPD est un **règlement** (pas une directive), ce qui signifie qu'il s'applique directement et uniformément dans tous les pays de l'UE.

---

### Qu'est-ce qu'une donnée personnelle ?

**Définition** : Une donnée personnelle est toute information se rapportant à une personne physique identifiée ou identifiable, directement ou indirectement.

**Exemples de données personnelles** :

| Type | Exemples |
| ---- | -------- |
| Identification directe | Nom, prénom, photo |
| Identification indirecte | Adresse IP, numéro de sécurité sociale, identifiant client |
| Données sensibles | Données de santé, opinions politiques, orientation sexuelle, données biométriques |
| Données numériques | Historique de navigation, géolocalisation, cookies |

**Ce qui n'est PAS une donnée personnelle** :

- Les données anonymisées de manière irréversible (statistiques agrégées sans possibilité de retrouver les individus)
- Les données concernant des personnes morales (entreprises, associations) en tant que telles

**Analogie concrète** : Une donnée personnelle est comme une pièce de puzzle. Seule, une adresse IP ne dit rien. Mais combinée avec d'autres informations (historique de navigation, localisation), elle permet de reconstituer le portrait d'une personne. Le RGPD protège chaque pièce du puzzle, même celles qui semblent insignifiantes isolément.

---

### Les 7 principes fondamentaux du RGPD

**Définition** : Le RGPD repose sur des principes directeurs (article 5) qui encadrent tout traitement de données personnelles. On les présente souvent en 7 points (en séparant licéité et loyauté/transparence), auxquels s'ajoute le principe de responsabilité (accountability).

**Vue d'ensemble des principes** :

<div class="diagram-design">
<p><a href="../../diagrams/26-droit-rgpd-01-introduction-rgpd-1.html">Les 7 principes fondamentaux du RGPD (HTML + SVG)</a></p>
<iframe src="../../diagrams/26-droit-rgpd-01-introduction-rgpd-1.html" title="Les 7 principes fondamentaux du RGPD" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Détail de chaque principe** :

#### Principe 1 : Licéité

Le traitement doit être fondé sur une base légale valide (voir la section "Les 6 bases légales" plus bas).

**Exemple concret** : Un site e-commerce peut traiter ton adresse postale pour livrer ta commande (base légale : exécution du contrat). Il ne peut pas revendre cette adresse à un tiers sans ton consentement.

#### Principe 2 : Loyauté et transparence

L'organisation doit informer les personnes de manière claire et compréhensible sur ce qu'elle fait de leurs données.

**Exemple concret** : Une application mobile doit expliquer dans un langage simple quelles données elle collecte, pourquoi, et pendant combien de temps - pas dans des conditions générales de 50 pages en jargon juridique.

#### Principe 3 : Limitation des finalités

Les données ne peuvent être collectées que pour des finalités déterminées, explicites et légitimes. Elles ne peuvent pas être réutilisées pour un objectif incompatible avec la finalité initiale.

**Exemple concret** : Un employeur collecte les adresses e-mail de ses salariés pour la communication interne. Il ne peut pas utiliser ces adresses pour envoyer de la publicité pour un produit commercial.

#### Principe 4 : Minimisation des données

Seules les données strictement nécessaires à la finalité déclarée doivent être collectées.

**Exemple concret** : Pour s'inscrire à une newsletter, demander uniquement l'adresse e-mail suffit. Demander le numéro de téléphone, la date de naissance et l'adresse postale viole ce principe.

#### Principe 5 : Exactitude

Les données doivent être exactes et tenues à jour. Les données inexactes doivent être corrigées ou supprimées sans délai.

**Exemple concret** : Si un utilisateur change d'adresse et te le signale, tu dois mettre à jour cette information et ne pas conserver l'ancienne adresse comme valide.

#### Principe 6 : Limitation de conservation

Les données ne doivent pas être conservées plus longtemps que nécessaire pour la finalité du traitement.

**Exemple concret** : Les données d'un candidat non retenu à un emploi ne doivent pas rester en base active sans limite. La CNIL indique souvent **2 ans maximum** en base active pour le recrutement (sauf demande d'effacement plus tôt), avec éventuellement un archivage intermédiaire justifié. Les conserver indéfiniment "au cas où" est interdit.

#### Principe 7 : Intégrité et confidentialité

Les données doivent être protégées contre l'accès non autorisé, la perte ou la destruction par des mesures techniques et organisationnelles appropriées.

**Exemple concret** : Stocker des mots de passe en clair dans une base de données viole ce principe. Ils doivent être hashés avec un algorithme adapté (bcrypt, argon2).

**Le principe transversal : la responsabilité (accountability)**

En plus des 7 principes ci-dessus, le RGPD impose un principe de **responsabilité** : l'organisation doit pouvoir **démontrer** sa conformité. Ce n'est pas à l'autorité de contrôle de prouver la non-conformité, c'est à l'organisation de prouver qu'elle respecte les règles.

---

### Les droits des personnes concernées

**Définition** : Le RGPD accorde aux individus un ensemble de droits sur leurs données personnelles. Ces droits leur permettent de garder le contrôle sur l'utilisation de leurs informations.

**Le problème que ces droits résolvent** :

Sans droits des personnes, voici les problèmes rencontrés :

1. **Opacité totale** : Impossible de savoir quelles données une entreprise détient sur toi.

2. **Données erronées** : Pas de moyen de corriger des informations fausses te concernant.

3. **Enfermement** : Impossible de récupérer tes données pour les transférer à un autre service.

**Comment les droits des personnes résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Opacité totale | Droit d'accès |
| Données erronées | Droit de rectification |
| Enfermement | Droit à la portabilité |

**Tableau récapitulatif des droits** :

| Droit | Article | Description | Délai de réponse |
| ----- | ------- | ----------- | ---------------- |
| Droit d'accès | Art. 15 | Obtenir une copie de toutes les données détenues sur soi | 1 mois |
| Droit de rectification | Art. 16 | Faire corriger des données inexactes ou incomplètes | 1 mois |
| Droit à l'effacement | Art. 17 | Demander la suppression de ses données ("droit à l'oubli") | 1 mois |
| Droit à la portabilité | Art. 20 | Recevoir ses données dans un format lisible par machine | 1 mois |
| Droit d'opposition | Art. 21 | S'opposer au traitement de ses données (ex : prospection) | Sans délai pour la prospection |
| Droit à la limitation | Art. 18 | Demander le gel temporaire du traitement | 1 mois |
| Droit de ne pas faire l'objet d'une décision automatisée | Art. 22 | Refuser qu'une décision soit prise uniquement par un algorithme | 1 mois |

**Analogie concrète** : Tes droits RGPD sont comme les droits d'un locataire. Tu peux demander un état des lieux (droit d'accès), exiger des réparations (rectification), résilier le bail et récupérer tes meubles (effacement et portabilité), ou refuser que le propriétaire installe une caméra dans ton salon (opposition).

**Limites de ces droits** :

Ces droits ne sont pas absolus. Par exemple :

- Le droit à l'effacement ne s'applique pas si les données sont nécessaires pour respecter une obligation légale (conservation des factures pendant 10 ans)
- Le droit d'opposition ne s'applique pas si le traitement repose sur une obligation légale

---

### Les 6 bases légales du traitement

**Définition** : Une base légale est la justification juridique qui autorise une organisation à traiter des données personnelles. Sans base légale valide, le traitement est illégal.

**Le problème que les bases légales résolvent** :

Sans bases légales, voici les problèmes rencontrés :

1. **Arbitraire** : N'importe qui pourrait traiter des données pour n'importe quelle raison.

2. **Déséquilibre** : Les entreprises pourraient imposer le traitement sans recours possible pour les individus.

**Les 6 bases légales (article 6 du RGPD)** :

| Base légale | Définition | Exemple concret |
| ----------- | ---------- | --------------- |
| Consentement | La personne a donné son accord explicite | Case à cocher pour recevoir la newsletter |
| Contrat | Le traitement est nécessaire à l'exécution d'un contrat | Adresse de livraison pour une commande |
| Obligation légale | Le traitement est imposé par la loi | Conservation des bulletins de paie (5 ans) |
| Intérêts vitaux | Le traitement est nécessaire pour protéger la vie d'une personne | Transmission du groupe sanguin aux urgences |
| Mission d'intérêt public | Le traitement est lié à une mission de service public | Fichier des impôts |
| Intérêts légitimes | L'organisation a un intérêt légitime qui ne porte pas une atteinte disproportionnée aux droits des personnes | Vidéosurveillance d'un parking pour la sécurité |

**Quelle base choisir ?** :

<div class="diagram-design">
<p><a href="../../diagrams/26-droit-rgpd-01-introduction-rgpd-2.html">Les 6 bases légales du traitement (HTML + SVG)</a></p>
<iframe src="../../diagrams/26-droit-rgpd-01-introduction-rgpd-2.html" title="Les 6 bases légales du traitement" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Attention au consentement** :

Le consentement est la base légale la plus connue mais pas toujours la plus appropriée. Pour être valide, il doit être :

- **Libre** : pas de pression ni de conséquence négative en cas de refus
- **Spécifique** : un consentement par finalité
- **Éclairé** : la personne sait exactement à quoi elle consent
- **Univoque** : manifestation claire (case à cocher, jamais pré-cochée)
- **Retirable** : la personne peut retirer son consentement à tout moment

---

### Les acteurs du RGPD

**Définition** : Le RGPD définit plusieurs rôles clés dans le traitement des données personnelles.

| Acteur | Rôle | Exemple |
| ------ | ---- | ------- |
| Responsable de traitement | Détermine les finalités et les moyens du traitement | L'entreprise qui gère un site e-commerce |
| Sous-traitant | Traite les données pour le compte du responsable | L'hébergeur qui stocke la base de données |
| Personne concernée | L'individu dont les données sont traitées | Le client du site e-commerce |
| DPO (Délégué à la Protection des Données) | Conseille et contrôle la conformité au sein de l'organisation | Le référent RGPD de l'entreprise |
| Autorité de contrôle | Supervise l'application du RGPD dans chaque pays | La CNIL en France |

---

## Étapes Pratiques

### Étape 1 : Identifier des données personnelles dans un formulaire

Analyse le formulaire d'inscription suivant et identifie les données personnelles :

```text
Formulaire d'inscription :
- Nom
- Prénom
- Date de naissance
- Adresse e-mail
- Mot de passe
- Numéro de téléphone
- Adresse postale
- Profession
- Centres d'intérêt
```

**Résultat attendu** :

```text
Données personnelles directes :
- Nom et prénom (identification directe)
- Date de naissance (identification indirecte)
- Adresse e-mail (identification directe si elle contient le nom)
- Numéro de téléphone (identification indirecte)
- Adresse postale (identification indirecte)

Données personnelles indirectes :
- Profession (peut contribuer à l'identification combinée)
- Centres d'intérêt (profilage)

Donnée de sécurité liée à la personne :
- Mot de passe (donnée personnelle dès qu'elle est rattachée à un
  utilisateur identifiable ; sa protection est particulièrement critique)
```

---

### Étape 2 : Associer une base légale à chaque traitement

Pour chaque situation ci-dessous, détermine la base légale appropriée :

```text
Situations :
1. Un site e-commerce enregistre l'adresse de livraison du client
2. Une application envoie des notifications publicitaires
3. Un employeur déclare les salaires aux impôts
4. Un hôpital partage le dossier médical avec le SAMU
5. Une mairie gère les inscriptions sur les listes électorales
6. Un site analyse le comportement de navigation pour améliorer son interface
```

**Résultat attendu** :

```text
1. Adresse de livraison → Contrat (nécessaire pour exécuter la commande)
2. Notifications publicitaires → Consentement (opt-in obligatoire)
3. Déclaration des salaires → Obligation légale (le Code général des impôts l'impose)
4. Dossier médical au SAMU → Intérêts vitaux (urgence médicale)
5. Listes électorales → Mission d'intérêt public
6. Analyse de navigation → Consentement (cookies / traceurs). Exception étroite : exemption CNIL « mesure d'audience » (finalité limitée, first-party, pas de recoupement). Ce n'est pas l'intérêt légitime.
```

---

### Étape 3 : Vérifier la validité d'un consentement

Analyse les mécanismes de consentement suivants et détermine s'ils sont conformes au RGPD :

```text
Cas A : Une case pré-cochée "J'accepte de recevoir des offres commerciales"
Cas B : "En continuant à naviguer sur ce site, vous acceptez nos cookies"
Cas C : Un bouton "J'accepte" sans détail sur les finalités
Cas D : Deux cases séparées, non pré-cochées :
        [ ] J'accepte les cookies analytiques
        [ ] J'accepte les cookies publicitaires
        Avec un lien "En savoir plus" détaillant chaque finalité
```

**Résultat attendu** :

```text
Cas A : NON CONFORME
- Raison : case pré-cochée = pas de consentement univoque
- Le consentement doit résulter d'un acte positif clair

Cas B : NON CONFORME
- Raison : la poursuite de navigation n'est pas un consentement valide
- Pas de manifestation univoque de la volonté

Cas C : NON CONFORME
- Raison : le consentement n'est pas éclairé (pas de détail sur les finalités)
- La personne ne sait pas à quoi elle consent

Cas D : CONFORME
- Libre : pas de case pré-cochée
- Spécifique : une case par finalité
- Éclairé : lien "En savoir plus" avec les détails
- Univoque : acte positif (cocher la case)
```

---

### Étape 4 : Analyser une politique de confidentialité

Lis la politique de confidentialité fictive ci-dessous et identifie les manquements au RGPD :

```text
"Nous collectons vos données pour améliorer nos services.
Nous pouvons partager vos informations avec nos partenaires.
Vos données sont conservées aussi longtemps que nécessaire.
En utilisant notre service, vous acceptez cette politique."
```

**Résultat attendu** :

```text
Manquements identifiés :

1. "pour améliorer nos services"
   → Finalité trop vague, pas assez spécifique (principe de limitation des finalités)

2. "Nous pouvons partager avec nos partenaires"
   → Pas de liste des partenaires, pas de base légale pour le partage

3. "aussi longtemps que nécessaire"
   → Pas de durée précise de conservation (principe de limitation de conservation)

4. "En utilisant notre service, vous acceptez"
   → Consentement par défaut, pas de manifestation univoque

Éléments manquants :
- Identité du responsable de traitement
- Base légale de chaque traitement
- Droits des personnes (accès, rectification, effacement, etc.)
- Coordonnées du DPO ou du référent
- Droit de réclamation auprès de la CNIL
```

---

## Commandes Utiles

Ce cursus étant théorique, voici les ressources de référence à connaître :

| Ressource | Description |
| --------- | ----------- |
| cnil.fr | Site officiel de la CNIL (guides, modèles, actualités) |
| eur-lex.europa.eu | Texte officiel du RGPD |
| Registre des traitements CNIL | Modèle de registre téléchargeable sur le site de la CNIL |
| Guide du sous-traitant CNIL | Guide pratique des obligations du sous-traitant |

---

## Pièges Fréquents

### Piège 1 : Confondre données anonymisées et pseudonymisées

⚠️ **Problème** : Croire que remplacer un nom par un identifiant rend les données anonymes.

✅ **Solution** : La pseudonymisation (remplacer le nom par un ID) reste soumise au RGPD car les données peuvent être ré-identifiées. Seule l'anonymisation irréversible sort du champ du RGPD.

---

### Piège 2 : Croire que le consentement est toujours nécessaire

⚠️ **Problème** : Demander le consentement pour des traitements qui reposent sur une autre base légale (contrat, obligation légale).

✅ **Solution** : Identifier la base légale appropriée avant de choisir le consentement. Si le traitement est nécessaire à l'exécution d'un contrat, le consentement n'est pas requis pour ce traitement spécifique.

---

### Piège 3 : Penser que le RGPD ne s'applique qu'en ligne

⚠️ **Problème** : Ignorer que les fichiers papier contenant des données personnelles sont aussi concernés.

✅ **Solution** : Le RGPD s'applique à tout traitement de données personnelles, qu'il soit automatisé (numérique) ou non (papier), dès lors que les données sont organisées dans un fichier.

---

### Piège 4 : Confondre responsable de traitement et sous-traitant

⚠️ **Problème** : Ne pas savoir qui est responsable de quoi dans la chaîne de traitement.

✅ **Solution** : Le **responsable de traitement** décide du "pourquoi" et du "comment" (finalités et moyens). Le **sous-traitant** agit uniquement sur instruction du responsable. Un hébergeur cloud est un sous-traitant ; l'entreprise qui utilise cet hébergeur pour stocker les données de ses clients est le responsable de traitement.

---

## Checklist de Validation

- [ ] Je sais définir ce qu'est une donnée personnelle
- [ ] Je connais les 7 principes fondamentaux du RGPD
- [ ] Je sais citer au moins 5 droits des personnes concernées
- [ ] Je connais les 6 bases légales du traitement
- [ ] Je sais vérifier si un consentement est valide (libre, spécifique, éclairé, univoque)
- [ ] Je comprends la différence entre responsable de traitement et sous-traitant
- [ ] Je sais que la pseudonymisation n'est pas l'anonymisation

---

## Exercice Pratique

**Énoncé** : Tu es développeur dans une startup qui lance une application de suivi sportif. L'application collecte les données suivantes : nom, e-mail, âge, poids, taille, historique d'activités sportives, données de géolocalisation pendant les séances.

Réponds aux questions suivantes :

**Indications** :

1. Identifie les données personnelles et classe-les par catégorie (directes, indirectes, sensibles)
2. Pour chaque donnée, détermine si elle respecte le principe de minimisation (est-elle strictement nécessaire ?)
3. Propose une base légale appropriée pour le traitement de chaque catégorie de données
4. Rédige un paragraphe de politique de confidentialité conforme pour le traitement de la géolocalisation
5. Liste les droits que les utilisateurs doivent pouvoir exercer

**Résultat attendu** : Un document structuré répondant à chaque question avec les justifications RGPD appropriées.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**1. Classification des données** :

| Donnée | Catégorie | Justification |
| ------ | --------- | ------------- |
| Nom | Identification directe | Identifie directement la personne |
| E-mail | Identification directe | Souvent lié au nom |
| Âge | Identification indirecte | Contribue à l'identification croisée |
| Poids et taille | Données de santé (sensibles) | Informations relatives à la santé physique |
| Historique sportif | Données de santé (sensibles) | Révèle l'état de santé et les habitudes |
| Géolocalisation | Identification indirecte | Permet de localiser et suivre une personne |

**2. Analyse de minimisation** :

| Donnée | Nécessaire ? | Justification |
| ------ | ------------ | ------------- |
| Nom | Oui | Identification du compte |
| E-mail | Oui | Connexion et communication |
| Âge | Discutable | Utile pour les recommandations sportives mais pas strictement nécessaire |
| Poids et taille | Oui si calcul de calories/performances | Nécessaire pour les fonctionnalités de suivi personnalisé |
| Historique sportif | Oui | Fonctionnalité principale de l'application |
| Géolocalisation | Non obligatoire | Optionnelle, ne doit pas être imposée pour utiliser l'application |

**3. Bases légales** :

| Catégorie | Base légale | Justification |
| --------- | ----------- | ------------- |
| Nom, e-mail | Contrat | Nécessaire pour fournir le service |
| Poids, taille, historique | Consentement explicite | Données de santé = consentement obligatoire (art. 9) |
| Géolocalisation | Consentement | Non nécessaire au service de base, doit être optionnel |
| Âge | Contrat ou consentement | Selon si c'est nécessaire ou optionnel |

**4. Politique de confidentialité pour la géolocalisation** :

```text
Traitement : Géolocalisation pendant les séances sportives

Responsable : [Nom de la startup], [adresse], [contact]

Finalité : Enregistrer le parcours de tes séances sportives (distance,
tracé, vitesse) pour te fournir des statistiques détaillées.

Base légale : Ton consentement (article 6.1.a du RGPD). Tu peux activer
ou désactiver la géolocalisation à tout moment dans les paramètres de
l'application.

Données collectées : Coordonnées GPS pendant la durée de la séance
uniquement.

Durée de conservation : Les données de géolocalisation sont conservées
tant que ton compte est actif. Elles sont supprimées dans un délai de
30 jours après la suppression de ton compte.

Destinataires : Aucun tiers n'a accès à tes données de géolocalisation.

Tes droits : Tu peux accéder à tes données, les rectifier, les supprimer,
les exporter ou retirer ton consentement à tout moment. Contact :
[dpo@startup.com]. Tu peux aussi adresser une réclamation à la CNIL.
```

**5. Droits des utilisateurs** :

- **Droit d'accès** : consulter toutes les données collectées (export depuis l'application)
- **Droit de rectification** : modifier ses informations personnelles
- **Droit à l'effacement** : supprimer son compte et toutes ses données
- **Droit à la portabilité** : exporter ses données dans un format lisible (JSON, CSV)
- **Droit d'opposition** : s'opposer à certains traitements (ex : suggestions personnalisées)
- **Droit au retrait du consentement** : désactiver la géolocalisation ou le traitement des données de santé

---

## Navigation

→ Fiche suivante : **[RGPD pour développeurs](02-rgpd-pour-developpeurs.md)**
