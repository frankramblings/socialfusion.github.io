import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ChildProfile from "@/pages/ChildProfile";
import Classmates from "@/pages/Classmates";
import Directory from "@/pages/Directory";
import Header from "@/components/layout/Header";
import SideNav from "@/components/layout/SideNav";
import BottomNav from "@/components/layout/BottomNav";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/child/:id" component={ChildProfile} />
      <Route path="/classmates" component={Classmates} />
      <Route path="/directory" component={Directory} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sideNavOpen, setSideNavOpen] = useState(false);

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header onMenuToggle={toggleSideNav} />
        <SideNav isOpen={sideNavOpen} onClose={() => setSideNavOpen(false)} />
        
        {/* Main content */}
        <div className="flex-1 pt-14 pb-16 md:pb-0">
          <Router />
        </div>
        
        <BottomNav />
        <Toaster />
        
        {/* Overlay for side nav on mobile */}
        {sideNavOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSideNavOpen(false)}
          />
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
