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

export const socialMediaTemplates = tool(
  async ({
    platform,
    post_type,
    dish_name,
    restaurant_name,
    caption_style,
    hashtags_theme,
  }) => {
    try {
      const prompt = `Create a ${platform} ${post_type} template for "${dish_name}" from "${restaurant_name}". ${caption_style} style caption with ${hashtags_theme} hashtags theme. Professional food marketing visual template with appetizing presentation, modern typography, and engaging layout optimized for ${platform}.`;

      const client = getOpenAIClient();
      if (!client) {
        throw new Error("Clé API OpenAI manquante");
      }

      const response = await client.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: platform === "instagram-story" ? "1024x1792" : "1024x1024",
        quality: "hd",
        response_format: "url",
      });

      const imageUrl = response.data?.[0]?.url;

      if (!imageUrl) {
        throw new Error("Aucune image générée");
      }

      // Génération du caption
      const captionSuggestions = {
        casual: `🍽️ ${dish_name} qui fait fondre ! Venez découvrir cette merveille chez ${restaurant_name} ✨`,
        professionnel: `Découvrez notre ${dish_name}, préparé avec passion et savoir-faire. ${restaurant_name} vous invite à une expérience culinaire d'exception.`,
        moderne: `${dish_name} goals 🔥 Fresh, délicieux, irrésistible ! @${restaurant_name
          .toLowerCase()
          .replace(/\s+/g, "")}`,
        storytelling: `L'histoire de notre ${dish_name} commence dans nos cuisines... Chaque bouchée raconte une histoire de passion culinaire. 📖✨`,
      };

      const hashtagsSuggestions = {
        food: "#food #foodie #restaurant #delicious #cuisine #chef #homemade",
        local:
          "#local #fresh #artisanal #community #supportlocal #madewithcare",
        gourmet:
          "#gourmet #finedining #culinary #gastronomie #excellence #sophisticated",
        lifestyle: "#foodporn #instafood #yummy #lifestyle #foodlover #taste",
      };

      return `# 📱 Template ${platform.toUpperCase()} : ${dish_name}

## 🎨 Visuel Généré
Template professionnel créé avec succès !

## 📝 Caption Suggérée
${captionSuggestions[caption_style] || captionSuggestions["casual"]}

## #️⃣ Hashtags Recommandés
${hashtagsSuggestions[hashtags_theme] || hashtagsSuggestions["food"]}

## 📊 Optimisations ${platform}
**Format :** ${platform === "instagram-story" ? "9:16 (Story)" : "1:1 (Post)"}  
**Résolution :** ${
        platform === "instagram-story" ? "1024x1792" : "1024x1024"
      }px  
**Style :** Optimisé pour l'engagement

---
**MÉTADONNÉES_IMAGE:** ${JSON.stringify({
        url: imageUrl,
        platform: platform,
        post_type: post_type,
        alt: `Template ${platform} pour ${dish_name}`,
        title: `${dish_name} - Template ${platform}`,
        filename: `${dish_name
          .toLowerCase()
          .replace(/\s+/g, "-")}-${platform}.png`,
        caption:
          captionSuggestions[caption_style] || captionSuggestions["casual"],
        hashtags:
          hashtagsSuggestions[hashtags_theme] || hashtagsSuggestions["food"],
        format: platform === "instagram-story" ? "9:16 Vertical" : "1:1 Carré",
        resolution: platform === "instagram-story" ? "1024x1792" : "1024x1024",
        fileSize: "Estimation: 1-3 MB",
        ready_for_social: true,
        generated_at: new Date().toISOString(),
      })}`;
    } catch (error) {
      return `# ❌ Erreur
Impossible de créer le template pour "${dish_name}".`;
    }
  },
  {
    name: "social_media_templates",
    description:
      "Génère des templates visuels et textuels pour réseaux sociaux",
    schema: z.object({
      platform: z
        .string()
        .describe(
          "Plateforme (instagram-post, instagram-story, facebook, tiktok)"
        ),
      post_type: z
        .string()
        .describe("Type de post (photo produit, behind-scenes, promo, story)"),
      dish_name: z.string().describe("Nom du plat ou produit"),
      restaurant_name: z.string().describe("Nom du restaurant"),
      caption_style: z
        .string()
        .describe(
          "Style de caption (casual, professionnel, moderne, storytelling)"
        ),
      hashtags_theme: z
        .string()
        .describe("Thème hashtags (food, local, gourmet, lifestyle)"),
    }),
  }
);
