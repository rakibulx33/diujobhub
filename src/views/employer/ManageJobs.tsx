import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAIConfig } from "@/context/AIConfigContext";
import { useAuth } from "@/context/AuthContext";
import { useEmployerJobs, useUpdateJobSettings, useRecommendations, useDeleteEmployerJob } from "@/hooks/useAPI";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ClipboardList,
  Brain,
  Settings,
  MoreHorizontal,
  Check,
  Eye,
  Users,
  Sparkles,
  Trash2,
} from "lucide-react";

interface ManagedJob {
  id: string;
  title: string;
  applicants: number;
  views: number;
  status: string;
  posted: string;
  aiScreening: boolean;
  minScore: number;
  roleMapping: string;
  scoredApplicants: number;
  avgScore: number;
}

const ManageJobs = () => {
  const { user } = useAuth();
  const { config } = useAIConfig();
  const { data: employerJobs = [], isLoading } = useEmployerJobs(user?.name);
  const { data: jobRoles = [] } = useRecommendations();
  const updateSettings = useUpdateJobSettings();
  const deleteJobMutation = useDeleteEmployerJob();
  
  const [jobs, setJobs] = useState<ManagedJob[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (employerJobs.length > 0) {
      const managed = employerJobs.map((j: any) => ({
        ...j,
        aiScreening: j.aiScreening ?? true,
        minScore: j.minScore ?? 60,
        roleMapping: j.roleMapping ?? "web-developer",
        scoredApplicants: j.scoredApplicants || 0,
        avgScore: j.avgScore || 0,
      }));
      setJobs(managed);
    } else {
      setJobs([]);
    }
  }, [employerJobs]);

  const toggleAI = async (id: string) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;

    const newValue = !job.aiScreening;
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, aiScreening: newValue } : j)));
    
    try {
      await updateSettings.mutateAsync({ id, aiScreening: newValue, minScore: job.minScore, roleMapping: job.roleMapping });
      toast(
        newValue ? `AI screening enabled for "${job.title}"` : `AI screening disabled for "${job.title}"`,
        { description: newValue ? "Candidates must pass eligibility check to apply." : "Candidates can apply without eligibility check." }
      );
    } catch (e) {
      toast.error("Failed to update AI screening");
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, aiScreening: job.aiScreening } : j)));
    }
  };

  const updateMinScore = (id: string, score: number) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, minScore: score } : j)));
  };

  const updateRoleMapping = (id: string, roleId: string) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, roleMapping: roleId } : j)));
  };

  const saveJob = async (id: string) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;

    try {
      await updateSettings.mutateAsync({ 
        id, 
        aiScreening: job.aiScreening, 
        minScore: job.minScore, 
        roleMapping: job.roleMapping 
      });
      setEditingId(null);
      toast.success("Job settings saved");
    } catch (e) {
      toast.error("Failed to save job settings");
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (confirm("Are you sure you want to delete this job? This will also remove all applicants and saved records.")) {
      try {
        await deleteJobMutation.mutateAsync(id);
        toast.success("Job deleted successfully");
      } catch (e) {
        toast.error("Failed to delete job");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-3">
          <ClipboardList className="w-3 h-3 text-primary" />
          <span className="text-xs font-medium">Job Management</span>
        </div>
        <h1 className="font-display font-bold text-3xl tracking-tight">
          Manage Jobs
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure AI screening and eligibility thresholds per job posting
        </p>
      </div>

      {/* AI Status Banner */}
      <div className="glass rounded-2xl p-4 flex items-center gap-3 animate-fade-up">
        <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shrink-0">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">
            AI Engine: {config.provider === "local" ? "Built-in Scoring" : `${config.provider.charAt(0).toUpperCase() + config.provider.slice(1)} API`}
          </div>
          <div className="text-xs text-muted-foreground">
            {config.provider === "local"
              ? "Using built-in scoring algorithm — no API required"
              : `Model: ${config.model} · Auto-reject: ${config.autoReject ? "On" : "Off"}`}
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {isLoading && <p className="text-muted-foreground p-4">Loading managed jobs...</p>}
        {!isLoading && jobs.map((job, i) => {
          const isEditing = editingId === job.id;
          const mappedRole = jobRoles.find((r: any) => r.id === job.roleMapping);

          return (
            <div
              key={job.id}
              className="glass-strong rounded-3xl overflow-hidden animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Main row */}
              <div className="p-6 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{job.title}</h3>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-lg text-[11px] font-medium",
                        job.status === "Active" && "bg-primary/10 text-primary",
                        job.status === "Draft" && "bg-amber-500/10 text-amber-600",
                        job.status === "Closed" && "bg-muted text-muted-foreground"
                      )}
                    >
                      {job.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3 h-3" /> {job.applicants} applicants
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {job.views.toLocaleString()} views
                    </span>
                    <span>Posted {job.posted}</span>
                  </div>
                </div>

                {/* AI Screening Toggle */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-semibold">
                      {job.aiScreening ? "AI Screening On" : "AI Screening Off"}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Min score: {job.minScore}%
                    </div>
                  </div>
                  <button
                    onClick={() => toggleAI(job.id)}
                    disabled={updateSettings.isPending}
                    className={cn(
                      "w-11 h-6 rounded-full p-0.5 transition-colors",
                      job.aiScreening ? "bg-gradient-primary" : "bg-muted"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full bg-white shadow transition-transform",
                        job.aiScreening && "translate-x-5"
                      )}
                    />
                  </button>
                  <button
                    onClick={() => setEditingId(isEditing ? null : job.id)}
                    className="p-2 rounded-xl glass hover:bg-foreground/5 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    disabled={deleteJobMutation.isPending}
                    className="p-2 rounded-xl glass hover:bg-destructive/10 text-destructive transition-colors"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* AI Stats Bar */}
              {job.aiScreening && (
                <div className="px-6 pb-3">
                  <div className="glass rounded-xl p-3 flex items-center gap-6 text-xs">
                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <strong>{job.scoredApplicants}</strong> scored
                    </span>
                    <span>
                      Avg score: <strong>{job.avgScore}%</strong>
                    </span>
                    <span>
                      Role: <strong>{mappedRole?.title || "—"}</strong>
                    </span>
                    <div className="flex-1" />
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-primary rounded-full"
                          style={{
                            width: `${job.applicants > 0 ? (job.scoredApplicants / job.applicants) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <span className="text-muted-foreground">
                        {job.applicants > 0
                          ? Math.round((job.scoredApplicants / job.applicants) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Expanded Settings */}
              {isEditing && (
                <div className="px-6 pb-6 animate-fade-up">
                  <div className="glass rounded-2xl p-5">
                    <div className="grid md:grid-cols-3 gap-5">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                          Minimum Score
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={job.minScore}
                          onChange={(e) =>
                            updateMinScore(job.id, parseInt(e.target.value) || 0)
                          }
                          className="input-field"
                        />
                        <div className="text-[10px] text-muted-foreground mt-1">
                          Candidates below this score cannot apply
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                          Map to Role
                        </label>
                        <select
                          value={job.roleMapping}
                          onChange={(e) =>
                            updateRoleMapping(job.id, e.target.value)
                          }
                          className="input-field"
                        >
                          {jobRoles.map((r: any) => (
                            <option key={r.id} value={r.id}>
                              {r.title}
                            </option>
                          ))}
                        </select>
                        <div className="text-[10px] text-muted-foreground mt-1">
                          Determines required courses & skills for scoring
                        </div>
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={() => saveJob(job.id)}
                          disabled={updateSettings.isPending}
                          className="rounded-xl bg-gradient-primary hover:opacity-90 border-0 shadow-glow h-10 px-5 text-xs font-semibold w-full"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" /> Save Settings
                        </Button>
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

export default ManageJobs;
