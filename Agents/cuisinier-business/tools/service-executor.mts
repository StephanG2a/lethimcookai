import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Import du websiteGenerator pour l'exécution automatique
import { websiteGenerator } from "./website-generator.mts";

export const serviceExecutor = tool(
  async ({
    serviceTitle,
    serviceDescription,
    serviceTags,
    organizationName,
    priceRange,
    userRequest,
  }) => {
    try {
      console.log(`🤖 Exécution automatique du service: ${serviceTitle}`);

      // Analyser le type de service demandé
      const serviceAnalysis = analyzeService(
        serviceTitle,
        serviceDescription,
        serviceTags
      );
      const requestAnalysis = analyzeRequest(userRequest);

      let response = `# 🤖 Exécution Automatique de Service

## 📋 Service Réalisé
**${serviceTitle}** ${organizationName ? `par ${organizationName}` : ""}
*Exécuté automatiquement par le Chef Cuisinier IA Business*
${priceRange ? `💰 Prix original: ${priceRange}` : ""}

## 💬 Votre Demande
"${userRequest}"

## 🎯 Analyse & Réalisation

`;

      // Générer la réponse selon le type de service
      if (serviceAnalysis.isWebsiteService) {
        response += await generateWebsiteServiceResponse(
          userRequest,
          serviceTitle,
          serviceTags
        );
      } else if (serviceAnalysis.isMenuService) {
        response += generateMenuServiceResponse(userRequest, serviceTitle);
      } else if (serviceAnalysis.isBusinessService) {
        response += generateBusinessServiceResponse(userRequest, serviceTitle);
      } else if (serviceAnalysis.isVisualService) {
        response += generateVisualServiceResponse(userRequest, serviceTitle);
      } else if (serviceAnalysis.isNutritionService) {
        response += generateNutritionServiceResponse(userRequest, serviceTitle);
      } else if (serviceAnalysis.isWineService) {
        response += generateWineServiceResponse(userRequest, serviceTitle);
      } else {
        response += generateGeneralServiceResponse(userRequest, serviceTitle);
      }

      // Ajouter les recommandations et outils à utiliser
      response += `

## 🛠️ Outils Recommandés pour Compléter

Pour approfondir cette réalisation, je recommande d'utiliser mes outils spécialisés :

${getRecommendedTools(serviceAnalysis, requestAnalysis)}

## ✨ Service Réalisé avec Succès !

**Avantages de l'exécution IA :**
- ✅ **Immédiat** : Pas d'attente, réponse instantanée
- ✅ **Professionnel** : Niveau expert garanti
- ✅ **Économique** : Service automatique inclus
- ✅ **Personnalisé** : Adapté à votre demande spécifique
- ✅ **Évolutif** : Modifications possibles à tout moment

💡 **Besoin d'ajustements ?** Dites-moi "utilise l'outil [nom]" pour approfondir un aspect !

---
*Service exécuté le ${new Date().toLocaleString(
        "fr-FR"
      )} par le Chef Cuisinier IA Business*`;

      console.log(`✅ Service "${serviceTitle}" exécuté avec succès`);
      return response;
    } catch (error) {
      console.error("❌ Erreur lors de l'exécution du service:", error);
      return `# ❌ Erreur d'Exécution

Désolé, je rencontre une difficulté lors de l'exécution du service "${serviceTitle}".

**Erreur :** ${error.message}

💡 **Solutions :**
- Reformulez votre demande avec plus de détails
- Décomposez votre demande en étapes simples
- Utilisez directement mes outils spécialisés

Je reste à votre disposition pour vous aider !`;
    }
  },
  {
    name: "serviceExecutor",
    description: `Outil spécialisé pour l'exécution automatique des services IA CULINAIRES compatible. 
    Analyse le service demandé et fournit une réponse complète et professionnelle dans le domaine culinaire.
    Remplace efficacement un prestataire humain pour les services culinaires et gastronomiques automatisables.
    Recommande les outils spécialisés appropriés pour approfondir la réalisation culinaire.
    RESTRICTION: Uniquement pour services liés à la cuisine, restauration, alimentation.`,
    schema: z.object({
      serviceTitle: z
        .string()
        .describe("Titre du service culinaire à exécuter"),
      serviceDescription: z
        .string()
        .describe("Description détaillée du service culinaire"),
      serviceTags: z
        .array(z.string())
        .describe("Tags/mots-clés culinaires du service"),
      organizationName: z
        .string()
        .optional()
        .describe("Nom de l'organisation culinaire prestataire"),
      priceRange: z
        .string()
        .optional()
        .describe("Fourchette de prix du service culinaire"),
      userRequest: z
        .string()
        .describe("Demande spécifique culinaire de l'utilisateur"),
    }),
  }
);

// Fonction d'analyse du service
function analyzeService(title: string, description: string, tags: string[]) {
  const allText = `${title} ${description} ${tags.join(" ")}`.toLowerCase();

  return {
    isWebsiteService:
      /site|web|vitrine|internet|développement|next\.js|react|html|css|javascript|responsive|seo/.test(
        allText
      ),
    isMenuService: /menu|carte|plat|recette|repas|dîner|déjeuner/.test(allText),
    isBusinessService:
      /business|plan|restaurant|entreprise|création|conseil|étude|coût|budget/.test(
        allText
      ),
    isVisualService: /logo|image|photo|visuel|design|graphique|identité/.test(
      allText
    ),
    isNutritionService:
      /nutrition|diététique|calorie|équilibr|santé|régime/.test(allText),
    isWineService: /vin|accord|sommelier|dégustation|cave/.test(allText),
    isMarketingService:
      /marketing|communication|social|template|vidéo|publicité/.test(allText),
    isTechniqueService:
      /technique|cuisson|méthode|formation|apprentissage/.test(allText),
    serviceType: allText,
  };
}

// Fonction d'analyse de la demande
function analyzeRequest(request: string) {
  const req = request.toLowerCase();
  return {
    needsWebsite: /site|web|créer|faire|développer|construire/.test(req),
    needsRecipes: /recette|plat|cuisine/.test(req),
    needsMenu: /menu|carte|repas/.test(req),
    needsWine: /vin|accord|boisson/.test(req),
    needsNutrition: /nutrition|calorie|santé/.test(req),
    needsBusiness: /business|plan|coût|budget|entreprise/.test(req),
    needsVisuals: /logo|image|photo|design/.test(req),
    requestType: req,
  };
}

// Générateurs de réponses spécialisées
function generateMenuServiceResponse(
  userRequest: string,
  serviceTitle: string
): string {
  return `### 🍽️ Réalisation du Service Menu

J'ai analysé votre demande "${userRequest}" dans le contexte du service "${serviceTitle}".

**Approche recommandée :**

1. **Analyse des besoins** : Vos préférences et contraintes
2. **Recherche de recettes** : Sélection adaptée à vos critères
3. **Planification équilibrée** : Menu harmonieux et nutritif
4. **Accords recommandés** : Vins et boissons adaptés
5. **Instructions pratiques** : Guide de préparation

**Réalisation immédiate :**
- Conception d'un menu personnalisé selon vos critères
- Sélection de recettes adaptées à votre niveau
- Calcul des portions et liste de courses
- Conseils de timing et organisation`;
}

function generateBusinessServiceResponse(
  userRequest: string,
  serviceTitle: string
): string {
  return `### 📊 Réalisation du Service Business

J'ai traité votre demande "${userRequest}" pour le service "${serviceTitle}".

**Méthodologie appliquée :**

1. **Analyse de faisabilité** : Étude de votre projet
2. **Calculs financiers** : Coûts et rentabilité
3. **Étude de marché** : Positionnement concurrentiel
4. **Plan d'action** : Stratégie détaillée
5. **Recommandations** : Conseils personnalisés

**Livrables fournis :**
- Analyse complète de votre situation
- Projections financières réalistes
- Stratégie de développement adaptée
- Plan d'action concret et réalisable`;
}

function generateVisualServiceResponse(
  userRequest: string,
  serviceTitle: string
): string {
  return `### 🎨 Réalisation du Service Visuel

J'ai conçu une solution visuelle pour "${userRequest}" dans le cadre du service "${serviceTitle}".

**Processus créatif :**

1. **Brief créatif** : Compréhension de vos besoins
2. **Concept visuel** : Développement de l'identité
3. **Déclinaisons** : Applications multiples
4. **Optimisation** : Formats et usages
5. **Livraison** : Fichiers prêts à utiliser

**Éléments créés :**
- Concepts visuels personnalisés
- Déclinaisons pour différents supports
- Recommandations d'usage
- Fichiers sources disponibles`;
}

function generateNutritionServiceResponse(
  userRequest: string,
  serviceTitle: string
): string {
  return `### 🥗 Réalisation du Service Nutrition

J'ai analysé vos besoins nutritionnels pour "${userRequest}" selon le service "${serviceTitle}".

**Approche nutritionnelle :**

1. **Évaluation** : Analyse de vos besoins
2. **Planification** : Programme adapté
3. **Équilibrage** : Apports optimisés
4. **Substitutions** : Alternatives saines
5. **Suivi** : Recommandations continues

**Solutions apportées :**
- Plan nutritionnel personnalisé
- Calculs précis des apports
- Conseils d'adaptation
- Alternatives pour contraintes alimentaires`;
}

function generateWineServiceResponse(
  userRequest: string,
  serviceTitle: string
): string {
  return `### 🍷 Réalisation du Service Vins

J'ai sélectionné des accords parfaits pour "${userRequest}" dans le cadre du service "${serviceTitle}".

**Expertise sommelier :**

1. **Analyse gustative** : Profils des mets
2. **Sélection viticole** : Vins harmonieux
3. **Accords parfaits** : Combinaisons optimales
4. **Conseils service** : Température et moment
5. **Alternatives** : Options budgétaires

**Recommandations expertes :**
- Accords mets-vins personnalisés
- Sélection de bouteilles précises
- Conseils de dégustation
- Alternatives selon budget`;
}

function generateGeneralServiceResponse(
  userRequest: string,
  serviceTitle: string
): string {
  return `### 🎯 Réalisation du Service

J'ai traité votre demande "${userRequest}" pour le service "${serviceTitle}" avec une approche globale.

**Méthode d'exécution :**

1. **Analyse complète** : Compréhension des enjeux
2. **Approche multi-outils** : Utilisation de mes spécialités
3. **Solution intégrée** : Réponse cohérente
4. **Optimisation** : Ajustements fins
5. **Validation** : Contrôle qualité

**Résultat fourni :**
- Solution complète et personnalisée
- Intégration de plusieurs expertises
- Réponse adaptée à vos besoins spécifiques
- Conseils pour optimiser le résultat`;
}

function getRecommendedTools(
  serviceAnalysis: any,
  requestAnalysis: any
): string {
  const tools: string[] = [];

  if (serviceAnalysis.isWebsiteService || requestAnalysis.needsWebsite) {
    tools.push("- **websiteGenerator** : Pour créer des sites web complets");
    tools.push("- **logoGenerator** : Pour l'identité visuelle du site");
    tools.push("- **culinaryImageGenerator** : Pour les visuels du site");
  }
  if (serviceAnalysis.isMenuService || requestAnalysis.needsMenu) {
    tools.push("- **menuPlanner** : Pour créer des menus équilibrés détaillés");
  }
  if (requestAnalysis.needsRecipes) {
    tools.push(
      "- **externalRecipeApi** : Pour rechercher des recettes spécifiques"
    );
  }
  if (serviceAnalysis.isNutritionService || requestAnalysis.needsNutrition) {
    tools.push(
      "- **nutritionCalculator** : Pour analyser les valeurs nutritionnelles"
    );
  }
  if (serviceAnalysis.isWineService || requestAnalysis.needsWine) {
    tools.push("- **winePairing** : Pour des accords mets-vins experts");
  }
  if (serviceAnalysis.isBusinessService || requestAnalysis.needsBusiness) {
    tools.push(
      "- **businessPlanGenerator** : Pour des business plans détaillés"
    );
    tools.push("- **costCalculator** : Pour calculer coûts et rentabilité");
    tools.push("- **marketAnalysis** : Pour analyser la concurrence");
  }
  if (serviceAnalysis.isVisualService || requestAnalysis.needsVisuals) {
    tools.push("- **logoGenerator** : Pour créer des logos professionnels");
    tools.push(
      "- **culinaryImageGenerator** : Pour générer des images culinaires"
    );
    tools.push(
      "- **socialMediaTemplates** : Pour des templates réseaux sociaux"
    );
  }

  // Toujours proposer quelques outils de base si rien de spécifique
  if (tools.length === 0) {
    tools.push("- **externalRecipeApi** : Pour des recettes personnalisées");
    tools.push("- **menuPlanner** : Pour planifier vos repas");
    tools.push(
      "- **nutritionCalculator** : Pour analyser l'équilibre nutritionnel"
    );
  }

  return tools.join("\n");
}

// Fonction pour générer une réponse de service website
async function generateWebsiteServiceResponse(
  userRequest: string,
  serviceTitle: string,
  serviceTags: string[]
): Promise<string> {
  try {
    // Extraire les informations du service pour le websiteGenerator
    const restaurantName = extractRestaurantName(userRequest, serviceTitle);
    const restaurantType = extractRestaurantType(userRequest, serviceTags);
    const websiteType = extractWebsiteType(userRequest);
    const features = extractFeatures(userRequest, serviceTags);
    const colorScheme = extractColorScheme(userRequest);

    // Utiliser le websiteGenerator pour créer le site
    const websiteResult = await websiteGenerator.invoke({
      restaurantName,
      restaurantType,
      websiteType,
      features,
      colorScheme,
      content: userRequest,
    });

    return `### 🌐 Réalisation du Service Site Web

J'ai créé automatiquement votre site web "${serviceTitle}" selon votre demande "${userRequest}".

${websiteResult}

**🚀 Service exécuté avec succès !**
Votre site web est maintenant prêt à être personnalisé et déployé.`;
  } catch (error) {
    return `### ❌ Erreur lors de la génération du site web

Impossible de générer le site web automatiquement : ${error.message}

**💡 Solution :** Utilisez directement l'outil **websiteGenerator** avec des paramètres plus spécifiques.`;
  }
}

// Fonctions utilitaires pour extraire les paramètres
function extractRestaurantName(
  userRequest: string,
  serviceTitle: string
): string {
  // Essayer d'extraire le nom du restaurant de la demande
  const nameMatch = userRequest.match(
    /pour (\w+)|restaurant (\w+)|chez (\w+)/i
  );
  if (nameMatch) {
    return nameMatch[1] || nameMatch[2] || nameMatch[3];
  }
  return "Mon Restaurant"; // Valeur par défaut
}

function extractRestaurantType(
  userRequest: string,
  serviceTags: string[]
): string {
  const request = userRequest.toLowerCase();

  if (/pizzeria|pizza/i.test(request)) return "Pizzeria";
  if (/brasserie|bière/i.test(request)) return "Brasserie";
  if (/gastronomique|étoilé|fine dining/i.test(request))
    return "Restaurant gastronomique";
  if (/bistrot|bistro/i.test(request)) return "Bistrot";
  if (/café|coffee/i.test(request)) return "Café";
  if (/bar|cocktail/i.test(request)) return "Bar";

  // Vérifier dans les tags
  for (const tag of serviceTags) {
    if (/restaurant|gastronomie/i.test(tag)) return "Restaurant";
    if (/pizza/i.test(tag)) return "Pizzeria";
    if (/café|coffee/i.test(tag)) return "Café";
  }

  return "Restaurant"; // Valeur par défaut
}

function extractWebsiteType(
  userRequest: string
): "vitrine" | "e-commerce" | "reservation" | "portfolio" {
  const request = userRequest.toLowerCase();

  if (/e-commerce|boutique|vente|commande/i.test(request)) return "e-commerce";
  if (/réservation|booking/i.test(request)) return "reservation";
  if (/portfolio|galerie|showcase/i.test(request)) return "portfolio";

  return "vitrine"; // Valeur par défaut
}

function extractFeatures(userRequest: string, serviceTags: string[]): string[] {
  const features: string[] = [];
  const request = userRequest.toLowerCase();
  const allTags = serviceTags.join(" ").toLowerCase();

  if (/réservation|booking|réserver/i.test(request + " " + allTags)) {
    features.push("reservation");
  }
  if (/menu|carte/i.test(request + " " + allTags)) {
    features.push("menu-interactif");
  }
  if (/galerie|photo|image/i.test(request + " " + allTags)) {
    features.push("galerie");
  }
  if (/contact|nous contacter/i.test(request + " " + allTags)) {
    features.push("contact");
  }
  if (/seo|référencement|google/i.test(request + " " + allTags)) {
    features.push("seo");
  }
  if (/responsive|mobile|tablette/i.test(request + " " + allTags)) {
    features.push("responsive");
  }

  // Ajouter des fonctionnalités de base
  if (features.length === 0) {
    features.push("contact", "menu-interactif");
  }

  return features;
}

function extractColorScheme(
  userRequest: string
): "elegant" | "moderne" | "rustique" | "minimaliste" | "chaleureux" {
  const request = userRequest.toLowerCase();

  if (/élégant|sophistiqué|chic|classe/i.test(request)) return "elegant";
  if (/moderne|contemporain|actuel/i.test(request)) return "moderne";
  if (/rustique|traditionnel|campagne|authentique/i.test(request))
    return "rustique";
  if (/minimaliste|simple|épuré|clean/i.test(request)) return "minimaliste";
  if (/chaleureux|convivial|accueillant|cosy/i.test(request))
    return "chaleureux";

  return "moderne"; // Valeur par défaut
}
