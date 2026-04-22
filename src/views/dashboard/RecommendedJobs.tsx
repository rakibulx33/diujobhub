import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Link } from "@/lib/router";
import { useAuth } from "@/context/AuthContext";
import { useProfile, useRecommendations } from "@/hooks/useAPI";
import {
  calculateEligibilityScore,
  type StudentProfile,
} from "@/data/eligibility";
import {
  Lightbulb,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const RecommendedJobs = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id);
  const { data: dynamicRoles, isLoading: isLoadingRoles } = useRecommendations();

  // Map backend profile to the format the eligibility system expects.
  // Missing fields default to safe zeros/empty arrays. 
  // For a real app, you would add these fields to user_profiles table.
  const studentProfile: StudentProfile | null = profile ? {
    university: "Daffodil International University",
    department: "Computer Science & Engineering (CSE)",
    semester: 4,
    cgpa: 3.0,
    courses: [], 
    skills: Array.isArray(profile.skills) ? profile.skills : 
            (typeof profile.skills === 'string' ? JSON.parse(profile.skills || '[]') : []),
    experience: profile.bio || "",
  } : null;

  const recommended = useMemo(() => {
    if (!studentProfile || !dynamicRoles) return [];
    return dynamicRoles.map(role => {
      const result = calculateEligibilityScore(studentProfile, role);
      const studentCourseNames = studentProfile.courses.map((c: any) => c.name.toLowerCase());
      const topMatches = role.requiredCourses
        .filter((rc: string) => studentCourseNames.includes(rc.toLowerCase()))
        .slice(0, 4);
      return { role, score: result.score, topMatches };
    }).sort((a, b) => b.score - a.score);
  }, [studentProfile, dynamicRoles]);

  if (isLoading || isLoadingRoles) return <p className="text-muted-foreground p-8">Loading recommendations...</p>;
  if (!studentProfile) return <p className="text-muted-foreground p-8">Set up your profile to see AI recommendations.</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-3">
          <Lightbulb className="w-3 h-3 text-primary" />
          <span className="text-xs font-medium">AI Recommendations</span>
        </div>
        <h1 className="font-display font-bold text-3xl tracking-tight">
          Recommended For You
        </h1>
        <p className="text-muted-foreground mt-1">
          Jobs matched to your academic profile and skills
        </p>
      </div>

      {/* Profile summary */}
      <div className="glass rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4 animate-fade-up">
        <div className="w-11 h-11 rounded-xl bg-gradient-primary grid place-items-center text-white shrink-0">
          <Brain className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">
            Based on your profile
          </div>
          <div className="text-xs text-muted-foreground">
            {studentProfile.university} · Semester {studentProfile.semester} · CGPA{" "}
            {studentProfile.cgpa} · {studentProfile.courses.length} courses ·{" "}
            {studentProfile.skills.length} skills
          </div>
        </div>
        <Link
          to="/dashboard/eligibility"
          className="text-xs text-primary font-medium hover:underline shrink-0"
        >
          Update profile →
        </Link>
      </div>

      {/* Recommended Roles */}
      <div className="space-y-4">
        {recommended.map((rec, i) => {
          const isExpanded = expandedId === rec.role.id;
          const scoreColor =
            rec.score >= 70
              ? "text-green-600 bg-green-500/10"
              : rec.score >= 50
              ? "text-amber-600 bg-amber-500/10"
              : "text-red-500 bg-red-500/10";

          return (
            <div
              key={rec.role.id}
              className="glass-strong rounded-3xl overflow-hidden animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="p-6 flex flex-col md:flex-row md:items-center gap-4">
                {/* Score badge */}
                <div className="relative w-16 h-16 shrink-0">
                  <svg className="w-16 h-16 -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="hsl(var(--muted))"
                      strokeWidth="5"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke={
                        rec.score >= 70
                          ? "hsl(145, 55%, 40%)"
                          : rec.score >= 50
                          ? "hsl(40, 90%, 50%)"
                          : "hsl(0, 72%, 50%)"
                      }
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 26}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 26 * (1 - rec.score / 100)
                      }`}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="text-sm font-bold gradient-text">
                      {rec.score}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-bold text-lg">
                      {rec.role.title}
                    </h3>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-md text-[11px] font-bold",
                        scoreColor
                      )}
                    >
                      {rec.score}% match
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {rec.role.description}
                  </p>
                  {rec.topMatches.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {rec.topMatches.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-medium"
                        >
                          ✓ {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link to="/dashboard/eligibility">
                    <Button className="rounded-xl bg-gradient-primary hover:opacity-90 border-0 shadow-glow h-9 px-4 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5 mr-1" /> Check
                      Eligibility
                    </Button>
                  </Link>
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : rec.role.id)
                    }
                    className="p-2 rounded-xl glass hover:bg-foreground/5 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-6 pb-6 animate-fade-up">
                  <div className="glass rounded-2xl p-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Required Courses
                        </div>
                        <div className="space-y-1">
                          {rec.role.requiredCourses.map((c) => {
                            const has = studentProfile.courses.some(
                              (pc) =>
                                pc.name.toLowerCase() === c.toLowerCase()
                            );
                            return (
                              <div
                                key={c}
                                className="flex items-center gap-2 text-sm"
                              >
                                <div
                                  className={cn(
                                    "w-4 h-4 rounded-full grid place-items-center shrink-0",
                                    has
                                      ? "bg-green-500/15"
                                      : "border border-border"
                                  )}
                                >
                                  {has && (
                                    <span className="text-green-500 text-[9px]">
                                      ✓
                                    </span>
                                  )}
                                </div>
                                <span
                                  className={cn(
                                    has
                                      ? "text-muted-foreground"
                                      : "font-medium"
                                  )}
                                >
                                  {c}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Preferred Skills
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {rec.role.preferredSkills.map((s) => {
                            const has = studentProfile.skills.some(
                              (ps) => ps.toLowerCase() === s.toLowerCase()
                            );
                            return (
                              <span
                                key={s}
                                className={cn(
                                  "px-2 py-0.5 rounded-md text-[11px] font-medium",
                                  has
                                    ? "bg-green-500/10 text-green-600"
                                    : "bg-foreground/5 text-muted-foreground"
                                )}
                              >
                                {has ? "✓ " : ""}
                                {s}
                              </span>
                            );
                          })}
                        </div>
                        <div className="mt-4 text-xs text-muted-foreground">
                          Min Semester:{" "}
                          <strong className="text-foreground">
                            {rec.role.minSemester}
                          </strong>{" "}
                          · Default Threshold:{" "}
                          <strong className="text-foreground">
                            {rec.role.defaultThreshold}%
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedJobs;
