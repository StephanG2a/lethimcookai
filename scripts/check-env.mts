import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

// Charger les variables d'environnement (.env.local en priorité)
config({ path: ".env.local" });

console.log("🔍 Vérification de la configuration...\n");

// Vérifier la présence du fichier .env.local
if (!fs.existsSync(".env.local")) {
  console.log("❌ Fichier .env.local manquant!");
  console.log("💡 Copiez le fichier d'exemple : cp .env.example .env.local");
  console.log("📝 Puis éditez .env.local avec vos vraies valeurs\n");
  process.exit(1);
} else {
  console.log("✅ Fichier .env.local trouvé\n");
}

// Variables requises
const requiredVars = {
  OPENAI_API_KEY: "Clé API OpenAI (requis pour tous les agents)",
  DATABASE_URL:
    "URL de la base de données PostgreSQL (requis pour agents Business)",
};

let allGood = true;

// Vérifier les variables d'environnement
console.log("📋 Variables d'environnement:");
for (const [varName, description] of Object.entries(requiredVars)) {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${description}`);
    if (varName === "OPENAI_API_KEY") {
      console.log(`   → Clé commençant par: ${value.substring(0, 7)}...`);
    } else if (varName === "DATABASE_URL") {
      console.log(
        `   → Base: ${value.split("@")[1]?.split("/")[1] || "non détectée"}`
      );
    }
  } else {
    console.log(`❌ ${varName}: MANQUANT - ${description}`);
    allGood = false;
  }
}

console.log();

// Test de connexion à la base de données
if (process.env.DATABASE_URL) {
  console.log("🗄️ Test de connexion à la base de données...");
  try {
    const prisma = new PrismaClient();

    // Test de connexion simple
    const orgCount = await prisma.organization.count();
    const serviceCount = await prisma.service.count();

    console.log(`✅ Base de données accessible`);
    console.log(`   → ${orgCount} organisations`);
    console.log(`   → ${serviceCount} services`);

    await prisma.$disconnect();
  } catch (error) {
    console.log(`❌ Impossible de se connecter à la base:`);
    console.log(`   → ${error.message}`);
    allGood = false;
  }
} else {
  console.log("⚠️ Test de base de données ignoré (DATABASE_URL manquante)");
}

console.log();

// Test OpenAI (basique)
if (process.env.OPENAI_API_KEY) {
  console.log("🤖 Test de la clé OpenAI...");
  try {
    const { ChatOpenAI } = await import("@langchain/openai");
    const model = new ChatOpenAI({
      model: "gpt-3.5-turbo",
      temperature: 0.1,
    });

    // Test très simple pour vérifier que la clé fonctionne
    const response = await model.invoke("Hello");
    console.log(`✅ OpenAI fonctionne`);
    console.log(`   → Réponse test: ${response.content.substring(0, 50)}...`);
  } catch (error) {
    console.log(`❌ Problème avec OpenAI:`);
    console.log(`   → ${error.message}`);
    if (error.message.includes("API key")) {
      console.log(`   → Vérifiez que votre clé API est valide`);
    }
    allGood = false;
  }
} else {
  console.log("⚠️ Test OpenAI ignoré (OPENAI_API_KEY manquante)");
}

console.log();

// Résumé final
if (allGood) {
  console.log("🎉 Tout est configuré correctement !");
  console.log("   Vous pouvez utiliser tous les agents sans problème.");
} else {
  console.log("⚠️ Configuration incomplète");
  console.log("\n📝 Pour corriger :");
  console.log("1. Copiez le fichier d'exemple : cp .env.example .env.local");
  console.log("2. Éditez .env.local et ajoutez les variables manquantes :");
  console.log('   OPENAI_API_KEY="your-openai-key"');
  console.log(
    '   DATABASE_URL="postgresql://user:pass@localhost:5432/lethimcookai"'
  );
  console.log("3. Relancez cette vérification : npm run check-env");
}
