import { useState } from "react";
import { Link, useNavigate } from "@/lib/router";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const loggedInUser = await login(email, password);
    setLoading(false);
    
    if (loggedInUser) {
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      // Redirect based on role returned from DB
      if (loggedInUser.role === "admin") navigate("/admin");
      else if (loggedInUser.role === "employer") navigate("/employer");
      else navigate("/dashboard");
    } else {
      toast.error("Invalid credentials", { description: "Check your email and password and try again." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-primary/25 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
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
            Welcome back
          </h1>
          <p className="text-muted-foreground mt-2">Sign in to your DIUJOBHUB account</p>
        </div>

        {/* Form Card */}
        <div className="glass-strong rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  <LogIn className="w-4 h-4 mr-2" /> Sign in
                </>
              )}
            </Button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 glass rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Demo accounts
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div><span className="font-medium text-foreground">Job Seeker:</span> seeker@demo.com / demo123</div>
              <div><span className="font-medium text-foreground">Recruiter:</span> employer@demo.com / demo123</div>
              <div><span className="font-medium text-foreground">System Admin:</span> admin@demo.com / demo123</div>
            </div>
          </div>

          <div className="text-center mt-6">
            <span className="text-sm text-muted-foreground">Don't have an account? </span>
            <Link to="/register" className="text-sm font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
