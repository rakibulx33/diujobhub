import { NavLink, Navigate } from "@/lib/router";
import { Navbar } from "./Navbar";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import {
  LayoutDashboard,
  Plus,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Settings,
  ClipboardList,
} from "lucide-react";

const sidebarLinks = [
  { to: "/employer", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/employer/post-job", label: "Post Job", icon: Plus },
  { to: "/employer/applicants", label: "Applicants", icon: Users },
  { to: "/employer/manage-jobs", label: "Manage Jobs", icon: ClipboardList },
];

export const EmployerLayout = ({ children }: { children?: ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (isLoading) {
    return <div className="min-h-screen grid place-items-center"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!isAuthenticated || user?.role !== "employer") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30 dark:bg-slate-900/30">
      <Navbar />
      <div className="flex flex-1 px-4 pt-4 pb-4 gap-6 w-full">
        {/* Sidebar */}
        <aside
          className={cn(
            "sticky top-[96px] h-[calc(100vh-112px)] glass-strong rounded-2xl border border-border/40 transition-all duration-300 flex flex-col shrink-0 z-30 shadow-sm overflow-hidden",
            collapsed ? "w-[68px]" : "w-[240px]"
          )}
        >
          {/* Company info */}
          <div className={cn("p-4 border-b border-border/40", collapsed && "px-3")}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary grid place-items-center text-white font-bold shrink-0">
                {user?.initials}
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{user?.name}</div>
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <Sparkles className="w-3 h-3" /> Recruiter
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    collapsed && "justify-center px-0",
                    isActive
                      ? "bg-gradient-primary text-white shadow-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  )
                }
              >
                <link.icon className={cn("w-4.5 h-4.5 shrink-0", collapsed ? "w-5 h-5" : "")} />
                {!collapsed && <span>{link.label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Collapse toggle */}
          <div className="p-3 border-t border-border/40">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /> <span>Collapse</span></>}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 max-w-6xl">
          {children}
        </main>
      </div>
    </div>
  );
};
