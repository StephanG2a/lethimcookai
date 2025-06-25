import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Clock, Zap, Star, User, ArrowLeft, MessageCircle, Shield, CheckCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

// Données de démonstration - En réalité, cela viendrait d'une API/base de données
const services = [
  {
    id: '1',
    title: 'Shooting photo culinaire professionnel',
    description: 'Sublimez vos plats avec des photos dignes des plus grands restaurants. Shootings en studio ou sur site.',
    fullDescription: `
      <h3>🎯 Ce que vous obtenez :</h3>
      <ul>
        <li>Shooting photo professionnel de 2h</li>
        <li>10-15 photos haute résolution retouchées</li>
        <li>Photos optimisées pour réseaux sociaux</li>
        <li>Conseils styling culinaire</li>
        <li>Livraison sous 48h</li>
      </ul>
      
      <h3>📸 Déroulement :</h3>
      <p>Nous commençons par définir ensemble le style et l'ambiance souhaitée. Je vous accompagne dans la mise en scène de vos plats pour créer des images qui donnent envie.</p>
      
      <h3>🏆 Expérience :</h3>
      <p>Photographe culinaire depuis 8 ans, j'ai travaillé avec des restaurants étoilés et des marques alimentaires reconnues. Mon style met en valeur les textures et les couleurs pour créer des images appétissantes.</p>
    `,
    price: 350,
    type: 'IRL' as const,
    tags: ['Photographie', 'Culinaire', 'Professionnel'],
    images: [
      // Images seront ajoutées plus tard
    ],
    location: 'Paris et proche banlieue',
    duration: '2 heures',
    replacedByAI: false,
    deliverables: [
      '10-15 photos haute résolution',
      'Retouches professionnelles',
      'Formats optimisés réseaux sociaux',
      'Conseils styling inclus'
    ],
    provider: {
      id: 'marie-dubois',
      name: 'Marie Dubois',
      rating: 4.9,
      reviewCount: 47,
      responseTime: '2h',
      completedProjects: 156,
      memberSince: '2019',
      description: 'Photographe culinaire passionnée, spécialisée dans la mise en valeur des créations gastronomiques.',
      location: 'Paris, France',
      languages: ['Français', 'Anglais'],
      verified: true
    },
    reviews: [
      {
        id: '1',
        author: 'Restaurant Le Petit Gourmet',
        rating: 5,
        date: '2024-01-15',
        comment: 'Travail exceptionnel ! Marie a su capturer l\'essence de nos plats. Les photos sont magnifiques et ont considérablement amélioré notre présence sur les réseaux sociaux.'
      },
      {
        id: '2',
        author: 'Chef Antoine',
        rating: 5,
        date: '2024-01-10',
        comment: 'Très professionnelle et créative. Les photos correspondent exactement à ce que j\'imaginais. Je recommande vivement !'
      }
    ],
    faq: [
      {
        question: 'Que dois-je préparer pour le shooting ?',
        answer: 'Je vous fournirai une liste détaillée avant le shooting, mais généralement : vos plats fraîchement préparés, quelques accessoires de mise en scène, et un espace bien éclairé.'
      },
      {
        question: 'Combien de photos vais-je recevoir ?',
        answer: 'Vous recevrez 10 à 15 photos haute résolution, retouchées et optimisées. Si vous souhaitez plus de photos, nous pouvons en discuter.'
      },
      {
        question: 'Travaillez-vous dans toute la France ?',
        answer: 'Je suis basée à Paris mais je peux me déplacer en région parisienne sans frais supplémentaires. Pour les autres régions, des frais de déplacement peuvent s\'appliquer.'
      }
    ]
  }
]

interface ServiceDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params
  const service = services.find(s => s.id === id)

  if (!service) {
    notFound()
  }

  return (
    <MainLayout>
      <div className="container mx-auto max-w-screen-xl px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="p-0 h-auto">
            <Link href="/services" className="flex items-center text-neutral-600 hover:text-orange-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux services
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={service.type === 'IRL' ? 'default' : 'secondary'}>
                  {service.type === 'IRL' ? 'Présentiel' : 'En ligne'}
                </Badge>
                {service.replacedByAI && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                    <Zap className="h-3 w-3 mr-1" />
                    IA Compatible
                  </Badge>
                )}
                {service.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
              
              <h1 className="text-3xl font-bold text-neutral-900 mb-4">
                {service.title}
              </h1>
              
              <div className="flex items-center space-x-6 text-neutral-600 mb-6">
                {service.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{service.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{service.duration}</span>
                </div>
              </div>
            </div>

            {/* Images */}
            {service.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {service.images.map((image, index) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${service.title} - image ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description du service</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-neutral max-w-none"
                  dangerouslySetInnerHTML={{ __html: service.fullDescription }}
                />
              </CardContent>
            </Card>

            {/* Ce qui est inclus */}
            <Card>
              <CardHeader>
                <CardTitle>Ce qui est inclus</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.deliverables.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Questions fréquentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {service.faq.map((item, index) => (
                  <div key={index} className="border-b border-neutral-200 last:border-b-0 pb-4 last:pb-0">
                    <h4 className="font-medium text-neutral-900 mb-2">{item.question}</h4>
                    <p className="text-neutral-600">{item.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Avis */}
            <Card>
              <CardHeader>
                <CardTitle>Avis clients</CardTitle>
                <CardDescription>
                  {service.reviews.length} avis • Note moyenne {service.provider.rating}/5
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {service.reviews.map((review) => (
                  <div key={review.id} className="border-b border-neutral-200 last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{review.author}</span>
                        <div className="flex items-center">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-neutral-500">
                        {new Date(review.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-neutral-600">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Prix et CTA */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {formatPrice(service.price)}
                    </div>
                    <p className="text-neutral-600">Prix fixe</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Button size="lg" className="w-full">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Contacter le prestataire
                    </Button>
                    <Button variant="outline" size="lg" className="w-full">
                      Demander un devis
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Prestataire */}
              <Card>
                <CardHeader>
                  <CardTitle>À propos du prestataire</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-neutral-400" />
                      </div>
                      {service.provider.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <Shield className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{service.provider.name}</h3>
                      <div className="flex items-center space-x-1 text-sm text-neutral-600">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{service.provider.rating}</span>
                        <span>({service.provider.reviewCount} avis)</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-neutral-600 mb-4">{service.provider.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Temps de réponse</span>
                      <span className="font-medium">{service.provider.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Projets réalisés</span>
                      <span className="font-medium">{service.provider.completedProjects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Membre depuis</span>
                      <span className="font-medium">{service.provider.memberSince}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Localisation</span>
                      <span className="font-medium">{service.provider.location}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/prestataires/${service.provider.id}`}>
                        Voir le profil complet
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Garanties */}
              <Card>
                <CardHeader>
                  <CardTitle>Garanties CulinaryConnect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Paiement sécurisé</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Satisfaction garantie</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Support client 24/7</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 