export type SubscriptionPlan = "FREE" | "PREMIUM" | "BUSINESS";
export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED" | "TRIAL";

export type AgentType = "basic" | "premium" | "business";

interface User {
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  subscriptionEnd?: string | null;
}

/**
 * Vérifie si l'utilisateur a accès à un type d'agent IA
 */
export function hasAccessToAgent(
  user: User | null,
  agentType: AgentType
): boolean {
  console.log("🔍 hasAccessToAgent called:", { user, agentType });

  // Si pas connecté, pas d'accès
  if (!user) {
    console.log("❌ No user, access denied");
    return false;
  }

  console.log("👤 User subscription:", {
    plan: user.subscriptionPlan,
    status: user.subscriptionStatus,
    end: user.subscriptionEnd,
  });

  // Si l'abonnement est expiré ou annulé, seul l'agent basic est accessible
  if (
    user.subscriptionStatus === "EXPIRED" ||
    user.subscriptionStatus === "CANCELLED"
  ) {
    console.log("⚠️ Subscription expired/cancelled, only basic access");
    return agentType === "basic";
  }

  // Vérifier la date d'expiration si elle existe
  if (user.subscriptionEnd) {
    const expirationDate = new Date(user.subscriptionEnd);
    const now = new Date();
    if (now > expirationDate) {
      console.log("⏰ Subscription expired by date, only basic access");
      return agentType === "basic";
    }
  }

  // Vérifier les permissions selon le plan d'abonnement
  let hasAccess = false;
  switch (user.subscriptionPlan) {
    case "FREE":
      hasAccess = agentType === "basic";
      break;

    case "PREMIUM":
      hasAccess = agentType === "basic" || agentType === "premium";
      break;

    case "BUSINESS":
      hasAccess = true; // Accès à tous les agents
      break;

    default:
      hasAccess = agentType === "basic";
      break;
  }

  console.log(`✅ Access result for ${agentType}:`, hasAccess);
  return hasAccess;
}

/**
 * Retourne la liste des agents accessibles pour un utilisateur
 */
export function getAccessibleAgents(user: User | null): AgentType[] {
  const agents: AgentType[] = [];

  if (hasAccessToAgent(user, "basic")) {
    agents.push("basic");
  }

  if (hasAccessToAgent(user, "premium")) {
    agents.push("premium");
  }

  if (hasAccessToAgent(user, "business")) {
    agents.push("business");
  }

  return agents;
}

/**
 * Retourne le message d'upgrade approprié pour un agent
 */
export function getUpgradeMessage(agentType: AgentType): string {
  switch (agentType) {
    case "premium":
      return "Passez à Premium pour débloquer l'IA Cuisinier Premium";
    case "business":
      return "Passez à Business pour débloquer l'IA Cuisinier Business";
    default:
      return "";
  }
}

/**
 * Vérifie si l'abonnement est encore valide
 */
export function isSubscriptionActive(user: User | null): boolean {
  if (!user) return false;

  if (
    user.subscriptionStatus === "EXPIRED" ||
    user.subscriptionStatus === "CANCELLED"
  ) {
    return false;
  }

  if (user.subscriptionEnd) {
    const expirationDate = new Date(user.subscriptionEnd);
    const now = new Date();
    return now <= expirationDate;
  }

  return (
    user.subscriptionStatus === "ACTIVE" || user.subscriptionStatus === "TRIAL"
  );
}

/**
 * Configuration des agents avec leurs métadonnées
 */
export const AGENTS_CONFIG = {
  basic: {
    id: "cuisinier",
    name: "Cuisinier Basic",
    description: "Assistant culinaire de base pour conseils et recettes",
    requiredPlan: "FREE" as SubscriptionPlan,
    icon: "👨‍🍳",
    color: "bg-blue-500",
  },
  premium: {
    id: "cuisinier-premium",
    name: "Cuisinier Premium",
    description: "Assistant avancé avec génération d'images et contenu premium",
    requiredPlan: "PREMIUM" as SubscriptionPlan,
    icon: "👨‍🍳",
    color: "bg-purple-500",
    badge: "Premium",
  },
  business: {
    id: "cuisinier-business",
    name: "Cuisinier Business",
    description:
      "Assistant professionnel avec analyse marché et outils business",
    requiredPlan: "BUSINESS" as SubscriptionPlan,
    icon: "👨‍🍳",
    color: "bg-orange-500",
    badge: "Business",
  },
} as const;
