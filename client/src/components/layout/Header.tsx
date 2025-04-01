import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, User, LogIn } from 'lucide-react';
import UserDropdown from './UserDropdown';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  
  // Hardcoded school info based on the example
  const school = {
    id: 6862,
    name: "Little Tree Education",
    location: "Newmarket",
    logo: "https://s3.amazonaws.com/transparentclassroom.com/schools/6862/2025/schools/dcb414666dfe250f84996cf6936bb4485d0c69679a06db591fca950d9de5847b.square.png"
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm h-14 md:h-16">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-2 rounded-full -ml-2" 
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5 text-gray-700" />
            <span className="sr-only">Menu</span>
          </Button>
          
          <Link href="/" className="flex items-center ml-2">
            {school.logo ? (
              <img 
                src={school.logo} 
                alt={`${school.name} Logo`} 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                {school.name.charAt(0)}
              </div>
            )}
            <span className="ml-2 font-medium text-gray-800 hidden sm:inline-block">
              {school.name}
            </span>
          </Link>
        </div>
        
        <div className="flex items-center">
          {isAuthenticated ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="p-1 rounded-full"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              {user?.avatar ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.fullName} />
                  <AvatarFallback>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
                </Avatar>
              ) : (
                <User className="h-5 w-5 text-gray-700" />
              )}
              <span className="sr-only">User menu</span>
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center"
              onClick={() => navigate('/auth')}
            >
              <LogIn className="h-4 w-4 mr-1.5" />
              Sign in
            </Button>
          )}
          
          <UserDropdown 
            isOpen={isUserMenuOpen} 
            onClose={() => setIsUserMenuOpen(false)} 
          />
        </div>
      </div>
    </header>
  );
}
