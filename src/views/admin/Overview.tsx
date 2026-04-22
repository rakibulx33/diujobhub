import { useAuth } from "@/context/AuthContext";
import { useDashboardStats } from "@/hooks/useAPI";
import { Users, Building2, Briefcase, Activity, ShieldAlert, Cpu } from "lucide-react";

const SystemAdminOverview = () => {
  const { user } = useAuth();
  const { data: stats, isLoading } = useDashboardStats(user?.id?.toString());

  const statCards = [
    { icon: Users, label: "Total Seekers", value: stats?.seekers ?? 0 },
    { icon: Building2, label: "Total Recruiters", value: stats?.recruiters ?? 0 },
    { icon: Briefcase, label: "Active Jobs", value: stats?.activeJobs ?? 0 },
    { icon: Cpu, label: "AI Requests Today", value: stats?.aiRequestsToday ?? 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive mb-3">
          <ShieldAlert className="w-3 h-3" />
          <span className="text-xs font-medium">System Admin Panel</span>
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight">Platform Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user?.name}. Monitor system health and global metrics.</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={s.label} className="glass-strong rounded-3xl p-6 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-2xl bg-destructive grid place-items-center shadow-glow">
                <s.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="font-display font-bold text-3xl">
              {isLoading ? "..." : Number(s.value).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* System Status */}
      <div className="glass-strong rounded-3xl p-7 animate-fade-up" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl flex items-center gap-2">
            <Activity className="w-5 h-5 text-destructive" />
            System Status
          </h2>
        </div>
        <div className="space-y-4">
          {[
            { service: "Main Database", status: "Operational", uptime: "99.99%" },
            { service: "AI Eligibility Engine", status: "Operational", uptime: "99.95%" },
            { service: "Authentication Server", status: "Operational", uptime: "100%" },
          ].map((item, i) => (
            <div key={item.service} className="flex items-center justify-between p-4 rounded-2xl bg-foreground/5">
              <div>
                <div className="font-semibold text-sm">{item.service}</div>
                <div className="text-xs text-muted-foreground mt-1">Uptime: {item.uptime}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemAdminOverview;
