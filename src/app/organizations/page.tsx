"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Building,
  Users,
  MapPin,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface Organization {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  sector: string;
  legalForm?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  createdAt: string;
  _count: {
    services: number;
  };
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

// Composant pour une carte d'organisation
function OrganizationCard({ organization }: { organization: Organization }) {
  return (
    <Link href={`/organizations/${organization.id}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-orange-200 cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
                {organization.name}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="default" className="text-xs">
                  {getSectorLabel(organization.sector)}
                </Badge>
                {organization._count?.services > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-blue-100 text-blue-800"
                  >
                    <Users className="h-3 w-3 mr-1" />
                    {organization._count.services} service
                    {organization._count.services > 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
            </div>
            {organization.logo ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 ml-4">
                <img
                  src={organization.logo}
                  alt={`Logo de ${organization.name}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0 ml-4">
                <Building className="h-6 w-6 text-orange-600" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {organization.description && (
            <CardDescription className="text-sm text-neutral-600 mb-4 line-clamp-2">
              {organization.description}
            </CardDescription>
          )}

          <div className="space-y-2">
            {organization.address && (
              <div className="flex items-center text-xs text-neutral-500">
                <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="truncate">{organization.address}</span>
              </div>
            )}
            {organization.email && (
              <div className="flex items-center text-xs text-neutral-500">
                <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="truncate">{organization.email}</span>
              </div>
            )}
            {organization.website && (
              <div className="flex items-center text-xs text-neutral-500">
                <Globe className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="truncate">Site web disponible</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("ALL");

  // Récupérer les organisations depuis l'API
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/organizations?limit=50");

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des organisations");
      }

      const data = await response.json();
      setOrganizations(data.organizations || []);
    } catch (error) {
      console.error("Erreur:", error);
      setError("Impossible de charger les organisations");
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les secteurs uniques dynamiquement
  const availableSectors = Array.from(
    new Set(organizations.map((org) => org.sector))
  ).sort();

  // Filtrer les organisations
  const filteredOrganizations = organizations.filter((organization) => {
    const matchesSearch =
      organization.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (organization.description &&
        organization.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      organization.sector.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSector =
      selectedSector === "ALL" || organization.sector === selectedSector;

    return matchesSearch && matchesSector;
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Chargement des organisations...</span>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto max-w-screen-xl px-4 py-8">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2 text-red-600">
                  Erreur de chargement
                </h3>
                <p className="text-neutral-600 mb-4">{error}</p>
                <Button onClick={fetchOrganizations}>Réessayer</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto max-w-screen-xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Organisations
          </h1>
          <p className="text-lg text-neutral-600">
            Découvrez {organizations.length} organisations qui proposent des
            services sur notre plateforme
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <Input
              placeholder="Rechercher des organisations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Filter className="h-5 w-5 mr-2" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="sector"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Secteur d'activité
                  </label>
                  <select
                    id="sector"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                  >
                    <option value="ALL">Tous les secteurs</option>
                    {availableSectors.map((sector) => (
                      <option key={sector} value={sector}>
                        {getSectorLabel(sector)} (
                        {
                          organizations.filter((org) => org.sector === sector)
                            .length
                        }
                        )
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSector("ALL");
                    }}
                    className="w-full"
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Résultats de la recherche */}
        {(searchTerm || selectedSector !== "ALL") && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {filteredOrganizations.length} résultat
                {filteredOrganizations.length > 1 ? "s" : ""} trouvé
                {filteredOrganizations.length > 1 ? "s" : ""}
              </Badge>
              {searchTerm && (
                <Badge variant="outline" className="gap-1">
                  Recherche: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:bg-neutral-200 rounded"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedSector !== "ALL" && (
                <Badge variant="outline" className="gap-1">
                  Secteur: {getSectorLabel(selectedSector)}
                  <button
                    onClick={() => setSelectedSector("ALL")}
                    className="ml-1 hover:bg-neutral-200 rounded"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Building className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-neutral-900">
                      {filteredOrganizations.length}
                    </p>
                    <p className="text-sm text-neutral-600">
                      Organisations{" "}
                      {searchTerm || selectedSector !== "ALL" ? "filtrées" : ""}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-neutral-900">
                      {filteredOrganizations.reduce(
                        (total: number, org: Organization) =>
                          total + (org._count?.services || 0),
                        0
                      )}
                    </p>
                    <p className="text-sm text-neutral-600">
                      Services proposés
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Globe className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-neutral-900">
                      {
                        new Set(
                          filteredOrganizations.map(
                            (org: Organization) => org.sector
                          )
                        ).size
                      }
                    </p>
                    <p className="text-sm text-neutral-600">
                      Secteurs représentés
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Liste des organisations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.map((organization: Organization) => (
            <OrganizationCard
              key={organization.id}
              organization={organization}
            />
          ))}
        </div>

        {/* Message si aucune organisation */}
        {filteredOrganizations.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              {organizations.length === 0
                ? "Aucune organisation disponible"
                : "Aucune organisation trouvée"}
            </h3>
            <p className="text-neutral-600">
              {organizations.length === 0
                ? "Il n'y a pas encore d'organisations sur la plateforme."
                : "Essayez de modifier vos critères de recherche."}
            </p>
            {(searchTerm || selectedSector !== "ALL") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSector("ALL");
                }}
                className="mt-4"
              >
                Réinitialiser les filtres
              </Button>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
