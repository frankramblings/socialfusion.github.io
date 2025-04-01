import { Home, User, Users, Book } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location, navigate] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: User, label: "Child", path: "/child/708743" },
    { icon: Users, label: "Class", path: "/classmates" },
    { icon: Book, label: "Directory", path: "/directory" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex md:hidden z-30">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className="flex flex-col items-center justify-center flex-1 py-2"
        >
          <item.icon
            className={cn(
              "h-5 w-5",
              location === item.path
                ? "text-primary"
                : "text-neutral-400"
            )}
          />
          <span
            className={cn(
              "text-xs mt-1",
              location === item.path
                ? "text-primary"
                : "text-neutral-400"
            )}
          >
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
