import { useRole } from "@/contexts/RoleContext";
import { StudentDashboard } from "./dashboard/StudentDashboard";
import { FacultyDashboard } from "./dashboard/FacultyDashboard";
import { AdminDashboard } from "./dashboard/AdminDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Index() {
  const { role, setRole } = useRole();

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
      {/* Role Switcher - Demo purposes only */}
      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Demo Mode: Switch roles to preview different dashboards
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                This role switcher is for demonstration only and will be replaced with proper authentication
              </p>
            </div>
            <Tabs value={role} onValueChange={(value) => setRole(value as any)}>
              <TabsList>
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="faculty">Faculty</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Render Role-Based Dashboard */}
      {renderDashboard()}
    </div>
  );
}
