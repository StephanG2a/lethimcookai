import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import OpenAI from "openai";

// Vérifier la clé API avant d'instancier
const hasOpenAIKey = !!process.env.OPENAI_API_KEY;

let chatgpt: ChatOpenAI | null = null;
if (hasOpenAIKey) {
  try {
    chatgpt = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.8,
    });
  } catch (error) {
    console.warn("⚠️ Impossible d'instancier ChatOpenAI:", error.message);
  }
}

// Instanciation conditionnelle d'OpenAI
let openai: OpenAI | null = null;

function getOpenAIClient() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export const logoGenerator = tool(
  async ({
    business_name,
    business_type,
    cuisine_style,
    color_preferences,
    style_preference,
    additional_elements,
  }) => {
    // Vérifier si OpenAI est disponible
    if (!hasOpenAIKey) {
      return `# 🎨 Générateur de Logo - Configuration requise

## ❌ Clé API OpenAI manquante

Pour utiliser le générateur de logos, vous devez configurer votre clé API OpenAI.

## 🛠️ Configuration requise :
1. **Ajoutez votre clé API** dans le fichier \`.env\` :
   \`\`\`
   OPENAI_API_KEY="your-openai-api-key-here"
   \`\`\`

2. **Redémarrez le serveur** pour appliquer les changements

## 💡 Concept de logo pour "${business_name}"

En attendant la configuration, voici un **brief créatif** pour votre logo :

### Style suggéré : ${style_preference || "moderne"}
- **Cuisine :** ${cuisine_style}
- **Couleurs :** ${color_preferences || "palette harmonieuse"}
- **Éléments :** ${additional_elements || "design épuré"}

**Recommandations :**
• Logo vectoriel pour la scalabilité
• Design mémorable et reconnaissable
• Adapté à tous supports (cartes, enseignes, digital)
• Reflet de l'identité "${cuisine_style}"

Une fois OpenAI configuré, je pourrai générer le visuel complet !`;
    }

    try {
      // RESTRICTION DOMAINE CULINAIRE : Validation du type d'entreprise
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
        return `# 🎨 Générateur de Logo - Domaine Non Supporté

## ❌ Restriction au Domaine Culinaire

Ce générateur de logos est spécialisé dans le **secteur culinaire uniquement**.

**Types d'établissements supportés :**
• **Restauration :** restaurants, bistrots, brasseries, pizzerias
• **Artisanat :** boulangeries, pâtisseries, glaciers  
• **Services :** traiteurs, chefs à domicile, cours de cuisine
• **Mobile :** food trucks, livraison de repas
• **Commerce :** épiceries fines, bars à vins, cafés

**Votre demande :** "${business_type}" ne correspond pas à notre domaine d'expertise culinaire.

💡 **Reformulez votre demande** avec un type d'établissement alimentaire pour obtenir un logo adapté !`;
      }

      const designPrompt = `Concept de logo CULINAIRE pour "${business_name}" (${business_type})

IMPORTANT: Concentre-toi EXCLUSIVEMENT sur l'univers culinaire et gastronomique.

Style de cuisine: ${cuisine_style}
Couleurs: ${color_preferences || "harmonieuses"}
Style graphique: ${style_preference || "moderne"}
Éléments: ${additional_elements || "aucun spécial"}

Format:

# 🎨 Logo : ${business_name}

## 💡 Brief Créatif Culinaire
[Concept et vision du logo en 2-3 phrases, axé sur l'identité culinaire]

IMPORTANT: Ne génère AUCUN lien d'image, AUCUN markdown ![](). Juste le texte du brief créatif.
Reste ultra-concis et culinaire.`;

      const designResponse = chatgpt
        ? await chatgpt.invoke(designPrompt)
        : { content: "Brief créatif généré sans IA" };

      // Génération DALL-E avec restriction culinaire
      const optimizedPrompt = `Professional CULINARY logo design for "${business_name}", a ${business_type} specializing in ${cuisine_style} cuisine and gastronomy. ${
        style_preference || "Modern and professional"
      } style with ${
        color_preferences || "harmonious color palette"
      }. Clean, memorable, scalable design suitable for restaurant and food service branding. Culinary themes, food-related elements, cooking utensils or ingredients subtly incorporated. High quality, vector-style illustration for gastronomic business. ${
        additional_elements || ""
      }`;

      const client = getOpenAIClient();
      if (!client) {
        throw new Error("Clé API OpenAI manquante");
      }

      const dalleResponse = await client.images.generate({
        model: "dall-e-3",
        prompt: optimizedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
      });

      const imageUrl = dalleResponse.data?.[0]?.url;

      if (!imageUrl) {
        throw new Error("Aucune image générée");
      }

      const fullResponse = `${designResponse.content}

---
**MÉTADONNÉES_IMAGE:** ${JSON.stringify({
        url: imageUrl,
        alt: `Logo ${business_name}`,
        title: `Logo ${business_name} - ${cuisine_style}`,
        filename: `logo-${business_name
          .toLowerCase()
          .replace(/\s+/g, "-")}.png`,
      })}`;

      return fullResponse;
    } catch (error) {
      return `# ❌ Erreur
Impossible de générer le logo pour "${business_name}".`;
    }
  },
  {
    name: "logo_generator",
    description:
      "Génère un concept créatif de logo pour établissements culinaires uniquement (restaurants, boulangeries, traiteurs, etc.)",
    schema: z.object({
      business_name: z.string().describe("Nom de l'établissement culinaire"),
      business_type: z
        .string()
        .describe(
          "Type d'établissement culinaire (restaurant, boulangerie, traiteur, etc.)"
        ),
      cuisine_style: z
        .string()
        .describe("Style de cuisine ou spécialité gastronomique"),
      color_preferences: z
        .string()
        .optional()
        .describe("Préférences de couleurs"),
      style_preference: z
        .string()
        .optional()
        .describe("Style graphique préféré"),
      additional_elements: z
        .string()
        .optional()
        .describe("Éléments culinaires additionnels à incorporer"),
    }),
  }
);
