import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { FaceCaptureInterface } from "@/components/auth/FaceCaptureInterface";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

type Role = "student" | "faculty" | "admin";

const registerSchema = z.object({
  email: z.string().email("Invalid email address").max(255, "Email too long"),
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password too long"),
});

export default function Register() {
  const navigate = useNavigate();
  const { signUp, user, storeFaceEncoding } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [faceCaptured, setFaceCaptured] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      toast({
        title: "Role required",
        description: "Please select your role to continue",
        variant: "destructive",
      });
      return;
    }

    // Validate input
    try {
      registerSchema.parse({ email, fullName, password });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords are the same",
        variant: "destructive",
      });
      return;
    }

    if (!faceCaptured) {
      toast({
        title: "Face capture required",
        description: "Please capture your face for biometric enrollment",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(email, password, selectedRole, fullName);

    if (error) {
      setIsLoading(false);
      
      if (error.message.includes("User already registered")) {
        toast({
          title: "Account exists",
          description: "An account with this email already exists. Please sign in.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
      }
      return;
    }

    // Store face encoding (simulated for now)
    await storeFaceEncoding("simulated_face_encoding_" + Date.now());

    setIsLoading(false);
    toast({
      title: "Registration successful",
      description: "Please check your email to verify your account.",
    });
    navigate("/auth/verification-pending");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            Create Your Account
          </CardTitle>
          <CardDescription>
            Join Attendease and start managing your campus activities
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Select Your Role</Label>
            <RoleSelector
              selectedRole={selectedRole}
              onRoleSelect={setSelectedRole}
            />
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email">Institutional Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="your.email@institution.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Use your official institutional email address
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <div className="relative">
                <Input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <PasswordStrengthIndicator password={password} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <FaceCaptureInterface onCapture={setFaceCaptured} />

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
