import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        services: {
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            services: true,
          },
        },
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organisation non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(organization);
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération de l'organisation:",
      error
    );
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération de l'organisation",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
