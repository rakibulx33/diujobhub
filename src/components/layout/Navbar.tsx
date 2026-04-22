import { Link, NavLink, useLocation, useNavigate } from "@/lib/router";
import { Briefcase, Search, Menu, X, LogOut, LayoutDashboard, Building2, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const publicLinks = (user?.role === "employer" || user?.role === "admin") ? [] : [
    { to: "/", label: "Find Jobs", icon: Search },
    { to: "/jobs", label: "Browse", icon: Briefcase },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Don't show full navbar on dashboard/admin/employer pages (sidebar handles nav)
  const isPanel = pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/employer");

  return (
    <header className={cn(
      "sticky top-4 z-50 mx-auto mt-4 transition-all duration-300",
      isPanel ? "w-[calc(100%-2rem)]" : "w-[min(1200px,calc(100%-2rem))]"
    )}>
      <div className="glass-strong rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow group-hover:scale-110 transition-transform">
            <span className="text-white font-display font-bold">D</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            <span className="gradient-text-accent">DIU</span>JOBHUB
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {publicLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  isActive || (l.to === "/" && pathname === "/")
                    ? "bg-foreground/5 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                )
              }
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
          {isAuthenticated && user?.role === "seeker" && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5",
                  isActive ? "bg-foreground/5 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                )
              }
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
            </NavLink>
          )}
          {isAuthenticated && user?.role === "employer" && (
            <NavLink
              to="/employer"
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5",
                  isActive ? "bg-foreground/5 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                )
              }
            >
              <Building2 className="w-3.5 h-3.5" /> Recruiter Panel
            </NavLink>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5",
                  isActive ? "bg-destructive/10 text-destructive font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                )
              }
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Super Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <div className="glass rounded-2xl px-3 py-2 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary grid place-items-center text-white font-bold text-sm">
                  {user?.initials}
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Button variant="ghost" onClick={handleLogout} className="rounded-xl text-muted-foreground hover:text-destructive" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="rounded-xl">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow border-0">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-foreground/5" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass-strong rounded-2xl mt-2 p-3 flex flex-col gap-1 animate-fade-up">
          {publicLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3",
                  isActive ? "bg-foreground/5 text-foreground" : "text-muted-foreground"
                )
              }
              end={l.to === "/"}
            >
              <l.icon className="w-4 h-4" /> {l.label}
            </NavLink>
          ))}
          {isAuthenticated && user?.role === "seeker" && (
            <NavLink to="/dashboard" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 text-muted-foreground">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </NavLink>
          )}
          {isAuthenticated && user?.role === "employer" && (
            <NavLink to="/employer" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 text-muted-foreground">
              <Building2 className="w-4 h-4" /> Recruiter Panel
            </NavLink>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <NavLink to="/admin" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 text-destructive font-semibold">
              <ShieldAlert className="w-4 h-4" /> Super Admin
            </NavLink>
          )}
          {isAuthenticated ? (
            <button onClick={() => { handleLogout(); setOpen(false); }} className="px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 text-destructive">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                <div className="px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground">Sign in</div>
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                <Button className="rounded-xl bg-gradient-primary border-0 mt-2 w-full">Get started</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
