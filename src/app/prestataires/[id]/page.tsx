"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { ServiceCard } from "@/components/services/service-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  ExternalLink,
  CheckCircle,
  XCircle,
  Calendar,
  Briefcase,
  Tag,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface Service {
  id: string;
  title: string;
  summary: string | null;
  description: string;
  lowerPrice: number;
  upperPrice: number;
  serviceType: "IRL" | "ONLINE" | "MIXED";
  paymentMode: string;
  tags: string[];
  isAIReplaceable: boolean;
}

interface Organization {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  sector: string;
  siret: string | null;
  legalForm: string | null;
  services: Service[];
}

interface Prestataire {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  createdAt: string;
  organization: Organization | null;
}

export default function PrestatairePage() {
  const params = useParams();
  const prestataireId = params.id as string;

  const [prestataire, setPrestataire] = useState<Prestataire | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (prestataireId) {
      fetchPrestataire();
    }
  }, [prestataireId]);

  const fetchPrestataire = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/prestataires/${prestataireId}`);
      const data = await response.json();

      if (data.success) {
        setPrestataire(data.data);
      } else {
        setError(data.error || "Prestataire non trouvé");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError("Erreur lors du chargement du prestataire");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Chargement du profil...</span>
        </div>
      </MainLayout>
    );
  }

  if (error || !prestataire) {
    return (
      <MainLayout>
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Prestataire non trouvé
                </h3>
                <p className="text-muted-foreground mb-4">
                  {error || "Ce prestataire n'existe pas ou a été supprimé."}
                </p>
                <Link href="/prestataires">
                  <Button>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour aux prestataires
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const fullName = [prestataire.firstName, prestataire.lastName]
    .filter(Boolean)
    .join(" ");
  const displayName = fullName || prestataire.email.split("@")[0];

  return (
    <MainLayout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Bouton retour */}
        <div className="mb-6">
          <Link href="/prestataires">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux prestataires
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale - Profil */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte profil principal */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                      <User className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold">
                        {displayName}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">Prestataire</Badge>
                        {prestataire.emailVerified ? (
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-800"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Vérifié
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-orange-200 text-orange-600"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Non vérifié
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-neutral-500" />
                      <span>{prestataire.email}</span>
                    </div>
                    {prestataire.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-neutral-500" />
                        <span>{prestataire.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-neutral-500" />
                      <span>
                        Membre depuis{" "}
                        {new Date(prestataire.createdAt).toLocaleDateString(
                          "fr-FR",
                          {
                            year: "numeric",
                            month: "long",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organisation associée */}
            {prestataire.organization && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    Organisation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    {prestataire.organization.logo ? (
                      <img
                        src={prestataire.organization.logo}
                        alt={`Logo ${prestataire.organization.name}`}
                        className="w-12 h-12 rounded-lg object-contain bg-neutral-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Link
                        href={`/organizations/${prestataire.organization.id}`}
                      >
                        <h3 className="font-semibold text-lg hover:text-orange-600 transition-colors">
                          {prestataire.organization.name}
                          <ExternalLink className="h-4 w-4 ml-1 inline" />
                        </h3>
                      </Link>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">
                          {prestataire.organization.sector}
                        </Badge>
                        {prestataire.organization.legalForm && (
                          <Badge variant="secondary">
                            {prestataire.organization.legalForm}
                          </Badge>
                        )}
                      </div>
                      {prestataire.organization.description && (
                        <p className="text-sm text-neutral-600 mt-2">
                          {prestataire.organization.description}
                        </p>
                      )}

                      <div className="grid md:grid-cols-2 gap-3 mt-3">
                        {prestataire.organization.address && (
                          <div className="flex items-center text-sm text-neutral-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{prestataire.organization.address}</span>
                          </div>
                        )}
                        {prestataire.organization.email && (
                          <div className="flex items-center text-sm text-neutral-600">
                            <Mail className="h-4 w-4 mr-2" />
                            <span>{prestataire.organization.email}</span>
                          </div>
                        )}
                        {prestataire.organization.phone && (
                          <div className="flex items-center text-sm text-neutral-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{prestataire.organization.phone}</span>
                          </div>
                        )}
                        {prestataire.organization.website && (
                          <div className="flex items-center text-sm text-neutral-600">
                            <Globe className="h-4 w-4 mr-2" />
                            <a
                              href={prestataire.organization.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-orange-600 transition-colors"
                            >
                              Site web
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services proposés */}
            {prestataire.organization?.services &&
              prestataire.organization.services.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Services proposés (
                      {prestataire.organization.services.length})
                    </CardTitle>
                    <CardDescription>
                      Découvrez tous les services offerts par ce prestataire
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {prestataire.organization.services.map((service) => (
                        <Link key={service.id} href={`/services/${service.id}`}>
                          <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-lg">
                                  {service.title}
                                </h4>
                                <div className="text-right">
                                  <span className="text-lg font-bold text-orange-600">
                                    {service.lowerPrice}€
                                    {service.upperPrice !==
                                      service.lowerPrice &&
                                      ` - ${service.upperPrice}€`}
                                  </span>
                                  <div className="text-xs text-neutral-500">
                                    {service.paymentMode}
                                  </div>
                                </div>
                              </div>

                              {service.summary && (
                                <p className="text-neutral-600 text-sm mb-3">
                                  {service.summary}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge
                                  variant={
                                    service.serviceType === "IRL"
                                      ? "default"
                                      : service.serviceType === "ONLINE"
                                      ? "secondary"
                                      : "outline"
                                  }
                                >
                                  {service.serviceType}
                                </Badge>
                                {service.isAIReplaceable && (
                                  <Badge
                                    variant="outline"
                                    className="border-yellow-200 text-yellow-700"
                                  >
                                    IA-compatible
                                  </Badge>
                                )}
                              </div>

                              {service.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {service.tags.slice(0, 3).map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      <Tag className="h-3 w-3 mr-1" />
                                      {tag}
                                    </Badge>
                                  ))}
                                  {service.tags.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{service.tags.length - 3} autres
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>

          {/* Sidebar - Actions et informations rapides */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="lg">
                  <Mail className="h-4 w-4 mr-2" />
                  Contacter par email
                </Button>
                {prestataire.phone && (
                  <Button variant="outline" className="w-full" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                )}
                {prestataire.organization?.website && (
                  <Button variant="outline" className="w-full" size="lg">
                    <Globe className="h-4 w-4 mr-2" />
                    Voir le site
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">
                    Services proposés
                  </span>
                  <span className="font-semibold">
                    {prestataire.organization?.services?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">
                    Compte vérifié
                  </span>
                  <span
                    className={
                      prestataire.emailVerified
                        ? "text-green-600"
                        : "text-orange-600"
                    }
                  >
                    {prestataire.emailVerified ? "Oui" : "Non"}
                  </span>
                </div>
                {prestataire.organization && (
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Secteur</span>
                    <span className="font-semibold">
                      {prestataire.organization.sector}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
