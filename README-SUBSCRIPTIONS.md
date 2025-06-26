# 💳 Système d'Abonnements LetHimCookAI

Guide complet pour configurer et utiliser le système de paiement Stripe.

## 🎯 Vue d'ensemble

### Plans disponibles :

| Plan         | Prix     | Accès IA        | Fonctionnalités                                      |
| ------------ | -------- | --------------- | ---------------------------------------------------- |
| **FREE**     | Gratuit  | Cuisinier Basic | Recettes, nutrition, techniques de base              |
| **PREMIUM**  | 19€/mois | Basic + Premium | + Génération d'images, logos, PDFs, templates        |
| **BUSINESS** | 49€/mois | Tous les agents | + Recherche services, analyse marché, business plans |

## 🔧 Configuration Stripe

### 1. Compte Stripe

1. Créez un compte sur [Stripe.com](https://stripe.com)
2. Allez dans le dashboard de test : [dashboard.stripe.com](https://dashboard.stripe.com/test)

### 2. Clés API

Récupérez vos clés sur [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys) :

```bash
# Dans votre .env.local
STRIPE_SECRET_KEY="sk_test_votre_cle_secrete_ici"
STRIPE_PUBLISHABLE_KEY="pk_test_votre_cle_publique_ici"
```

### 3. Configuration Webhook

Pour sécuriser les paiements, configurez un webhook :

1. **Allez sur** : [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. **Cliquez** "Ajouter un endpoint"
3. **URL** : `https://votre-domaine.com/api/subscriptions/webhook`
4. **Événements à écouter** :
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
5. **Copiez le secret** : `whsec_...`

```bash
# Ajoutez dans .env.local
STRIPE_WEBHOOK_SECRET="whsec_votre_secret_webhook_ici"
```

## 🧪 Tests de paiement

### Cartes de test Stripe

```bash
# ✅ Paiement réussi
4242 4242 4242 4242

# ❌ Paiement décliné
4000 0000 0000 0002

# 🔄 Authentification 3D Secure
4000 0025 0000 3155

# Toutes les cartes :
# - Date d'expiration : n'importe quelle date future
# - CVC : n'importe quel code à 3 chiffres
```

### Test complet

1. **Connectez-vous** avec un compte FREE
2. **Allez sur** `/subscriptions`
3. **Choisissez** Premium ou Business
4. **Payez** avec `4242 4242 4242 4242`
5. **Vérifiez** la redirection vers `/subscriptions/success`
6. **Confirmez** que le plan est mis à jour

## 🔒 Sécurité

### Protections mises en place :

1. **Vérification JWT** : Seuls les utilisateurs connectés peuvent payer
2. **Validation Stripe** : Vérification que le paiement est vraiment confirmé
3. **Correspondance utilisateur** : La session Stripe doit appartenir à l'utilisateur
4. **Webhook sécurisé** : Signature cryptographique des événements Stripe
5. **Double vérification** : API + Webhook pour mise à jour

### Impossible de contourner :

- ❌ Accès direct à `/subscriptions/success` sans paiement
- ❌ Manipulation des sessions Stripe
- ❌ Falsification des événements webhook
- ❌ Usurpation d'identité utilisateur

## 📡 APIs créées

### Checkout

```http
POST /api/subscriptions/create-checkout
Authorization: Bearer token
Content-Type: application/json

{
  "plan": "PREMIUM" | "BUSINESS"
}
```

### Mise à jour utilisateur

```http
POST /api/subscriptions/update-user
Authorization: Bearer token
Content-Type: application/json

{
  "sessionId": "cs_test_..."
}
```

### Gestion abonnement

```http
GET /api/subscriptions/manage
Authorization: Bearer token

DELETE /api/subscriptions/manage
Authorization: Bearer token
```

### Webhook Stripe

```http
POST /api/subscriptions/webhook
Stripe-Signature: signature
Content-Type: application/json

// Événements Stripe automatiques
```

## 🎨 Pages créées

### `/subscriptions`

- Affichage des 3 plans avec prix
- Boutons de souscription
- Redirection vers Stripe Checkout

### `/subscriptions/success`

- Confirmation de paiement
- Mise à jour automatique du plan
- Boutons vers chat et gestion

### `/subscriptions/manage`

- Détails de l'abonnement actuel
- Agents inclus par plan
- Annulation d'abonnement
- Changement de plan

## 🔄 Flux utilisateur

```mermaid
graph TD
    A[Utilisateur FREE] --> B[/subscriptions]
    B --> C[Choisit PREMIUM/BUSINESS]
    C --> D[Stripe Checkout]
    D --> E[Paiement carte]
    E --> F[/subscriptions/success]
    F --> G[Mise à jour BDD]
    G --> H[Accès agents Premium/Business]
```

## 🚀 Mise en production

### 1. Variables d'environnement

```bash
# Passez en clés de production
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_live_..."

# URL de production
NEXT_PUBLIC_BASE_URL="https://votre-domaine.com"
```

### 2. Webhook en production

1. Créez un nouveau webhook avec l'URL de production
2. Activez les mêmes événements
3. Mettez à jour `STRIPE_WEBHOOK_SECRET`

### 3. Tests en production

1. Utilisez d'abord le mode test Stripe
2. Vérifiez tous les flux avec les cartes de test
3. Activez le mode live Stripe
4. Testez avec de vrais petits montants

## 🛠️ Développement

### Structure des fichiers

```
src/app/
├── api/subscriptions/
│   ├── create-checkout/route.ts    # Création checkout Stripe
│   ├── update-user/route.ts        # Mise à jour après paiement
│   ├── manage/route.ts             # Gestion abonnement
│   └── webhook/route.ts            # Webhook Stripe sécurisé
├── subscriptions/
│   ├── page.tsx                    # Page de choix des plans
│   ├── success/page.tsx            # Confirmation paiement
│   └── manage/page.tsx             # Gestion abonnement
└── auth/
    ├── login/page.tsx              # Connexion requise
    └── register/page.tsx           # Inscription
```

### Base de données

Champs ajoutés à la table `User` :

```sql
subscriptionPlan     ENUM('FREE', 'PREMIUM', 'BUSINESS') DEFAULT 'FREE'
subscriptionStatus   ENUM('ACTIVE', 'EXPIRED', 'CANCELLED', 'TRIAL') DEFAULT 'ACTIVE'
subscriptionStart    TIMESTAMP NULL
subscriptionEnd      TIMESTAMP NULL
trialUsed           BOOLEAN DEFAULT FALSE
```

## 📝 Logs et monitoring

### Événements loggés :

```bash
✅ Abonnement PREMIUM activé pour l'utilisateur abc123
🔄 Webhook vérifié et sécurisé: checkout.session.completed
⚠️ ATTENTION: Webhook en mode développement sans vérification
❌ Token invalide ou expiré
🔒 Session non autorisée pour cet utilisateur
```

### Monitoring recommandé :

- Dashboard Stripe pour les paiements
- Logs serveur pour les erreurs webhook
- Métriques conversion par plan
- Taux d'abandon de panier

## 🆘 Dépannage

### Problèmes fréquents :

**❌ Erreur 401 "Token invalide"**

```bash
# Vérifiez JWT_SECRET dans .env.local
JWT_SECRET="votre-secret-jwt-ici"
```

**❌ Erreur 403 "Secret key required"**

```bash
# Utilisez la clé secrète, pas publique
STRIPE_SECRET_KEY="sk_test_..." # ✅
STRIPE_SECRET_KEY="pk_test_..." # ❌
```

**❌ Webhook échoue**

```bash
# En développement, ça marche sans webhook
# En production, configurez le secret
STRIPE_WEBHOOK_SECRET="whsec_..."
```

**❌ Paiement validé mais plan pas mis à jour**

```bash
# Vérifiez les logs du webhook
# L'API update-user est un backup
```

## 📚 Ressources

- [Documentation Stripe](https://stripe.com/docs)
- [Guide webhooks](https://stripe.com/docs/webhooks)
- [Cartes de test](https://stripe.com/docs/testing)
- [Dashboard Stripe](https://dashboard.stripe.com)
