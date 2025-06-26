"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/useAuth";
import { MainLayout } from "@/components/layout/main-layout";

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading, token, login } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
      return;
    }

    if (sessionId && user) {
      // Mettre à jour l'abonnement immédiatement
      updateUserSubscription();
    } else {
      setIsVerifying(false);
    }
  }, [sessionId, user, loading]);

  const updateUserSubscription = async () => {
    try {
      const authToken = token || localStorage.getItem("token");

      if (!authToken) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch("/api/subscriptions/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        const data = await response.json();
        // Mettre à jour les données utilisateur dans le contexte d'auth
        login(authToken, data.user);
        setUpdateSuccess(true);
      } else {
        console.error("Erreur mise à jour abonnement");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  // Ancienne logique avec timer - maintenant on met à jour directement
  useEffect(() => {
    if (sessionId && !updateSuccess) {
      const timer = setTimeout(() => {
        setIsVerifying(false);
      }, 5000); // Timeout de sécurité

      return () => clearTimeout(timer);
    }
  }, [sessionId, updateSuccess]);

  if (loading || isVerifying) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold mb-2">
                  Vérification en cours...
                </h2>
                <p className="text-gray-600">
                  Nous finalisons votre abonnement, veuillez patienter quelques
                  instants.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!sessionId) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-red-500 text-4xl mb-4">❌</div>
                <h2 className="text-xl font-semibold mb-2">Erreur</h2>
                <p className="text-gray-600 mb-4">
                  Session de paiement introuvable.
                </p>
                <Button onClick={() => router.push("/subscriptions")}>
                  Retour aux abonnements
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="text-green-500 text-4xl mb-2">✅</div>
              <CardTitle className="text-2xl text-green-600">
                Paiement réussi !
              </CardTitle>
            </CardHeader>

            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Félicitations ! Votre abonnement a été activé avec succès.
              </p>

              {user && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Plan actuel :</p>
                  <p className="font-semibold text-lg">
                    {user.subscriptionPlan === "PREMIUM"
                      ? "Premium"
                      : user.subscriptionPlan === "BUSINESS"
                      ? "Business"
                      : "Gratuit"}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Button onClick={() => router.push("/chat")} className="w-full">
                  Commencer à utiliser l'IA
                </Button>

                <Button
                  onClick={() => router.push("/subscriptions")}
                  variant="outline"
                  className="w-full"
                >
                  Voir mon abonnement
                </Button>
              </div>

              <p className="text-xs text-gray-500">
                Un email de confirmation vous a été envoyé.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
