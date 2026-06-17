import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password?: string) => Promise<void> | void;
  register: (name: string, email: string, password?: string) => Promise<void> | void;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage on mount
    const currentUserStr = localStorage.getItem("ai_cashflow_current_user");
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser && currentUser.email) {
          setIsAuthenticated(true);
          setUser(currentUser);
        }
      } catch (e) {
        // Handle potentially corrupted localstorage info
      }
    } else {
      // Legacy check
      const authStatus = localStorage.getItem("ai_cashflow_auth");
      if (authStatus === "true") {
        setIsAuthenticated(true);
        setUser({
          name: "User",
          email: "user@example.com",
          avatar: "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
        });
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password?: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        const userPayload = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name)}&background=0D8ABC&color=fff`
        };
        localStorage.setItem("ai_cashflow_current_user", JSON.stringify(userPayload));
        localStorage.setItem("ai_cashflow_auth", "true"); // legacy compatibility
        setIsAuthenticated(true);
        setUser(userPayload);
        setError(null);
      } else {
        setError(data.error || "Invalid Email or Password. Please try again or sign up.");
      }
    } catch (e) {
      setError("Network error. Please try again.");
    }
  };

  const register = async (name: string, email: string, password?: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        const userPayload = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name)}&background=0D8ABC&color=fff`
        };
        localStorage.setItem("ai_cashflow_current_user", JSON.stringify(userPayload));
        localStorage.setItem("ai_cashflow_auth", "true"); // legacy compatibility
        setIsAuthenticated(true);
        setUser(userPayload);
        setError(null);
      } else {
        if (data.error === "Account with this email already exists.") {
          await login(email, password);
        } else {
          setError(data.error || "Account with this email already exists. Please login.");
        }
      }
    } catch (e) {
      setError("Network error. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("ai_cashflow_auth");
    localStorage.removeItem("ai_cashflow_current_user");
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  if (isLoading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
