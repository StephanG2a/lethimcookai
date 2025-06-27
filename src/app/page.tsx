import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layout/main-layout";
import { ServiceCard } from "@/components/services/service-card";
import { PublishServiceButton } from "@/components/ui/publish-service-button";
import {
  ArrowRight,
  CheckCircle,
  Utensils,
  Camera,
  Megaphone,
  Code,
  Sparkles,
  Users,
  Building,
  MapPin,
  Globe,
} from "lucide-react";

// Fonction pour récupérer les organizations en vedette depuis l'API
async function getFeaturedOrganizations() {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/organizations?limit=3`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des organisations");
    }

    const data = await response.json();
    return data.organizations || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des organisations:", error);
    return [];
  }
}

// Fonction pour récupérer les services depuis l'API
async function getFeaturedServices() {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/services?limit=3`,
      {
        cache: "no-store", // Pour avoir les données fraîches
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des services");
    }

    const data = await response.json();

    // Transformer les données API vers le format attendu par ServiceCard
    return data.services.map((service: any) => ({
      id: service.id,
      title: service.title,
      description: service.summary || service.description,
      price: service.lowerPrice,
      type: service.serviceType,
      tags: service.tags.slice(0, 3), // Limiter à 3 tags
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
      replacedByAI: service.isAIReplaceable,
      provider: {
        name: service.organization.name,
        rating: 4.5 + Math.random() * 0.5, // Rating simulé entre 4.5 et 5.0
      },
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des services:", error);
    // Données de fallback en cas d'erreur
    return [
      {
        id: "1",
        title: "Service temporairement indisponible",
        description: "Nous travaillons à résoudre ce problème",
        price: 0,
        type: "ONLINE" as const,
        tags: ["Maintenance"],
        location: "En ligne",
        duration: "N/A",
        replacedByAI: false,
        provider: {
          name: "Équipe technique",
          rating: 5.0,
        },
      },
    ];
  }
}

export default async function HomePage() {
  const [featuredServices, featuredOrganizations] = await Promise.all([
    getFeaturedServices(),
    getFeaturedOrganizations(),
  ]);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                <span>Nouvelle plateforme culinaire</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 leading-tight">
                Connectez-vous aux
                <span className="text-orange-600">
                  {" "}
                  meilleurs prestataires
                </span>{" "}
                culinaires
              </h1>

              <p className="text-xl text-neutral-600 leading-relaxed">
                Que vous soyez chef, traiteur ou restaurateur, trouvez
                facilement les experts qui vous aideront à développer votre
                activité : photographes, développeurs, marketeurs...
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/services">
                    <Utensils className="h-5 w-5 mr-2" />
                    Parcourir les services
                  </Link>
                </Button>
                <PublishServiceButton variant="outline" size="lg" />
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Camera className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        Shooting photo culinaire
                      </h3>
                      <p className="text-sm text-neutral-600">
                        350€ • 2h • Paris
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline">Photographie</Badge>
                    <Badge variant="outline">Professionnel</Badge>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-6 transform -rotate-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">
                      Mission terminée
                    </p>
                    <p className="text-sm text-neutral-600">
                      ⭐ 4.9/5 • Recommandé
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services populaires */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Services populaires
            </h2>
            <p className="text-xl text-neutral-600">
              Découvrez les services les plus demandés par les professionnels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">
                Voir tous les services
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Organisations en vedette */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Organisations partenaires
            </h2>
            <p className="text-xl text-neutral-600">
              Découvrez les organisations qui font confiance à notre plateforme
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredOrganizations.map((organization: any) => (
              <Link
                key={organization.id}
                href={`/organizations/${organization.id}`}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-orange-200 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
                          {organization.name}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="default" className="text-xs">
                            {organization.sector}
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
                          <span className="truncate">
                            {organization.address}
                          </span>
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
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/organizations">
                Voir toutes les organisations
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Trouvez votre prestataire par catégorie
            </h2>
            <p className="text-xl text-neutral-600">
              Explorez nos différentes catégories de services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Camera,
                title: "Photographie",
                description:
                  "Photos de plats, événements culinaires, reportages restaurant",
                count: "45+ services",
              },
              {
                icon: Megaphone,
                title: "Marketing",
                description:
                  "Stratégie digitale, réseaux sociaux, publicité en ligne",
                count: "32+ services",
              },
              {
                icon: Code,
                title: "Développement",
                description:
                  "Sites web, applications mobile, systèmes de commande",
                count: "28+ services",
              },
              {
                icon: Users,
                title: "Conseil",
                description:
                  "Stratégie business, formation, audit opérationnel",
                count: "19+ services",
              },
            ].map((category, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                    <category.icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="mb-2">
                    {category.description}
                  </CardDescription>
                  <Badge variant="outline" className="text-orange-600">
                    {category.count}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto max-w-screen-xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à développer votre activité culinaire ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez notre communauté de professionnels et trouvez les services
            qui feront la différence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/services">Parcourir les services</Link>
            </Button>
            <PublishServiceButton
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-orange-600"
            >
              Publier un service
            </PublishServiceButton>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
