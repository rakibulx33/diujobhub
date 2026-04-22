import { Search, MapPin, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@/lib/router";
import { useState } from "react";

const popular = ["Product Designer", "Frontend Engineer", "ML Engineer", "Product Manager"];

export const Hero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const onSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("loc", location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative pt-16 pb-24 px-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-primary/30 blur-3xl animate-float" />
        <div className="absolute top-40 right-1/4 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 animate-fade-up">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium">DIUJOBHUB — Powered by Daffodil International University</span>
        </div>

        <h1 className="font-display font-bold text-5xl md:text-7xl leading-[1.05] tracking-tight mb-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
          Find work you'll<br />
          <span className="gradient-text">actually love.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "200ms" }}>
          The DIU job platform built for ambitious people. Curated roles, real salaries, no spam.
        </p>

        <div className="glass-strong rounded-3xl p-2 max-w-3xl mx-auto flex flex-col md:flex-row items-stretch gap-2 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <div className="flex-1 flex items-center gap-3 px-4 py-3">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              placeholder="Job title or keyword"
              className="bg-transparent flex-1 outline-none text-sm font-medium placeholder:text-muted-foreground"
            />
          </div>
          <div className="hidden md:block w-px bg-border my-2" />
          <div className="flex-1 flex items-center gap-3 px-4 py-3">
            <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              placeholder="Location or remote"
              className="bg-transparent flex-1 outline-none text-sm font-medium placeholder:text-muted-foreground"
            />
          </div>
          <Button onClick={onSearch} className="rounded-2xl bg-gradient-primary hover:opacity-90 border-0 shadow-glow h-12 px-8 font-semibold">
            Search
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 animate-fade-up" style={{ animationDelay: "400ms" }}>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Trending:
          </span>
          {popular.map((p) => (
            <button
              key={p}
              onClick={() => { setQuery(p); }}
              className="px-3 py-1 text-xs rounded-full glass hover:bg-foreground/5 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "500ms" }}>
          {[
            { v: "12.4k", l: "Open roles" },
            { v: "850+", l: "Top companies" },
            { v: "92%", l: "Hire rate" },
          ].map((s) => (
            <div key={s.l} className="glass rounded-2xl p-5">
              <div className="font-display font-bold text-3xl gradient-text">{s.v}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
