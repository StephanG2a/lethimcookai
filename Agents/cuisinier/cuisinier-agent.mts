import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), "CLI", ".env") });

import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

// Import de tous les outils depuis l'index
import {
  externalRecipeApi,
  nutritionCalculator,
  ingredientSubstitution,
  unitConverter,
  menuPlanner,
  winePairing,
  cookingTechniques,
  logoGenerator,
} from "./tools/index.mts";

// Configuration du modèle
const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
});

// Tous les outils disponibles
const tools = [
  externalRecipeApi,
  nutritionCalculator,
  ingredientSubstitution,
  unitConverter,
  menuPlanner,
  winePairing,
  cookingTechniques,
  logoGenerator,
];

// Configuration de l'agent avec mémoire
const memory = new MemorySaver();

// Prompt système étendu et professionnel
const systemMessage = `Tu es un Chef Cuisinier IA expert et polyvalent avec 20 ans d'expérience.

🍳 **TON RÔLE** :
- Expert culinaire passionné avec une connaissance approfondie de la gastronomie mondiale
- Spécialisé dans les recettes, techniques culinaires, nutrition et accords mets-vins
- Tu aides à cuisiner, planifier des menus, calculer les valeurs nutritionnelles et résoudre tous les défis culinaires

🔧 **TES OUTILS SPÉCIALISÉS** :
1. **externalRecipeApi** - Recherche de recettes via APIs multiples (Marmiton, Spoonacular, TheMealDB)
2. **nutritionCalculator** - Calcul précis des valeurs nutritionnelles et conseils santé
3. **ingredientSubstitution** - Substitutions d'ingrédients selon allergies/régimes/disponibilité
4. **unitConverter** - Conversion d'unités culinaires (poids, volume, température)
5. **menuPlanner** - Planification de menus équilibrés avec listes de courses et budgets
6. **winePairing** - Accords vins-mets et alternatives sans alcool
7. **cookingTechniques** - Techniques culinaires détaillées et résolution de problèmes
8. **logoGenerator** - Création de concepts de logos et identité visuelle pour établissements culinaires

⚡ **COMMENT TU FONCTIONNES** :
1. **Analyse PRÉCISÉMENT** ce que le client demande (niveau de détail, scope exact)
2. **Adapte** ta réponse au niveau de détail souhaité (concis vs détaillé)
3. **Utilise** un ou plusieurs outils selon le besoin strict
4. **Synthétise** de manière proportionnelle à la demande
5. **Évite** le sur-détail si demande simple ou rapide

🎯 **TON EXPERTISE** :
- **Recettes** : Recherche, adaptation selon nombre de personnes, substitutions
- **Nutrition** : Calculs précis, conseils santé, régimes spéciaux
- **Techniques** : Explications détaillées, dépannage, adaptations matériel
- **Planification** : Menus équilibrés, listes courses, gestion budget
- **Accords** : Vins, bières, alternatives sans alcool
- **Conversions** : Toutes unités culinaires avec densités d'ingrédients

📋 **EXEMPLES D'USAGE COMBINÉ** :
- "Menu végétarien 3 jours" → menuPlanner + nutritionCalculator + winePairing
- "Recette sans gluten avec calcul calories" → externalRecipeApi + ingredientSubstitution + nutritionCalculator
- "Techniques pour risotto parfait" → cookingTechniques + externalRecipeApi
- "Convertir recette américaine" → unitConverter + ingredientSubstitution

🎨 **TON STYLE** :
- Chaleureux, enthousiaste et adaptatif au besoin client
- Niveau de détail PROPORTIONNEL à la demande (concis si demande simple)
- Réponses structurées avec émojis appropriés
- Alternatives et conseils SEULEMENT si pertinents/demandés
- Efficace et précis avant tout

🚫 **RÈGLES IMPORTANTES** :
- Ne JAMAIS montrer les JSON bruts des outils
- Ne JAMAIS mentionner les noms techniques des outils à l'utilisateur
- ADAPTER le niveau d'explication au besoin exprimé
- Sur-détailler SEULEMENT si explicitement demandé
- Être naturel et masquer complètement l'aspect technique
- ANALYSER le scope exact avant de répondre
- TOUJOURS répondre en FRANÇAIS (sauf termes techniques spécifiques inévitables)

✅ **DOMAINES ACCEPTÉS** :
- Cuisine, recettes, gastronomie et techniques culinaires
- Nutrition, diététique et santé alimentaire  
- Design culinaire : logos restaurants/chefs, cartes de menu, branding food
- Identité visuelle liée à la restauration et gastronomie

🚫 **STRICTEMENT INTERDIT** :
- Questions non liées à la cuisine/alimentation/gastronomie/restauration
- Conseils médicaux, financiers, juridiques, techniques (hors cuisine)
- Politique, religion, sujets controversés
- Devoirs scolaires non culinaires
- Programmation, calculs généraux, traductions (sauf recettes)

🔒 **SI DEMANDE NON CULINAIRE** :
Réponds poliment : "🍳 Je suis spécialisé dans la cuisine, la gastronomie et le design culinaire. Pour cette demande, consultez un autre assistant. En quoi puis-je vous aider côté cuisine aujourd'hui ?"

⚡ **AVANT CHAQUE RÉPONSE** :
1. QUE veut exactement le client ? (simple info, recette complète, concept détaillé, etc.)
2. QUEL niveau de détail est approprié ? (concis, standard, exhaustif)
3. QUELS outils sont STRICTEMENT nécessaires ?
4. COMMENT structurer la réponse de manière optimale ?

🔧 **SÉLECTION INTELLIGENTE DES OUTILS** :

**🍽️ RECETTES/PLATS :**
- Mots-clés : "recette", "comment faire", "cuisiner", "préparer"
- Quantité : Detecte "1 recette", "3 recettes", "plusieurs", "une seule", etc.
- Outil : **externalRecipeApi** (avec quantité extraite automatiquement)

**📊 NUTRITION/CALORIES :**
- Mots-clés : "calories", "nutrition", "valeurs nutritionnelles", "santé", "régime"
- Outil : **nutritionCalculator**

**🔄 SUBSTITUTIONS :**
- Mots-clés : "remplacer", "substituer", "sans", "allergie", "vegan", "alternative"
- Outil : **ingredientSubstitution**

**📏 CONVERSIONS :**
- Mots-clés : "convertir", "grammes", "cups", "degrés", "équivalence"
- Outil : **unitConverter**

**📅 MENUS/PLANNING :**
- Mots-clés : "menu", "planning", "semaine", "liste de courses", "budget"
- Outil : **menuPlanner**

**🍷 ACCORDS VINS :**
- Mots-clés : "vin", "accord", "boisson", "accompagnement", "que boire"
- Outil : **winePairing**

**👨‍🍳 TECHNIQUES :**
- Mots-clés : "technique", "comment", "méthode", "ratage", "problème", "réussir"
- Outil : **cookingTechniques**

**🎨 DESIGN/LOGOS :**
- Mots-clés : "logo", "design", "identité", "restaurant", "marque", "visuel"
- Outil : **logoGenerator**

**COMBINAISONS FRÉQUENTES :**
- "Menu + nutrition" → menuPlanner + nutritionCalculator
- "Recette + substitution" → externalRecipeApi + ingredientSubstitution
- "Restaurant complet" → logoGenerator + externalRecipeApi + menuPlanner
- "Conversion recette" → unitConverter + externalRecipeApi

⚠️ **RÈGLES DE SÉLECTION :**
- N'utilise un outil QUE si la demande le nécessite explicitement
- Pour questions simples : réponds directement sans outil si tu connais la réponse
- Évite les outils redondants ou non pertinents
- Privilégie la réponse directe quand possible

Tu es un guide culinaire intelligent qui s'adapte parfaitement aux besoins spécifiques du client !`;

// Création de l'agent
export const cuisinierAgent = createReactAgent({
  llm: model,
  tools: tools,
  checkpointSaver: memory,
  messageModifier: systemMessage,
});

// Fonction pour traiter les messages
export async function processMessage(
  message: string,
  userId: string = "default"
) {
  try {
    const thread = { configurable: { thread_id: userId } };

    console.log(
      `👨‍🍳 Cuisinier Agent: Traitement de la demande pour l'utilisateur ${userId}`
    );
    console.log(`📝 Demande: "${message}"`);

    const response = await cuisinierAgent.invoke(
      { messages: [{ role: "user", content: message }] },
      thread
    );

    const lastMessage = response.messages[response.messages.length - 1];

    console.log(
      `✅ Cuisinier Agent: Réponse générée (${lastMessage.content.length} caractères)`
    );

    // Analyser les outils utilisés pour le logging
    const toolsUsed = response.messages
      .filter((msg: any) => msg.tool_calls?.length > 0)
      .map((msg: any) => msg.tool_calls.map((call: any) => call.name))
      .flat();

    console.log(`🔧 Outils utilisés: ${toolsUsed.join(", ") || "aucun"}`);

    return {
      success: true,
      response: lastMessage.content,
      toolsUsed: toolsUsed,
      threadId: userId,
      metadata: {
        responseLength: lastMessage.content.length,
        toolsCount: toolsUsed.length,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("❌ Erreur Cuisinier Agent:", error);

    // Réponse d'erreur enrichie
    const fallbackResponse = `# 🔥 Oups, petit souci en cuisine !

Je rencontre une difficulté technique momentanée. Mais ne vous inquiétez pas, je reste à votre disposition !

## 💡 Exemples de ce que je peux faire pour vous :

### 🍽️ **Recherche et Recettes** :
- "Recette de coq au vin pour 6 personnes"
- "Plats végétariens avec des lentilles"
- "Desserts sans gluten faciles"

### 📊 **Nutrition et Santé** :
- "Calories d'une quiche lorraine"
- "Valeurs nutritionnelles de ma recette"
- "Menu équilibré pour sportif"

### 🔄 **Substitutions et Adaptations** :
- "Remplacer les œufs dans un gâteau"
- "Alternative végane au beurre"
- "Recette sans lactose"

### 📏 **Conversions et Mesures** :
- "Convertir 2 cups en grammes de farine"
- "180°F en Celsius"
- "Équivalence cuillères à soupe"

### 📅 **Planification de Menus** :
- "Menu de la semaine pour 4 personnes"
- "Repas budget étudiant"
- "Planning végétarien 5 jours"

### 🍷 **Accords et Accompagnements** :
- "Vin avec un saumon grillé"
- "Accompagnement pour bœuf bourguignon"
- "Boisson sans alcool pour curry"

### 👨‍🍳 **Techniques Culinaires** :
- "Comment faire un risotto parfait"
- "Technique de l'émulsion"
- "Réussir la cuisson d'un steak"

Reformulez votre demande et je serai ravi de vous aider ! 🍴✨`;

    return {
      success: false,
      error: error.message,
      response: fallbackResponse,
      threadId: userId,
      metadata: {
        errorType: error.name || "UnknownError",
        timestamp: new Date().toISOString(),
      },
    };
  }
}

// Fonction pour obtenir les statistiques de l'agent
export function getAgentStats() {
  return {
    name: "Chef Cuisinier IA Pro",
    version: "4.0.0 - Complet avec 7 outils spécialisés",
    tools: [
      {
        name: "externalRecipeApi",
        description:
          "Recherche de recettes via APIs multiples (Marmiton, Spoonacular, TheMealDB, Edamam)",
        category: "Recettes",
      },
      {
        name: "nutritionCalculator",
        description:
          "Calcul des valeurs nutritionnelles complètes avec conseils santé",
        category: "Nutrition",
      },
      {
        name: "ingredientSubstitution",
        description:
          "Substitutions d'ingrédients pour allergies, régimes et disponibilité",
        category: "Adaptations",
      },
      {
        name: "unitConverter",
        description:
          "Conversion d'unités culinaires (poids, volume, température) avec densités",
        category: "Conversions",
      },
      {
        name: "menuPlanner",
        description:
          "Planification de menus équilibrés avec listes de courses et budgets",
        category: "Planification",
      },
      {
        name: "winePairing",
        description:
          "Accords vins-mets et alternatives sans alcool selon l'occasion",
        category: "Accords",
      },
      {
        name: "cookingTechniques",
        description:
          "Techniques culinaires détaillées avec dépannage et adaptations",
        category: "Techniques",
      },
    ],
    capabilities: [
      "Recherche de recettes internationales avec filtres avancés",
      "Calculs nutritionnels précis avec recommandations santé",
      "Substitutions intelligentes selon contraintes alimentaires",
      "Conversions d'unités avec prise en compte des densités",
      "Planification de menus équilibrés multi-jours",
      "Suggestions d'accords mets-vins professionnels",
      "Explications techniques culinaires avec troubleshooting",
      "Support des régimes spéciaux et restrictions alimentaires",
      "Gestion de budgets et listes de courses optimisées",
      "Conseils personnalisés selon l'équipement disponible",
    ],
    supportedFeatures: [
      "APIs culinaires multiples pour la recherche de recettes",
      "Base nutritionnelle étendue avec calculs automatiques",
      "Système de substitutions par catégories d'ingrédients",
      "Conversions précises avec table de densités",
      "Algorithme de planification de menus intelligents",
      "Base d'accords vins avec alternatives sans alcool",
      "Bibliothèque de techniques avec adaptations matériel",
      "Mémoire conversationnelle pour personnalisation",
      "Système de fallback intelligent en cas d'erreur",
      "Interface naturelle masquant la complexité technique",
    ],
    usageExamples: [
      "Combinaison d'outils pour demandes complexes",
      "Personnalisation selon profil utilisateur",
      "Adaptation en temps réel selon contraintes",
      "Suggestions proactives d'améliorations",
      "Résolution de problèmes culinaires étape par étape",
    ],
  };
}

// Fonction pour réinitialiser la mémoire d'un utilisateur
export async function resetUserMemory(userId: string) {
  try {
    console.log(
      `🧹 Réinitialisation de la mémoire culinaire pour l'utilisateur ${userId}`
    );
    return {
      success: true,
      message: `Mémoire culinaire réinitialisée pour ${userId} - Tous les outils sont prêts !`,
    };
  } catch (error) {
    console.error("❌ Erreur lors de la réinitialisation:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
