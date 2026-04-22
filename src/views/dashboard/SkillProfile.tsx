import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { skillCategories, jobRoles, type Skill } from "@/data/eligibility";
import {
  Target,
  X,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Sparkles,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useProfile, useSaveSkills } from "@/hooks/useAPI";
import { toast } from "sonner";

const levelColors = {
  Beginner: "bg-amber-500/10 text-amber-600",
  Intermediate: "bg-primary/10 text-primary",
  Advanced: "bg-green-500/10 text-green-600",
};

const levelWidths = {
  Beginner: "33%",
  Intermediate: "66%",
  Advanced: "100%",
};

const SkillProfile = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const saveSkillsMutation = useSaveSkills(user?.id);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [addingCategory, setAddingCategory] = useState<string | null>(null);
  const [expandedGap, setExpandedGap] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Load skills from profile on mount
  useEffect(() => {
    if (profile?.skills && Array.isArray(profile.skills)) {
      const loaded: Skill[] = profile.skills.map((s: any) =>
        typeof s === "string"
          ? { name: s, level: "Intermediate" as const }
          : { name: s.name, level: s.level || "Intermediate" }
      );
      setSkills(loaded);
      setHasChanges(false);
    }
  }, [profile]);

  const addSkill = (name: string) => {
    if (!skills.find((s) => s.name === name)) {
      setSkills((prev) => [...prev, { name, level: "Beginner" }]);
      setHasChanges(true);
    }
  };

  const removeSkill = (name: string) => {
    setSkills((prev) => prev.filter((s) => s.name !== name));
    setHasChanges(true);
  };

  const cycleLevel = (name: string) => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.name !== name) return s;
        const next =
          s.level === "Beginner"
            ? "Intermediate"
            : s.level === "Intermediate"
            ? "Advanced"
            : "Beginner";
        return { ...s, level: next };
      })
    );
    setHasChanges(true);
  };

  const handleSave = useCallback(async () => {
    try {
      await saveSkillsMutation.mutateAsync(skills);
      setHasChanges(false);
      toast.success(`${skills.length} skills saved to database!`);
    } catch {
      toast.error("Failed to save skills.");
    }
  }, [skills, saveSkillsMutation]);

  const userSkillNames = skills.map((s) => s.name.toLowerCase());

  // Skill gap analysis per role
  const getGapAnalysis = (roleId: string) => {
    const role = jobRoles.find((r) => r.id === roleId);
    if (!role) return { missing: [], have: [] };
    const missing = role.preferredSkills.filter(
      (s) => !userSkillNames.includes(s.toLowerCase())
    );
    const have = role.preferredSkills.filter((s) =>
      userSkillNames.includes(s.toLowerCase())
    );
    return { missing, have };
  };

  if (profileLoading) {
    return (
      <div className="min-h-[400px] grid place-items-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-3">
            <Target className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium">Skill Management</span>
          </div>
          <h1 className="font-display font-bold text-3xl tracking-tight">
            Skill Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your skills — changes are saved to your database profile
          </p>
        </div>
        {hasChanges && (
          <Button
            onClick={handleSave}
            disabled={saveSkillsMutation.isPending}
            className="bg-gradient-primary hover:opacity-90 rounded-xl shadow-glow gap-2"
          >
            {saveSkillsMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Skills
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-[1fr_340px] gap-6">
        {/* Skills List */}
        <div className="space-y-5">
          {/* Current Skills */}
          <div className="glass-strong rounded-3xl p-7 animate-fade-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-xl">
                Your Skills ({skills.length})
              </h2>
              {hasChanges && (
                <span className="text-xs text-amber-500 font-medium animate-pulse">
                  Unsaved changes
                </span>
              )}
            </div>

            {skills.length === 0 ? (
              <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
                <p>No skills added yet. Add some below!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {skills.map((s, i) => (
                  <div
                    key={s.name}
                    className="glass rounded-xl p-3 flex items-center gap-3 animate-fade-up"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <span className="flex-1 text-sm font-medium">
                      {s.name}
                    </span>
                    <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          s.level === "Advanced"
                            ? "bg-green-500"
                            : s.level === "Intermediate"
                            ? "bg-primary"
                            : "bg-amber-500"
                        )}
                        style={{ width: levelWidths[s.level] }}
                      />
                    </div>
                    <button
                      onClick={() => cycleLevel(s.name)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer",
                        levelColors[s.level]
                      )}
                    >
                      {s.level}
                    </button>
                    <button
                      onClick={() => removeSkill(s.name)}
                      className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Skills by Category */}
          <div className="glass-strong rounded-3xl p-7 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <h2 className="font-display font-bold text-xl mb-5">
              Add Skills
            </h2>
            <div className="space-y-3">
              {skillCategories.map((cat) => (
                <div key={cat.category} className="glass rounded-2xl overflow-hidden">
                  <button
                    onClick={() =>
                      setAddingCategory(
                        addingCategory === cat.category
                          ? null
                          : cat.category
                      )
                    }
                    className="w-full flex items-center justify-between p-4 hover:bg-foreground/5 transition-colors"
                  >
                    <span className="text-sm font-semibold">{cat.category}</span>
                    {addingCategory === cat.category ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  {addingCategory === cat.category && (
                    <div className="p-4 pt-0 flex flex-wrap gap-1.5 animate-fade-up">
                      {cat.skills.map((s) => {
                        const has = userSkillNames.includes(s.toLowerCase());
                        return (
                          <button
                            key={s}
                            onClick={() => !has && addSkill(s)}
                            disabled={has}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                              has
                                ? "bg-primary/10 text-primary cursor-default"
                                : "bg-foreground/5 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                            )}
                          >
                            {has ? "✓ " : "+ "}
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Gap Sidebar */}
        <div className="space-y-5">
          <div className="glass-strong rounded-3xl p-6 animate-fade-up" style={{ animationDelay: "150ms" }}>
            <h3 className="font-display font-bold text-lg mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> AI Skill Gap
            </h3>
            <p className="text-xs text-muted-foreground mb-5">
              See what skills you're missing for each role
            </p>

            <div className="space-y-2">
              {jobRoles.map((role) => {
                const { missing, have } = getGapAnalysis(role.id);
                const pct =
                  role.preferredSkills.length > 0
                    ? Math.round(
                        (have.length / role.preferredSkills.length) * 100
                      )
                    : 0;
                const isExpanded = expandedGap === role.id;

                return (
                  <div key={role.id} className="glass rounded-xl overflow-hidden">
                    <button
                      onClick={() =>
                        setExpandedGap(isExpanded ? null : role.id)
                      }
                      className="w-full p-3 flex items-center gap-3 hover:bg-foreground/5 transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <div className="text-sm font-semibold">
                          {role.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {have.length}/{role.preferredSkills.length} skills
                        </div>
                      </div>
                      <div
                        className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-md",
                          pct >= 60
                            ? "bg-green-500/10 text-green-600"
                            : pct >= 30
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-red-500/10 text-red-500"
                        )}
                      >
                        {pct}%
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-3 pb-3 animate-fade-up">
                        {missing.length > 0 && (
                          <div className="mb-2">
                            <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-500 mb-1.5 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Missing
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {missing.map((s) => (
                                <button
                                  key={s}
                                  onClick={() => addSkill(s)}
                                  className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 text-[10px] font-medium hover:bg-amber-500/20 transition-colors"
                                >
                                  + {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        {have.length > 0 && (
                          <div>
                            <div className="text-[10px] font-semibold uppercase tracking-wider text-green-500 mb-1.5">
                              ✓ You have
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {have.map((s) => (
                                <span
                                  key={s}
                                  className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-600 text-[10px] font-medium"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillProfile;
