import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "default" | "outline" | "secondary";
}

interface QuickActionGridProps {
  actions: QuickAction[];
  title?: string;
  columns?: number;
}

export function QuickActionGrid({ actions, title = "Quick Actions", columns = 2 }: QuickActionGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "grid gap-3",
          columns === 2 && "grid-cols-2",
          columns === 3 && "grid-cols-2 md:grid-cols-3",
          columns === 4 && "grid-cols-2 md:grid-cols-4"
        )}>
          {actions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || "outline"}
              onClick={action.onClick}
              className="h-auto flex-col gap-2 p-4"
            >
              <action.icon className="w-6 h-6" />
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
