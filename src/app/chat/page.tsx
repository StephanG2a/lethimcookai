"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/lib/useAuth";
import {
  hasAccessToAgent,
  getUpgradeMessage,
  AGENTS_CONFIG,
  type AgentType,
} from "@/lib/subscription";
import { 
  ChefHat, 
  Crown, 
  Building2, 
  Send, 
  Plus, 
  Menu, 
  X, 
  User,
  Bot,
  Sparkles,
  Image as ImageIcon,
  Video,
  FileText,
  Globe,
  Building,
  Users,
  Download,
  ExternalLink,
  Copy,
  Loader2,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  StopCircle
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  type?: AgentType;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
  agentName?: string;
  images?: Array<{
    url: string;
    alt: string;
    title?: string;
  }>;
  videos?: Array<{
    url: string;
    embedUrl: string;
    thumbnail: string;
    title: string;
    channel: string;
    views: string;
    duration: string;
    alt: string;
  }>;
  pdfs?: Array<{
    url?: string;
    data?: string;
    previewUrl?: string;
    filename: string;
    title: string;
    documentType: string;
    style: string;
    fileSize: string;
    pages?: number;
    alt: string;
    type?: string;
    mimeType?: string;
  }>;
  websites?: Array<{
    title: string;
    restaurantName: string;
    restaurantType: string;
    websiteType: string;
    features: string[];
    colorScheme: string;
    htmlContent: string;
    cssContent: string;
    jsContent: string;
    previewUrl: string;
    technologies: string[];
    seoOptimized: boolean;
    responsive: boolean;
    deploymentReady: boolean;
    generatedAt: string;
  }>;
  services?: Array<{
    id: number;
    title: string;
    summary: string;
    price: string;
    priceMode: string;
    serviceType: string;
    billingPlan: string;
    tags: string[];
    organizationName: string;
    organizationSector: string;
    organizationAddress?: string;
    organizationPhone?: string;
    organizationEmail?: string;
    organizationWebsite?: string;
    isAIReplaceable: boolean;
    consumptionType: string;
    pageUrl: string;
    searchQuery: string;
    searchDate: string;
  }>;
  organizations?: Array<{
    id: number;
    name: string;
    sector: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    legalForm?: string;
    siret?: string;
    tvaNume?: string;
    services: Array<{
      id: number;
      title: string;
      summary?: string;
      serviceType: string;
      price: string;
      paymentMode: string;
      tags: string[];
    }>;
    servicesCount: number;
    searchQuery: string;
    searchLocation?: string;
    searchSector?: string;
    searchDate: string;
  }>;
  prestataires?: Array<{
    id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    emailVerified: boolean;
    createdAt: string;
    organization?: {
      id: string;
      name: string;
      sector: string;
      description?: string;
      address?: string;
      phone?: string;
      email?: string;
      website?: string;
      legalForm?: string;
      siret?: string;
      services: Array<{
        id: string;
        title: string;
        summary?: string;
        serviceType: string;
        lowerPrice: number;
        upperPrice: number;
        paymentMode: string;
        tags: string[];
      }>;
      servicesCount: number;
    };
    pageUrl: string;
    searchQuery: string;
    searchDate: string;
  }>;
}

// Configuration détaillée des outils pour chaque agent
const AGENTS_TOOLS_CONFIG = {
  basic: {
    id: "cuisinier",
    name: "Chef Cuisinier IA Basic",
    description: "Agent culinaire essentiel : recettes, nutrition, techniques",
    totalTools: 7,
    icon: "👨‍🍳",
    color: "bg-blue-500",
    tools: [
      {
        name: "Recherche de recettes",
        description: "Recettes via APIs multiples (Marmiton, Spoonacular, ...)",
        category: "Recettes",
      },
      {
        name: "Calcul nutritionnel",
        description: "Valeurs nutritionnelles complètes avec conseils santé",
        category: "Nutrition",
      },
      {
        name: "Substitution ingrédients",
        description: "Alternatives pour allergies, régimes et disponibilité",
        category: "Adaptations",
      },
      {
        name: "Conversion unités",
        description: "Poids, volume, température avec densités",
        category: "Conversions",
      },
      {
        name: "Planification menus",
        description: "Menus équilibrés avec listes de courses et budgets",
        category: "Planification",
      },
      {
        name: "Accords mets-vins",
        description: "Suggestions de bouteilles et conseils service",
        category: "Accords",
      },
      {
        name: "Techniques culinaires",
        description: "Explications détaillées et astuces chef",
        category: "Techniques",
      },
    ],
  },
  premium: {
    id: "cuisinier-premium",
    name: "Chef Cuisinier IA Premium",
    description:
      "Agent culinaire + création visuelle : logos, images, PDFs, templates",
    totalTools: 13,
    icon: "👨‍🍳",
    color: "bg-purple-500",
    badge: "Premium",
    tools: [
      // Outils Basic hérités
      {
        name: "Recherche de recettes",
        description: "Recettes via APIs multiples",
        category: "Basic - Recettes",
        inherited: true,
      },
      {
        name: "Calcul nutritionnel",
        description: "Valeurs nutritionnelles complètes",
        category: "Basic - Nutrition",
        inherited: true,
      },
      {
        name: "Substitution ingrédients",
        description: "Alternatives pour allergies et régimes",
        category: "Basic - Adaptations",
        inherited: true,
      },
      {
        name: "Conversion unités",
        description: "Poids, volume, température",
        category: "Basic - Conversions",
        inherited: true,
      },
      {
        name: "Planification menus",
        description: "Menus équilibrés avec listes de courses",
        category: "Basic - Planification",
        inherited: true,
      },
      {
        name: "Accords mets-vins",
        description: "Suggestions de bouteilles",
        category: "Basic - Accords",
        inherited: true,
      },
      {
        name: "Techniques culinaires",
        description: "Explications détaillées",
        category: "Basic - Techniques",
        inherited: true,
      },
      // Outils Premium
      {
        name: "Génération de logos",
        description: "Logos professionnels pour restaurants",
        category: "Premium - Branding",
        premium: true,
      },
      {
        name: "Images culinaires",
        description: "Images de plats HD professionnelles",
        category: "Premium - Visuel",
        premium: true,
      },
      {
        name: "Création de PDFs",
        description: "Documents PDF culinaires",
        category: "Premium - Documents",
        premium: true,
      },
      {
        name: "Templates réseaux sociaux",
        description: "Templates Instagram, Facebook",
        category: "Premium - Marketing",
        premium: true,
      },
      {
        name: "Génération de vidéos",
        description: "Concepts de vidéos courtes culinaires",
        category: "Premium - Contenu",
        premium: true,
      },
      {
        name: "Étiquettes produits",
        description: "Étiquettes pour produits alimentaires",
        category: "Premium - Packaging",
        premium: true,
      },
    ],
  },
  business: {
    id: "cuisinier-business",
    name: "Chef Cuisinier IA Business",
    description:
      "Agent culinaire complet + services pro : recherche orgas, business plans, analyses",
    totalTools: 21,
    icon: "👨‍🍳",
    color: "bg-orange-500",
    badge: "Business",
    tools: [
      // Outils Basic hérités
      {
        name: "Recherche de recettes",
        description: "Recettes via APIs multiples",
        category: "Basic - Recettes",
        inherited: true,
      },
      {
        name: "Calcul nutritionnel",
        description: "Valeurs nutritionnelles complètes",
        category: "Basic - Nutrition",
        inherited: true,
      },
      {
        name: "Substitution ingrédients",
        description: "Alternatives pour allergies",
        category: "Basic - Adaptations",
        inherited: true,
      },
      {
        name: "Conversion unités",
        description: "Poids, volume, température",
        category: "Basic - Conversions",
        inherited: true,
      },
      {
        name: "Planification menus",
        description: "Menus équilibrés",
        category: "Basic - Planification",
        inherited: true,
      },
      {
        name: "Accords mets-vins",
        description: "Suggestions de bouteilles",
        category: "Basic - Accords",
        inherited: true,
      },
      {
        name: "Techniques culinaires",
        description: "Explications détaillées",
        category: "Basic - Techniques",
        inherited: true,
      },
      // Outils Premium hérités
      {
        name: "Génération de logos",
        description: "Logos professionnels",
        category: "Premium - Branding",
        inherited: true,
      },
      {
        name: "Images culinaires",
        description: "Images de plats HD",
        category: "Premium - Visuel",
        inherited: true,
      },
      {
        name: "Création de PDFs",
        description: "Documents PDF",
        category: "Premium - Documents",
        inherited: true,
      },
      {
        name: "Templates réseaux sociaux",
        description: "Templates marketing",
        category: "Premium - Marketing",
        inherited: true,
      },
      {
        name: "Génération de vidéos",
        description: "Concepts de vidéos",
        category: "Premium - Contenu",
        inherited: true,
      },
      {
        name: "Étiquettes produits",
        description: "Étiquettes alimentaires",
        category: "Premium - Packaging",
        inherited: true,
      },
      // Outils Business exclusifs
      {
        name: "Génération de sites web",
        description: "Sites web complets pour restaurants",
        category: "Business - Web",
        business: true,
      },
      {
        name: "Recherche organisations",
        description: "Organisations culinaires par secteur",
        category: "Business - Recherche",
        business: true,
      },
      {
        name: "Recherche services",
        description: "Services culinaires avec filtres avancés",
        category: "Business - Services",
        business: true,
      },
      {
        name: "Recherche prestataires",
        description: "Prestataires culinaires qualifiés",
        category: "Business - Recherche",
        business: true,
      },
      {
        name: "Calculateur de coûts",
        description: "Coûts et rentabilité restaurant",
        category: "Business - Finance",
        business: true,
      },
      {
        name: "Business plans",
        description: "Plans d'affaires complets",
        category: "Business - Stratégie",
        business: true,
      },
      {
        name: "Analyse de marché",
        description: "Analyses concurrentielles",
        category: "Business - Analyse",
        business: true,
      },
      {
        name: "Exécution automatique",
        description: "Exécution de services IA compatible",
        category: "Business - Automatisation",
        business: true,
      },
    ],
  },
};

export default function ChatPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId] = useState(() => uuidv4());
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamController, setStreamController] = useState<AbortController | null>(null);
  const [useStreaming, setUseStreaming] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewingWebsite, setPreviewingWebsite] = useState<any>(null);

  // Prompts par défaut pour chaque agent
  const getDefaultPrompts = (agentId: string): string[] => {
    switch (agentId) {
      case "cuisinier":
        return [
          "Trouve-moi une recette de coq au vin traditionnelle avec du vin rouge",
          "Calcule les calories et macronutriments d'une portion de ratatouille",
          "Par quoi remplacer les œufs dans une recette de gâteau au chocolat ?",
          "Quel vin servir avec un magret de canard aux figues ?",
        ];
      case "cuisinier-premium":
        return [
          "Crée un logo moderne pour ma brasserie artisanale 'Houblon d'Or'",
          "Génère une image HD d'un burger gourmet avec des frites truffées",
          "Template Instagram story pour promouvoir mon nouveau plat du jour",
          "Crée une étiquette pour mes confitures artisanales aux fruits rouges",
        ];
      case "cuisinier-business":
        return [
          "Crée un site web complet pour mon restaurant pizzeria napolitaine",
          "Trouve moi un service qui propose une formation culinaire pour mon restaurant",
          "Calcule les coûts d'ouverture d'une boulangerie-pâtisserie de 80m²",
          "Génère un business plan complet pour mon food truck gourmet",
        ];
      default:
        return [
          "Comment puis-je t'aider aujourd'hui ?",
          "Quelle est ta spécialité culinaire ?",
          "Peux-tu me donner des conseils cuisine ?",
        ];
    }
  };

  // Fonction pour obtenir l'icône et les couleurs de l'agent
  const getAgentConfig = (agentId: string) => {
    switch (agentId) {
      case "cuisinier":
        return {
          icon: ChefHat,
          bgColor: "bg-gradient-to-br from-orange-500 to-red-600",
          textColor: "text-orange-600",
          borderColor: "border-orange-200",
          hoverColor: "hover:bg-orange-50"
        };
      case "cuisinier-premium":
        return {
          icon: Crown,
          bgColor: "bg-gradient-to-br from-purple-500 to-pink-600",
          textColor: "text-purple-600",
          borderColor: "border-purple-200",
          hoverColor: "hover:bg-purple-50"
        };
      case "cuisinier-business":
        return {
          icon: Building2,
          bgColor: "bg-gradient-to-br from-blue-500 to-cyan-600",
          textColor: "text-blue-600",
          borderColor: "border-blue-200",
          hoverColor: "hover:bg-blue-50"
        };
      default:
        return {
          icon: Bot,
          bgColor: "bg-gradient-to-br from-gray-500 to-gray-600",
          textColor: "text-gray-600",
          borderColor: "border-gray-200",
          hoverColor: "hover:bg-gray-50"
        };
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    sendMessageWithText(prompt);
  };

  const sendMessageWithText = async (text: string) => {
    if (!text.trim() || !selectedAgent || isLoading || isStreaming) return;

    // Créer un nouveau AbortController pour cette requête
    const controller = new AbortController();
    setStreamController(controller);

    const userMessage: Message = {
      id: uuidv4(),
      content: text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setIsStreaming(true);
    setError(null);

    // Timeout de sécurité (45 secondes)
    const timeoutId = setTimeout(() => {
      console.warn('⏰ Timeout de streaming atteint, arrêt forcé');
      stopStreaming();
      setError("La réponse prend trop de temps. Veuillez réessayer.");
    }, 45000);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          agentId: selectedAgent.id,
          threadId,
          useStream: useStreaming,
        }),
        signal: controller.signal, // Ajouter le signal d'abort
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      if (useStreaming && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let agentMessage: Message = {
          id: uuidv4(),
          content: "",
          sender: "agent",
          timestamp: new Date(),
          agentName: selectedAgent.name,
        };

        setMessages((prev) => [...prev, agentMessage]);

        let buffer = "";
        let streamEnded = false;
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              console.log('✅ Stream terminé naturellement');
              streamEnded = true;
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            
            // Garder la dernière ligne incomplète dans le buffer
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.trim()) {
                try {
                  const data = JSON.parse(line);
                  
                  // Vérifier si c'est un signal de fin
                  if (data.done === true || data.finished === true || data.end === true) {
                    console.log('✅ Signal de fin reçu:', data);
                    streamEnded = true;
                    break;
                  }
                  
                  if (data.content) {
                    agentMessage.content += data.content;
                    setMessages((prev) => 
                      prev.map((msg) => 
                        msg.id === agentMessage.id 
                          ? { ...msg, content: agentMessage.content }
                          : msg
                      )
                    );
                  }

                  // Traiter les métadonnées une seule fois quand elles arrivent
                  let hasMetadata = false;
                  
                  if (data.images && data.images.length > 0) {
                    agentMessage.images = data.images;
                    hasMetadata = true;
                  }
                  if (data.videos && data.videos.length > 0) {
                    agentMessage.videos = data.videos;
                    hasMetadata = true;
                  }
                  if (data.pdfs && data.pdfs.length > 0) {
                    agentMessage.pdfs = data.pdfs;
                    hasMetadata = true;
                  }
                  if (data.websites && data.websites.length > 0) {
                    agentMessage.websites = data.websites;
                    hasMetadata = true;
                  }
                  if (data.services && data.services.length > 0) {
                    agentMessage.services = data.services;
                    hasMetadata = true;
                  }
                  if (data.organizations && data.organizations.length > 0) {
                    agentMessage.organizations = data.organizations;
                    hasMetadata = true;
                  }
                  if (data.prestataires && data.prestataires.length > 0) {
                    agentMessage.prestataires = data.prestataires;
                    hasMetadata = true;
                  }

                  // Mettre à jour le message avec les métadonnées
                  if (hasMetadata) {
                    setMessages((prev) => 
                      prev.map((msg) => 
                        msg.id === agentMessage.id 
                          ? { ...msg, ...agentMessage }
                          : msg
                      )
                    );
                  }
                } catch (e) {
                  // Ignorer les erreurs de parsing JSON pour les lignes incomplètes
                  console.debug("Ligne non-JSON ignorée:", line);
                }
              }
            }
            
            // Sortir de la boucle externe si le stream est terminé
            if (streamEnded) {
              break;
            }
          }
          
          console.log('🏁 Streaming terminé, nettoyage...');
        } catch (streamError) {
          if (streamError instanceof Error && streamError.name === 'AbortError') {
            console.log('🛑 Streaming interrompu par l\'utilisateur');
          } else {
            console.error("Erreur de streaming:", streamError);
            setError("Erreur de connexion au serveur");
          }
        } finally {
          // Nettoyer le reader
          try {
            reader.releaseLock();
          } catch (e) {
            // Ignorer les erreurs de nettoyage
          }
        }
      } else {
        const data = await response.json();
        const agentMessage: Message = {
          id: uuidv4(),
          content: data.message || "Désolé, je n'ai pas pu traiter votre demande.",
          sender: "agent",
          timestamp: new Date(),
          agentName: selectedAgent.name,
          images: data.images,
          videos: data.videos,
          pdfs: data.pdfs,
          websites: data.websites,
          services: data.services,
          organizations: data.organizations,
          prestataires: data.prestataires,
        };
        setMessages((prev) => [...prev, agentMessage]);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('🛑 Requête interrompue par l\'utilisateur');
      } else {
        console.error("Erreur lors de l'envoi du message:", err);
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      // Nettoyer le timeout
      clearTimeout(timeoutId);
      
      // Réinitialiser les états
      setIsLoading(false);
      setIsStreaming(false);
      setStreamController(null);
      
      console.log('🧹 Nettoyage terminé');
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const loadAgents = async () => {
      try {
        const response = await fetch("/api/agents");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des agents");
        }
        const agentsData = await response.json();
        
        if (Array.isArray(agentsData) && agentsData.length > 0) {
          setAgents(agentsData);
          
                     // Sélectionner automatiquement le premier agent accessible
           const accessibleAgent = agentsData.find(agent => 
             hasAccessToAgent(user, agent.type as AgentType)
           );
          
          if (accessibleAgent) {
            setSelectedAgent(accessibleAgent);
          } else if (agentsData.length > 0) {
            // Si aucun agent n'est accessible, sélectionner le premier quand même
            setSelectedAgent(agentsData[0]);
          }
        } else {
          // Fallback avec agents par défaut
          const defaultAgents = [
            {
              id: "cuisinier",
              name: "Chef Cuisinier IA",
              description: "Votre assistant culinaire pour recettes, conseils de cuisine et techniques culinaires",
              type: "basic" as AgentType,
            },
            {
              id: "cuisinier-premium", 
              name: "Chef Cuisinier IA Premium",
              description: "Création de contenus visuels, logos, affiches et sites web pour votre activité culinaire",
              type: "premium" as AgentType,
            },
            {
              id: "cuisinier-business",
              name: "Chef Cuisinier IA Business", 
              description: "Recherche de services, prestataires et outils business pour professionnels de la restauration",
              type: "business" as AgentType,
            },
          ];
          
          setAgents(defaultAgents);
          
                     const accessibleAgent = defaultAgents.find(agent => 
             hasAccessToAgent(user, agent.type)
           );
          
          setSelectedAgent(accessibleAgent || defaultAgents[0]);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des agents:", err);
        setError("Impossible de charger les agents. Veuillez rafraîchir la page.");
        
        // Fallback avec agents par défaut en cas d'erreur
        const defaultAgents = [
          {
            id: "cuisinier",
            name: "Chef Cuisinier IA",
            description: "Votre assistant culinaire pour recettes, conseils de cuisine et techniques culinaires",
            type: "basic" as AgentType,
          },
        ];
        
        setAgents(defaultAgents);
        setSelectedAgent(defaultAgents[0]);
      }
    };

    loadAgents();
  }, [isAuthenticated, authLoading, router, user?.subscriptionPlan]);

  const sendMessage = async () => {
    await sendMessageWithText(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  // Fonction pour arrêter le streaming
  const stopStreaming = () => {
    if (streamController) {
      streamController.abort();
      setStreamController(null);
    }
    setIsStreaming(false);
    setIsLoading(false);
  };

  // Fonction pour copier du texte
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Fonction pour télécharger un fichier
  const downloadFile = (data: string, filename: string, mimeType: string = 'text/html') => {
    console.log('📥 downloadFile appelée:', { filename, mimeType, dataLength: data.length });
    
    try {
      let blob: Blob;
      
      // Si c'est un PDF (base64), le convertir correctement
      if (mimeType === 'application/pdf' && !data.startsWith('data:')) {
        console.log('🔄 Conversion base64 vers PDF...');
        
        try {
          // Données base64 brutes
          const binaryString = window.atob(data);
          console.log('✅ Base64 décodé, longueur:', binaryString.length);
          
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          blob = new Blob([bytes], { type: mimeType });
          console.log('✅ Blob PDF créé, taille:', blob.size);
        } catch (base64Error) {
          console.error('❌ Erreur décodage base64:', base64Error);
          alert('Erreur: Données PDF corrompues');
          return;
        }
      } else if (data.startsWith('data:')) {
        console.log('🔄 Traitement Data URL...');
        // Data URL
        const response = fetch(data);
        response.then(res => res.blob()).then(blob => {
          console.log('✅ Blob créé depuis Data URL, taille:', blob.size);
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          console.log('✅ Téléchargement Data URL déclenché');
        }).catch(err => {
          console.error('❌ Erreur traitement Data URL:', err);
          alert('Erreur lors du traitement du fichier');
        });
        return;
      } else {
        console.log('🔄 Création blob texte...');
        // Texte normal
        blob = new Blob([data], { type: mimeType });
        console.log('✅ Blob texte créé, taille:', blob.size);
      }
      
      console.log('🔄 Création du lien de téléchargement...');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      
      console.log('🔄 Ajout au DOM et clic...');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('✅ Téléchargement déclenché avec succès!');
    } catch (error) {
      console.error('❌ Erreur lors du téléchargement:', error);
      alert(`Erreur lors du téléchargement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  // Fonction pour télécharger une image depuis une URL
  const downloadImageFromUrl = async (imageUrl: string, filename: string) => {
    console.log('🖼️ Tentative de téléchargement image:', { imageUrl, filename });
    
    try {
      // Méthode 1: Essayer avec fetch (CORS)
      console.log('🔄 Méthode 1: Fetch avec CORS...');
      const response = await fetch(imageUrl, {
        mode: 'cors',
        headers: {
          'Accept': 'image/*',
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        console.log('✅ Image téléchargée avec fetch:', filename);
        return;
      } else {
        console.warn('❌ Fetch échoué:', response.status, response.statusText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (fetchError) {
      console.warn('❌ Erreur fetch:', fetchError);
      
      try {
        // Méthode 2: Essayer avec fetch no-cors
        console.log('🔄 Méthode 2: Fetch no-cors...');
        const response = await fetch(imageUrl, {
          mode: 'no-cors'
        });
        
        if (response.type === 'opaque') {
          // Pour no-cors, on ne peut pas lire la réponse, donc on utilise une approche différente
          throw new Error('Mode no-cors ne permet pas de lire les données');
        }
      } catch (noCorsError) {
        console.warn('❌ Erreur no-cors:', noCorsError);
        
        try {
          // Méthode 3: Proxy avec canvas (pour certaines images)
          console.log('🔄 Méthode 3: Canvas proxy...');
          await downloadImageWithCanvas(imageUrl, filename);
          return;
        } catch (canvasError) {
          console.warn('❌ Erreur canvas:', canvasError);
          
          // Méthode 4: Fallback - lien direct
          console.log('🔄 Méthode 4: Lien direct...');
          downloadImageWithLink(imageUrl, filename);
        }
      }
    }
  };

  // Méthode alternative avec canvas
  const downloadImageWithCanvas = (imageUrl: string, filename: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.width;
          canvas.height = img.height;
          
          ctx?.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
              console.log('✅ Image téléchargée avec canvas:', filename);
              resolve();
            } else {
              reject(new Error('Impossible de créer le blob'));
            }
          }, 'image/png');
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Impossible de charger l\'image'));
      };
      
      img.src = imageUrl;
    });
  };

  // Méthode de fallback avec lien direct
  const downloadImageWithLink = (imageUrl: string, filename: string) => {
    console.log('🔗 Utilisation du lien direct...');
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = filename;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log('✅ Lien de téléchargement déclenché:', filename);
  };

  // Fonction alternative pour télécharger un PDF via Data URL
  const downloadPdfAlternative = (base64Data: string, filename: string) => {
    console.log('🔄 Méthode alternative PDF...');
    try {
      const dataUrl = `data:application/pdf;base64,${base64Data}`;
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      console.log('✅ Téléchargement alternatif déclenché');
    } catch (error) {
      console.error('❌ Erreur méthode alternative:', error);
      alert('Erreur avec la méthode alternative');
    }
  };

  // Fonction de test pour vérifier le téléchargement PDF
  const testPdfDownload = () => {
    const testPdfData = "JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL0xlbmd0aCA1IDAKL0ZpbHRlciBbL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlXQo+PgpzdHJlYW0K"; // Base64 PDF test
    downloadFile(testPdfData, "test.pdf", "application/pdf");
  };

  // Fonction pour créer une prévisualisation de site web
  const previewWebsite = (website: any) => {
    // Créer le HTML complet avec CSS et JS intégrés
    const fullHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${website.title || website.restaurantName}</title>
    <style>
        ${website.cssContent || ''}
    </style>
</head>
<body>
    ${website.htmlContent}
    <script>
        ${website.jsContent || ''}
    </script>
</body>
</html>`;

    // Créer un blob et ouvrir dans un nouvel onglet
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    
    // Nettoyer l'URL après un délai
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
    
    return newWindow;
  };

  // Fonction pour télécharger un site web complet
  const downloadWebsite = (website: any) => {
    const fullHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${website.title || website.restaurantName}</title>
    <style>
        ${website.cssContent || ''}
    </style>
</head>
<body>
    ${website.htmlContent}
    <script>
        ${website.jsContent || ''}
    </script>
</body>
</html>`;

    const filename = `${website.restaurantName?.toLowerCase().replace(/\s+/g, '-') || 'website'}.html`;
    downloadFile(fullHtml, filename, 'text/html');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            <span className="text-gray-600">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="h-[calc(100vh-64px)] flex bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-30 w-80 h-full bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out flex flex-col`}>
          {/* Header Sidebar */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <h1 className="text-xl font-bold text-gray-900">LetHimCookAI</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Agent Selection */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Choisir un Assistant</h2>
            <div className="space-y-2">
              {agents.map((agent) => {
                                 const config = getAgentConfig(agent.id);
                 const Icon = config.icon;
                 const hasAccess = hasAccessToAgent(user, agent.type as AgentType);
                
                return (
                  <button
                    key={agent.id}
                    onClick={() => {
                      if (hasAccess) {
                        setSelectedAgent(agent);
                        setSidebarOpen(false);
                      }
                    }}
                    className={`w-full p-3 rounded-xl border-2 transition-all ${
                      selectedAgent?.id === agent.id
                        ? `${config.borderColor} ${config.bgColor} text-white`
                        : hasAccess
                        ? `border-gray-200 ${config.hoverColor} text-gray-700`
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!hasAccess}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        selectedAgent?.id === agent.id ? 'bg-white/20' : hasAccess ? config.bgColor : 'bg-gray-300'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          selectedAgent?.id === agent.id ? 'text-white' : hasAccess ? 'text-white' : 'text-gray-500'
                        }`} />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm">{agent.name}</div>
                        <div className={`text-xs mt-1 ${
                          selectedAgent?.id === agent.id ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {agent.description}
                        </div>
                        {!hasAccess && (
                          <div className="text-xs text-orange-500 mt-1 font-medium">
                            Abonnement requis
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Info */}
          <div className="mt-auto p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{user?.firstName || 'Utilisateur'}</div>
                <div className="text-sm text-gray-500 capitalize">
                  Plan {user?.subscriptionPlan?.toLowerCase() || 'Free'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay pour mobile */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="h-5 w-5" />
              </button>
              {selectedAgent && (
                <>
                  <div className={`p-2 rounded-lg ${getAgentConfig(selectedAgent.id).bgColor}`}>
                    {(() => {
                      const Icon = getAgentConfig(selectedAgent.id).icon;
                      return <Icon className="h-5 w-5 text-white" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedAgent.name}</h2>
                    <p className="text-sm text-gray-500">{selectedAgent.description}</p>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={clearChat}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && selectedAgent && (
              <div className="text-center py-12">
                <div className={`inline-flex p-4 rounded-full ${getAgentConfig(selectedAgent.id).bgColor} mb-4`}>
                  {(() => {
                    const Icon = getAgentConfig(selectedAgent.id).icon;
                    return <Icon className="h-8 w-8 text-white" />;
                  })()}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Bonjour ! Je suis {selectedAgent.name}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {selectedAgent.description}
                </p>
                <div className="grid gap-3 max-w-2xl mx-auto">
                  {getDefaultPrompts(selectedAgent.id).map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt)}
                      className="p-4 text-left bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <Sparkles className="h-5 w-5 text-orange-500" />
                        <span className="text-gray-700">{prompt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex space-x-3 max-w-4xl w-full ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === "user" 
                      ? "bg-gradient-to-br from-blue-500 to-blue-600" 
                      : selectedAgent ? getAgentConfig(selectedAgent.id).bgColor : "bg-gray-500"
                  }`}>
                    {message.sender === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      (() => {
                        const Icon = selectedAgent ? getAgentConfig(selectedAgent.id).icon : Bot;
                        return <Icon className="h-4 w-4 text-white" />;
                      })()
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`rounded-2xl px-4 py-3 flex-1 min-w-0 ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "bg-white border border-gray-200"
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>

                    {/* Images */}
                    {message.images && message.images.length > 0 && (
                      <div className="mt-4 grid gap-3">
                        {message.images.map((image, index) => (
                                                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-3">
                              <ImageIcon className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">{image.title || 'Image générée'}</span>
                            </div>
                            <div className="overflow-hidden rounded-lg">
                              <img
                                src={image.url}
                                alt={image.alt}
                                className="w-full h-auto max-w-full object-contain shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                                style={{ maxHeight: '500px' }}
                                onClick={() => window.open(image.url, '_blank')}
                                title="Cliquer pour ouvrir en grand"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Videos */}
                    {message.videos && message.videos.length > 0 && (
                      <div className="mt-4 grid gap-3">
                        {message.videos.map((video, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <Video className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">{video.title}</span>
                            </div>
                            <div className="aspect-video rounded-lg overflow-hidden">
                              <iframe
                                src={video.embedUrl}
                                title={video.title}
                                className="w-full h-full"
                                allowFullScreen
                              />
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              {video.channel} • {video.views} • {video.duration}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* PDFs */}
                    {message.pdfs && message.pdfs.length > 0 && (
                      <div className="mt-4 grid gap-3">
                        {message.pdfs.map((pdf, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-red-500" />
                                <div>
                                  <div className="font-medium text-gray-900">{pdf.title}</div>
                                  <div className="text-sm text-gray-500">{pdf.documentType} • {pdf.fileSize}</div>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                {pdf.data && (
                                  <>
                                    <button
                                      onClick={() => {
                                        console.log('🔍 DEBUG PDF:', {
                                          filename: pdf.filename,
                                          hasData: !!pdf.data,
                                          dataLength: pdf.data?.length,
                                          dataStart: pdf.data?.substring(0, 50),
                                          mimeType: pdf.mimeType
                                        });
                                        try {
                                          downloadFile(pdf.data!, pdf.filename, pdf.mimeType || 'application/pdf');
                                          console.log('✅ Fonction downloadFile appelée');
                                        } catch (error) {
                                          console.error('❌ Erreur lors de l\'appel downloadFile:', error);
                                        }
                                      }}
                                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                      title="Télécharger le PDF"
                                    >
                                      <Download className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        console.log('🔄 Essai méthode alternative...');
                                        downloadPdfAlternative(pdf.data!, pdf.filename);
                                      }}
                                      className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs"
                                      title="Méthode alternative"
                                    >
                                      Alt
                                    </button>
                                  </>
                                )}
                                {pdf.url && (
                                  <button
                                    onClick={() => window.open(pdf.url, '_blank')}
                                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                            {pdf.previewUrl && (
                              <img
                                src={pdf.previewUrl}
                                alt={pdf.alt}
                                className="w-full rounded-lg shadow-sm"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Websites */}
                    {message.websites && message.websites.length > 0 && (
                      <div className="mt-4 grid gap-3">
                        {message.websites.map((website, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <Globe className="h-5 w-5 text-blue-500" />
                              <div>
                                <div className="font-medium text-gray-900">{website.title}</div>
                                <div className="text-sm text-gray-500">{website.restaurantName} • {website.websiteType}</div>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <div className="text-sm text-gray-600 mb-2">Fonctionnalités:</div>
                              <div className="flex flex-wrap gap-1">
                                {website.features.map((feature, i) => (
                                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="mb-3">
                              <div className="text-sm text-gray-600 mb-2">Technologies:</div>
                              <div className="flex flex-wrap gap-1">
                                {website.technologies.map((tech, i) => (
                                  <span key={i} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex space-x-3">
                              <button
                                onClick={() => previewWebsite(website)}
                                className="flex-1 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                              >
                                <ExternalLink className="h-4 w-4" />
                                <span>Prévisualiser</span>
                              </button>
                              <button
                                onClick={() => setPreviewingWebsite(previewingWebsite?.title === website.title ? null : website)}
                                className="flex-1 p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2"
                              >
                                <Bot className="h-4 w-4" />
                                <span>{previewingWebsite?.title === website.title ? 'Masquer' : 'Voir ici'}</span>
                              </button>
                              <button
                                onClick={() => downloadWebsite(website)}
                                className="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                              >
                                <Download className="h-4 w-4" />
                                <span>Télécharger</span>
                              </button>
                            </div>
                            
                            {/* Prévisualisation intégrée */}
                            {previewingWebsite?.title === website.title && (
                              <div className="mt-4 border rounded-lg overflow-hidden">
                                <div className="bg-gray-100 px-3 py-2 flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">Prévisualisation</span>
                                  <button
                                    onClick={() => setPreviewingWebsite(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="bg-white">
                                  <iframe
                                    srcDoc={`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${website.title || website.restaurantName}</title>
    <style>
        ${website.cssContent || ''}
    </style>
</head>
<body>
    ${website.htmlContent}
    <script>
        ${website.jsContent || ''}
    </script>
</body>
</html>`}
                                    className="w-full h-96 border-0"
                                    title={`Prévisualisation de ${website.restaurantName}`}
                                    sandbox="allow-scripts allow-same-origin"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Services */}
                    {message.services && message.services.length > 0 && (
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 flex items-center">
                            <Building className="h-5 w-5 mr-2 text-purple-500" />
                            Services trouvés ({message.services.length})
                          </h4>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          {message.services.map((service, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                                    <Building className="h-5 w-5 text-purple-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{service.title}</div>
                                    <div className="text-sm text-gray-500">{service.organizationName}</div>
                                    <div className="text-xs text-gray-400">{service.organizationSector}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-semibold text-green-600">{service.price}</div>
                                  <div className="text-xs text-gray-500">{service.priceMode}</div>
                                </div>
                              </div>

                              {service.summary && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.summary}</p>
                              )}

                              {service.tags && service.tags.length > 0 && (
                                <div className="mb-3">
                                  <div className="flex flex-wrap gap-1">
                                    {service.tags.slice(0, 4).map((tag, tagIndex) => (
                                      <span key={tagIndex} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                        {tag}
                                      </span>
                                    ))}
                                    {service.tags.length > 4 && (
                                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                        +{service.tags.length - 4}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="border-t pt-3 mt-3">
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                                  <div className="flex items-center">
                                    <span className="font-medium">Type:</span>
                                    <span className="ml-1">{service.serviceType}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium">Plan:</span>
                                    <span className="ml-1">{service.billingPlan}</span>
                                  </div>
                                  {service.organizationAddress && (
                                    <div className="flex items-center col-span-2">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      <span className="truncate">{service.organizationAddress}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => window.open(service.pageUrl, '_blank')}
                                    className="flex-1 p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-1 text-sm"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    <span>Voir le service</span>
                                  </button>
                                  {service.organizationEmail && (
                                    <button
                                      onClick={() => window.open(`mailto:${service.organizationEmail}`, '_blank')}
                                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                      <Mail className="h-4 w-4" />
                                    </button>
                                  )}
                                  {service.organizationWebsite && (
                                    <button
                                      onClick={() => window.open(service.organizationWebsite, '_blank')}
                                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                      <Globe className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Organizations */}
                    {message.organizations && message.organizations.length > 0 && (
                      <div className="mt-4 grid gap-3">
                        {message.organizations.map((org, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <Building2 className="h-5 w-5 text-indigo-500" />
                              <div>
                                <div className="font-medium text-gray-900">{org.name}</div>
                                <div className="text-sm text-gray-500">{org.sector}</div>
                              </div>
                            </div>
                            {org.description && (
                              <p className="text-sm text-gray-600 mb-2">{org.description}</p>
                            )}
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-500">{org.servicesCount} services</div>
                              <div className="flex space-x-2">
                                {org.website && (
                                  <button
                                    onClick={() => window.open(org.website, '_blank')}
                                    className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Prestataires */}
                    {message.prestataires && message.prestataires.length > 0 && (
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 flex items-center">
                            <Users className="h-5 w-5 mr-2 text-cyan-500" />
                            Prestataires trouvés ({message.prestataires.length})
                          </h4>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          {message.prestataires.map((prestataire, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-semibold text-cyan-700">
                                      {prestataire.name[0].toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{prestataire.name}</div>
                                    <div className="text-sm text-gray-500">{prestataire.email}</div>
                                    <div className="flex items-center space-x-1 mt-1">
                                      {prestataire.emailVerified ? (
                                        <div className="flex items-center text-xs text-green-600">
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                          Vérifié
                                        </div>
                                      ) : (
                                        <div className="flex items-center text-xs text-orange-600">
                                          <XCircle className="h-3 w-3 mr-1" />
                                          Non vérifié
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                  Depuis {new Date(prestataire.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                                </div>
                              </div>

                              {prestataire.organization && (
                                <div className="border-t pt-3 mt-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <Building2 className="h-4 w-4 text-gray-500" />
                                      <span className="font-medium text-gray-900">{prestataire.organization.name}</span>
                                    </div>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                      {prestataire.organization.sector}
                                    </span>
                                  </div>
                                  
                                  {prestataire.organization.description && (
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                      {prestataire.organization.description}
                                    </p>
                                  )}

                                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                                    {prestataire.organization.address && (
                                      <div className="flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        <span className="truncate">{prestataire.organization.address}</span>
                                      </div>
                                    )}
                                    {prestataire.organization.phone && (
                                      <div className="flex items-center">
                                        <Phone className="h-3 w-3 mr-1" />
                                        <span>{prestataire.organization.phone}</span>
                                      </div>
                                    )}
                                  </div>

                                  {prestataire.organization.services && prestataire.organization.services.length > 0 && (
                                    <div className="mb-3">
                                      <div className="text-xs font-medium text-gray-700 mb-2">
                                        Services ({prestataire.organization.servicesCount})
                                      </div>
                                      <div className="space-y-2">
                                        {prestataire.organization.services.slice(0, 2).map((service, serviceIndex) => (
                                          <div key={serviceIndex} className="bg-gray-50 rounded-lg p-2">
                                            <div className="flex justify-between items-start">
                                              <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-900">{service.title}</div>
                                                {service.summary && (
                                                  <div className="text-xs text-gray-600 line-clamp-1 mt-1">{service.summary}</div>
                                                )}
                                                {service.tags && service.tags.length > 0 && (
                                                  <div className="flex flex-wrap gap-1 mt-1">
                                                    {service.tags.slice(0, 2).map((tag, tagIndex) => (
                                                      <span key={tagIndex} className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded">
                                                        {tag}
                                                      </span>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                              <div className="text-right ml-2">
                                                <div className="text-sm font-semibold text-gray-900">
                                                  {service.lowerPrice === service.upperPrice
                                                    ? `${service.lowerPrice}€`
                                                    : `${service.lowerPrice}€ - ${service.upperPrice}€`}
                                                </div>
                                                <div className="text-xs text-gray-500">{service.paymentMode}</div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                        {prestataire.organization.services.length > 2 && (
                                          <div className="text-xs text-gray-500 text-center">
                                            +{prestataire.organization.services.length - 2} autres services
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="flex space-x-2 mt-3">
                                <button
                                  onClick={() => window.open(prestataire.pageUrl, '_blank')}
                                  className="flex-1 p-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center justify-center space-x-1 text-sm"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  <span>Voir le profil</span>
                                </button>
                                {prestataire.organization?.email && (
                                  <button
                                    onClick={() => window.open(`mailto:${prestataire.organization!.email}`, '_blank')}
                                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                  >
                                    <Mail className="h-4 w-4" />
                                  </button>
                                )}
                                {prestataire.organization?.website && (
                                  <button
                                    onClick={() => window.open(prestataire.organization!.website!, '_blank')}
                                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                  >
                                    <Globe className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {(isLoading || isStreaming) && (
              <div className="flex justify-start">
                <div className="flex space-x-3 max-w-4xl">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedAgent ? getAgentConfig(selectedAgent.id).bgColor : "bg-gray-500"
                  }`}>
                    {(() => {
                      const Icon = selectedAgent ? getAgentConfig(selectedAgent.id).icon : Bot;
                      return <Icon className="h-4 w-4 text-white" />;
                    })()}
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {isStreaming ? "En train de répondre..." : "En train de réfléchir..."}
                      </span>
                      {isStreaming && (
                        <button
                          onClick={stopStreaming}
                          className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                        >
                          Arrêter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
            <div className="max-w-4xl mx-auto">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={selectedAgent ? `Parlez avec ${selectedAgent.name}...` : "Sélectionnez un agent pour commencer..."}
                    className="w-full p-4 pr-24 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows={1}
                    style={{ minHeight: '56px', maxHeight: '120px' }}
                    disabled={!selectedAgent || isLoading}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    {selectedAgent?.id === 'cuisinier-premium' && (
                      <label className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 cursor-pointer transition-colors" title="Ajouter une image">
                        <ImageIcon className="h-5 w-5" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Pour l'instant, on affiche juste un message
                              // TODO: Implémenter l'upload d'images
                              alert('Fonctionnalité d\'upload d\'images en cours de développement...');
                            }
                          }}
                        />
                      </label>
                    )}
                    {isStreaming ? (
                      <button
                        onClick={stopStreaming}
                        className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                        title="Arrêter la génération"
                      >
                        <StopCircle className="h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        onClick={sendMessage}
                        disabled={!inputValue.trim() || !selectedAgent || isLoading}
                        className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
