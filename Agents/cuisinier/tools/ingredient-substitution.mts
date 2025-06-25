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
      const prompt = `Tu es un expert en substitutions culinaires. L'utilisateur a besoin de remplacer un ingrédient :

🔄 **Ingrédient à remplacer** : ${ingredient}
❓ **Raison du remplacement** : ${reason}
🍽️ **Contexte de la recette** : ${recipe_context}
📏 **Quantité originale** : ${quantity || "Non spécifiée"}

Fournis des substitutions détaillées avec :

**✅ MEILLEURES ALTERNATIVES :**
- 3-4 substituts recommandés par ordre de préférence
- Ratios de conversion précis
- Impact sur le goût et la texture

**⚠️ ADAPTATIONS NÉCESSAIRES :**
- Modifications de technique de cuisson
- Ajustements de temps/température
- Autres ingrédients à adapter

**📊 COMPARAISON :**
- Profil nutritionnel vs original
- Coût approximatif
- Facilité de mise en œuvre

**💡 CONSEILS DE CHEF :**
- Astuces pour optimiser le résultat
- Erreurs à éviter
- Variations créatives possibles

**🎯 RÉSULTAT ATTENDU :**
- À quoi s'attendre niveau goût
- Différences de texture
- Réussite probable de la substitution

Sois précis sur les quantités et les techniques pour garantir le succès de la recette.`;

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
