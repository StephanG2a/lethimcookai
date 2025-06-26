import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthUtils } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Extraire le token depuis les headers
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

    // Vérifier le token
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

    // Récupérer l'utilisateur depuis la base de données
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        organization: true,
      },
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

    // Retourner les informations utilisateur (sans le mot de passe)
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      emailVerified: user.emailVerified,
      organization: user.organization
        ? {
            id: user.organization.id,
            name: user.organization.name,
            sector: user.organization.sector,
            description: user.organization.description,
            logo: user.organization.logo,
          }
        : null,
      // Informations d'abonnement
      subscriptionPlan: user.subscriptionPlan,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionStart: user.subscriptionStart,
      subscriptionEnd: user.subscriptionEnd,
      trialUsed: user.trialUsed,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur interne du serveur",
      },
      { status: 500 }
    );
  }
}
