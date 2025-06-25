import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
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
      },
      {
        title: "Photographe culinaire",
        description:
          "Shooting professionnel pour menus, réseaux sociaux, campagnes print.",
        tags: ["photo", "gastronomie", "branding", "contenu"],
        priceMin: 300,
        priceMax: 700,
        isAIReplaceable: false,
      },
      {
        title: "Stratégie marketing food",
        description:
          "Consultant en stratégie digitale food, tunnel de conversion et visibilité.",
        tags: ["marketing", "Instagram", "branding", "food"],
        priceMin: 400,
        priceMax: 900,
        isAIReplaceable: true,
      },
    ],
  });

  console.log("✅ Prestataires mockés avec succès");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
