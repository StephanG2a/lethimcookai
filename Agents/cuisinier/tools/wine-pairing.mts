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
      const prompt = `Tu es un sommelier expert en accords mets-vins. Trouve les meilleurs accords pour :

🍽️ **Plat** : ${dish}
👨‍🍳 **Méthode de cuisson** : ${cooking_method || "Non spécifiée"}
🥘 **Ingrédients principaux** : ${
        main_ingredients || "À déterminer selon le plat"
      }
🎉 **Occasion** : ${occasion || "Repas classique"}
❤️ **Préférences** : ${preferences || "Aucune"}

Propose des accords détaillés avec :

**🍷 VINS RECOMMANDÉS :**
- 3-4 suggestions par ordre de préférence
- Appellations précises et millésimes si pertinent
- Alternatives par gamme de prix

**🔍 JUSTIFICATION DES ACCORDS :**
- Pourquoi ce vin s'accorde avec ce plat
- Équilibre des saveurs et textures
- Complémentarité ou contraste

**🥂 ALTERNATIVES SANS ALCOOL :**
- Boissons non alcoolisées appropriées
- Jus, thés, eaux aromatisées
- Créations originales

**🌍 SUGGESTIONS RÉGIONALES :**
- Accords traditionnels par région
- Vins locaux si le plat a une origine géographique

**💰 GAMMES DE PRIX :**
- Option économique (moins de 15€)
- Option milieu de gamme (15-30€)
- Option premium (plus de 30€)

**🍾 CONSEILS DE SERVICE :**
- Température de service
- Moment d'ouverture/carafage
- Verres recommandés

Sois précis et pédagogue dans tes recommandations.`;

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
