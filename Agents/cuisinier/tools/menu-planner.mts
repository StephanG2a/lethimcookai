import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

const chatgpt = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.6,
});

export const menuPlanner = tool(
  async ({
    duration,
    people_count,
    dietary_preferences,
    budget,
    meal_types,
    goals,
  }) => {
    try {
      const prompt = `Tu es un chef planificateur de menus expert. Crée un plan de repas avec :

📅 **Durée** : ${duration}
👥 **Nombre de personnes** : ${people_count}
🥗 **Préférences alimentaires** : ${dietary_preferences || "Aucune restriction"}
💰 **Budget** : ${budget || "Pas de contrainte"}
🍽️ **Types de repas** : ${meal_types}
🎯 **Objectifs** : ${goals || "Équilibre général"}

Fournis un plan complet avec :

**📋 MENU DÉTAILLÉ :**
- Planning jour par jour avec tous les repas
- Nom des plats et descriptions courtes
- Équilibre nutritionnel quotidien

**🛒 LISTE DE COURSES ORGANISÉE :**
- Par catégories (légumes, viandes, épicerie, etc.)
- Quantités précises pour ${people_count} personnes
- Estimation des coûts si budget mentionné

**⚡ CONSEILS DE PRÉPARATION :**
- Préparations à l'avance possibles
- Organisation de la cuisine
- Temps de préparation par jour

**🔄 ALTERNATIVES ET FLEXIBILITÉ :**
- Substitutions possibles
- Adaptations selon saisons
- Suggestions de restes

**📊 ÉQUILIBRE NUTRITIONNEL :**
- Répartition macro-nutriments
- Validation des objectifs santé
- Variété alimentaire

Assure-toi que le menu soit pratique, équilibré et adapté aux contraintes mentionnées.`;

      const response = await chatgpt.invoke(prompt);

      return response.content;
    } catch (error) {
      console.error("Erreur planification menu:", error);
      return `❌ Impossible de créer le plan de menu. Vérifiez les paramètres fournis.`;
    }
  },
  {
    name: "menuPlanner",
    description:
      "Planification intelligente de menus avec listes de courses, équilibre nutritionnel et organisation pratique",
    schema: z.object({
      duration: z
        .string()
        .describe("Durée du planning (ex: 1 semaine, 3 jours, 1 mois)"),
      people_count: z.number().describe("Nombre de personnes"),
      dietary_preferences: z
        .string()
        .optional()
        .describe(
          "Préférences/restrictions (végétarien, sans gluten, keto, etc.)"
        ),
      budget: z
        .string()
        .optional()
        .describe("Budget approximatif ou contraintes financières"),
      meal_types: z
        .string()
        .describe(
          "Types de repas à inclure (petit-déjeuner, déjeuner, dîner, collations)"
        ),
      goals: z
        .string()
        .optional()
        .describe(
          "Objectifs spécifiques (perte de poids, prise de masse, santé, etc.)"
        ),
    }),
  }
);
