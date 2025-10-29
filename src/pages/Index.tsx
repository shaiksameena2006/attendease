import { useRole } from "@/contexts/RoleContext";
import { StudentDashboard } from "./dashboard/StudentDashboard";
import { FacultyDashboard } from "./dashboard/FacultyDashboard";
import { AdminDashboard } from "./dashboard/AdminDashboard";

export default function Index() {
  const { role } = useRole();

  const renderDashboard = () => {
    switch (role) {
      case "student":
        return <StudentDashboard />;
      case "faculty":
        return <FacultyDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Render Role-Based Dashboard */}
      {renderDashboard()}
    </div>
  );
}
