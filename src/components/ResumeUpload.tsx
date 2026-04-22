import { useRef, useState } from "react";
import { Upload, FileText, Trash2, Download, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const ResumeUpload = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ name: string; size: string; uploadedAt: string } | null>({
    name: "Alex_Morgan_Resume.pdf",
    size: "184 KB",
    uploadedAt: "Apr 12, 2026",
  });

  const onPick = (f: File | undefined) => {
    if (!f) return;
    setFile({ name: f.name, size: `${Math.round(f.size / 1024)} KB`, uploadedAt: "Just now" });
    toast.success("Resume uploaded", { description: f.name });
  };

  return (
    <div className="glass-strong rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold">Resume</h3>
        {file && (
          <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active
          </span>
        )}
      </div>

      {file ? (
        <div className="glass rounded-2xl p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-primary grid place-items-center text-white shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{file.name}</div>
            <div className="text-xs text-muted-foreground">{file.size} · Uploaded {file.uploadedAt}</div>
          </div>
          <button className="p-2 rounded-lg hover:bg-foreground/5" title="Download"><Download className="w-4 h-4" /></button>
          <button onClick={() => { setFile(null); toast("Resume removed"); }} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive" title="Remove">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full glass rounded-2xl border-2 border-dashed border-border p-8 flex flex-col items-center gap-2 hover:bg-foreground/5 transition-colors"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-primary grid place-items-center text-white">
            <Upload className="w-5 h-5" />
          </div>
          <div className="font-semibold text-sm mt-2">Drop your resume here</div>
          <div className="text-xs text-muted-foreground">PDF or DOCX, up to 5MB</div>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.doc"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0])}
      />

      {!file && (
        <button onClick={() => inputRef.current?.click()} className="mt-3 text-xs text-primary font-medium">
          Or browse files
        </button>
      )}
    </div>
  );
};
