import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const PLANS = {
  PREMIUM: {
    price: 1900, // 19€ en centimes
    name: "Premium",
    description: "Assistant culinaire premium avec génération d'images",
  },
  BUSINESS: {
    price: 4900, // 49€ en centimes
    name: "Business",
    description: "Assistant professionnel avec outils business",
  },
};

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json();

    // Vérifier que le plan est valide
    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
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

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS];

    // Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Abonnement ${selectedPlan.name}`,
              description: selectedPlan.description,
            },
            unit_amount: selectedPlan.price,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription", // Retour au mode abonnement
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscriptions`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        plan: plan,
      },
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Erreur création checkout:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du checkout" },
      { status: 500 }
    );
  }
}
