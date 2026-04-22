import { Link } from "@/lib/router";
import { MapPin, Bookmark, ArrowUpRight } from "lucide-react";
import { Job } from "@/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useSavedJobIds, useSaveJob, useUnsaveJob } from "@/hooks/useAPI";
import { toast } from "sonner";

export const JobCard = ({ job, index = 0 }: { job: Job; index?: number }) => {
  const { user } = useAuth();
  const { data: savedIds = [] } = useSavedJobIds(user?.id);
  const saveJob = useSaveJob();
  const unsaveJob = useUnsaveJob();

  const isSaved = savedIds.includes(job.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please log in to save jobs");
      return;
    }
    if (isSaved) {
      unsaveJob.mutate(
        { userId: user.id, jobId: job.id },
        { onSuccess: () => toast.success("Job removed from saved") },
      );
    } else {
      saveJob.mutate(
        { userId: user.id, jobId: job.id },
        { onSuccess: () => toast.success("Job saved!") },
      );
    }
  };

  return (
    <Link
      to={`/jobs/${job.id}`}
      style={{ animationDelay: `${index * 60}ms` }}
      className="group relative block glass rounded-3xl p-6 hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 animate-fade-up overflow-hidden"
    >
      <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500" />

      <div className="flex items-start justify-between mb-5 relative">
        <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br grid place-items-center text-white font-display font-bold text-lg shadow-soft", job.logoBg)}>
          {job.logo}
        </div>
        <button
          onClick={handleBookmark}
          className={cn(
            "p-2 rounded-xl transition-colors",
            isSaved
              ? "bg-primary/10 text-primary"
              : "hover:bg-foreground/5 text-muted-foreground group-hover:text-primary",
          )}
          aria-label={isSaved ? "Unsave" : "Save"}
        >
          <Bookmark className={cn("w-4 h-4 transition-all", isSaved && "fill-primary")} />
        </button>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span className="font-medium text-foreground">{job.company}</span>
          <span>·</span>
          <span>{job.posted}</span>
        </div>
        <h3 className="font-display font-bold text-xl leading-tight mb-3 group-hover:gradient-text transition-all">
          {job.title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-5">
          <span className="px-2.5 py-1 rounded-lg bg-foreground/5 text-xs font-medium">{job.type}</span>
          <span className="px-2.5 py-1 rounded-lg bg-foreground/5 text-xs font-medium">{job.level}</span>
          {job.remote && (
            <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">Remote</span>
          )}
        </div>

        <div className="flex items-end justify-between pt-4 border-t border-border/60">
          <div>
            <div className="font-display font-bold text-base">{job.salary}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {job.location}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center text-white opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};
