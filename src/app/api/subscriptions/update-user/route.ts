import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID manquant" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur depuis le token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let userId: string;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };
      userId = decoded.userId;
    } catch {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Paiement non confirmé" },
        { status: 400 }
      );
    }

    // 🔒 SÉCURITÉ : Vérifier que la session appartient bien à cet utilisateur
    if (session.metadata?.userId !== userId) {
      return NextResponse.json(
        { error: "Session non autorisée pour cet utilisateur" },
        { status: 403 }
      );
    }

    // Récupérer le plan depuis les métadonnées
    const plan = session.metadata?.plan;
    if (!plan || !["PREMIUM", "BUSINESS"].includes(plan)) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
    }

    // Calculer la date de fin d'abonnement (1 mois à partir de maintenant)
    const subscriptionStart = new Date();
    const subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

    // Mettre à jour l'utilisateur en base de données
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionPlan: plan as "PREMIUM" | "BUSINESS",
        subscriptionStatus: "ACTIVE",
        subscriptionStart: subscriptionStart,
        subscriptionEnd: subscriptionEnd,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        emailVerified: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionStart: true,
        subscriptionEnd: true,
        trialUsed: true,
        organization: {
          select: {
            id: true,
            name: true,
            sector: true,
          },
        },
      },
    });

    console.log(`✅ Abonnement ${plan} activé pour l'utilisateur ${userId}`);

    return NextResponse.json({
      success: true,
      message: "Abonnement mis à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erreur mise à jour abonnement:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'abonnement" },
      { status: 500 }
    );
  }
}
