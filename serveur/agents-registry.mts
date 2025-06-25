import type { CompiledStateGraph } from "@langchain/langgraph";
import "dotenv/config";

import { cuisinierAgent } from "../Agents/cuisinier/cuisinier-agent.mts";
import { cuisinierPremiumAgent } from "../Agents/cuisinier-premium/cuisinier-premium-agent.mts";
import { cuisinierBusinessAgent } from "../Agents/cuisinier-business/cuisinier-business-agent.mts";

export interface AgentInfo {
  id: string;
  name: string;
  description: string;
  agent: CompiledStateGraph<any, any>;
}

// Registre des agents disponibles
export const AGENTS_REGISTRY = {
  cuisinier: {
    id: "cuisinier",
    name: "Chef Cuisinier IA Basic",
    description:
      "Agent culinaire essentiel : recettes, nutrition, techniques (7 outils)",
    agent: cuisinierAgent,
  },
  "cuisinier-premium": {
    id: "cuisinier-premium",
    name: "Chef Cuisinier IA Premium",
    description:
      "Agent culinaire + création visuelle : logos, images, PDFs, templates (13 outils)",
    agent: cuisinierPremiumAgent,
  },
  "cuisinier-business": {
    id: "cuisinier-business",
    name: "Chef Cuisinier IA Business",
    description:
      "Agent culinaire complet + services pro : recherche orgas, business plans, analyses (18 outils)",
    agent: cuisinierBusinessAgent,
  },
};

// Fonction pour récupérer un agent par son ID
export function getAgent(agentId: string): CompiledStateGraph<any, any> {
  const agentInfo = AGENTS_REGISTRY[agentId];
  if (!agentInfo) {
    throw new Error(
      `Agent '${agentId}' non trouvé. Agents disponibles: ${Object.keys(
        AGENTS_REGISTRY
      ).join(", ")}`
    );
  }
  return agentInfo.agent;
}

// Fonction pour récupérer la liste de tous les agents
export function getAllAgents(): AgentInfo[] {
  return Object.values(AGENTS_REGISTRY);
}

// Fonction pour récupérer les métadonnées des agents (sans l'instance)
export function getAgentsMetadata() {
  return Object.values(AGENTS_REGISTRY).map(({ id, name, description }) => ({
    id,
    name,
    description,
  }));
}
