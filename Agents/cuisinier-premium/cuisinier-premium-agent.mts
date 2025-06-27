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

// Import des outils PREMIUM (formule 2)
import { logoGenerator } from "./tools/logo-generator.mts";
import { culinaryImageGenerator } from "./tools/culinary-image-generator.mts";
import { pdfCreator } from "./tools/pdf-creator.mts";
import { socialMediaTemplates } from "./tools/social-media-templates.mts";
import { videoGenerator } from "./tools/video-generator.mts";
import { labelCreator } from "./tools/label-creator.mts";

// Configuration du modèle avec vérification de la clé API
if (!process.env.OPENAI_API_KEY) {
  throw new Error(`
❌ Configuration manquante pour l'agent Premium

Pour utiliser l'agent Cuisinier Premium, vous devez configurer votre clé API OpenAI.

🛠️ Solution :
1. Créez un fichier .env à la racine du projet avec :
   OPENAI_API_KEY="your-openai-api-key-here"

2. Redémarrez le serveur

📚 Documentation : Consultez le README.md pour plus d'informations.
  `);
}

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
});

// Tous les outils BASIC + PREMIUM
const tools = [
  // Outils Basic (Formule 1) - importés depuis cuisinier
  externalRecipeApi,
  nutritionCalculator,
  ingredientSubstitution,
  unitConverter,
  menuPlanner,
  winePairing,
  cookingTechniques,

  // Outils Premium (Formule 2) - spécifiques à Premium
  logoGenerator,
  culinaryImageGenerator,
  pdfCreator,
  socialMediaTemplates,
  videoGenerator,
  labelCreator,
];

// Configuration de l'agent avec mémoire
const memory = new MemorySaver();

// Prompt système Premium - inspiré de l'agent Basic qui fonctionne parfaitement
const systemMessage = `Tu es un Chef Cuisinier IA expert - VERSION PREMIUM - SPÉCIALISÉ EXCLUSIVEMENT DANS LE DOMAINE CULINAIRE.

🍴 RESTRICTION ABSOLUE : Toutes tes réponses DOIVENT rester dans le domaine culinaire (cuisine, gastronomie, restauration, alimentation, création visuelle culinaire).

📝 RECENTRAGE AUTOMATIQUE : Pour toute question qui pourrait avoir plusieurs interprétations, réponds UNIQUEMENT sous l'angle culinaire :
- Animaux → Aspect boucherie/cuisine/découpe/présentation culinaire
- Végétaux → Ingrédients/culture culinaire/styling food
- Objets → Ustensiles/équipement de cuisine/présentation visuelle
- Concepts → Applications en cuisine/restauration/création visuelle culinaire

RÈGLE ABSOLUE : Si un outil répond, retourne UNIQUEMENT sa réponse EXACTEMENT comme elle est. N'ajoute RIEN.

Spécialités PREMIUM :
• Formule Basic : recettes, nutrition, substitutions, conversions, menus, vins, techniques
• Formule Premium : logos culinaires, images de plats, création visuelle EXCLUSIVEMENT culinaire

❌ DOMAINES EXCLUS : Médecine, finance, technologie générale, éducation générale, création non-culinaire, etc. (sauf si lien direct avec cuisine)

Ne reformule jamais. Ne commente jamais. Ne répète jamais.

Spécialités PREMIUM :
• Formule Basic : recettes, nutrition, substitutions, conversions, menus, vins, techniques
• Formule Premium : logos culinaires, images de plats, création visuelle EXCLUSIVEMENT culinaire

Tu peux créer des contenus visuels professionnels EXCLUSIVEMENT culinaires en plus de tes conseils gastronomiques.

Ne reformule jamais. Ne commente jamais. Ne répète jamais.`;

// Création de l'agent Premium
export const cuisinierPremiumAgent = createReactAgent({
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
      `👨‍🍳 Cuisinier Premium Agent: Traitement de la demande pour l'utilisateur ${userId}`
    );
    console.log(`📝 Demande: "${message}"`);

    const response = await cuisinierPremiumAgent.invoke(
      { messages: [{ role: "user", content: message }] },
      thread
    );

    const lastMessage = response.messages[response.messages.length - 1];

    console.log(
      `✅ Cuisinier Premium Agent: Réponse générée (${lastMessage.content.length} caractères)`
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
        version: "Premium",
      },
    };
  } catch (error) {
    console.error("❌ Erreur Cuisinier Premium Agent:", error);

    const fallbackResponse = `# 🔥 Oups, petit souci en cuisine Premium !

Je rencontre une difficulté technique momentanée. Mais ne vous inquiétez pas, je reste à votre disposition !

## 💡 Exemples de ce que je peux faire pour vous - VERSION PREMIUM :

### 🍽️ **Recherche et Recettes** :
- "Recette de coq au vin pour 6 personnes"
- "Plats végétariens avec des lentilles"

### 📊 **Nutrition et Santé** :
- "Calories d'une quiche lorraine"
- "Menu équilibré pour sportif"

### 🔄 **Substitutions et Conversions** :
- "Remplacer les œufs dans un gâteau"
- "Convertir 2 cups en grammes de farine"

### 📅 **Planification et Accords** :
- "Menu de la semaine pour 4 personnes"
- "Vin avec un saumon grillé"

### 👨‍🍳 **Techniques Culinaires** :
- "Comment faire un risotto parfait"

### 🎨 **PREMIUM - Création Visuelle** :
- "Logo pour mon restaurant italien"
- "Photo professionnelle de tiramisu"
- "Image de présentation pour tarte tatin"
- "PDF livre de recettes familiales"
- "Template Instagram pour burger"
- "Vidéo 30s technique de pâtisserie"
- "Étiquette pour confiture artisanale"

Reformulez votre demande et je serai ravi de vous aider ! 🍴✨`;

    return {
      success: false,
      error: error.message,
      response: fallbackResponse,
      threadId: userId,
      metadata: {
        errorType: error.name || "UnknownError",
        timestamp: new Date().toISOString(),
        version: "Premium",
      },
    };
  }
}

// Fonction pour obtenir les statistiques de l'agent Premium
export function getAgentStats() {
  return {
    name: "Chef Cuisinier IA Premium",
    version: "2.0.0 - Premium avec création visuelle",
    formule: "Premium (Basic + Visuel)",
    tools: [
      // Outils Basic hérités
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
      // Outils Premium
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
        description: "Création de documents PDF",
        category: "Premium - Visuel",
      },
      {
        name: "socialMediaTemplates",
        description: "Génération de templates pour les médias sociaux",
        category: "Premium - Visuel",
      },
      {
        name: "videoGenerator",
        description: "Génération de vidéos",
        category: "Premium - Visuel",
      },
      {
        name: "labelCreator",
        description: "Création de labels",
        category: "Premium - Visuel",
      },
    ],
    capabilities: [
      "Toutes les fonctionnalités Basic",
      "Création de logos professionnels",
      "Génération d'images culinaires HD",
      "Support visuel pour présentation",
    ],
  };
}
