import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

// Vérifier que DATABASE_URL est définie
if (!process.env.DATABASE_URL) {
  console.warn(
    "⚠️ DATABASE_URL non définie dans les variables d'environnement"
  );
}

const prisma = new PrismaClient();

export const prestataireSearch = tool(
  async ({
    query,
    sector,
    location,
    has_organization,
    verified_only,
    with_services,
    service_type,
    min_price,
    max_price,
    tags,
    legal_form,
    limit,
    sort_by,
  }) => {
    try {
      const whereClause: any = {
        role: "PRESTATAIRE", // Filtrer uniquement les prestataires
      };

      // Recherche générale par nom, email ou organisation
      if (query) {
        whereClause.OR = [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          {
            organization: {
              name: { contains: query, mode: "insensitive" },
            },
          },
          {
            organization: {
              description: { contains: query, mode: "insensitive" },
            },
          },
        ];
      }

      // RESTRICTION DOMAINE CULINAIRE : Filtrer par secteurs culinaires uniquement
      const culinaryFilters = {
        OR: [
          { sector: { contains: "cuisine", mode: "insensitive" } },
          { sector: { contains: "restaurant", mode: "insensitive" } },
          { sector: { contains: "alimentation", mode: "insensitive" } },
          { sector: { contains: "traiteur", mode: "insensitive" } },
          { sector: { contains: "boulangerie", mode: "insensitive" } },
          { sector: { contains: "pâtisserie", mode: "insensitive" } },
          { sector: { contains: "gastronomie", mode: "insensitive" } },
          { sector: { contains: "food", mode: "insensitive" } },
          { sector: { contains: "chef", mode: "insensitive" } },
          { sector: { contains: "culinaire", mode: "insensitive" } },
        ],
      };

      // Filtrage par secteur d'activité (limité au domaine culinaire)
      if (sector) {
        whereClause.organization = {
          ...whereClause.organization,
          AND: [
            culinaryFilters,
            { sector: { contains: sector, mode: "insensitive" } },
          ],
        };
      } else {
        // Forcer la restriction culinaire par défaut
        whereClause.organization = {
          ...whereClause.organization,
          ...culinaryFilters,
        };
      }

      // Filtrage par localisation (maintenir les restrictions culinaires)
      if (location) {
        whereClause.organization = {
          ...whereClause.organization,
          address: { contains: location, mode: "insensitive" },
        };
      }

      // Filtrage par forme juridique
      if (legal_form) {
        whereClause.organization = {
          ...whereClause.organization,
          legalForm: { contains: legal_form, mode: "insensitive" },
        };
      }

      // Filtrage: avoir une organisation ou non
      if (has_organization !== undefined) {
        if (has_organization) {
          whereClause.organizationId = { not: null };
        } else {
          whereClause.organizationId = null;
        }
      }

      // Filtrage: comptes vérifiés uniquement
      if (verified_only) {
        whereClause.emailVerified = true;
      }

      // Inclusion conditionnelle des services
      const includeServices =
        with_services ||
        service_type ||
        min_price !== undefined ||
        max_price !== undefined ||
        tags;

      const includeClause: any = {
        organization: includeServices
          ? {
              include: {
                services: {
                  where: {},
                  take: 5, // Limiter à 5 services par prestataire
                  orderBy: { createdAt: "desc" },
                },
              },
            }
          : true,
      };

      // Filtres spécifiques aux services si demandés
      if (includeServices && includeClause.organization?.include?.services) {
        const serviceWhere: any = {};

        if (service_type) {
          serviceWhere.serviceType = service_type;
        }

        if (min_price !== undefined) {
          serviceWhere.lowerPrice = { gte: min_price };
        }

        if (max_price !== undefined) {
          serviceWhere.upperPrice = { lte: max_price };
        }

        if (tags) {
          serviceWhere.tags = {
            hasSome: tags.split(",").map((tag) => tag.trim()),
          };
        }

        if (Object.keys(serviceWhere).length > 0) {
          includeClause.organization.include.services.where = serviceWhere;
        }
      }

      // Configuration du tri
      let orderBy: any = { createdAt: "desc" }; // Par défaut: plus récents

      if (sort_by) {
        switch (sort_by) {
          case "name_asc":
            orderBy = [{ firstName: "asc" }, { lastName: "asc" }];
            break;
          case "name_desc":
            orderBy = [{ firstName: "desc" }, { lastName: "desc" }];
            break;
          case "organization":
            orderBy = { organization: { name: "asc" } };
            break;
          case "newest":
            orderBy = { createdAt: "desc" };
            break;
          case "oldest":
            orderBy = { createdAt: "asc" };
            break;
          case "verified_first":
            orderBy = [{ emailVerified: "desc" }, { createdAt: "desc" }];
            break;
          default:
            orderBy = { createdAt: "desc" };
        }
      }

      const prestataires = await prisma.user.findMany({
        where: whereClause,
        include: includeClause,
        take: limit || 15, // Limite configurable (15 par défaut)
        orderBy: orderBy,
      });

      if (prestataires.length === 0) {
        const appliedFilters = [];
        if (query) appliedFilters.push(`Recherche: "${query}"`);
        if (sector) appliedFilters.push(`Secteur: ${sector}`);
        if (location) appliedFilters.push(`Lieu: ${location}`);
        if (verified_only) appliedFilters.push(`Comptes vérifiés uniquement`);
        if (has_organization !== undefined)
          appliedFilters.push(
            `Avec organisation: ${has_organization ? "Oui" : "Non"}`
          );
        if (service_type)
          appliedFilters.push(`Type de service: ${service_type}`);
        if (min_price || max_price)
          appliedFilters.push(
            `Prix: ${min_price || "0"}€ - ${max_price || "∞"}€`
          );

        return `# 👥 Recherche de Prestataires

## ❌ Aucun Résultat
Aucun prestataire trouvé avec ces critères${
          appliedFilters.length > 0 ? ":" : "."
        }

${
  appliedFilters.length > 0
    ? `**Filtres appliqués :**
${appliedFilters.map((f) => `• ${f}`).join("\n")}`
    : ""
}

## 💡 Suggestions
• Élargir les critères de recherche
• Essayer d'autres secteurs d'activité
• Rechercher dans une zone géographique plus large
• Retirer certains filtres pour plus de résultats`;
      }

      // Statistiques
      const stats = {
        total: prestataires.length,
        withOrganization: prestataires.filter((p) => p.organization).length,
        verified: prestataires.filter((p) => p.emailVerified).length,
        sectors: [
          ...new Set(
            prestataires.map((p) => p.organization?.sector).filter(Boolean)
          ),
        ],
        totalServices: prestataires.reduce(
          (sum, p) => sum + (p.organization?.services?.length || 0),
          0
        ),
      };

      let response = `# 👥 Prestataires Trouvés

## 📊 Résultats (${stats.total} prestataires)

J'ai trouvé **${stats.total} prestataires** correspondant à votre recherche !

## 📈 Aperçu des résultats
**🏢 Avec organisation :** ${stats.withOrganization}/${stats.total}  
**✅ Comptes vérifiés :** ${stats.verified}/${stats.total}  
**🎯 Services proposés :** ${stats.totalServices}  
**📍 Secteurs :** ${stats.sectors.join(", ") || "Aucun"}

## 👤 Prestataires détaillés

Explorez les prestataires ci-dessous pour découvrir leurs profils et services :

---
**MÉTADONNÉES_PRESTATAIRES:** ${JSON.stringify({
        prestataires: prestataires.map((prestataire) => {
          const fullName = [prestataire.firstName, prestataire.lastName]
            .filter(Boolean)
            .join(" ");

          return {
            id: prestataire.id,
            name: fullName || prestataire.email.split("@")[0],
            firstName: prestataire.firstName,
            lastName: prestataire.lastName,
            email: prestataire.email,
            phone: prestataire.phone,
            emailVerified: prestataire.emailVerified,
            createdAt: prestataire.createdAt,
            organization: prestataire.organization
              ? {
                  id: prestataire.organization.id,
                  name: prestataire.organization.name,
                  sector: prestataire.organization.sector,
                  description: prestataire.organization.description,
                  address: prestataire.organization.address,
                  phone: prestataire.organization.phone,
                  email: prestataire.organization.email,
                  website: prestataire.organization.website,
                  legalForm: prestataire.organization.legalForm,
                  siret: prestataire.organization.siret,
                  services:
                    prestataire.organization.services?.map((service) => ({
                      id: service.id,
                      title: service.title,
                      summary: service.summary,
                      serviceType: service.serviceType,
                      lowerPrice: service.lowerPrice,
                      upperPrice: service.upperPrice,
                      paymentMode: service.paymentMode,
                      tags: service.tags,
                    })) || [],
                  servicesCount: prestataire.organization.services?.length || 0,
                }
              : null,
            pageUrl: `/prestataires/${prestataire.id}`,
            searchQuery: query || "prestataires",
            searchDate: new Date().toISOString(),
          };
        }),
        searchStats: {
          totalResults: stats.total,
          withOrganization: stats.withOrganization,
          verified: stats.verified,
          totalServices: stats.totalServices,
          sectorsFound: stats.sectors,
        },
      })}`;

      return response;
    } catch (error) {
      console.error("Erreur recherche prestataires:", error);
      return `# ❌ Erreur
Impossible de rechercher les prestataires. Veuillez réessayer plus tard.

**Détails de l'erreur :** ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`;
    }
  },
  {
    name: "prestataire_search",
    description:
      "Recherche avancée de prestataires avec critères multiples : nom, secteur, localisation, services, prix, etc.",
    schema: z.object({
      query: z
        .string()
        .optional()
        .describe("Terme de recherche général (nom, email, organisation)"),
      sector: z
        .string()
        .optional()
        .describe("Secteur d'activité (cuisine, marketing, technologie, etc.)"),
      location: z.string().optional().describe("Zone géographique ou ville"),
      has_organization: z
        .boolean()
        .optional()
        .describe("Filtrer les prestataires avec/sans organisation"),
      verified_only: z
        .boolean()
        .optional()
        .describe("Rechercher uniquement les comptes vérifiés"),
      with_services: z
        .boolean()
        .optional()
        .describe("Inclure les services proposés par les prestataires"),
      service_type: z
        .enum(["IRL", "ONLINE", "MIXED"])
        .optional()
        .describe("Type de service proposé"),
      min_price: z
        .number()
        .optional()
        .describe("Prix minimum des services (en euros)"),
      max_price: z
        .number()
        .optional()
        .describe("Prix maximum des services (en euros)"),
      tags: z
        .string()
        .optional()
        .describe("Tags de services recherchés (séparés par des virgules)"),
      legal_form: z
        .string()
        .optional()
        .describe("Forme juridique de l'organisation (SARL, SAS, etc.)"),
      limit: z
        .number()
        .optional()
        .describe("Nombre maximum de résultats (défaut: 15)"),
      sort_by: z
        .enum([
          "newest",
          "oldest",
          "name_asc",
          "name_desc",
          "organization",
          "verified_first",
        ])
        .optional()
        .describe("Critère de tri des résultats"),
    }),
  }
);
