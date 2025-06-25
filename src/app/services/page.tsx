'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { ServiceCard } from '@/components/services/service-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter, MapPin, Clock, Zap, SlidersHorizontal } from 'lucide-react'

// Données de démonstration
const allServices = [
  {
    id: '1',
    title: 'Shooting photo culinaire professionnel',
    description: 'Sublimez vos plats avec des photos dignes des plus grands restaurants. Shootings en studio ou sur site.',
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
    description: 'Développez votre présence en ligne et attirez plus de clients avec une stratégie sur-mesure.',
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
    description: 'Application mobile sur-mesure pour vos commandes en ligne avec paiement intégré.',
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
  },
  {
    id: '4',
    title: 'Création de menu design',
    description: 'Conception graphique de menus élégants et modernes pour restaurants.',
    price: 180,
    type: 'ONLINE' as const,
    tags: ['Design', 'Menu', 'Graphisme'],
    location: 'En ligne',
    duration: '3 jours',
    replacedByAI: true,
    provider: {
      name: 'Studio Créatif',
      rating: 4.6
    }
  },
  {
    id: '5',
    title: 'Formation cuisine gastronomique',
    description: 'Formation personnalisée aux techniques de cuisine gastronomique.',
    price: 800,
    type: 'IRL' as const,
    tags: ['Formation', 'Cuisine', 'Gastronomie'],
    location: 'Lyon',
    duration: '1 jour',
    replacedByAI: false,
    provider: {
      name: 'Chef Antoine Moreau',
      rating: 4.9
    }
  },
  {
    id: '6',
    title: 'Audit SEO site restaurant',
    description: 'Analyse complète de votre site web et recommandations SEO.',
    price: 450,
    type: 'ONLINE' as const,
    tags: ['SEO', 'Web', 'Audit'],
    location: 'En ligne',
    duration: '2 jours',
    replacedByAI: true,
    provider: {
      name: 'Digital Food Agency',
      rating: 4.5
    }
  }
]

const categories = ['Photographie', 'Marketing', 'Développement', 'Design', 'Formation', 'SEO', 'Gastronomie']
const priceRanges = [
  { label: 'Moins de 500€', min: 0, max: 500 },
  { label: '500€ - 1000€', min: 500, max: 1000 },
  { label: '1000€ - 2500€', min: 1000, max: 2500 },
  { label: 'Plus de 2500€', min: 2500, max: Infinity },
]

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<'ALL' | 'IRL' | 'ONLINE'>('ALL')
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null)
  const [aiOnly, setAiOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filteredServices = allServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategories = selectedCategories.length === 0 || 
                             selectedCategories.some(cat => service.tags.includes(cat))
    
    const matchesType = selectedType === 'ALL' || service.type === selectedType
    
    const matchesPrice = selectedPriceRange === null || 
                        (service.price >= priceRanges[selectedPriceRange].min && 
                         service.price <= priceRanges[selectedPriceRange].max)
    
    const matchesAI = !aiOnly || service.replacedByAI

    return matchesSearch && matchesCategories && matchesType && matchesPrice && matchesAI
  })

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto max-w-screen-xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Services culinaires
          </h1>
          <p className="text-lg text-neutral-600">
            Découvrez {allServices.length} services proposés par nos prestataires experts
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <Input
              placeholder="Rechercher un service..."
              className="pl-10 h-12 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Bouton filtres mobile */}
        <div className="lg:hidden mb-6">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full justify-center"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filtres {selectedCategories.length > 0 && `(${selectedCategories.length})`}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtres */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Type de service */}
                <div>
                  <h3 className="font-medium text-neutral-900 mb-3">Type de service</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'ALL', label: 'Tous' },
                      { value: 'IRL', label: 'Présentiel' },
                      { value: 'ONLINE', label: 'En ligne' }
                    ].map(type => (
                      <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value={type.value}
                          checked={selectedType === type.value}
                          onChange={(e) => setSelectedType(e.target.value as 'ALL' | 'IRL' | 'ONLINE')}
                          className="text-orange-600"
                        />
                        <span className="text-sm">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Catégories */}
                <div>
                  <h3 className="font-medium text-neutral-900 mb-3">Catégories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="rounded text-orange-600"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Prix */}
                <div>
                  <h3 className="font-medium text-neutral-900 mb-3">Prix</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range, index) => (
                      <label key={index} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="price"
                          value={index}
                          checked={selectedPriceRange === index}
                          onChange={(e) => setSelectedPriceRange(parseInt(e.target.value))}
                          className="text-orange-600"
                        />
                        <span className="text-sm">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* IA */}
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiOnly}
                      onChange={(e) => setAiOnly(e.target.checked)}
                      className="rounded text-orange-600"
                    />
                    <span className="text-sm flex items-center">
                      <Zap className="h-4 w-4 mr-1 text-purple-600" />
                      Compatible IA seulement
                    </span>
                  </label>
                </div>

                {/* Reset */}
                {(selectedCategories.length > 0 || selectedType !== 'ALL' || selectedPriceRange !== null || aiOnly) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCategories([])
                      setSelectedType('ALL')
                      setSelectedPriceRange(null)
                      setAiOnly(false)
                    }}
                    className="w-full"
                  >
                    Réinitialiser
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Résultats */}
          <div className="lg:col-span-3">
            {/* Filtres actifs */}
            {(selectedCategories.length > 0 || selectedType !== 'ALL' || aiOnly) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedCategories.map(category => (
                  <Badge key={category} variant="secondary" className="cursor-pointer">
                    {category}
                    <button
                      onClick={() => toggleCategory(category)}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {selectedType !== 'ALL' && (
                  <Badge variant="secondary" className="cursor-pointer">
                    {selectedType === 'IRL' ? 'Présentiel' : 'En ligne'}
                    <button
                      onClick={() => setSelectedType('ALL')}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {aiOnly && (
                  <Badge variant="secondary" className="cursor-pointer">
                    <Zap className="h-3 w-3 mr-1" />
                    Compatible IA
                    <button
                      onClick={() => setAiOnly(false)}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Nombre de résultats */}
            <div className="mb-6">
              <p className="text-neutral-600">
                {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} trouvé{filteredServices.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Liste des services */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Message si aucun résultat */}
            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Aucun service trouvé
                </h3>
                <p className="text-neutral-600 mb-4">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategories([])
                    setSelectedType('ALL')
                    setSelectedPriceRange(null)
                    setAiOnly(false)
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 