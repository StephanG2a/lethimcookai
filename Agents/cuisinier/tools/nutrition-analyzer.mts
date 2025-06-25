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
      const prompt = `Tu es un nutritionniste expert. Analyse les informations nutritionnelles pour :

📝 **Recette/Ingrédients** : ${recipe_or_ingredients}
👥 **Nombre de portions** : ${servings}
📊 **Type d'analyse** : ${analysis_type}

Fournis une analyse nutritionnelle détaillée avec :

**🔢 VALEURS NUTRITIONNELLES (par portion) :**
- Calories (kcal)
- Protéines (g)
- Glucides (g)
- Lipides (g)
- Fibres (g)
- Sucres (g)
- Sodium (mg)

**📈 RÉPARTITION :**
- % de protéines, glucides, lipides
- Indice glycémique estimé
- Densité calorique

**💡 CONSEILS NUTRITIONNELS :**
- Points forts nutritionnels
- Points d'amélioration
- Suggestions d'accompagnements
- Adaptations pour régimes spéciaux

**⚖️ ÉVALUATION SANTÉ :**
- Note globale sur 10
- Convient pour quels objectifs (perte/prise de poids, sport, etc.)

Sois précis dans tes calculs et donne des conseils pratiques.`;

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
