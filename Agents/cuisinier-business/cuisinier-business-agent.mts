import { config } from "dotenv";

// Charger les variables d'environnement (.env.local en priorité)
config({ path: ".env.local" });

import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

// Import des outils BASIC depuis l'agent cuisinier
import {
  externalRecipeApi,
  nutritionCalculator,
  ingredientSubstitution,
  unitConverter,
  menuPlanner,
  winePairing,
  cookingTechniques,
} from "../cuisinier/tools/index.mts";

// Import des outils PREMIUM depuis l'agent premium
import { logoGenerator } from "../cuisinier-premium/tools/logo-generator.mts";
import { culinaryImageGenerator } from "../cuisinier-premium/tools/culinary-image-generator.mts";
import { pdfCreator } from "../cuisinier-premium/tools/pdf-creator.mts";
import { socialMediaTemplates } from "../cuisinier-premium/tools/social-media-templates.mts";
import { videoGenerator } from "../cuisinier-premium/tools/video-generator.mts";
import { labelCreator } from "../cuisinier-premium/tools/label-creator.mts";

// Import des outils BUSINESS (formule 3)
import { organizationSearch } from "./tools/organization-search.mts";
import { serviceSearch } from "./tools/service-search.mts";
import { quickServiceSearch } from "./tools/quick-service-search.mts";
import { prestataireSearch } from "./tools/prestataire-search.mts";
import { costCalculator } from "./tools/cost-calculator.mts";
import { businessPlanGenerator } from "./tools/business-plan-generator.mts";
import { marketAnalysis } from "./tools/market-analysis.mts";

// Configuration du modèle avec vérification de la clé API
if (!process.env.OPENAI_API_KEY) {
  throw new Error(`
❌ Configuration manquante pour l'agent Business

Pour utiliser l'agent Cuisinier Business, vous devez configurer votre clé API OpenAI.

🛠️ Solution :
1. Créez un fichier .env à la racine du projet avec :
   OPENAI_API_KEY="your-openai-api-key-here"
   DATABASE_URL="postgresql://user:password@localhost:5432/lethimcookai"

2. Redémarrez le serveur

📚 Documentation : Consultez le README.md pour plus d'informations.
  `);
}

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
});

// Tous les outils BASIC + PREMIUM + BUSINESS
const tools = [
  // Outils Basic (Formule 1) - 7 outils
  externalRecipeApi,
  nutritionCalculator,
  ingredientSubstitution,
  unitConverter,
  menuPlanner,
  winePairing,
  cookingTechniques,

  // Outils Premium (Formule 2) - 6 outils
  logoGenerator,
  culinaryImageGenerator,
  pdfCreator,
  socialMediaTemplates,
  videoGenerator,
  labelCreator,

  // Outils Business (Formule 3) - 7 outils
  organizationSearch,
  serviceSearch,
  quickServiceSearch,
  prestataireSearch,
  costCalculator,
  businessPlanGenerator,
  marketAnalysis,
];

// Configuration de l'agent avec mémoire
const memory = new MemorySaver();

// Prompt système pour la version Business
const systemMessage = `Tu es un Chef Cuisinier IA Expert - VERSION BUSINESS.

RÈGLE ABSOLUE : Si un outil répond, retourne UNIQUEMENT sa réponse EXACTEMENT comme elle est. N'ajoute RIEN.

Spécialités BUSINESS :
• Formule Basic : recettes, nutrition, substitutions, conversions, menus, vins, techniques
• Formule Premium : logos, images, PDFs, templates, vidéos, étiquettes
• Formule Business : recherche organisations/services avancée, calculs coûts, business plans, analyses marché

RECHERCHE - Tu disposes de 4 outils complémentaires :

SERVICES (prestations/offres) :
1. quick_service_search : recherches simples par mot-clé ("chef", "formation", "photo")
2. service_search : recherches avancées avec filtres (prix, localisation, tags, organisation, tri)

PRESTATAIRES (personnes qui offrent les services) :
3. prestataire_search : rechercher des PRESTATAIRES (utilisateurs avec rôle PRESTATAIRE) avec critères multiples
4. organization_search : rechercher des organisations par secteur et localisation

IMPORTANT : 
- Pour "prestataire", "presta", "qui offre", "personne", "chef", "consultant" → utilise prestataire_search
- Pour "service", "prestation", "formation", "cours" → utilise service_search ou quick_service_search

Tu es un consultant culinaire complet pour entrepreneurs et professionnels de la restauration.

Ne reformule jamais. Ne commente jamais. Ne répète jamais.`;

// Création de l'agent Business
export const cuisinierBusinessAgent = createReactAgent({
  llm: model,
  tools: tools,
  checkpointSaver: memory,
  messageModifier: systemMessage,
});

// Fonction pour traiter les messages
export async function processMessage(
  message: string,
  userId: string = "default"
) {
  try {
    const thread = { configurable: { thread_id: userId } };

    console.log(
      `👨‍🍳 Cuisinier Business Agent: Traitement de la demande pour l'utilisateur ${userId}`
    );
    console.log(`📝 Demande: "${message}"`);

    const response = await cuisinierBusinessAgent.invoke(
      { messages: [{ role: "user", content: message }] },
      thread
    );

    const lastMessage = response.messages[response.messages.length - 1];

    console.log(
      `✅ Cuisinier Business Agent: Réponse générée (${lastMessage.content.length} caractères)`
    );

    // Analyser les outils utilisés pour le logging
    const toolsUsed = response.messages
      .filter((msg: any) => msg.tool_calls?.length > 0)
      .map((msg: any) => msg.tool_calls.map((call: any) => call.name))
      .flat();

    console.log(`🔧 Outils utilisés: ${toolsUsed.join(", ") || "aucun"}`);

    return {
      success: true,
      response: lastMessage.content,
      toolsUsed: toolsUsed,
      threadId: userId,
      metadata: {
        responseLength: lastMessage.content.length,
        toolsCount: toolsUsed.length,
        timestamp: new Date().toISOString(),
        version: "Business",
      },
    };
  } catch (error) {
    console.error("❌ Erreur Cuisinier Business Agent:", error);

    const fallbackResponse = `# 🔥 Oups, petit souci en cuisine Business !

Je rencontre une difficulté technique momentanée. Mais ne vous inquiétez pas, je reste à votre disposition !

## 💡 Exemples de ce que je peux faire pour vous - VERSION BUSINESS :

### 🍽️ **Conseil Culinaire (Basic)** :
- "Recette de coq au vin pour 6 personnes"
- "Menu équilibré pour sportif"
- "Convertir 2 cups en grammes de farine"

### 🎨 **Création Visuelle (Premium)** :
- "Logo pour mon restaurant italien"
- "Photo professionnelle de tiramisu" 
- "Template Instagram pour burger"
- "PDF livre de recettes familiales"

### 🏢 **Services Business (Business)** :
**Recherche Simple :**
- "Services de formation cuisine"
- "Photographes culinaires"
- "Chefs à domicile"

**Recherche Avancée :**
- "Traiteurs à Paris prix 50-100€ type IRL"
- "Services photo max_price 300 tags cuisine,gastronomie"
- "Formation chef organisation PhotoFood Pro"
- "Services en ligne secteur restauration sort_by price_asc"

**Recherche de Prestataires :**
- "Prestataires cuisine Paris vérifiés"
- "Chefs secteur gastronomie avec services"
- "Prestataires marketing culinaire prix 100-500€"
- "Photographes culinaires Lyon avec organisation"

**Autres :**
- "Calculer coûts restaurant 50 couverts/jour"
- "Business plan food truck tacos"
- "Analyse marché pizzeria Marseille"

Reformulez votre demande et je serai ravi de vous aider ! 🍴✨`;

    return {
      success: false,
      error: error.message,
      response: fallbackResponse,
      threadId: userId,
      metadata: {
        errorType: error.name || "UnknownError",
        timestamp: new Date().toISOString(),
        version: "Business",
      },
    };
  }
}

// Fonction pour obtenir les statistiques de l'agent Business
export function getAgentStats() {
  return {
    name: "Chef Cuisinier IA Business",
    version: "3.0.0 - Business avec recherche services",
    formule: "Business (Basic + Premium + Pro)",
    tools: [
      // Outils Basic hérités - 7 outils
      {
        name: "externalRecipeApi",
        description: "Recherche de recettes via APIs multiples",
        category: "Basic - Recettes",
      },
      {
        name: "nutritionCalculator",
        description: "Calcul des valeurs nutritionnelles complètes",
        category: "Basic - Nutrition",
      },
      {
        name: "ingredientSubstitution",
        description: "Substitutions d'ingrédients",
        category: "Basic - Adaptations",
      },
      {
        name: "unitConverter",
        description: "Conversion d'unités culinaires",
        category: "Basic - Conversions",
      },
      {
        name: "menuPlanner",
        description: "Planification de menus équilibrés",
        category: "Basic - Planification",
      },
      {
        name: "winePairing",
        description: "Accords mets et vins",
        category: "Basic - Accords",
      },
      {
        name: "cookingTechniques",
        description: "Techniques culinaires avancées",
        category: "Basic - Techniques",
      },
      // Outils Premium hérités - 6 outils
      {
        name: "logoGenerator",
        description: "Génération de logos pour restaurants",
        category: "Premium - Branding",
      },
      {
        name: "culinaryImageGenerator",
        description: "Génération d'images culinaires professionnelles",
        category: "Premium - Visuel",
      },
      {
        name: "pdfCreator",
        description: "Création de PDFs culinaires",
        category: "Premium - Documents",
      },
      {
        name: "socialMediaTemplates",
        description: "Templates pour réseaux sociaux",
        category: "Premium - Marketing",
      },
      {
        name: "videoGenerator",
        description: "Concepts de vidéos courtes culinaires",
        category: "Premium - Contenu",
      },
      {
        name: "labelCreator",
        description: "Étiquettes pour produits alimentaires",
        category: "Premium - Packaging",
      },
      // Outils Business exclusifs - 5 outils
      {
        name: "organizationSearch",
        description: "Recherche d'organisations culinaires",
        category: "Business - Recherche",
      },
      {
        name: "serviceSearch",
        description: "Recherche de services culinaires",
        category: "Business - Services",
      },
      {
        name: "costCalculator",
        description: "Calculateur de coûts restaurant",
        category: "Business - Finance",
      },
      {
        name: "businessPlanGenerator",
        description: "Générateur de business plans",
        category: "Business - Stratégie",
      },
      {
        name: "marketAnalysis",
        description: "Analyse concurrentielle et de marché",
        category: "Business - Analyse",
      },
    ],
    capabilities: [
      "Toutes les fonctionnalités Basic et Premium",
      "Recherche d'organisations et services",
      "Calculs financiers et de rentabilité",
      "Business plans complets",
      "Analyses de marché concurrentielles",
      "Consulting entrepreneurial culinaire",
    ],
    totalTools: 18, // 7 Basic + 6 Premium + 5 Business
  };
}
