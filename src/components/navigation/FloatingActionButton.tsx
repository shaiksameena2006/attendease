import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick?: () => void;
  className?: string;
}

export function FloatingActionButton({ onClick, className }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg z-40 bg-accent hover:bg-accent/90 text-accent-foreground",
        className
      )}
      aria-label="Quick action"
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
}
