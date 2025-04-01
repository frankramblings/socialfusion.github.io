import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, User, Users, Book, Info, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideNav({ isOpen, onClose }: SideNavProps) {
  const [location, navigate] = useLocation();
  const schoolInfo = window.tc.env;

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: User, label: "Cecilia (Cece)", path: "/child/708743" },
    { icon: Users, label: "Classmates", path: "/classmates" },
    { icon: Book, label: "Directory", path: "/directory" },
    { icon: Info, label: "About", path: "/about" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0 md:shadow-none"
      )}
    >
      <div className="flex flex-col h-full">
        {/* School Information */}
        <div className="p-4 bg-primary text-white">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={schoolInfo.currentSchoolLogo} alt="School Logo" />
              <AvatarFallback>LT</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <div className="font-medium">{schoolInfo.currentSchoolName?.split(' - ')[0]}</div>
              <div className="text-xs opacity-80">
                {schoolInfo.currentSchoolName?.split(' - ')[1] || 'Newmarket'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto pt-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex items-center w-full px-4 py-3 text-left",
                location === item.path
                  ? "text-primary-foreground bg-primary/10"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Information */}
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://dhabtygr2920s.cloudfront.net/webpack/images/missing_tiny_square-845c8bc9b051a242224b117cf6bc55d9.png" />
              <AvatarFallback>F</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <div className="font-medium text-foreground">Frank Emanuele</div>
              <Button 
                variant="link" 
                className="h-auto p-0 text-xs text-primary"
                onClick={() => console.log("Logout clicked")}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
