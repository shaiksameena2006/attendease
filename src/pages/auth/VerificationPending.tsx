import { Link } from "react-router-dom";
import { Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerificationPending() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-secondary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Verification Pending
          </CardTitle>
          <CardDescription>
            Your account is waiting for admin approval
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-medium">What happens next?</h4>
                <p className="text-sm text-muted-foreground">
                  An administrator will review your registration details and verify
                  your institutional email address.
                </p>
              </div>
            </div>

            <div className="pl-8 space-y-2">
              <p className="text-sm text-muted-foreground">
                ✓ You'll receive an email once your account is approved
              </p>
              <p className="text-sm text-muted-foreground">
                ✓ This usually takes 1-2 business days
              </p>
              <p className="text-sm text-muted-foreground">
                ✓ Check your spam folder for updates
              </p>
            </div>
          </div>

          <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <p className="text-sm text-center text-foreground">
              Need help? Contact{" "}
              <a
                href="mailto:support@attendease.edu"
                className="text-primary hover:underline font-medium"
              >
                support@attendease.edu
              </a>
            </p>
          </div>

          <Button asChild className="w-full">
            <Link to="/auth/login">
              Back to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
