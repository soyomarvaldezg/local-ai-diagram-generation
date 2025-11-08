// Provider configurations
export const PROVIDERS = {
  GROQ: {
    id: "groq",
    name: "Groq",
    model: "llama-3.3-70b-versatile",
    apiUrl: "https://api.groq.com/openai/v1/chat/completions",
    icon: "⚡",
    description: "Fastest, great for quick iterations",
  },
  CEREBRAS: {
    id: "cerebras",
    name: "Cerebras",
    model: "llama3.3-70b",
    apiUrl: "https://api.cerebras.ai/v1/chat/completions",
    icon: "🧠",
    description: "Ultra-fast, high token limit",
  },
  GEMINI: {
    id: "gemini",
    name: "Gemini Flash",
    model: "gemini-2.5-flash",
    apiUrl:
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    icon: "✨",
    description: "Google AI, multimodal capable",
  },
};

// Get API key for provider
export function getApiKey(providerId) {
  switch (providerId) {
    case "groq":
      return import.meta.env.VITE_GROQ_API_KEY;
    case "cerebras":
      return import.meta.env.VITE_CEREBRAS_API_KEY;
    case "gemini":
      return import.meta.env.VITE_GEMINI_API_KEY;
    default:
      return null;
  }
}

// Check which providers have valid API keys
export function getAvailableProviders() {
  return Object.values(PROVIDERS).filter((provider) => {
    const key = getApiKey(provider.id);
    return key && key.length > 0;
  });
}
