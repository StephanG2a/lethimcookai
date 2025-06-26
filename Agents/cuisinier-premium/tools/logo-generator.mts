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
      const designPrompt = `Concept de logo pour "${business_name}" (${business_type})
Style: ${cuisine_style}
Couleurs: ${color_preferences || "harmonieuses"}
Style: ${style_preference || "moderne"}
Éléments: ${additional_elements || "aucun spécial"}

Format:

# 🎨 Logo : ${business_name}

## 💡 Brief Créatif
[Concept et vision du logo en 2-3 phrases]

IMPORTANT: Ne génère AUCUN lien d'image, AUCUN markdown ![](). Juste le texte du brief créatif.
Reste ultra-concis.`;

      const designResponse = chatgpt
        ? await chatgpt.invoke(designPrompt)
        : { content: "Brief créatif généré sans IA" };

      // Génération DALL-E
      const optimizedPrompt = `Professional logo design for "${business_name}", a ${business_type} specializing in ${cuisine_style} cuisine. ${
        style_preference || "Modern and professional"
      } style with ${
        color_preferences || "harmonious color palette"
      }. Clean, memorable, scalable design suitable for restaurant branding. High quality, vector-style illustration. ${
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
    description: "Génère un concept créatif de logo pour un restaurant",
    schema: z.object({
      business_name: z.string().describe("Nom du restaurant"),
      business_type: z.string().describe("Type d'établissement"),
      cuisine_style: z.string().describe("Style de cuisine"),
      color_preferences: z
        .string()
        .optional()
        .describe("Préférences de couleurs"),
      style_preference: z.string().optional().describe("Style préféré"),
      additional_elements: z
        .string()
        .optional()
        .describe("Éléments additionnels"),
    }),
  }
);
