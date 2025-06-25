import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

const chatgpt = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.6,
});

export const winePairing = tool(
  async ({ dish, cooking_method, main_ingredients, occasion, preferences }) => {
    try {
      const prompt = `Accords pour ${dish}
${cooking_method ? `Cuisson: ${cooking_method}\n` : ""}${
        main_ingredients ? `Ingrédients: ${main_ingredients}\n` : ""
      }${occasion ? `Occasion: ${occasion}\n` : ""}

Format de présentation OBLIGATOIRE:

# 🍷 Accords Mets-Vins : ${dish}

## 🏆 Sélection du Sommelier

### 🥇 Premier Choix
**[Nom du Vin]**  
🏷️ **Région :** [Appellation]  
💰 **Prix :** [X-Y€]  
🤝 **Pourquoi :** [Explication en 1 phrase]

### 🥈 Deuxième Choix  
**[Nom du Vin]**  
🏷️ **Région :** [Appellation]  
💰 **Prix :** [X-Y€]  
🤝 **Pourquoi :** [Explication en 1 phrase]

### 🥉 Troisième Choix
**[Nom du Vin]**  
🏷️ **Région :** [Appellation]  
💰 **Prix :** [X-Y€]  
🤝 **Pourquoi :** [Explication en 1 phrase]

## 🚫 Alternative Sans Alcool
**[Suggestion]** - [Pourquoi cette boisson]

## 🍾 Conseils de Service
**🌡️ Température :** [X-Y°C]  
**🥃 Verre :** [Type recommandé]

IMPORTANT: Utilise EXACTEMENT cette structure avec émojis et sauts de ligne.`;

      const response = await chatgpt.invoke(prompt);

      return response.content;
    } catch (error) {
      console.error("Erreur accords vins:", error);
      return `❌ Impossible de proposer des accords pour "${dish}". Réessayez avec plus de détails.`;
    }
  },
  {
    name: "winePairing",
    description:
      "Suggestions d'accords mets-vins expertises avec alternatives sans alcool et conseils de service",
    schema: z.object({
      dish: z.string().describe("Nom du plat ou type de cuisine"),
      cooking_method: z
        .string()
        .optional()
        .describe("Méthode de cuisson (grillé, braisé, cru, etc.)"),
      main_ingredients: z
        .string()
        .optional()
        .describe("Ingrédients principaux du plat"),
      occasion: z
        .string()
        .optional()
        .describe(
          "Type d'occasion (dîner romantique, repas familial, fête, etc.)"
        ),
      preferences: z
        .string()
        .optional()
        .describe(
          "Préférences spécifiques (rouge, blanc, budget, région, etc.)"
        ),
    }),
  }
);
