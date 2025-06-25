import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

const chatgpt = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.3, // Plus précis pour les calculs
});

export const nutritionAnalyzer = tool(
  async ({ recipe_or_ingredients, servings, analysis_type }) => {
    try {
      const prompt = `Analyse nutritionnelle pour: ${recipe_or_ingredients} (${servings} portions)

Format de présentation OBLIGATOIRE:

# 📊 Analyse Nutritionnelle

## 🔢 Valeurs par Portion

**⚡ Énergie :** [X] kcal  
**🥩 Protéines :** [X] g  
**🍞 Glucides :** [X] g  
**🫒 Lipides :** [X] g  

## 📈 Analyse

### ✅ Points Forts
• [Point fort 1]
• [Point fort 2]
• [Point fort 3]

### ⚠️ À Améliorer
• [Point d'amélioration 1]
• [Point d'amélioration 2]

### 🎯 Évaluation Globale
**Note :** ⭐⭐⭐⭐⭐ ([X]/10)  
**Raison :** [Explication courte]

IMPORTANT: Utilise EXACTEMENT cette structure avec émojis et sauts de ligne.`;

      const response = await chatgpt.invoke(prompt);

      return response.content;
    } catch (error) {
      console.error("Erreur analyse nutritionnelle:", error);
      return `❌ Impossible d'analyser les valeurs nutritionnelles. Vérifiez les informations fournies.`;
    }
  },
  {
    name: "nutritionAnalyzer",
    description:
      "Analyse nutritionnelle complète d'une recette ou liste d'ingrédients avec conseils santé",
    schema: z.object({
      recipe_or_ingredients: z
        .string()
        .describe("Recette complète ou liste d'ingrédients avec quantités"),
      servings: z.number().describe("Nombre de portions pour le calcul"),
      analysis_type: z
        .string()
        .optional()
        .describe(
          "Type d'analyse (basique, détaillée, sportif, régime spécial)"
        )
        .default("détaillée"),
    }),
  }
);
