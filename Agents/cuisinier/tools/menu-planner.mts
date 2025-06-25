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
      const prompt = `Planning ${duration} pour ${people_count} personnes
🥗 ${dietary_preferences || "Pas de restriction"}
💰 ${budget || "Budget libre"}
🍽️ ${meal_types}

Format de présentation OBLIGATOIRE:

# 📅 Planning de Menus - ${duration}

## 🍽️ Menu Détaillé

${
  duration.includes("semaine") || duration.includes("7")
    ? `
### 🌅 Lundi
**Petit-déjeuner :** [Plat] - [X min]  
**Déjeuner :** [Plat] - [X min]  
**Dîner :** [Plat] - [X min]

### 🌞 Mardi  
**Petit-déjeuner :** [Plat] - [X min]  
**Déjeuner :** [Plat] - [X min]  
**Dîner :** [Plat] - [X min]

### 🌸 Mercredi
**Petit-déjeuner :** [Plat] - [X min]  
**Déjeuner :** [Plat] - [X min]  
**Dîner :** [Plat] - [X min]

### 🌻 Jeudi
**Petit-déjeuner :** [Plat] - [X min]  
**Déjeuner :** [Plat] - [X min]  
**Dîner :** [Plat] - [X min]

### 🌺 Vendredi  
**Petit-déjeuner :** [Plat] - [X min]  
**Déjeuner :** [Plat] - [X min]  
**Dîner :** [Plat] - [X min]

### 🎉 Samedi
**Petit-déjeuner :** [Plat] - [X min]  
**Déjeuner :** [Plat] - [X min]  
**Dîner :** [Plat] - [X min]

### 🌈 Dimanche
**Petit-déjeuner :** [Plat] - [X min]  
**Déjeuner :** [Plat] - [X min]  
**Dîner :** [Plat] - [X min]
`
    : `
### 📍 Jour 1
**Petit-déjeuner :** [Plat] - [X min]  
**Déjeuner :** [Plat] - [X min]  
**Dîner :** [Plat] - [X min]

### 📍 Jour 2
**Petit-déjeuner :** [Plat] - [X min]  
**Déjeuner :** [Plat] - [X min]  
**Dîner :** [Plat] - [X min]

[Continue selon durée...]
`
}

## 🛒 Liste de Courses

### 🥬 Légumes & Fruits
• [Légume 1] - [quantité pour ${people_count} pers]
• [Légume 2] - [quantité pour ${people_count} pers]

### 🥩 Viandes & Poissons  
• [Viande 1] - [quantité pour ${people_count} pers]
• [Poisson 1] - [quantité pour ${people_count} pers]

### 🥛 Produits Laitiers
• [Produit 1] - [quantité pour ${people_count} pers]
• [Produit 2] - [quantité pour ${people_count} pers]

### 🍞 Féculents & Céréales
• [Féculent 1] - [quantité pour ${people_count} pers]

### 🧂 Épicerie
• [Produit 1] - [quantité]
• [Condiment 1] - [quantité]

## 💡 Conseils d'Organisation
• [Conseil 1]
• [Conseil 2]  
• [Conseil 3]

IMPORTANT: Utilise EXACTEMENT cette structure avec émojis et sauts de ligne.`;

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
