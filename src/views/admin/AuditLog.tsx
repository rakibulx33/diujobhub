import { useState } from "react";
import { useAuditLogs } from "@/hooks/useAPI";
import { cn } from "@/lib/utils";
import {
  ScrollText,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  RefreshCw,
  Database,
  User,
  Briefcase,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type AuditEntry = {
  id: number;
  action: string;
  tableName: string;
  recordId: string;
  userId: string;
  userName: string;
  oldData: Record<string, unknown>;
  newData: Record<string, unknown>;
  description: string;
  createdAt: string;
};

const actionConfig: Record<string, { icon: typeof ArrowUpRight; color: string; bg: string }> = {
  INSERT: { icon: ArrowUpRight, color: "text-green-500", bg: "bg-green-500/10" },
  UPDATE: { icon: RefreshCw, color: "text-amber-500", bg: "bg-amber-500/10" },
  DELETE: { icon: Trash2, color: "text-red-500", bg: "bg-red-500/10" },
};

const tableIcons: Record<string, typeof Database> = {
  users: User,
  jobs: Briefcase,
  applications: FileText,
};

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
};

const AuditLogPage = () => {
  const { data: logs = [], isLoading, refetch } = useAuditLogs(200);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState<string>("ALL");
  const [filterTable, setFilterTable] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = (logs as AuditEntry[]).filter((log) => {
    const matchesSearch =
      !search ||
      log.description?.toLowerCase().includes(search.toLowerCase()) ||
      log.userName?.toLowerCase().includes(search.toLowerCase()) ||
      log.tableName?.toLowerCase().includes(search.toLowerCase());
    const matchesAction = filterAction === "ALL" || log.action === filterAction;
    const matchesTable = filterTable === "ALL" || log.tableName === filterTable;
    return matchesSearch && matchesAction && matchesTable;
  });

  const uniqueTables = [...new Set((logs as AuditEntry[]).map((l) => l.tableName))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive mb-3">
          <ScrollText className="w-3 h-3" />
          <span className="text-xs font-medium">Audit Trail</span>
        </div>
        <h1 className="font-display font-bold text-3xl tracking-tight">Audit Log</h1>
        <p className="text-muted-foreground mt-1">
          Track all system changes — powered by MySQL triggers and a database view.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Events", value: logs.length, icon: Database, color: "text-blue-500" },
          {
            label: "Inserts",
            value: (logs as AuditEntry[]).filter((l) => l.action === "INSERT").length,
            icon: ArrowUpRight,
            color: "text-green-500",
          },
          {
            label: "Updates",
            value: (logs as AuditEntry[]).filter((l) => l.action === "UPDATE").length,
            icon: RefreshCw,
            color: "text-amber-500",
          },
          {
            label: "Deletes",
            value: (logs as AuditEntry[]).filter((l) => l.action === "DELETE").length,
            icon: Trash2,
            color: "text-red-500",
          },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={cn("w-4 h-4", s.color)} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <div className="font-display font-bold text-2xl">{isLoading ? "..." : s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-strong rounded-3xl p-5 animate-fade-up">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-foreground/5 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Action filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            {["ALL", "INSERT", "UPDATE", "DELETE"].map((a) => (
              <button
                key={a}
                onClick={() => setFilterAction(a)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  filterAction === a
                    ? "bg-destructive text-destructive-foreground shadow-glow"
                    : "text-muted-foreground hover:bg-foreground/5"
                )}
              >
                {a === "ALL" ? "All" : a.charAt(0) + a.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Table filter */}
          <select
            value={filterTable}
            onChange={(e) => setFilterTable(e.target.value)}
            className="px-3 py-2 rounded-xl bg-foreground/5 text-sm font-medium border-0 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="ALL">All Tables</option>
            {uniqueTables.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Log Entries */}
      <div className="glass-strong rounded-3xl overflow-hidden animate-fade-up" style={{ animationDelay: "100ms" }}>
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading audit logs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <ScrollText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No audit logs found</p>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {filtered.map((log, idx) => {
              const cfg = actionConfig[log.action] || actionConfig.INSERT;
              const TblIcon = tableIcons[log.tableName] || Database;
              const isExpanded = expandedId === log.id;

              return (
                <div
                  key={log.id}
                  className={cn(
                    "transition-colors",
                    isExpanded ? "bg-foreground/[0.03]" : "hover:bg-foreground/[0.02]"
                  )}
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left"
                  >
                    {/* Action icon */}
                    <div className={cn("w-9 h-9 rounded-xl grid place-items-center shrink-0", cfg.bg)}>
                      <cfg.icon className={cn("w-4 h-4", cfg.color)} />
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{log.description}</div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TblIcon className="w-3 h-3" />
                          {log.tableName}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {log.userName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(log.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Badge + expand */}
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0",
                        cfg.bg,
                        cfg.color
                      )}
                    >
                      {log.action}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-5 pb-4 pt-0 ml-[52px]">
                      <div className="grid sm:grid-cols-2 gap-3">
                        {log.oldData && Object.keys(log.oldData).length > 0 && (
                          <div className="rounded-xl bg-red-500/5 p-3 border border-red-500/10">
                            <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2">
                              Old Data
                            </div>
                            <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-all font-mono">
                              {JSON.stringify(log.oldData, null, 2)}
                            </pre>
                          </div>
                        )}
                        {log.newData && Object.keys(log.newData).length > 0 && (
                          <div className="rounded-xl bg-green-500/5 p-3 border border-green-500/10">
                            <div className="text-[10px] font-bold text-green-500 uppercase tracking-wider mb-2">
                              New Data
                            </div>
                            <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-all font-mono">
                              {JSON.stringify(log.newData, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-[11px] text-muted-foreground">
                        <span>
                          Record ID: <span className="font-mono font-medium text-foreground">{log.recordId}</span>
                        </span>
                        <span>
                          User ID: <span className="font-mono font-medium text-foreground">{log.userId || "—"}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogPage;
