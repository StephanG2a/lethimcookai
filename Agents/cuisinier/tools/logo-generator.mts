import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import OpenAI from "openai";

const chatgpt = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.8, // Créatif pour le design
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      // D'abord, créer une description détaillée du logo avec ChatGPT
      const designPrompt = `Tu es un designer graphique spécialisé dans l'identité visuelle culinaire. Crée une description détaillée pour un logo avec :

🏪 **Nom de l'établissement** : ${business_name}
🍽️ **Type d'établissement** : ${business_type}
🌍 **Style de cuisine** : ${cuisine_style}
🎨 **Préférences couleurs** : ${
        color_preferences || "Palette harmonieuse adaptée"
      }
✨ **Style souhaité** : ${style_preference || "Moderne et professionnel"}
➕ **Éléments spéciaux** : ${additional_elements || "Aucun"}

Crée une description TRÈS DÉTAILLÉE pour DALL-E incluant :

**📐 COMPOSITION :**
- Layout et disposition des éléments
- Proportions et équilibre visuel
- Style typographique pour le nom

**🎨 STYLE VISUEL :**
- Palette de couleurs précise
- Style artistique (moderne, vintage, minimaliste, etc.)
- Ambiance et mood du design

**🍳 ÉLÉMENTS CULINAIRES :**
- Symboles ou icônes liés au type de cuisine
- Éléments décoratifs appropriés
- Références culturelles si pertinentes

**🎯 FINALITÉ :**
- Adaptation pour différents supports
- Lisibilité et impact visuel
- Professionnalisme et mémorabilité

IMPORTANT : Réponds ENTIÈREMENT en français. Évite l'anglais sauf termes techniques nécessaires. Termine par une description concise et précise.`;

      const designResponse = await chatgpt.invoke(designPrompt);

      // Créer une description optimisée pour DALL-E en français (traduction automatique)
      const dallePromptFr = `Design de logo professionnel pour "${business_name}", un ${business_type} spécialisé en cuisine ${cuisine_style}. Style ${
        style_preference || "moderne et professionnel"
      } avec ${
        color_preferences || "palette de couleurs harmonieuse"
      }. Design propre, mémorable et adaptable pour l'image de marque d'un restaurant. Illustration haute qualité de style vectoriel. ${
        additional_elements || ""
      }`;

      // Traduire en anglais pour DALL-E (qui fonctionne mieux en anglais)
      const optimizedPrompt = `Professional logo design for "${business_name}", a ${business_type} specializing in ${cuisine_style} cuisine. ${
        style_preference || "Modern and professional"
      } style with ${
        color_preferences || "harmonious color palette"
      }. Clean, memorable, scalable design suitable for restaurant branding. High quality, vector-style illustration. ${
        additional_elements || ""
      }`;

      // Générer l'image avec DALL-E
      console.log("🎨 Génération du logo avec DALL-E...");
      const dalleResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: optimizedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
      });

      const imageUrl = dalleResponse.data?.[0]?.url;

      if (!imageUrl) {
        throw new Error("Aucune image générée par DALL-E");
      }

      // Préparer la réponse avec métadonnées pour l'interface
      const fullResponse = `🎨 **Logo créé avec succès pour "${business_name}"** ✅

**📋 BRIEF CRÉATIF :**
• Établissement : ${business_name} (${business_type})
• Cuisine : ${cuisine_style}  
• Style : ${style_preference || "Moderne et professionnel"}
• Couleurs : ${color_preferences || "Palette harmonieuse"}

**🖼️ VOTRE LOGO :**

**Logo ${business_name}** - Généré par DALL-E 3
[Image ci-dessus : Résolution 1024x1024px]

**💡 CONCEPT CRÉATIF :**
${(typeof designResponse.content === "string"
  ? designResponse.content
  : String(designResponse.content)
)
  .split("DALL-E")[0]
  .trim()
  .replace(/\*\*🎨 STYLE VISUEL\s*:\*\*/g, "**🎨 STYLE VISUEL :**")}

**🎯 RECOMMANDATIONS :**
• Déclinaisons : horizontale/verticale, monochrome, simplifiée
• Formats : PNG HD, SVG vectoriel, favicon web
• Utilisations : carte de visite, enseigne, site web, réseaux sociaux

---
**MÉTADONNÉES_IMAGE:** ${JSON.stringify({
        url: imageUrl,
        alt: `Logo ${business_name}`,
        title: `Logo ${business_name} - ${cuisine_style}`,
        filename: `logo-${business_name
          .toLowerCase()
          .replace(/\s+/g, "-")}.png`,
      })}

Le logo est prêt ! Voulez-vous des variantes ou des ajustements ?`;

      return fullResponse;
    } catch (error) {
      console.error("Erreur génération logo:", error);

      // Message d'erreur détaillé selon le type d'erreur
      if (error.message?.includes("DALL-E")) {
        return `❌ Erreur lors de la génération d'image DALL-E pour "${business_name}". Vérifiez votre clé API OpenAI.`;
      }

      return `❌ Impossible de créer le logo pour "${business_name}". 
      
**Problème possible :**
- Clé API OpenAI manquante ou invalide
- Connexion internet requise
- Description trop complexe pour DALL-E

**Solution :** Vérifiez votre configuration et réessayez.`;
    }
  },
  {
    name: "logoGenerator",
    description:
      "Génération de concepts de logos professionnels pour établissements culinaires avec descriptions optimisées pour DALL-E",
    schema: z.object({
      business_name: z.string().describe("Nom de l'établissement ou du chef"),
      business_type: z
        .string()
        .describe(
          "Type d'établissement (restaurant, bistrot, food truck, chef privé, etc.)"
        ),
      cuisine_style: z
        .string()
        .describe(
          "Style de cuisine (française, italienne, fusion, végétarienne, etc.)"
        ),
      color_preferences: z
        .string()
        .optional()
        .describe("Préférences de couleurs ou palette souhaitée"),
      style_preference: z
        .string()
        .optional()
        .describe(
          "Style visuel souhaité (moderne, vintage, minimaliste, rustique, etc.)"
        ),
      additional_elements: z
        .string()
        .optional()
        .describe(
          "Éléments spéciaux à inclure (symboles, références culturelles, etc.)"
        ),
    }),
  }
);
