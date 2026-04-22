import { useAuth } from "@/context/AuthContext";
import { useSavedJobs, useUnsaveJob } from "@/hooks/useAPI";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { toast } from "sonner";

const Saved = () => {
  const { user } = useAuth();
  const { data: savedJobs = [], isLoading } = useSavedJobs(user?.id);
  const unsaveMutation = useUnsaveJob();

  const handleRemove = (jobId: string) => {
    if (!user) return;
    unsaveMutation.mutate(
      { userId: user.id, jobId },
      { onSuccess: () => toast.success("Job removed from saved") },
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl tracking-tight">Saved jobs</h1>
        <p className="text-muted-foreground mt-1">{savedJobs.length} jobs saved</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {isLoading && <div className="text-muted-foreground col-span-2">Loading saved jobs...</div>}
        {!isLoading && savedJobs.map((j: any, idx: number) => (
          <div key={j.id} style={{ animationDelay: `${idx * 60}ms` }} className="glass-strong rounded-2xl p-5 flex gap-4 animate-fade-up group">
            <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br grid place-items-center text-white font-bold shrink-0", j.logoBg)}>{j.logo}</div>
            <div className="flex-1 min-w-0">
              <Link to={`/jobs/${j.id}`} className="font-semibold hover:text-primary transition-colors block truncate">{j.title}</Link>
              <div className="text-xs text-muted-foreground">{j.company} · {j.location}</div>
              <div className="text-xs font-semibold mt-2">{j.salary}</div>
            </div>
            <button
              onClick={() => handleRemove(j.id)}
              disabled={unsaveMutation.isPending}
              className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive self-start transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {!isLoading && savedJobs.length === 0 && (
          <div className="md:col-span-2 glass rounded-3xl p-12 text-center text-muted-foreground">
            <p>No saved jobs yet.</p>
            <Link to="/jobs" className="text-primary font-medium mt-2 inline-block hover:underline">Browse jobs</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;
