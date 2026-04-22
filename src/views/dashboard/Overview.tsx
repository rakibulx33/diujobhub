import { useAuth } from "@/context/AuthContext";
import { useApplications, useSavedJobIds } from "@/hooks/useAPI";
import { Link } from "@/lib/router";
import { Briefcase, Bookmark, Eye, TrendingUp, Bell, Brain, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Application } from "@/types";

const stages = ["Applied", "In Review", "Interviewing", "Offer"];

const Overview = () => {
  const { user } = useAuth();
  const { data: appliedJobs = [], isLoading } = useApplications(user?.id);
  const { data: savedIds = [] } = useSavedJobIds(user?.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Welcome back</div>
          <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight mt-1">
            Hey, {user?.name?.split(" ")[0]} 👋
          </h1>
        </div>
        <button className="glass rounded-2xl p-3 hover:bg-foreground/5 self-start">
          <Bell className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { icon: Briefcase, label: "Applied", value: isLoading ? "-" : appliedJobs.length.toString(), trend: "Active apps" },
          { icon: Bookmark, label: "Saved", value: savedIds.length.toString(), trend: "Bookmarks" },
          { icon: Eye, label: "Profile views", value: "0", trend: "Recent" },
          { icon: Brain, label: "AI Score", value: "—", trend: "Check eligibility" },
        ].map((s, i) => (
          <div key={s.label} className="glass rounded-2xl p-5 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center">
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs text-primary font-medium">{s.trend}</span>
            </div>
            <div className="font-display font-bold text-2xl">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* AI Eligibility CTA */}
      <Link
        to="/dashboard/eligibility"
        className="glass-strong rounded-3xl p-6 flex items-center gap-4 hover:shadow-elegant transition-all animate-fade-up group"
        style={{ animationDelay: "150ms" }}
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="font-display font-bold text-lg">Check Your Eligibility</div>
          <div className="text-sm text-muted-foreground">
            Verify your academic profile against any job role with our AI-powered analyzer
          </div>
        </div>
        <span className="text-sm text-primary font-semibold group-hover:translate-x-1 transition-transform">
          Start →
        </span>
      </Link>

      {/* Recent Applications */}
      <div className="glass-strong rounded-3xl p-7 animate-fade-up" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl">Recent applications</h2>
          <Link to="/dashboard/applied" className="text-sm text-primary font-medium hover:underline">View all</Link>
        </div>
        <div className="space-y-3">
          {isLoading && <p className="text-muted-foreground text-sm">Loading applications...</p>}
          {!isLoading && appliedJobs.length === 0 && <p className="text-muted-foreground text-sm">No applications found.</p>}
          {!isLoading && appliedJobs.slice(0, 3).map((a: Application, idx: number) => {
            return (
              <Link
                to={`/jobs/${a.job_id}`}
                key={a.id}
                style={{ animationDelay: `${idx * 80}ms` }}
                className="glass rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-elegant transition-all animate-fade-up"
              >
                <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br grid place-items-center text-white font-bold shrink-0", a.logoBg)}>
                  {a.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.company} · Applied {a.applied_at}</div>
                </div>
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center gap-1 mb-1.5">
                    {stages.map((_, i) => (
                      <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i < a.stage ? "bg-gradient-primary" : "bg-muted")} />
                    ))}
                  </div>
                  <div className="text-xs font-medium text-primary">{a.status}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Overview;
