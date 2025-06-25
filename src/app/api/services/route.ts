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
    const tags = searchParams.getAll("tags");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const aiReplaceable = searchParams.get("aiReplaceable");
    const sector = searchParams.get("sector");
    const serviceType = searchParams.get("serviceType");
    const consumptionType = searchParams.get("consumptionType");
    const billingPlan = searchParams.get("billingPlan");
    const paymentMode = searchParams.get("paymentMode");

    const skip = (page - 1) * limit;

    // Construire les filtres
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { summary: { contains: search, mode: "insensitive" } },
        { organization: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    if (minPrice || maxPrice) {
      where.AND = [];
      if (minPrice)
        where.AND.push({ lowerPrice: { gte: parseFloat(minPrice) } });
      if (maxPrice)
        where.AND.push({ upperPrice: { lte: parseFloat(maxPrice) } });
    }

    if (aiReplaceable !== null) {
      where.isAIReplaceable = aiReplaceable === "true";
    }

    if (sector) {
      where.organization = {
        sector: { equals: sector, mode: "insensitive" },
      };
    }

    if (serviceType) {
      where.serviceType = serviceType;
    }

    if (consumptionType) {
      where.consumptionType = consumptionType;
    }

    if (billingPlan) {
      where.billingPlan = billingPlan;
    }

    if (paymentMode) {
      where.paymentMode = paymentMode;
    }

    // Récupérer les prestataires avec pagination et informations de l'organisation
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { title: "asc" },
        include: {
          organization: true,
        },
      }),
      prisma.service.count({ where }),
    ]);

    return NextResponse.json({
      services,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des prestataires:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des prestataires",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
