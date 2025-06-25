import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const organizationSearch = tool(
  async ({ query, sector, location, has_services }) => {
    try {
      const whereClause: any = {};

      // Filtrage par secteur (cuisine par défaut)
      if (sector) {
        whereClause.sector = {
          contains: sector,
          mode: "insensitive",
        };
      } else {
        // Par défaut, on cherche dans le secteur cuisine
        whereClause.sector = {
          contains: "cuisine",
          mode: "insensitive",
        };
      }

      // Recherche par nom ou description
      if (query) {
        whereClause.OR = [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ];
      }

      // Filtrage par localisation
      if (location) {
        whereClause.address = {
          contains: location,
          mode: "insensitive",
        };
      }

      // Inclure services si demandé
      const include = has_services
        ? {
            services: {
              take: 3, // Limite à 3 services par organisation
              select: {
                id: true,
                title: true,
                summary: true,
                serviceType: true,
                lowerPrice: true,
                upperPrice: true,
                paymentMode: true,
                tags: true,
              },
            },
          }
        : undefined;

      const organizations = await prisma.organization.findMany({
        where: whereClause,
        include,
        take: 10, // Limite à 10 résultats
        orderBy: { createdAt: "desc" },
      });

      if (organizations.length === 0) {
        return `# 🔍 Recherche d'Organisations

## ❌ Aucun Résultat
Aucune organisation trouvée pour "${query || "cuisine"}" ${
          location ? `dans la zone "${location}"` : ""
        }.

## 💡 Suggestions
• Élargir la zone géographique
• Essayer des mots-clés différents
• Chercher dans d'autres secteurs`;
      }

      let response = `# 🔍 Organisations Culinaires Trouvées

## 📊 Résultats (${organizations.length} trouvées)

J'ai trouvé **${
        organizations.length
      } organisations** correspondant à votre recherche !

## 🏢 Organisations détaillées

Explorez les organisations ci-dessous pour découvrir leurs services :

---
**MÉTADONNÉES_ORGANISATIONS:** ${JSON.stringify({
        organizations: organizations.map((org) => ({
          id: org.id,
          name: org.name,
          sector: org.sector,
          description: org.description,
          address: org.address,
          phone: org.phone,
          email: org.email,
          website: org.website,
          legalForm: org.legalForm,
          siret: org.siret,
          tvaNume: org.tvaNumber,
          services: org.services
            ? org.services.map((service) => ({
                id: service.id,
                title: service.title,
                summary: service.summary,
                serviceType: service.serviceType,
                price: `${service.lowerPrice}€-${service.upperPrice}€`,
                paymentMode: service.paymentMode,
                tags: service.tags,
              }))
            : [],
          servicesCount: org.services ? org.services.length : 0,
          searchQuery: query || "cuisine",
          searchLocation: location,
          searchSector: sector,
          searchDate: new Date().toISOString(),
        })),
        searchStats: {
          totalResults: organizations.length,
          sectorsFound: [...new Set(organizations.map((org) => org.sector))],
          locationsFound: [
            ...new Set(organizations.map((org) => org.address).filter(Boolean)),
          ],
          totalServices: organizations.reduce(
            (sum, org) => sum + (org.services ? org.services.length : 0),
            0
          ),
        },
      })}`;

      return response;
    } catch (error) {
      console.error("Erreur recherche organisations:", error);
      return `# ❌ Erreur
Impossible de rechercher les organisations culinaires.`;
    }
  },
  {
    name: "organization_search",
    description:
      "Recherche d'organisations culinaires avec liens vers leurs profils détaillés",
    schema: z.object({
      query: z
        .string()
        .optional()
        .describe("Terme de recherche (nom, spécialité, etc.)"),
      sector: z
        .string()
        .optional()
        .describe("Secteur d'activité (cuisine, restauration, etc.)"),
      location: z.string().optional().describe("Zone géographique recherchée"),
      has_services: z
        .boolean()
        .optional()
        .describe("Inclure les services proposés"),
    }),
  }
);
