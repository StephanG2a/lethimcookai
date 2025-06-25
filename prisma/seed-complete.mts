import {
  PrismaClient,
  ServiceType,
  ConsumptionType,
  BillingPlan,
  PaymentMode,
} from "@prisma/client";
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

  // Créer les services avec tous les nouveaux champs
  await prisma.service.createMany({
    data: [
      {
        title: "Création de site vitrine pour restaurant",
        summary: "Site web moderne et responsive pour votre restaurant",
        description:
          "Développeur spécialisé en gastronomie. Site moderne, responsive, optimisé SEO avec réservation en ligne et menu interactif.",
        mainMedia: "https://example.com/banner-web-restaurant.jpg",
        serviceType: ServiceType.ONLINE,
        consumptionType: ConsumptionType.PRESTATION,
        billingPlan: BillingPlan.PROJECT,
        lowerPrice: 500,
        upperPrice: 1000,
        paymentMode: PaymentMode.EUR,
        tags: [
          "site web",
          "restaurant",
          "Next.js",
          "SEO",
          "réservation",
          "menu",
        ],
        isAIReplaceable: true,
        organizationId: organizations[0].id,
      },
      {
        title: "Photographe culinaire professionnel",
        summary: "Shooting photo de vos plats et établissement",
        description:
          "Shooting professionnel pour menus, réseaux sociaux, campagnes print. Retouche incluse et livraison sous 48h.",
        mainMedia: "https://example.com/banner-photo-culinaire.jpg",
        serviceType: ServiceType.IRL,
        consumptionType: ConsumptionType.INSTANT,
        billingPlan: BillingPlan.UNIT,
        lowerPrice: 300,
        upperPrice: 700,
        paymentMode: PaymentMode.EUR,
        tags: [
          "photo",
          "gastronomie",
          "branding",
          "contenu",
          "shooting",
          "retouche",
        ],
        isAIReplaceable: false,
        organizationId: organizations[1].id,
      },
      {
        title: "Stratégie marketing food",
        summary: "Consultant en marketing digital spécialisé food",
        description:
          "Consultant en stratégie digitale food, tunnel de conversion et visibilité. Accompagnement sur 3 mois minimum.",
        mainMedia: "https://example.com/banner-marketing-food.jpg",
        serviceType: ServiceType.MIXED,
        consumptionType: ConsumptionType.PERIODIC,
        billingPlan: BillingPlan.MENSUAL,
        lowerPrice: 400,
        upperPrice: 900,
        paymentMode: PaymentMode.EUR,
        tags: [
          "marketing",
          "Instagram",
          "branding",
          "food",
          "stratégie",
          "conversion",
        ],
        isAIReplaceable: true,
        organizationId: organizations[2].id,
      },
      {
        title: "Service de livraison culinaire",
        summary: "Livraison de repas gastronomiques à domicile",
        description:
          "Service de livraison de repas préparés par des chefs. Commande en ligne, livraison en 30min.",
        mainMedia: "https://example.com/banner-livraison.jpg",
        serviceType: ServiceType.IRL,
        consumptionType: ConsumptionType.INSTANT,
        billingPlan: BillingPlan.UNIT,
        lowerPrice: 15,
        upperPrice: 45,
        paymentMode: PaymentMode.EUR,
        tags: ["livraison", "repas", "chef", "rapide", "gastronomie"],
        isAIReplaceable: false,
        organizationId: organizations[0].id,
      },
      {
        title: "Formation culinaire en ligne",
        summary: "Cours de cuisine en ligne avec chef étoilé",
        description:
          "Formation culinaire en ligne avec accès illimité aux vidéos, recettes et support communautaire.",
        mainMedia: "https://example.com/banner-formation.jpg",
        serviceType: ServiceType.ONLINE,
        consumptionType: ConsumptionType.PERIODIC,
        billingPlan: BillingPlan.MENSUAL,
        lowerPrice: 29,
        upperPrice: 99,
        paymentMode: PaymentMode.EUR,
        tags: [
          "formation",
          "cuisine",
          "chef",
          "en ligne",
          "recettes",
          "communauté",
        ],
        isAIReplaceable: false,
        organizationId: organizations[1].id,
      },
    ],
  });

  console.log("✅ Organisations et services complets créés avec succès");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
