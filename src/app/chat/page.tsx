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
    data?: string; // Base64 data pour téléchargement direct
    previewUrl?: string;
    filename: string;
    title: string;
    documentType: string;
    style: string;
    fileSize: string;
    pages?: number;
    alt: string;
    type?: string; // "downloadable_pdf" ou "direct_download_pdf"
    mimeType?: string;
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

  // Vérifier l'authentification et gérer les déconnexions
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // Nettoyer l'état local avant redirection
      setMessages([]);
      setError(null);
      setInputValue("");

      // Rediriger vers la page de connexion
      router.replace("/auth/login?redirect=/chat");
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  // Charger les agents disponibles
  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const loadAgents = async () => {
      try {
        const response = await fetch("/api/chat");

        if (response.ok) {
          const agentsData = await response.json();

          // Mapper les agents avec leur type pour le contrôle d'accès
          const mappedAgents = agentsData.map((agent: Agent) => {
            let agentType: AgentType = "basic";
            if (agent.id.includes("premium")) {
              agentType = "premium";
            } else if (agent.id.includes("business")) {
              agentType = "business";
            }

            return {
              ...agent,
              type: agentType,
            };
          });

          setAgents(mappedAgents);

          // Sélectionner le premier agent accessible
          const accessibleAgent = mappedAgents.find((agent: Agent) =>
            hasAccessToAgent(user, agent.type || "basic")
          );

          if (accessibleAgent) {
            setSelectedAgent(accessibleAgent);
          } else if (mappedAgents.length > 0) {
            setSelectedAgent(mappedAgents[0]); // Fallback sur le premier agent
          }
        } else {
          const errorText = await response.text();
          setError(
            `Erreur lors du chargement des agents: ${response.status} - ${errorText}`
          );
        }
      } catch (err) {
        const errorMsg = `Erreur de connexion au serveur: ${
          (err as Error).message
        }`;
        setError(errorMsg);
        console.error("Erreur:", err);

        // Fallback avec des agents de test
        setAgents([
          {
            id: "cuisinier",
            name: "Cuisinier",
            description: "Chef IA spécialisé en cuisine",
          },
          {
            id: "culinary",
            name: "Chef Assistant",
            description: "Assistant culinaire IA",
          },
        ]);
        setSelectedAgent({
          id: "culinary",
          name: "Chef Assistant",
          description: "Assistant culinaire IA",
        });
      }
    };

    loadAgents();
  }, [isAuthenticated, authLoading]);

  const sendMessage = async () => {
    if (!inputValue.trim() || !selectedAgent || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          agentId: selectedAgent.id,
          threadId: threadId,
          useStream: useStreaming,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Erreur ${response.status}: ${errorData.error || response.statusText}`
        );
      }

      if (useStreaming) {
        // Mode streaming
        const agentMessage: Message = {
          id: uuidv4(),
          content: "",
          sender: "agent",
          timestamp: new Date(),
          agentName: selectedAgent.name,
        };

        setMessages((prev) => [...prev, agentMessage]);

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");

            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.trim()) {
                try {
                  const data = JSON.parse(line);
                  if (data.content) {
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === agentMessage.id
                          ? {
                              ...msg,
                              content: msg.content + data.content,
                              images: data.images
                                ? [...(msg.images || []), ...data.images]
                                : msg.images,
                              videos: data.videos
                                ? [...(msg.videos || []), ...data.videos]
                                : msg.videos,
                              pdfs: data.pdfs
                                ? [...(msg.pdfs || []), ...data.pdfs]
                                : msg.pdfs,
                              services: data.services
                                ? [...(msg.services || []), ...data.services]
                                : msg.services,
                              organizations: data.organizations
                                ? [
                                    ...(msg.organizations || []),
                                    ...data.organizations,
                                  ]
                                : msg.organizations,
                              prestataires: data.prestataires
                                ? [
                                    ...(msg.prestataires || []),
                                    ...data.prestataires,
                                  ]
                                : msg.prestataires,
                            }
                          : msg
                      )
                    );
                  }
                } catch (parseError) {
                  console.warn("Ligne non-JSON ignorée:", line);
                }
              }
            }
          }
        }
      } else {
        // Mode non-streaming
        const data = await response.json();

        const agentMessage: Message = {
          id: uuidv4(),
          content: data.content || "Aucune réponse",
          sender: "agent",
          timestamp: new Date(),
          agentName: selectedAgent.name,
        };

        setMessages((prev) => [...prev, agentMessage]);
      }
    } catch (err) {
      const errorMsg = `Erreur lors de l'envoi du message: ${
        (err as Error).message
      }`;
      setError(errorMsg);
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
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

  // Afficher un écran de chargement pendant la vérification d'authentification
  if (authLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-neutral-600">
                Vérification de l'authentification...
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Si pas authentifié, on ne rend rien (la redirection se fait via useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            🤖 Assistant IA Culinaire
          </h1>
          <p className="text-neutral-600">
            Discutez avec nos assistants intelligents spécialisés en gastronomie
          </p>
        </div>

        {/* Sélecteur d'agent */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-neutral-900">
            Choisir un assistant ({agents.length} disponible
            {agents.length > 1 ? "s" : ""})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => {
              const hasAccess = hasAccessToAgent(user, agent.type || "basic");
              const agentConfig = agent.type ? AGENTS_CONFIG[agent.type] : null;

              return (
                <div key={agent.id} className="relative">
                  <button
                    onClick={() => hasAccess && setSelectedAgent(agent)}
                    disabled={!hasAccess}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedAgent?.id === agent.id
                        ? "border-orange-500 bg-orange-50"
                        : hasAccess
                        ? "border-neutral-200 hover:border-orange-300"
                        : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
                    }`}
                  >
                    {/* Badge premium/business */}
                    {agentConfig &&
                      "badge" in agentConfig &&
                      agentConfig.badge && (
                        <div
                          className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium text-white rounded-full ${
                            hasAccess ? agentConfig.color : "bg-gray-400"
                          }`}
                        >
                          {agentConfig.badge}
                        </div>
                      )}

                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">
                        {agentConfig?.icon || "🤖"}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            hasAccess ? "text-neutral-900" : "text-gray-500"
                          }`}
                        >
                          {agent.name}
                        </h3>
                        <p
                          className={`text-sm mt-1 ${
                            hasAccess ? "text-neutral-600" : "text-gray-500"
                          }`}
                        >
                          {agent.description}
                        </p>

                        {/* Message d'upgrade si pas d'accès */}
                        {!hasAccess && (
                          <div className="mt-2 p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
                            <p className="text-xs font-medium text-purple-700">
                              {getUpgradeMessage(agent.type || "basic")}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: Implémenter la redirection vers la page d'upgrade
                                alert("Fonctionnalité d'upgrade à implémenter");
                              }}
                              className="mt-1 text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors"
                            >
                              Upgrader maintenant
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zone de chat */}
        <div className="bg-white rounded-lg shadow-lg h-96 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {messages.length === 0 && !error && (
              <div className="text-center text-neutral-500 py-8">
                <p>Aucun message pour le moment.</p>
                <p className="text-sm mt-2">
                  Commencez une conversation culinaire !
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-orange-500 text-white"
                      : "bg-neutral-200 text-neutral-900"
                  }`}
                >
                  {message.sender === "agent" && message.agentName && (
                    <div className="text-xs font-semibold mb-1 opacity-75">
                      {message.agentName}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>

                  {/* Affichage des images */}
                  {message.images && message.images.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.images.map((image, index) => (
                        <div
                          key={index}
                          className="rounded-lg overflow-hidden border border-gray-200"
                        >
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full max-w-sm h-auto"
                            style={{ maxHeight: "300px", objectFit: "contain" }}
                          />
                          {image.title && (
                            <div className="px-3 py-2 bg-gray-50 text-xs text-gray-600">
                              {image.title}
                            </div>
                          )}
                          <div className="px-3 py-2 bg-gray-50 flex space-x-2">
                            <a
                              href={image.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            >
                              📥 Télécharger
                            </a>
                            <a
                              href={image.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                            >
                              🔍 Agrandir
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Affichage des vidéos YouTube */}
                  {message.videos && message.videos.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {message.videos.map((video, index) => (
                        <div
                          key={index}
                          className="rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-br from-red-50 to-orange-50"
                        >
                          {/* Player YouTube intégré */}
                          <div
                            className="relative w-full"
                            style={{ paddingBottom: "56.25%" }}
                          >
                            <iframe
                              src={`${video.embedUrl}?rel=0&modestbranding=1`}
                              className="absolute top-0 left-0 w-full h-full"
                              frameBorder="0"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              title={video.alt}
                            />
                          </div>

                          {/* Informations vidéo */}
                          <div className="px-4 py-3 bg-white">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                                {video.title}
                              </h4>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                              <span>📺 {video.channel}</span>
                              <div className="flex space-x-3">
                                <span>👁️ {video.views}</span>
                                <span>⏱️ {video.duration}</span>
                              </div>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex space-x-2">
                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-center text-xs bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors"
                              >
                                ▶️ Voir sur YouTube
                              </a>
                              <button
                                onClick={async () => {
                                  try {
                                    if (
                                      navigator.clipboard &&
                                      window.isSecureContext
                                    ) {
                                      await navigator.clipboard.writeText(
                                        video.url
                                      );
                                    } else {
                                      // Fallback pour les environnements non-sécurisés
                                      const textArea =
                                        document.createElement("textarea");
                                      textArea.value = video.url;
                                      textArea.style.position = "absolute";
                                      textArea.style.left = "-999999px";
                                      document.body.appendChild(textArea);
                                      textArea.focus();
                                      textArea.select();
                                      document.execCommand("copy");
                                      document.body.removeChild(textArea);
                                    }
                                    // Optionnel: feedback visuel
                                    const button =
                                      event?.currentTarget as HTMLButtonElement;
                                    if (button) {
                                      const originalText = button.textContent;
                                      button.textContent = "✅ Copié !";
                                      setTimeout(() => {
                                        button.textContent = originalText;
                                      }, 2000);
                                    }
                                  } catch (err) {
                                    console.error(
                                      "Erreur lors de la copie:",
                                      err
                                    );
                                    alert(
                                      "Impossible de copier le lien automatiquement"
                                    );
                                  }
                                }}
                                className="text-xs bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors"
                              >
                                📋 Copier lien
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Affichage des PDFs téléchargeables */}
                  {message.pdfs && message.pdfs.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {message.pdfs.map((pdf, index) => (
                        <div
                          key={index}
                          className="rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50"
                        >
                          {/* En-tête PDF */}
                          <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                  <span className="text-lg font-bold">📄</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm line-clamp-1">
                                    {pdf.title}
                                  </h4>
                                  <p className="text-xs text-blue-100">
                                    {pdf.documentType} • {pdf.style}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right text-xs text-blue-100">
                                <div>{pdf.fileSize}</div>
                                {pdf.pages && <div>{pdf.pages} pages</div>}
                              </div>
                            </div>
                          </div>

                          {/* Prévisualisation (si disponible) */}
                          {pdf.previewUrl && (
                            <div className="p-4 bg-white">
                              <img
                                src={pdf.previewUrl}
                                alt={`Aperçu de ${pdf.title}`}
                                className="w-full max-w-sm mx-auto h-auto rounded border shadow-sm"
                                style={{
                                  maxHeight: "200px",
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                          )}

                          {/* Zone de téléchargement */}
                          <div className="px-4 py-4 bg-white border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row gap-3">
                              {/* Bouton de téléchargement principal */}
                              {pdf.data ? (
                                // Téléchargement direct depuis base64
                                <button
                                  onClick={() => {
                                    try {
                                      console.log(
                                        "PDF data length:",
                                        pdf.data!.length
                                      );
                                      console.log(
                                        "PDF data sample:",
                                        pdf.data!.substring(0, 50)
                                      );

                                      // Nettoyer les données base64 (supprimer espaces, retours chariot, etc.)
                                      const cleanBase64 = pdf.data!.replace(
                                        /[^A-Za-z0-9+/=]/g,
                                        ""
                                      );

                                      // Vérifier que la longueur est correcte (multiple de 4)
                                      const paddedBase64 =
                                        cleanBase64 +
                                        "=".repeat(
                                          (4 - (cleanBase64.length % 4)) % 4
                                        );

                                      const byteCharacters = atob(paddedBase64);
                                      const byteNumbers = new Array(
                                        byteCharacters.length
                                      );
                                      for (
                                        let i = 0;
                                        i < byteCharacters.length;
                                        i++
                                      ) {
                                        byteNumbers[i] =
                                          byteCharacters.charCodeAt(i);
                                      }
                                      const byteArray = new Uint8Array(
                                        byteNumbers
                                      );
                                      const blob = new Blob([byteArray], {
                                        type: pdf.mimeType || "application/pdf",
                                      });
                                      const url = URL.createObjectURL(blob);
                                      const link = document.createElement("a");
                                      link.href = url;
                                      link.download = pdf.filename;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      URL.revokeObjectURL(url);
                                    } catch (error) {
                                      console.error(
                                        "Erreur téléchargement PDF:",
                                        error
                                      );
                                      alert(
                                        "Erreur lors du téléchargement du PDF. Vérifiez la console pour plus de détails."
                                      );
                                    }
                                  }}
                                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                  <span className="text-lg">📥</span>
                                  <span>Télécharger PDF</span>
                                </button>
                              ) : (
                                // Téléchargement classique par URL
                                <a
                                  href={pdf.url}
                                  download={pdf.filename}
                                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                  <span className="text-lg">📥</span>
                                  <span>Télécharger PDF</span>
                                </a>
                              )}

                              {/* Boutons secondaires */}
                              <div className="flex gap-2">
                                {pdf.data ? (
                                  // Aperçu depuis base64
                                  <button
                                    onClick={() => {
                                      try {
                                        // Nettoyer les données base64
                                        const cleanBase64 = pdf.data!.replace(
                                          /[^A-Za-z0-9+/=]/g,
                                          ""
                                        );
                                        const paddedBase64 =
                                          cleanBase64 +
                                          "=".repeat(
                                            (4 - (cleanBase64.length % 4)) % 4
                                          );

                                        const byteCharacters =
                                          atob(paddedBase64);
                                        const byteNumbers = new Array(
                                          byteCharacters.length
                                        );
                                        for (
                                          let i = 0;
                                          i < byteCharacters.length;
                                          i++
                                        ) {
                                          byteNumbers[i] =
                                            byteCharacters.charCodeAt(i);
                                        }
                                        const byteArray = new Uint8Array(
                                          byteNumbers
                                        );
                                        const blob = new Blob([byteArray], {
                                          type:
                                            pdf.mimeType || "application/pdf",
                                        });
                                        const url = URL.createObjectURL(blob);
                                        window.open(url, "_blank");
                                        // Nettoyer l'URL après un délai
                                        setTimeout(
                                          () => URL.revokeObjectURL(url),
                                          1000
                                        );
                                      } catch (error) {
                                        console.error(
                                          "Erreur aperçu PDF:",
                                          error
                                        );
                                        alert(
                                          "Erreur lors de l'aperçu du PDF."
                                        );
                                      }
                                    }}
                                    className="flex items-center justify-center space-x-1 bg-gray-500 text-white px-3 py-3 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                                  >
                                    <span>👁️</span>
                                    <span className="hidden sm:inline">
                                      Aperçu
                                    </span>
                                  </button>
                                ) : pdf.url ? (
                                  // Aperçu classique par URL
                                  <a
                                    href={pdf.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center space-x-1 bg-gray-500 text-white px-3 py-3 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                                  >
                                    <span>👁️</span>
                                    <span className="hidden sm:inline">
                                      Aperçu
                                    </span>
                                  </a>
                                ) : null}

                                {pdf.data ? (
                                  // Copier comme lien base64
                                  <button
                                    onClick={() => {
                                      try {
                                        // Nettoyer les données base64 avant copie
                                        const cleanBase64 = pdf.data!.replace(
                                          /[^A-Za-z0-9+/=]/g,
                                          ""
                                        );
                                        const dataUrl = `data:${
                                          pdf.mimeType || "application/pdf"
                                        };base64,${cleanBase64}`;
                                        navigator.clipboard.writeText(dataUrl);
                                        alert("Lien de données copié !");
                                      } catch (error) {
                                        console.error("Erreur copie:", error);
                                        alert("Erreur lors de la copie.");
                                      }
                                    }}
                                    className="flex items-center justify-center space-x-1 bg-green-500 text-white px-3 py-3 rounded-lg hover:bg-green-600 transition-colors text-sm"
                                    title="Copier comme lien de données"
                                  >
                                    <span>📋</span>
                                    <span className="hidden sm:inline">
                                      Data
                                    </span>
                                  </button>
                                ) : pdf.url ? (
                                  // Copier lien classique
                                  <button
                                    onClick={() =>
                                      navigator.clipboard.writeText(pdf.url!)
                                    }
                                    className="flex items-center justify-center space-x-1 bg-green-500 text-white px-3 py-3 rounded-lg hover:bg-green-600 transition-colors text-sm"
                                    title="Copier le lien"
                                  >
                                    <span>📋</span>
                                    <span className="hidden sm:inline">
                                      Copier
                                    </span>
                                  </button>
                                ) : null}
                              </div>
                            </div>

                            {/* Informations du fichier */}
                            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                              <span>Fichier: {pdf.filename}</span>
                              <span>Format: PDF • {pdf.fileSize}</span>
                              {pdf.data && (
                                <span className="text-green-600 font-medium">
                                  ⚡ Téléchargement direct
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Affichage des services */}
                  {message.services && message.services.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {message.services.map((service, index) => (
                        <div
                          key={index}
                          className="rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50"
                        >
                          {/* En-tête service */}
                          <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                  <span className="text-lg font-bold">🛎️</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm line-clamp-1">
                                    {service.title}
                                  </h4>
                                  <p className="text-xs text-purple-100">
                                    {service.serviceType} •{" "}
                                    {service.billingPlan}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right text-xs text-purple-100">
                                <div className="font-semibold">
                                  {service.price}
                                </div>
                                <div>{service.priceMode}</div>
                              </div>
                            </div>
                          </div>

                          {/* Contenu service */}
                          <div className="px-4 py-4 bg-white">
                            <p className="text-sm text-gray-700 mb-3">
                              {service.summary}
                            </p>

                            {service.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {service.tags.map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Informations organisation */}
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <div className="text-sm font-medium text-gray-900 mb-1">
                                🏢 {service.organizationName}
                              </div>
                              <div className="text-xs text-gray-600 space-y-1">
                                <div>📊 {service.organizationSector}</div>
                                {service.organizationAddress && (
                                  <div>📍 {service.organizationAddress}</div>
                                )}
                                <div className="flex items-center space-x-4">
                                  {service.organizationPhone && (
                                    <span>📞 {service.organizationPhone}</span>
                                  )}
                                  {service.organizationEmail && (
                                    <span>📧 {service.organizationEmail}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex space-x-2">
                              <a
                                href={service.pageUrl}
                                className="flex-1 text-center text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                              >
                                🔍 Voir le service
                              </a>
                              {service.organizationWebsite && (
                                <a
                                  href={service.organizationWebsite}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                  🌐 Site web
                                </a>
                              )}
                            </div>

                            {/* Métadonnées */}
                            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                              <span>Type: {service.consumptionType}</span>
                              <span>
                                IA:{" "}
                                {service.isAIReplaceable
                                  ? "✅ Remplaçable"
                                  : "❌ Non remplaçable"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Affichage des organisations */}
                  {message.organizations &&
                    message.organizations.length > 0 && (
                      <div className="mt-3 space-y-3">
                        {message.organizations.map((org, index) => (
                          <div
                            key={index}
                            className="rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50"
                          >
                            {/* En-tête organisation */}
                            <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <span className="text-lg font-bold">
                                      🏢
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-sm line-clamp-1">
                                      {org.name}
                                    </h4>
                                    <p className="text-xs text-blue-100">
                                      {org.sector} • {org.servicesCount}{" "}
                                      services
                                    </p>
                                  </div>
                                </div>
                                {org.legalForm && (
                                  <div className="text-right text-xs text-blue-100">
                                    <div>{org.legalForm}</div>
                                    {org.siret && <div>SIRET: {org.siret}</div>}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Contenu organisation */}
                            <div className="px-4 py-4 bg-white">
                              {org.description && (
                                <p className="text-sm text-gray-700 mb-3">
                                  {org.description}
                                </p>
                              )}

                              {/* Coordonnées */}
                              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                <div className="text-xs text-gray-600 space-y-1">
                                  {org.address && (
                                    <div className="flex items-center space-x-2">
                                      <span>📍</span>
                                      <span>{org.address}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-4">
                                    {org.phone && (
                                      <div className="flex items-center space-x-2">
                                        <span>📞</span>
                                        <span>{org.phone}</span>
                                      </div>
                                    )}
                                    {org.email && (
                                      <div className="flex items-center space-x-2">
                                        <span>📧</span>
                                        <span>{org.email}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Services disponibles */}
                              {org.services && org.services.length > 0 && (
                                <div className="mb-3">
                                  <div className="text-sm font-medium text-gray-900 mb-2">
                                    🛎️ Services disponibles:
                                  </div>
                                  <div className="space-y-2">
                                    {org.services.map(
                                      (service, serviceIndex) => (
                                        <div
                                          key={serviceIndex}
                                          className="bg-blue-50 rounded-lg p-2 text-xs"
                                        >
                                          <div className="flex items-center justify-between">
                                            <div className="font-medium text-blue-900">
                                              {service.title}
                                            </div>
                                            <div className="text-blue-700">
                                              {service.price}
                                            </div>
                                          </div>
                                          {service.summary && (
                                            <div className="text-blue-600 mt-1">
                                              {service.summary}
                                            </div>
                                          )}
                                          {service.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                              {service.tags.map(
                                                (tag, tagIndex) => (
                                                  <span
                                                    key={tagIndex}
                                                    className="px-1 py-0.5 bg-blue-200 text-blue-800 rounded text-xs"
                                                  >
                                                    {tag}
                                                  </span>
                                                )
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Boutons d'action */}
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    // TODO: Naviguer vers la page de l'organisation
                                    window.location.href = `/organizations/${org.id}`;
                                  }}
                                  className="flex-1 text-center text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                  🔍 Voir l'organisation
                                </button>
                                {org.website && (
                                  <a
                                    href={org.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                  >
                                    🌐 Site web
                                  </a>
                                )}
                              </div>

                              {/* Métadonnées */}
                              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                                <span>Recherche: {org.searchQuery}</span>
                                <span>
                                  {org.servicesCount} service
                                  {org.servicesCount > 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Affichage des prestataires */}
                  {message.prestataires && message.prestataires.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {message.prestataires.map((prestataire, index) => (
                        <div
                          key={index}
                          className="rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50"
                        >
                          {/* En-tête prestataire */}
                          <div className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                  <span className="text-lg font-bold">👤</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm line-clamp-1">
                                    {prestataire.name}
                                  </h4>
                                  <p className="text-xs text-green-100">
                                    {prestataire.organization
                                      ? `${prestataire.organization.sector} • ${prestataire.organization.servicesCount} services`
                                      : "Indépendant"}{" "}
                                    •{" "}
                                    {prestataire.emailVerified
                                      ? "✅ Vérifié"
                                      : "⚠️ Non vérifié"}
                                  </p>
                                </div>
                              </div>
                              {prestataire.organization?.legalForm && (
                                <div className="text-right text-xs text-green-100">
                                  <div>
                                    {prestataire.organization.legalForm}
                                  </div>
                                  {prestataire.organization.siret && (
                                    <div>
                                      SIRET: {prestataire.organization.siret}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Contenu prestataire */}
                          <div className="px-4 py-4 bg-white">
                            {/* Coordonnées personnelles */}
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <div className="text-xs text-gray-600 space-y-1">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <span>📧</span>
                                    <span>{prestataire.email}</span>
                                  </div>
                                  {prestataire.phone && (
                                    <div className="flex items-center space-x-2">
                                      <span>📞</span>
                                      <span>{prestataire.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Organisation si présente */}
                            {prestataire.organization && (
                              <div className="mb-3">
                                <div className="text-sm font-medium text-gray-900 mb-2">
                                  🏢 Organisation:{" "}
                                  {prestataire.organization.name}
                                </div>
                                {prestataire.organization.description && (
                                  <p className="text-xs text-gray-600 mb-2">
                                    {prestataire.organization.description}
                                  </p>
                                )}
                                {prestataire.organization.address && (
                                  <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
                                    <span>📍</span>
                                    <span>
                                      {prestataire.organization.address}
                                    </span>
                                  </div>
                                )}

                                {/* Services de l'organisation */}
                                {prestataire.organization.services &&
                                  prestataire.organization.services.length >
                                    0 && (
                                    <div className="space-y-2">
                                      <div className="text-xs font-medium text-gray-700">
                                        🛎️ Services proposés:
                                      </div>
                                      {prestataire.organization.services
                                        .slice(0, 3)
                                        .map((service, serviceIndex) => (
                                          <div
                                            key={serviceIndex}
                                            className="bg-green-50 rounded-lg p-2 text-xs"
                                          >
                                            <div className="flex items-center justify-between">
                                              <div className="font-medium text-green-900">
                                                {service.title}
                                              </div>
                                              <div className="text-green-700">
                                                {service.lowerPrice}€ -{" "}
                                                {service.upperPrice}€
                                              </div>
                                            </div>
                                            {service.summary && (
                                              <div className="text-green-600 mt-1">
                                                {service.summary}
                                              </div>
                                            )}
                                            {service.tags.length > 0 && (
                                              <div className="flex flex-wrap gap-1 mt-1">
                                                {service.tags.map(
                                                  (tag, tagIndex) => (
                                                    <span
                                                      key={tagIndex}
                                                      className="px-1 py-0.5 bg-green-200 text-green-800 rounded text-xs"
                                                    >
                                                      {tag}
                                                    </span>
                                                  )
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      {prestataire.organization.services
                                        .length > 3 && (
                                        <div className="text-xs text-gray-500 text-center">
                                          ... et{" "}
                                          {prestataire.organization.services
                                            .length - 3}{" "}
                                          autres services
                                        </div>
                                      )}
                                    </div>
                                  )}
                              </div>
                            )}

                            {/* Boutons d'action */}
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  window.location.href = prestataire.pageUrl;
                                }}
                                className="flex-1 text-center text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                              >
                                👤 Voir le profil
                              </button>
                              {prestataire.organization?.website && (
                                <a
                                  href={prestataire.organization.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                  🌐 Site web
                                </a>
                              )}
                              {prestataire.organization && (
                                <button
                                  onClick={() => {
                                    window.location.href = `/organizations/${prestataire.organization.id}`;
                                  }}
                                  className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                  🏢 Organisation
                                </button>
                              )}
                            </div>

                            {/* Métadonnées */}
                            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                              <span>Recherche: {prestataire.searchQuery}</span>
                              <span>
                                {prestataire.organization
                                  ? `${prestataire.organization.servicesCount} services`
                                  : "Indépendant"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-xs opacity-75 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-200 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Zone de saisie */}
          <div className="border-t border-neutral-200 p-4">
            <div className="flex space-x-4">
              <button
                onClick={clearChat}
                className="px-4 py-2 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 transition-colors"
                disabled={isLoading}
              >
                Effacer
              </button>
              <div className="flex-1 flex space-x-2">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    selectedAgent
                      ? `Parlez avec ${selectedAgent.name}...`
                      : "Sélectionnez un assistant..."
                  }
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  rows={1}
                  disabled={!selectedAgent || isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || !selectedAgent || isLoading}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Envoi..." : "Envoyer"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Paramètres */}
        <div className="mt-6 flex justify-between items-center text-sm text-neutral-500">
          <div>
            <p>Thread ID: {threadId}</p>
            <p>Assistant: {selectedAgent?.name || "Aucun"}</p>
          </div>
          <div className="flex items-center space-x-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useStreaming}
                onChange={(e) => setUseStreaming(e.target.checked)}
                className="mr-2"
              />
              <span>Streaming</span>
            </label>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
