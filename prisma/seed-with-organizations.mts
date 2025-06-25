import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Créer les organisations d'abord
  const organizations = await Promise.all([
    prisma.organization.create({
      data: {
        name: "Gastro Dev Studio",
        description:
          "Agence spécialisée dans le développement web pour le secteur de la restauration",
        logo: "https://example.com/logo1.png",
        website: "https://gastrodev.fr",
        email: "contact@gastrodev.fr",
        phone: "+33 1 23 45 67 89",
        address: "123 Rue de la Gastronomie, 75001 Paris",
        sector: "cuisine",
        siret: "12345678901234",
        tva: "FR12345678901",
        legalForm: "SARL",
      },
    }),

    prisma.organization.create({
      data: {
        name: "PhotoFood Pro",
        description: "Studio de photographie culinaire professionnel",
        logo: "https://example.com/logo2.png",
        website: "https://photofood.fr",
        email: "hello@photofood.fr",
        phone: "+33 6 98 76 54 32",
        address: "456 Avenue des Arts, 69002 Lyon",
        sector: "cuisine",
        siret: "98765432109876",
        tva: "FR98765432109",
        legalForm: "SAS",
      },
    }),

    prisma.organization.create({
      data: {
        name: "FoodMarketing Agency",
        description:
          "Agence de marketing digital spécialisée dans l'industrie alimentaire",
        logo: "https://example.com/logo3.png",
        website: "https://foodmarketing.fr",
        email: "info@foodmarketing.fr",
        phone: "+33 4 56 78 90 12",
        address: "789 Boulevard du Marketing, 13001 Marseille",
        sector: "marketing",
        siret: "11223344556677",
        tva: "FR11223344556",
        legalForm: "SAS",
      },
    }),
  ]);

  // Créer les services liés aux organisations
  await prisma.service.createMany({
    data: [
      {
        title: "Création de site vitrine pour restaurant",
        description:
          "Développeur spécialisé en gastronomie. Site moderne, responsive, optimisé SEO.",
        tags: ["site web", "restaurant", "Next.js", "SEO"],
        priceMin: 500,
        priceMax: 1000,
        isAIReplaceable: true,
        organizationId: organizations[0].id,
      },
      {
        title: "Photographe culinaire",
        description:
          "Shooting professionnel pour menus, réseaux sociaux, campagnes print.",
        tags: ["photo", "gastronomie", "branding", "contenu"],
        priceMin: 300,
        priceMax: 700,
        isAIReplaceable: false,
        organizationId: organizations[1].id,
      },
      {
        title: "Stratégie marketing food",
        description:
          "Consultant en stratégie digitale food, tunnel de conversion et visibilité.",
        tags: ["marketing", "Instagram", "branding", "food"],
        priceMin: 400,
        priceMax: 900,
        isAIReplaceable: true,
        organizationId: organizations[2].id,
      },
    ],
  });

  console.log("✅ Organisations et prestataires créés avec succès");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
