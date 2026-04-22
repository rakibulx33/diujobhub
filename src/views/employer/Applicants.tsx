import { useCandidates, useUpdateCandidate, useDeleteCandidate } from "@/hooks/useAPI";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Star,
  Briefcase,
  MapPin,
  CheckCircle2,
  Trash2,
  MessageSquare,
  XCircle,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  BookOpen,
  Phone,
  IdCard,
  Award,
} from "lucide-react";
import { toast } from "sonner";

type FilterId = "all" | "shortlisted" | "interviewing" | "hired" | "rejected";

const Applicants = () => {
  const { user } = useAuth();
  const { data: serverApplicants = [], isLoading } = useCandidates(undefined, user?.name);
  const updateCandidate = useUpdateCandidate();
  const deleteCandidateMutation = useDeleteCandidate();
  
  const [applicants, setApplicants] = useState<any[]>([]);
  const [filter, setFilter] = useState<FilterId>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (serverApplicants.length > 0) {
      setApplicants(serverApplicants);
    }
  }, [serverApplicants]);

  const updateStatus = async (id: string, newStatus: string) => {
    const applicant = applicants.find((a) => a.id === id);
    if (!applicant) return;
    
    // Toggle Shortlisted if clicking again
    const finalStatus = (applicant.status === "Shortlisted" && newStatus === "Shortlisted") ? "New" : newStatus;

    setApplicants((prev) => prev.map((a) => a.id === id ? { ...a, status: finalStatus } : a));
    
    try {
      await updateCandidate.mutateAsync({ id, status: finalStatus });
      toast.success(`Status updated to ${finalStatus}`);
    } catch (e) {
      toast.error("Failed to update status");
      setApplicants((prev) => prev.map((a) => a.id === id ? { ...a, status: applicant.status } : a));
    }
  };

  const deleteApplicant = async (id: string) => {
    try {
      await deleteCandidateMutation.mutateAsync(id);
      setApplicants((prev) => prev.filter((a) => a.id !== id));
      toast.success("Applicant deleted");
    } catch (e) {
      toast.error("Failed to delete applicant");
    }
  };

  const getCount = (status: string) => applicants.filter((a) => a.status === status).length;

  const filtered = (() => {
    switch (filter) {
      case "shortlisted":  return applicants.filter((a) => a.status === "Shortlisted");
      case "interviewing": return applicants.filter((a) => a.status === "Interviewing");
      case "hired":        return applicants.filter((a) => a.status === "Hired");
      case "rejected":     return applicants.filter((a) => a.status === "Rejected");
      default:             return applicants;
    }
  })();

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      New: "bg-foreground/5 text-muted-foreground",
      Shortlisted: "bg-amber-500/10 text-amber-600",
      Interviewing: "bg-blue-500/10 text-blue-600",
      Hired: "bg-green-500/10 text-green-600",
      Rejected: "bg-red-500/10 text-red-500",
    };
    return map[status] ?? "bg-foreground/5 text-muted-foreground";
  };

  const filterTabs: { id: FilterId; label: string; count: number; color?: string }[] = [
    { id: "all",          label: "All",          count: applicants.length },
    { id: "shortlisted",  label: "Shortlisted",  count: getCount("Shortlisted"),  color: "text-amber-600" },
    { id: "interviewing", label: "Interview",     count: getCount("Interviewing"), color: "text-blue-600" },
    { id: "hired",        label: "Hired",         count: getCount("Hired"),        color: "text-green-600" },
    { id: "rejected",     label: "Rejected",      count: getCount("Rejected"),     color: "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl tracking-tight">Applicants</h1>
        <p className="text-muted-foreground mt-1">Review and manage candidates</p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterTabs.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all inline-flex items-center gap-1.5",
              filter === f.id ? "bg-foreground text-background" : "glass hover:bg-foreground/5"
            )}
          >
            {f.label}
            <span className={cn(
              "text-xs font-bold min-w-[20px] h-5 rounded-full inline-flex items-center justify-center",
              filter === f.id ? "bg-background/20" : "bg-foreground/5"
            )}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Applicant cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {isLoading && <p className="text-muted-foreground py-8 col-span-2">Loading applicants...</p>}
        {!isLoading && filtered.map((a, i) => {
          const isExpanded = expandedId === a.id;
          const hasProfile = a.university || a.cgpa || a.courses?.length > 0 || a.profileSkills?.length > 0;

          return (
            <div key={a.id} style={{ animationDelay: `${i * 50}ms` }} className="glass-strong rounded-3xl overflow-hidden animate-fade-up">
              {/* Main card */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-primary grid place-items-center text-white font-bold shrink-0">{a.initials}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold">{a.name}</div>
                        <div className="text-xs text-muted-foreground">{a.role}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("px-2 py-0.5 rounded-md text-[11px] font-bold", getStatusBadge(a.status))}>
                          {a.status}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-bold gradient-text">{a.match_score}%</div>
                          <div className="text-[10px] text-muted-foreground">match</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-3">
                      <span className="inline-flex items-center gap-1"><Briefcase className="w-3 h-3" /> {a.experience}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {a.location}</span>
                      <span>· {a.applied_at}</span>
                    </div>

                    <div className="text-xs text-muted-foreground mt-2">
                      For: <span className="font-medium text-foreground">{a.job_title}</span>
                    </div>

                    {/* Skills tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {a.skills && Array.isArray(a.skills) && a.skills.slice(0, 6).map((s: string) => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-medium">{s}</span>
                      ))}
                      {a.skills?.length > 6 && <span className="px-2 py-0.5 rounded-md bg-foreground/5 text-[11px] font-medium">+{a.skills.length - 6} more</span>}
                      {(!a.skills || a.skills.length === 0) && <span className="text-xs text-muted-foreground">No skills listed</span>}
                    </div>

                    {/* Quick academic info */}
                    {(a.cgpa || a.university) && (
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-3 pt-3 border-t border-border/40">
                        {a.university && (
                          <span className="inline-flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {a.university}</span>
                        )}
                        {a.cgpa && (
                          <span className="inline-flex items-center gap-1"><Award className="w-3 h-3 text-amber-500" /> CGPA: <strong className="text-foreground">{a.cgpa.toFixed(2)}</strong></span>
                        )}
                        {a.semester && (
                          <span>Sem {a.semester}</span>
                        )}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 mt-5">
                      <Button
                        onClick={() => updateStatus(a.id, "Shortlisted")}
                        disabled={updateCandidate.isPending}
                        size="sm"
                        className={cn(
                          "rounded-xl border-0 h-8 text-xs font-semibold",
                          a.status === "Shortlisted"
                            ? "bg-amber-500/15 text-amber-600 hover:bg-amber-500/25"
                            : "bg-gradient-primary text-white shadow-glow hover:opacity-90"
                        )}
                      >
                        <Star className={cn("w-3 h-3 mr-1", a.status === "Shortlisted" && "fill-current")} />
                        {a.status === "Shortlisted" ? "Shortlisted" : "Shortlist"}
                      </Button>
                      <Button
                        onClick={() => updateStatus(a.id, "Interviewing")}
                        disabled={updateCandidate.isPending || a.status === "Interviewing"}
                        size="sm"
                        className="rounded-xl h-8 text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600 border-0"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" /> {a.status === "Interviewing" ? "Interviewing" : "Interview"}
                      </Button>
                      <Button
                        onClick={() => updateStatus(a.id, "Hired")}
                        disabled={updateCandidate.isPending || a.status === "Hired"}
                        size="sm"
                        className="rounded-xl h-8 text-xs font-semibold bg-green-500 text-white hover:bg-green-600 border-0"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" /> {a.status === "Hired" ? "Hired" : "Hire"}
                      </Button>
                      <Button
                        onClick={() => updateStatus(a.id, "Rejected")}
                        disabled={updateCandidate.isPending || a.status === "Rejected"}
                        size="sm"
                        className="rounded-xl h-8 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 border-0"
                      >
                        <XCircle className="w-3 h-3 mr-1" /> {a.status === "Rejected" ? "Rejected" : "Reject"}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => deleteApplicant(a.id)}
                        disabled={deleteCandidateMutation.isPending}
                        size="sm"
                        className="ml-auto rounded-xl glass border-0 h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expand toggle for details */}
              {hasProfile && (
                <button
                  onClick={() => setExpandedId(isExpanded ? null : a.id)}
                  className="w-full px-6 py-2.5 border-t border-border/40 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/3 transition-colors"
                >
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {isExpanded ? "Hide Details" : "View Full Profile"}
                </button>
              )}

              {/* Expanded details panel */}
              {isExpanded && hasProfile && (
                <div className="px-6 pb-6 animate-fade-up border-t border-border/40 pt-5">
                  <div className="grid gap-5">
                    {/* Profile info */}
                    {(a.university || a.reg_id || a.phone) && (
                      <div className="glass rounded-2xl p-4">
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Profile Information</div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {a.university && (
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-3.5 h-3.5 text-primary shrink-0" />
                              <div><div className="text-[10px] text-muted-foreground">University</div><div className="font-medium">{a.university}</div></div>
                            </div>
                          )}
                          {a.cgpa && (
                            <div className="flex items-center gap-2">
                              <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <div><div className="text-[10px] text-muted-foreground">Avg CGPA</div><div className="font-medium">{a.cgpa.toFixed(2)}</div></div>
                            </div>
                          )}
                          {a.semester && (
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              <div><div className="text-[10px] text-muted-foreground">Semester</div><div className="font-medium">{a.semester}</div></div>
                            </div>
                          )}
                          {a.reg_id && (
                            <div className="flex items-center gap-2">
                              <IdCard className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                              <div><div className="text-[10px] text-muted-foreground">Reg. ID</div><div className="font-medium">{a.reg_id}</div></div>
                            </div>
                          )}
                          {a.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                              <div><div className="text-[10px] text-muted-foreground">Phone</div><div className="font-medium">{a.phone}</div></div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Skills with levels */}
                    {a.profileSkills?.length > 0 && (
                      <div className="glass rounded-2xl p-4">
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Skills & Proficiency</div>
                        <div className="grid grid-cols-2 gap-2">
                          {a.profileSkills.map((skill: any, si: number) => {
                            const levelColor =
                              skill.level === "Expert" ? "bg-green-500" :
                              skill.level === "Advanced" ? "bg-blue-500" :
                              skill.level === "Intermediate" ? "bg-amber-500" : "bg-gray-400";
                            const levelWidth =
                              skill.level === "Expert" ? "w-full" :
                              skill.level === "Advanced" ? "w-3/4" :
                              skill.level === "Intermediate" ? "w-1/2" : "w-1/4";
                            return (
                              <div key={si} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-medium truncate">{skill.name}</span>
                                  <span className="text-muted-foreground text-[10px] shrink-0 ml-1">{skill.level}</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                  <div className={cn("h-full rounded-full transition-all", levelColor, levelWidth)} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Academic records */}
                    {a.courses?.length > 0 && (
                      <div className="glass rounded-2xl p-4">
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                          Academic Records ({a.courses.length} courses)
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-border/40">
                                <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Sem</th>
                                <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Code</th>
                                <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Course</th>
                                <th className="text-right py-2 px-2 text-muted-foreground font-semibold">Credit</th>
                                <th className="text-right py-2 px-2 text-muted-foreground font-semibold">CGPA</th>
                              </tr>
                            </thead>
                            <tbody>
                              {a.courses.map((c: any, ci: number) => (
                                <tr key={ci} className="border-b border-border/20 last:border-0">
                                  <td className="py-1.5 px-2">{c.semester}</td>
                                  <td className="py-1.5 px-2 font-mono text-muted-foreground">{c.course_code}</td>
                                  <td className="py-1.5 px-2 font-medium">{c.course_name}</td>
                                  <td className="py-1.5 px-2 text-right">{c.credit}</td>
                                  <td className={cn(
                                    "py-1.5 px-2 text-right font-bold",
                                    c.cgpa >= 3.5 ? "text-green-600" :
                                    c.cgpa >= 3.0 ? "text-blue-600" :
                                    c.cgpa >= 2.5 ? "text-amber-600" : "text-red-500"
                                  )}>{c.cgpa.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {!isLoading && filtered.length === 0 && (
          <div className="md:col-span-2 glass rounded-3xl p-12 text-center text-muted-foreground">
            No applicants in this view yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;
