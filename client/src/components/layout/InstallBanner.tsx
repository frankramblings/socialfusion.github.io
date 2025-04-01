import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isInStandaloneMode } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';

export default function InstallBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const { isIOS } = useMobile();
  
  useEffect(() => {
    // Check if the banner was dismissed before
    const lastDismissed = localStorage.getItem('installBannerDismissed');
    const showDelay = 3000; // 3 seconds
    
    if (!lastDismissed || (Date.now() - parseInt(lastDismissed)) > 86400000) { // 24 hours
      // Check if running in standalone mode
      if (!isInStandaloneMode()) {
        const timer = setTimeout(() => setIsVisible(true), showDelay);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('installBannerDismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 z-50 animate-in slide-in-from-bottom">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Install App</h3>
          <p className="text-sm text-gray-600">Get a better experience by adding to home screen</p>
        </div>
        <div className="flex">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDismiss} 
            className="mr-2"
          >
            Later
          </Button>
          <Link href="/install">
            <Button size="sm">
              {isIOS ? "How to Install" : "Install"}
            </Button>
          </Link>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-1 right-1" 
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
