import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const serviceSearch = tool(
  async ({
    query,
    service_type,
    min_price,
    max_price,
    payment_mode,
    tags,
    billing_plan,
  }) => {
    try {
      const whereClause: any = {};

      // Recherche par titre ou description
      if (query) {
        whereClause.OR = [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { summary: { contains: query, mode: "insensitive" } },
        ];
      }

      // Filtrage par type de service
      if (service_type) {
        whereClause.serviceType = service_type;
      }

      // Filtrage par prix
      if (min_price !== undefined) {
        whereClause.lowerPrice = { gte: min_price };
      }
      if (max_price !== undefined) {
        whereClause.upperPrice = { lte: max_price };
      }

      // Filtrage par mode de paiement
      if (payment_mode) {
        whereClause.paymentMode = payment_mode;
      }

      // Filtrage par tags
      if (tags) {
        whereClause.tags = {
          hasSome: tags.split(",").map((tag) => tag.trim()),
        };
      }

      // Filtrage par plan de facturation
      if (billing_plan) {
        whereClause.billingPlan = billing_plan;
      }

      const services = await prisma.service.findMany({
        where: whereClause,
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              sector: true,
              address: true,
              phone: true,
              email: true,
              website: true,
            },
          },
        },
        take: 15, // Limite à 15 résultats
        orderBy: { createdAt: "desc" },
      });

      if (services.length === 0) {
        return `# 🛎️ Recherche de Services

## ❌ Aucun Résultat
Aucun service trouvé pour "${query || "services culinaires"}" avec ces critères.

## 💡 Suggestions
• Élargir la fourchette de prix
• Essayer des mots-clés différents
• Modifier les filtres de type de service`;
      }

      let response = `# 🛎️ Services Culinaires Trouvés

## 📊 Résultats (${services.length} trouvés)

J'ai trouvé **${services.length} services** correspondant à votre recherche !
`;

      // Statistiques des résultats
      const avgPrice =
        services.reduce(
          (sum, s) => sum + (s.lowerPrice + s.upperPrice) / 2,
          0
        ) / services.length;
      const serviceTypes = [...new Set(services.map((s) => s.serviceType))];
      const aiReplaceableCount = services.filter(
        (s) => s.isAIReplaceable
      ).length;

      response += `
## 📈 Aperçu des résultats
**💰 Prix moyen :** ${avgPrice.toFixed(0)}€  
**📊 Types :** ${serviceTypes.join(", ")}  
**🤖 Services IA-remplaçables :** ${aiReplaceableCount}/${services.length}

## 🔗 Services détaillés

Cliquez sur les cartes ci-dessous pour voir le détail de chaque service :

---
**MÉTADONNÉES_SERVICES:** ${JSON.stringify({
        services: services.map((service) => ({
          id: service.id,
          title: service.title,
          summary: service.summary || service.description,
          price: `${service.lowerPrice}€ - ${service.upperPrice}€`,
          priceMode: service.paymentMode,
          serviceType: service.serviceType,
          billingPlan: service.billingPlan,
          tags: service.tags,
          organizationName: service.organization.name,
          organizationSector: service.organization.sector,
          organizationAddress: service.organization.address,
          organizationPhone: service.organization.phone,
          organizationEmail: service.organization.email,
          organizationWebsite: service.organization.website,
          isAIReplaceable: service.isAIReplaceable,
          consumptionType: service.consumptionType,
          pageUrl: `/services/${service.id}`,
          searchQuery: query || "services culinaires",
          searchDate: new Date().toISOString(),
        })),
        searchStats: {
          totalResults: services.length,
          averagePrice: Math.round(avgPrice),
          serviceTypes: serviceTypes,
          aiReplaceableCount: aiReplaceableCount,
        },
      })}`;

      return response;
    } catch (error) {
      console.error("Erreur recherche services:", error);
      return `# ❌ Erreur
Impossible de rechercher les services culinaires.`;
    }
  },
  {
    name: "service_search",
    description:
      "Recherche de services culinaires avec liens vers les pages détaillées",
    schema: z.object({
      query: z
        .string()
        .optional()
        .describe("Terme de recherche (nom du service, description)"),
      service_type: z
        .enum(["IRL", "ONLINE", "MIXED"])
        .optional()
        .describe("Type de service"),
      min_price: z.number().optional().describe("Prix minimum"),
      max_price: z.number().optional().describe("Prix maximum"),
      payment_mode: z
        .enum(["CREDIT", "EUR", "USD", "GBP", "CRYPTO"])
        .optional()
        .describe("Mode de paiement"),
      tags: z
        .string()
        .optional()
        .describe("Tags recherchés (séparés par virgules)"),
      billing_plan: z
        .enum(["UNIT", "USAGE", "MINUTE", "MENSUAL", "ANNUAL", "PROJECT"])
        .optional()
        .describe("Plan de facturation"),
    }),
  }
);
