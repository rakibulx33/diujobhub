import { useProfile, useAcademicRecords } from "@/hooks/useAPI";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Mail, Phone, Hash, GraduationCap, Sparkles, Brain, TrendingUp, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { skillCategories } from "@/data/eligibility";

const Profile = () => {
  const { user } = useAuth();
  const { data: profile, isLoading, updateProfile } = useProfile(user?.id);
  const { data: academics = [] } = useAcademicRecords(user?.id);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reg_id: "",
    university: "",
  });

  useEffect(() => {
    if (user || profile) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: profile?.phone || "",
        reg_id: profile?.reg_id || "",
        university: profile?.university || "",
      });
    }
  }, [user, profile]);

  // AI Skill Score calculation based on skills + academic info
  const aiScore = useMemo(() => {
    const skills: any[] = profile?.skills || [];
    const semester = profile?.semester || 0;

    // Skill diversity score (max 40 pts)
    const allSkills = skillCategories.flatMap((c) => c.skills);
    const skillCoverage = allSkills.length > 0 ? (skills.length / allSkills.length) * 100 : 0;
    const skillScore = Math.min(40, Math.round(skillCoverage * 4));

    // Courses CGPA score (max 35 pts) — average CGPA across all academic records
    const courseCount = academics.length;
    const avgCgpa = courseCount > 0
      ? academics.reduce((sum: number, r: any) => sum + (Number(r.cgpa) || 0), 0) / courseCount
      : 0;
    const cgpaScore = Math.min(35, Math.round((avgCgpa / 4.0) * 35));

    // Course completion score (max 10 pts)
    const courseCompletionScore = Math.min(10, Math.round((courseCount / 30) * 10));

    // Experience factor (max 15 pts) — based on semester progression
    const expScore = Math.min(15, Math.round((semester / 8) * 15));

    const total = skillScore + cgpaScore + courseCompletionScore + expScore;

    return {
      total: Math.min(100, total),
      skillScore,
      cgpaScore,
      courseCompletionScore,
      expScore,
      skillCount: skills.length,
      avgCgpa,
      courseCount,
      semester,
    };
  }, [profile, academics]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        university: formData.university,
        phone: formData.phone,
        reg_id: formData.reg_id,
        cgpa: profile?.cgpa || 0,
        semester: profile?.semester || 0,
        experience: profile?.experience || "",
      });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to save profile.");
    }
  };

  const scoreBreakdown = [
    { label: "Skills", score: aiScore.skillScore, max: 40, icon: Brain, detail: `${aiScore.skillCount} skills added` },
    { label: "Courses CGPA", score: aiScore.cgpaScore, max: 35, icon: GraduationCap, detail: `Avg CGPA: ${aiScore.avgCgpa.toFixed(2)}` },
    { label: "Courses Done", score: aiScore.courseCompletionScore, max: 10, icon: Award, detail: `${aiScore.courseCount} courses` },
    { label: "Progress", score: aiScore.expScore, max: 15, icon: TrendingUp, detail: `Semester ${aiScore.semester}` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information</p>
      </div>

      <div className="grid md:grid-cols-[1fr_340px] gap-6">
        {/* Personal Info Form */}
        <div className="glass-strong rounded-3xl p-7 animate-fade-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-primary grid place-items-center text-white font-bold text-xl shadow-glow">
              {user?.initials}
            </div>
            <div>
              <h2 className="font-display font-bold text-xl">Personal Information</h2>
              <p className="text-xs text-muted-foreground">Update your details below</p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Full Name
                </label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="Enter email"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" /> Registration ID
                  </label>
                  <input
                    value={formData.reg_id}
                    onChange={(e) => setFormData({ ...formData, reg_id: e.target.value })}
                    className="input-field"
                    placeholder="e.g. 221-15-XXXX"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" /> University / Institution
                </label>
                <input
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="input-field"
                  placeholder="Enter university name"
                />
              </div>

              <Button onClick={handleSave} className="w-full bg-gradient-primary hover:opacity-90 rounded-xl h-10 shadow-glow mt-2">
                Save Profile
              </Button>
            </div>
          )}
        </div>

        {/* AI Skill Score Panel */}
        <div className="space-y-5">
          <div className="glass-strong rounded-3xl p-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-lg">AI Skill Score</h3>
            </div>

            {/* Circular Score */}
            <div className="flex justify-center mb-6">
              <div className="relative w-36 h-36">
                <svg className="w-36 h-36 -rotate-90">
                  <circle cx="72" cy="72" r="60" stroke="hsl(var(--muted))" strokeWidth="12" fill="none" />
                  <circle
                    cx="72" cy="72" r="60"
                    stroke="url(#scoreGradient)"
                    strokeWidth="12" fill="none" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 60}`}
                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - aiScore.total / 100)}`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <div className={cn("font-display font-bold text-3xl", getScoreColor(aiScore.total))}>
                      {aiScore.total}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {getScoreLabel(aiScore.total)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              {scoreBreakdown.map((item) => (
                <div key={item.label} className="glass rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </div>
                    <span className="text-xs font-bold text-primary">{item.score}/{item.max}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-700"
                      style={{ width: `${(item.score / item.max) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
