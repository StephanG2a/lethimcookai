"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { PrestataireCard } from "@/components/prestataires/prestataire-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Filter,
  Users,
  Building2,
  MapPin,
  CheckCircle,
  Star,
  ArrowLeft,
  Loader2,
  Bot,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface Service {
  id: string;
  title: string;
  summary: string | null;
  lowerPrice: number;
  upperPrice: number;
  paymentMode: string;
  tags: string[];
  serviceType: "IRL" | "ONLINE" | "MIXED";
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
  servicesCount: number;
}

interface PrestataireResult {
  id: string;
  name: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  createdAt: string;
  organization: Organization | null;
}

interface SearchMetadata {
  query: string;
  sector?: string;
  location?: string;
  hasOrganization?: boolean;
  verifiedOnly?: boolean;
  withServices?: boolean;
  serviceType?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  tags?: string;
  legalForm?: string;
  sortBy?: string;
  limit?: number;
  searchDate: string;
}

interface SearchStatistics {
  total: number;
  withOrganization: number;
  verified: number;
  sectors: string[];
  totalServices: number;
}

export default function PrestataireSearchPage() {
  const searchParams = useSearchParams();
  const [prestataires, setPrestataires] = useState<PrestataireResult[]>([]);
  const [searchMetadata, setSearchMetadata] = useState<SearchMetadata | null>(
    null
  );
  const [statistics, setStatistics] = useState<SearchStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres locaux
  const [localSearch, setLocalSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("ALL");

  useEffect(() => {
    // Essayer de récupérer les données depuis les paramètres URL ou localStorage
    const agentData = searchParams.get("data");
    const fromStorage = localStorage.getItem("prestataireSearchResults");

    if (agentData) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(agentData));
        loadAgentResults(parsedData);
      } catch (error) {
        console.error("Erreur parsing agent data:", error);
        setError("Données de recherche invalides");
        setLoading(false);
      }
    } else if (fromStorage) {
      try {
        const parsedData = JSON.parse(fromStorage);
        loadAgentResults(parsedData);
        // Nettoyer le localStorage après usage
        localStorage.removeItem("prestataireSearchResults");
      } catch (error) {
        console.error("Erreur parsing storage data:", error);
        loadDefaultResults();
      }
    } else {
      loadDefaultResults();
    }
  }, [searchParams]);

  const loadAgentResults = (data: any) => {
    try {
      setPrestataires(data.prestataires || []);
      setSearchMetadata(data.searchMetadata || null);
      setStatistics(data.statistics || null);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement résultats agent:", error);
      setError("Erreur lors du chargement des résultats");
      setLoading(false);
    }
  };

  const loadDefaultResults = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/prestataires?limit=20");
      const data = await response.json();

      if (data.success) {
        const transformedData = data.data.prestataires.map((p: any) => ({
          id: p.id,
          name:
            [p.firstName, p.lastName].filter(Boolean).join(" ") ||
            p.email.split("@")[0],
          firstName: p.firstName,
          lastName: p.lastName,
          email: p.email,
          phone: p.phone,
          emailVerified: p.emailVerified,
          createdAt: p.createdAt,
          organization: p.organization
            ? {
                ...p.organization,
                services: p.organization.services || [],
                servicesCount: p.organization.services?.length || 0,
              }
            : null,
        }));

        setPrestataires(transformedData);
        setStatistics({
          total: transformedData.length,
          withOrganization: transformedData.filter((p: any) => p.organization)
            .length,
          verified: transformedData.filter((p: any) => p.emailVerified).length,
          sectors: [
            ...new Set(
              transformedData
                .map((p: any) => p.organization?.sector)
                .filter(Boolean)
            ),
          ],
          totalServices: transformedData.reduce(
            (sum: number, p: any) => sum + (p.organization?.servicesCount || 0),
            0
          ),
        });
      } else {
        setError("Erreur lors du chargement des prestataires");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  // Filtrage local des résultats
  const filteredPrestataires = prestataires.filter((prestataire) => {
    const matchesLocalSearch =
      localSearch === "" ||
      prestataire.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      prestataire.email.toLowerCase().includes(localSearch.toLowerCase()) ||
      (prestataire.organization?.name || "")
        .toLowerCase()
        .includes(localSearch.toLowerCase());

    const matchesSector =
      selectedSector === "ALL" ||
      prestataire.organization?.sector === selectedSector;

    return matchesLocalSearch && matchesSector;
  });

  const availableSectors = statistics?.sectors || [];

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Chargement des résultats...</span>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2 text-red-600">
                  Erreur de chargement
                </h3>
                <p className="text-muted-foreground mb-4">{error}</p>
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

  return (
    <MainLayout>
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header avec informations de recherche */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Résultats de recherche
                </h1>
                {searchMetadata && (
                  <div className="flex items-center text-sm text-neutral-600 mt-1">
                    <Bot className="h-4 w-4 mr-1" />
                    Recherche effectuée par l'Agent Business
                    {searchMetadata.searchDate && (
                      <span className="ml-2">
                        le{" "}
                        {new Date(searchMetadata.searchDate).toLocaleString(
                          "fr-FR"
                        )}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <Link href="/prestataires">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
          </div>

          {/* Critères de recherche utilisés */}
          {searchMetadata && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Sparkles className="h-5 w-5 mr-2 text-orange-600" />
                  Critères de recherche appliqués
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {searchMetadata.query && (
                    <Badge variant="default">
                      Recherche: "{searchMetadata.query}"
                    </Badge>
                  )}
                  {searchMetadata.sector && (
                    <Badge variant="secondary">
                      Secteur: {searchMetadata.sector}
                    </Badge>
                  )}
                  {searchMetadata.location && (
                    <Badge variant="secondary">
                      Lieu: {searchMetadata.location}
                    </Badge>
                  )}
                  {searchMetadata.verifiedOnly && (
                    <Badge
                      variant="outline"
                      className="border-green-200 text-green-700"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Vérifiés uniquement
                    </Badge>
                  )}
                  {searchMetadata.hasOrganization !== undefined && (
                    <Badge variant="outline">
                      {searchMetadata.hasOrganization
                        ? "Avec organisation"
                        : "Sans organisation"}
                    </Badge>
                  )}
                  {searchMetadata.serviceType && (
                    <Badge variant="outline">
                      Services {searchMetadata.serviceType}
                    </Badge>
                  )}
                  {(searchMetadata.priceRange?.min ||
                    searchMetadata.priceRange?.max) && (
                    <Badge variant="outline">
                      Prix: {searchMetadata.priceRange.min || 0}€ -{" "}
                      {searchMetadata.priceRange.max || "∞"}€
                    </Badge>
                  )}
                  {searchMetadata.tags && (
                    <Badge variant="outline">Tags: {searchMetadata.tags}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statistiques */}
          {statistics && (
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-orange-600" />
                    <div className="ml-3">
                      <p className="text-2xl font-bold">{statistics.total}</p>
                      <p className="text-sm text-neutral-600">Prestataires</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-2xl font-bold">
                        {statistics.withOrganization}
                      </p>
                      <p className="text-sm text-neutral-600">
                        Avec organisation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-2xl font-bold">
                        {statistics.verified}
                      </p>
                      <p className="text-sm text-neutral-600">Vérifiés</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Star className="h-8 w-8 text-purple-600" />
                    <div className="ml-3">
                      <p className="text-2xl font-bold">
                        {statistics.totalServices}
                      </p>
                      <p className="text-sm text-neutral-600">Services</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Filtres locaux */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Affiner les résultats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Filtrer par nom, email ou organisation..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                />
              </div>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="ALL">Tous les secteurs</option>
                {availableSectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Résultats */}
        {filteredPrestataires.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun résultat</h3>
              <p className="text-neutral-600 mb-4">
                Aucun prestataire ne correspond aux critères de filtrage
                actuels.
              </p>
              <Button
                onClick={() => {
                  setLocalSearch("");
                  setSelectedSector("ALL");
                }}
              >
                Réinitialiser les filtres
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {filteredPrestataires.length} prestataire
                {filteredPrestataires.length > 1 ? "s" : ""} trouvé
                {filteredPrestataires.length > 1 ? "s" : ""}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrestataires.map((prestataire) => (
                <PrestataireCard
                  key={prestataire.id}
                  prestataire={prestataire}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
