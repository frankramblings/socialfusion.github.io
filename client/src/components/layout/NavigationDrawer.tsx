import { cn } from '@/lib/utils';
import { Link } from 'wouter';
import { 
  Home, 
  Users, 
  Book, 
  Info, 
  HelpCircle, 
  Shield, 
  X,
  LogIn,
  LogOut,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavigationDrawer({ isOpen, onClose }: NavigationDrawerProps) {
  const { isAuthenticated, user, logout } = useAuth();
  
  // Hardcoded school info based on the example
  const school = {
    id: 6862,
    name: "Little Tree Education",
    location: "Newmarket",
    logo: "https://s3.amazonaws.com/transparentclassroom.com/schools/6862/2025/schools/dcb414666dfe250f84996cf6936bb4485d0c69679a06db591fca950d9de5847b.square.png"
  };

  // Hardcoded child info based on the example
  const child = {
    id: 708743,
    firstName: "Cecilia",
    nickname: "Cece",
    avatar: "https://dhabtygr2920s.cloudfront.net/webpack/images/missing_small_square-e98270b89d59a1b93d02f8502ec70e46.png"
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-30 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={cn(
          "fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-white z-40 shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 bg-primary/90 flex items-center pt-16">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-primary/80"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          
          <img 
            src={school.logo} 
            alt={`${school.name} Logo`} 
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3 text-white">
            <div className="font-semibold">{school.name}</div>
            <div className="text-xs opacity-90">{school.location}</div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <nav className="py-2">
            {isAuthenticated && (
              <>
                <Link href="/">
                  <a className="flex items-center px-4 py-3 text-primary font-semibold bg-primary/10">
                    <Home className="w-5 h-5 mr-3" />
                    Home
                  </a>
                </Link>
                
                <Link href={`/child/${child.id}`}>
                  <a className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                    <img 
                      src={child.avatar} 
                      alt={`${child.firstName} ${child.nickname ? `(${child.nickname})` : ''}`} 
                      className="w-6 h-6 rounded-full mr-3"
                    />
                    {child.firstName} {child.nickname ? `(${child.nickname})` : ''}
                  </a>
                </Link>
                
                <Link href="/classmates">
                  <a className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                    <Users className="w-5 h-5 mr-3" />
                    Classmates
                  </a>
                </Link>
                
                <Link href="/directory">
                  <a className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                    <Book className="w-5 h-5 mr-3" />
                    Directory
                  </a>
                </Link>
              </>
            )}
            
            <Link href="/about">
              <a className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                <Info className="w-5 h-5 mr-3" />
                About
              </a>
            </Link>
            
            <Link href="/install">
              <a className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                <HelpCircle className="w-5 h-5 mr-3" />
                Installation Guide
              </a>
            </Link>
            
            <div className="border-t border-gray-200 my-2"></div>
            
            {isAuthenticated ? (
              <>
                <Link href="/settings">
                  <a className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                    <Settings className="w-5 h-5 mr-3" />
                    Settings
                  </a>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth">
                <a className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                  <LogIn className="w-5 h-5 mr-3" />
                  Sign in
                </a>
              </Link>
            )}
            
            <Link href="/privacy">
              <a className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                <Shield className="w-5 h-5 mr-3" />
                Privacy
              </a>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
