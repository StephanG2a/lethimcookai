"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { ServiceCard } from "@/components/services/service-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Zap,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  summary: string | null;
  lowerPrice: number;
  upperPrice: number | null;
  serviceType: "IRL" | "ONLINE" | "MIXED";
  tags: string[];
  isAIReplaceable: boolean;
  organization: {
    name: string;
    id: string;
  };
}

const priceRanges = [
  { label: "Moins de 100€", min: 0, max: 100 },
  { label: "100€ - 500€", min: 100, max: 500 },
  { label: "500€ - 1000€", min: 500, max: 1000 },
  { label: "Plus de 1000€", min: 1000, max: Infinity },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState<
    "ALL" | "IRL" | "ONLINE" | "MIXED"
  >("ALL");
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(
    null
  );
  const [aiOnly, setAiOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Récupérer les services depuis l'API
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/services?limit=50");

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des services");
      }

      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error("Erreur:", error);
      setError("Impossible de charger les services");
    } finally {
      setLoading(false);
    }
  };

  // Transformer les données pour le composant ServiceCard
  const transformService = (service: Service) => ({
    id: service.id,
    title: service.title,
    description: service.summary || service.description,
    price: service.lowerPrice,
    type: service.serviceType as "IRL" | "ONLINE" | "MIXED",
    tags: service.tags,
    location:
      service.serviceType === "IRL"
        ? "Sur site"
        : service.serviceType === "ONLINE"
        ? "En ligne"
        : "Hybride",
    duration: "À définir",
    replacedByAI: service.isAIReplaceable,
    provider: {
      name: service.organization.name,
      rating: 4.5, // Note par défaut en attendant le système de notation
    },
  });

  // Filtrer les services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.summary &&
        service.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      service.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      service.organization.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType =
      selectedServiceType === "ALL" ||
      service.serviceType === selectedServiceType;

    const matchesPrice =
      selectedPriceRange === null ||
      (service.lowerPrice >= priceRanges[selectedPriceRange].min &&
        service.lowerPrice <= priceRanges[selectedPriceRange].max);

    const matchesAI = !aiOnly || service.isAIReplaceable;

    return matchesSearch && matchesType && matchesPrice && matchesAI;
  });

  // Obtenir toutes les catégories uniques depuis les services
  const allCategories = Array.from(
    new Set(services.flatMap((service) => service.tags))
  ).sort();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Chargement des services...</span>
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
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchServices}>Réessayer</Button>
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
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Services culinaires
          </h1>
          <p className="text-lg text-neutral-600">
            Découvrez {services.length} services proposés par nos prestataires
            experts
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <Input
              placeholder="Rechercher des services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Bouton filtres mobile */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filtres
            {(selectedServiceType !== "ALL" ||
              selectedPriceRange !== null ||
              aiOnly) && (
              <Badge variant="secondary" className="ml-2">
                Actifs
              </Badge>
            )}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar filtres */}
          <div
            className={`md:w-64 space-y-6 ${
              showFilters ? "block" : "hidden md:block"
            }`}
          >
            {/* Type de service */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Type de service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { value: "ALL", label: "Tous" },
                  { value: "IRL", label: "Présentiel" },
                  { value: "ONLINE", label: "En ligne" },
                  { value: "MIXED", label: "Hybride" },
                ].map((type) => (
                  <label
                    key={type.value}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="serviceType"
                      value={type.value}
                      checked={selectedServiceType === type.value}
                      onChange={(e) =>
                        setSelectedServiceType(e.target.value as any)
                      }
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm">{type.label}</span>
                  </label>
                ))}
              </CardContent>
            </Card>

            {/* Gamme de prix */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prix</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    value="all"
                    checked={selectedPriceRange === null}
                    onChange={() => setSelectedPriceRange(null)}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm">Tous les prix</span>
                </label>
                {priceRanges.map((range, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      value={index}
                      checked={selectedPriceRange === index}
                      onChange={() => setSelectedPriceRange(index)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm">{range.label}</span>
                  </label>
                ))}
              </CardContent>
            </Card>

            {/* Compatible IA */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Spécialités</CardTitle>
              </CardHeader>
              <CardContent>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiOnly}
                    onChange={(e) => setAiOnly(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm flex items-center">
                    <Zap className="h-4 w-4 mr-1 text-purple-600" />
                    Compatible IA seulement
                  </span>
                </label>
                <p className="text-xs text-neutral-500 mt-1 ml-6">
                  Services exécutables automatiquement par l'IA (abonnement Business requis)
                </p>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Résultats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium">{services.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Filtrés</span>
                    <span className="font-medium">
                      {filteredServices.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IA Compatible</span>
                    <span className="font-medium">
                      {services.filter((s) => s.isAIReplaceable).length}
                    </span>
                  </div>
                </div>

                {/* Bouton Reset */}
                {(selectedServiceType !== "ALL" ||
                  selectedPriceRange !== null ||
                  aiOnly) && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedServiceType("ALL");
                        setSelectedPriceRange(null);
                        setAiOnly(false);
                      }}
                      className="w-full"
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            {/* Badges filtres actifs */}
            {(selectedServiceType !== "ALL" ||
              selectedPriceRange !== null ||
              aiOnly) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedServiceType !== "ALL" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedServiceType === "IRL"
                      ? "Présentiel"
                      : selectedServiceType === "ONLINE"
                      ? "En ligne"
                      : "Hybride"}
                    <button
                      onClick={() => setSelectedServiceType("ALL")}
                      className="ml-1 hover:bg-neutral-200 rounded"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedPriceRange !== null && (
                  <Badge variant="secondary" className="gap-1">
                    {priceRanges[selectedPriceRange].label}
                    <button
                      onClick={() => setSelectedPriceRange(null)}
                      className="ml-1 hover:bg-neutral-200 rounded"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {aiOnly && (
                  <Badge variant="secondary" className="gap-1">
                    <Zap className="h-3 w-3" />
                    Compatible IA (Business)
                    <button
                      onClick={() => setAiOnly(false)}
                      className="ml-1 hover:bg-neutral-200 rounded"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Grille des services */}
            {filteredServices.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">
                      Aucun service trouvé
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Essayez de modifier vos critères de recherche ou vos
                      filtres.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedServiceType("ALL");
                        setSelectedPriceRange(null);
                        setAiOnly(false);
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={transformService(service)}
                  />
                ))}
              </div>
            )}

            {/* Pagination (à implémenter plus tard si nécessaire) */}
            {filteredServices.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Affichage de {filteredServices.length} service(s) sur{" "}
                  {services.length}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
