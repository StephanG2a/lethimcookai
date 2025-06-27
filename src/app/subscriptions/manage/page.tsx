"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/useAuth";
import { AGENTS_CONFIG } from "@/lib/subscription";
import { Calendar, CreditCard, AlertTriangle } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";

interface SubscriptionInfo {
  user: {
    id: string;
    email: string;
    subscriptionPlan: string;
    subscriptionStatus: string;
    subscriptionStart: string | null;
    subscriptionEnd: string | null;
  };
  stripeInfo: {
    subscriptionId: string;
    customerId: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  } | null;
}

export default function ManageSubscriptionPage() {
  const { user, loading, token } = useAuth();
  const router = useRouter();
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<SubscriptionInfo | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/subscriptions/manage");
      return;
    }

    if (user) {
      fetchSubscriptionInfo();
    }
  }, [user, loading]);

  const fetchSubscriptionInfo = async () => {
    try {
      const authToken = token || localStorage.getItem("token");

      if (!authToken) {
        router.push("/auth/login?redirect=/subscriptions/manage");
        return;
      }

      const response = await fetch("/api/subscriptions/manage", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubscriptionInfo(data);
      }
    } catch (error) {
      console.error("Erreur récupération info abonnement:", error);
    } finally {
      setIsLoadingInfo(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir annuler votre abonnement ? Il restera actif jusqu'à la fin de la période de facturation."
      )
    ) {
      return;
    }

    setIsCancelling(true);

    try {
      const authToken = token || localStorage.getItem("token");

      if (!authToken) {
        router.push("/auth/login?redirect=/subscriptions/manage");
        return;
      }

      const response = await fetch("/api/subscriptions/manage", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        await fetchSubscriptionInfo(); // Rafraîchir les infos
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Erreur annulation:", error);
      alert("Une erreur est survenue lors de l'annulation.");
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      ACTIVE: {
        label: "Actif",
        variant: "default" as const,
        color: "bg-green-500",
      },
      TRIAL: {
        label: "Essai",
        variant: "secondary" as const,
        color: "bg-blue-500",
      },
      EXPIRED: {
        label: "Expiré",
        variant: "destructive" as const,
        color: "bg-red-500",
      },
      CANCELLED: {
        label: "Annulé",
        variant: "outline" as const,
        color: "bg-gray-500",
      },
    };

    const statusInfo =
      statusMap[status as keyof typeof statusMap] || statusMap.EXPIRED;
    return (
      <Badge variant={statusInfo.variant} className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getPlanName = (plan: string) => {
    const planMap = {
      FREE: "Gratuit",
      PREMIUM: "Premium",
      BUSINESS: "Business",
    };
    return planMap[plan as keyof typeof planMap] || plan;
  };

  if (loading || isLoadingInfo) {
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

  if (!user || !subscriptionInfo) {
    return null;
  }

  const { user: userInfo, stripeInfo } = subscriptionInfo;
  const isFreePlan = userInfo.subscriptionPlan === "FREE";
  const willCancelAtPeriodEnd = stripeInfo?.cancelAtPeriodEnd || false;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Gestion de votre abonnement
            </h1>
            <p className="text-gray-600">Gérez votre plan et vos préférences</p>
          </div>

          {/* Informations d'abonnement */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Détails de l'abonnement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Plan actuel</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">
                      {getPlanName(userInfo.subscriptionPlan)}
                    </span>
                    {getStatusBadge(userInfo.subscriptionStatus)}
                  </div>
                </div>

                {!isFreePlan && userInfo.subscriptionEnd && (
                  <div>
                    <h3 className="font-semibold mb-2">
                      Prochaine facturation
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{formatDate(userInfo.subscriptionEnd)}</span>
                    </div>
                  </div>
                )}
              </div>

              {willCancelAtPeriodEnd && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">
                        Abonnement en cours d'annulation
                      </h4>
                      <p className="text-sm text-yellow-700">
                        Votre abonnement sera annulé le{" "}
                        {stripeInfo && formatDate(stripeInfo.currentPeriodEnd)}.
                        Vous continuerez à avoir accès à toutes les
                        fonctionnalités jusqu'à cette date.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!isFreePlan && userInfo.subscriptionStart && (
                <div>
                  <h3 className="font-semibold mb-2">Abonné depuis</h3>
                  <span className="text-gray-600">
                    {formatDate(userInfo.subscriptionStart)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Agents inclus */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Agents IA inclus dans votre plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(AGENTS_CONFIG).map(([key, agent]) => {
                  const hasAccess =
                    key === "basic" ||
                    (key === "premium" &&
                      ["PREMIUM", "BUSINESS"].includes(
                        userInfo.subscriptionPlan
                      )) ||
                    (key === "business" &&
                      userInfo.subscriptionPlan === "BUSINESS");

                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-lg border ${
                        hasAccess
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{agent.icon}</span>
                        <span className="font-semibold">{agent.name}</span>
                        {hasAccess ? (
                          <Badge className="bg-green-500">✓</Badge>
                        ) : (
                          <Badge variant="outline">✗</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {agent.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => router.push("/subscriptions")}
                  variant="outline"
                  className="flex-1"
                >
                  Changer de plan
                </Button>

                {!isFreePlan && !willCancelAtPeriodEnd && (
                  <Button
                    onClick={handleCancelSubscription}
                    disabled={isCancelling}
                    variant="destructive"
                    className="flex-1"
                  >
                    {isCancelling ? "Annulation..." : "Annuler l'abonnement"}
                  </Button>
                )}
              </div>

              <p className="text-xs text-gray-500 text-center">
                En cas de problème, contactez notre support à{" "}
                <a
                  href="mailto:support@lethimcook.ai"
                  className="text-purple-600 hover:underline"
                >
                  support@lethimcook.ai
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
