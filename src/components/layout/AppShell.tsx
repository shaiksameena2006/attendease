import { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "@/components/navigation/BottomNav";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="pt-16 pb-16 min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
