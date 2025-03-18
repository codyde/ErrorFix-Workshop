/**
 * FILE OVERVIEW:
 * Purpose: Login dialog component for user authentication
 * Key Concepts: React hooks, form handling, authentication, dialog UI
 * Module Type: Component
 * @ai_context: Dialog component that integrates with the auth store
 */

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/store";
import { Loader2 } from "lucide-react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // SENTRY-TEST-AREA: This function call can be modified to test Sentry error monitoring
      const result = await login(email, password);

      if (!result.success) {
        setError(result.error || "Login failed. Please try again.");
      } else {
        onOpenChange(false);
      }
    } catch (err) {
      // Capture the error with Sentry with enhanced context
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      const isConfigError = errorMessage.includes("CONFIG_MISMATCH");

      // Provide a more helpful error message for configuration issues
      if (isConfigError) {
        setError(
          "Authentication system configuration error. Please contact support.",
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl text-green-500">
            Login to Interdimensional Depot
          </DialogTitle>
          <DialogDescription>
            Enter your credentials to access the multiverse's best products.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-gray-800 border-gray-700"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-gray-800 border-gray-700"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              For demo purposes, any password will work with a valid email
              format.
            </p>
          </div>

          {error && (
            <div className="text-sm text-green-500 font-medium">{error}</div>
          )}

          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
