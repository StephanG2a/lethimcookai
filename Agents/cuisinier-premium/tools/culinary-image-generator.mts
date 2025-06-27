import { tool } from "@langchain/core/tools";
import { z } from "zod";
import OpenAI from "openai";

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

export const culinaryImageGenerator = tool(
  async ({
    dish_name,
    style,
    presentation,
    lighting,
    background,
    additional_elements,
  }) => {
    try {
      const prompt = `Professional food photography of ${dish_name}. ${style} style with ${presentation} presentation. ${lighting} lighting on ${background} background. ${
        additional_elements ||
        "High quality, appetizing, restaurant-style plating"
      }. Ultra-realistic, mouth-watering, professional culinary photography.`;

      const client = getOpenAIClient();
      if (!client) {
        throw new Error("Clé API OpenAI manquante");
      }

      const response = await client.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        response_format: "url",
      });

      const imageUrl = response.data?.[0]?.url;

      if (!imageUrl) {
        throw new Error("Aucune image générée");
      }

      return `# 📸 Image Culinaire : ${dish_name}

## 🎨 Image Générée
Photo professionnelle créée avec succès !

## 📋 Style Appliqué
**Type :** ${style}  
**Composition :** ${presentation}  
**Ambiance :** ${lighting}  
**Éclairage :** Professionnel adapté au style

## 📊 Spécifications
**Format :** Carré 1024x1024px  
**Qualité :** Haute définition  
**Usage :** Marketing, réseaux sociaux, menu

---
**MÉTADONNÉES_IMAGE:** ${JSON.stringify({
        url: imageUrl,
        dish: dish_name,
        style: style,
        composition: presentation,
        mood: lighting,
        alt: `Photo ${style} de ${dish_name}`,
        title: `${dish_name} - Photo ${style}`,
        filename: `photo-${dish_name.toLowerCase().replace(/\s+/g, "-")}.png`,
        format: "PNG HD",
        resolution: "1024x1024",
        fileSize: "Estimation: 2-5 MB",
        usage: ["marketing", "social_media", "menu"],
        ready_for_use: true,
        generated_at: new Date().toISOString(),
      })}`;
    } catch (error) {
      return `# ❌ Erreur
Impossible de générer l'image pour "${dish_name}".`;
    }
  },
  {
    name: "culinary_image_generator",
    description:
      "Génère des images professionnelles EXCLUSIVEMENT de plats et présentations culinaires pour restaurateurs",
    schema: z.object({
      dish_name: z
        .string()
        .describe("Nom du plat culinaire ou de la préparation gastronomique"),
      style: z
        .string()
        .describe(
          "Style photographique culinaire (moderne, rustique, élégant, gastronomique, etc.)"
        ),
      presentation: z
        .string()
        .describe(
          "Type de présentation culinaire (assiette, bol, planche, ardoise, etc.)"
        ),
      lighting: z
        .string()
        .describe(
          "Type d'éclairage pour food photography (naturel, studio, dramatique, etc.)"
        ),
      background: z
        .string()
        .describe(
          "Arrière-plan culinaire (bois, marbre, ardoise, nappe, etc.)"
        ),
      additional_elements: z
        .string()
        .optional()
        .describe(
          "Éléments culinaires additionnels (couverts, condiments, garnitures, etc.)"
        ),
    }),
  }
);
