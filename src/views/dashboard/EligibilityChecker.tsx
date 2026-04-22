import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useProfile, useAcademicRecords } from "@/hooks/useAPI";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Brain,
  Sparkles,
  MapPin,
  Briefcase,
  DollarSign,
  TrendingUp,
  Search,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";

type MatchedJob = {
  id: string;
  title: string;
  company: string;
  logo: string;
  logoBg: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  tags: string[];
  matchScore: number;
  matchReasons: string[];
};

const EligibilityChecker = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const { data: academics = [] } = useAcademicRecords(user?.id);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<MatchedJob[] | null>(null);

  // Fetch all active jobs
  const { data: allJobs = [] } = useQuery({
    queryKey: ["all-jobs-for-matching"],
    queryFn: async () => {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      return data.jobs || [];
    },
  });

  const userSkills: string[] = (profile?.skills || []).map((s: any) =>
    (typeof s === "string" ? s : s.name).toLowerCase()
  );

  const avgCgpa =
    academics.length > 0
      ? academics.reduce((sum: number, r: any) => sum + (Number(r.cgpa) || 0), 0) / academics.length
      : 0;

  const courseNames: string[] = academics.map((r: any) =>
    (r.course_name || "").toLowerCase()
  );

  const findJobs = async () => {
    setSearching(true);
    
    try {
      const res = await fetch("/api/ai-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userSkills,
          avgCgpa,
          courseNames,
          semester: profile?.semester || 0,
        }),
      });

      const data = await res.json();
      
      if (data.fallbackWarning) {
        toast.warning("AI Quota Exceeded", {
          description: "Used lightning-fast local scoring instead.",
        });
      }

      if (data.success && data.matches) {
        setResults(data.matches);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Failed to fetch jobs", error);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 40) return "text-amber-500";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-400";
  };

  const isReady = userSkills.length > 0 || academics.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-3">
          <Brain className="w-3 h-3 text-primary" />
          <span className="text-xs font-medium">AI-Powered Job Matching</span>
        </div>
        <h1 className="font-display font-bold text-3xl tracking-tight">
          AI Job Finder
        </h1>
        <p className="text-muted-foreground mt-1">
          Find the best matching jobs based on your skills and academic profile
        </p>
      </div>

      {/* Profile Summary + Find Button */}
      {!results && (
        <div className="glass-strong rounded-3xl p-8 animate-fade-up">
          <div className="flex flex-col items-center text-center">
            <div
              className={cn(
                "w-24 h-24 rounded-3xl grid place-items-center mb-6 transition-all",
                searching
                  ? "bg-gradient-primary shadow-glow animate-pulse"
                  : "bg-gradient-primary shadow-glow"
              )}
            >
              {searching ? (
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              ) : (
                <Sparkles className="w-10 h-10 text-white" />
              )}
            </div>

            {searching ? (
              <>
                <h2 className="font-display font-bold text-2xl mb-2">
                  Finding Best Jobs For You...
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mb-4">
                  AI is analyzing your {userSkills.length} skills, {academics.length} courses, and academic performance to find the perfect matches.
                </p>
                <div className="flex items-center gap-3 animate-fade-up">
                  {["Scanning jobs...", "Matching skills...", "Ranking results..."].map((t, i) => (
                    <span
                      key={t}
                      className="text-xs text-primary font-medium animate-pulse"
                      style={{ animationDelay: `${i * 400}ms` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="font-display font-bold text-2xl mb-2">
                  Ready to Find Jobs
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mb-6">
                  The AI will use your profile data to find and rank the best matching jobs from our database.
                </p>

                {/* Profile snapshot */}
                {profileLoading ? (
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-6" />
                ) : (
                  <div className="glass rounded-2xl p-5 w-full max-w-lg mb-6">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Your Profile Snapshot
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Skills:</span>{" "}
                        <strong>{userSkills.length}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Courses:</span>{" "}
                        <strong>{academics.length}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg CGPA:</span>{" "}
                        <strong>{avgCgpa > 0 ? avgCgpa.toFixed(2) : "—"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Semester:</span>{" "}
                        <strong>{profile?.semester || "—"}</strong>
                      </div>
                    </div>
                    {!isReady && (
                      <p className="text-xs text-amber-500 mt-3">
                        ⚠ Add skills or academic records first for better results
                      </p>
                    )}
                  </div>
                )}

                <Button
                  onClick={findJobs}
                  disabled={searching || allJobs.length === 0}
                  className="rounded-2xl bg-gradient-primary hover:opacity-90 border-0 shadow-glow h-14 px-10 font-bold text-lg gap-3"
                >
                  <Search className="w-5 h-5" />
                  Find Best Jobs For Me
                </Button>

                {allJobs.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-3">Loading available jobs...</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-xl">
                {results.length} Jobs Matched
              </h2>
              <p className="text-sm text-muted-foreground">
                Ranked by AI compatibility score
              </p>
            </div>
            <Button
              onClick={() => setResults(null)}
              variant="outline"
              className="rounded-xl glass border-0 gap-2"
            >
              <Search className="w-4 h-4" /> Search Again
            </Button>
          </div>

          {results.length === 0 ? (
            <div className="glass-strong rounded-3xl p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted grid place-items-center mx-auto mb-4">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">No Matches Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Try adding more skills or academic records to improve your profile and get better matches.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((job, i) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="block glass-strong rounded-2xl p-5 hover:shadow-lg transition-all animate-fade-up group"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl bg-gradient-to-br grid place-items-center text-white font-bold text-sm shrink-0",
                        job.logoBg || "from-primary to-purple-500"
                      )}
                    >
                      {job.logo || job.company.slice(0, 2).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display font-bold text-base group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{job.company}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div
                            className={cn(
                              "text-sm font-bold px-3 py-1 rounded-xl",
                              job.matchScore >= 70
                                ? "bg-green-500/10 text-green-600"
                                : job.matchScore >= 40
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-red-500/10 text-red-500"
                            )}
                          >
                            {job.matchScore}% Match
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {job.location}
                          </span>
                        )}
                        {job.type && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" /> {job.type}
                          </span>
                        )}
                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" /> {job.salary}
                          </span>
                        )}
                      </div>

                      {/* Match Score Bar */}
                      <div className="mt-3">
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-700",
                              getScoreBg(job.matchScore)
                            )}
                            style={{ width: `${job.matchScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Match Reasons */}
                      {job.matchReasons.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {job.matchReasons.map((reason, ri) => (
                            <span
                              key={ri}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-medium"
                            >
                              <TrendingUp className="w-2.5 h-2.5" />
                              {reason}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EligibilityChecker;
