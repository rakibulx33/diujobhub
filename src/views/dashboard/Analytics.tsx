import { AnalyticsChart } from "@/components/AnalyticsChart";

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your profile performance</p>
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <AnalyticsChart />
        <div className="space-y-4">
          {[
            { label: "Profile views", value: "184", change: "+24%" },
            { label: "Search appearances", value: "1,240", change: "+12%" },
            { label: "Recruiter responses", value: "13", change: "+5" },
          ].map((s, i) => (
            <div key={s.label} className="glass-strong rounded-3xl p-6 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
              <div className="font-display font-bold text-3xl mt-2">{s.value}</div>
              <div className="text-xs text-primary font-medium mt-1">{s.change} this week</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
