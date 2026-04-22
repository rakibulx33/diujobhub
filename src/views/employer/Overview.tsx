import { useAuth } from "@/context/AuthContext";
import { useEmployerJobs, useDashboardStats, useCandidates } from "@/hooks/useAPI";
import { Eye, Users, Star, Sparkles, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminOverview = () => {
  const { user } = useAuth();
  const { data: employerJobs = [], isLoading: loadingJobs } = useEmployerJobs(user?.name);
  const { data: stats } = useDashboardStats(user?.id);
  const { data: candidates = [] } = useCandidates(); // We could filter strictly for their jobs, for MVP just show all candidates matching their jobs
  
  const isLoading = loadingJobs;

  // Derive stats dynamically
  const totalApplicants = candidates.length;
  // Estimate views based on jobs
  const totalViews = employerJobs.reduce((acc: number, j: any) => acc + (j.views || 0), 0);
  const shortlistedCount = candidates.filter((c: any) => c.status === "Shortlisted").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-3">
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-xs font-medium">Recruiter panel</span>
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight">{user?.name}</h1>
        <p className="text-muted-foreground mt-1">Manage roles, review candidates, hire faster.</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: Eye, label: "Total views", value: totalViews.toLocaleString(), trend: "Across active jobs" },
          { icon: Users, label: "Applicants", value: totalApplicants.toString(), trend: "Total received" },
          { icon: Star, label: "Shortlisted", value: shortlistedCount.toString(), trend: "Ready to interview" },
        ].map((s, i) => (
          <div key={s.label} className="glass-strong rounded-3xl p-6 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
                <s.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="font-display font-bold text-3xl">{s.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            <div className="text-xs text-primary font-medium mt-3">{s.trend}</div>
          </div>
        ))}
      </div>

      {/* Job Posts Table */}
      <div className="glass-strong rounded-3xl p-7 animate-fade-up" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl">Your job posts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                <th className="text-left font-semibold pb-4">Role</th>
                <th className="text-left font-semibold pb-4">Status</th>
                <th className="text-left font-semibold pb-4">Views</th>
                <th className="text-left font-semibold pb-4">Applicants</th>
                <th className="text-left font-semibold pb-4">Posted</th>
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading && <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Loading specific employer jobs...</td></tr>}
              {!isLoading && employerJobs.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">You haven't posted any jobs yet.</td></tr>
              )}
              {!isLoading && employerJobs.map((j: any, i: number) => (
                <tr key={j.id} className="hover:bg-foreground/5 transition-colors animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <td className="py-4 font-semibold">{j.title}</td>
                  <td className="py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium",
                      j.status === "Active" && "bg-primary/10 text-primary",
                      j.status === "Draft" && "bg-amber-500/10 text-amber-600",
                      j.status === "Closed" && "bg-muted text-muted-foreground"
                    )}>{j.status}</span>
                  </td>
                  <td className="py-4 text-sm">{j.views ? j.views.toLocaleString() : 0}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{j.applicants || 0}</div>
                      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-gradient-primary" style={{ width: `${Math.min((j.applicants || 0) / 2, 100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-muted-foreground">{j.posted}</td>
                  <td className="py-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-foreground/5"><MoreHorizontal className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
