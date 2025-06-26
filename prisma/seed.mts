import {
  PrismaClient,
  ServiceType,
  ConsumptionType,
  BillingPlan,
  PaymentMode,
  UserRole,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Charger les variables d'environnement depuis .env.local
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seed complet unifié...");

  // Nettoyer les données existantes
  await prisma.serviceExecution.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  console.log("🧹 Données existantes supprimées");

  // Organisations data
  const organizationsData = [
    {
      name: "Gastro Dev Studio",
      description:
        "Agence spécialisée dans le développement web pour le secteur de la restauration",
      website: "https://gastrodev.fr",
      email: "contact@gastrodev.fr",
      phone: "+33 1 23 45 67 89",
      address: "123 Rue de la Gastronomie, 75001 Paris",
      sector: "cuisine gastronomique",
      siret: "12345678901234",
      tva: "FR12345678901",
      legalForm: "SARL",
    },
    {
      name: "PhotoFood Pro",
      description: "Studio de photographie culinaire professionnel",
      website: "https://photofood.fr",
      email: "hello@photofood.fr",
      phone: "+33 6 98 76 54 32",
      address: "456 Avenue des Arts, 69002 Lyon",
      sector: "boulangerie & pâtisserie",
      siret: "98765432109876",
      tva: "FR98765432109",
      legalForm: "SAS",
    },
    {
      name: "FoodMarketing Agency",
      description:
        "Agence de marketing digital spécialisée dans l'industrie alimentaire",
      website: "https://foodmarketing.fr",
      email: "info@foodmarketing.fr",
      phone: "+33 4 56 78 90 12",
      address: "789 Boulevard du Marketing, 13001 Marseille",
      sector: "food truck & street food",
      siret: "11223344556677",
      tva: "FR11223344556",
      legalForm: "SAS",
    },
    {
      name: "Chef & Co Conseil",
      description: "Cabinet de conseil en stratégie culinaire pour restaurants",
      website: "https://chefco-conseil.fr",
      email: "contact@chefco-conseil.fr",
      phone: "+33 1 45 67 89 01",
      address: "321 Rue du Conseil, 75008 Paris",
      sector: "traiteur & événementiel",
      siret: "13579024681357",
      tva: "FR13579024681",
      legalForm: "SARL",
    },
    {
      name: "Livraison Gourmet Express",
      description: "Service de livraison de plats gastronomiques à domicile",
      website: "https://gourmet-express.fr",
      email: "service@gourmet-express.fr",
      phone: "+33 9 87 65 43 21",
      address: "654 Avenue de la Livraison, 69003 Lyon",
      sector: "livraison & restauration rapide",
      siret: "24681357902468",
      tva: "FR24681357902",
      legalForm: "SAS",
    },
    {
      name: "Formation Culinaire Online",
      description:
        "Plateforme de formation culinaire en ligne avec chefs étoilés",
      website: "https://formation-culinaire.fr",
      email: "formation@culinaire-online.fr",
      phone: "+33 4 12 34 56 78",
      address: "987 Rue de la Formation, 13002 Marseille",
      sector: "formation culinaire",
      siret: "35792468013579",
      tva: "FR35792468013",
      legalForm: "SAS",
    },
    {
      name: "Design Culinaire Studio",
      description:
        "Studio de design graphique spécialisé dans l'univers culinaire",
      website: "https://design-culinaire.fr",
      email: "studio@design-culinaire.fr",
      phone: "+33 2 98 76 54 32",
      address: "147 Rue du Design, 44000 Nantes",
      sector: "nutrition & diététique",
      siret: "46813579024681",
      tva: "FR46813579024",
      legalForm: "SARL",
    },
    {
      name: "TechFood Solutions",
      description: "Solutions technologiques innovantes pour la restauration",
      website: "https://techfood-solutions.fr",
      email: "tech@techfood-solutions.fr",
      phone: "+33 5 12 34 56 78",
      address: "258 Avenue de la Tech, 31000 Toulouse",
      sector: "équipement culinaire",
      siret: "57902468135790",
      tva: "FR57902468135",
      legalForm: "SAS",
    },
    {
      name: "Comm Food Agency",
      description:
        "Agence de communication spécialisée dans l'industrie alimentaire",
      website: "https://commfood-agency.fr",
      email: "agence@commfood-agency.fr",
      phone: "+33 3 87 65 43 21",
      address: "369 Boulevard de la Communication, 67000 Strasbourg",
      sector: "vins & spiritueux",
      siret: "68024681357902",
      tva: "FR68024681357",
      legalForm: "SARL",
    },
    {
      name: "FinFood Consulting",
      description:
        "Cabinet de conseil financier pour entreprises de restauration",
      website: "https://finfood-consulting.fr",
      email: "conseil@finfood-consulting.fr",
      phone: "+33 1 76 54 32 10",
      address: "741 Rue de la Finance, 75009 Paris",
      sector: "cuisine du monde",
      siret: "79135792468024",
      tva: "FR79135792468",
      legalForm: "SAS",
    },
  ];

  // Créer les organisations
  console.log("🏢 Création des organisations...");
  const organizations = [];
  for (const orgData of organizationsData) {
    const org = await prisma.organization.create({ data: orgData });
    organizations.push(org);
  }

  // Créer des clients avec différents plans d'abonnement
  console.log("👤 Création des clients avec différents plans...");

  // Utilisateurs FREE
  const clientPassword = await bcrypt.hash("Client123", 12);

  const clientsData = [
    {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@email.fr",
      phone: "06 12 34 56 78",
      subscriptionPlan: SubscriptionPlan.FREE,
    },
    {
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@email.fr",
      phone: "06 87 65 43 21",
      subscriptionPlan: SubscriptionPlan.FREE,
    },
    {
      firstName: "Pierre",
      lastName: "Durand",
      email: "pierre.durand@email.fr",
      phone: "06 23 45 67 89",
      subscriptionPlan: SubscriptionPlan.PREMIUM,
      subscriptionStart: new Date(),
      subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
    },
    {
      firstName: "Sophie",
      lastName: "Moreau",
      email: "sophie.moreau@email.fr",
      phone: "06 98 76 54 32",
      subscriptionPlan: SubscriptionPlan.PREMIUM,
      subscriptionStart: new Date(),
      subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
    },
    {
      firstName: "Luc",
      lastName: "Simon",
      email: "luc.simon@email.fr",
      phone: "06 34 56 78 90",
      subscriptionPlan: SubscriptionPlan.BUSINESS,
      subscriptionStart: new Date(),
      subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
    },
    {
      firstName: "Emma",
      lastName: "Bernard",
      email: "emma.bernard@email.fr",
      phone: "06 45 67 89 01",
      subscriptionPlan: SubscriptionPlan.BUSINESS,
      subscriptionStart: new Date(),
      subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
    },
    {
      firstName: "Thomas",
      lastName: "Petit",
      email: "thomas.petit@email.fr",
      phone: "06 56 78 90 12",
      subscriptionPlan: SubscriptionPlan.FREE,
    },
    {
      firstName: "Clara",
      lastName: "Robert",
      email: "clara.robert@email.fr",
      phone: "06 67 89 01 23",
      subscriptionPlan: SubscriptionPlan.PREMIUM,
      subscriptionStart: new Date(),
      subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
    },
    {
      firstName: "Hugo",
      lastName: "Richard",
      email: "hugo.richard@email.fr",
      phone: "06 78 90 12 34",
      subscriptionPlan: SubscriptionPlan.BUSINESS,
      subscriptionStart: new Date(),
      subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
    },
    {
      firstName: "Léa",
      lastName: "Dubois",
      email: "lea.dubois@email.fr",
      phone: "06 89 01 23 45",
      subscriptionPlan: SubscriptionPlan.FREE,
    },
  ];

  for (let i = 0; i < clientsData.length; i++) {
    const clientData = clientsData[i];
    await prisma.user.create({
      data: {
        ...clientData,
        password: clientPassword,
        role: UserRole.CLIENT,
        emailVerified: true,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
      },
    });
  }

  // Créer des comptes de test spécifiques pour chaque plan
  console.log("🔑 Création des comptes de test...");

  // Client FREE
  await prisma.user.create({
    data: {
      email: "client@test.fr",
      password: await bcrypt.hash("TestClient123", 12),
      firstName: "Jean",
      lastName: "Dupont",
      phone: "06 12 34 56 78",
      role: UserRole.CLIENT,
      emailVerified: true,
      subscriptionPlan: SubscriptionPlan.FREE,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
    },
  });

  // Client PREMIUM
  await prisma.user.create({
    data: {
      email: "client-premium@test.fr",
      password: await bcrypt.hash("TestClient123", 12),
      firstName: "Sophie",
      lastName: "Bernard",
      phone: "06 11 22 33 44",
      role: UserRole.CLIENT,
      emailVerified: true,
      subscriptionPlan: SubscriptionPlan.PREMIUM,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      subscriptionStart: new Date(),
      subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
    },
  });

  // Client BUSINESS
  await prisma.user.create({
    data: {
      email: "client-business@test.fr",
      password: await bcrypt.hash("TestClient123", 12),
      firstName: "Pierre",
      lastName: "Leclerc",
      phone: "06 55 66 77 88",
      role: UserRole.CLIENT,
      emailVerified: true,
      subscriptionPlan: SubscriptionPlan.BUSINESS,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      subscriptionStart: new Date(),
      subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
    },
  });

  // Créer 10 prestataires avec leurs organisations
  console.log("🏢 Création des prestataires...");
  const prestatairesData = [
    {
      firstName: "François",
      lastName: "Leclerc",
      email: "francois.leclerc@gastrodev.fr",
      phone: "06 12 13 14 15",
    },
    {
      firstName: "Amélie",
      lastName: "Rousseau",
      email: "amelie.rousseau@photofood.fr",
      phone: "06 16 17 18 19",
    },
    {
      firstName: "Nicolas",
      lastName: "Garnier",
      email: "nicolas.garnier@foodmarketing.fr",
      phone: "06 20 21 22 23",
    },
    {
      firstName: "Camille",
      lastName: "Faure",
      email: "camille.faure@chefco-conseil.fr",
      phone: "06 24 25 26 27",
    },
    {
      firstName: "Julien",
      lastName: "Girard",
      email: "julien.girard@gourmet-express.fr",
      phone: "06 28 29 30 31",
    },
    {
      firstName: "Manon",
      lastName: "André",
      email: "manon.andre@formation-culinaire.fr",
      phone: "06 32 33 34 35",
    },
    {
      firstName: "Maxime",
      lastName: "Lefebvre",
      email: "maxime.lefebvre@design-culinaire.fr",
      phone: "06 36 37 38 39",
    },
    {
      firstName: "Julie",
      lastName: "Lambert",
      email: "julie.lambert@techfood-solutions.fr",
      phone: "06 40 41 42 43",
    },
    {
      firstName: "Alexandre",
      lastName: "Roux",
      email: "alexandre.roux@commfood-agency.fr",
      phone: "06 44 45 46 47",
    },
    {
      firstName: "Céline",
      lastName: "Vincent",
      email: "celine.vincent@finfood-consulting.fr",
      phone: "06 48 49 50 51",
    },
  ];

  const prestatairePassword = await bcrypt.hash("Prestataire123", 12);
  for (let i = 0; i < prestatairesData.length; i++) {
    const prestataireData = prestatairesData[i];
    await prisma.user.create({
      data: {
        ...prestataireData,
        password: prestatairePassword,
        role: UserRole.PRESTATAIRE,
        emailVerified: true,
        organizationId: organizations[i].id,
        subscriptionPlan: SubscriptionPlan.FREE,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
      },
    });
  }

  // Créer un prestataire de test
  await prisma.user.create({
    data: {
      email: "prestataire@test.fr",
      password: await bcrypt.hash("TestPrestataire123", 12),
      firstName: "Marie",
      lastName: "Martin",
      phone: "06 98 76 54 32",
      role: UserRole.PRESTATAIRE,
      emailVerified: true,
      organizationId: organizations[0].id,
      subscriptionPlan: SubscriptionPlan.FREE,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
    },
  });

  // Créer un admin
  console.log("⚙️ Création de l'admin...");
  const adminPassword = await bcrypt.hash("Admin123", 12);
  await prisma.user.create({
    data: {
      email: "admin@lethimcookai.fr",
      password: adminPassword,
      firstName: "Admin",
      lastName: "LetHimCookAI",
      role: UserRole.ADMIN,
      emailVerified: true,
      subscriptionPlan: SubscriptionPlan.BUSINESS,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
    },
  });

  // Créer des services variés pour chaque organisation
  console.log("⚙️ Création des services...");
  const servicesData = [
    // Services pour Gastro Dev Studio
    {
      title: "Création de site vitrine pour restaurant",
      summary: "Site web moderne et responsive pour votre restaurant",
      description:
        "Développement complet d'un site vitrine moderne avec réservation en ligne, menu interactif et optimisation SEO.",
      serviceType: ServiceType.ONLINE,
      consumptionType: ConsumptionType.PRESTATION,
      billingPlan: BillingPlan.PROJECT,
      lowerPrice: 500,
      upperPrice: 1000,
      paymentMode: PaymentMode.EUR,
      tags: ["site web", "restaurant", "Next.js", "SEO", "réservation"],
      isAIReplaceable: true,
      organizationId: organizations[0].id,
    },
    {
      title: "Application mobile de commande",
      summary: "App mobile native pour commandes et livraisons",
      description:
        "Développement d'application mobile native iOS/Android pour commandes en ligne et suivi de livraison.",
      serviceType: ServiceType.ONLINE,
      consumptionType: ConsumptionType.PRESTATION,
      billingPlan: BillingPlan.PROJECT,
      lowerPrice: 2000,
      upperPrice: 5000,
      paymentMode: PaymentMode.EUR,
      tags: ["mobile", "app", "commande", "livraison", "React Native"],
      isAIReplaceable: false,
      organizationId: organizations[0].id,
    },
    // Services pour PhotoFood Pro
    {
      title: "Shooting photo culinaire",
      summary: "Photographie professionnelle de vos plats",
      description:
        "Séance photo professionnelle en studio ou dans votre établissement. Retouche incluse et livraison sous 48h.",
      serviceType: ServiceType.IRL,
      consumptionType: ConsumptionType.INSTANT,
      billingPlan: BillingPlan.UNIT,
      lowerPrice: 300,
      upperPrice: 700,
      paymentMode: PaymentMode.EUR,
      tags: ["photo", "gastronomie", "shooting", "retouche", "studio"],
      isAIReplaceable: false,
      organizationId: organizations[1].id,
    },
    {
      title: "Création de contenu visuel",
      summary: "Banques d'images et vidéos pour réseaux sociaux",
      description:
        "Création de contenu visuel adapté aux réseaux sociaux : photos, vidéos courtes, stories Instagram.",
      serviceType: ServiceType.MIXED,
      consumptionType: ConsumptionType.PERIODIC,
      billingPlan: BillingPlan.MENSUAL,
      lowerPrice: 150,
      upperPrice: 400,
      paymentMode: PaymentMode.EUR,
      tags: ["contenu", "réseaux sociaux", "Instagram", "vidéo", "branding"],
      isAIReplaceable: true,
      organizationId: organizations[1].id,
    },
    // Services pour FoodMarketing Agency
    {
      title: "Stratégie marketing digitale",
      summary: "Accompagnement marketing complet pour restaurants",
      description:
        "Élaboration et mise en œuvre d'une stratégie marketing digitale complète : SEO, réseaux sociaux, publicité en ligne.",
      serviceType: ServiceType.MIXED,
      consumptionType: ConsumptionType.PERIODIC,
      billingPlan: BillingPlan.MENSUAL,
      lowerPrice: 800,
      upperPrice: 2000,
      paymentMode: PaymentMode.EUR,
      tags: ["marketing", "SEO", "réseaux sociaux", "publicité", "stratégie"],
      isAIReplaceable: true,
      organizationId: organizations[2].id,
    },
    // Services pour Chef & Co Conseil
    {
      title: "Audit et optimisation de menu",
      summary: "Analyse et optimisation de votre carte",
      description:
        "Audit complet de votre menu avec recommandations pour optimiser la rentabilité et l'attractivité.",
      serviceType: ServiceType.IRL,
      consumptionType: ConsumptionType.PRESTATION,
      billingPlan: BillingPlan.PROJECT,
      lowerPrice: 500,
      upperPrice: 1200,
      paymentMode: PaymentMode.EUR,
      tags: ["conseil", "menu", "audit", "optimisation", "rentabilité"],
      isAIReplaceable: false,
      organizationId: organizations[3].id,
    },
    // Services pour Livraison Gourmet Express
    {
      title: "Service de livraison premium",
      summary: "Livraison de plats gastronomiques en 30min",
      description:
        "Service de livraison express de plats préparés par des chefs. Commande en ligne et livraison en moins de 30 minutes.",
      serviceType: ServiceType.IRL,
      consumptionType: ConsumptionType.INSTANT,
      billingPlan: BillingPlan.UNIT,
      lowerPrice: 15,
      upperPrice: 45,
      paymentMode: PaymentMode.EUR,
      tags: ["livraison", "gourmet", "express", "chef", "commande en ligne"],
      isAIReplaceable: false,
      organizationId: organizations[4].id,
    },
    // Services pour Formation Culinaire Online
    {
      title: "Cours de cuisine en ligne",
      summary: "Formation culinaire avec chefs étoilés",
      description:
        "Accès illimité à notre plateforme de formation avec vidéos HD, recettes détaillées et communauté active.",
      serviceType: ServiceType.ONLINE,
      consumptionType: ConsumptionType.PERIODIC,
      billingPlan: BillingPlan.MENSUAL,
      lowerPrice: 29,
      upperPrice: 99,
      paymentMode: PaymentMode.EUR,
      tags: ["formation", "cuisine", "chef étoilé", "en ligne", "communauté"],
      isAIReplaceable: false,
      organizationId: organizations[5].id,
    },
    // Autres services...
    {
      title: "Design d'identité visuelle",
      summary: "Création de logo et charte graphique",
      description:
        "Conception complète de votre identité visuelle : logo, charte graphique, supports de communication.",
      serviceType: ServiceType.ONLINE,
      consumptionType: ConsumptionType.PRESTATION,
      billingPlan: BillingPlan.PROJECT,
      lowerPrice: 600,
      upperPrice: 1500,
      paymentMode: PaymentMode.EUR,
      tags: ["design", "logo", "identité visuelle", "charte graphique"],
      isAIReplaceable: true,
      organizationId: organizations[6].id,
    },
    {
      title: "Solution de caisse connectée",
      summary: "Système de caisse moderne et connecté",
      description:
        "Installation et configuration d'un système de caisse moderne avec gestion des stocks et analytics.",
      serviceType: ServiceType.IRL,
      consumptionType: ConsumptionType.PRESTATION,
      billingPlan: BillingPlan.PROJECT,
      lowerPrice: 1000,
      upperPrice: 3000,
      paymentMode: PaymentMode.EUR,
      tags: ["technologie", "caisse", "gestion", "stocks", "analytics"],
      isAIReplaceable: false,
      organizationId: organizations[7].id,
    },
  ];

  for (const serviceData of servicesData) {
    await prisma.service.create({ data: serviceData });
  }

  console.log("\n🎉 Seed complet unifié terminé !");
  console.log("📊 Résumé des créations :");
  console.log(`🏢 ${organizations.length} organisations créées`);
  console.log(
    `👤 ${clientsData.length + 3} clients créés (avec différents plans)`
  );
  console.log(`🏢 ${prestatairesData.length + 1} prestataires créés`);
  console.log(`⚙️ 1 admin créé`);
  console.log(`🛠️ ${servicesData.length} services créés`);

  console.log("\n🔑 Comptes de test créés :");
  console.log(
    "👤 Client FREE: client@test.fr / TestClient123 (accès IA Basic seulement)"
  );
  console.log(
    "💎 Client PREMIUM: client-premium@test.fr / TestClient123 (accès IA Basic + Premium)"
  );
  console.log(
    "🚀 Client BUSINESS: client-business@test.fr / TestClient123 (accès toutes les IAs)"
  );
  console.log("🏢 Prestataire: prestataire@test.fr / TestPrestataire123");
  console.log("⚙️ Admin: admin@lethimcookai.fr / Admin123");

  console.log("\n📝 Plans d'abonnement distribués :");
  console.log("🆓 FREE: Plusieurs clients (accès IA Basic)");
  console.log("💎 PREMIUM: Plusieurs clients (accès IA Basic + Premium)");
  console.log("🚀 BUSINESS: Plusieurs clients (accès toutes les IAs)");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
