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
      const prompt = `Tu es un chef instructeur expert. ${
        problem
          ? `L'utilisateur a un problème : ${problem}`
          : `L'utilisateur veut apprendre :`
      }

🍳 **Technique** : ${technique}
📊 **Niveau** : ${difficulty_level || "Non spécifié"}
🔧 **Équipement disponible** : ${equipment || "Équipement de base"}

Fournis une explication complète avec :

**📚 EXPLICATION DE LA TECHNIQUE :**
- Principe et objectif de la technique
- Contexte d'utilisation
- Niveau de difficulté réel

**👨‍🍳 INSTRUCTIONS ÉTAPE PAR ÉTAPE :**
- Préparation préalable nécessaire
- Étapes détaillées et chronométrées
- Points de contrôle critiques

**🎯 SIGNES DE RÉUSSITE :**
- Comment reconnaître que c'est réussi
- Indices visuels, olfactifs, tactiles
- Temps approximatifs

**⚠️ ERREURS COURANTES :**
- Pièges à éviter absolument
- Erreurs de débutant typiques
- Comment rattraper si ça rate

**🔧 MATÉRIEL ET ALTERNATIVES :**
- Équipement idéal vs équipement minimum
- Astuces avec matériel basique
- Adaptations selon les moyens

**🧪 VARIANTES ET ADAPTATIONS :**
- Versions simplifiées
- Techniques avancées pour progresser
- Applications dans différentes recettes

**🆘 DÉPANNAGE :**
- Solutions aux problèmes fréquents
- Comment rectifier le tir
- Quand recommencer

Sois très pédagogue et encourage l'expérimentation progressive.`;

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
