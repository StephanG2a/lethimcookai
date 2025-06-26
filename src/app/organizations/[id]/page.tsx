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
  Globe,
  Building,
  Users,
  FileText,
  ExternalLink,
} from "lucide-react";
import { ServiceCard } from "@/components/services/service-card";

// Fonction pour transformer un service de l'API vers le format ServiceCard
function transformServiceForCard(service: any, organizationName: string) {
  return {
    id: service.id,
    title: service.title,
    description:
      service.summary || service.description || "Description non disponible",
    price: service.lowerPrice || 0,
    type: service.serviceType,
    tags: service.tags || [],
    location:
      service.serviceType === "IRL"
        ? "Sur site"
        : service.serviceType === "ONLINE"
        ? "En ligne"
        : "Hybride",
    duration:
      service.consumptionType === "INSTANT"
        ? "Rapide"
        : service.billingPlan === "MENSUAL"
        ? "1 mois"
        : "Variable",
    replacedByAI: service.isAIReplaceable || false,
    provider: {
      name: organizationName,
      rating: 4.5 + Math.random() * 0.5, // Rating simulé
    },
  };
}

// Fonction pour récupérer une organisation par son ID
async function getOrganization(id: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/organizations/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération de l'organisation:", error);
    return null;
  }
}

// Fonction pour formater le secteur
function getSectorLabel(sector: string): string {
  const sectors: { [key: string]: string } = {
    cuisine: "Cuisine & Restauration",
    marketing: "Marketing & Communication",
    tech: "Technologie",
    sante: "Santé & Bien-être",
    education: "Éducation & Formation",
    service: "Services",
    commerce: "Commerce & Vente",
    finance: "Finance & Comptabilité",
    immobilier: "Immobilier",
    transport: "Transport & Logistique",
    industrie: "Industrie & Production",
    art: "Art & Culture",
    sport: "Sport & Loisirs",
    autre: "Autre",
  };
  return sectors[sector] || sector;
}

// Fonction pour formater la forme juridique
function getLegalFormLabel(legalForm: string): string {
  const forms: { [key: string]: string } = {
    SARL: "SARL",
    SAS: "SAS",
    "Auto-entrepreneur": "Auto-entrepreneur",
    EURL: "EURL",
    SA: "SA",
    SNC: "SNC",
    Association: "Association",
    Freelance: "Freelance",
  };
  return forms[legalForm] || legalForm;
}

interface OrganizationDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrganizationDetailPage({
  params,
}: OrganizationDetailPageProps) {
  const { id } = await params;
  const organization = await getOrganization(id);

  if (!organization) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="container mx-auto max-w-screen-xl px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="p-0 h-auto">
            <Link
              href="/organizations"
              className="flex items-center text-neutral-600 hover:text-orange-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux organisations
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="default">
                  {getSectorLabel(organization.sector)}
                </Badge>
                {organization.legalForm && (
                  <Badge variant="outline">
                    {getLegalFormLabel(organization.legalForm)}
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 border-blue-200"
                >
                  <Users className="h-3 w-3 mr-1" />
                  {organization._count.services} service
                  {organization._count.services > 1 ? "s" : ""}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold text-neutral-900 mb-4">
                {organization.name}
              </h1>

              {organization.description && (
                <p className="text-lg text-neutral-600 mb-6">
                  {organization.description}
                </p>
              )}

              <div className="flex items-center space-x-6 text-neutral-600 mb-6">
                <div className="flex items-center space-x-1">
                  <Building className="h-4 w-4" />
                  <span>Organisation</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Créée le{" "}
                    {new Date(organization.createdAt).toLocaleDateString(
                      "fr-FR"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Logo/Image principale */}
            {organization.logo ? (
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-neutral-100">
                <img
                  src={organization.logo}
                  alt={`Logo de ${organization.name}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200">
                <div className="absolute inset-0 flex items-center justify-center text-orange-600">
                  <div className="text-center">
                    <Building className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-xl font-semibold">{organization.name}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Informations détaillées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Informations détaillées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {organization.siret && (
                    <div>
                      <h4 className="font-semibold text-neutral-800 mb-1">
                        SIRET
                      </h4>
                      <p className="text-neutral-600">{organization.siret}</p>
                    </div>
                  )}
                  {organization.tva && (
                    <div>
                      <h4 className="font-semibold text-neutral-800 mb-1">
                        TVA
                      </h4>
                      <p className="text-neutral-600">{organization.tva}</p>
                    </div>
                  )}
                  {organization.legalForm && (
                    <div>
                      <h4 className="font-semibold text-neutral-800 mb-1">
                        Forme juridique
                      </h4>
                      <p className="text-neutral-600">
                        {getLegalFormLabel(organization.legalForm)}
                      </p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-1">
                      Secteur d'activité
                    </h4>
                    <p className="text-neutral-600">
                      {getSectorLabel(organization.sector)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services proposés */}
            {organization.services && organization.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Services proposés ({organization.services.length})
                  </CardTitle>
                  <CardDescription>
                    Découvrez tous les services offerts par {organization.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {organization.services.map((service: any) => (
                      <ServiceCard
                        key={service.id}
                        service={transformServiceForCard(
                          service,
                          organization.name
                        )}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations de contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {organization.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-neutral-400" />
                    <a
                      href={`mailto:${organization.email}`}
                      className="text-orange-600 hover:underline"
                    >
                      {organization.email}
                    </a>
                  </div>
                )}
                {organization.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-neutral-400" />
                    <a
                      href={`tel:${organization.phone}`}
                      className="text-orange-600 hover:underline"
                    >
                      {organization.phone}
                    </a>
                  </div>
                )}
                {organization.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-neutral-400" />
                    <a
                      href={organization.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:underline flex items-center"
                    >
                      Site web
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
                {organization.address && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-neutral-400" />
                    <span className="text-neutral-600">
                      {organization.address}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Services proposés</span>
                  <Badge variant="secondary">
                    {organization._count.services}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Secteur</span>
                  <Badge variant="outline">
                    {getSectorLabel(organization.sector)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Membre depuis</span>
                  <span className="text-neutral-800 font-medium">
                    {new Date(organization.createdAt).toLocaleDateString(
                      "fr-FR"
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contacter l'organisation
              </Button>
              {organization.services && organization.services.length > 0 && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/services">
                    <Star className="h-4 w-4 mr-2" />
                    Voir tous leurs services
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
