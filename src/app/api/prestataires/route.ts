import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const sector = searchParams.get("sector") || "";

    const skip = (page - 1) * limit;

    // Construire les conditions de recherche
    const whereClause: any = {
      role: "PRESTATAIRE",
    };

    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        {
          organization: {
            name: { contains: search, mode: "insensitive" },
          },
        },
      ];
    }

    if (sector) {
      whereClause.organization = {
        ...whereClause.organization,
        sector: { contains: sector, mode: "insensitive" },
      };
    }

    // Récupérer les prestataires avec leurs organisations
    const [prestataires, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        include: {
          organization: {
            include: {
              services: {
                select: {
                  id: true,
                  title: true,
                  summary: true,
                  lowerPrice: true,
                  upperPrice: true,
                  paymentMode: true,
                  tags: true,
                },
                orderBy: {
                  createdAt: "desc",
                },
                take: 3, // Limiter à 3 services par prestataire
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.user.count({
        where: whereClause,
      }),
    ]);

    // Formatter les données pour l'affichage
    const prestatairesForms = prestataires.map((prestataire) => ({
      id: prestataire.id,
      firstName: prestataire.firstName,
      lastName: prestataire.lastName,
      email: prestataire.email,
      phone: prestataire.phone,
      emailVerified: prestataire.emailVerified,
      createdAt: prestataire.createdAt,
      organization: prestataire.organization
        ? {
            id: prestataire.organization.id,
            name: prestataire.organization.name,
            description: prestataire.organization.description,
            logo: prestataire.organization.logo,
            website: prestataire.organization.website,
            email: prestataire.organization.email,
            phone: prestataire.organization.phone,
            address: prestataire.organization.address,
            sector: prestataire.organization.sector,
            siret: prestataire.organization.siret,
            legalForm: prestataire.organization.legalForm,
            servicesCount: prestataire.organization.services.length,
            services: prestataire.organization.services,
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        prestataires: prestatairesForms,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des prestataires:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur interne du serveur",
      },
      { status: 500 }
    );
  }
}
