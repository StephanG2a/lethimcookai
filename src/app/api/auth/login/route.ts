import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthUtils } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation des champs requis
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email et mot de passe requis",
        },
        { status: 400 }
      );
    }

    // Validation du format email
    if (!AuthUtils.isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Format d'email invalide",
        },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        organization: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Email ou mot de passe incorrect",
        },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const passwordValid = await AuthUtils.comparePassword(
      password,
      user.password
    );

    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Email ou mot de passe incorrect",
        },
        { status: 401 }
      );
    }

    // Générer le token JWT
    const token = AuthUtils.generateToken(user);

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
          }
        : null,
      // Informations d'abonnement
      subscriptionPlan: user.subscriptionPlan,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionStart: user.subscriptionStart,
      subscriptionEnd: user.subscriptionEnd,
      trialUsed: user.trialUsed,
    };

    return NextResponse.json({
      success: true,
      message: "Connexion réussie",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur interne du serveur",
      },
      { status: 500 }
    );
  }
}
