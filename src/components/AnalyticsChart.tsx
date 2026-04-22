import { useAuth } from "@/context/AuthContext";
import { useAnalytics } from "@/hooks/useAPI";

export const AnalyticsChart = () => {
  const { user } = useAuth();
  const { data: analytics = [], isLoading } = useAnalytics(user?.name ?? null);

  const max = analytics.length > 0 ? Math.max(...analytics.map((d: any) => d.views)) : 10;

  return (
    <div className="glass-strong rounded-3xl p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display font-bold">Analytics</h3>
        <select className="glass rounded-xl text-xs px-3 py-1.5 outline-none cursor-pointer">
          <option>This week</option>
          <option>This month</option>
        </select>
      </div>
      <p className="text-xs text-muted-foreground mb-6">Profile views & recruiter responses</p>

      {isLoading ? (
        <div className="h-44 flex items-center justify-center text-muted-foreground text-sm">
          Loading analytics...
        </div>
      ) : analytics.length === 0 ? (
        <div className="h-44 flex items-center justify-center text-muted-foreground text-sm">
          No analytics data available.
        </div>
      ) : (
        <div className="flex items-end gap-3 h-44">
          {analytics.map((d: any, i: number) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full flex items-end justify-center gap-1 h-full">
                <div
                  className="w-3 rounded-t-md bg-gradient-primary opacity-90 group-hover:opacity-100 transition-all"
                  style={{ height: `${(d.views / max) * 100}%`, minHeight: d.views > 0 ? "4px" : "0" }}
                  title={`${d.views} views`}
                />
                <div
                  className="w-3 rounded-t-md bg-accent/70 group-hover:opacity-100 transition-all"
                  style={{ height: `${(d.responses / max) * 100 * 4}%`, minHeight: d.responses > 0 ? "4px" : "0" }}
                  title={`${d.responses} responses`}
                />
              </div>
              <div className="text-[10px] text-muted-foreground font-medium">{d.name}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-5 mt-5 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-gradient-primary" />
          <span className="text-muted-foreground">Profile views</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-accent/70" />
          <span className="text-muted-foreground">Responses</span>
        </div>
      </div>
    </div>
  );
};
