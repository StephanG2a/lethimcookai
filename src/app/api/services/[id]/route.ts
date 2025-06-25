import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json(
        {
          error: "Prestataire non trouvé",
          message: `Aucun prestataire trouvé avec l'ID ${id}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du prestataire:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération du prestataire",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
