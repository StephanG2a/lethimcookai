import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

const chatgpt = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.5,
});

export const ingredientSubstitution = tool(
  async ({ ingredient, reason, recipe_context, quantity }) => {
    try {
      const prompt = `Substitutions pour ${ingredient} dans ${recipe_context}
Raison: ${reason}

Format de présentation OBLIGATOIRE:

# 🔄 Substitutions : ${ingredient}

## 🎯 3 Meilleures Alternatives

### 🥇 Option 1 : [NOM]
**Ratio :** ${quantity || "[quantité]"} ${ingredient} = [X] [substitut]  
**Goût :** [Impact sur le goût]  
**Texture :** [Impact sur la texture]

### 🥈 Option 2 : [NOM]  
**Ratio :** ${quantity || "[quantité]"} ${ingredient} = [X] [substitut]  
**Goût :** [Impact sur le goût]  
**Texture :** [Impact sur la texture]

### 🥉 Option 3 : [NOM]
**Ratio :** ${quantity || "[quantité]"} ${ingredient} = [X] [substitut]  
**Goût :** [Impact sur le goût]  
**Texture :** [Impact sur la texture]

## 💡 Conseils de Réussite
• [Conseil 1]
• [Conseil 2]

IMPORTANT: Utilise EXACTEMENT cette structure avec émojis et sauts de ligne.`;

      const response = await chatgpt.invoke(prompt);

      return response.content;
    } catch (error) {
      console.error("Erreur substitution ingrédients:", error);
      return `❌ Impossible de trouver des substitutions pour "${ingredient}". Réessayez avec plus de contexte.`;
    }
  },
  {
    name: "ingredientSubstitution",
    description:
      "Trouve des substitutions d'ingrédients adaptées selon allergies, régimes, disponibilité ou préférences",
    schema: z.object({
      ingredient: z.string().describe("Ingrédient à remplacer"),
      reason: z
        .string()
        .describe(
          "Raison du remplacement (allergie, régime, indisponibilité, préférence, etc.)"
        ),
      recipe_context: z
        .string()
        .describe("Type de recette ou plat où l'ingrédient est utilisé"),
      quantity: z
        .string()
        .optional()
        .describe("Quantité originale de l'ingrédient"),
    }),
  }
);
