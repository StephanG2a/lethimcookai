import { NextResponse } from 'next/server';

export async function GET() {
  const agents = [
    {
      id: 'cuisinier',
      name: 'Chef Cuisinier IA',
      description: 'Votre assistant culinaire pour recettes, conseils de cuisine et techniques culinaires',
      type: 'basic'
    },
    {
      id: 'cuisinier-premium',
      name: 'Chef Cuisinier IA Premium',
      description: 'Création de contenus visuels, logos, affiches et sites web pour votre activité culinaire',
      type: 'premium'
    },
    {
      id: 'cuisinier-business',
      name: 'Chef Cuisinier IA Business',
      description: 'Recherche de services, prestataires et outils business pour professionnels de la restauration',
      type: 'business'
    }
  ];

  return NextResponse.json(agents);
} 