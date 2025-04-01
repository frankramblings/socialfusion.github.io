import { useState, useEffect } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      
      // Check if mobile based on user agent
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent));
      
      // Check if iOS
      const iosRegex = /iPhone|iPad|iPod/i;
      setIsIOS(iosRegex.test(userAgent));
      
      // Check if it's a touch device
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
      
      // Check screen size
      setIsSmallScreen(window.innerWidth < 768);
      
      // Check orientation
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    // Run initially
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { 
    isMobile, 
    isSmallScreen, 
    isTouchDevice, 
    isPortrait,
    isIOS
  };
}

export default useMobile;
