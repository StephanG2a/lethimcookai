import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function GET(request: NextRequest) {
  try {
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

    // Récupérer les informations d'abonnement
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionStart: true,
        subscriptionEnd: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    // Si l'utilisateur a un abonnement payant, récupérer les infos Stripe
    let stripeInfo = null;
    if (user.subscriptionPlan !== "FREE") {
      try {
        // Rechercher le customer Stripe par email
        const customers = await stripe.customers.list({
          email: user.email,
          limit: 1,
        });

        if (customers.data.length > 0) {
          const customer = customers.data[0];

          // Récupérer les abonnements actifs
          const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: "active",
            limit: 1,
          });

          if (subscriptions.data.length > 0) {
            const subscription = subscriptions.data[0];
            stripeInfo = {
              subscriptionId: subscription.id,
              customerId: customer.id,
              currentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            };
          }
        }
      } catch (error) {
        console.error("Erreur récupération Stripe:", error);
      }
    }

    return NextResponse.json({
      user,
      stripeInfo,
    });
  } catch (error) {
    console.error("Erreur récupération abonnement:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'abonnement" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    if (user.subscriptionPlan === "FREE") {
      return NextResponse.json(
        { error: "Aucun abonnement à annuler" },
        { status: 400 }
      );
    }

    // Rechercher et annuler l'abonnement Stripe
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      const customer = customers.data[0];

      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        const subscription = subscriptions.data[0];

        // Annuler à la fin de la période
        await stripe.subscriptions.update(subscription.id, {
          cancel_at_period_end: true,
        });

        return NextResponse.json({
          message: "Abonnement annulé à la fin de la période de facturation",
          cancelAtPeriodEnd: true,
        });
      }
    }

    return NextResponse.json(
      { error: "Abonnement Stripe introuvable" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Erreur annulation abonnement:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'annulation de l'abonnement" },
      { status: 500 }
    );
  }
}
