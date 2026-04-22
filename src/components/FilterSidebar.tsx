import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export type Filters = {
  types: string[];
  levels: string[];
  remote: boolean;
};

const TYPES = ["Full-time", "Part-time", "Contract", "Remote"];
const LEVELS = ["Junior", "Mid", "Senior", "Lead"];

export const FilterSidebar = ({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
}) => {
  const toggle = (key: "types" | "levels", val: string) => {
    const arr = filters[key];
    setFilters({
      ...filters,
      [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val],
    });
  };

  return (
    <aside className="glass-strong rounded-3xl p-6 sticky top-28 h-fit">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <h3 className="font-display font-bold">Filters</h3>
        </div>
        <button
          onClick={() => setFilters({ types: [], levels: [], remote: false })}
          className="text-xs text-muted-foreground hover:text-primary"
        >
          Clear
        </button>
      </div>

      <Section title="Job type">
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <Chip key={t} active={filters.types.includes(t)} onClick={() => toggle("types", t)}>
              {t}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Experience">
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <Chip key={l} active={filters.levels.includes(l)} onClick={() => toggle("levels", l)}>
              {l}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Work setting">
        <label className="flex items-center justify-between glass rounded-xl p-3 cursor-pointer">
          <span className="text-sm font-medium">Remote only</span>
          <button
            onClick={() => setFilters({ ...filters, remote: !filters.remote })}
            className={cn(
              "w-10 h-6 rounded-full p-0.5 transition-colors",
              filters.remote ? "bg-gradient-primary" : "bg-muted"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full bg-white shadow transition-transform",
                filters.remote && "translate-x-4"
              )}
            />
          </button>
        </label>
      </Section>

      <Section title="Salary range">
        <input type="range" min="40" max="300" defaultValue="120" className="w-full accent-primary" />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>$40k</span>
          <span>$300k+</span>
        </div>
      </Section>
    </aside>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6 pb-6 border-b border-border/60 last:border-0 last:pb-0 last:mb-0">
    <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">{title}</h4>
    {children}
  </div>
);

const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
      active
        ? "bg-gradient-primary text-white shadow-glow"
        : "glass hover:bg-foreground/5"
    )}
  >
    {children}
  </button>
);
