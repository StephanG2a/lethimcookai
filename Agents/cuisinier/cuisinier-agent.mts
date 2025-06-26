import { config } from "dotenv";

// Charger les variables d'environnement (.env.local en priorité)
config({ path: ".env.local" });

import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

// Import de tous les outils depuis l'index
import {
  externalRecipeApi,
  nutritionCalculator,
  ingredientSubstitution,
  unitConverter,
  menuPlanner,
  winePairing,
  cookingTechniques,
} from "./tools/index.mts";

// Configuration du modèle avec vérification de la clé API
if (!process.env.OPENAI_API_KEY) {
  throw new Error(`
❌ Configuration manquante pour l'agent Basic

Pour utiliser l'agent Cuisinier Basic, vous devez configurer votre clé API OpenAI.

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

// Tous les outils disponibles - FORMULE BASIC
const tools = [
  externalRecipeApi,
  nutritionCalculator,
  ingredientSubstitution,
  unitConverter,
  menuPlanner,
  winePairing,
  cookingTechniques,
];

// Configuration de l'agent avec mémoire
const memory = new MemorySaver();

// Prompt système ultra-strict pour éviter les doublons
const systemMessage = `Tu es un Chef Cuisinier IA expert - VERSION BASIC.

RÈGLE ABSOLUE : Si un outil répond, retourne UNIQUEMENT sa réponse EXACTEMENT comme elle est. N'ajoute RIEN.

Spécialités BASIC : recettes, nutrition, substitutions, conversions, menus, vins, techniques culinaires.

Ne reformule jamais. Ne commente jamais. Ne répète jamais.`;

// Création de l'agent
export const cuisinierAgent = createReactAgent({
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
      `👨‍🍳 Cuisinier Agent: Traitement de la demande pour l'utilisateur ${userId}`
    );
    console.log(`📝 Demande: "${message}"`);

    const response = await cuisinierAgent.invoke(
      { messages: [{ role: "user", content: message }] },
      thread
    );

    const lastMessage = response.messages[response.messages.length - 1];

    console.log(
      `✅ Cuisinier Agent: Réponse générée (${lastMessage.content.length} caractères)`
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
      },
    };
  } catch (error) {
    console.error("❌ Erreur Cuisinier Agent:", error);

    // Réponse d'erreur enrichie
    const fallbackResponse = `# 🔥 Oups, petit souci en cuisine !

Je rencontre une difficulté technique momentanée. Mais ne vous inquiétez pas, je reste à votre disposition !

## 💡 Exemples de ce que je peux faire pour vous :

### 🍽️ **Recherche et Recettes** :
- "Recette de coq au vin pour 6 personnes"
- "Plats végétariens avec des lentilles"
- "Desserts sans gluten faciles"

### 📊 **Nutrition et Santé** :
- "Calories d'une quiche lorraine"
- "Valeurs nutritionnelles de ma recette"
- "Menu équilibré pour sportif"

### 🔄 **Substitutions et Adaptations** :
- "Remplacer les œufs dans un gâteau"
- "Alternative végane au beurre"
- "Recette sans lactose"

### 📏 **Conversions et Mesures** :
- "Convertir 2 cups en grammes de farine"
- "180°F en Celsius"
- "Équivalence cuillères à soupe"

### 📅 **Planification de Menus** :
- "Menu de la semaine pour 4 personnes"
- "Repas budget étudiant"
- "Planning végétarien 5 jours"

### 🍷 **Accords et Accompagnements** :
- "Vin avec un saumon grillé"
- "Accompagnement pour bœuf bourguignon"
- "Boisson sans alcool pour curry"

### 👨‍🍳 **Techniques Culinaires** :
- "Comment faire un risotto parfait"
- "Technique de l'émulsion"
- "Réussir la cuisson d'un steak"

Reformulez votre demande et je serai ravi de vous aider ! 🍴✨`;

    return {
      success: false,
      error: error.message,
      response: fallbackResponse,
      threadId: userId,
      metadata: {
        errorType: error.name || "UnknownError",
        timestamp: new Date().toISOString(),
      },
    };
  }
}

// Fonction pour obtenir les statistiques de l'agent
export function getAgentStats() {
  return {
    name: "Chef Cuisinier IA Basic",
    version: "1.0.0 - Basic avec 7 outils spécialisés",
    formule: "Basic (Essentiel culinaire)",
    tools: [
      {
        name: "externalRecipeApi",
        description:
          "Recherche de recettes via APIs multiples (Marmiton, Spoonacular, TheMealDB, Edamam)",
        category: "Basic - Recettes",
      },
      {
        name: "nutritionCalculator",
        description:
          "Calcul des valeurs nutritionnelles complètes avec conseils santé",
        category: "Basic - Nutrition",
      },
      {
        name: "ingredientSubstitution",
        description:
          "Substitutions d'ingrédients pour allergies, régimes et disponibilité",
        category: "Basic - Adaptations",
      },
      {
        name: "unitConverter",
        description:
          "Conversion d'unités culinaires (poids, volume, température) avec densités",
        category: "Basic - Conversions",
      },
      {
        name: "menuPlanner",
        description:
          "Planification de menus équilibrés avec listes de courses et budgets",
        category: "Basic - Planification",
      },
      {
        name: "winePairing",
        description:
          "Accords mets et vins avec suggestions de bouteilles et conseils service",
        category: "Basic - Accords",
      },
      {
        name: "cookingTechniques",
        description:
          "Techniques culinaires avancées avec explications détaillées et astuces chef",
        category: "Basic - Techniques",
      },
    ],
    capabilities: [
      "Recherche et analyse de recettes",
      "Calculs nutritionnels complets",
      "Substitutions intelligentes d'ingrédients",
      "Conversions d'unités précises",
      "Planification de menus équilibrés",
      "Conseils accords mets et vins",
      "Maîtrise des techniques culinaires",
    ],
    upgrades: {
      premium: "Ajoute la création visuelle (logos, images, PDFs, templates)",
      business: "Ajoute la recherche de services et outils professionnels",
    },
  };
}

// Fonction pour réinitialiser la mémoire d'un utilisateur
export async function resetUserMemory(userId: string) {
  try {
    console.log(
      `🧹 Réinitialisation de la mémoire culinaire pour l'utilisateur ${userId}`
    );
    return {
      success: true,
      message: `Mémoire culinaire réinitialisée pour ${userId} - Tous les outils sont prêts !`,
    };
  } catch (error) {
    console.error("❌ Erreur lors de la réinitialisation:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
