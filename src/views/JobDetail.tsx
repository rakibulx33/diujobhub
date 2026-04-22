import { Navbar } from "@/components/layout/Navbar";
import { Link, useParams } from "@/lib/router";
import { useJob, useApplyJob, useApplications, useSavedJobIds, useSaveJob, useUnsaveJob } from "@/hooks/useAPI";
import { useAuth } from "@/context/AuthContext";
import { Job } from "@/types";
import { MapPin, Briefcase, TrendingUp, Users, Bookmark, Share2, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: job, isLoading } = useJob(id);
  const { user } = useAuth();
  const { mutate: applyJob, isPending: isApplying } = useApplyJob();
  const { data: savedIds = [] } = useSavedJobIds(user?.id);
  const { data: applications = [] } = useApplications(user?.id);
  const saveJobMutation = useSaveJob();
  const unsaveJobMutation = useUnsaveJob();

  const isSaved = id ? savedIds.includes(id) : false;
  const hasApplied = applications.some((app: any) => app.job_id === job?.id);

  const handleBookmark = () => {
    if (!user) {
      toast.error("Please log in to save jobs");
      return;
    }
    if (!id) return;
    if (isSaved) {
      unsaveJobMutation.mutate(
        { userId: user.id, jobId: id },
        { onSuccess: () => toast.success("Job removed from saved") },
      );
    } else {
      saveJobMutation.mutate(
        { userId: user.id, jobId: id },
        { onSuccess: () => toast.success("Job saved!") },
      );
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen pb-24">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 mt-24 text-center">
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 mt-24 text-center">
          <h1 className="font-display font-bold text-3xl">Job not found</h1>
          <Link to="/jobs" className="text-primary mt-4 inline-block">Back to jobs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 mt-12">
        <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to jobs
        </Link>

        <div className="glass-strong rounded-3xl p-8 md:p-10 mb-6 relative overflow-hidden animate-fade-up">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-primary opacity-20 blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-start gap-6">
            <div className={cn("w-20 h-20 rounded-3xl bg-gradient-to-br grid place-items-center text-white font-display font-bold text-3xl shadow-elegant shrink-0", job.logoBg)}>
              {job.logo}
            </div>

            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-1">{job.company} · posted {job.posted}</div>
              <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4">{job.title}</h1>

              <div className="flex flex-wrap gap-2 mb-6">
                <Pill icon={MapPin}>{job.location}</Pill>
                <Pill icon={Briefcase}>{job.type}</Pill>
                <Pill icon={TrendingUp}>{job.level}</Pill>
                <Pill icon={Users}>{job.applicants} applicants</Pill>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {(user?.role === 'employer' || user?.role === 'admin') ? (
                  <Button disabled className="rounded-2xl bg-muted text-muted-foreground border-0 shadow-none h-12 px-8 font-semibold">
                    {user?.role === 'admin' ? 'Admins cannot apply' : 'Recruiters cannot apply'}
                  </Button>
                ) : !user ? (
                  <Button disabled className="rounded-2xl bg-muted text-muted-foreground border-0 shadow-none h-12 px-8 font-semibold">Log in to apply</Button>
                ) : hasApplied ? (
                  <Button disabled className="rounded-2xl bg-muted text-muted-foreground border-0 shadow-none h-12 px-8 font-semibold">
                    Already applied
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      applyJob({ userId: user.id.toString(), jobId: job.id }, {
                        onSuccess: () => toast.success("Application submitted!", { description: `Your profile was sent to ${job.company}.` }),
                        onError: () => toast.error("Failed to apply")
                      });
                    }}
                    disabled={isApplying}
                    className="rounded-2xl bg-gradient-primary hover:opacity-90 border-0 shadow-glow h-12 px-8 font-semibold"
                  >
                    {isApplying ? "Applying..." : `Apply now · ${job.salary}`}
                  </Button>
                )}
                {user?.role !== 'employer' && user?.role !== 'admin' && (
                  <>
                    <Button
                      onClick={handleBookmark}
                      variant="outline"
                      className={cn(
                        "rounded-2xl h-12 w-12 p-0 glass border-0",
                        isSaved && "bg-primary/10 text-primary",
                      )}
                    >
                      <Bookmark className={cn("w-4 h-4", isSaved && "fill-primary text-primary")} />
                    </Button>
                    <Button variant="outline" className="rounded-2xl h-12 w-12 p-0 glass border-0">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-6">
            <Card title="About the role">
              <p className="text-muted-foreground leading-relaxed">{job.description}</p>
            </Card>

            <Card title="What you'll do">
              <ul className="space-y-3">
                {job.responsibilities.map((r) => (
                  <li key={r} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-primary grid place-items-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">{r}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Requirements">
              <ul className="space-y-3">
                {job.requirements.map((r) => (
                  <li key={r} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm">{r}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card title="Skills">
              <div className="flex flex-wrap gap-2">
                {job.tags.map((t) => (
                  <span key={t} className="px-3 py-1.5 rounded-xl bg-foreground/5 text-xs font-medium">{t}</span>
                ))}
              </div>
            </Card>

            <Card title="About company">
              <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br grid place-items-center text-white font-display font-bold mb-3", job.logoBg)}>
                {job.logo}
              </div>
              <div className="font-semibold">{job.company}</div>
              <div className="text-xs text-muted-foreground mt-1">Building the future of work.</div>
              <Button variant="outline" className="rounded-xl w-full mt-4 glass border-0">View company</Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

const Pill = ({ icon: Icon, children }: { icon: any; children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass text-xs font-medium">
    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
    {children}
  </div>
);

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="glass rounded-3xl p-7">
    <h2 className="font-display font-bold text-lg mb-4">{title}</h2>
    {children}
  </div>
);

export default JobDetail;
