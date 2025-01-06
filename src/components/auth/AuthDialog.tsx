import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type AuthMode = "signin" | "signup" | "forgot-password";

export function AuthDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        await signUp(email, password, fullName);
        toast.success("Account created successfully!");
      } else if (mode === "signin") {
        await signIn(email, password);
        toast.success("Signed in successfully!");
      } else if (mode === "forgot-password") {
        await resetPassword(email);
        toast.success("Password reset email sent! Check your inbox.");
        setMode("signin");
      }
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "signin" 
              ? "Sign In" 
              : mode === "signup" 
              ? "Create Account" 
              : "Reset Password"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {mode !== "forgot-password" && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={loading}>
              {mode === "signin" 
                ? "Sign In" 
                : mode === "signup" 
                ? "Sign Up" 
                : "Send Reset Link"}
            </Button>
            {mode === "signin" && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setMode("forgot-password")}
              >
                Forgot your password?
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setMode(mode === "signin" ? "signup" : "signin")
              }
            >
              {mode === "signin"
                ? "Don't have an account? Sign Up"
                : mode === "signup"
                ? "Already have an account? Sign In"
                : "Back to Sign In"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}