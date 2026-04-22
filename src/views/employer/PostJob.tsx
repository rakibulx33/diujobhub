import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@/lib/router";
import { useCreateJob } from "@/hooks/useAPI";
import { useAuth } from "@/context/AuthContext";

const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createJob = useCreateJob();
  const [form, setForm] = useState({
    title: "",
    location: "",
    type: "Full-time",
    level: "Mid",
    salary: "",
    description: "",
    remote: false,
  });

  const handlePostJob = async (e: React.FormEvent, status: "Active" | "Draft" = "Active") => {
    e.preventDefault();
    try {
      await createJob.mutateAsync({
        id: Date.now().toString(),
        title: form.title,
        company: user?.name || "Unknown Company",
        location: form.location,
        type: form.type,
        level: form.level,
        salary: form.salary,
        posted: "Just now",
        description: form.description,
        remote: form.remote,
        tags: [],
        responsibilities: [],
        requirements: [],
        status: status
      });
      
      if (status === "Active") {
        toast.success("Job posted!", { description: `${form.title || "New role"} is now live.` });
      } else {
        toast.success("Draft saved", { description: `${form.title || "New role"} saved as draft.` });
      }
      navigate("/employer");
    } catch (err) {
      toast.error(`Failed to ${status === "Active" ? "post job" : "save draft"}`);
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl tracking-tight">Post a new job</h1>
        <p className="text-muted-foreground mt-1">Reach thousands of qualified candidates in minutes.</p>
      </div>

      <form onSubmit={(e) => handlePostJob(e, "Active")} className="glass-strong rounded-3xl p-7 animate-fade-up">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Job title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior Backend Engineer" className="input-field" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Location</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Berlin, DE" className="input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Salary range</label>
            <input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="$120k – $180k" className="input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Employment type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
              {["Full-time", "Part-time", "Contract", "Remote"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Experience level</label>
            <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="input-field">
              {["Junior", "Mid", "Senior", "Lead"].map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              rows={6}
              className="input-field resize-none"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="glass rounded-xl p-4 flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-sm font-semibold">Remote-friendly</div>
                <div className="text-xs text-muted-foreground">Show this role to remote candidates worldwide</div>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, remote: !form.remote })}
                className={cn("w-11 h-6 rounded-full p-0.5 transition-colors", form.remote ? "bg-gradient-primary" : "bg-muted")}
              >
                <div className={cn("w-5 h-5 rounded-full bg-white shadow transition-transform", form.remote && "translate-x-5")} />
              </button>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-7">
          <Button disabled={createJob.isPending} type="submit" className="rounded-2xl bg-gradient-primary hover:opacity-90 border-0 shadow-glow h-12 px-7 font-semibold">
            <Check className="w-4 h-4 mr-1" /> Publish job
          </Button>
          <Button disabled={createJob.isPending} type="button" variant="outline" onClick={(e) => handlePostJob(e as any, "Draft")} className="rounded-2xl glass border-0 h-12 px-6">
            Save as draft
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
