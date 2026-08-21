---
tags:
  - Cybersécurité
  - Avancé
  - Pratique
description: "DevSecOps et sécurité applicative : shift-left, CI/CD security, SAST/DAST/SCA, supply chain, SBOM"
estimated_time: "65 min"
fiche_number: 5
total_fiches: 5
cursus: "Phase 6 - Domaines Avancés"
id: "security.cybersecurity.advanced.devsecops"
course_id: "security.cybersecurity"
module_id: "security.cybersecurity.advanced"
content_type: "lesson"
order: 5
---

# 05 - DevSecOps et Sécurité Applicative

> **En bref** : À la fin de cette fiche, tu sauras intégrer la sécurité dans le cycle de développement logiciel (shift-left), configurer des outils de scanning dans un pipeline CI/CD (SAST, DAST, SCA, secrets détection), sécuriser les images de conteneurs, et mettre en place une stratégie de supply chain security avec SBOM et signature. Lecture estimée : 65 min.


## Prérequis

- [Phase 1, fiche 04 - Programmation et scripting](../01-fondamentaux-informatiques/04-programmation-scripting.md) (Python, Bash, Git)
- [Phase 3, fiche 02 - Sécurité Web et Applicative](../03-competences-intermediaires/02-securite-web-applicative.md)
- Connaissances de base en développement web (HTML, HTTP, API REST)
- Notions de CI/CD (pipelines, automatisation) - expliqué ci-dessous si nécessaire

## Objectif de cette fiche

À la fin de cette fiche, tu sauras intégrer la sécurité dans le cycle de développement logiciel (shift-left), configurer des outils de scanning dans un pipeline CI/CD (SAST, DAST, SCA, secrets détection), sécuriser les images de conteneurs, et mettre en place une stratégie de supply chain security avec SBOM et signature.

---

## Concepts

### Qu'est-ce que le DevSecOps ?

**Définition** : le DevSecOps est l'intégration de la sécurité dans chaque étape du cycle de développement logiciel (DevOps). Au lieu de tester la sécurité à la fin du projet (en "post-production"), on la vérifie en continu, depuis l'écriture du code jusqu'au déploiement et au-delà.

**Le problème que le DevSecOps résout** :

1. **Détection tardive** : traditionnellement, les tests de sécurité sont réalisés juste avant la mise en production, quand les corrections coûtent 100 fois plus cher qu'en phase de développement
2. **Conflit dev/sec** : les équipes de développement voient la sécurité comme un frein qui retarde les livraisons
3. **Volume de code** : les applications modernes utilisent des centaines de dépendances open source, impossibles à auditer manuellement
4. **Vitesse de déploiement** : avec le CI/CD, les déploiements se font plusieurs fois par jour, les audits manuels ne peuvent pas suivre

**Comment le DevSecOps résout ces problèmes** :

| Problème | Solution DevSecOps |
| -------- | ------------------ |
| Détection tardive | Shift-left : tests automatisés dès le commit (pre-commit hooks, CI) |
| Conflit dev/sec | Sécurité intégrée dans les outils existants des développeurs (IDE, Git, CI) |
| Volume de code | SCA automatisée pour les dépendances, SAST pour le code maison |
| Vitesse de déploiement | Pipelines de sécurité automatisés, exécutés en parallèle |

**Analogie concrète** : dans une usine automobile, le contrôle qualité ne se fait pas uniquement à la fin de la chaîne de montage. Chaque poste vérifie sa propre étape : le soudeur vérifie ses soudures, le peintre vérifie la peinture, l'assembleur vérifie le montage. Si un défaut est détecté au début de la chaîne, il est corrigé immédiatement (coût faible). Si le même défaut est détecté à la fin, il faut démonter tout le véhicule (coût élevé). Le DevSecOps applique cette logique au développement.

**Ce que le DevSecOps n'est PAS** :

- Le DevSecOps n'est pas l'ajout d'un outil de scan dans le pipeline. C'est un changement de culture où chaque développeur est responsable de la sécurité de son code
- Le DevSecOps n'est pas un remplacement des audits de sécurité. Les tests automatisés complètent les audits manuels mais ne les remplacent pas (un pentest humain trouve des vulnérabilités logiques que les outils ne détectent pas)

---

### Qu'est-ce que le Shift-Left Security ?

**Définition** : le shift-left security consiste à déplacer les activités de sécurité le plus tôt possible dans le cycle de développement. "Left" fait référence au début de la timeline du projet (à gauche sur un diagramme de Gantt).

**Coût de correction selon la phase de détection** :

| Phase de détection | Coût relatif de correction | Exemple |
| ------------------ | -------------------------- | ------- |
| Écriture du code (IDE) | 1x | L'IDE signale un `eval()` dangereux |
| Commit (pre-commit hook) | 2x | GitLeaks détecte une clé API avant le push |
| Build (CI pipeline) | 5x | Semgrep détecte une injection SQL |
| Test (staging) | 15x | DAST détecte une XSS sur l'environnement de test |
| Production | 100x | Un attaquant exploite la vulnérabilité en production |

**Activités de sécurité par phase** :

| Phase | Activité | Outils |
| ----- | -------- | ------ |
| Conception | Threat modeling | STRIDE, OWASP Threat Dragon |
| Développement | Analyse statique dans l'IDE | Semgrep, SonarLint |
| Pre-commit | Détection de secrets | GitLeaks, TruffleHog |
| Build (CI) | SAST, SCA, linting sécurité | SonarQube, Snyk, Semgrep |
| Test | DAST, tests de sécurité | OWASP ZAP, Nuclei |
| Déploiement | Scan images conteneurs, IaC | Trivy, Checkov |
| Production | Monitoring, WAF, RASP | ModSecurity, Datadog |

---

### Quels sont les types de tests de sécurité automatisés ?

**Définition** : les tests de sécurité automatisés se classent en quatre grandes catégories selon ce qu'ils analysent et comment.

**Les quatre types de tests** :

| Type | Nom complet | Ce qu'il analyse | Comment | Quand |
| ---- | ----------- | ---------------- | ------- | ----- |
| SAST | Static Application Security Testing | Le code source, sans l'exécuter | Analyse syntaxique et sémantique du code | Pendant le build CI |
| DAST | Dynamic Application Security Testing | L'application en cours d'exécution | Envoie des requêtes malveillantes et analyse les réponses | En environnement de test/staging |
| SCA | Software Composition Analysis | Les dépendances (bibliothèques tierces) | Compare les versions aux bases de vulnérabilités (CVE) | Pendant le build CI |
| IAST | Interactive Application Security Testing | L'application instrumentée | Agent installé dans l'application qui observe le comportement | En environnement de test |

**Comparaison détaillée** :

| Critère | SAST | DAST | SCA |
| ------- | ---- | ---- | --- |
| Accès au code source | Oui | Non | Non (analyse les dépendances) |
| Faux positifs | Élevé | Moyen | Faible |
| Faux négatifs | Moyen | Élevé | Faible |
| Vulnérabilités détectées | Injection, XSS, buffer overflow dans le code maison | XSS, CSRF, erreurs de configuration du serveur | CVE connues dans les bibliothèques |
| Vitesse | Rapide (minutes) | Lent (heures) | Rapide (secondes) |
| Outils | SonarQube, Semgrep, CodeQL | OWASP ZAP, Burp Suite, Nuclei | Snyk, Dependabot, Trivy |

---

### Qu'est-ce que la détection de secrets ?

**Définition** : la détection de secrets consiste à scanner le code source, l'historique Git et les fichiers de configuration pour trouver des identifiants (clés API, mots de passe, tokens, certificats) qui n'auraient pas dû être commités.

**Le problème que la détection de secrets résout** :

1. **Exposition accidentelle** : un développeur commite un fichier `.env` contenant des mots de passe de production
2. **Historique Git** : même si le secret est supprimé dans un commit suivant, il reste dans l'historique Git
3. **Bots automatisés** : des bots scannent GitHub en permanence et exploitent les clés trouvées en quelques minutes

**Outils de détection** :

| Outil | Type | Spécificité |
| ----- | ---- | ----------- |
| GitLeaks | Scan du repo Git (historique complet) | Détecte les secrets dans tous les commits, pas seulement le dernier |
| TruffleHog | Scan du repo Git + entropie | Calcule l'entropie des chaînes pour détecter les secrets même sans pattern connu |
| detect-secrets (Yelp) | Pre-commit hook | Léger, conçu pour le pre-commit |
| GitHub Secret Scanning | Service GitHub | Scan automatique des repos publics et privés |
| AWS git-secrets | Pre-commit hook | Spécialisé pour les credentials AWS |

---

### Qu'est-ce que la sécurité de la supply chain logicielle ?

**Définition** : la supply chain security (sécurité de la chaîne d'approvisionnement) couvre la protection de tous les composants externes utilisés dans un logiciel : bibliothèques open source, images de conteneurs, outils de build, pipelines CI/CD.

**Le problème que la supply chain security résout** :

1. **Dépendances vulnérables** : une application Node.js typique dépend de 500+ packages npm. Un seul package vulnérable compromet l'application
2. **Dépendances malveillantes** : des packages malveillants sont publiés avec des noms proches de packages populaires (typosquatting)
3. **Compromission de pipeline** : un attaquant qui accède au pipeline CI/CD peut injecter du code malveillant dans n'importe quelle version du logiciel
4. **Absence de traçabilité** : sans inventaire des composants, il est impossible de savoir si un logiciel est affecté par une nouvelle vulnérabilité

**Incidents réels de supply chain** :

| Incident | Année | Impact |
| -------- | ----- | ------ |
| SolarWinds | 2020 | Malware injecté dans le build pipeline, distribué à 18 000 organisations |
| Codecov | 2021 | Script de CI compromis, exfiltration de variables d'environnement |
| Log4Shell (Log4j) | 2021 | Vulnérabilité critique dans une bibliothèque utilisée par des millions d'applications Java |
| xz utils | 2024 | Backdoor insérée par un contributeur malveillant dans un outil de compression Linux |
| Polyfill.io | 2024 | Domaine CDN racheté et utilisé pour injecter du malware dans des milliers de sites |

**Solutions de supply chain security** :

| Solution | Description | Outils |
| -------- | ----------- | ------ |
| SBOM (Software Bill of Materials) | Inventaire complet de tous les composants d'un logiciel | Syft, CycloneDX, SPDX |
| Signature de code | Signer les artefacts pour garantir leur intégrité | Sigstore (Cosign), GPG |
| Provenance | Prouver où et comment un artefact a été construit | SLSA framework, in-toto |
| Lock files | Figer les versions exactes des dépendances | package-lock.json, Pipfile.lock, Cargo.lock |
| Dependabot / Renovate | Mise à jour automatique des dépendances vulnérables | Dependabot (GitHub), Renovate |

---

### Qu'est-ce qu'un SBOM ?

**Définition** : un SBOM (Software Bill of Materials) est un inventaire détaillé de tous les composants (bibliothèques, frameworks, outils) utilisés dans un logiciel. C'est l'équivalent de la liste d'ingrédients sur un produit alimentaire.

**Le problème que le SBOM résout** :

1. **Réponse aux vulnérabilités** : quand une nouvelle CVE est publiée (comme Log4Shell), le SBOM permet de savoir en quelques minutes si le logiciel est affecté
2. **Conformité** : L'Executive Order US 14028 a poussé le SBOM côté administrations américaines. En Europe, le Cyber Resilience Act (CRA) impose un SBOM pour les produits numériques concernés ; NIS2 exige une gestion des risques de la chaîne d'approvisionnement, sans imposer à lui seul un format SBOM
3. **Transparence** : les clients peuvent vérifier les composants utilisés et évaluer les risques

**Formats de SBOM** :

| Format | Organisme | Utilisation |
| ------ | --------- | ----------- |
| CycloneDX | OWASP | Format complet (composants, vulnérabilités, licences) |
| SPDX | Linux Foundation | Standard ISO (ISO/IEC 5962:2021), orienté licences |

**Analogie concrète** : un SBOM est comme la liste d'ingrédients d'un plat cuisiné. Si un rappel sanitaire est émis sur un lot de farine contaminée, le fabricant peut immédiatement identifier quels plats contiennent cette farine. Sans la liste d'ingrédients, il faudrait tester chaque plat un par un.

---

### Qu'est-ce que le Threat Modeling ?

**Définition** : le threat modeling (modélisation des menaces) est une approche structurée pour identifier les menaces de sécurité d'une application pendant sa phase de conception. C'est le "shift-left" ultime : penser à la sécurité avant d'écrire la première ligne de code.

**Méthodologie STRIDE** :

| Lettre | Menace | Question à se poser | Exemple |
| ------ | ------ | ------------------- | ------- |
| S | Spoofing (usurpation) | Quelqu'un peut-il se faire passer pour un autre ? | Faux token JWT |
| T | Tampering (falsification) | Les données peuvent-elles être modifiées ? | Modification d'un paramètre de prix dans l'URL |
| R | Repudiation (répudiation) | Peut-on nier avoir fait une action ? | Absence de journalisation des actions administrateur |
| I | Information Disclosure | Des données sensibles peuvent-elles fuiter ? | Stack trace affichée en production |
| D | Denial of Service | Le service peut-il être rendu indisponible ? | Upload de fichier de 10 Go |
| E | Elevation of Privilege | Un utilisateur peut-il obtenir plus de droits ? | IDOR permettant d'accéder au profil admin |

---

### Qu'est-ce qu'un Security Champion ?

**Définition** : un Security Champion est un développeur qui, en plus de son rôle de développement, prend la responsabilité de promouvoir les bonnes pratiques de sécurité au sein de son équipe. Ce n'est pas un expert sécurité à temps plein, mais un relais entre l'équipe sécurité et l'équipe de développement.

**Rôle du Security Champion** :

| Responsabilité | Fréquence | Exemples |
| -------------- | --------- | -------- |
| Revue de code orientée sécurité | À chaque sprint | Vérifier les patterns de sécurité dans les PR |
| Triage des alertes SAST/SCA | Hebdomadaire | Différencier vrais positifs et faux positifs |
| Threat modeling | À chaque nouvelle fonctionnalité | Animer une session STRIDE avec l'équipe |
| Veille sécurité | Continue | Relayer les nouvelles vulnérabilités pertinentes |
| Formation des collègues | Mensuelle | Partager les bonnes pratiques lors des rétrospectives |

---

## Étapes Pratiques

### Étape 1 : Détecter des secrets avec GitLeaks

GitLeaks scanne l'historique Git complet pour trouver des secrets commités accidentellement.

```bash
# Installer GitLeaks
# macOS
brew install gitleaks

# Linux
curl -sSfL https://github.com/gitleaks/gitleaks/releases/download/v8.18.4/gitleaks_8.18.4_linux_x64.tar.gz | tar xz
sudo mv gitleaks /usr/local/bin/
```

```bash
# Scanner le répertoire courant (tous les commits)
gitleaks detect --source . --verbose

# Scanner uniquement les commits non poussés
gitleaks detect --source . --log-opts="origin/main..HEAD" --verbose

# Générer un rapport JSON
gitleaks detect --source . --report-format json --report-path gitleaks-report.json
```

Pour configurer GitLeaks en pre-commit hook :

```yaml
# Fichier .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.4
    hooks:
      - id: gitleaks
```

```bash
# Installer pre-commit et activer les hooks
pip install pre-commit
pre-commit install

# Maintenant, gitleaks s'exécute automatiquement avant chaque commit
# Si un secret est détecté, le commit est bloqué
```

**Résultat attendu** :

```text
$ gitleaks detect --source . --verbose

Finding:     AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
Secret:      AKIAIOSFODNN7EXAMPLE
RuleID:      aws-access-key-id
Entropy:     3.52
File:        config/settings.py
Line:        42
Commit:      a1b2c3d4e5f6
Author:      dev@example.com
Date:        2024-03-15T10:30:00Z

Finding:     password = "SuperSecretP@ss123"
Secret:      SuperSecretP@ss123
RuleID:      generic-password
Entropy:     4.12
File:        .env
Line:        8
Commit:      b2c3d4e5f6a7

12 commits scanned.
2 leaks found.
```

---

### Étape 2 : Analyser le code avec Semgrep (SAST)

Semgrep est un outil SAST open source qui détecte les vulnérabilités et les mauvaises pratiques dans le code source.

```bash
# Installer Semgrep
pip install semgrep

# Scanner avec les règles de sécurité par défaut
semgrep --config auto .

# Scanner avec les règles OWASP Top 10 spécifiquement
semgrep --config "p/owasp-top-ten" .

# Scanner uniquement les fichiers Python
semgrep --config auto --lang python .

# Générer un rapport JSON
semgrep --config auto --json --output semgrep-report.json .
```

Exemple de code vulnérable que Semgrep détecte :

```python
# Fichier app.py avec des vulnérabilités

from flask import Flask, request
import subprocess
import sqlite3

app = Flask(__name__)

# Vulnérabilité 1 : Injection SQL
@app.route("/user")
def get_user():
    user_id = request.args.get("id")
    # DANGEREUX : concaténation directe dans la requête SQL
    query = f"SELECT * FROM users WHERE id = {user_id}"
    conn = sqlite3.connect("app.db")
    result = conn.execute(query)
    return str(result.fetchall())

# Vulnérabilité 2 : Injection de commandes
@app.route("/ping")
def ping():
    host = request.args.get("host")
    # DANGEREUX : entrée utilisateur dans une commande système
    output = subprocess.check_output(f"ping -c 1 {host}", shell=True)
    return output

# Vulnérabilité 3 : Debug mode en production
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
```

**Résultat attendu** :

```text
$ semgrep --config auto app.py

  app.py
    python.flask.security.injection.sql-injection
      Détection d'une injection SQL potentielle. L'entrée utilisateur
      est directement concaténée dans une requête SQL.
      Ligne 14: query = f"SELECT * FROM users WHERE id = {user_id}"
      Correction : utiliser des requêtes paramétrées.

    python.flask.security.injection.command-injection
      Détection d'une injection de commandes. L'entrée utilisateur
      est passée directement à subprocess avec shell=True.
      Ligne 21: output = subprocess.check_output(f"ping -c 1 {host}", shell=True)
      Correction : utiliser une liste d'arguments sans shell=True.

    python.flask.security.misconfiguration.debug-enabled
      L'application Flask est lancée en mode debug.
      Cela expose des informations sensibles et un shell interactif.
      Ligne 25: app.run(debug=True, host="0.0.0.0")
      Correction : désactiver le mode debug en production.

  3 findings found.
```

---

### Étape 3 : Analyser les dépendances avec Snyk (SCA)

Snyk analyse les fichiers de dépendances (package.json, requirements.txt, pom.xml) pour détecter les bibliothèques vulnérables.

```bash
# Installer Snyk CLI
npm install -g snyk

# Authentification (nécessaire pour la première utilisation)
snyk auth

# Scanner les dépendances d'un projet Node.js
snyk test

# Scanner les dépendances d'un projet Python
snyk test --file=requirements.txt

# Scanner un fichier Docker
snyk container test nginx:latest

# Surveiller en continu (Snyk enverra des alertes)
snyk monitor
```

Alternative avec `pip-audit` pour Python (fonctionne offline) :

```bash
# Installer pip-audit
pip install pip-audit

# Scanner les dépendances installées
pip-audit

# Scanner un fichier requirements.txt spécifique
pip-audit -r requirements.txt

# Générer un rapport JSON
pip-audit --format json --output audit-report.json
```

**Résultat attendu** :

```text
$ pip-audit -r requirements.txt

Found 3 known vulnerabilities in 2 packages

Name       Version  ID                   Fix Versions
---------- -------- -------------------- ------------
flask      2.0.1    PYSEC-2023-62        2.3.2
requests   2.25.1   CVE-2023-32681       2.31.0
requests   2.25.1   CVE-2024-35195       2.32.0
jinja2     3.0.3    CVE-2024-22195       3.1.3

Recommandation : mettre à jour les packages vulnérables
pip install flask==2.3.2 requests==2.32.0 jinja2==3.1.3
```

---

### Étape 4 : Configurer un pipeline CI/CD sécurisé (GitHub Actions)

Ce fichier GitHub Actions intègre les tests de sécurité dans le pipeline CI/CD.

```yaml
# .github/workflows/security.yml
name: Security Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Job 1 : Détection de secrets
  secrets-detection:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
        with:
          fetch-depth: 0  # Historique complet pour scanner tous les commits

      - name: Détecter les secrets avec GitLeaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  # Job 2 : Analyse statique du code (SAST)
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Analyse SAST avec Semgrep
        uses: semgrep/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/owasp-top-ten
            p/python

  # Job 3 : Analyse des dépendances (SCA)
  sca:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Installer Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Installer les dépendances
        run: pip install -r requirements.txt

      - name: Audit des dépendances avec pip-audit
        run: pip-audit -r requirements.txt --format json --output sca-report.json

      - name: Sauvegarder le rapport
        uses: actions/upload-artifact@v5
        with:
          name: sca-report
          path: sca-report.json

  # Job 4 : Scan des images Docker
  container-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Build de l'image Docker
        run: docker build -t mon-app:${{ github.sha }} .

      - name: Scanner l'image avec Trivy
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: "mon-app:${{ github.sha }}"
          format: "sarif"
          output: "trivy-report.sarif"
          severity: "CRITICAL,HIGH"
          exit-code: "1"  # Échouer si vulnérabilité critique trouvée

  # Job 5 : Générer le SBOM
  sbom:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Générer le SBOM avec Syft
        uses: anchore/sbom-action@v0
        with:
          format: cyclonedx-json
          output-file: sbom.json

      - name: Sauvegarder le SBOM
        uses: actions/upload-artifact@v5
        with:
          name: sbom
          path: sbom.json
```

**Résultat attendu** :

```text
Le pipeline s'exécute automatiquement à chaque push et pull request.
Les 5 jobs tournent en parallèle :

✅ secrets-detection    (32s)  - 0 secrets trouvés
❌ sast                 (1m 12s) - 3 vulnérabilités détectées
⚠️ sca                  (45s)  - 2 dépendances vulnérables
✅ container-scan       (2m 03s) - 0 vulnérabilités critiques
✅ sbom                 (28s)  - SBOM généré (324 composants)

Si un job échoue (❌), le merge de la pull request est bloqué
jusqu'à ce que les vulnérabilités soient corrigées.
```

---

### Étape 5 : Générer et signer un SBOM

Le SBOM documente tous les composants du logiciel. La signature garantit son authenticité.

```bash
# Installer Syft (générateur de SBOM)
curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin

# Générer un SBOM depuis un dossier de projet
syft dir:. -o cyclonedx-json > sbom.json

# Générer un SBOM depuis une image Docker
syft nginx:latest -o cyclonedx-json > sbom-nginx.json

# Générer un SBOM au format SPDX
syft dir:. -o spdx-json > sbom-spdx.json
```

```bash
# Scanner le SBOM pour les vulnérabilités avec Grype
# Installer Grype
curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin

# Analyser le SBOM
grype sbom:./sbom.json

# Analyser uniquement les vulnérabilités critiques
grype sbom:./sbom.json --only-fixed --fail-on critical
```

```bash
# Signer le SBOM avec Cosign (Sigstore)
# Installer Cosign
brew install cosign  # macOS
# ou : go install github.com/sigstore/cosign/v2/cmd/cosign@latest

# Signer le SBOM (utilise l'identité OIDC - pas besoin de clé locale)
cosign sign-blob --yes sbom.json --bundle sbom.json.bundle

# Vérifier la signature
cosign verify-blob sbom.json --bundle sbom.json.bundle \
    --certificate-identity="user@example.com" \
    --certificate-oidc-issuer="https://accounts.google.com"
```

**Résultat attendu** :

```text
$ syft dir:. -o cyclonedx-json > sbom.json
 ✔ Indexed .
 ✔ Cataloged packages [324 packages]

$ grype sbom:./sbom.json
NAME              VERSION   VULNERABILITY   SEVERITY
flask             2.0.1     CVE-2023-30861  High
requests          2.25.1    CVE-2023-32681  Medium
jinja2            3.0.3     CVE-2024-22195  Medium
pillow            9.0.0     CVE-2022-22817  Critical

4 vulnerabilities found (1 critical, 1 high, 2 medium)

$ cosign sign-blob --yes sbom.json --bundle sbom.json.bundle
Using payload from: sbom.json
Signature written to sbom.json.bundle
```

---

### Étape 6 : Scanner les images Docker pour la sécurité

La sécurité des conteneurs couvre l'analyse des images, la protection au runtime et les contrôles d'admission.

```bash
# Scanner une image Docker avec Trivy
trivy image --severity CRITICAL,HIGH mon-app:latest

# Scanner en ignorant les vulnérabilités sans correctif disponible
trivy image --ignore-unfixed mon-app:latest

# Vérifier la conformité d'un Dockerfile
# (détecte les mauvaises pratiques : root, COPY *, pas de healthcheck)
trivy config Dockerfile
```

Exemple de Dockerfile sécurisé :

```dockerfile
# Étape 1 : Build (image de build, jetée à la fin)
FROM python:3.12-slim AS builder

# Créer un utilisateur non-root dès le début
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Copier uniquement les fichiers de dépendances d'abord (cache Docker)
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Copier le code source
COPY . .

# Étape 2 : Image de production (minimale)
FROM python:3.12-slim

# Installer uniquement les dépendances système nécessaires
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Créer l'utilisateur non-root
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copier les packages Python depuis l'étape de build
COPY --from=builder /root/.local /home/appuser/.local

# Copier le code source
COPY --from=builder /app /app

WORKDIR /app

# Ne pas exécuter en root
USER appuser

# Healthcheck pour les orchestrateurs
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Port non privilégié
EXPOSE 8000

CMD ["python", "-m", "gunicorn", "app:create_app()", "--bind", "0.0.0.0:8000"]
```

**Résultat attendu** :

```text
$ trivy config Dockerfile

Dockerfile (dockerfile)

Tests: 12 (SUCCESSES: 9, FAILURES: 3, EXCEPTIONS: 0)
Failures: 3 (HIGH: 1, MEDIUM: 2)

HIGH: Specify a tag in the 'FROM' statement for image 'python'
  Utiliser 'python:3.12-slim' au lieu de 'python:latest'

MEDIUM: Add HEALTHCHECK instruction
  Ajouter un HEALTHCHECK pour le monitoring

MEDIUM: Use COPY instead of ADD
  ADD peut décompresser des archives et télécharger des URLs,
  COPY est plus prévisible et sûr
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `gitleaks detect --source .` | Scanner l'historique Git pour des secrets |
| `semgrep --config auto .` | Analyse SAST du code source |
| `pip-audit -r requirements.txt` | Audit SCA des dépendances Python |
| `snyk test` | Audit SCA des dépendances (multi-langage) |
| `trivy image nginx:latest` | Scanner une image Docker |
| `trivy config Dockerfile` | Vérifier un Dockerfile |
| `syft dir:. -o cyclonedx-json` | Générer un SBOM |
| `grype sbom:./sbom.json` | Scanner un SBOM pour les vulnérabilités |
| `cosign sign-blob sbom.json` | Signer un fichier avec Sigstore |
| `docker scout cves nginx:latest` | Scanner une image avec Docker Scout |

---

## Pièges Fréquents

### Piège 1 : Ignorer les faux positifs sans investigation

⚠️ **Problème** : les outils SAST génèrent des faux positifs. L'équipe prend l'habitude de les ignorer en masse, et finit par ignorer aussi les vrais positifs. C'est le phénomène de "fatigue des alertes".

✅ **Solution** : configurer les règles de l'outil pour réduire les faux positifs. Documenter chaque suppression (avec un commentaire expliquant pourquoi c'est un faux positif). Revoir régulièrement les suppressions.

```python
# Semgrep : désactiver un avertissement avec justification
# nosemgrep: python.flask.security.injection.sql-injection
# Justification : user_id provient d'un token JWT validé, pas d'une entrée utilisateur
query = f"SELECT * FROM users WHERE id = {user_id}"
```

---

### Piège 2 : Scanner uniquement le code maison et oublier les dépendances

⚠️ **Problème** : les outils SAST analysent le code de l'application, mais pas les bibliothèques tierces. Or, dans une application moderne, 80% du code provient de dépendances. Log4Shell était dans une bibliothèque, pas dans le code des applications.

✅ **Solution** : combiner SAST (code maison) + SCA (dépendances) + scan d'images (conteneurs). Les trois sont complémentaires et nécessaires.

---

### Piège 3 : Mettre la sécurité en mode "blocage" dès le premier jour

⚠️ **Problème** : configurer tous les outils de sécurité pour bloquer le pipeline dès la première vulnérabilité trouvée. Les développeurs ne peuvent plus déployer, se sentent frustrés et contournent les contrôles.

✅ **Solution** : adopter une approche progressive. Commencer en mode "alerte" (les vulnérabilités sont signalées mais ne bloquent pas). Réduire progressivement le seuil de tolérance. Bloquer uniquement les vulnérabilités critiques au début, puis élargir.

---

### Piège 4 : Croire que le SBOM est un document ponctuel

⚠️ **Problème** : générer un SBOM une fois lors de la release et ne plus le mettre à jour. Le SBOM devient obsolète dès le premier patch de dépendance.

✅ **Solution** : intégrer la génération du SBOM dans le pipeline CI/CD. Chaque build produit un SBOM à jour. Stocker les SBOM avec les artefacts de build pour la traçabilité.

---

### Piège 5 : Oublier la sécurité du pipeline CI/CD lui-même

⚠️ **Problème** : sécuriser l'application mais laisser le pipeline CI/CD vulnérable. Les secrets du pipeline (tokens, clés de déploiement) sont accessibles à tous les développeurs. Les workflows GitHub Actions utilisent des actions tierces non vérifiées.

✅ **Solution** : appliquer le principe du moindre privilège au pipeline. Utiliser des environments GitHub avec des reviewers. Épingler les versions des actions tierces par hash SHA (pas par tag). Auditer régulièrement les permissions du pipeline.

```yaml
# Mauvaise pratique : utiliser un tag (peut être modifié par l'auteur)
- uses: actions/checkout@v5

# Bonne pratique : épingler par hash SHA (immuable)
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
```

---

## Checklist de Validation

- [ ] Je comprends le concept de shift-left et pourquoi détecter tôt coûte moins cher
- [ ] Je connais la différence entre SAST, DAST, SCA et IAST
- [ ] Je sais configurer GitLeaks en pre-commit hook pour détecter les secrets
- [ ] Je sais utiliser Semgrep pour analyser le code source (SAST)
- [ ] Je sais utiliser pip-audit ou Snyk pour analyser les dépendances (SCA)
- [ ] Je sais écrire un pipeline CI/CD GitHub Actions avec les tests de sécurité
- [ ] Je comprends ce qu'est un SBOM et comment le générer avec Syft
- [ ] Je sais scanner et sécuriser des images Docker avec Trivy
- [ ] Je connais la méthodologie STRIDE pour le threat modeling
- [ ] Je comprends le rôle d'un Security Champion dans une équipe

---

## Exercice Pratique

**Énoncé** : Tu rejoins une startup qui développe une application web Python/Flask. L'application est déployée manuellement via SSH sur un serveur. Il n'y a aucun pipeline CI/CD ni aucun test de sécurité. Tu dois mettre en place une stratégie DevSecOps complète.

**Indications** :

- Propose un pipeline CI/CD complet avec les étapes de sécurité
- Pour chaque étape, indique l'outil choisi et pourquoi
- Définis les seuils de blocage (quand le pipeline échoue)
- Propose un plan d'adoption progressif (mois 1, mois 2, mois 3)
- Décris le processus de gestion des vulnérabilités (triage, correction, vérification)

**Résultat attendu** : un document de stratégie DevSecOps avec le pipeline, les outils, les seuils et le planning.

---

## Solution de l'Exercice

> **Note** : cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**1. Pipeline CI/CD sécurisé proposé** :

```text
Developer → Pre-commit hooks → Git Push → GitHub Actions Pipeline :

┌─────────────────────────────────────────────────────────────────┐
│                    PIPELINE CI/CD SÉCURISÉ                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Pre-commit]                                                    │
│  ├── GitLeaks (secrets)                                         │
│  └── Semgrep (quick SAST)                                       │
│                                                                  │
│  [Build]                                                         │
│  ├── Tests unitaires                                            │
│  ├── SAST complet (Semgrep)                                     │
│  ├── SCA (pip-audit)                                            │
│  └── Lint sécurité (Bandit)                                     │
│                                                                  │
│  [Package]                                                       │
│  ├── Build image Docker                                         │
│  ├── Scan image (Trivy)                                         │
│  └── Génération SBOM (Syft)                                     │
│                                                                  │
│  [Test]                                                          │
│  ├── Déploiement staging                                        │
│  ├── DAST (OWASP ZAP)                                           │
│  └── Tests d'intégration                                        │
│                                                                  │
│  [Deploy]                                                        │
│  ├── Signature image (Cosign)                                   │
│  ├── Vérification admission (politique Kyverno)                 │
│  └── Déploiement production                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**2. Choix des outils** :

| Étape | Outil | Justification |
| ----- | ----- | ------------- |
| Secrets | GitLeaks | Open source, rapide, configurable, pre-commit + CI |
| SAST | Semgrep | Open source, multi-langage, règles personnalisables, faible taux de faux positifs |
| SCA | pip-audit | Open source, fonctionne offline, spécialisé Python |
| Container scan | Trivy | Open source, multi-cible (images, IaC, SBOM), rapide |
| DAST | OWASP ZAP | Open source, référence OWASP, automatisable |
| SBOM | Syft + Grype | Écosystème Anchore, formats standards (CycloneDX, SPDX) |
| Signature | Cosign (Sigstore) | Keyless signing, standard de l'industrie |

**3. Seuils de blocage** :

| Mois | SAST | SCA | Container | DAST |
| ---- | ---- | --- | --------- | ---- |
| Mois 1 | Alerte seulement | Alerte seulement | Alerte seulement | Non déployé |
| Mois 2 | Bloque sur CRITICAL | Bloque sur CRITICAL | Bloque sur CRITICAL | Alerte seulement |
| Mois 3 | Bloque sur HIGH+ | Bloque sur HIGH+ | Bloque sur HIGH+ | Bloque sur HIGH+ |

**4. Plan d'adoption progressif** :

**Mois 1 - Fondations** :

- Mettre en place le pipeline CI/CD (GitHub Actions)
- Intégrer GitLeaks en pre-commit hook
- Intégrer Semgrep et pip-audit en mode alerte
- Former l'équipe aux bases du DevSecOps (1 session de 2h)
- Désigner un Security Champion dans l'équipe

**Mois 2 - Renforcement** :

- Activer le blocage sur les vulnérabilités critiques
- Ajouter le scan d'images Docker (Trivy)
- Mettre en place le DAST sur l'environnement de staging
- Commencer la génération de SBOM
- Première session de threat modeling (STRIDE) sur une fonctionnalité existante

**Mois 3 - Maturité** :

- Augmenter les seuils de blocage (HIGH+)
- Signer les images de conteneurs avec Cosign
- Intégrer le SBOM dans le pipeline
- Mettre en place les métriques de sécurité (MTTR, nombre de vulnérabilités ouvertes)
- Rétrospective et ajustement

**5. Processus de gestion des vulnérabilités** :

```text
Détection (outil) → Triage (Security Champion) → Classification → Correction → Vérification

Classification :
- CRITIQUE : correction dans les 24h, hotfix
- ÉLEVÉ : correction dans le sprint en cours (< 2 semaines)
- MOYEN : planification dans le prochain sprint
- FAIBLE : ajout au backlog, correction quand possible

Triage :
1. Le Security Champion reçoit l'alerte
2. Il vérifie si c'est un vrai positif ou un faux positif
3. Si faux positif : documentation et suppression avec commentaire
4. Si vrai positif : création d'un ticket avec sévérité et assignation
5. Le développeur corrige et pousse une nouvelle version
6. Le pipeline vérifie que la vulnérabilité est corrigée
```

---

## Navigation

← Fiche précédente : **[04 - Sécurité Mobile et IoT](04-securite-mobile-iot.md)**
