import { useState } from "react";
import { Camera, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface FaceCaptureInterfaceProps {
  onCapture?: (captured: boolean) => void;
}

export function FaceCaptureInterface({ onCapture }: FaceCaptureInterfaceProps) {
  const [isCaptured, setIsCaptured] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = () => {
    setIsCapturing(true);
    // NOTE: This is a PLACEHOLDER implementation for development only
    // Real face recognition requires: WebRTC camera access, face detection library,
    // face encoding generation, and server-side verification
    setTimeout(() => {
      setIsCaptured(true);
      setIsCapturing(false);
      onCapture?.(true);
    }, 1500);
  };

  return (
    <Card className="border-2">
      <CardContent className="p-6">
        <div className="space-y-4">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Development Mode:</strong> Face recognition is currently a placeholder. 
              Real biometric authentication is not implemented. Do not use in production.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Face Recognition Setup (Placeholder)</h3>
            {isCaptured && (
              <div className="flex items-center gap-2 text-accent">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Captured</span>
              </div>
            )}
          </div>

          <div
            className={cn(
              "relative aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center",
              isCapturing && "animate-pulse"
            )}
          >
            {!isCaptured ? (
              <div className="text-center p-4">
                <Camera className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Position your face in the frame
                </p>
              </div>
            ) : (
              <div className="text-center p-4">
                <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-accent/20 flex items-center justify-center">
                  <Check className="w-10 h-10 text-accent" />
                </div>
                <p className="text-sm font-medium">Face captured successfully</p>
              </div>
            )}
          </div>

          <Button
            onClick={handleCapture}
            disabled={isCaptured || isCapturing}
            className="w-full"
          >
            {isCapturing ? "Capturing..." : isCaptured ? "Recapture" : "Capture Face"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            ⚠️ This is a UI placeholder only. No actual biometric data is captured or verified.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
