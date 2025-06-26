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

export const serviceSearch = tool(
  async ({
    query,
    service_type,
    min_price,
    max_price,
    payment_mode,
    tags,
    billing_plan,
    organization_name,
    organization_sector,
    location,
    ai_replaceable,
    consumption_type,
    exclude_tags,
    sort_by,
    limit,
  }) => {
    try {
      const whereClause: any = {};
      const includeClause: any = {
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
      };

      // Recherche étendue par titre, description, summary OU organisation
      if (query) {
        whereClause.OR = [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { summary: { contains: query, mode: "insensitive" } },
          { organization: { name: { contains: query, mode: "insensitive" } } },
          { tags: { hasSome: [query] } },
        ];
      }

      // Recherche spécifique par nom d'organisation
      if (organization_name) {
        whereClause.organization = {
          name: { contains: organization_name, mode: "insensitive" },
        };
      }

      // Recherche par secteur d'organisation
      if (organization_sector) {
        if (!whereClause.organization) whereClause.organization = {};
        whereClause.organization.sector = {
          contains: organization_sector,
          mode: "insensitive",
        };
      }

      // Recherche par localisation (adresse)
      if (location) {
        if (!whereClause.organization) whereClause.organization = {};
        whereClause.organization.address = {
          contains: location,
          mode: "insensitive",
        };
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

      // Filtrage par tags (inclusion)
      if (tags) {
        whereClause.tags = {
          hasSome: tags.split(",").map((tag) => tag.trim()),
        };
      }

      // Filtrage par exclusion de tags
      if (exclude_tags) {
        whereClause.NOT = {
          tags: {
            hasSome: exclude_tags.split(",").map((tag) => tag.trim()),
          },
        };
      }

      // Filtrage par plan de facturation
      if (billing_plan) {
        whereClause.billingPlan = billing_plan;
      }

      // Filtrage par type de consommation
      if (consumption_type) {
        whereClause.consumptionType = consumption_type;
      }

      // Filtrage par remplaçabilité IA
      if (ai_replaceable !== undefined) {
        whereClause.isAIReplaceable = ai_replaceable;
      }

      // Configuration du tri
      let orderBy: any = { createdAt: "desc" }; // Par défaut: plus récents

      if (sort_by) {
        switch (sort_by) {
          case "price_asc":
            orderBy = { lowerPrice: "asc" };
            break;
          case "price_desc":
            orderBy = { upperPrice: "desc" };
            break;
          case "name_asc":
            orderBy = { title: "asc" };
            break;
          case "name_desc":
            orderBy = { title: "desc" };
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
          default:
            orderBy = { createdAt: "desc" };
        }
      }

      const services = await prisma.service.findMany({
        where: whereClause,
        include: includeClause,
        take: limit || 20, // Limite configurable (20 par défaut)
        orderBy: orderBy,
      });

      if (services.length === 0) {
        const appliedFilters = [];
        if (query) appliedFilters.push(`Recherche: "${query}"`);
        if (service_type) appliedFilters.push(`Type: ${service_type}`);
        if (min_price || max_price)
          appliedFilters.push(
            `Prix: ${min_price || "0"}€ - ${max_price || "∞"}€`
          );
        if (tags) appliedFilters.push(`Tags: ${tags}`);
        if (organization_name)
          appliedFilters.push(`Organisation: ${organization_name}`);
        if (location) appliedFilters.push(`Lieu: ${location}`);
        if (ai_replaceable !== undefined)
          appliedFilters.push(
            `IA-remplaçable: ${ai_replaceable ? "Oui" : "Non"}`
          );

        return `# 🛎️ Recherche de Services

## ❌ Aucun Résultat
Aucun service trouvé avec ces critères${appliedFilters.length > 0 ? ":" : "."}

${
  appliedFilters.length > 0
    ? `**Filtres appliqués :**
${appliedFilters.map((f) => `• ${f}`).join("\n")}`
    : ""
}

## 💡 Suggestions
• Élargir la fourchette de prix (min_price/max_price)
• Essayer des mots-clés différents dans query
• Modifier les filtres (service_type, tags, location)
• Rechercher par organisation (organization_name)
• Essayer d'autres secteurs (organization_sector)
• Changer le tri (sort_by)`;
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

      // Message d'erreur plus détaillé pour debug
      const errorMessage = error.message || error.toString();

      return `# ❌ Erreur de Recherche de Services

## 🔧 Problème technique détecté
Impossible d'accéder à la base de données des services.

**Erreur :** ${errorMessage}

## 🛠️ Solutions possibles :
1. **Variable DATABASE_URL** - Créez un fichier \`.env\` à la racine avec :
   \`\`\`
   DATABASE_URL="postgresql://user:password@localhost:5432/lethimcookai"
   \`\`\`
2. **Base de données** - Assurez-vous que PostgreSQL est démarré
3. **Exécutez les seeds** : \`npm run seed\`
4. **Prisma generate** : \`npx prisma generate\`
5. **Redémarrez le serveur** après avoir ajouté les variables d'environnement

## 📋 Services disponibles (selon les seeds) :
• **Photographe culinaire professionnel** (PhotoFood Pro)
• **Formation culinaire en ligne** 
• **Création de site vitrine pour restaurant**
• **Stratégie marketing food**
• **Service de livraison culinaire**

Contactez l'administrateur pour résoudre ce problème technique.`;
    }
  },
  {
    name: "service_search",
    description:
      "Recherche avancée de services culinaires avec filtres étendus et tri personnalisé",
    schema: z.object({
      query: z
        .string()
        .optional()
        .describe(
          "Terme de recherche global (nom du service, description, organisation, tags)"
        ),
      service_type: z
        .enum(["IRL", "ONLINE", "MIXED"])
        .optional()
        .describe("Type de service (présentiel, en ligne, mixte)"),
      min_price: z.number().optional().describe("Prix minimum en euros"),
      max_price: z.number().optional().describe("Prix maximum en euros"),
      payment_mode: z
        .enum(["CREDIT", "EUR", "USD", "GBP", "CRYPTO"])
        .optional()
        .describe("Mode de paiement accepté"),
      tags: z
        .string()
        .optional()
        .describe(
          "Tags à inclure (séparés par virgules) ex: 'cuisine,chef,formation'"
        ),
      exclude_tags: z
        .string()
        .optional()
        .describe("Tags à exclure (séparés par virgules)"),
      billing_plan: z
        .enum(["UNIT", "USAGE", "MINUTE", "MENSUAL", "ANNUAL", "PROJECT"])
        .optional()
        .describe("Plan de facturation"),
      organization_name: z
        .string()
        .optional()
        .describe("Nom spécifique de l'organisation/entreprise"),
      organization_sector: z
        .string()
        .optional()
        .describe("Secteur d'activité de l'organisation"),
      location: z.string().optional().describe("Localisation/ville recherchée"),
      ai_replaceable: z
        .boolean()
        .optional()
        .describe("Filtrer par remplaçabilité IA (true/false)"),
      consumption_type: z
        .string()
        .optional()
        .describe("Type de consommation du service"),
      sort_by: z
        .enum([
          "price_asc",
          "price_desc",
          "name_asc",
          "name_desc",
          "organization",
          "newest",
          "oldest",
        ])
        .optional()
        .describe("Tri des résultats"),
      limit: z
        .number()
        .optional()
        .describe("Nombre maximum de résultats (défaut: 20, max: 50)")
        .default(20),
    }),
  }
);
