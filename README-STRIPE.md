# Configuration Stripe pour les Abonnements

Ce guide vous explique comment configurer Stripe pour gérer les paiements et abonnements de votre application LetHimCookAI.

## 1. Créer un compte Stripe

1. Allez sur [stripe.com](https://stripe.com) et créez un compte
2. Activez votre compte en test mode pour commencer

## 2. Récupérer les clés API

Dans votre dashboard Stripe, allez dans **Développeurs > Clés API** :

- `STRIPE_PUBLISHABLE_KEY` : Clé publique (commence par `pk_test_` ou `pk_live_`)
- `STRIPE_SECRET_KEY` : Clé secrète (commence par `sk_test_` ou `sk_live_`)

## 3. Configurer les webhooks

Les webhooks permettent à Stripe de notifier votre application des événements de paiement.

### Créer un webhook

1. Dans le dashboard Stripe, allez dans **Développeurs > Webhooks**
2. Cliquez sur **Ajouter un endpoint**
3. URL de l'endpoint : `https://votre-domaine.com/api/subscriptions/webhook`
4. Sélectionnez ces événements :
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`

### Récupérer la clé de signature

Après avoir créé le webhook, cliquez dessus et copiez la **Clé de signature** (commence par `whsec_`).

## 4. Variables d'environnement

Ajoutez ces variables à votre fichier `.env.local` :

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# URL de base pour les redirections
NEXT_PUBLIC_BASE_URL=https://votre-domaine.com
```

## 5. Test des paiements

En mode test, utilisez ces numéros de carte :

- **Succès** : `4242 4242 4242 4242`
- **Échec** : `4000 0000 0000 0002`
- **3D Secure** : `4000 0000 0000 3220`

Date d'expiration : n'importe quelle date future
CVC : n'importe quel code à 3 chiffres

## 6. Produits et prix

Les prix sont définis dans le code (`src/app/api/subscriptions/create-checkout/route.ts`) :

- **Premium** : 19€/mois (1900 centimes)
- **Business** : 49€/mois (4900 centimes)

## 7. Mise en production

Pour passer en production :

1. Activez votre compte Stripe
2. Remplacez les clés de test par les clés de production
3. Mettez à jour l'URL du webhook avec votre domaine de production
4. Testez complètement le processus de paiement

## 8. Gestion des abonnements

L'application gère automatiquement :

- ✅ Création d'abonnements
- ✅ Renouvellements automatiques
- ✅ Échecs de paiement
- ✅ Annulations
- ✅ Mise à jour des droits d'accès

## 9. Support et monitoring

- Surveillez les webhooks dans le dashboard Stripe
- Vérifiez les logs de l'application pour les erreurs
- Configurez des alertes pour les échecs de paiement

## Structure des API

- `POST /api/subscriptions/create-checkout` : Créer une session de paiement
- `POST /api/subscriptions/webhook` : Traiter les événements Stripe
- `GET /api/subscriptions/manage` : Récupérer les infos d'abonnement
- `DELETE /api/subscriptions/manage` : Annuler un abonnement

## Pages utilisateur

- `/subscriptions` : Sélection des formules
- `/subscriptions/success` : Confirmation de paiement
- `/subscriptions/manage` : Gestion de l'abonnement

---

**Important** : Gardez vos clés secrètes confidentielles et ne les committez jamais dans votre code source !
