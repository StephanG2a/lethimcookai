import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), "CLI", ".env") });

import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { loadAgentPrompt } from "./generate_prompt.mts";
import { weather } from "./tools/weather.mts";

const mygesPrompt = loadAgentPrompt("myges");

const agentModel = new ChatOpenAI({
  temperature: 0.7, // Augmenter pour plus de créativité et meilleure utilisation des outils
  model: "llama-3.2-3b-instruct", // ou le nom de votre modèle
  maxTokens: 1000, // Limiter les tokens pour éviter les réponses trop longues
  configuration: {
    baseURL: "http://localhost:1234/v1",
    apiKey: "not-needed", // LMStudio ne nécessite pas de clé API réelle
  },
});

// const agentModel = new ChatOpenAI({
//   temperature: 0.5,
//   model: "gpt-4o-mini",
//   apiKey: process.env.OPENAI_API_KEY
// });

const agentCheckpointer = new MemorySaver();
export const mygesAgent = createReactAgent({
  prompt: mygesPrompt,
  llm: agentModel,
  tools: [weather],
  checkpointSaver: agentCheckpointer,
});
