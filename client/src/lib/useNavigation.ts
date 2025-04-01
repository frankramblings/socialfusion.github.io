import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useMobile } from "@/hooks/use-mobile";

export const useNavigation = () => {
  const [location, navigate] = useLocation();
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const isMobile = useMobile();

  // Close side nav when route changes on mobile
  useEffect(() => {
    if (isMobile && sideNavOpen) {
      setSideNavOpen(false);
    }
  }, [location, isMobile]);

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const closeSideNav = () => {
    setSideNavOpen(false);
  };

  return {
    location,
    navigate,
    sideNavOpen,
    toggleSideNav,
    closeSideNav,
  };
};
