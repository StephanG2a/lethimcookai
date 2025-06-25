import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

const chatgpt = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
});

export const recipeSearch = tool(
  async ({
    query,
    quantity,
    dietary_restrictions,
    cuisine_type,
    difficulty,
    prep_time,
  }) => {
    try {
      // Déterminer le nombre de recettes à proposer
      const recipeCount = quantity || 3; // Par défaut 3 recettes si non spécifié
      const quantityText =
        recipeCount === 1 ? "1 recette" : `${recipeCount} recettes`;

      const prompt = `Tu es un expert culinaire. L'utilisateur cherche une recette avec les critères suivants :

🔍 **Recherche** : ${query}
📊 **Nombre souhaité** : ${quantityText}
${
  dietary_restrictions
    ? `🥗 **Restrictions alimentaires** : ${dietary_restrictions}`
    : ""
}
${cuisine_type ? `🌍 **Type de cuisine** : ${cuisine_type}` : ""}
${difficulty ? `📊 **Difficulté** : ${difficulty}` : ""}
${prep_time ? `⏱️ **Temps de préparation** : ${prep_time}` : ""}

Donne-moi EXACTEMENT ${quantityText} pertinente(s) avec :
- **Nom de la recette**
- **Ingrédients** (avec quantités pour 4 personnes)
- **Instructions étape par étape**
- **Temps de préparation et cuisson**
- **Niveau de difficulté**
- **Conseils du chef**

Format ta réponse de manière claire et structurée avec des émojis pour la lisibilité.`;

      const response = await chatgpt.invoke(prompt);

      return response.content;
    } catch (error) {
      console.error("Erreur recherche recettes:", error);
      return `❌ Impossible de rechercher des recettes pour "${query}". Réessayez avec des termes différents.`;
    }
  },
  {
    name: "recipeSearch",
    description:
      "Recherche de recettes détaillées selon critères spécifiques (ingrédients, type de cuisine, restrictions alimentaires)",
    schema: z.object({
      query: z
        .string()
        .describe(
          "Recherche principale (ingrédient, nom de plat, type de recette)"
        ),
      quantity: z
        .number()
        .optional()
        .describe("Nombre de recettes demandées (si non spécifié, défaut à 3)"),
      dietary_restrictions: z
        .string()
        .optional()
        .describe(
          "Restrictions alimentaires (végétarien, vegan, sans gluten, etc.)"
        ),
      cuisine_type: z
        .string()
        .optional()
        .describe("Type de cuisine (française, italienne, asiatique, etc.)"),
      difficulty: z
        .string()
        .optional()
        .describe("Niveau de difficulté (facile, moyen, difficile)"),
      prep_time: z
        .string()
        .optional()
        .describe("Temps de préparation souhaité (ex: moins de 30 min)"),
    }),
  }
);
