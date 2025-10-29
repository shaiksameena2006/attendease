import { 
  Menu, X, User, Settings, LogOut, Calendar, Users, FileText, 
  CheckSquare, Trophy, Award, MessageSquare, Bus, Bell, HelpCircle,
  BarChart3, BookOpen, Target, CalendarDays, Shield, Database, Sliders
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useRole } from "@/contexts/RoleContext";
import { Button } from "@/components/ui/button";

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { role } = useRole();

  const studentMenuItems = [
    { icon: CheckSquare, label: "Attendance", to: "/student/attendance" },
    { icon: Calendar, label: "Timetable", to: "/student/timetable" },
    { icon: Trophy, label: "Clubs & Houses", to: "/student/clubs" },
    { icon: Award, label: "Certificates", to: "/student/certificates" },
    { icon: MessageSquare, label: "Messages", to: "/student/messages" },
    { icon: Bus, label: "Transport", to: "/student/transport" },
  ];

  const facultyMenuItems = [
    { icon: Users, label: "Class Management", to: "/faculty/classes" },
    { icon: Calendar, label: "Timetable Manager", to: "/faculty/timetable" },
    { icon: Award, label: "Certificates", to: "/faculty/certificates" },
    { icon: Target, label: "CO-PO Management", to: "/faculty/co-po" },
    { icon: CalendarDays, label: "Events", to: "/faculty/events" },
  ];

  const adminMenuItems = [
    { icon: Users, label: "User Management", to: "/admin/users" },
    { icon: BarChart3, label: "Analytics", to: "/admin/analytics" },
    { icon: BookOpen, label: "Academic Management", to: "/admin/academic" },
    { icon: Bus, label: "Transport Admin", to: "/admin/transport" },
    { icon: Sliders, label: "System Settings", to: "/admin/settings" },
  ];

  const sharedMenuItems = [
    { icon: Bell, label: "Notifications", to: "/notifications" },
    { icon: Settings, label: "Settings", to: "/settings" },
    { icon: HelpCircle, label: "Help & Support", to: "/help" },
  ];

  const getMenuItems = () => {
    switch (role) {
      case "student":
        return studentMenuItems;
      case "faculty":
        return facultyMenuItems;
      case "admin":
        return adminMenuItems;
      default:
        return studentMenuItems;
    }
  };

  const menuItems = [...getMenuItems(), ...sharedMenuItems];

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
