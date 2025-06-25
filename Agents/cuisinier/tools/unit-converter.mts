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
      const prompt = `Tu es un expert en conversions culinaires. Convertis précisément :

📏 **Quantité** : ${quantity}
🔄 **De** : ${from_unit}
🔄 **Vers** : ${to_unit}
🥄 **Ingrédient** : ${ingredient || "générique"}

Fournis une conversion précise avec :

**🎯 RÉSULTAT PRINCIPAL :**
- Conversion exacte avec chiffres précis
- Équivalence directe

**📐 CONVERSIONS MULTIPLES :**
- Autres unités courantes équivalentes
- Tableau de correspondances utiles

**⚖️ DENSITÉ/SPÉCIFICITÉS :**
- Prise en compte de la densité de l'ingrédient si applicable
- Différences entre poids et volume

**💡 CONSEILS PRATIQUES :**
- Astuces de mesure en cuisine
- Ustensiles recommandés
- Approximations utiles pour cuisiner

**📊 TABLEAU DE RÉFÉRENCE :**
- Conversions courantes pour cet ingrédient
- Mesures alternatives

Sois très précis dans tes calculs et donne des équivalences pratiques pour la cuisine.`;

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
