
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";

interface User {
  id: string;
  email: string;
  organization: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, organization: string) => Promise<void>;
  signup: (email: string, password: string, organization: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      await checkAuth();
      setIsLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    // Check if user session exists in localStorage
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        return true;
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("user");
        setUser(null);
      }
    }
    
    return false;
  };

  const login = async (email: string, password: string, organization: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call to authenticate user
      // This would be replaced with a real API call in production
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, any valid email format will work
      if (!email.includes("@") || !password || !organization) {
        throw new Error("Invalid credentials");
      }
      
      // Mock successful login
      const mockUser: User = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        email,
        organization,
      };
      
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      // Update context state
      setUser(mockUser);
      
      // Show success toast
      toast.success("Login successful", {
        description: `Welcome back to CrediSphere, ${organization}!`,
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      let message = "Login failed";
      
      if (error instanceof Error) {
        message = error.message;
      }
      
      toast.error("Authentication failed", {
        description: message,
      });
      
      // Clear any stored data
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, organization: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call to register user
      // This would be replaced with a real API call in production
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Validate inputs
      if (!email.includes("@") || password.length < 6 || !organization) {
        throw new Error("Invalid registration data");
      }
      
      // Mock successful registration
      toast.success("Account created successfully", {
        description: "Please check your email for verification.",
      });
      
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      let message = "Registration failed";
      
      if (error instanceof Error) {
        message = error.message;
      }
      
      toast.error("Registration failed", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    // Remove user from localStorage
    localStorage.removeItem("user");
    
    // Update context state
    setUser(null);
    
    // Show toast
    toast.success("Logged out successfully");
    
    // Redirect to login page
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
