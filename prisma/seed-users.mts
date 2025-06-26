import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedUsers() {
  console.log("🌱 Création des utilisateurs de test...");

  // Hasher les mots de passe
  const clientPassword = await bcrypt.hash("TestClient123", 12);
  const prestatairePassword = await bcrypt.hash("TestPrestataire123", 12);
  const adminPassword = await bcrypt.hash("AdminTest123", 12);

  // Créer un utilisateur client FREE
  const client = await prisma.user.upsert({
    where: { email: "client@test.fr" },
    update: {},
    create: {
      email: "client@test.fr",
      password: clientPassword,
      firstName: "Jean",
      lastName: "Dupont",
      phone: "06 12 34 56 78",
      role: "CLIENT",
      emailVerified: true,
      subscriptionPlan: "FREE",
      subscriptionStatus: "ACTIVE",
    },
  });

  // Créer un client PREMIUM
  const clientPremium = await prisma.user.upsert({
    where: { email: "client-premium@test.fr" },
    update: {},
    create: {
      email: "client-premium@test.fr",
      password: clientPassword,
      firstName: "Sophie",
      lastName: "Bernard",
      phone: "06 11 22 33 44",
      role: "CLIENT",
      emailVerified: true,
      subscriptionPlan: "PREMIUM",
      subscriptionStatus: "ACTIVE",
      subscriptionStart: new Date(),
      subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
    },
  });

  // Créer un client BUSINESS
  const clientBusiness = await prisma.user.upsert({
    where: { email: "client-business@test.fr" },
    update: {},
    create: {
      email: "client-business@test.fr",
      password: clientPassword,
      firstName: "Pierre",
      lastName: "Leclerc",
      phone: "06 55 66 77 88",
      role: "CLIENT",
      emailVerified: true,
      subscriptionPlan: "BUSINESS",
      subscriptionStatus: "ACTIVE",
      subscriptionStart: new Date(),
      subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
    },
  });

  // Récupérer une organisation existante pour le prestataire
  const firstOrganization = await prisma.organization.findFirst();

  if (firstOrganization) {
    // Créer un utilisateur prestataire lié à une organisation
    const prestataire = await prisma.user.upsert({
      where: { email: "prestataire@test.fr" },
      update: {},
      create: {
        email: "prestataire@test.fr",
        password: prestatairePassword,
        firstName: "Marie",
        lastName: "Martin",
        phone: "06 98 76 54 32",
        role: "PRESTATAIRE",
        emailVerified: true,
        organizationId: firstOrganization.id,
      },
    });

    console.log(
      `✅ Prestataire créé: ${prestataire.email} (lié à ${firstOrganization.name})`
    );
  }

  // Créer un utilisateur admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@lethimcookai.fr" },
    update: {},
    create: {
      email: "admin@lethimcookai.fr",
      password: adminPassword,
      firstName: "Admin",
      lastName: "LetHimCookAI",
      role: "ADMIN",
      emailVerified: true,
    },
  });

  console.log(`✅ Client FREE créé: ${client.email}`);
  console.log(`✅ Client PREMIUM créé: ${clientPremium.email}`);
  console.log(`✅ Client BUSINESS créé: ${clientBusiness.email}`);
  console.log(`✅ Admin créé: ${admin.email}`);

  console.log("\n📝 Comptes de test créés:");
  console.log(
    "👤 Client FREE: client@test.fr / TestClient123 (accès IA Basic seulement)"
  );
  console.log(
    "💎 Client PREMIUM: client-premium@test.fr / TestClient123 (accès IA Basic + Premium)"
  );
  console.log(
    "🚀 Client BUSINESS: client-business@test.fr / TestClient123 (accès toutes les IAs)"
  );
  if (firstOrganization) {
    console.log("🏢 Prestataire: prestataire@test.fr / TestPrestataire123");
  }
  console.log("⚙️  Admin: admin@lethimcookai.fr / AdminTest123");
}

async function main() {
  try {
    await seedUsers();
    console.log("\n🎉 Seed des utilisateurs terminé!");
  } catch (error) {
    console.error("❌ Erreur lors du seed des utilisateurs:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
