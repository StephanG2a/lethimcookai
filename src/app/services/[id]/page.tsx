import { notFound } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Clock,
  Zap,
  Star,
  User,
  ArrowLeft,
  MessageCircle,
  Shield,
  CheckCircle,
  Euro,
  Calendar,
  Award,
  Phone,
  Mail,
} from "lucide-react";

// Fonction pour récupérer un service par son ID
async function getService(id: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/services/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération du service:", error);
    return null;
  }
}

// Fonction pour formater le prix
function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

// Fonction pour formater le type de service
function getServiceTypeLabel(type: string): string {
  switch (type) {
    case "IRL":
      return "Présentiel";
    case "ONLINE":
      return "En ligne";
    case "MIXED":
      return "Hybride";
    default:
      return type;
  }
}

// Fonction pour formater le type de consommation
function getConsumptionTypeLabel(type: string): string {
  switch (type) {
    case "INSTANT":
      return "Instantané";
    case "PERIODIC":
      return "Périodique";
    case "PRESTATION":
      return "Prestation";
    default:
      return type;
  }
}

// Fonction pour formater le plan de facturation
function getBillingPlanLabel(plan: string): string {
  switch (plan) {
    case "UNIT":
      return "À l'unité";
    case "USAGE":
      return "À l'usage";
    case "MINUTE":
      return "Par minute";
    case "MENSUAL":
      return "Mensuel";
    case "ANNUAL":
      return "Annuel";
    case "PROJECT":
      return "Par projet";
    default:
      return plan;
  }
}

interface ServiceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="container mx-auto max-w-screen-xl px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="p-0 h-auto">
            <Link
              href="/services"
              className="flex items-center text-neutral-600 hover:text-orange-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux services
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant={
                    service.serviceType === "IRL" ? "default" : "secondary"
                  }
                >
                  {getServiceTypeLabel(service.serviceType)}
                </Badge>
                <Badge variant="outline">
                  {getConsumptionTypeLabel(service.consumptionType)}
                </Badge>
                <Badge variant="outline">
                  {getBillingPlanLabel(service.billingPlan)}
                </Badge>
                {service.isAIReplaceable && (
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 border-purple-200"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    IA Compatible
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-neutral-900 mb-4">
                {service.title}
              </h1>

              <p className="text-lg text-neutral-600 mb-6">{service.summary}</p>

              <div className="flex items-center space-x-6 text-neutral-600 mb-6">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{service.organization?.name || "Organisation"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Créé le{" "}
                    {new Date(service.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            </div>

            {/* Image principale */}
            {service.mainMedia && (
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-neutral-100">
                <div className="absolute inset-0 flex items-center justify-center text-neutral-500">
                  <div className="text-center">
                    <Award className="h-12 w-12 mx-auto mb-2" />
                    <p>Image du service</p>
                  </div>
                </div>
              </div>
            )}

            {/* Description complète */}
            <Card>
              <CardHeader>
                <CardTitle>Description du service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-neutral max-w-none">
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                    {service.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {service.tags && service.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Mots-clés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Informations sur l'organisation */}
            {service.organization && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Prestataire vérifié
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {service.organization.name}
                      </h3>
                      {service.organization.description && (
                        <p className="text-neutral-600 mt-2">
                          {service.organization.description}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.organization.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-neutral-500" />
                          <span className="text-sm">
                            {service.organization.email}
                          </span>
                        </div>
                      )}
                      {service.organization.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-neutral-500" />
                          <span className="text-sm">
                            {service.organization.phone}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-neutral-600">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>
                          Membre depuis{" "}
                          {new Date(
                            service.organization.createdAt
                          ).getFullYear()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prix et action */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div>
                    {service.lowerPrice !== null &&
                    service.upperPrice !== null ? (
                      <div className="text-3xl font-bold text-neutral-900">
                        {formatPrice(service.lowerPrice)} -{" "}
                        {formatPrice(service.upperPrice)}
                      </div>
                    ) : service.lowerPrice !== null ? (
                      <div className="text-3xl font-bold text-neutral-900">
                        À partir de {formatPrice(service.lowerPrice)}
                      </div>
                    ) : service.upperPrice !== null ? (
                      <div className="text-3xl font-bold text-neutral-900">
                        Jusqu'à {formatPrice(service.upperPrice)}
                      </div>
                    ) : (
                      <div className="text-xl font-semibold text-neutral-600">
                        Prix sur devis
                      </div>
                    )}
                    <p className="text-sm text-neutral-600 mt-1">
                      {getBillingPlanLabel(service.billingPlan)}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contacter le prestataire
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Star className="h-4 w-4 mr-2" />
                      Ajouter aux favoris
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations détaillées */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Détails du service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Type</span>
                  <span className="font-medium">
                    {getServiceTypeLabel(service.serviceType)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Consommation</span>
                  <span className="font-medium">
                    {getConsumptionTypeLabel(service.consumptionType)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Facturation</span>
                  <span className="font-medium">
                    {getBillingPlanLabel(service.billingPlan)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Mode de paiement</span>
                  <span className="font-medium">{service.paymentMode}</span>
                </div>
                {service.isAIReplaceable && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">IA Compatible</span>
                    <span className="flex items-center text-purple-600">
                      <Zap className="h-4 w-4 mr-1" />
                      Oui
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Poser une question
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Voir les avis
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Signaler ce service
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
