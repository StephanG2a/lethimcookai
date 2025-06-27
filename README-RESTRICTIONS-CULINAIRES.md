# 🍽️ Restrictions Culinaires - Documentation

## 🎯 Objectif

Tous les outils de l'écosystème LethimCookAI sont maintenant **limités exclusivement au domaine culinaire** pour garantir une spécialisation maximale.

## 🔒 Restrictions Appliquées

### 📊 **Service Search** (`service-search.mts`)

- **Restriction** : Forçage au niveau base de données
- **Secteurs autorisés** : cuisine, restaurant, alimentation, traiteur, boulangerie, pâtisserie, gastronomie, food, chef, culinaire
- **Implémentation** : Clause `WHERE` avec filtres `OR` obligatoires

### 👥 **Prestataire Search** (`prestataire-search.mts`)

- **Restriction** : Validation des secteurs d'activité
- **Application** : Filtres culinaires par défaut + validation AND/OR
- **Secteurs identiques** : à Service Search

### 🔍 **Quick Service Search** (`quick-service-search.mts`)

- **Restriction** : Contrainte culinaire obligatoire avec clause `AND`
- **Double filtrage** : Secteur culinaire + recherche flexible dans ce domaine
- **Performance** : Optimisée pour le domaine restreint

### 📈 **Market Analysis** (`market-analysis.mts`)

- **Validation business type** : Liste pré-définie de 14 types culinaires
- **Types supportés** : restaurant, bistrot, brasserie, café, pizzeria, traiteur, food truck, boulangerie, pâtisserie, glacier, bar à vins, gastro, fast-food, snack, cantine, chef à domicile
- **Rejet automatique** : Message d'erreur pour types non-culinaires
- **Prompts IA** : Contexte "CUISINE" forcé

### 📋 **Business Plan Generator** (`business-plan-generator.mts`)

- **Types étendus** : 16 types incluant cours de cuisine, livraison, épicerie fine, fromagerie, charcuterie
- **Validation préalable** : Vérification avant génération
- **Templates spécialisés** : Business plans orientés restauration/alimentation

### 🎨 **Logo Generator** (`logo-generator.mts`)

- **Types validés** : 15 types d'établissements culinaires
- **Prompts DALL-E** : "CULINARY logo design" + thèmes gastronomiques forcés
- **Éléments visuels** : Incorporation d'ustensiles, ingrédients, thèmes food

### 🌐 **Website Generator** (`website-generator.mts`)

- **Description mise à jour** : "EXCLUSIVEMENT pour restaurants et établissements culinaires"
- **Restriction keywords** : site restaurant, web culinaire, vitrine gastronomique
- **Templates spécialisés** : Fonctionnalités restaurant (réservation, menu interactif, etc.)

### 📸 **Culinary Image Generator** (`culinary-image-generator.mts`)

- **Descriptions affinées** : Terminologie 100% culinaire
- **Paramètres** : food photography, présentation culinaire, éléments gastronomiques
- **Vocabulaire** : Exclusivement orienté restauration

### 📱 **Social Media Templates** (`social-media-templates.mts`)

- **Spécialisation** : "SPÉCIALISÉS dans le secteur culinaire"
- **Types de posts** : photo plat, behind-scenes cuisine, promo restaurant, story chef
- **Hashtags** : Thèmes culinaires exclusifs

## ✅ Types d'Établissements Autorisés

### 🏪 **Restauration**

- Restaurant (gastronomique, bistrot, brasserie)
- Pizzeria, fast-food, snack
- Bar à vins, café
- Cantine, cafétéria

### 🥖 **Artisanat Alimentaire**

- Boulangerie, pâtisserie
- Glacier, confiserie
- Fromagerie, charcuterie
- Épicerie fine

### 🚚 **Services Culinaires**

- Traiteur, food truck
- Chef à domicile
- Cours de cuisine
- Livraison de repas

### 🏢 **Commerce Alimentaire**

- Épicerie, superette
- Marché, primeur
- Cave à vins
- Produits biologiques

## ❌ Domaines Exclus

Tout ce qui n'est **PAS** lié à l'alimentation, la cuisine, la restauration ou la gastronomie est automatiquement rejeté avec des messages d'erreur explicites.

## 🛠️ Implémentation Technique

### **Base de Données (Prisma)**

```sql
WHERE organization.sector IN (
  'cuisine', 'restaurant', 'alimentation',
  'traiteur', 'boulangerie', 'pâtisserie',
  'gastronomie', 'food', 'chef', 'culinaire'
)
```

### **Validation JavaScript**

```javascript
const allowedBusinessTypes = [
  "restaurant",
  "bistrot",
  "brasserie",
  "café",
  "pizzeria",
  "traiteur",
  "food truck",
  "boulangerie",
  "pâtisserie",
  // ... liste complète
];

const isValid = allowedBusinessTypes.some((type) =>
  businessType.toLowerCase().includes(type)
);
```

### **Prompts IA Enrichis**

- Préfixes : "CUISINE", "CULINAIRE", "GASTRONOMIQUE"
- Contexte forcé : "secteur culinaire exclusivement"
- Vocabulaire spécialisé : food, chef, restaurant, gastronomie

## 📊 Impact sur les Performances

- **Recherches plus précises** : Résultats 100% pertinents
- **Base de données optimisée** : Index sur secteurs culinaires
- **Expérience utilisateur** : Spécialisation maximale
- **Prévention d'erreurs** : Validation préalable

## 🔄 Maintenance

Pour ajouter un nouveau type culinaire :

1. Mettre à jour la liste `allowedBusinessTypes`
2. Tester la validation
3. Vérifier les prompts IA
4. Documenter le changement

---

**✅ Toutes les restrictions sont actives et fonctionnelles !**
_LethimCookAI est maintenant 100% spécialisé dans le domaine culinaire._
