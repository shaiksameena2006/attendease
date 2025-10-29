import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Radio, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

export function FacultyAttendanceSession() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchFacultyClasses();
    }
  }, [user]);

  const fetchFacultyClasses = async () => {
    try {
      const { data } = await supabase
        .from("classes")
        .select(`
          *,
          subjects (name),
          timetable_entries!inner (id)
        `)
        .eq("faculty_id", user?.id);

      setClasses(data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const startSession = async () => {
    if (!selectedClass) {
      toast({
        title: "Please select a class",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours

      const { data, error } = await supabase
        .from("attendance_sessions")
        .insert({
          class_id: selectedClass,
          session_date: now.toISOString().split('T')[0],
          start_time: now.toISOString(),
          end_time: endTime.toISOString(),
          status: "open",
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      setActiveSession(data);
      toast({
        title: "Session Started",
        description: "Students can now mark their attendance using Bluetooth",
      });
    } catch (error) {
      console.error("Error starting session:", error);
      toast({
        title: "Error",
        description: "Failed to start attendance session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    if (!activeSession) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("attendance_sessions")
        .update({ status: "closed", end_time: new Date().toISOString() })
        .eq("id", activeSession.id);

      if (error) throw error;

      setActiveSession(null);
      toast({
        title: "Session Ended",
        description: "Attendance session has been closed",
      });
    } catch (error) {
      console.error("Error ending session:", error);
      toast({
        title: "Error",
        description: "Failed to end attendance session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="w-5 h-5" />
          Bluetooth Attendance Session
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!activeSession ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="class-select">Select Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class-select">
                  <SelectValue placeholder="Choose a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.subjects?.name || "Class"} - {cls.section || ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={startSession} disabled={loading || !selectedClass} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4 mr-2" />
                  Start Bluetooth Session
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Students within Bluetooth range will be able to mark their attendance automatically
            </p>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                Session Active
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                Students can now mark attendance via Bluetooth
              </p>
            </div>

            <Button onClick={endSession} disabled={loading} variant="destructive" className="w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ending...
                </>
              ) : (
                "End Session"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
