// Export de tous les outils culinaires
export { recipeSearch } from "./recipe-search.mts";
export { nutritionAnalyzer } from "./nutrition-analyzer.mts";
export { menuPlanner } from "./menu-planner.mts";
export { ingredientSubstitution } from "./ingredient-substitution.mts";
export { unitConverter } from "./unit-converter.mts";
export { winePairing } from "./wine-pairing.mts";
export { cookingTechniques } from "./cooking-techniques.mts";
export { logoGenerator } from "./logo-generator.mts";

// Pour compatibilité avec l'agent existant
export { recipeSearch as externalRecipeApi } from "./recipe-search.mts";
export { nutritionAnalyzer as nutritionCalculator } from "./nutrition-analyzer.mts";
