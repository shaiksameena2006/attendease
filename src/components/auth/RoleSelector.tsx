import { GraduationCap, BookOpen, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "student" | "faculty" | "admin";

interface RoleSelectorProps {
  selectedRole: Role | null;
  onRoleSelect: (role: Role) => void;
}

const roles = [
  {
    id: "student" as Role,
    label: "Student",
    icon: GraduationCap,
    description: "Access your classes and attendance",
  },
  {
    id: "faculty" as Role,
    label: "Faculty",
    icon: BookOpen,
    description: "Manage classes and students",
  },
  {
    id: "admin" as Role,
    label: "Admin",
    icon: Shield,
    description: "System administration",
  },
];

export function RoleSelector({ selectedRole, onRoleSelect }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {roles.map((role) => (
        <button
          key={role.id}
          type="button"
          onClick={() => onRoleSelect(role.id)}
          className={cn(
            "flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all",
            selectedRole === role.id
              ? "border-primary bg-primary/5 shadow-md"
              : "border-border hover:border-primary/50 hover:bg-accent/50"
          )}
        >
          <div
            className={cn(
              "p-3 rounded-full transition-colors",
              selectedRole === role.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            <role.icon className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold">{role.label}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {role.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
