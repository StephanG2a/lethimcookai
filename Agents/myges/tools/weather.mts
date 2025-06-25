import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const weather = tool(
  async ({ ville }) => {
    try {
      const url = `https://wttr.in/${encodeURIComponent(ville)}?format=j1&lang=fr`;      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'curl/7.68.0' 
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return `❌ Ville "${ville}" non trouvée. Vérifiez l'orthographe.`;
        }
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Formatage des données météo en texte lisible
      const current = data.current_condition[0];
      const weather_desc = current.lang_fr[0].value;
      
      const result = `🌍 Météo à ${ville} :
🌡️ Température : ${current.temp_C}°C (ressenti ${current.FeelsLikeC}°C)
☁️ Conditions : ${weather_desc}
💧 Humidité : ${current.humidity}%
💨 Vent : ${current.windspeedKmph} km/h
👁️ Visibilité : ${current.visibility} km`;

      return result;
      
    } catch (error) {
      console.error('Erreur météo:', error);
      return `❌ Impossible de récupérer la météo pour "${ville}". Vérifiez le nom de la ville.`;
    }
  },
  {
    name: "weather",
    description: "Obtient les informations météo en temps réel pour une ville donnée (service gratuit sans clé API)",
    schema: z.object({
      ville: z.string().describe("Le nom de la ville pour laquelle obtenir la météo (ex: Paris, London, Tokyo)"),
    }),
  }
); 