import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const webhookSecret =
  process.env.STRIPE_WEBHOOK_SECRET || "whsec_fallback_for_dev";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    // Vérifier la signature du webhook pour la sécurité
    if (webhookSecret.startsWith("whsec_")) {
      // Mode production avec vérification de signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("✅ Webhook vérifié et sécurisé:", event.type);
    } else {
      // Mode développement - parser directement mais avec warning
      console.warn(
        "⚠️ ATTENTION: Webhook en mode développement sans vérification de signature"
      );
      event = JSON.parse(body);
      console.log("🚨 Webhook non sécurisé:", event.type);
    }
  } catch (err) {
    console.error("Webhook JSON parsing failed:", err);
    return NextResponse.json(
      { error: "Invalid webhook body" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (
          session.mode === "subscription" &&
          session.metadata?.userId &&
          session.metadata?.plan
        ) {
          const userId = session.metadata.userId;
          const plan = session.metadata.plan;

          // Calculer la date d'expiration (1 mois)
          const subscriptionEnd = new Date();
          subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

          // Mettre à jour l'utilisateur
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionPlan: plan as any,
              subscriptionStatus: "ACTIVE",
              subscriptionStart: new Date(),
              subscriptionEnd: subscriptionEnd,
            },
          });

          console.log(`Abonnement ${plan} activé pour l'utilisateur ${userId}`);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          );

          // Trouver l'utilisateur via l'email du customer
          const customer = (await stripe.customers.retrieve(
            subscription.customer as string
          )) as Stripe.Customer;

          if (customer.email) {
            const user = await prisma.user.findUnique({
              where: { email: customer.email },
            });

            if (user) {
              // Prolonger l'abonnement d'un mois
              const subscriptionEnd = new Date();
              subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

              await prisma.user.update({
                where: { id: user.id },
                data: {
                  subscriptionStatus: "ACTIVE",
                  subscriptionEnd: subscriptionEnd,
                },
              });

              console.log(`Abonnement prolongé pour l'utilisateur ${user.id}`);
            }
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          );
          const customer = (await stripe.customers.retrieve(
            subscription.customer as string
          )) as Stripe.Customer;

          if (customer.email) {
            const user = await prisma.user.findUnique({
              where: { email: customer.email },
            });

            if (user) {
              await prisma.user.update({
                where: { id: user.id },
                data: {
                  subscriptionStatus: "EXPIRED",
                },
              });

              console.log(
                `Abonnement expiré pour l'utilisateur ${user.id} (paiement échoué)`
              );
            }
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = (await stripe.customers.retrieve(
          subscription.customer as string
        )) as Stripe.Customer;

        if (customer.email) {
          const user = await prisma.user.findUnique({
            where: { email: customer.email },
          });

          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                subscriptionPlan: "FREE",
                subscriptionStatus: "CANCELLED",
                subscriptionEnd: new Date(),
              },
            });

            console.log(`Abonnement annulé pour l'utilisateur ${user.id}`);
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur traitement webhook:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement du webhook" },
      { status: 500 }
    );
  }
}
