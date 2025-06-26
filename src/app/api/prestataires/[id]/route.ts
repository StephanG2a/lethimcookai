import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID prestataire requis" },
        { status: 400 }
      );
    }

    // Récupérer le prestataire avec toutes ses informations
    const prestataire = await prisma.user.findFirst({
      where: {
        id: id,
        role: "PRESTATAIRE",
      },
      include: {
        organization: {
          include: {
            services: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
    });

    if (!prestataire) {
      return NextResponse.json(
        { success: false, error: "Prestataire non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: prestataire,
    });
  } catch (error) {
    console.error("Erreur API prestataire individuel:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
