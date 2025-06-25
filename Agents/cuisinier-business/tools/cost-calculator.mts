import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

const chatgpt = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.3,
});

export const costCalculator = tool(
  async ({
    business_type,
    menu_items,
    covers_per_day,
    ingredient_costs,
    staff_costs,
    rent_costs,
    target_margin,
  }) => {
    try {
      const calculatorPrompt = `Calcul de coûts pour ${business_type}.

Menu items: ${menu_items}
Couverts/jour: ${covers_per_day}
Coûts ingrédients: ${ingredient_costs}€
Coûts personnel: ${staff_costs}€
Loyer/charges: ${rent_costs}€
Marge souhaitée: ${target_margin}%

Format de présentation :

# 💰 Calculateur de Coûts : ${business_type}

## 📊 Analyse des Coûts

### 🍽️ Coûts Variables (par couvert)
**Ingrédients :** [Calcul détaillé]  
**Emballages/Consommables :** [Estimation]  
**Total variable :** [€ par couvert]

### 🏢 Coûts Fixes (mensuels)
**Personnel :** ${staff_costs}€  
**Loyer/Charges :** ${rent_costs}€  
**Assurances/Licences :** [Estimation]  
**Total fixe mensuel :** [€/mois]

## 💡 Prix de Vente Recommandés

### 📋 Par Plat
[Calculs prix par item avec marge ${target_margin}%]

### 🎯 Seuil de Rentabilité
**Couverts minimum/jour :** [Nombre]  
**CA minimum/mois :** [€]

## 📈 Projections
**CA potentiel (${covers_per_day} couverts/jour) :** [€/mois]  
**Bénéfice estimé :** [€/mois]  
**ROI :** [%]

Reste précis et actionnable.`;

      const response = await chatgpt.invoke(calculatorPrompt);

      return `${response.content}

---
**MÉTADONNÉES_CALCUL:** ${JSON.stringify({
        business_type: business_type,
        daily_covers: covers_per_day,
        target_margin: target_margin,
        total_fixed_costs: staff_costs + rent_costs,
        calculation_date: new Date().toISOString(),
      })}`;
    } catch (error) {
      return `# ❌ Erreur
Impossible de calculer les coûts pour "${business_type}".`;
    }
  },
  {
    name: "cost_calculator",
    description: "Calcule les coûts et prix de vente pour restaurants",
    schema: z.object({
      business_type: z
        .string()
        .describe("Type d'établissement (restaurant, food truck, traiteur)"),
      menu_items: z.string().describe("Liste des plats principaux"),
      covers_per_day: z.number().describe("Nombre de couverts par jour"),
      ingredient_costs: z
        .number()
        .describe("Coût ingrédients moyen par couvert"),
      staff_costs: z.number().describe("Coûts personnel mensuels"),
      rent_costs: z.number().describe("Loyer et charges mensuels"),
      target_margin: z.number().describe("Marge bénéficiaire souhaitée (%)"),
    }),
  }
);
