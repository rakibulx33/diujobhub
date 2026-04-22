import { useState } from "react";
import { Link, useNavigate } from "@/lib/router";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Eye, EyeOff, UserPlus, Briefcase, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("seeker");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const registeredUser = await register(name, email, password, role);
    setLoading(false);
    
    if (registeredUser) {
      toast.success("Account created!", { description: `Welcome to DIUJOBHUB, ${registeredUser.name}!` });
      navigate(registeredUser.role === "employer" ? "/employer" : "/dashboard");
    } else {
      toast.error("Registration failed", { description: "Please try again with a different email." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-accent/25 blur-3xl animate-float" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow group-hover:scale-110 transition-transform">
              <span className="text-white font-display font-bold text-xl">J</span>
            </div>
          </Link>
          <h1 className="font-display font-bold text-3xl tracking-tight mt-4">
            Create account
          </h1>
          <p className="text-muted-foreground mt-2">Join DIUJOBHUB today</p>
        </div>

        {/* Form Card */}
        <div className="glass-strong rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "seeker" as UserRole, label: "Job Seeker", icon: User, desc: "Find & apply to jobs" },
                  { id: "employer" as UserRole, label: "Recruiter", icon: Briefcase, desc: "Post jobs & hire" },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={cn(
                      "glass rounded-2xl p-4 text-left transition-all",
                      role === r.id
                        ? "ring-2 ring-primary bg-primary/5 shadow-glow"
                        : "hover:bg-foreground/5"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl grid place-items-center mb-3",
                      role === r.id ? "bg-gradient-primary text-white" : "bg-foreground/5"
                    )}>
                      <r.icon className="w-5 h-5" />
                    </div>
                    <div className="font-semibold text-sm">{r.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                {role === "employer" ? "Company name" : "Full name"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === "employer" ? "Acme Inc." : "Jane Doe"}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-primary hover:opacity-90 border-0 shadow-glow h-12 font-semibold text-base"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" /> Create account
                </>
              )}
            </Button>
          </form>

          <div className="text-center mt-6">
            <span className="text-sm text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-sm font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
