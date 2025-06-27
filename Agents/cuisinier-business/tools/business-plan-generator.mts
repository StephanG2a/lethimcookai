import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

const chatgpt = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.6,
});

export const businessPlanGenerator = tool(
  async ({
    project_name,
    business_type,
    concept,
    target_market,
    location,
    initial_budget,
    timeline,
  }) => {
    try {
      // RESTRICTION DOMAINE CULINAIRE : Validation des types d'entreprise acceptés
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
        "cours de cuisine",
        "livraison",
        "épicerie fine",
        "fromagerie",
        "charcuterie",
      ];

      const isValidBusinessType = allowedBusinessTypes.some(
        (type) =>
          business_type.toLowerCase().includes(type) ||
          type.includes(business_type.toLowerCase())
      );

      if (!isValidBusinessType) {
        return `# ❌ Business Plan - Domaine Non Supporté

## 🎯 Restriction au Domaine Culinaire
Ce générateur de business plan est spécialisé dans le **secteur culinaire uniquement**.

**Types de projets supportés :**
• **Restauration :** restaurants, bistrots, brasseries, pizzerias
• **Artisanat :** boulangeries, pâtisseries, glaciers, fromageries
• **Services :** traiteurs, chefs à domicile, cours de cuisine
• **Mobile :** food trucks, livraison de repas
• **Spécialisés :** bars à vins, épiceries fines, snacks

**Votre projet :** "${business_type}" ne correspond pas à notre domaine d'expertise culinaire.

💡 **Reformulez votre projet** avec un type d'établissement alimentaire pour obtenir un business plan adapté !`;
      }

      const businessPlanPrompt = `Génère un business plan spécialisé CUISINE pour "${project_name}".

IMPORTANT: Concentre-toi EXCLUSIVEMENT sur le secteur culinaire et alimentaire.

Type: ${business_type}
Concept: ${concept}
Marché cible: ${target_market}
Localisation: ${location}
Budget initial: ${initial_budget}€
Timeline: ${timeline}

Format de présentation :

# 📋 Business Plan : ${project_name}

## 🎯 Résumé Exécutif
[Vision, mission, objectifs principaux]

## 🏪 Concept & Positionnement
**Type d'établissement :** ${business_type}  
**Concept unique :** [Différenciation]  
**Positionnement :** [Segment de marché]

## 👥 Analyse de Marché
**Cible primaire :** ${target_market}  
**Taille du marché :** [Estimation]  
**Concurrence :** [Analyse concurrentielle]  
**Opportunités :** [Tendances favorables]

## 🍽️ Offre de Services
**Menu/Produits :** [Descriptions]  
**Prix moyens :** [Fourchettes]  
**Services additionnels :** [Extras]

## 📍 Stratégie d'Implantation
**Localisation :** ${location}  
**Surface nécessaire :** [m²]  
**Aménagement :** [Layout optimal]  
**Accessibilité :** [Transports, parking]

## 💰 Plan Financier

### Investissement Initial (${initial_budget}€)
**Équipement :** [Détail]  
**Aménagement :** [Coûts]  
**Stock initial :** [€]  
**Fonds de roulement :** [€]

### Prévisionnel d'Exploitation
**CA année 1 :** [€]  
**Charges fixes :** [€/mois]  
**Charges variables :** [%]  
**Seuil de rentabilité :** [Mois]

## 📈 Stratégie Marketing
**Communication :** [Canaux]  
**Lancement :** [Actions]  
**Fidélisation :** [Programme]

## ⚖️ Aspects Légaux
**Forme juridique :** [Recommandation]  
**Licences :** [À obtenir]  
**Assurances :** [Obligatoires]

## 📅 Planning de Lancement
${timeline}

## 🎯 Objectifs & KPIs
[Indicateurs de performance à suivre]

Reste structuré et actionnable.`;

      const response = await chatgpt.invoke(businessPlanPrompt);

      return `${response.content}

---
**MÉTADONNÉES_BP:** ${JSON.stringify({
        project: project_name,
        type: business_type,
        budget: initial_budget,
        location: location,
        generated_date: new Date().toISOString(),
        estimated_completion: "6-12 mois",
      })}`;
    } catch (error) {
      return `# ❌ Erreur
Impossible de générer le business plan pour "${project_name}".`;
    }
  },
  {
    name: "business_plan_generator",
    description:
      "Génère un business plan complet EXCLUSIVEMENT pour projets et établissements culinaires",
    schema: z.object({
      project_name: z.string().describe("Nom du projet culinaire/restaurant"),
      business_type: z
        .string()
        .describe(
          "Type d'établissement culinaire (restaurant, food truck, traiteur, boulangerie, etc.)"
        ),
      concept: z
        .string()
        .describe("Concept et spécialité culinaire/gastronomique"),
      target_market: z
        .string()
        .describe(
          "Marché cible culinaire (familles, professionnels gourmets, étudiants, etc.)"
        ),
      location: z.string().describe("Zone d'implantation culinaire prévue"),
      initial_budget: z
        .number()
        .describe("Budget initial disponible pour projet culinaire (€)"),
      timeline: z
        .string()
        .describe("Timeline d'ouverture de l'établissement culinaire"),
    }),
  }
);
