import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { jsPDF } from "jspdf";

const chatgpt = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.5,
});

// Fonction pour générer un PDF directement avec jsPDF
function generatePDFWithJsPDF(
  title: string,
  content: string,
  documentType: string,
  style: string
): { buffer: Buffer; base64: string; size: string } {
  console.log("📄 Génération PDF avec jsPDF...");

  const doc = new jsPDF();

  // Configuration selon le style
  const colors = getStyleColors(style);

  // Titre principal
  doc.setFontSize(20);
  doc.setTextColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.text(title, 20, 30);

  // Ligne sous le titre
  doc.setLineWidth(1);
  doc.setDrawColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.line(20, 35, 190, 35);

  // Type de document
  doc.setFontSize(12);
  doc.setTextColor(colors.secondary.r, colors.secondary.g, colors.secondary.b);
  doc.text(`Type: ${documentType}`, 20, 50);

  // Contenu principal
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  // Diviser le contenu en lignes
  const lines = doc.splitTextToSize(content, 170);
  let yPosition = 70;

  lines.forEach((line: string) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 30;
    }
    doc.text(line, 20, yPosition);
    yPosition += 7;
  });

  // Section "Généré par"
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 30;
  }

  yPosition += 20;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("---", 20, yPosition);
  doc.text("Généré par Cuisinier IA Premium", 20, yPosition + 10);
  doc.text(
    `Style: ${style} | ${new Date().toLocaleDateString("fr-FR")}`,
    20,
    yPosition + 20
  );

  // Convertir en buffer
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  const base64 = doc.output("datauristring").split(",")[1]; // Enlever le préfixe data:

  const sizeKB = pdfBuffer.length / 1024;
  const size =
    sizeKB > 1000
      ? `${(sizeKB / 1024).toFixed(1)} MB`
      : `${Math.round(sizeKB)} KB`;

  console.log("✅ PDF jsPDF généré, taille:", pdfBuffer.length, "bytes");

  return {
    buffer: pdfBuffer,
    base64: base64,
    size: size,
  };
}

// Couleurs selon le style
function getStyleColors(style: string) {
  const styles = {
    moderne: {
      primary: { r: 44, g: 62, b: 80 }, // #2c3e50
      secondary: { r: 52, g: 73, b: 94 }, // #34495e
    },
    classique: {
      primary: { r: 139, g: 69, b: 19 }, // #8b4513
      secondary: { r: 160, g: 82, b: 45 }, // #a0522d
    },
    rustique: {
      primary: { r: 139, g: 69, b: 19 }, // #8b4513
      secondary: { r: 205, g: 133, b: 63 }, // #cd853f
    },
    élégant: {
      primary: { r: 74, g: 74, b: 74 }, // #4a4a4a
      secondary: { r: 102, g: 102, b: 102 }, // #666
    },
  };

  return styles[style.toLowerCase()] || styles.moderne;
}

// Générer un ID unique pour le PDF
function generatePDFId(title: string): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const titleHash = title
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const timestamp = Date.now();

  let id = "";
  let seed = titleHash + timestamp;

  for (let i = 0; i < 8; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    id += chars[seed % chars.length];
  }

  return id;
}

export const pdfCreator = tool(
  async ({ document_type, title, content, style, branding }) => {
    try {
      console.log(`🚀 Génération PDF simple: ${title}`);

      // Générer directement le PDF sans ChatGPT
      const pdfId = generatePDFId(title);
      const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.pdf`;

      // Utiliser jsPDF directement
      const pdfData = generatePDFWithJsPDF(
        title,
        content,
        document_type,
        style
      );

      console.log("✅ PDF généré avec succès!");

      const response = `# 📄 PDF Généré : ${title}

Votre document **${document_type}** a été créé avec succès ! 

## ✅ PDF Prêt au Téléchargement
- **Type :** ${document_type}
- **Style :** ${style}  
- **Format :** A4 simple
- **Taille :** ${pdfData.size}

---
**MÉTADONNÉES_PDF:** ${JSON.stringify({
        data: pdfData.base64,
        filename: filename,
        title: title,
        documentType: document_type,
        style: style,
        branding: branding || "Neutre",
        fileSize: pdfData.size,
        pdfId: pdfId,
        alt: `PDF ${document_type}: ${title}`,
        type: "direct_download_pdf",
        generatedAt: new Date().toISOString(),
        mimeType: "application/pdf",
      })}`;

      console.log("📦 PDF prêt !");
      return response;
    } catch (error) {
      console.error("❌ Erreur génération PDF:", error);
      return `# ❌ Erreur
Impossible de créer le PDF "${title}".
Erreur: ${error.message}

Veuillez réessayer.`;
    }
  },
  {
    name: "pdf_creator",
    description:
      "Génère de vrais PDFs EXCLUSIVEMENT culinaires téléchargeables avec jsPDF (menus, recettes, cartes, fiches techniques)",
    schema: z.object({
      document_type: z
        .string()
        .describe(
          "Type de document culinaire (livre recettes, menu restaurant, fiche technique cuisine, catalogue produits, présentation gastronomique)"
        ),
      title: z.string().describe("Titre du document culinaire"),
      content: z
        .string()
        .describe("Contenu culinaire à structurer dans le PDF"),
      style: z
        .string()
        .describe(
          "Style de mise en page culinaire (moderne, classique, rustique, élégant gastronomique)"
        ),
      branding: z
        .string()
        .optional()
        .describe(
          "Éléments de branding culinaire ou logo restaurant à inclure"
        ),
    }),
  }
);
