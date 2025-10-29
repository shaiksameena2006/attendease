import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";

type Role = "student" | "faculty" | "admin";

interface RoleContextType {
  role: Role;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { role: authRole } = useAuth();
  const role = authRole || "student"; // Default to student if no role

  return (
    <RoleContext.Provider value={{ role }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
