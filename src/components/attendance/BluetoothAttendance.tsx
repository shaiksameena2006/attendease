import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bluetooth, CheckCircle, Loader2, Radio } from "lucide-react";
import { useBluetooth } from "@/hooks/useBluetooth";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function BluetoothAttendance() {
  const { user } = useAuth();
  const { isSupported, checkProximity, markAttendanceByProximity } = useBluetooth();
  const [scanning, setScanning] = useState(false);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);

  useEffect(() => {
    fetchActiveSessions();
    
    // Real-time subscription for new sessions
    const channel = supabase
      .channel('attendance-sessions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'attendance_sessions'
        },
        () => fetchActiveSessions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchActiveSessions = async () => {
    if (!user) return;

    try {
      // Get enrolled classes
      const { data: enrollments } = await supabase
        .from("class_enrollments")
        .select("class_id")
        .eq("student_id", user.id);

      if (!enrollments?.length) return;

      // Get active sessions for enrolled classes
      const { data: sessions } = await supabase
        .from("attendance_sessions")
        .select(`
          *,
          classes (
            id,
            subjects (name),
            profiles!classes_faculty_id_fkey (full_name)
          )
        `)
        .in("class_id", enrollments.map(e => e.class_id))
        .eq("status", "open")
        .gte("end_time", new Date().toISOString());

      setActiveSessions(sessions || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const handleScanAndMark = async (sessionId: string, classroomId: string) => {
    if (!user) return;

    setScanning(true);
    try {
      // Check proximity to classroom
      const isNear = await checkProximity(classroomId);
      
      if (isNear) {
        // Mark attendance
        const success = await markAttendanceByProximity(sessionId, user.id);
        
        if (success) {
          toast({
            title: "Attendance Marked",
            description: "You've been marked present successfully",
          });
          fetchActiveSessions();
        }
      } else {
        toast({
          title: "Not in range",
          description: "You must be near the classroom to mark attendance",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      });
    } finally {
      setScanning(false);
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Bluetooth className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Bluetooth is not supported on your device
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="w-5 h-5 animate-pulse text-primary" />
            Bluetooth Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Mark your attendance automatically when you're near the classroom
          </p>
        </CardContent>
      </Card>

      {activeSessions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No active attendance sessions at the moment
            </p>
          </CardContent>
        </Card>
      ) : (
        activeSessions.map((session) => (
          <Card key={session.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {session.classes?.subjects?.name || "Class"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {session.classes?.profiles?.full_name || "Faculty"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Session: {new Date(session.start_time).toLocaleTimeString()} - 
                    {new Date(session.end_time).toLocaleTimeString()}
                  </p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              
              <Button 
                onClick={() => handleScanAndMark(session.id, session.class_id)}
                disabled={scanning}
                className="w-full"
              >
                {scanning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Bluetooth className="w-4 h-4 mr-2" />
                    Scan & Mark Attendance
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
