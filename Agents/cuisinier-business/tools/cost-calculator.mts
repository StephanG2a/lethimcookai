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
      // RESTRICTION DOMAINE CULINAIRE : Validation des types d'établissement
      const allowedBusinessTypes = [
        "restaurant",
        "bistrot",
        "brasserie",
        "café",
        "pizzeria",
        "traiteur",
        "food truck",
        "boulangerie",
        "pâtisserie",
        "glacier",
        "bar à vins",
        "gastro",
        "fast-food",
        "snack",
        "cantine",
        "chef à domicile",
        "cuisine",
        "culinaire",
        "gastronomie",
        "alimentation",
        "épicerie",
      ];

      const isValidBusinessType = allowedBusinessTypes.some(
        (type) =>
          business_type.toLowerCase().includes(type) ||
          type.includes(business_type.toLowerCase())
      );

      if (!isValidBusinessType) {
        return `# ❌ Calculateur de Coûts - Domaine Non Supporté

## 🎯 Restriction au Domaine Culinaire
Ce calculateur de coûts est spécialisé dans le **secteur culinaire uniquement**.

**Types d'établissements supportés :**
• **Restauration :** restaurants, bistrots, brasseries, pizzerias
• **Services :** traiteurs, food trucks, chefs à domicile
• **Artisanat :** boulangeries, pâtisseries, glaciers
• **Commerce :** cafés, bars à vins, épiceries fines

**Votre demande :** "${business_type}" ne correspond pas à notre domaine d'expertise culinaire.

💡 **Reformulez votre demande** avec un type d'établissement alimentaire pour obtenir un calcul de coûts précis !`;
      }

      const calculatorPrompt = `Calcul de coûts spécialisé CUISINE pour ${business_type}.

IMPORTANT: Concentre-toi EXCLUSIVEMENT sur le secteur culinaire et restauration.

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
    description:
      "Calcule les coûts et prix de vente EXCLUSIVEMENT pour établissements culinaires et restaurants",
    schema: z.object({
      business_type: z
        .string()
        .describe(
          "Type d'établissement culinaire (restaurant, food truck, traiteur, boulangerie, etc.)"
        ),
      menu_items: z
        .string()
        .describe("Liste des plats et produits culinaires principaux"),
      covers_per_day: z
        .number()
        .describe("Nombre de couverts/clients par jour"),
      ingredient_costs: z
        .number()
        .describe("Coût ingrédients culinaires moyen par couvert"),
      staff_costs: z
        .number()
        .describe("Coûts personnel cuisine/service mensuels"),
      rent_costs: z
        .number()
        .describe("Loyer et charges établissement culinaire mensuels"),
      target_margin: z
        .number()
        .describe("Marge bénéficiaire souhaitée sur produits alimentaires (%)"),
    }),
  }
);
