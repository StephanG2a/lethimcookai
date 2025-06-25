import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import OpenAI from "openai";

const chatgpt = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.8,
});

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

      const designResponse = await chatgpt.invoke(designPrompt);

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
