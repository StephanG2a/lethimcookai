"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  ChefHat,
  Sparkles,
  Building2,
  CreditCard,
  MessageCircle,
  Zap,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Timer,
  Brain,
  Palette,
  BarChart3,
} from "lucide-react";

export default function CommentCaMarchePage() {
  const router = useRouter();

  const steps = [
    {
      number: "1",
      title: "Inscrivez-vous gratuitement",
      description:
        "Créez votre compte en 30 secondes et accédez immédiatement à l'IA Cuisinier Basic.",
      icon: <Users className="h-8 w-8 text-blue-600" />,
      color: "bg-blue-50 border-blue-200",
    },
    {
      number: "2",
      title: "Choisissez votre plan",
      description:
        "Selon vos besoins : FREE pour débuter, PREMIUM pour créer, BUSINESS pour entreprendre.",
      icon: <CreditCard className="h-8 w-8 text-purple-600" />,
      color: "bg-purple-50 border-purple-200",
    },
    {
      number: "3",
      title: "Chattez avec vos agents IA",
      description:
        "Posez vos questions culinaires et laissez l'IA vous guider avec des conseils personnalisés.",
      icon: <MessageCircle className="h-8 w-8 text-green-600" />,
      color: "bg-green-50 border-green-200",
    },
    {
      number: "4",
      title: "Créez et développez",
      description:
        "Générez des contenus, trouvez des prestataires, analysez le marché selon votre abonnement.",
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      color: "bg-orange-50 border-orange-200",
    },
  ];

  const agents = [
    {
      name: "Cuisinier Basic",
      icon: <ChefHat className="h-8 w-8 text-blue-600" />,
      plan: "FREE",
      planColor: "bg-gray-100 text-gray-800",
      description: "Votre assistant culinaire essentiel",
      features: [
        "Recherche de recettes adaptées",
        "Calculs nutritionnels complets",
        "Substitutions d'ingrédients",
        "Conversions d'unités précises",
        "Planification de menus équilibrés",
        "Accords mets-vins",
        "Techniques de cuisine",
      ],
      tools: "7 outils culinaires",
    },
    {
      name: "Cuisinier Premium",
      icon: <Palette className="h-8 w-8 text-purple-600" />,
      plan: "PREMIUM",
      planColor: "bg-purple-100 text-purple-800",
      description: "Créez du contenu visuel professionnel",
      features: [
        "Tout du Cuisinier Basic",
        "Génération d'images culinaires",
        "Création de logos restaurants",
        "Génération de PDFs personnalisés",
        "Templates réseaux sociaux",
        "Création de vidéos promotionnelles",
        "Étiquettes produits personnalisées",
      ],
      tools: "13 outils créatifs",
    },
    {
      name: "Cuisinier Business",
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      plan: "BUSINESS",
      planColor: "bg-green-100 text-green-800",
      description: "Développez votre activité culinaire",
      features: [
        "Tout des plans précédents",
        "Génération de sites web complets",
        "Recherche de prestataires qualifiés",
        "Analyse de marché approfondie",
        "Calculs de coûts détaillés",
        "Génération de business plans",
        "Exécution automatique de services",
      ],
      tools: "21 outils business",
    },
  ];

  const benefits = [
    {
      icon: <Brain className="h-6 w-6 text-blue-600" />,
      title: "IA Spécialisée",
      description:
        "Agents IA entraînés spécifiquement pour la cuisine et la restauration",
    },
    {
      icon: <Timer className="h-6 w-6 text-green-600" />,
      title: "Gain de Temps",
      description:
        "Réponses instantanées, créations automatiques, recherches accélérées",
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      title: "Sécurisé",
      description:
        "Paiements Stripe sécurisés, données protégées, confidentialité garantie",
    },
    {
      icon: <Star className="h-6 w-6 text-orange-600" />,
      title: "Qualité Pro",
      description:
        "Contenus de niveau professionnel, conseils d'experts, outils avancés",
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Comment ça marche ?
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Découvrez comment LetHimCookAI révolutionne votre expérience
              culinaire avec des agents IA spécialisés pour tous vos besoins.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Inscription gratuite</span>
              <span>•</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Accès immédiat</span>
              <span>•</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Paiement sécurisé</span>
            </div>
          </div>

          {/* Étapes */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              En 4 étapes simples
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <Card key={index} className={`${step.color} border-2 relative`}>
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      {step.icon}
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-600">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Agents IA */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-4">
              Vos assistants IA spécialisés
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Chaque agent est conçu pour répondre à des besoins spécifiques, du
              cuisinier amateur au professionnel de la restauration.
            </p>
            <div className="grid lg:grid-cols-3 gap-8">
              {agents.map((agent, index) => (
                <Card
                  key={index}
                  className="relative overflow-hidden border-2 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                        {agent.icon}
                      </div>
                      <Badge className={agent.planColor}>{agent.plan}</Badge>
                    </div>
                    <CardTitle className="text-xl">{agent.name}</CardTitle>
                    <p className="text-gray-600">{agent.description}</p>
                    <div className="text-sm font-medium text-orange-600">
                      {agent.tools}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {agent.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start space-x-2"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Avantages */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              Pourquoi choisir LetHimCookAI ?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="text-center p-6 border-2 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Plans et Prix */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-4">
              Choisissez votre formule
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Commencez gratuitement, évoluez selon vos besoins
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "FREE",
                  price: "Gratuit",
                  description: "Parfait pour débuter",
                  features: [
                    "Cuisinier Basic",
                    "7 outils culinaires",
                    "Support communautaire",
                  ],
                  color: "border-gray-200",
                  popular: false,
                },
                {
                  name: "PREMIUM",
                  price: "19€",
                  period: "/mois",
                  description: "Pour les créatifs",
                  features: [
                    "Cuisinier Basic + Premium",
                    "13 outils créatifs",
                    "Génération de contenu",
                    "Support prioritaire",
                  ],
                  color: "border-purple-500 shadow-lg scale-105",
                  popular: true,
                },
                {
                  name: "BUSINESS",
                  price: "49€",
                  period: "/mois",
                  description: "Pour les professionnels",
                  features: [
                    "Tous les agents",
                    "21 outils business",
                    "Analyse de marché",
                    "Support dédié 24/7",
                  ],
                  color: "border-green-500",
                  popular: false,
                },
              ].map((plan, index) => (
                <Card key={index} className={`relative ${plan.color} border-2`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-500 text-white">
                        Plus populaire
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <p className="text-gray-600">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-gray-500">{plan.period}</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => router.push("/subscriptions")}
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.name === "FREE"
                        ? "Commencer gratuitement"
                        : "Choisir ce plan"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à révolutionner votre cuisine ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des milliers de cuisiniers qui utilisent déjà
              LetHimCookAI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/auth/register")}
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => router.push("/subscriptions")}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-600"
              >
                Voir les plans
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">
              Aucune carte de crédit requise pour commencer
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
