import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, Globe, Lock, LogOut } from "lucide-react";
import ChildSelector from "@/components/ui/child-selector";
import { useLocation } from "wouter";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [, navigate] = useLocation();
  const schoolInfo = window.tc.env;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
      <div className="flex items-center justify-between p-2 h-14">
        {/* Hamburger Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onMenuToggle}
          className="rounded-full"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* School Logo and Name */}
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={schoolInfo.currentSchoolLogo} alt="School Logo" />
            <AvatarFallback>LT</AvatarFallback>
          </Avatar>
          <span className="ml-2 font-medium truncate max-w-[150px] hidden sm:block">
            {schoolInfo.currentSchoolName?.split(' - ')[0]}
          </span>
        </div>

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 rounded-full flex items-center gap-2">
              <span className="font-medium text-sm hidden sm:block">Frank</span>
              <Avatar className="h-8 w-8 border border-neutral-200">
                <AvatarImage src="https://dhabtygr2920s.cloudfront.net/webpack/images/missing_tiny_square-845c8bc9b051a242224b117cf6bc55d9.png" />
                <AvatarFallback>F</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => console.log("Profile clicked")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => console.log("Change language clicked")}>
              <Globe className="mr-2 h-4 w-4" />
              <span>Change Language</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => console.log("Privacy clicked")}>
              <Lock className="mr-2 h-4 w-4" />
              <span>Privacy</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => console.log("Logout clicked")}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Child/Classroom Selector */}
      <ChildSelector />
    </header>
  );
}
