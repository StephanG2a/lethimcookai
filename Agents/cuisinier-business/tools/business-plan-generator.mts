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
      const businessPlanPrompt = `Génère un business plan pour "${project_name}".

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
    description: "Génère un business plan complet pour projets culinaires",
    schema: z.object({
      project_name: z.string().describe("Nom du projet/restaurant"),
      business_type: z
        .string()
        .describe(
          "Type d'établissement (restaurant, food truck, traiteur, etc.)"
        ),
      concept: z.string().describe("Concept et spécialité culinaire"),
      target_market: z
        .string()
        .describe("Marché cible (familles, professionnels, étudiants, etc.)"),
      location: z.string().describe("Zone d'implantation prévue"),
      initial_budget: z.number().describe("Budget initial disponible (€)"),
      timeline: z.string().describe("Timeline d'ouverture souhaitée"),
    }),
  }
);
