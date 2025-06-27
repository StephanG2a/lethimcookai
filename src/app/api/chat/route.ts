import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_URL || "http://localhost:8080";
const BEARER_TOKEN = process.env.API_BEARER_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, agentId, threadId, useStream = true } = body;

    if (!message || !agentId) {
      return NextResponse.json(
        { error: "Message et agentId sont requis" },
        { status: 400 }
      );
    }

    const endpoint = useStream ? "stream" : "invoke";
    const url = `${API_BASE_URL}/${agentId}/${endpoint}`;

    const payload = {
      message,
      thread_id: threadId,
      conversation_id: threadId,
      chat_id: threadId,
      context: BEARER_TOKEN
        ? {
            configurable: {
              __bearer_token: BEARER_TOKEN,
            },
          }
        : undefined,
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (BEARER_TOKEN) {
      headers["Authorization"] = `Bearer ${BEARER_TOKEN}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur du serveur:", errorText);
      return NextResponse.json(
        { error: "Erreur du serveur agent", details: errorText },
        { status: response.status }
      );
    }

    if (useStream) {
      // Créer un ReadableStream pour transformer les SSE en JSON streaming
      const readable = new ReadableStream({
        start(controller) {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            controller.close();
            return;
          }

          let buffer = "";

          const pump = async () => {
            try {
              const { done, value } = await reader.read();

              if (done) {
                // Envoyer un signal de fin explicite avant de fermer
                const endSignal = JSON.stringify({ done: true, finished: true }) + "\n";
                controller.enqueue(new TextEncoder().encode(endSignal));
                controller.close();
                return;
              }

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");

              // Garder la dernière ligne incomplète dans le buffer
              buffer = lines.pop() || "";

              for (const line of lines) {
                if (line.trim()) {
                  // Parser les événements SSE
                  if (line.startsWith("event:")) {
                    // Ignorer les lignes d'événement
                    continue;
                  } else if (line.startsWith("data:")) {
                    try {
                      const dataStr = line.substring(5).trim();
                      if (dataStr) {
                        const data = JSON.parse(dataStr);

                        // Transformer les événements SSE en format simple pour le client
                        if (data.token) {
                          // Événement stream_token
                          const jsonLine =
                            JSON.stringify({ content: data.token }) + "\n";
                          controller.enqueue(
                            new TextEncoder().encode(jsonLine)
                          );
                        } else if (data.name && data.output) {
                          // Événement tool_execution_complete - parser les métadonnées d'images, vidéos, PDFs, services et organisations
                          const output = data.output;
                          let content = output;
                          let images: any[] = [];
                          let videos: any[] = [];
                          let pdfs: any[] = [];
                          let websites: any[] = [];
                          let services: any[] = [];
                          let organizations: any[] = [];
                          let prestataires: any[] = [];

                          // Extraire les métadonnées d'images si présentes
                          if (output.includes("**MÉTADONNÉES_IMAGE:**")) {
                            const startIndex = output.indexOf("**MÉTADONNÉES_IMAGE:**");
                            const metaLine = output.substring(startIndex);
                            const endIndex = metaLine.indexOf("\n");
                            const metaText = endIndex > 0 ? metaLine.substring(0, endIndex) : metaLine;
                            const jsonText = metaText.replace("**MÉTADONNÉES_IMAGE:**", "").trim();
                            
                            try {
                              const imageData = JSON.parse(jsonText);
                              images = [imageData];
                              // Retirer les métadonnées du contenu visible
                              const metaStartIndex = output.indexOf("---");
                              if (metaStartIndex > 0) {
                                content = output.substring(0, metaStartIndex).trim();
                              }
                            } catch (e) {
                              console.warn("Erreur parsing métadonnées image:", e);
                            }
                          }

                          // Extraire les métadonnées de vidéos si présentes
                          if (output.includes("**MÉTADONNÉES_VIDÉO:**")) {
                            const startIndex = output.indexOf("**MÉTADONNÉES_VIDÉO:**");
                            const metaLine = output.substring(startIndex);
                            const endIndex = metaLine.indexOf("\n");
                            const metaText = endIndex > 0 ? metaLine.substring(0, endIndex) : metaLine;
                            const jsonText = metaText.replace("**MÉTADONNÉES_VIDÉO:**", "").trim();
                            
                            try {
                              const videoData = JSON.parse(jsonText);
                              videos = [videoData];
                              // Retirer les métadonnées du contenu visible
                              const metaStartIndex = output.indexOf("---");
                              if (metaStartIndex > 0) {
                                content = output.substring(0, metaStartIndex).trim();
                              }
                            } catch (e) {
                              console.warn("Erreur parsing métadonnées vidéo:", e);
                            }
                          }

                          // Extraire les métadonnées de PDFs si présentes
                          if (output.includes("**MÉTADONNÉES_PDF:**")) {
                            const startIndex = output.indexOf("**MÉTADONNÉES_PDF:**");
                            const metaLine = output.substring(startIndex);
                            const endIndex = metaLine.indexOf("\n");
                            const metaText = endIndex > 0 ? metaLine.substring(0, endIndex) : metaLine;
                            const jsonText = metaText.replace("**MÉTADONNÉES_PDF:**", "").trim();
                            
                            console.log("📄 Parsing PDF metadata:", jsonText.substring(0, 200) + "...");
                            
                            try {
                              const pdfData = JSON.parse(jsonText);
                              pdfs = [pdfData];
                              console.log("✅ PDF metadata parsed successfully:", {
                                filename: pdfData.filename,
                                hasData: !!pdfData.data,
                                dataLength: pdfData.data?.length || 0
                              });
                              // Retirer les métadonnées du contenu visible
                              const metaStartIndex = output.indexOf("---");
                              if (metaStartIndex > 0) {
                                content = output.substring(0, metaStartIndex).trim();
                              }
                            } catch (e) {
                              console.warn("Erreur parsing métadonnées PDF:", e, "JSON:", jsonText.substring(0, 100));
                            }
                          }

                          // Extraire les métadonnées de services si présentes
                          if (output.includes("**MÉTADONNÉES_SERVICES:**")) {
                            const startIndex = output.indexOf("**MÉTADONNÉES_SERVICES:**");
                            const metaLine = output.substring(startIndex);
                            const endIndex = metaLine.indexOf("\n");
                            const metaText = endIndex > 0 ? metaLine.substring(0, endIndex) : metaLine;
                            const jsonText = metaText.replace("**MÉTADONNÉES_SERVICES:**", "").trim();
                            
                            try {
                              const servicesData = JSON.parse(jsonText);
                              services = servicesData.services || [];
                              // Retirer les métadonnées du contenu visible
                              const metaStartIndex = output.indexOf("---");
                              if (metaStartIndex > 0) {
                                content = output.substring(0, metaStartIndex).trim();
                              }
                            } catch (e) {
                              console.warn("Erreur parsing métadonnées services:", e);
                            }
                          }

                          // Extraire les métadonnées de sites web si présentes
                          if (output.includes("**MÉTADONNÉES_WEBSITE:**")) {
                            const startIndex = output.indexOf("**MÉTADONNÉES_WEBSITE:**");
                            const metaLine = output.substring(startIndex);
                            const endIndex = metaLine.indexOf("\n");
                            const metaText = endIndex > 0 ? metaLine.substring(0, endIndex) : metaLine;
                            const jsonText = metaText.replace("**MÉTADONNÉES_WEBSITE:**", "").trim();
                            
                            try {
                              const websiteData = JSON.parse(jsonText);
                              websites = [websiteData];
                              // Retirer les métadonnées du contenu visible
                              const metaStartIndex = output.indexOf("---");
                              if (metaStartIndex > 0) {
                                content = output.substring(0, metaStartIndex).trim();
                              }
                            } catch (e) {
                              console.warn("Erreur parsing métadonnées website:", e);
                            }
                          }

                          // Extraire les métadonnées d'organisations si présentes
                          if (output.includes("**MÉTADONNÉES_ORGANISATIONS:**")) {
                            const startIndex = output.indexOf("**MÉTADONNÉES_ORGANISATIONS:**");
                            const metaLine = output.substring(startIndex);
                            const endIndex = metaLine.indexOf("\n");
                            const metaText = endIndex > 0 ? metaLine.substring(0, endIndex) : metaLine;
                            const jsonText = metaText.replace("**MÉTADONNÉES_ORGANISATIONS:**", "").trim();
                            
                            try {
                              const orgsData = JSON.parse(jsonText);
                              organizations = orgsData.organizations || [];
                              // Retirer les métadonnées du contenu visible
                              const metaStartIndex = output.indexOf("---");
                              if (metaStartIndex > 0) {
                                content = output.substring(0, metaStartIndex).trim();
                              }
                            } catch (e) {
                              console.warn("Erreur parsing métadonnées organisations:", e);
                            }
                          }

                          // Extraire les métadonnées de prestataires si présentes
                          if (output.includes("**MÉTADONNÉES_PRESTATAIRES:**")) {
                            const startIndex = output.indexOf("**MÉTADONNÉES_PRESTATAIRES:**");
                            const metaLine = output.substring(startIndex);
                            const endIndex = metaLine.indexOf("\n");
                            const metaText = endIndex > 0 ? metaLine.substring(0, endIndex) : metaLine;
                            const jsonText = metaText.replace("**MÉTADONNÉES_PRESTATAIRES:**", "").trim();
                            
                            try {
                              const prestatairesData = JSON.parse(jsonText);
                              prestataires = prestatairesData.prestataires || [];
                              // Retirer les métadonnées du contenu visible
                              const metaStartIndex = output.indexOf("---");
                              if (metaStartIndex > 0) {
                                content = output.substring(0, metaStartIndex).trim();
                              }
                            } catch (e) {
                              console.warn("Erreur parsing métadonnées prestataires:", e);
                            }
                          }

                          const jsonLine =
                            JSON.stringify({
                              content: `${content}\n`,
                              images: images.length > 0 ? images : undefined,
                              videos: videos.length > 0 ? videos : undefined,
                              pdfs: pdfs.length > 0 ? pdfs : undefined,
                              websites: websites.length > 0 ? websites : undefined,
                              services:
                                services.length > 0 ? services : undefined,
                              organizations:
                                organizations.length > 0
                                  ? organizations
                                  : undefined,
                              prestataires:
                                prestataires.length > 0
                                  ? prestataires
                                  : undefined,
                            }) + "\n";
                          controller.enqueue(
                            new TextEncoder().encode(jsonLine)
                          );
                        }
                      }
                    } catch (parseError) {
                      console.warn(
                        "Erreur parsing SSE:",
                        parseError,
                        "Line:",
                        line
                      );
                    }
                  }
                }
              }

              await pump();
            } catch (error) {
              console.error("Erreur stream:", error);
              controller.error(error);
            }
          };

          pump();
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } else {
      // Retourner la réponse JSON
      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Récupérer la liste des agents disponibles
    const url = `${API_BASE_URL}/agents`;

    const headers: Record<string, string> = {};
    if (BEARER_TOKEN) {
      headers["Authorization"] = `Bearer ${BEARER_TOKEN}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const agents = await response.json();
    return NextResponse.json(agents);
  } catch (error) {
    console.error("Erreur lors de la récupération des agents:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des agents",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
