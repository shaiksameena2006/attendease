import { useState } from "react";
import { Menu, X, BarChart, Users, Award, Bus, MessageSquare, Settings, HelpCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { to: "/attendance", icon: BarChart, label: "Attendance" },
  { to: "/clubs", icon: Users, label: "Clubs & Houses" },
  { to: "/certificates", icon: Award, label: "Certificates" },
  { to: "/transport", icon: Bus, label: "Transport" },
  { to: "/messages", icon: MessageSquare, label: "Messages" },
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/support", icon: HelpCircle, label: "Help & Support" },
];

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="relative z-50"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-in fade-in"
          onClick={toggleMenu}
        />
      )}

      {/* Menu Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-72 bg-card border-l border-border z-40 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-6 pt-20">
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={toggleMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <button
            onClick={toggleMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors mt-auto"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
