"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/useAuth";
import { AGENTS_CONFIG } from "@/lib/subscription";
import { MainLayout } from "@/components/layout/main-layout";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  popular?: boolean;
  agents: string[];
}

const PLANS: Plan[] = [
  {
    id: "FREE",
    name: "Gratuit",
    description: "Parfait pour débuter",
    price: 0,
    features: [
      "Accès au Cuisinier Basic",
      "Conseils culinaires de base",
      "Recherche de recettes",
      "Substitution d'ingrédients",
      "Support communautaire",
    ],
    agents: ["basic"],
  },
  {
    id: "PREMIUM",
    name: "Premium",
    description: "Pour les passionnés de cuisine",
    price: 19,
    popular: true,
    features: [
      "Tout du plan Gratuit",
      "Accès au Cuisinier Premium",
      "Génération d'images culinaires",
      "Création d'étiquettes personnalisées",
      "Génération de logos",
      "Templates réseaux sociaux",
      "Support prioritaire",
    ],
    agents: ["basic", "premium"],
  },
  {
    id: "BUSINESS",
    name: "Business",
    description: "Pour les professionnels",
    price: 49,
    features: [
      "Tout des plans précédents",
      "Accès au Cuisinier Business",
      "Analyse de marché",
      "Génération de business plans",
      "Calculs de coûts avancés",
      "Recherche de prestataires",
      "Support dédié 24/7",
    ],
    agents: ["basic", "premium", "business"],
  },
];

export default function SubscriptionsPage() {
  const { user, loading, token } = useAuth();
  const router = useRouter();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/subscriptions");
    }
  }, [user, loading]);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      router.push("/auth/login?redirect=/subscriptions");
      return;
    }

    if (planId === "FREE") {
      // Plan gratuit - pas de paiement nécessaire
      return;
    }

    setProcessingPlan(planId);

    try {
      // Récupérer le token depuis le hook useAuth ou localStorage
      const authToken = token || localStorage.getItem("token");

      if (!authToken) {
        router.push("/auth/login?redirect=/subscriptions");
        return;
      }

      const response = await fetch("/api/subscriptions/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Rediriger vers Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Erreur lors de la création du checkout");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setProcessingPlan(null);
    }
  };

  const isCurrentPlan = (planId: string) => {
    if (!user) return false;
    return user.subscriptionPlan === planId;
  };

  const getButtonText = (planId: string) => {
    if (processingPlan === planId) {
      return "Traitement...";
    }

    if (isCurrentPlan(planId)) {
      return "Plan actuel";
    }

    if (planId === "FREE") {
      return "Gratuit";
    }

    return "Choisir ce plan";
  };

  const getButtonVariant = (planId: string) => {
    if (isCurrentPlan(planId)) {
      return "outline" as const;
    }
    return "default" as const;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-lg">Chargement...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choisissez votre formule</h1>
          <p className="text-xl text-gray-600 mb-2">
            Accédez aux meilleurs assistants IA culinaires
          </p>
          <p className="text-sm text-gray-500">
            Plan actuel :{" "}
            <span className="font-semibold">{user.subscriptionPlan}</span>
          </p>
          <Button
            onClick={() => router.push("/subscriptions/manage")}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Gérer mon abonnement
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular ? "border-purple-500 shadow-lg scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-500 text-white">
                    Plus populaire
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-gray-600">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {plan.price === 0 ? "Gratuit" : `${plan.price}€`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-500">/mois</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Agents IA inclus :</h4>
                  <div className="space-y-2">
                    {plan.agents.map((agentType) => {
                      const agent =
                        AGENTS_CONFIG[agentType as keyof typeof AGENTS_CONFIG];
                      return (
                        <div
                          key={agentType}
                          className="flex items-center space-x-2"
                        >
                          <span className="text-lg">{agent.icon}</span>
                          <span className="text-sm">{agent.name}</span>
                          {agent.badge && (
                            <Badge variant="outline" className="text-xs">
                              {agent.badge}
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Fonctionnalités :</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={
                    processingPlan === plan.id || isCurrentPlan(plan.id)
                  }
                  variant={getButtonVariant(plan.id)}
                  className="w-full"
                >
                  {getButtonText(plan.id)}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Paiement sécurisé par Stripe • Annulation à tout moment</p>
          <p>
            Besoin d'aide ?{" "}
            <a
              href="mailto:support@lethimcook.ai"
              className="text-purple-600 hover:underline"
            >
              Contactez notre support
            </a>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
