import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

const chatgpt = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.5,
});

export const cookingTechniques = tool(
  async ({ technique, difficulty_level, equipment, problem }) => {
    try {
      const prompt = `${
        problem
          ? `Problème avec ${technique}: ${problem}`
          : `Technique: ${technique}`
      }
Niveau: ${difficulty_level || "Standard"}
Équipement: ${equipment || "Équipement de base"}

Format de présentation OBLIGATOIRE:

# 👨‍🍳 Technique : ${technique}

## 📚 Principe de Base
[Explication simple du principe]

## 📋 Étapes Clés
1. **[Étape 1]** : [Description]
2. **[Étape 2]** : [Description]  
3. **[Étape 3]** : [Description]
4. **[Étape 4]** : [Description]

## ✅ Signes de Réussite
• **Visuel :** [Ce qu'on doit voir]
• **Olfactif :** [Ce qu'on doit sentir]  
• **Tactile :** [Ce qu'on doit ressentir]

## ⚠️ Erreurs à Éviter
• [Piège 1]
• [Piège 2]  
• [Piège 3]

## 🎯 Variantes de Niveau

### 🌱 **Débutant**
[Version simplifiée]

### ⚖️ **Standard**  
[Version classique]

### 🏆 **Avancé**
[Version perfectionnée]

IMPORTANT: Utilise EXACTEMENT cette structure avec émojis et sauts de ligne.`;

      const response = await chatgpt.invoke(prompt);

      return response.content;
    } catch (error) {
      console.error("Erreur techniques culinaires:", error);
      return `❌ Impossible d'expliquer la technique "${technique}". Précisez votre demande.`;
    }
  },
  {
    name: "cookingTechniques",
    description:
      "Explications détaillées de techniques culinaires avec dépannage et conseils d'amélioration",
    schema: z.object({
      technique: z
        .string()
        .describe(
          "Technique culinaire à expliquer (émulsion, caramélisation, confisage, etc.)"
        ),
      difficulty_level: z
        .string()
        .optional()
        .describe("Niveau souhaité (débutant, intermédiaire, avancé)"),
      equipment: z.string().optional().describe("Équipement disponible"),
      problem: z
        .string()
        .optional()
        .describe("Problème spécifique rencontré avec cette technique"),
    }),
  }
);
