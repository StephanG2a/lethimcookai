"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { PrestataireCard } from "@/components/prestataires/prestataire-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  summary: string | null;
  lowerPrice: number;
  upperPrice: number;
  paymentMode: string;
  tags: string[];
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
  servicesCount: number;
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

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function PrestatairesPage() {
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Secteurs disponibles (vous pouvez les adapter selon vos besoins)
  const sectors = [
    "cuisine",
    "marketing",
    "technologie",
    "design",
    "conseil",
    "formation",
    "santé",
    "finance",
    "immobilier",
    "communication",
  ];

  const fetchPrestataires = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
      });

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      if (selectedSector) {
        params.append("sector", selectedSector);
      }

      const response = await fetch(`/api/prestataires?${params}`);
      const data = await response.json();

      if (data.success) {
        setPrestataires(data.data.prestataires);
        setPagination(data.data.pagination);
      } else {
        setError(data.error || "Erreur lors du chargement des prestataires");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestataires();
  }, [currentPage, searchQuery, selectedSector]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPrestataires();
  };

  const handleSectorFilter = (sector: string) => {
    setSelectedSector(sector === selectedSector ? "" : sector);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <MainLayout>
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-neutral-900">
              Prestataires
            </h1>
          </div>
          <p className="text-lg text-neutral-600">
            Découvrez les prestataires de services culinaires et leurs
            organisations
          </p>
        </div>

        {/* Filtres et recherche */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Recherche et filtres
            </CardTitle>
            <CardDescription>
              Trouvez les prestataires qui correspondent à vos besoins
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Barre de recherche */}
            <form onSubmit={handleSearch} className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Rechercher par nom, email ou organisation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Rechercher</Button>
            </form>

            {/* Filtres par secteur */}
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-2">
                Filtrer par secteur :
              </p>
              <div className="flex flex-wrap gap-2">
                {sectors.map((sector) => (
                  <Badge
                    key={sector}
                    variant={selectedSector === sector ? "default" : "outline"}
                    className="cursor-pointer hover:bg-orange-100"
                    onClick={() => handleSectorFilter(sector)}
                  >
                    {sector}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Résultats */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Chargement des prestataires...</p>
          </div>
        ) : error ? (
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Erreur de chargement
              </h3>
              <p className="text-neutral-600 mb-4">{error}</p>
              <Button onClick={fetchPrestataires} variant="outline">
                Réessayer
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Statistiques */}
            {pagination && (
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-neutral-600">
                  <span>
                    {pagination.total} prestataire
                    {pagination.total > 1 ? "s" : ""} trouvé
                    {pagination.total > 1 ? "s" : ""}
                  </span>
                  {(searchQuery || selectedSector) && (
                    <span>
                      • Page {pagination.page} sur {pagination.totalPages}
                    </span>
                  )}
                </div>
                {(searchQuery || selectedSector) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedSector("");
                      setCurrentPage(1);
                    }}
                  >
                    Effacer les filtres
                  </Button>
                )}
              </div>
            )}

            {/* Liste des prestataires */}
            {prestataires.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {prestataires.map((prestataire) => (
                  <PrestataireCard
                    key={prestataire.id}
                    prestataire={prestataire}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Aucun prestataire trouvé
                  </h3>
                  <p className="text-neutral-600">
                    {searchQuery || selectedSector
                      ? "Essayez de modifier vos critères de recherche"
                      : "Il n'y a pas encore de prestataires inscrits"}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Précédent
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .filter((page) => {
                      const current = pagination.page;
                      return (
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= current - 1 && page <= current + 1)
                      );
                    })
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-neutral-400">...</span>
                        )}
                        <Button
                          variant={
                            page === pagination.page ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      </div>
                    ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                >
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
