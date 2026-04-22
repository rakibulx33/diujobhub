import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useAcademicRecords, type AcademicRecord } from "@/hooks/useAPI";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  GraduationCap,
  Plus,
  Trash2,
  Save,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  BookOpen,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";

type LocalRecord = {
  tempId: string;
  semester: number;
  course_code: string;
  course_name: string;
  credit: number;
  cgpa: number;
};

function newRow(semester: number): LocalRecord {
  return {
    tempId: crypto.randomUUID(),
    semester,
    course_code: "",
    course_name: "",
    credit: 3,
    cgpa: 0,
  };
}

// ── AI Analysis helpers ──
function analyzeRecords(records: LocalRecord[]) {
  if (records.length === 0) return null;

  const semesters = [...new Set(records.map((r) => r.semester))].sort((a, b) => a - b);

  const semesterStats = semesters.map((sem) => {
    const courses = records.filter((r) => r.semester === sem);
    const totalCredits = courses.reduce((s, c) => s + c.credit, 0);
    const weightedSum = courses.reduce((s, c) => s + c.cgpa * c.credit, 0);
    const gpa = totalCredits > 0 ? weightedSum / totalCredits : 0;
    return { semester: sem, gpa: Math.round(gpa * 100) / 100, courses: courses.length, totalCredits };
  });

  const allCredits = records.reduce((s, c) => s + c.credit, 0);
  const allWeighted = records.reduce((s, c) => s + c.cgpa * c.credit, 0);
  const cumulativeCgpa = allCredits > 0 ? Math.round((allWeighted / allCredits) * 100) / 100 : 0;

  // Trend
  const gpas = semesterStats.map((s) => s.gpa);
  let trend: "up" | "down" | "stable" = "stable";
  if (gpas.length >= 2) {
    const lastTwo = gpas.slice(-2);
    if (lastTwo[1] > lastTwo[0] + 0.05) trend = "up";
    else if (lastTwo[1] < lastTwo[0] - 0.05) trend = "down";
  }

  // Weak courses (below 2.5)
  const weakCourses = records.filter((r) => r.cgpa < 2.5 && r.course_name);

  // Strong courses (3.5+)
  const strongCourses = records.filter((r) => r.cgpa >= 3.5 && r.course_name);

  // Best & worst semester
  const bestSem = semesterStats.reduce((best, s) => (s.gpa > best.gpa ? s : best), semesterStats[0]);
  const worstSem = semesterStats.reduce((worst, s) => (s.gpa < worst.gpa ? s : worst), semesterStats[0]);

  // Standing
  let standing: string;
  let standingColor: string;
  if (cumulativeCgpa >= 3.7) { standing = "Dean's List"; standingColor = "text-emerald-500"; }
  else if (cumulativeCgpa >= 3.5) { standing = "Excellent"; standingColor = "text-green-500"; }
  else if (cumulativeCgpa >= 3.0) { standing = "Good"; standingColor = "text-blue-500"; }
  else if (cumulativeCgpa >= 2.5) { standing = "Satisfactory"; standingColor = "text-amber-500"; }
  else if (cumulativeCgpa >= 2.0) { standing = "Needs Improvement"; standingColor = "text-orange-500"; }
  else { standing = "At Risk"; standingColor = "text-red-500"; }

  // Recommendations
  const recommendations: string[] = [];
  if (weakCourses.length > 0) {
    recommendations.push(`Focus on improving ${weakCourses.slice(0, 3).map((c) => c.course_name).join(", ")} — these are dragging your CGPA down.`);
  }
  if (trend === "down") {
    recommendations.push("Your GPA is trending downward. Consider adjusting your study strategy or course load.");
  }
  if (trend === "up") {
    recommendations.push("Great momentum! Your GPA is improving — keep up the current study habits.");
  }
  if (cumulativeCgpa < 3.0) {
    recommendations.push("To be more competitive for top roles, aim to bring your CGPA above 3.0.");
  }
  if (cumulativeCgpa >= 3.5) {
    recommendations.push("Your CGPA is strong — highlight it prominently on your resume and applications!");
  }
  if (strongCourses.length > 3) {
    recommendations.push(`You excel in ${strongCourses.slice(0, 3).map((c) => c.course_name).join(", ")} — consider these as career focus areas.`);
  }

  return {
    semesterStats,
    cumulativeCgpa,
    trend,
    weakCourses,
    strongCourses,
    bestSem,
    worstSem,
    standing,
    standingColor,
    recommendations,
    totalCourses: records.length,
    totalCredits: allCredits,
  };
}

const AcademicInfo = () => {
  const { user } = useAuth();
  const { data: savedRecords, isLoading, saveRecords, isSaving } = useAcademicRecords(user?.id);
  const [records, setRecords] = useState<LocalRecord[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    if (savedRecords && savedRecords.length > 0) {
      setRecords(
        savedRecords.map((r) => ({
          tempId: crypto.randomUUID(),
          semester: r.semester,
          course_code: r.course_code,
          course_name: r.course_name,
          credit: r.credit,
          cgpa: r.cgpa,
        }))
      );
      setShowAnalysis(true);
    }
  }, [savedRecords]);

  const analysis = useMemo(() => analyzeRecords(records), [records]);

  const semesters = useMemo(() => {
    const nums = [...new Set(records.map((r) => r.semester))].sort((a, b) => a - b);
    return nums.length > 0 ? nums : [];
  }, [records]);

  const addSemester = () => {
    const next = semesters.length > 0 ? Math.max(...semesters) + 1 : 1;
    setRecords((prev) => [...prev, newRow(next)]);
  };

  const addCourse = (semester: number) => {
    setRecords((prev) => [...prev, newRow(semester)]);
  };

  const removeCourse = (tempId: string) => {
    setRecords((prev) => prev.filter((r) => r.tempId !== tempId));
  };

  const updateField = (tempId: string, field: keyof LocalRecord, value: string | number) => {
    setRecords((prev) =>
      prev.map((r) => (r.tempId === tempId ? { ...r, [field]: value } : r))
    );
  };

  const handleSave = async () => {
    const valid = records.filter((r) => r.course_name.trim() !== "");
    if (valid.length === 0) {
      toast.error("Add at least one course with a name.");
      return;
    }
    try {
      await saveRecords(
        valid.map((r) => ({
          semester: r.semester,
          course_code: r.course_code,
          course_name: r.course_name,
          credit: r.credit,
          cgpa: r.cgpa,
        }))
      );
      setShowAnalysis(true);
      toast.success("Academic records saved!");
    } catch {
      toast.error("Failed to save records.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-3">
          <GraduationCap className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium">Academic Records</span>
        </div>
        <h1 className="font-display font-bold text-3xl tracking-tight">Academic Info</h1>
        <p className="text-muted-foreground mt-1">
          Enter your semester-wise course results and get AI-powered analysis
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Left: Input Section */}
        <div className="space-y-5">
          {semesters.map((sem) => {
            const semCourses = records.filter((r) => r.semester === sem);
            const semStat = analysis?.semesterStats.find((s) => s.semester === sem);

            return (
              <div
                key={sem}
                className="glass-strong rounded-3xl p-6 animate-fade-up"
                style={{ animationDelay: `${(sem - 1) * 60}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center text-white text-sm font-bold">
                      {sem}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg">Semester {sem}</h3>
                      <p className="text-xs text-muted-foreground">
                        {semCourses.length} course{semCourses.length !== 1 ? "s" : ""}
                        {semStat ? ` · GPA: ${semStat.gpa.toFixed(2)}` : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => addCourse(sem)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Course
                  </button>
                </div>

                {/* Table header */}
                <div className="grid grid-cols-[100px_1fr_70px_80px_36px] gap-2 mb-2 px-1">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">Code</span>
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">Course Name</span>
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">Credit</span>
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">GPA /4</span>
                  <span></span>
                </div>

                {/* Course rows */}
                <div className="space-y-1.5">
                  {semCourses.map((course) => (
                    <div
                      key={course.tempId}
                      className="grid grid-cols-[100px_1fr_70px_80px_36px] gap-2 items-center group"
                    >
                      <input
                        value={course.course_code}
                        onChange={(e) => updateField(course.tempId, "course_code", e.target.value)}
                        className="input-field text-xs py-2"
                        placeholder="CSE101"
                      />
                      <input
                        value={course.course_name}
                        onChange={(e) => updateField(course.tempId, "course_name", e.target.value)}
                        className="input-field text-xs py-2"
                        placeholder="Introduction to CS"
                      />
                      <input
                        type="number"
                        min="0.5"
                        max="6"
                        step="0.5"
                        value={course.credit}
                        onChange={(e) => updateField(course.tempId, "credit", parseFloat(e.target.value) || 0)}
                        className="input-field text-xs py-2 text-center"
                      />
                      <input
                        type="number"
                        min="0"
                        max="4"
                        step="0.01"
                        value={course.cgpa}
                        onChange={(e) => updateField(course.tempId, "cgpa", parseFloat(e.target.value) || 0)}
                        className="input-field text-xs py-2 text-center"
                      />
                      <button
                        onClick={() => removeCourse(course.tempId)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Add semester + Save */}
          <div className="flex items-center gap-3">
            <Button
              onClick={addSemester}
              variant="outline"
              className="flex-1 rounded-xl h-11 border-dashed border-2 hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Semester {semesters.length > 0 ? Math.max(...semesters) + 1 : 1}
            </Button>
            {records.length > 0 && (
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-gradient-primary hover:opacity-90 rounded-xl h-11 shadow-glow"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save & Analyze"}
              </Button>
            )}
          </div>
        </div>

        {/* Right: AI Analysis Sidebar */}
        <div className="space-y-5">
          {/* Cumulative CGPA Card */}
          {analysis && (
            <div className="glass-strong rounded-3xl p-6 animate-fade-up">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-display font-bold text-lg">AI Analysis</h3>
              </div>

              {/* Big CGPA display */}
              <div className="glass rounded-2xl p-5 text-center mb-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Cumulative CGPA
                </div>
                <div className="font-display font-bold text-5xl gradient-text">
                  {analysis.cumulativeCgpa.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">out of 4.00</div>
                <div className={cn("text-sm font-bold mt-2", analysis.standingColor)}>
                  {analysis.standing}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="glass rounded-xl p-3 text-center">
                  <BookOpen className="w-4 h-4 mx-auto mb-1 text-primary" />
                  <div className="text-lg font-bold">{analysis.totalCourses}</div>
                  <div className="text-[10px] text-muted-foreground">Courses</div>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <BarChart3 className="w-4 h-4 mx-auto mb-1 text-primary" />
                  <div className="text-lg font-bold">{analysis.totalCredits}</div>
                  <div className="text-[10px] text-muted-foreground">Credits</div>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  {analysis.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 mx-auto mb-1 text-green-500" />
                  ) : analysis.trend === "down" ? (
                    <TrendingDown className="w-4 h-4 mx-auto mb-1 text-red-500" />
                  ) : (
                    <Minus className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                  )}
                  <div className="text-lg font-bold capitalize">{analysis.trend}</div>
                  <div className="text-[10px] text-muted-foreground">Trend</div>
                </div>
              </div>

              {/* Semester GPA bars */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Semester-wise GPA
                </h4>
                <div className="space-y-2">
                  {analysis.semesterStats.map((s) => (
                    <div key={s.semester} className="flex items-center gap-3">
                      <span className="text-xs font-medium w-8 shrink-0">S{s.semester}</span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-700",
                            s.gpa >= 3.5
                              ? "bg-green-500"
                              : s.gpa >= 3.0
                              ? "bg-blue-500"
                              : s.gpa >= 2.5
                              ? "bg-amber-500"
                              : "bg-red-500"
                          )}
                          style={{ width: `${(s.gpa / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold w-10 text-right">{s.gpa.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best / Worst */}
              {analysis.semesterStats.length > 1 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="glass rounded-xl p-3">
                    <div className="text-[10px] font-semibold uppercase text-green-500 mb-1">Best</div>
                    <div className="text-sm font-bold">Semester {analysis.bestSem.semester}</div>
                    <div className="text-xs text-muted-foreground">GPA: {analysis.bestSem.gpa.toFixed(2)}</div>
                  </div>
                  <div className="glass rounded-xl p-3">
                    <div className="text-[10px] font-semibold uppercase text-red-500 mb-1">Weakest</div>
                    <div className="text-sm font-bold">Semester {analysis.worstSem.semester}</div>
                    <div className="text-xs text-muted-foreground">GPA: {analysis.worstSem.gpa.toFixed(2)}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Weak courses */}
          {analysis && analysis.weakCourses.length > 0 && (
            <div className="glass-strong rounded-3xl p-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h4 className="font-display font-bold text-sm">Needs Improvement</h4>
              </div>
              <div className="space-y-1.5">
                {analysis.weakCourses.map((c, i) => (
                  <div key={i} className="glass rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold">{c.course_name}</div>
                      <div className="text-[10px] text-muted-foreground">{c.course_code} · Sem {c.semester}</div>
                    </div>
                    <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md">
                      {c.cgpa.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strong courses */}
          {analysis && analysis.strongCourses.length > 0 && (
            <div className="glass-strong rounded-3xl p-6 animate-fade-up" style={{ animationDelay: "150ms" }}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <h4 className="font-display font-bold text-sm">Top Performing</h4>
              </div>
              <div className="space-y-1.5">
                {analysis.strongCourses.slice(0, 5).map((c, i) => (
                  <div key={i} className="glass rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold">{c.course_name}</div>
                      <div className="text-[10px] text-muted-foreground">{c.course_code} · Sem {c.semester}</div>
                    </div>
                    <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md">
                      {c.cgpa.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          {analysis && analysis.recommendations.length > 0 && (
            <div className="glass-strong rounded-3xl p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-blue-500" />
                <h4 className="font-display font-bold text-sm">AI Recommendations</h4>
              </div>
              <div className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="glass rounded-xl p-3 flex gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!analysis && (
            <div className="glass-strong rounded-3xl p-8 text-center animate-fade-up">
              <GraduationCap className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
              <h3 className="font-display font-bold text-lg mb-1">No Records Yet</h3>
              <p className="text-sm text-muted-foreground">
                Add your semester courses and grades to get AI-powered academic analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicInfo;
