import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MainLayout } from '@/components/layout/main-layout'
import { ServiceCard } from '@/components/services/service-card'
import { ArrowRight, CheckCircle, Utensils, Camera, Megaphone, Code, Sparkles, Users } from 'lucide-react'

// Données de démonstration
const featuredServices = [
  {
    id: '1',
    title: 'Shooting photo culinaire professionnel',
    description: 'Sublimez vos plats avec des photos dignes des plus grands restaurants',
    price: 350,
    type: 'IRL' as const,
    tags: ['Photographie', 'Culinaire', 'Professionnel'],
    location: 'Paris',
    duration: '2h',
    replacedByAI: false,
    provider: {
      name: 'Marie Dubois',
      rating: 4.9
    }
  },
  {
    id: '2',
    title: 'Stratégie marketing digital restaurant',
    description: 'Développez votre présence en ligne et attirez plus de clients',
    price: 1200,
    type: 'ONLINE' as const,
    tags: ['Marketing', 'Digital', 'Restaurant'],
    location: 'En ligne',
    duration: '1 semaine',
    replacedByAI: true,
    provider: {
      name: 'Alexandre Martin',
      rating: 4.8
    }
  },
  {
    id: '3',
    title: 'Développement d\'application de commande',
    description: 'Application mobile sur-mesure pour vos commandes en ligne',
    price: 5000,
    type: 'ONLINE' as const,
    tags: ['Développement', 'Mobile', 'E-commerce'],
    location: 'En ligne',
    duration: '6 semaines',
    replacedByAI: false,
    provider: {
      name: 'TechFood Studio',
      rating: 4.7
    }
  }
]

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                <span>Nouvelle plateforme culinaire</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 leading-tight">
                Connectez-vous aux 
                <span className="text-orange-600"> meilleurs prestataires</span> 
                culinaires
              </h1>
              
              <p className="text-xl text-neutral-600 leading-relaxed">
                Que vous soyez chef, traiteur ou restaurateur, trouvez facilement les experts qui vous aideront à développer votre activité : photographes, développeurs, marketeurs...
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/services">
                    <Utensils className="h-5 w-5 mr-2" />
                    Parcourir les services
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/services/nouveau">
                    Publier un service
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Camera className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Shooting photo culinaire</h3>
                      <p className="text-sm text-neutral-600">350€ • 2h • Paris</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline">Photographie</Badge>
                    <Badge variant="outline">Professionnel</Badge>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-6 transform -rotate-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Mission terminée</p>
                    <p className="text-sm text-neutral-600">⭐ 4.9/5 • Recommandé</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services populaires */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Services populaires
            </h2>
            <p className="text-xl text-neutral-600">
              Découvrez les services les plus demandés par les professionnels
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">
                Voir tous les services
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Trouvez votre prestataire par catégorie
            </h2>
            <p className="text-xl text-neutral-600">
              Explorez nos différentes catégories de services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Camera,
                title: 'Photographie',
                description: 'Photos de plats, événements culinaires, reportages restaurant',
                count: '45+ services'
              },
              {
                icon: Megaphone,
                title: 'Marketing',
                description: 'Stratégie digitale, réseaux sociaux, publicité en ligne',
                count: '32+ services'
              },
              {
                icon: Code,
                title: 'Développement',
                description: 'Sites web, applications mobile, systèmes de commande',
                count: '28+ services'
              },
              {
                icon: Users,
                title: 'Conseil',
                description: 'Stratégie business, formation, audit opérationnel',
                count: '19+ services'
              }
            ].map((category, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                    <category.icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="mb-3">
                    {category.description}
                  </CardDescription>
                  <Badge variant="secondary">{category.count}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="container mx-auto max-w-screen-xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à développer votre activité culinaire ?
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Rejoignez les centaines de professionnels qui nous font confiance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/register">
                Créer mon compte
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600" asChild>
              <Link href="/comment-ca-marche">
                Comment ça marche
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
