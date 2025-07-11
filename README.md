# 🤖 LetHimCookAI - Plateforme IA Culinaire avec Abonnements

Une plateforme complète d'agents IA spécialisés en cuisine avec :

- 🍳 **3 agents IA culinaires** (Basic, Premium, Business)
- 💳 **Système d'abonnements Stripe** (FREE, PREMIUM, BUSINESS)
- 🏢 **Marketplace de prestataires** culinaires
- 🔐 **Authentification sécurisée** avec JWT
- 🌐 **Interface web moderne** avec Next.js

## ✨ Nouveautés - Système d'abonnements

### 💎 Plans disponibles :

- **🆓 FREE** : Accès à l'IA Cuisinier Basic (gratuit)
- **💎 PREMIUM** (19€/mois) : Basic + Premium - Génération d'images, logos, PDFs
- **🚀 BUSINESS** (49€/mois) : Premium + Business - Recherche services, analyse marché

### 🔒 Sécurité des paiements :

- ✅ **Paiements sécurisés** par Stripe
- ✅ **Webhooks** pour validation automatique
- ✅ **Double vérification** des sessions
- ✅ **Impossible de contourner** les paiements

### 🎯 Fonctionnalités :

- **Pages d'abonnement** : `/subscriptions`, `/subscriptions/manage`
- **Paiement en 1 clic** avec cartes de test
- **Mise à jour automatique** des permissions
- **Gestion des annulations** et renouvellements

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Vérifier la configuration (optionnel)
npm run check-env

# Créer le fichier .env avec vos variables d'environnement
# (voir section "Configuration de la base de données" ci-dessous)
```

## 🐳 Docker

Ce projet utilise Docker Compose pour orchestrer l'application complète (Next.js + Express.js + PostgreSQL + Adminer).

### Démarrage avec Docker (Recommandé)

```bash
# Construire et démarrer tous les services
docker compose up -d

# Voir les logs en temps réel
docker compose logs -f

# Vérifier que tous les conteneurs fonctionnent
docker ps
```

### Services disponibles

- **🌐 Application web** : http://localhost:3000 (Next.js)
- **🤖 API Agents** : http://localhost:8080 (Express.js)
- **🗄️ Base de données** : localhost:5432 (PostgreSQL)
- **💻 Adminer** : http://localhost:8081 (Interface DB)

### Commandes Docker utiles

```bash
# Arrêter tous les services
docker compose down

# Reconstruire les images
docker compose build

# Redémarrer un service spécifique
docker compose restart typescript-app

# Voir les logs d'un service
docker compose logs typescript-app

# Accéder au shell du conteneur
docker compose exec typescript-app bash

# Supprimer les volumes (attention: supprime les données DB)
docker compose down -v
```

### 🚨 Dépannage Docker

```bash
# Problème : "Port already in use"
# Solution : Arrêter les services conflictuels
docker compose down
sudo lsof -ti:3000 | xargs kill -9  # Tuer le processus sur port 3000
sudo lsof -ti:8080 | xargs kill -9  # Tuer le processus sur port 8080

# Problème : "Database connection failed"
# Solution : Vérifier l'état de la base de données
docker compose logs db
docker compose exec db pg_isready -U postgres

# Problème : "Cannot connect to database" 
# Solution : Attendre que la DB soit complètement démarrée
docker compose up db
# Attendre le message "database system is ready to accept connections"
# Puis démarrer l'application
docker compose up typescript-app

# Problème : Modifications du code non prises en compte
# Solution : Vérifier les volumes et rebuild si nécessaire
docker compose down
docker compose build --no-cache
docker compose up -d

# Nettoyer complètement en cas de problème
docker compose down -v --remove-orphans
docker system prune -f
docker compose up -d
```

## 🗄️ Base de données

Ce projet utilise PostgreSQL avec Prisma ORM.

### Démarrage de la base de données uniquement

```bash
# Si vous voulez seulement PostgreSQL (sans Docker Compose complet)
docker run -d \
  --name cookai_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=cookai \
  -p 5432:5432 \
  postgres:latest

# Vérifier que le conteneur fonctionne
docker ps
```

### Configuration de l'environnement

#### 🐳 Pour Docker

Créez un fichier `.env` à la racine du projet :

```env
# Base de données PostgreSQL (requis)
DATABASE_URL="postgresql://postgres:postgres@db:5432/cookai"

# OpenAI API Key (requis pour les agents Premium/Business)
OPENAI_API_KEY="your-openai-api-key-here"

# Stripe (requis pour les abonnements)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"

# JWT pour l'authentification
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Variables optionnelles
NODE_ENV="development"
```

#### 💻 Pour le développement local

Créez un fichier `.env.local` à la racine du projet :

```env
# Base de données PostgreSQL (requis)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cookai"

# Même configuration que pour Docker mais avec localhost au lieu de 'db'
# ... (reste identique)
```

**📝 Note importante :** 
- **Docker** utilise le fichier `.env` (hostname `db` pour la base de données)
- **Développement local** utilise `.env.local` (hostname `localhost`)
- Tous les composants (agents, CLI, interface web) partagent cette configuration centralisée

### Migrations Prisma

```bash
# Appliquer les migrations (première fois)
npx prisma migrate dev

# Générer le client Prisma
npx prisma generate

# Peupler la base avec des données de test
npm run seed

# Visualiser les données avec Prisma Studio
npx prisma studio
```

### Commandes utiles

```bash
# Réinitialiser complètement la base
npx prisma migrate reset --force

# Créer une nouvelle migration
npx prisma migrate dev --name nom_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Créer des utilisateurs de test
npm run seed-users
```

## 🚀 Démarrage rapide

### 🐳 Option 1 : Avec Docker (Recommandé)

```bash
# 1. Démarrer tous les services (app + base de données)
docker compose up -d

# 2. Attendre que la base soit prête (environ 30 secondes)
docker compose logs db

# 3. Appliquer les migrations Prisma dans le conteneur
docker compose exec typescript-app npx prisma migrate dev

# 4. Peupler avec des données de test
docker compose exec typescript-app npm run seed

# 5. Créer des utilisateurs de test pour l'authentification
docker compose exec typescript-app npm run seed-users
```

**Accès aux services :**
- 🌐 Application web : http://localhost:3000 
- 🤖 API Agents : http://localhost:8080
- 💻 Adminer (DB) : http://localhost:8081

### 💻 Option 2 : Développement local (sans Docker)

```bash
# 1. Démarrer uniquement PostgreSQL
docker run -d --name cookai_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=cookai \
  -p 5432:5432 postgres:latest

# 2. Installer les dépendances
npm install

# 3. Appliquer les migrations
npx prisma migrate dev

# 4. Peupler avec des données de test
npm run seed && npm run seed-users

# 5. Démarrer les serveurs
npm run dev-all
```

Le serveur sera accessible sur `http://localhost:3000`

## 👥 Comptes de test pour l'authentification

Après avoir exécuté `npm run seed-users`, vous pouvez tester l'authentification avec ces comptes :

### 🧑‍💼 **Clients avec différents abonnements**

- **🆓 Client FREE :** `client@test.fr` / `TestClient123`

  - Accès IA Basic uniquement
  - Plan : FREE, Status : ACTIVE

- **💎 Client PREMIUM :** `client-premium@test.fr` / `TestClient123`

  - Accès IA Basic + Premium
  - Plan : PREMIUM, Status : ACTIVE, expire dans 30 jours

- **🚀 Client BUSINESS :** `client-business@test.fr` / `TestClient123`
  - Accès à toutes les IAs (Basic + Premium + Business)
  - Plan : BUSINESS, Status : ACTIVE, expire dans 1 an

### 🏢 **Prestataire**

- **Email :** `prestataire@test.fr`
- **Mot de passe :** `TestPrestataire123`
- **Rôle :** PRESTATAIRE
- **Nom :** Marie Martin
- **Organisation :** Lié à une organisation existante

### ⚙️ **Admin**

- **Email :** `admin@lethimcookai.fr`
- **Mot de passe :** `AdminTest123`
- **Rôle :** ADMIN
- **Nom :** Admin LetHimCookAI

### 🧪 **Test de l'authentification**

1. Allez sur `/auth/login`
2. Connectez-vous avec un des comptes ci-dessus
3. Observez les changements dans le header (nom d'utilisateur, bouton déconnexion)
4. Les prestataires voient en plus le bouton "Publier un service"
5. Testez l'inscription sur `/auth/register` pour créer de nouveaux comptes

### 💰 **Test du système d'abonnements**

Le système d'abonnements contrôle l'accès aux différents agents IA :

1. **Connectez-vous avec un client FREE** et allez sur `/chat` :

   - ✅ Accès à l'agent "Cuisinier Basic"
   - 🔒 Agents Premium et Business grisés avec message d'upgrade

2. **Connectez-vous avec un client PREMIUM** :

   - ✅ Accès aux agents Basic et Premium
   - 🔒 Agent Business grisé

3. **Connectez-vous avec un client BUSINESS** :
   - ✅ Accès complet à tous les agents (Basic, Premium, Business)

Les agents non accessibles affichent :

- Interface grisée avec icône 🔒
- Message d'upgrade personnalisé
- Bouton "Upgrader maintenant" (interface préparée)

### 3. Démarrer le serveur CLI (optionnel)

```bash
# Démarrer le serveur Express pour le CLI
npm run server

# Ou en mode développement avec rechargement automatique
npm run dev
```

Le serveur CLI sera accessible sur `http://localhost:8080`

### 4. Utiliser le CLI

```bash
# Vérifier la connectivité et lister les agents
npm run cli check

# Démarrer une session de chat
npm run cli chat

# Utiliser un agent spécifique
npm run cli chat --agent cuisinier
```

## 🌐 API Endpoints

### API Prestataires (Next.js)

#### Services (Prestataires)

Chaque service contient maintenant tous les champs suivants :

- **Informations de base** : `title`, `summary`, `description`
- **Média** : `mainMedia` (bannière/image principale)
- **Types** :
  - `serviceType` : `IRL`, `ONLINE`, `MIXED`
  - `consumptionType` : `INSTANT`, `PERIODIC`, `PRESTATION`
  - `billingPlan` : `UNIT`, `USAGE`, `MINUTE`, `MENSUAL`, `ANNUAL`, `PROJECT`
  - `paymentMode` : `CREDIT`, `EUR`, `USD`, `GBP`, `CRYPTO`
- **Tarification** : `lowerPrice`, `upperPrice`
- **Métadonnées** : `tags[]`, `isAIReplaceable` (booléen)
- **Organisation** : relation vers l'organisation propriétaire

#### Endpoints disponibles

```http
# Lister tous les prestataires avec filtres
GET /api/services
GET /api/services?page=1&limit=10
GET /api/services?search=restaurant
GET /api/services?sector=cuisine
GET /api/services?aiReplaceable=false
GET /api/services?minPrice=300&maxPrice=800
GET /api/services?serviceType=ONLINE
GET /api/services?consumptionType=PERIODIC
GET /api/services?billingPlan=MENSUAL
GET /api/services?paymentMode=EUR
GET /api/services?tags=branding&tags=photo

# Récupérer un prestataire spécifique
GET /api/services/{id}

# Lister toutes les organisations
GET /api/organizations
GET /api/organizations?sector=marketing
GET /api/organizations?search=photo
```

#### Filtres disponibles

- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'éléments par page (défaut: 10)
- `search` : Recherche dans title, summary, description et nom d'organisation
- `sector` : Filtrer par secteur d'activité de l'organisation
- `aiReplaceable` : `true` ou `false` pour filtrer les services remplaçables par IA
- `minPrice` / `maxPrice` : Filtrer par plage de prix
- `serviceType` : `IRL`, `ONLINE`, `MIXED`
- `consumptionType` : `INSTANT`, `PERIODIC`, `PRESTATION`
- `billingPlan` : `UNIT`, `USAGE`, `MINUTE`, `MENSUAL`, `ANNUAL`, `PROJECT`
- `paymentMode` : `CREDIT`, `EUR`, `USD`, `GBP`, `CRYPTO`
- `tags` : Filtrer par tags (peut être répété)

#### Exemples d'utilisation

```bash
# Services de photographie culinaire en mode IRL
curl "http://localhost:3000/api/services?search=photo&serviceType=IRL"

# Services mensuels avec budget 50-500€
curl "http://localhost:3000/api/services?billingPlan=MENSUAL&minPrice=50&maxPrice=500"

# Services remplaçables par IA dans le secteur cuisine
curl "http://localhost:3000/api/services?sector=cuisine&aiReplaceable=true"

# Services avec tags spécifiques
curl "http://localhost:3000/api/services?tags=branding&tags=marketing"
```

### API Agents (Express.js)

```http
# Vérification de santé
GET /health

# Liste des agents
GET /agents

# Chat avec un agent
POST /{agentId}/invoke
POST /{agentId}/stream
```

## 🔧 Configuration

### Variables d'environnement

1. **Copiez le fichier d'exemple** :

   ```bash
   cp .env.example .env.local
   ```

2. **Éditez `.env.local`** avec vos vraies valeurs :

   ```bash
   # 🔑 AUTHENTIFICATION (OBLIGATOIRE)
   JWT_SECRET=your-super-secret-jwt-key-change-in-production

   # 🗄️ BASE DE DONNÉES (OBLIGATOIRE)
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/lethimcookai

   # 🤖 INTELLIGENCE ARTIFICIELLE (OBLIGATOIRE)
   OPENAI_API_KEY=sk-your-real-openai-api-key-here

   # 💳 STRIPE PAIEMENTS (OBLIGATOIRE POUR ABONNEMENTS)
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

   # 🌐 CONFIGURATION SERVEURS (OPTIONNEL)
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   EXPRESS_PORT=8080
   API_URL=http://localhost:8080
   API_BEARER_TOKEN=dummy-token-for-development
   ```

3. **Vérifiez votre configuration** :
   ```bash
   npm run check-env
   ```

### 🎯 Configuration Stripe (Système d'abonnements)

Pour activer le système de paiement et d'abonnements :

1. **Créez un compte Stripe** : https://stripe.com
2. **Récupérez vos clés de test** : https://dashboard.stripe.com/test/apikeys
3. **Configurez un webhook** :

   - URL : `https://votre-domaine.com/api/subscriptions/webhook`
   - Événements : `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`
   - Copiez le secret du webhook : `whsec_...`

4. **Plans disponibles** :
   - **FREE** : Accès à l'IA Cuisinier Basic (gratuit)
   - **PREMIUM** : Basic + Premium (19€/mois) - Génération d'images, logos, PDFs
   - **BUSINESS** : Premium + Business (49€/mois) - Recherche services, analyse marché

> **💡 Structure des fichiers d'environnement** :
>
> - `.env.example` : Toutes les variables avec exemples et documentation
> - `.env.local` : Vos vraies valeurs (ne jamais committer)
> - Les agents chargent automatiquement `.env.local` en priorité
> - Utilisez `npm run check-env` pour diagnostiquer les problèmes

### CLI Token

Le CLI utilise le même fichier `.env.local` que les autres composants. Ajoutez si besoin :

```env
API_BEARER_TOKEN=dummy-token-for-development
```

## 📡 Endpoints API

### Vérification de santé

```http
GET /health
```

### Liste des agents

```http
GET /agents
Authorization: Bearer your-token
```

### Invocation directe

```http
POST /:agentId/invoke
Authorization: Bearer your-token
Content-Type: application/json

{
  "message": "Votre message",
  "thread_id": "optional-thread-id"
}
```

### Streaming SSE

```http
POST /:agentId/stream
Authorization: Bearer your-token
Content-Type: application/json

{
  "message": "Votre message",
  "thread_id": "optional-thread-id"
}
```

### Arrêter la génération

```http
POST /:agentId/stop
Authorization: Bearer your-token
Content-Type: application/json

{
  "thread_id": "thread-id-to-stop"
}
```

### Gestion des conversations

```http
GET /conversations
GET /conversations/:threadId
Authorization: Bearer your-token
```

## 💬 Utilisation du CLI

### Commandes spéciales pendant le chat

- `!clear` - Réinitialiser la conversation
- `!debug` - Basculer le mode debug
- `exit` - Quitter le chat

### Options de ligne de commande

```bash
# Commande check
npm run cli check [options]
  --api-url <url>        URL de l'API
  --bearer-token <token> Token d'authentification
  -d, --debug           Mode debug

# Commande chat
npm run cli chat [options]
  -a, --agent <id>       ID de l'agent
  -i, --invoke          Mode invoke (pas de streaming)
  --api-url <url>        URL de l'API
  --bearer-token <token> Token d'authentification
  -d, --debug           Mode debug
  --no-context          Désactiver le contexte
```

## 🔄 Streaming et événements SSE

Le serveur supporte les Server-Sent Events avec les types d'événements suivants :

- `stream_start` - Début du streaming
- `stream_token` - Token de réponse
- `stream_end` - Fin du streaming
- `tool_execution_start` - Début d'utilisation d'outil
- `tool_execution_complete` - Fin d'utilisation d'outil
- `tool_execution_error` - Erreur d'outil
- `error` - Erreur générale

## 🛠️ Développement

### 🐳 Développement avec Docker

```bash
# Développement avec hot-reload
docker compose up -d

# Voir les logs en temps réel
docker compose logs -f typescript-app

# Accéder au shell du conteneur pour les commandes Prisma
docker compose exec typescript-app bash

# Redémarrer après changement de configuration
docker compose restart typescript-app

# Nettoyer et reconstruire
docker compose down && docker compose build && docker compose up -d
```

### 💻 Développement local

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement (hot-reload)
npm run dev-all

# Ou séparément
npm run dev        # Express.js sur port 8080
npm run dev-next   # Next.js sur port 3000
```

### Structure du projet

```
lethimcookai/
├── prisma/
│   ├── schema.prisma              # Schéma de la base de données
│   ├── migrations/                # Migrations Prisma
│   ├── seed.mts                   # Script de peuplement (ancien)
│   └── seed-with-organizations.mts # Script complet avec organisations
├── src/app/api/
│   ├── services/                  # API Routes pour les prestataires
│   └── organizations/             # API Routes pour les organisations
├── CLI/
│   ├── cli.mts                   # CLI pour tester les agents
│   └── agents_config.json        # Configuration des agents CLI
├── serveur/
│   ├── server.mts               # Serveur Express.js pour agents
│   └── agents-registry.mts      # Registre des agents
├── Agents/
│   └── cuisinier/               # Agent Cuisinier IA
│       ├── cuisinier-agent.mts
│       └── tools/
├── docker-compose.yml           # Configuration PostgreSQL
├── package.json                 # Dépendances et scripts
└── README.md                   # Documentation
```

### Structure de la base de données

#### Table `Organization`

```sql
id              UUID PRIMARY KEY
name            VARCHAR         -- Nom de l'organisation
description     TEXT           -- Description
logo            VARCHAR        -- URL du logo
website         VARCHAR        -- Site web
email           VARCHAR        -- Email de contact
phone           VARCHAR        -- Téléphone
address         TEXT          -- Adresse physique
sector          VARCHAR        -- Secteur (cuisine, marketing, etc.)
siret           VARCHAR        -- Numéro SIRET
tva             VARCHAR        -- Numéro TVA
legalForm       VARCHAR        -- Forme juridique (SARL, SAS, etc.)
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
```

#### Table `Service`

```sql
id              UUID PRIMARY KEY
title           VARCHAR         -- Titre du service
description     TEXT           -- Description détaillée
tags            VARCHAR[]      -- Tags/mots-clés
priceMin        FLOAT          -- Prix minimum
priceMax        FLOAT          -- Prix maximum
isAIReplaceable BOOLEAN        -- Remplaçable par l'IA
organizationId  UUID           -- FK vers Organization
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
```

### Scripts disponibles

```bash
# Base de données
npm run seed                # Peupler la base avec des données de test
npm run seed-users          # Créer des utilisateurs de test pour l'authentification

# Développement
npm run dev-next           # Next.js en mode développement
npm run dev                # Serveur Express en mode développement
npm run server             # Serveur Express en production

# CLI
npm run cli check          # Vérifier la connectivité des agents
npm run cli chat           # Chat avec les agents

# Build & Production
npm run build              # Build Next.js
npm run start              # Démarrer Next.js en production
```

### Exemples d'utilisation pratiques

#### Rechercher des prestataires photo dans le secteur cuisine

```bash
curl "http://localhost:3000/api/services?search=photo&sector=cuisine" | jq
```

#### Lister les organisations avec leurs services

```bash
curl "http://localhost:3000/api/organizations" | jq '.organizations[] | {name: .name, services_count: ._count.services}'
```

#### Trouver des services non remplaçables par l'IA

```bash
curl "http://localhost:3000/api/services?aiReplaceable=false" | jq '.services[] | {title: .title, organization: .organization.name}'
```

#### Filtrer par gamme de prix

```bash
curl "http://localhost:3000/api/services?minPrice=400&maxPrice=800" | jq
```

### Tests avec Postman

Importez cette collection pour tester rapidement :

```json
{
  "info": {
    "name": "LetHimCookAI API",
    "description": "Collection pour tester l'API des prestataires"
  },
  "item": [
    {
      "name": "Tous les services",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/services"
      }
    },
    {
      "name": "Services secteur cuisine",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/services?sector=cuisine"
      }
    },
    {
      "name": "Organisations",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/organizations"
      }
    },
    {
      "name": "Service par ID",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/services/{{serviceId}}"
      }
    }
  ]
}
```

## 🔐 Authentification et Sécurité

### Système d'authentification complet

- ✅ **Inscription/Connexion** avec JWT tokens
- ✅ **Hashage sécurisé** des mots de passe (bcrypt)
- ✅ **Rôles utilisateur** (CLIENT, PRESTATAIRE, ADMIN)
- ✅ **Validation robuste** des données
- ✅ **Session management** avec localStorage
- ✅ **API protégées** avec middleware d'authentification

### Sécurité serveur

- L'authentification par token Bearer est optionnelle (configurable)
- Les tokens sont stockés en mémoire côté serveur
- Les conversations sont en mémoire (remplacer par une DB en production)
- CORS configuré pour accepter toutes les origines (à restreindre en production)

## 📝 Exemples d'utilisation

### Test rapide

```bash
# Terminal 1 - Démarrer le serveur
npm run server

# Terminal 2 - Tester la connectivité
npm run cli check

# Terminal 3 - Commencer à chatter
npm run cli chat
```

### Avec authentification

```bash
# Avec token dans .env
BEARER_TOKEN=mon-super-token npm run server

# Utiliser le même token dans le CLI
npm run cli chat --bearer-token mon-super-token
```

### Mode debug

```bash
# Voir tous les détails des requêtes
npm run cli chat --debug
```

## 🚨 Limitations actuelles

- Agents simulés (MockAgent)
- Stockage en mémoire uniquement
- Pas de persistance des conversations
- Authentification basique
- Pas de rate limiting

## 🎯 Prochaines étapes

- [ ] Intégration avec de vrais agents LangChain
- [ ] Base de données pour la persistance
- [ ] Authentification robuste
- [ ] Rate limiting
- [ ] Interface web
- [ ] Docker
- [ ] Tests automatisés

## 📄 Licence

MIT

---

🚀 **Prêt à discuter avec vos agents IA !**
