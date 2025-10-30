import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VerificationPending() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription>
            We've sent you a verification email
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert>
            <Mail className="w-4 h-4" />
            <AlertDescription>
              Please check your email inbox and click the verification link to activate your account.
              Don't forget to check your spam folder if you don't see it.
            </AlertDescription>
          </Alert>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>After verifying your email, you can:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Log in to your account</li>
              <li>Access your personalized dashboard</li>
              <li>Start using Attendease features</li>
            </ul>
          </div>

          <div className="pt-4 space-y-2">
            <Button asChild className="w-full">
              <Link to="/auth/login">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Login
              </Link>
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Didn't receive the email? Check your spam folder or contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
