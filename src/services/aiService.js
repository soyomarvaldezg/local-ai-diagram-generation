import { PROVIDERS, getApiKey } from "./providerConfig";

const GROQ_AUDIO_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

// Speech-to-Text using Groq Whisper
export async function transcribeAudio(audioBlob) {
  const GROQ_API_KEY = getApiKey("groq");

  if (!GROQ_API_KEY) {
    throw new Error(
      "Groq API key not found. Speech recognition requires Groq.",
    );
  }

  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "whisper-large-v3");
    formData.append("response_format", "json");

    const response = await fetch(GROQ_AUDIO_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Transcription API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Transcription Error:", error);
    throw error;
  }
}

// Generate diagram with selected provider
export async function generateDiagram(userPrompt, providerId = "groq") {
  const provider = PROVIDERS[providerId.toUpperCase()];
  const apiKey = getApiKey(providerId);

  if (!provider) {
    throw new Error(`Unknown provider: ${providerId}`);
  }

  if (!apiKey) {
    throw new Error(`API key not found for ${provider.name}`);
  }

  if (providerId === "gemini") {
    return generateDiagramGemini(userPrompt, provider, apiKey);
  } else {
    return generateDiagramOpenAIFormat(userPrompt, provider, apiKey);
  }
}

// OpenAI-compatible format (Groq, Cerebras)
async function generateDiagramOpenAIFormat(userPrompt, provider, apiKey) {
  const systemPrompt = `You are a diagram generation expert. Generate ONLY valid Mermaid.js syntax based on the user's description.

Rules:
- For flowcharts use "graph TD" (top-down) or "graph LR" (left-right)
- Use clear node labels with brackets: A[Label Text]
- Use arrows to connect: A --> B
- Keep it clean and well-structured
- Return ONLY the Mermaid code, no explanations, no markdown backticks, no extra text

Example output:
graph TD
A[Start] --> B[Process Data]
B --> C[Store Results]
C --> D[Generate Insights]`;

  try {
    const response = await fetch(provider.apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `${provider.name} API Error: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    let mermaidCode = data.choices[0].message.content.trim();

    mermaidCode = mermaidCode
      .replace(/```mermaid\n?/g, "")
      .replace(/```/g, "")
      .trim();

    return mermaidCode;
  } catch (error) {
    console.error(`${provider.name} API Error:`, error);
    throw error;
  }
}

// Gemini format
async function generateDiagramGemini(userPrompt, provider, apiKey) {
  const fullPrompt = `You are a diagram generation expert. Generate ONLY valid Mermaid.js syntax.

User request: ${userPrompt}

Rules:
- For flowcharts use "graph TD" or "graph LR"
- Use clear node labels: A[Label Text]
- Use arrows: A --> B
- Return ONLY Mermaid code, no explanations

Example:
graph TD
A[Start] --> B[Process]
B --> C[End]`;

  try {
    const url = `${provider.apiUrl}?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1500,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let mermaidCode = data.candidates[0].content.parts[0].text.trim();

    mermaidCode = mermaidCode
      .replace(/```mermaid\n?/g, "")
      .replace(/```/g, "")
      .trim();

    return mermaidCode;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
