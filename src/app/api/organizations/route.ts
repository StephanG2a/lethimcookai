import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Récupérer les paramètres de query
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const sector = searchParams.get("sector");

    const skip = (page - 1) * limit;

    // Construire les filtres
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (sector) {
      where.sector = { equals: sector, mode: "insensitive" };
    }

    // Récupérer les organisations avec pagination et leurs services
    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          services: {
            select: {
              id: true,
              title: true,
              summary: true,
              lowerPrice: true,
              upperPrice: true,
              tags: true,
              isAIReplaceable: true,
              serviceType: true,
              consumptionType: true,
              billingPlan: true,
              paymentMode: true,
            },
          },
          _count: {
            select: {
              services: true,
            },
          },
        },
      }),
      prisma.organization.count({ where }),
    ]);

    return NextResponse.json({
      organizations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération des organisations:",
      error
    );
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des organisations",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
