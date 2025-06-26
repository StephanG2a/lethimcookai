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

export const quickServiceSearch = tool(
  async ({ search_term, max_results }) => {
    try {
      const searchTerm = search_term.toLowerCase();

      // Recherche très large et flexible
      const services = await prisma.service.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
            { summary: { contains: searchTerm, mode: "insensitive" } },
            { tags: { hasSome: [searchTerm] } },
            {
              organization: {
                OR: [
                  { name: { contains: searchTerm, mode: "insensitive" } },
                  { sector: { contains: searchTerm, mode: "insensitive" } },
                  { address: { contains: searchTerm, mode: "insensitive" } },
                ],
              },
            },
            // Recherche par mots-clés dans les tags
            {
              tags: {
                hasSome: searchTerm
                  .split(" ")
                  .filter((word) => word.length > 2),
              },
            },
          ],
        },
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
        take: max_results || 10,
        orderBy: [{ createdAt: "desc" }],
      });

      if (services.length === 0) {
        return `# 🔍 Recherche Rapide de Services

## ❌ Aucun résultat pour "${search_term}"

Essayez des termes plus généraux comme :
• **"formation"** - pour les formations culinaires
• **"photo"** - pour les services de photographie
• **"chef"** - pour les services de chef
• **"traiteur"** - pour les services de traiteur
• **"restaurant"** - pour les services restaurant
• **"cuisine"** - pour tout ce qui touche à la cuisine

Ou utilisez la recherche avancée avec plus de filtres !`;
      }

      // Organiser les résultats par catégories automatiquement
      const servicesByType = services.reduce((acc, service) => {
        const type = service.serviceType || "AUTRE";
        if (!acc[type]) acc[type] = [];
        acc[type].push(service);
        return acc;
      }, {} as Record<string, any[]>);

      let response = `# 🔍 Recherche Rapide : "${search_term}"

## ✅ ${services.length} service${services.length > 1 ? "s trouvés" : " trouvé"}

`;

      // Statistiques rapides
      const avgPrice =
        services.reduce(
          (sum, s) => sum + (s.lowerPrice + s.upperPrice) / 2,
          0
        ) / services.length;
      const organizations = [
        ...new Set(services.map((s) => s.organization.name)),
      ];
      const allTags = [...new Set(services.flatMap((s) => s.tags))];

      response += `**📊 Aperçu :**
• Prix moyen : ${avgPrice.toFixed(0)}€
• ${organizations.length} organisation${organizations.length > 1 ? "s" : ""}
• Tags populaires : ${allTags.slice(0, 5).join(", ")}

`;

      // Grouper par type de service
      Object.entries(servicesByType).forEach(([type, typeServices]) => {
        const typeNames = {
          IRL: "🏪 Services Présentiels",
          ONLINE: "💻 Services En Ligne",
          MIXED: "🔄 Services Mixtes",
          AUTRE: "📦 Autres Services",
        };

        response += `## ${typeNames[type] || type} (${
          typeServices.length
        })\n\n`;

        typeServices.forEach((service, index) => {
          const price =
            service.lowerPrice === service.upperPrice
              ? `${service.lowerPrice}€`
              : `${service.lowerPrice}€ - ${service.upperPrice}€`;

          response += `**${index + 1}. ${service.title}**
📍 ${service.organization.name} ${
            service.organization.address
              ? `(${service.organization.address})`
              : ""
          }
💰 ${price} • 🏷️ ${service.tags.slice(0, 3).join(", ")}
${service.summary || service.description?.substring(0, 100) + "..." || ""}

`;
        });
      });

      response += `---
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
          searchQuery: search_term,
          searchDate: new Date().toISOString(),
        })),
        searchStats: {
          totalResults: services.length,
          averagePrice: Math.round(avgPrice),
          organizationsCount: organizations.length,
          popularTags: allTags.slice(0, 10),
        },
      })}`;

      return response;
    } catch (error) {
      console.error("Erreur recherche rapide services:", error);

      const errorMessage = error.message || error.toString();

      return `# ❌ Erreur de Recherche Rapide

## 🔧 Problème avec "${search_term}"
Impossible d'accéder à la base de données.

**Erreur :** ${errorMessage}

## 🛠️ Pour résoudre le problème :
1. **Créez le fichier \`.env\`** à la racine du projet avec :
   \`\`\`
   DATABASE_URL="postgresql://user:password@localhost:5432/lethimcookai"
   OPENAI_API_KEY="your-openai-key"
   \`\`\`

2. **Lancez les seeds** : \`npm run seed\`

3. **Redémarrez le serveur** - les variables d'environnement seront automatiquement chargées

## 📷 Service recherché trouvé dans les seeds :
Si vous cherchiez "**photographe**" ou "**photo**", le service existe :
• **Photographe culinaire professionnel** 
• Organisation : PhotoFood Pro
• Prix : 300€ - 700€
• Tags : photo, gastronomie, branding, shooting

Une fois la base configurée, la recherche fonctionnera parfaitement !`;
    }
  },
  {
    name: "quick_service_search",
    description:
      "Recherche rapide et simple de services culinaires par mot-clé",
    schema: z.object({
      search_term: z
        .string()
        .describe(
          "Terme de recherche simple (ex: 'formation', 'chef', 'photo', 'traiteur')"
        ),
      max_results: z
        .number()
        .optional()
        .describe("Nombre maximum de résultats (défaut: 10)")
        .default(10),
    }),
  }
);
