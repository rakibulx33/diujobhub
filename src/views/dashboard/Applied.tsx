import { useAuth } from "@/context/AuthContext";
import { useApplications, useDeleteApplication } from "@/hooks/useAPI";
import { Link } from "@/lib/router";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Application } from "@/types";

const stages = ["Applied", "In Review", "Interviewing", "Offer"];

const Applied = () => {
  const { user } = useAuth();
  const { data: appliedJobs = [], isLoading } = useApplications(user?.id);
  const deleteMutation = useDeleteApplication();

  const handleDelete = (e: React.MouseEvent, applicationId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to cancel this application?")) {
      deleteMutation.mutate({ applicationId });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl tracking-tight">Your applications</h1>
        <p className="text-muted-foreground mt-1">{appliedJobs.length} jobs applied</p>
      </div>

      <div className="glass-strong rounded-3xl p-7 animate-fade-up">
        <div className="space-y-3">
          {isLoading && <p className="text-muted-foreground">Loading applications...</p>}
          {!isLoading && appliedJobs.map((a: Application, idx: number) => {
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
                  <div className="text-xs font-semibold mt-1">{a.salary}</div>
                </div>
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center gap-1 mb-1.5">
                    {stages.map((_, i) => (
                      <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i < a.stage ? "bg-gradient-primary" : "bg-muted")} />
                    ))}
                  </div>
                  <div className="text-xs font-medium text-primary">{a.status}</div>
                </div>
                <button 
                  onClick={(e) => handleDelete(e, String(a.id))}
                  disabled={deleteMutation.isPending}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors disabled:opacity-50"
                  title="Cancel Application"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </Link>
            );
          })}
          {!isLoading && appliedJobs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No applications yet.</p>
              <Link to="/jobs" className="text-primary font-medium mt-2 inline-block hover:underline">Browse jobs</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applied;
