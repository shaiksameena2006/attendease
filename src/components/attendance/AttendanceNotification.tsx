import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Camera, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AttendanceNotification() {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'failed' | null>(null);

  useEffect(() => {
    if (!user) return;

    // Listen for new attendance sessions
    const channel = supabase
      .channel('attendance-sessions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'attendance_sessions',
          filter: `status=eq.open`,
        },
        async (payload) => {
          // Check if student is enrolled in this class
          const { data: enrollment } = await supabase
            .from('class_enrollments')
            .select('*')
            .eq('student_id', user.id)
            .eq('class_id', payload.new.class_id)
            .maybeSingle();

          if (enrollment) {
            // Check if already marked attendance
            const { data: existingAttendance } = await supabase
              .from('attendance_records')
              .select('*')
              .eq('session_id', payload.new.id)
              .eq('student_id', user.id)
              .maybeSingle();

            if (!existingAttendance) {
              setActiveSession(payload.new);
              setShowDialog(true);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleFaceVerification = async () => {
    if (!activeSession || !user) return;

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Simulate face verification with camera access
      // In production, this would use WebRTC and face recognition AI
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For now, simulate successful verification
      const isVerified = Math.random() > 0.1; // 90% success rate for demo

      if (isVerified) {
        // Mark attendance
        const { error } = await supabase
          .from('attendance_records')
          .insert({
            session_id: activeSession.id,
            student_id: user.id,
            status: 'present',
            face_verified: true,
            verification_method: 'face_recognition',
            marked_by: user.id,
          });

        if (error) throw error;

        setVerificationResult('success');
        toast({
          title: "Attendance Marked",
          description: "Your attendance has been successfully recorded.",
        });

        setTimeout(() => {
          setShowDialog(false);
          setActiveSession(null);
          setVerificationResult(null);
        }, 2000);
      } else {
        setVerificationResult('failed');
        toast({
          title: "Verification Failed",
          description: "Face recognition failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Attendance marking error:', error);
      setVerificationResult('failed');
      toast({
        title: "Error",
        description: "Failed to mark attendance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSkip = () => {
    setShowDialog(false);
    setActiveSession(null);
    setVerificationResult(null);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {verificationResult === 'success' ? (
              <CheckCircle className="w-5 h-5 text-accent" />
            ) : verificationResult === 'failed' ? (
              <XCircle className="w-5 h-5 text-destructive" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
            {verificationResult === 'success'
              ? 'Attendance Marked'
              : verificationResult === 'failed'
              ? 'Verification Failed'
              : 'Your teacher is taking attendance'}
          </DialogTitle>
          <DialogDescription>
            {verificationResult === 'success'
              ? 'Your attendance has been successfully recorded.'
              : verificationResult === 'failed'
              ? 'Face recognition failed. Please try again.'
              : 'Verify your attendance using face recognition'}
          </DialogDescription>
        </DialogHeader>

        {!verificationResult && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>Note:</strong> This is a demo. Real face verification requires camera access and AI processing.
              </AlertDescription>
            </Alert>

            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center border-2 border-dashed">
              {isVerifying ? (
                <div className="text-center">
                  <div className="animate-pulse mb-2">
                    <Camera className="w-12 h-12 mx-auto text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Verifying your face...</p>
                </div>
              ) : (
                <div className="text-center p-4">
                  <Camera className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Position your face in the frame
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleFaceVerification}
                disabled={isVerifying}
                className="flex-1"
              >
                {isVerifying ? "Verifying..." : "Verify Face & Mark Present"}
              </Button>
              <Button
                variant="outline"
                onClick={handleSkip}
                disabled={isVerifying}
              >
                Skip
              </Button>
            </div>
          </div>
        )}

        {verificationResult && (
          <div className="text-center py-4">
            {verificationResult === 'success' ? (
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-accent" />
                </div>
                <p className="text-sm font-medium">Marked Present</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-destructive/20 flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-destructive" />
                </div>
                <Button onClick={() => setVerificationResult(null)} variant="outline">
                  Try Again
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
