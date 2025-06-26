# 🤖 LetHimCookAI - Agent CLI & Server avec API Prestataires

Un CLI et serveur JavaScript/TypeScript pour tester et interagir avec des agents IA, incluant une API complète pour la gestion des prestataires et organisations.

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Copier et configurer les variables d'environnement
cp .env.example .env
```

## 🗄️ Base de données

Ce projet utilise PostgreSQL avec Prisma ORM.

### Démarrage de la base de données

```bash
# Démarrer PostgreSQL avec Docker
docker compose up -d

# Vérifier que le conteneur fonctionne
docker ps
```

### Configuration de la base de données

Assurez-vous que votre fichier `.env` contient :

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cookai"
```

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

### 1. Démarrer la base de données

```bash
# Démarrer PostgreSQL
docker compose up -d

# Appliquer les migrations
npx prisma migrate dev

# Peupler avec des données de test
npm run seed

# Créer des utilisateurs de test pour l'authentification
npm run seed-users
```

### 2. Démarrer le serveur Next.js

```bash
# Démarrer Next.js en mode développement
npm run dev-next

# Ou en mode production
npm run build && npm run start
```

Le serveur sera accessible sur `http://localhost:3000`

## 👥 Comptes de test pour l'authentification

Après avoir exécuté `npm run seed-users`, vous pouvez tester l'authentification avec ces comptes :

### 🧑‍💼 **Client**
- **Email :** `client@test.fr`  
- **Mot de passe :** `TestClient123`
- **Rôle :** CLIENT
- **Nom :** Jean Dupont

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

Créez un fichier `.env` avec les variables suivantes :

```env
# Base de données
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cookai"

# Configuration API
API_URL=http://localhost:8080
PORT=8080

# Authentification (optionnelle)
BEARER_TOKEN=votre-token-ici
REQUIRE_AUTH=false

# Clés API pour les agents réels
OPENAI_API_KEY=sk-...
TAVILY_API_KEY=tvly-...
```

### CLI Token

Pour utiliser le CLI, créez un fichier `CLI/.env` :

```env
BEARER=dummy-token-for-development
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
