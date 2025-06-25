#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import { config as dotenvConfig } from "dotenv";
import fs from "fs/promises";
import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenvConfig({ path: path.join(__dirname, ".env") });

// Types
interface AgentConfig {
  id: string;
  name: string;
  description: string;
}

interface Config {
  api_url: string;
  agents: AgentConfig[];
  bearer_token?: string;
}

interface ChatMessage {
  message: string;
  thread_id?: string;
  conversation_id?: string;
  chat_id?: string;
  context?: any;
}

// Configuration management
class ConfigManager {
  private config: Config | null = null;

  async getConfig(): Promise<Config> {
    if (this.config) return this.config;

    // Le bearer token est TOUJOURS requis depuis le .env
    const bearerToken = process.env.BEARER;
    if (!bearerToken) {
      console.error(
        chalk.red(
          "❌ ERREUR: La variable BEARER doit être définie dans le fichier .env du CLI"
        )
      );
      console.error(
        chalk.yellow("💡 Créez un fichier CLI/.env avec: BEARER=votre-token")
      );
      process.exit(1);
    }

    // 1. Try environment variables first
    if (process.env.API_URL) {
      this.config = {
        api_url: process.env.API_URL,
        agents: [],
        bearer_token: bearerToken,
      };
      return this.config;
    }

    // 2. Try JSON config file
    try {
      const configPath = path.join(__dirname, "agents_config.json");
      const configData = await fs.readFile(configPath, "utf-8");
      this.config = JSON.parse(configData);
      
      // TOUJOURS utiliser le bearer token du .env
      this.config!.bearer_token = bearerToken;
      
      return this.config!;
    } catch (error) {
      // 3. Fallback to default config
      this.config = {
        api_url: "http://localhost:8080",
        agents: [
          {
            id: "sallyO",
            name: "SallyO",
            description:
              "Un agent IA qui peut aider les utilisateurs à explorer les opportunités dans le CRM Reply.",
          },
        ],
        bearer_token: bearerToken,
      };
      return this.config;
    }
  }
}

// Chat utilities
class ChatSession {
  private conversationId: string;
  private debug: boolean;
  private configManager: ConfigManager;

  constructor(debug: boolean = false) {
    this.conversationId = `cli-${uuidv4()}`;
    this.debug = debug;
    this.configManager = new ConfigManager();
  }

  resetConversation(): void {
    this.conversationId = `cli-${uuidv4()}`;
    console.log(chalk.yellow("💫 Conversation réinitialisée !"));
  }

  toggleDebug(): void {
    this.debug = !this.debug;
    console.log(
      chalk.yellow(`🐛 Mode debug: ${this.debug ? "ACTIVÉ" : "DÉSACTIVÉ"}`)
    );
  }

  private log(message: string): void {
    if (this.debug) {
      console.log(chalk.dim(`[DEBUG] ${message}`));
    }
  }

  displayMessage(message: string, isUser: boolean = false): void {
    const style = isUser ? chalk.green.bold : chalk.blue.bold;
    const sender = isUser ? "Vous" : "Agent";
    console.log(`${style(sender + ":")} ${message}`);
  }

  displayAgentInfo(agent: AgentConfig): void {
    console.log(chalk.blue("═".repeat(60)));
    console.log(chalk.blue.bold(`📤 ${agent.name}`));
    console.log(chalk.blue(`📝 ${agent.description}`));
    console.log(chalk.blue("═".repeat(60)));
  }

  private async makeRequest(url: string, payload: any): Promise<Response> {
    const config = await this.configManager.getConfig();
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (config.bearer_token) {
      headers["Authorization"] = `Bearer ${config.bearer_token}`;
      this.log(
        `Utilisation du token d'authentification (longueur: ${config.bearer_token.length})`
      );
    }

    this.log(`URL: ${url}`);
    this.log(`Payload: ${JSON.stringify(payload, null, 2)}`);

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    return response;
  }

  async streamAgentResponse(
    agentId: string,
    message: string,
    useContext: boolean = true
  ): Promise<string | null> {
    const config = await this.configManager.getConfig();
    const url = `${config.api_url}/${agentId}/stream`;

    const payload: ChatMessage = { message };

    if (useContext) {
      payload.thread_id = this.conversationId;
      payload.conversation_id = this.conversationId;
      payload.chat_id = this.conversationId;
      this.log(`Utilisation de l'ID de conversation: ${this.conversationId}`);
    }

    if (config.bearer_token) {
      payload.context = {
        configurable: {
          __bearer_token: config.bearer_token,
        },
      };
    }

    try {
      const response = await this.makeRequest(url, payload);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          chalk.red.bold(
            `❌ Erreur: Le serveur a retourné le code ${response.status}`
          )
        );
        try {
          const errorData = JSON.parse(errorText);
          console.error(
            chalk.red(
              `📋 Détails: ${errorData.detail || JSON.stringify(errorData)}`
            )
          );
        } catch {
          console.error(chalk.red(`📋 Détails: ${errorText}`));
        }
        return null;
      }

      // Traitement du streaming
      this.log("Connecté au stream, en attente de réponse...");
      
      let buffer = "";
      let newThreadId: string | null = null;
      
      process.stdout.write(chalk.blue.bold("Agent: "));

      const reader = response.body?.getReader();
      if (!reader) {
        console.error(chalk.red("❌ Impossible de lire le stream"));
        return null;
      }

      const decoder = new TextDecoder();
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = mygesr.decode(value, { stream: true });
          this.log(`Chunk reçu: ${JSON.stringify(chunk)}`);
          
          buffer += chunk;
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;
            
            this.log(`Traitement de la ligne: ${JSON.stringify(line)}`);
            
            let eventType: string | null = null;
            let dataContent: any = null;

            for (const subline of line.split("\n")) {
              if (subline.startsWith("event: ")) {
                eventType = subline.slice(7).trim();
                this.log(`Événement trouvé: ${eventType}`);
              } else if (subline.startsWith("data: ")) {
                try {
                  const dataStr = subline.slice(6);
                  dataContent = JSON.parse(dataStr);
                  this.log(`Données parsées: ${JSON.stringify(dataContent)}`);

                  // Recherche d'ID de conversation
                  if (typeof dataContent === "object" && dataContent !== null) {
                    for (const idKey of [
                      "thread_id",
                      "conversation_id",
                      "chat_id",
                      "id",
                    ]) {
                      if (dataContent[idKey]) {
                        newThreadId = dataContent[idKey];
                        this.log(`${idKey} trouvé: ${newThreadId}`);
                      }
                    }
                  }
                } catch (error) {
                  this.log(`Erreur de parsing JSON: ${error}`);
                }
              }
            }

            // Traitement des différents types d'événements
            if (eventType === "stream_token" && dataContent?.token) {
              process.stdout.write(dataContent.token);
            } else if (
              eventType === "tool_execution_start" ||
              eventType === "tool_start"
            ) {
              console.log(chalk.yellow(`\n\n🔧 ═══ OUTIL APPELÉ ═══`));
              console.log(
                chalk.yellow.bold(`📛 Nom: ${dataContent?.name || "inconnu"}`)
              );
              if (dataContent?.params || dataContent?.input) {
                const params = dataContent.params || dataContent.input;
                console.log(chalk.cyan.bold(`📥 Paramètres d'entrée:`));
                if (typeof params === "object") {
                  Object.entries(params).forEach(([key, value]) => {
                    console.log(
                      chalk.cyan(`   • ${key}: ${JSON.stringify(value)}`)
                    );
                  });
                } else {
                  console.log(
                    chalk.cyan(`   ${JSON.stringify(params, null, 2)}`)
                  );
                }
              }
              console.log(chalk.yellow(`⏳ Exécution en cours...`));
            } else if (
              eventType === "tool_execution_complete" ||
              eventType === "tool_end"
            ) {
              console.log(
                chalk.green.bold(
                  `✅ Outil terminé avec succès: ${
                    dataContent?.name || "inconnu"
                  }`
                )
              );
              if (dataContent?.output) {
                console.log(chalk.green.bold(`📤 Résultat:`));
                const output = dataContent.output;
                if (typeof output === "string" && output.length > 200) {
                  console.log(chalk.green(`${output.substring(0, 200)}...`));
                  console.log(
                    chalk.dim(
                      `[Résultat tronqué - ${output.length} caractères au total]`
                    )
                  );
                } else {
                  console.log(
                    chalk.green(
                      `${
                        typeof output === "string"
                          ? output
                          : JSON.stringify(output, null, 2)
                      }`
                    )
                  );
                }
              }
              console.log(chalk.yellow(`═══════════════════════\n`));
            } else if (
              eventType === "tool_execution_error" ||
              eventType === "tool_error"
            ) {
              console.log(
                chalk.red.bold(
                  `❌ ERREUR OUTIL: ${dataContent?.name || "inconnu"}`
                )
              );
              if (dataContent?.error) {
                console.log(chalk.red(`🚨 Détails: ${dataContent.error}`));
              }
              console.log(chalk.red(`═══════════════════════\n`));
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      console.log("\n"); // Nouvelle ligne après la réponse
      return newThreadId;
    } catch (error) {
      console.error(chalk.red.bold(`❌ Erreur de connexion: ${error}`));
      return null;
    }
  }

  async invokeAgentResponse(
    agentId: string,
    message: string,
    useContext: boolean = true
  ): Promise<string | null> {
    const config = await this.configManager.getConfig();
    const url = `${config.api_url}/${agentId}/invoke`;

    const payload: ChatMessage = { message };

    if (useContext) {
      payload.thread_id = this.conversationId;
      payload.conversation_id = this.conversationId;
      payload.chat_id = this.conversationId;
      this.log(`Utilisation de l'ID de conversation: ${this.conversationId}`);
    }

    if (config.bearer_token) {
      payload.context = {
        configurable: {
          __bearer_token: config.bearer_token,
        },
      };
    }

    try {
      const response = await this.makeRequest(url, payload);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          chalk.red.bold(
            `❌ Erreur: Le serveur a retourné le code ${response.status}`
          )
        );
        try {
          const errorData = JSON.parse(errorText);
          console.error(
            chalk.red(
              `📋 Détails: ${errorData.detail || JSON.stringify(errorData)}`
            )
          );
        } catch {
          console.error(chalk.red(`📋 Détails: ${errorText}`));
        }
        return null;
      }

      const data = await response.json();
      this.log(`Réponse reçue: ${JSON.stringify(data, null, 2)}`);
      
      // Vérification si des outils ont été utilisés dans la réponse
      if (data.tool_calls && Array.isArray(data.tool_calls)) {
        console.log(chalk.yellow(`\n🔧 ═══ OUTILS UTILISÉS ═══`));
        data.tool_calls.forEach((toolCall: any, index: number) => {
          console.log(
            chalk.yellow.bold(
              `📛 Outil ${index + 1}: ${toolCall.name || "inconnu"}`
            )
          );
          if (toolCall.input || toolCall.args) {
            const params = toolCall.input || toolCall.args;
            console.log(chalk.cyan.bold(`📥 Paramètres:`));
            if (typeof params === "object") {
              Object.entries(params).forEach(([key, value]) => {
                console.log(
                  chalk.cyan(`   • ${key}: ${JSON.stringify(value)}`)
                );
              });
            } else {
              console.log(chalk.cyan(`   ${JSON.stringify(params, null, 2)}`));
            }
          }
          if (toolCall.output) {
            console.log(chalk.green.bold(`📤 Résultat:`));
            const output = toolCall.output;
            if (typeof output === "string" && output.length > 200) {
              console.log(chalk.green(`${output.substring(0, 200)}...`));
              console.log(
                chalk.dim(
                  `[Résultat tronqué - ${output.length} caractères au total]`
                )
              );
            } else {
              console.log(
                chalk.green(
                  `${
                    typeof output === "string"
                      ? output
                      : JSON.stringify(output, null, 2)
                  }`
                )
              );
            }
          }
          console.log(chalk.yellow(`───────────────────────`));
        });
        console.log(chalk.yellow(`═══════════════════════\n`));
      }
      
      // Affichage de la réponse
      if (data.response) {
        console.log(chalk.blue.bold("Agent:"), data.response);
      } else if (typeof data === "string") {
        console.log(chalk.blue.bold("Agent:"), data);
      } else {
        console.log(chalk.blue.bold("Agent:"), JSON.stringify(data, null, 2));
      }

      // Recherche d'ID de conversation
      let newThreadId: string | null = null;
      if (typeof data === "object" && data !== null) {
        for (const idKey of ["thread_id", "conversation_id", "chat_id", "id"]) {
          if (data[idKey]) {
            newThreadId = data[idKey];
            this.log(`${idKey} trouvé: ${newThreadId}`);
            break;
          }
        }
      }

      return newThreadId;
    } catch (error) {
      console.error(chalk.red.bold(`❌ Erreur de connexion: ${error}`));
      return null;
    }
  }
}

// API utilities
async function checkApiConnection(
  apiUrl?: string,
  debug: boolean = false
): Promise<boolean> {
  const configManager = new ConfigManager();
  const config = await configManager.getConfig();
  
  const baseUrl = apiUrl || config.api_url;
  const token = config.bearer_token;
  
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    if (debug) {
      console.log(
        chalk.dim(`[DEBUG] Vérification de l'API à: ${baseUrl}/health`)
      );
    }
    
    const response = await fetch(`${baseUrl}/health`, { headers });
    
    if (response.ok) {
      console.log(chalk.green("✅ API accessible"));
      return true;
    } else {
      console.log(
        chalk.red(`❌ API non accessible (Code: ${response.status})`)
      );
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`❌ Erreur de connexion à l'API: ${error}`));
    return false;
  }
}

async function getAvailableAgents(apiUrl?: string): Promise<AgentConfig[]> {
  const configManager = new ConfigManager();
  const config = await configManager.getConfig();
  
  const baseUrl = apiUrl || config.api_url;
  const token = config.bearer_token;
  
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${baseUrl}/agents`, { headers });
    
    if (response.ok) {
      const agents = await response.json();
      return Array.isArray(agents) ? agents : config.agents;
    } else {
      console.log(
        chalk.yellow(
          "⚠️  Impossible de récupérer les agents depuis l'API, utilisation de la configuration locale"
        )
      );
      return config.agents;
    }
  } catch (error) {
    console.log(
      chalk.yellow(
        "⚠️  Erreur lors de la récupération des agents, utilisation de la configuration locale"
      )
    );
    return config.agents;
  }
}

// Commands
async function checkCommand(options: any): Promise<void> {
  console.log(chalk.blue.bold("🔍 Vérification de la connectivité API..."));
  
  const isConnected = await checkApiConnection(options.apiUrl, options.debug);
  
  if (isConnected) {
    console.log(chalk.blue.bold("\n📋 Agents disponibles:"));
    const agents = await getAvailableAgents(options.apiUrl);
    
    if (agents.length === 0) {
      console.log(chalk.yellow("⚠️  Aucun agent trouvé"));
    } else {
      agents.forEach((agent, index) => {
        console.log(chalk.green(`${index + 1}. ${agent.name} (${agent.id})`));
        console.log(chalk.dim(`   ${agent.description}`));
      });
    }
  }
}

async function chatCommand(options: any): Promise<void> {
  console.log(chalk.blue.bold("💬 Démarrage du chat avec les agents..."));
  
  const configManager = new ConfigManager();
  const config = await configManager.getConfig();
  
  // Override config with command line options
  if (options.apiUrl) config.api_url = options.apiUrl;
  
  // Check API connection
  const isConnected = await checkApiConnection(config.api_url, options.debug);
  if (!isConnected) {
    console.log(
      chalk.red(
        "❌ Impossible de se connecter à l'API. Vérifiez votre configuration."
      )
    );
    return;
  }
  
  // Get available agents
  const agents = await getAvailableAgents(config.api_url);
  
  let selectedAgent: AgentConfig;
  
  if (options.agent) {
    const agent = agents.find((a) => a.id === options.agent);
    if (!agent) {
      console.log(chalk.red(`❌ Agent '${options.agent}' non trouvé`));
      return;
    }
    selectedAgent = agent;
  } else {
    if (agents.length === 0) {
      console.log(chalk.red("❌ Aucun agent disponible"));
      return;
    } else if (agents.length === 1) {
      selectedAgent = agents[0];
    } else {
      const answer = await inquirer.prompt([
        {
          type: "list",
          name: "agent",
          message: "Choisissez un agent:",
          choices: agents.map((agent) => ({
            name: `${agent.name} - ${agent.description}`,
            value: agent,
          })),
        },
      ]);
      selectedAgent = answer.agent;
    }
  }
  
  const chatSession = new ChatSession(options.debug);
  chatSession.displayAgentInfo(selectedAgent);
  
  console.log(chalk.yellow("\n💡 Commandes spéciales:"));
  console.log(chalk.yellow("  !clear  - Réinitialiser la conversation"));
  console.log(chalk.yellow("  !debug  - Basculer le mode debug"));
  console.log(chalk.yellow("  exit    - Quitter le chat"));
  console.log(chalk.yellow("─".repeat(60)));
  
  while (true) {
    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "message",
        message: "Vous:",
      },
    ]);
    
    const message = answer.message.trim();
    
    if (message === "exit") {
      console.log(chalk.yellow("👋 Au revoir !"));
      break;
    }
    
    if (message === "!clear") {
      chatSession.resetConversation();
      continue;
    }
    
    if (message === "!debug") {
      chatSession.toggleDebug();
      continue;
    }
    
    if (message === "") {
      continue;
    }
    
    // Send message to agent
    try {
      if (options.invoke) {
        await chatSession.invokeAgentResponse(
          selectedAgent.id,
          message,
          !options.noContext
        );
      } else {
        await chatSession.streamAgentResponse(
          selectedAgent.id,
          message,
          !options.noContext
        );
      }
    } catch (error) {
      console.error(
        chalk.red(`❌ Erreur lors de l'envoi du message: ${error}`)
      );
    }
    
    console.log(); // Ligne vide pour la lisibilité
  }
}

// CLI setup
const program = new Command();

program
  .name("agent-cli")
  .description("CLI pour tester les agents IA")
  .version("1.0.0");

program
  .command("check")
  .description("Vérifier la connectivité API et lister les agents disponibles")
  .option("--api-url <url>", "URL de l'API à utiliser")
  .option("-d, --debug", "Activer le mode debug")
  .action(checkCommand);

program
  .command("chat")
  .description("Démarrer une session de chat avec un agent")
  .option("-a, --agent <id>", "ID de l'agent à utiliser")
  .option("-i, --invoke", "Utiliser l'endpoint invoke au lieu du streaming")
  .option("--api-url <url>", "URL de l'API à utiliser")
  .option("-d, --debug", "Activer le mode debug")
  .option("--no-context", "Désactiver le suivi du contexte de conversation")
  .action(chatCommand);

// Make the script executable
program.parse();

export default program; 
