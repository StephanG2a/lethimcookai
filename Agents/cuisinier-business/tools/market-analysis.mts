import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

const chatgpt = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.5,
});

export const marketAnalysis = tool(
  async ({
    location,
    business_type,
    target_segment,
    cuisine_type,
    budget_range,
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
      ];

      const isValidBusinessType = allowedBusinessTypes.some(
        (type) =>
          business_type.toLowerCase().includes(type) ||
          type.includes(business_type.toLowerCase())
      );

      if (!isValidBusinessType) {
        return `# ❌ Analyse de Marché - Domaine Non Supporté

## 🎯 Restriction au Domaine Culinaire
Cette analyse de marché est spécialisée dans le **secteur culinaire uniquement**.

**Types d'établissements supportés :**
• Restaurants (gastronomique, bistrot, brasserie)
• Pizzerias, traiteurs, food trucks
• Boulangeries, pâtisseries, glaciers
• Bars à vins, cafés, snacks
• Services culinaires (chef à domicile, cours de cuisine)

**Votre demande :** "${business_type}" ne correspond pas à notre domaine d'expertise.

💡 **Reformulez votre demande** avec un type d'établissement culinaire pour obtenir une analyse complète !`;
      }

      const analysisPrompt = `Analyse de marché spécialisée CUISINE pour ${business_type} à ${location}.

IMPORTANT: Concentre-toi UNIQUEMENT sur le secteur culinaire et alimentaire.

Type de cuisine: ${cuisine_type}
Segment cible: ${target_segment}
Gamme de prix: ${budget_range}

Format de présentation :

# 📊 Analyse de Marché : ${location}

## 🎯 Segmentation du Marché

### 👥 Profil de la Clientèle
**Segment principal :** ${target_segment}  
**Démographie :** [Analyse âge, revenus, habitudes]  
**Comportements :** [Fréquence, dépenses moyennes]  
**Attentes :** [Service, qualité, prix]

## 🏪 Analyse Concurrentielle

### 🥇 Concurrents Directs
**${business_type} similaires :**  
• [Nom] - [Forces/Faiblesses]  
• [Nom] - [Positionnement]  
• [Nom] - [Prix/Concept]

### 🥈 Concurrents Indirects
**Alternatives alimentaires :**  
• Fast-food, chaînes, livraison  
• Analyse de l'offre existante

## 💰 Positionnement Prix

### 📊 Gamme ${budget_range}
**Prix moyens constatés :**  
• Entrées : [€]  
• Plats : [€]  
• Desserts : [€]  
• Menu complet : [€]

### 🎯 Opportunités Tarifaires
[Niches de prix disponibles]

## 📍 Analyse Géographique

### 🚶 Zone de Chalandise
**Rayon 1km :** [Population, profil]  
**Rayon 3km :** [Bassin élargi]  
**Accessibilité :** [Transports, parking]

### 🏢 Environnement Commercial
**Commerces adjacents :** [Synergie]  
**Flux piétons :** [Heures de pointe]  
**Concurrence proximité :** [Densité]

## 📈 Tendances Marché

### 🔥 Opportunités
• [Tendances alimentaires]  
• [Créneaux porteurs]  
• [Innovations attendues]

### ⚠️ Menaces
• [Risques identifiés]  
• [Saisonnalité]  
• [Évolutions réglementaires]

## 🎯 Recommandations Stratégiques

### 💡 Positionnement Optimal
[Proposition de valeur unique]

### 📊 Prévisions de Marché
**Potentiel CA :** [€/mois]  
**Part de marché cible :** [%]  
**Croissance attendue :** [%/an]

## 🏆 Facteurs Clés de Succès
[Points critiques pour réussir sur ce marché]

Reste factuel et orienté business.`;

      const response = await chatgpt.invoke(analysisPrompt);

      return `${response.content}

---
**MÉTADONNÉES_ANALYSE:** ${JSON.stringify({
        location: location,
        business_type: business_type,
        target_segment: target_segment,
        analysis_date: new Date().toISOString(),
        market_maturity: "Moyenne", // Estimation par défaut
        competition_level: "Modérée", // Estimation par défaut
      })}`;
    } catch (error) {
      return `# ❌ Erreur
Impossible d'analyser le marché pour "${business_type}" à "${location}".`;
    }
  },
  {
    name: "market_analysis",
    description:
      "Analyse concurrentielle et étude de marché EXCLUSIVEMENT pour établissements culinaires et restaurants",
    schema: z.object({
      location: z
        .string()
        .describe("Zone géographique d'analyse du marché culinaire"),
      business_type: z
        .string()
        .describe(
          "Type d'établissement culinaire (restaurant, bistrot, pizzeria, boulangerie, etc.)"
        ),
      target_segment: z
        .string()
        .describe("Segment de clientèle culinaire visé"),
      cuisine_type: z
        .string()
        .describe("Type de cuisine ou spécialité gastronomique proposée"),
      budget_range: z
        .string()
        .describe("Gamme de prix culinaire (économique, moyen, haut de gamme)"),
    }),
  }
);
