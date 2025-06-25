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
      // Détecter automatiquement la quantité dans la requête si non spécifiée
      let finalQuantity = quantity;

      if (!finalQuantity) {
        const queryLower = query.toLowerCase();
        if (
          queryLower.includes("une recette") ||
          queryLower.includes("1 recette") ||
          queryLower.includes("la recette") ||
          queryLower.match(/\bune\b.*recette/)
        ) {
          finalQuantity = 1;
        } else if (
          queryLower.includes("deux recettes") ||
          queryLower.includes("2 recettes")
        ) {
          finalQuantity = 2;
        } else if (
          queryLower.includes("trois recettes") ||
          queryLower.includes("3 recettes")
        ) {
          finalQuantity = 3;
        }
        // Sinon, laisser undefined pour avoir 2-3 options par défaut
      }

      // Déterminer le nombre de recettes à proposer
      const recipeCount = finalQuantity || 3; // Par défaut 3 recettes si non spécifié
      const quantityText =
        finalQuantity === 1
          ? "1 recette"
          : finalQuantity
          ? `${finalQuantity} recettes`
          : "2-3 recettes";

      const prompt = `${
        finalQuantity
          ? `Donne EXACTEMENT ${quantityText} pour "${query}"`
          : `Donne 2-3 recettes pour "${query}"`
      }:

${dietary_restrictions ? `🥗 Restrictions: ${dietary_restrictions}\n` : ""}${
        cuisine_type ? `🌍 Cuisine: ${cuisine_type}\n` : ""
      }${difficulty ? `📊 Difficulté: ${difficulty}\n` : ""}${
        prep_time ? `⏱️ Temps: ${prep_time}\n` : ""
      }

Format de présentation OBLIGATOIRE:

# 🍽️ ${finalQuantity === 1 ? "Recette" : "Recettes"} : ${query}

${
  finalQuantity === 1
    ? `
## 👨‍🍳 [NOM DE LA RECETTE]

### 🛒 Ingrédients (4 personnes)
• [Ingrédient 1] - [quantité]
• [Ingrédient 2] - [quantité]
• [etc...]

### 📋 Préparation
1. **[Étape 1]** : [description]
2. **[Étape 2]** : [description]  
3. **[Étape 3]** : [description]
4. **[Étape 4]** : [description]

### ⏱️ Informations
**Temps de préparation :** [X] min  
**Temps de cuisson :** [X] min  
**Temps total :** [X] min  
**Difficulté :** [niveau] 

### 💡 Conseil du Chef
[Un conseil pour réussir]
`
    : `
${Array.from(
  { length: finalQuantity || 3 },
  (_, i) => `
## 👨‍🍳 Recette ${i + 1} : [NOM]

### 🛒 Ingrédients (4 pers)
• [Ingrédients principaux avec quantités]

### 📋 Étapes
1. [Étape 1]
2. [Étape 2]
3. [Étape 3]

### ⏱️ Info
**Temps :** [X] min | **Difficulté :** [niveau]

---
`
).join("")}
`
}

IMPORTANT: Utilise EXACTEMENT cette structure avec les émojis et sauts de ligne.`;

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
