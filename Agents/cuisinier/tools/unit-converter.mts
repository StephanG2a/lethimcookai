import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

const chatgpt = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.2, // Très précis pour les conversions
});

export const unitConverter = tool(
  async ({ quantity, from_unit, to_unit, ingredient }) => {
    try {
      const prompt = `Convertis ${quantity} ${from_unit} vers ${to_unit}${
        ingredient ? ` (${ingredient})` : ""
      }

Format de présentation OBLIGATOIRE:

# 📐 Conversion Culinaire

## 🎯 Résultat Principal
**${quantity} ${from_unit} = [X] ${to_unit}**
${ingredient ? `*Pour ${ingredient}*` : ""}

## 📊 Équivalences Courantes
• **[Unité 1] :** [valeur]
• **[Unité 2] :** [valeur]  
• **[Unité 3] :** [valeur]

## 💡 Conseil Pratique
[Astuce de mesure utile]

IMPORTANT: Utilise EXACTEMENT cette structure avec émojis et sauts de ligne.`;

      const response = await chatgpt.invoke(prompt);

      return response.content;
    } catch (error) {
      console.error("Erreur conversion unités:", error);
      return `❌ Impossible de convertir ${quantity} ${from_unit} vers ${to_unit}. Vérifiez les unités.`;
    }
  },
  {
    name: "unitConverter",
    description:
      "Conversion précise d'unités culinaires (poids, volume, température) avec prise en compte des spécificités des ingrédients",
    schema: z.object({
      quantity: z.number().describe("Quantité à convertir"),
      from_unit: z
        .string()
        .describe(
          "Unité de départ (g, kg, ml, cl, l, cup, tbsp, tsp, oz, lb, °C, °F, etc.)"
        ),
      to_unit: z.string().describe("Unité d'arrivée"),
      ingredient: z
        .string()
        .optional()
        .describe("Ingrédient spécifique pour ajuster selon la densité"),
    }),
  }
);
