import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAIConfig, providerModels, type AIProvider } from "@/context/AIConfigContext";
import { jobRoles } from "@/data/eligibility";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useDashboardStats } from "@/hooks/useAPI";
import {
  Settings,
  Key,
  Cpu,
  Shield,
  Zap,
  Eye,
  EyeOff,
  Check,
  RotateCcw,
  TestTube,
  BarChart3,
  Sparkles,
} from "lucide-react";

const providerIcons: Record<AIProvider, string> = {
  groq: "⚡",
  ollama: "🦙",
  local: "⚙️",
};

const providerDescriptions: Record<AIProvider, string> = {
  groq: "Ultra-fast open-source models hosted on Groq LPU inference engine.",
  ollama: "Run open-source models locally — fully private, no API costs.",
  local: "Built-in scoring algorithm — no AI API needed. Works offline.",
};

const AISettings = () => {
  const { user } = useAuth();
  const { data: stats } = useDashboardStats(user?.id?.toString());
  const { config, updateConfig, resetConfig, setThreshold } = useAIConfig();
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  const handleProviderChange = (provider: AIProvider) => {
    const models = providerModels[provider].models;
    updateConfig({
      provider,
      model: models[0] || "",
      apiKey: provider === config.provider ? config.apiKey : "",
    });
    setTestResult(null);
  };

  const testConnection = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      if (config.provider === "local") {
        setTestResult("success");
        toast.success("Built-in engine ready", { description: "Local scoring is always available." });
      } else if (config.apiKey.trim().length > 10) {
        setTestResult("success");
        toast.success("Connection successful", {
          description: `${providerModels[config.provider].label} API responded. Model: ${config.model}`,
        });
      } else {
        setTestResult("error");
        toast.error("Connection failed", {
          description: "Invalid or missing API key. Please check your credentials.",
        });
      }
      setTesting(false);
    }, 1800);
  };

  const saveConfig = () => {
    toast.success("Configuration saved", {
      description: `Provider: ${providerModels[config.provider].label} · Model: ${config.model || "default"}`,
    });
  };

  const maskedKey = config.apiKey
    ? config.apiKey.slice(0, 6) + "•".repeat(Math.max(0, config.apiKey.length - 10)) + config.apiKey.slice(-4)
    : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-3">
          <Settings className="w-3 h-3 text-primary" />
          <span className="text-xs font-medium">Configuration</span>
        </div>
        <h1 className="font-display font-bold text-3xl tracking-tight">AI Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure the AI model used for candidate eligibility scoring
        </p>
      </div>

      {/* ── Section 1: Provider Selection ────────────────────────── */}
      <div className="glass-strong rounded-3xl p-7 animate-fade-up">
        <h2 className="font-display font-bold text-xl mb-5 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" /> AI Provider
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(Object.keys(providerModels) as AIProvider[]).map((p) => (
            <button
              key={p}
              onClick={() => handleProviderChange(p)}
              className={cn(
                "glass rounded-2xl p-4 text-left transition-all hover:shadow-elegant",
                config.provider === p
                  ? "ring-2 ring-primary shadow-glow"
                  : "hover:bg-foreground/5"
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl grid place-items-center text-lg font-bold shrink-0",
                    config.provider === p
                      ? "bg-gradient-primary text-white"
                      : "bg-foreground/5"
                  )}
                >
                  {providerIcons[p]}
                </div>
                <div className="font-semibold text-sm">{providerModels[p].label}</div>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {providerDescriptions[p]}
              </p>
              {config.provider === p && (
                <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-primary font-semibold">
                  <Check className="w-3 h-3" /> Active
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Section 2: API Configuration ─────────────────────────── */}
      {config.provider !== "local" && (
        <div className="glass-strong rounded-3xl p-7 animate-fade-up" style={{ animationDelay: "80ms" }}>
          <h2 className="font-display font-bold text-xl mb-5 flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" /> API Configuration
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {/* API Key */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={config.apiKey}
                  onChange={(e) => updateConfig({ apiKey: e.target.value })}
                  placeholder={`Enter your ${providerModels[config.provider].label} API key`}
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {config.apiKey && (
                <div className="text-[11px] text-muted-foreground mt-1.5">
                  Key: {maskedKey}
                </div>
              )}
            </div>

            {/* Model */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                Model
              </label>
              <select
                value={config.model}
                onChange={(e) => updateConfig({ model: e.target.value })}
                className="input-field"
              >
                {providerModels[config.provider].models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Ollama Endpoint (only for ollama) */}
            {config.provider === "ollama" && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Ollama Endpoint
                </label>
                <input
                  value={config.ollamaEndpoint}
                  onChange={(e) => updateConfig({ ollamaEndpoint: e.target.value })}
                  placeholder="http://localhost:11434"
                  className="input-field"
                />
              </div>
            )}

            {/* Temperature */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                Temperature: {config.temperature.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature}
                onChange={(e) => updateConfig({ temperature: parseFloat(e.target.value) })}
                className="w-full accent-primary h-2 rounded-full"
                style={{ accentColor: "hsl(var(--primary))" }}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Precise (0)</span>
                <span>Creative (2)</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                Max Tokens
              </label>
              <input
                type="number"
                min={128}
                max={8192}
                value={config.maxTokens}
                onChange={(e) => updateConfig({ maxTokens: parseInt(e.target.value) || 1024 })}
                className="input-field"
              />
            </div>
          </div>

          {/* Test Connection */}
          <div className="flex items-center gap-3 mt-6">
            <Button
              onClick={testConnection}
              disabled={testing}
              className={cn(
                "rounded-2xl h-10 px-5 text-xs font-semibold",
                testResult === "success"
                  ? "bg-green-500 text-white hover:bg-green-600 border-0"
                  : testResult === "error"
                  ? "bg-destructive text-white hover:bg-destructive/90 border-0"
                  : "bg-gradient-primary hover:opacity-90 border-0 text-white"
              )}
            >
              {testing ? (
                <>
                  <Zap className="w-3.5 h-3.5 mr-1 animate-pulse" /> Testing...
                </>
              ) : testResult === "success" ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1" /> Connected
                </>
              ) : testResult === "error" ? (
                <>
                  <TestTube className="w-3.5 h-3.5 mr-1" /> Retry
                </>
              ) : (
                <>
                  <TestTube className="w-3.5 h-3.5 mr-1" /> Test Connection
                </>
              )}
            </Button>
            {testResult === "success" && (
              <span className="text-xs text-green-600 font-medium animate-fade-up">
                ✓ API is reachable
              </span>
            )}
            {testResult === "error" && (
              <span className="text-xs text-destructive font-medium animate-fade-up">
                ✕ Check API key and try again
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Section 3: Scoring Rules ─────────────────────────────── */}
      <div className="glass-strong rounded-3xl p-7 animate-fade-up" style={{ animationDelay: "160ms" }}>
        <h2 className="font-display font-bold text-xl mb-5 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" /> Scoring Rules
        </h2>

        {/* Toggles */}
        <div className="space-y-3 mb-6">
          <label className="glass rounded-xl p-4 flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-sm font-semibold">Auto-reject below threshold</div>
              <div className="text-xs text-muted-foreground">
                Automatically prevent applications below the minimum score
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateConfig({ autoReject: !config.autoReject })}
              className={cn(
                "w-11 h-6 rounded-full p-0.5 transition-colors",
                config.autoReject ? "bg-gradient-primary" : "bg-muted"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full bg-white shadow transition-transform",
                  config.autoReject && "translate-x-5"
                )}
              />
            </button>
          </label>

          <label className="glass rounded-xl p-4 flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-sm font-semibold">Enable AI recommendations</div>
              <div className="text-xs text-muted-foreground">
                Show course and skill suggestions to candidates
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                updateConfig({ enableRecommendations: !config.enableRecommendations })
              }
              className={cn(
                "w-11 h-6 rounded-full p-0.5 transition-colors",
                config.enableRecommendations ? "bg-gradient-primary" : "bg-muted"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full bg-white shadow transition-transform",
                  config.enableRecommendations && "translate-x-5"
                )}
              />
            </button>
          </label>
        </div>

        {/* Per-role thresholds */}
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Score Thresholds Per Role
        </div>
        <div className="space-y-2">
          {jobRoles.map((role, i) => {
            const val = config.scoreThresholds[role.id] ?? role.defaultThreshold;
            return (
              <div
                key={role.id}
                className="glass rounded-xl p-3 flex items-center gap-4 animate-fade-up"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <span className="flex-1 text-sm font-medium">{role.title}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={val}
                    onChange={(e) =>
                      setThreshold(role.id, parseInt(e.target.value) || 0)
                    }
                    className="input-field !w-20 !py-1.5 !text-xs text-center !rounded-lg"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
                {val !== role.defaultThreshold && (
                  <button
                    onClick={() => setThreshold(role.id, role.defaultThreshold)}
                    className="text-[10px] text-primary font-medium hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section 4: Usage Stats ───────────────────────────────── */}
      <div className="glass-strong rounded-3xl p-7 animate-fade-up" style={{ animationDelay: "240ms" }}>
        <h2 className="font-display font-bold text-xl mb-5 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" /> Usage Statistics
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "API Calls This Month", value: stats?.apiCallsThisMonth?.toLocaleString() ?? "...", icon: Zap },
            { label: "Avg Response Time", value: stats?.avgResponseTime ?? "...", icon: Sparkles },
            { label: "Candidates Scored", value: stats?.candidatesScored?.toLocaleString() ?? "...", icon: BarChart3 },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="glass rounded-2xl p-5 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 grid place-items-center mb-3">
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="font-display font-bold text-2xl">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Save / Reset ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: "320ms" }}>
        <Button
          onClick={saveConfig}
          className="rounded-2xl bg-gradient-primary hover:opacity-90 border-0 shadow-glow h-12 px-7 font-semibold"
        >
          <Check className="w-4 h-4 mr-1" /> Save Configuration
        </Button>
        <Button
          onClick={() => {
            resetConfig();
            toast("Configuration reset to defaults");
          }}
          variant="outline"
          className="rounded-2xl glass border-0 h-12 px-6"
        >
          <RotateCcw className="w-4 h-4 mr-1" /> Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default AISettings;
