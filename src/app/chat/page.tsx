'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MainLayout } from '@/components/layout/main-layout';

interface Agent {
  id: string;
  name: string;
  description: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentName?: string;
}

export default function ChatPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId] = useState(() => uuidv4());
  const [error, setError] = useState<string | null>(null);
  const [useStreaming, setUseStreaming] = useState(true);

  // Charger les agents disponibles
  useEffect(() => {
    const loadAgents = async () => {
      try {
        const response = await fetch('/api/chat');
        
        if (response.ok) {
          const agentsData = await response.json();
          setAgents(agentsData);
          if (agentsData.length > 0) {
            setSelectedAgent(agentsData[0]);
          }
        } else {
          const errorText = await response.text();
          setError(`Erreur lors du chargement des agents: ${response.status} - ${errorText}`);
        }
      } catch (err) {
        const errorMsg = `Erreur de connexion au serveur: ${(err as Error).message}`;
        setError(errorMsg);
        console.error('Erreur:', err);
        
        // Fallback avec des agents de test
        setAgents([
          { id: 'myges', name: 'MyGES', description: 'Agent de test MyGES' },
          { id: 'culinary', name: 'Chef Assistant', description: 'Assistant culinaire IA' }
        ]);
        setSelectedAgent({ id: 'culinary', name: 'Chef Assistant', description: 'Assistant culinaire IA' });
      }
    };

    loadAgents();
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim() || !selectedAgent || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        throw new Error(`Erreur ${response.status}: ${errorData.error || response.statusText}`);
      }

      if (useStreaming) {
        // Mode streaming
        const agentMessage: Message = {
          id: uuidv4(),
          content: '',
          sender: 'agent',
          timestamp: new Date(),
          agentName: selectedAgent.name,
        };

        setMessages(prev => [...prev, agentMessage]);

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let buffer = '';
          
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            
            buffer = lines.pop() || '';
            
            for (const line of lines) {
              if (line.trim()) {
                try {
                  const data = JSON.parse(line);
                  if (data.content) {
                    setMessages(prev => 
                      prev.map(msg => 
                        msg.id === agentMessage.id 
                          ? { ...msg, content: msg.content + data.content }
                          : msg
                      )
                    );
                  }
                } catch (parseError) {
                  console.warn('Ligne non-JSON ignorée:', line);
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
          content: data.content || 'Aucune réponse',
          sender: 'agent',
          timestamp: new Date(),
          agentName: selectedAgent.name,
        };

        setMessages(prev => [...prev, agentMessage]);
      }

    } catch (err) {
      const errorMsg = `Erreur lors de l'envoi du message: ${(err as Error).message}`;
      setError(errorMsg);
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

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
            Choisir un assistant ({agents.length} disponible{agents.length > 1 ? 's' : ''})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedAgent?.id === agent.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-neutral-200 hover:border-orange-300'
                }`}
              >
                <h3 className="font-semibold text-neutral-900">
                  {agent.name}
                </h3>
                <p className="text-sm text-neutral-600 mt-1">
                  {agent.description}
                </p>
              </button>
            ))}
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
                <p className="text-sm mt-2">Commencez une conversation culinaire !</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-neutral-200 text-neutral-900'
                  }`}
                >
                  {message.sender === 'agent' && message.agentName && (
                    <div className="text-xs font-semibold mb-1 opacity-75">
                      {message.agentName}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
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
                    <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                  placeholder={selectedAgent ? `Parlez avec ${selectedAgent.name}...` : 'Sélectionnez un assistant...'}
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  rows={1}
                  disabled={!selectedAgent || isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || !selectedAgent || isLoading}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Paramètres */}
        <div className="mt-6 flex justify-between items-center text-sm text-neutral-500">
          <div>
            <p>Thread ID: {threadId}</p>
            <p>Assistant: {selectedAgent?.name || 'Aucun'}</p>
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