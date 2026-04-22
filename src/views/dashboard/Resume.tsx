import { ResumeUpload } from "@/components/ResumeUpload";

const Resume = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl tracking-tight">Resume</h1>
        <p className="text-muted-foreground mt-1">Upload and manage your resume</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ResumeUpload />
        <div className="glass-strong rounded-3xl p-7 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <h3 className="font-display font-bold mb-4">Tips for a strong resume</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {["Keep it to 1–2 pages", "Quantify your impact with metrics", "Match keywords from the job description", "Use a clean, scannable layout", "Update it before every application"].map((t) => (
              <li key={t} className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" /> {t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Resume;
