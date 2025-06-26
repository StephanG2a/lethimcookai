"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { MainLayout } from "@/components/layout/main-layout";
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
  Loader2
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
  const [useStreaming, setUseStreaming] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Prompts par défaut pour chaque agent
  const getDefaultPrompts = (agentId: string): string[] => {
    switch (agentId) {
      case "cuisinier":
        return [
          "Propose-moi une recette simple avec les ingrédients de mon frigo",
          "Comment faire une pâte à crêpes parfaite ?",
          "Donne-moi 3 idées de repas rapides pour ce soir"
        ];
      case "cuisinier-premium":
        return [
          "Crée-moi un logo pour mon restaurant",
          "Génère une affiche publicitaire pour mon menu",
          "Fait-moi un site web vitrine pour ma pizzeria"
        ];
      case "cuisinier-business":
        return [
          "Trouve-moi des services de livraison de repas",
          "Recherche des prestataires pour mon événement culinaire",
          "Calcule les coûts d'ouverture d'un restaurant"
        ];
      default:
        return [
          "Comment puis-je t'aider aujourd'hui ?",
          "Quelle est ta spécialité culinaire ?",
          "Peux-tu me donner des conseils cuisine ?"
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
    if (!text.trim() || !selectedAgent) return;

    const userMessage: Message = {
      id: uuidv4(),
      content: text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

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

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.trim()) {
                try {
                  const data = JSON.parse(line);
                  
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

                  if (data.images) {
                    agentMessage.images = data.images;
                  }
                  if (data.videos) {
                    agentMessage.videos = data.videos;
                  }
                  if (data.pdfs) {
                    agentMessage.pdfs = data.pdfs;
                  }
                  if (data.websites) {
                    agentMessage.websites = data.websites;
                  }
                  if (data.services) {
                    agentMessage.services = data.services;
                  }
                  if (data.organizations) {
                    agentMessage.organizations = data.organizations;
                  }
                  if (data.prestataires) {
                    agentMessage.prestataires = data.prestataires;
                  }

                  if (data.images || data.videos || data.pdfs || data.websites || data.services || data.organizations || data.prestataires) {
                    setMessages((prev) => 
                      prev.map((msg) => 
                        msg.id === agentMessage.id 
                          ? { ...msg, ...agentMessage }
                          : msg
                      )
                    );
                  }
                } catch (e) {
                  // Ignorer les erreurs de parsing JSON
                }
              }
            }
          }
        } catch (streamError) {
          console.error("Erreur de streaming:", streamError);
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
      console.error("Erreur lors de l'envoi du message:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
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

  // Fonction pour copier du texte
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Fonction pour télécharger un fichier
  const downloadFile = (data: string, filename: string, mimeType: string = 'text/html') => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            <span className="text-gray-600">Chargement...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
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
                <div className={`flex space-x-3 max-w-4xl ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
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
                  <div className={`rounded-2xl px-4 py-3 ${
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
                            <div className="flex items-center space-x-2 mb-2">
                              <ImageIcon className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">{image.title || 'Image générée'}</span>
                            </div>
                            <img
                              src={image.url}
                              alt={image.alt}
                              className="w-full rounded-lg shadow-sm"
                            />
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
                                  <button
                                    onClick={() => downloadFile(pdf.data!, pdf.filename, pdf.mimeType || 'application/pdf')}
                                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                  >
                                    <Download className="h-4 w-4" />
                                  </button>
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

                            <div className="flex space-x-2">
                              <button
                                onClick={() => window.open(website.previewUrl, '_blank')}
                                className="flex-1 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                              >
                                <ExternalLink className="h-4 w-4" />
                                <span>Ouvrir</span>
                              </button>
                              <button
                                onClick={() => copyToClipboard(website.htmlContent)}
                                className="flex-1 p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                              >
                                <Copy className="h-4 w-4" />
                                <span>Copier HTML</span>
                              </button>
                              <button
                                onClick={() => downloadFile(website.htmlContent, `${website.restaurantName.toLowerCase().replace(/\s+/g, '-')}.html`)}
                                className="flex-1 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                              >
                                <Download className="h-4 w-4" />
                                <span>Télécharger</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Services */}
                    {message.services && message.services.length > 0 && (
                      <div className="mt-4 grid gap-3">
                        {message.services.map((service, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <Building className="h-5 w-5 text-purple-500" />
                              <div>
                                <div className="font-medium text-gray-900">{service.title}</div>
                                <div className="text-sm text-gray-500">{service.organizationName}</div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{service.summary}</p>
                            <div className="flex items-center justify-between">
                              <div className="text-lg font-semibold text-green-600">{service.price}</div>
                              <button
                                onClick={() => window.open(service.pageUrl, '_blank')}
                                className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
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
                      <div className="mt-4 grid gap-3">
                        {message.prestataires.map((prestataire, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <Users className="h-5 w-5 text-cyan-500" />
                              <div>
                                <div className="font-medium text-gray-900">{prestataire.name}</div>
                                <div className="text-sm text-gray-500">{prestataire.email}</div>
                              </div>
                            </div>
                            {prestataire.organization && (
                              <div className="mb-2">
                                <div className="text-sm font-medium text-gray-700">{prestataire.organization.name}</div>
                                <div className="text-sm text-gray-500">{prestataire.organization.sector}</div>
                              </div>
                            )}
                            <button
                              onClick={() => window.open(prestataire.pageUrl, '_blank')}
                              className="p-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
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
                      <span className="text-sm text-gray-500">En train de réfléchir...</span>
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
                    className="w-full p-4 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows={1}
                    style={{ minHeight: '56px', maxHeight: '120px' }}
                    disabled={!selectedAgent || isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || !selectedAgent || isLoading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
