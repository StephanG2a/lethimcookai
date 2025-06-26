import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthUtils } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get("authorization");
    const token = AuthUtils.extractTokenFromHeader(authHeader || undefined);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Token d'authentification requis",
        },
        { status: 401 }
      );
    }

    const payload = AuthUtils.verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          error: "Token invalide ou expiré",
        },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { organization: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Utilisateur introuvable",
        },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est un prestataire avec une organisation
    if (user.role !== "PRESTATAIRE") {
      return NextResponse.json(
        {
          success: false,
          error: "Seuls les prestataires peuvent créer des services",
        },
        { status: 403 }
      );
    }

    if (!user.organizationId || !user.organization) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Vous devez être associé à une organisation pour créer un service",
        },
        { status: 403 }
      );
    }

    // Récupérer les données du formulaire
    const body = await request.json();
    const {
      title,
      description,
      fullDescription,
      price,
      duration,
      type,
      location,
      tags = [],
      deliverables = [],
      replacedByAI = false,
    } = body;

    // Validation des champs requis
    if (!title || !description) {
      return NextResponse.json(
        {
          success: false,
          error: "Le titre et la description sont requis",
        },
        { status: 400 }
      );
    }

    if (!fullDescription) {
      return NextResponse.json(
        {
          success: false,
          error: "La description détaillée est requise",
        },
        { status: 400 }
      );
    }

    if (!price || parseFloat(price) <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Le prix doit être supérieur à 0",
        },
        { status: 400 }
      );
    }

    if (!duration) {
      return NextResponse.json(
        {
          success: false,
          error: "La durée est requise",
        },
        { status: 400 }
      );
    }

    // Validation du type de service
    if (!["IRL", "ONLINE"].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Type de service invalide",
        },
        { status: 400 }
      );
    }

    // Si service IRL, la localisation est requise
    if (type === "IRL" && !location) {
      return NextResponse.json(
        {
          success: false,
          error: "La localisation est requise pour les services présentiels",
        },
        { status: 400 }
      );
    }

    // Convertir les données pour correspondre au schéma Prisma
    const serviceData = {
      title: title.trim(),
      summary: description.substring(0, 500), // Utiliser la description courte comme résumé
      description: fullDescription.trim(), // Description détaillée
      serviceType: (type === "IRL"
        ? "IRL"
        : type === "ONLINE"
        ? "ONLINE"
        : "MIXED") as "IRL" | "ONLINE" | "MIXED",
      consumptionType: "PRESTATION" as "INSTANT" | "PERIODIC" | "PRESTATION",
      billingPlan: "PROJECT" as
        | "UNIT"
        | "USAGE"
        | "MINUTE"
        | "MENSUAL"
        | "ANNUAL"
        | "PROJECT",
      lowerPrice: parseFloat(price),
      upperPrice: parseFloat(price),
      paymentMode: "EUR" as "CREDIT" | "EUR" | "USD" | "GBP" | "CRYPTO",
      tags: Array.isArray(tags) ? tags : [],
      isAIReplaceable: Boolean(replacedByAI),
      organizationId: user.organizationId,
    };

    // Créer le service
    const service = await prisma.service.create({
      data: serviceData,
      include: {
        organization: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Service créé avec succès",
        service: {
          id: service.id,
          title: service.title,
          summary: service.summary,
          description: service.description,
          serviceType: service.serviceType,
          lowerPrice: service.lowerPrice,
          upperPrice: service.upperPrice,
          paymentMode: service.paymentMode,
          tags: service.tags,
          organization: {
            id: service.organization!.id,
            name: service.organization!.name,
            sector: service.organization!.sector,
          },
          createdAt: service.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création du service:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur interne du serveur",
      },
      { status: 500 }
    );
  }
}
