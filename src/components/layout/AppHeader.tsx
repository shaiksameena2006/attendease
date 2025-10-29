import { Moon, Sun, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { HamburgerMenu } from "@/components/navigation/HamburgerMenu";

export function AppHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border safe-top">
      <div className="flex items-center justify-between h-full px-4 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-primary">Attendease</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>

          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="w-5 h-5" />
          </Button>

          <HamburgerMenu />
        </div>
      </div>
    </header>
  );
}
