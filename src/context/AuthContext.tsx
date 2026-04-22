import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "seeker" | "employer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const STORAGE_KEY = "jobhub_user";

function loadUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function persistUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const saved = loadUser();
    if (saved) {
      setUser(saved);
    }
    setIsLoading(false);
  }, []);

  // Persist whenever user changes
  useEffect(() => {
    if (!isLoading) {
      persistUser(user);
    }
  }, [user, isLoading]);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return data.user;
      }
      return null;
    } catch (e) {
      console.error("Login failed", e);
      return null;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<User | null> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return data.user;
      }
      return null;
    } catch (e) {
      console.error("Registration failed", e);
      return null;
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
