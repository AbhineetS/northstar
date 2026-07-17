"use client";

import * as React from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";
import { Input } from "./Input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { PersonaDetails } from "./ProfileLoader";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPersona: PersonaDetails | null;
  onSuccess: () => void;
}

export const AuthModal = ({ isOpen, onClose, selectedPersona, onSuccess }: AuthModalProps) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLogin, setIsLogin] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  // Clear form after close animation
  React.useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setEmail("");
        setPassword("");
        setIsLogin(true);
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCreateProfile = async (userId: string) => {
    if (!selectedPersona) return;
    
    // Check if profile exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (!profile) {
      // Create new profile
      const { error } = await supabase
        .from("profiles")
        .insert([{ id: userId, email, role: selectedPersona.id }]);
      
      if (error) {
        console.error("Error creating profile:", error);
        toast.error("Failed to create profile. Please contact support.");
      }
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user) {
          await handleCreateProfile(data.user.id);
          toast.success("Successfully logged in");
          onSuccess();
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user) {
          await handleCreateProfile(data.user.id);
          toast.success("Account created successfully");
          onSuccess();
        }
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: process.env.NEXT_PUBLIC_SUPABASE_CALLBACK_URL || `${window.location.origin}/auth/callback`,
        }
      });
      if (error) throw error;
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Google authentication failed");
    }
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose}
      title={isLogin ? "Welcome Back" : "Create Account"}
      className="max-w-md"
    >
      <div className="flex flex-col space-y-6">
        <p className="text-sm text-text-secondary">
          {selectedPersona 
            ? `Sign in to access the ${selectedPersona.title} workspace.`
            : 'Please sign in to continue.'}
        </p>
        
        <form onSubmit={handleEmailAuth} className="flex flex-col space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-main">Email</label>
            <Input 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-main">Password</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" isLoading={isLoading} className="w-full mt-2">
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border-strong" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-surface-elevated px-2 text-text-muted">Or continue with</span>
          </div>
        </div>

        <Button variant="outline" onClick={handleGoogleAuth} className="w-full bg-white text-black hover:bg-neutral-50 flex items-center justify-center space-x-2 border-neutral-200">
          <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span>Google</span>
        </Button>

        <div className="text-center text-xs text-text-muted mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="ml-1 text-primary hover:underline focus:outline-none"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </Dialog>
  );
};
