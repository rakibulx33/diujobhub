import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/Hero";
import { JobCard } from "@/components/JobCard";
import { useJobs } from "@/hooks/useAPI";
import { Link } from "@/lib/router";
import { ArrowRight, Zap, Shield, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { data: jobs = [], isLoading } = useJobs();
  
  return (
    <div className="min-h-screen pb-24">
      <Navbar />
      <Hero />

      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">Featured roles</h2>
            <p className="text-muted-foreground mt-2">Hand-picked opportunities from top teams.</p>
          </div>
          <Link to="/jobs" className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading featured roles...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.slice(0, 6).map((j: any, i: number) => (
              <JobCard key={j.id} job={j} index={i} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-24">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Zap, title: "Apply in one click", desc: "Your profile, tailored automatically to every role." },
            { icon: Shield, title: "Real salaries upfront", desc: "Never wonder. Every listing shows compensation." },
            { icon: Heart, title: "Companies that care", desc: "We vet every recruiter for culture and values." },
          ].map((f, i) => (
            <div key={f.title} className="glass rounded-3xl p-7 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-primary grid place-items-center mb-5 shadow-glow">
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-24">
        <div className="relative glass-strong rounded-[2rem] p-12 md:p-16 overflow-hidden text-center">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative">
            <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-4">
              Hiring? <span className="gradient-text">Reach the right people.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Post a role in minutes. Get matched with curated, qualified candidates ready to move.
            </p>
            <Link
              to="/employer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-primary text-white font-semibold shadow-glow hover:opacity-90 transition-opacity"
            >
              Post a job <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
