import { cn } from '@/lib/utils';
import { Link } from 'wouter';
import {
  User,
  Settings,
  Globe,
  LogOut
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDropdown({ isOpen, onClose }: UserDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-2 mt-14 z-40 w-52 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
    >
      <div className="py-1" role="menu" aria-orientation="vertical">
        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
          <p className="font-medium">{user.fullName}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        
        <Link href="/profile">
          <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Profile
          </a>
        </Link>
        
        <Link href="/settings">
          <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </a>
        </Link>
        
        <div className="relative group">
          <button className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Change language
            </div>
          </button>
          
          <div className="hidden group-hover:block absolute right-full top-0 w-40 bg-white shadow-lg rounded-md">
            <div className="py-1 max-h-60 overflow-y-auto">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">English (US)</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">English (UK)</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Español</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Français</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Deutsch</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 my-1"></div>
        
        <button 
          onClick={handleLogout}
          className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}
