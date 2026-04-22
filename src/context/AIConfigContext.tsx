import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AIProvider = "groq" | "ollama" | "local";

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  ollamaEndpoint: string;
  temperature: number;
  maxTokens: number;
  scoreThresholds: Record<string, number>;
  autoReject: boolean;
  enableRecommendations: boolean;
}

const defaultConfig: AIConfig = {
  provider: "local",
  apiKey: "",
  model: "",
  ollamaEndpoint: "http://localhost:11434",
  temperature: 0.7,
  maxTokens: 1024,
  scoreThresholds: {},
  autoReject: true,
  enableRecommendations: true,
};

interface AIConfigContextType {
  config: AIConfig;
  updateConfig: (partial: Partial<AIConfig>) => void;
  resetConfig: () => void;
  setThreshold: (roleId: string, threshold: number) => void;
}

const AIConfigContext = createContext<AIConfigContextType | null>(null);

export const AIConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<AIConfig>(defaultConfig);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          const loadedProvider = data.config.provider as AIProvider;
          const validProvider = providerModels[loadedProvider] ? loadedProvider : "local";
          
          const availableModels = providerModels[validProvider]?.models || [];
          let validModel = data.config.model;
          if (!availableModels.includes(validModel)) {
            validModel = availableModels[0] || "";
          }

          setConfig((prev) => ({ 
            ...prev, 
            ...data.config,
            provider: validProvider,
            model: validModel,
          }));
        }
      })
      .catch((err) => console.error("Failed fetching settings", err));
  }, []);

  const syncToDB = (newConfig: AIConfig) => {
    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config: newConfig }),
    }).catch((err) => console.error("Failed saving settings", err));
  };

  const updateConfig = (partial: Partial<AIConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...partial };
      syncToDB(next);
      return next;
    });
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    syncToDB(defaultConfig);
  };

  const setThreshold = (roleId: string, threshold: number) => {
    setConfig((prev) => {
      const next = {
        ...prev,
        scoreThresholds: { ...prev.scoreThresholds, [roleId]: threshold },
      };
      syncToDB(next);
      return next;
    });
  };

  return (
    <AIConfigContext.Provider value={{ config, updateConfig, resetConfig, setThreshold }}>
      {children}
    </AIConfigContext.Provider>
  );
};

export const useAIConfig = () => {
  const ctx = useContext(AIConfigContext);
  if (!ctx) throw new Error("useAIConfig must be used within AIConfigProvider");
  return ctx;
};

export const providerModels: Record<AIProvider, { label: string; models: string[] }> = {
  groq: {
    label: "Groq (Fast Inference)",
    models: ["llama-3.1-8b-instant", "llama-3.3-70b-versatile", "mixtral-8x7b-32768", "gemma2-9b-it"],
  },
  ollama: {
    label: "Ollama (Local)",
    models: ["llama3", "mistral", "codellama", "phi3", "gemma2"],
  },
  local: {
    label: "Built-in (No API)",
    models: ["local-scoring-v1"],
  },
};
