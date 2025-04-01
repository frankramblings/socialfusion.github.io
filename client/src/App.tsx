import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ChildProfile from "@/pages/ChildProfile";
import InstallPage from "@/pages/InstallPage";
import AuthPage from "@/pages/auth-page";
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import NavigationDrawer from "@/components/layout/NavigationDrawer";
import InstallBanner from "@/components/layout/InstallBanner";
import { useToast } from "@/hooks/use-toast";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [location] = useLocation();
  const { toast } = useToast();
  
  // Check if the app is running in standalone mode (installed PWA)
  const isInStandaloneMode = () => 
    (window.matchMedia('(display-mode: standalone)').matches) || 
    (window.navigator as any).standalone || 
    document.referrer.includes('android-app://');
  
  // Close drawer when navigating to a new page
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location]);

  // Handle network status changes
  useEffect(() => {
    const handleOnline = () => {
      toast({
        title: "You're back online",
        description: "Connected to the network",
        variant: "default",
      });
    };

    const handleOffline = () => {
      toast({
        title: "You're offline",
        description: "Some features may be limited",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Header 
            onMenuToggle={() => setIsDrawerOpen(!isDrawerOpen)} 
          />
          <NavigationDrawer 
            isOpen={isDrawerOpen} 
            onClose={() => setIsDrawerOpen(false)} 
          />
          
          <main className="pt-14 md:pt-16 pb-16 min-h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out">
            <Switch>
              <ProtectedRoute path="/" component={Home} />
              <ProtectedRoute path="/child/:id" component={ChildProfile} />
              <Route path="/auth" component={AuthPage} />
              <Route path="/install" component={InstallPage} />
              <Route component={NotFound} />
            </Switch>
          </main>
          
          {!isInStandaloneMode() && <InstallBanner />}
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
