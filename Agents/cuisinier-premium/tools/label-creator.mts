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

export const labelCreator = tool(
  async ({ label_type, product_name, brand_name, key_info, style, shape }) => {
    try {
      const prompt = `Professional ${label_type} label design for "${product_name}" from "${brand_name}". ${style} style with ${shape} shape. Include ${key_info}. Clean, readable typography, appetizing food-grade design with necessary regulatory information layout. High quality printable label design.`;

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

      // Suggestions d'informations légales selon le type
      const legalRequirements = {
        conserve: "Ingrédients, poids net, DLC, lot, conditions conservation",
        épice: "Origine, poids net, DLC, allergènes potentiels",
        "produit artisanal": "Ingrédients, poids, fabricant, DLC",
        sauce: "Ingrédients, poids net, DLC, conservation après ouverture",
        confiture: "Ingrédients, poids net, DLC, taux de fruits",
      };

      return `# 🏷️ Étiquette : ${product_name}

## 🎨 Design Généré
Étiquette professionnelle créée avec succès !

## 📋 Informations Légales Requises
${
  legalRequirements[label_type] ||
  "Vérifier réglementation alimentaire applicable"
}

## 🖨️ Spécifications d'Impression
**Format :** Haute résolution (1024x1024px)  
**Style :** ${style}  
**Forme :** ${shape}  
**Usage :** ${label_type}

## ✅ Recommandations
• Vérifier conformité réglementation alimentaire
• Test d'impression couleur
• Matériau adapté au produit

---
**MÉTADONNÉES_IMAGE:** ${JSON.stringify({
        url: imageUrl,
        type: label_type,
        product: product_name,
        brand: brand_name,
        alt: `Étiquette ${label_type} pour ${product_name}`,
        title: `${product_name} - Étiquette ${label_type}`,
        filename: `etiquette-${product_name
          .toLowerCase()
          .replace(/\s+/g, "-")}.png`,
        style: style,
        shape: shape,
        legal_info: legalRequirements[label_type] || "À compléter",
        format: "PNG HD",
        resolution: "1024x1024",
        fileSize: "Estimation: 2-4 MB",
        print_ready: true,
        generated_at: new Date().toISOString(),
      })}`;
    } catch (error) {
      return `# ❌ Erreur
Impossible de créer l'étiquette pour "${product_name}".`;
    }
  },
  {
    name: "label_creator",
    description:
      "Crée des étiquettes professionnelles EXCLUSIVEMENT pour produits alimentaires et culinaires",
    schema: z.object({
      label_type: z
        .string()
        .describe(
          "Type d'étiquette alimentaire (conserve, épice, produit artisanal, sauce, confiture, pain, pâtisserie)"
        ),
      product_name: z.string().describe("Nom du produit alimentaire"),
      brand_name: z
        .string()
        .describe("Nom de la marque culinaire ou producteur alimentaire"),
      key_info: z
        .string()
        .describe(
          "Informations culinaires clés à mettre en avant (origine, bio, fait maison, etc.)"
        ),
      style: z
        .string()
        .describe(
          "Style d'étiquette culinaire (moderne, vintage, artisanal, premium gastronomique)"
        ),
      shape: z
        .string()
        .describe(
          "Forme d'étiquette alimentaire (rectangulaire, ronde, ovale, personnalisée)"
        ),
    }),
  }
);
