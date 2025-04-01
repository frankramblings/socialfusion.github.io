import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Define the User type
interface User {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatar?: string;
  token?: string;
}

// Define the context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType | null>(null);

// Constants
const TC_URL = "https://www.transparentclassroom.com";
const AUTH_STORAGE_KEY = "tc_mobile_auth";

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  // Initialize auth state from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      try {
        const userData = JSON.parse(storedAuth);
        setUser(userData);
      } catch (err) {
        console.error("Error parsing stored auth data:", err);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, we would use Transparent Classroom's OAuth or API
      // For now, we'll simulate a login and store user data
      
      // Example API call (this would be replaced with actual TC authentication)
      // const response = await fetch(`${TC_URL}/api/v1/authenticate`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      
      // if (!response.ok) {
      //   throw new Error("Authentication failed");
      // }
      
      // const userData = await response.json();
      
      // For demo purposes, create mock user data
      const userData = {
        id: 635484,
        firstName: "Frank",
        lastName: "Emanuele",
        fullName: "Frank Emanuele",
        email: email,
        avatar: "https://dhabtygr2920s.cloudfront.net/webpack/images/missing_tiny_square-845c8bc9b051a242224b117cf6bc55d9.png",
        token: "sample-auth-token"
      };
      
      // Store in localStorage for persistence
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.firstName}!`,
      });
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // In a real implementation, we would call TC's logout endpoint
      // For now, just clear local storage
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      
      toast({
        title: "Logout successful",
        description: "You have been logged out",
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}