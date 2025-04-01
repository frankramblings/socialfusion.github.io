import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Lock } from "lucide-react";

// Define form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const { login, user, isLoading, error } = useAuth();
  const [, navigate] = useLocation();
  const [authType, setAuthType] = useState<'login' | 'transparent-classroom'>('login');
  
  // Initialize form with react-hook-form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Handle form submission
  const onSubmit = async (values: LoginFormValues) => {
    await login(values.email, values.password);
  };

  // Handle login with Transparent Classroom
  const handleTCLogin = () => {
    // This would redirect to TC's OAuth page in a real implementation
    window.location.href = "https://www.transparentclassroom.com/auth/sign_in";
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left column - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your Transparent Classroom account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {authType === 'login' ? (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...form.register("password")}
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
                
                {error && (
                  <p className="text-sm text-red-500 text-center">{error.message}</p>
                )}
              </form>
            ) : (
              <div className="py-4 space-y-6">
                <div className="text-center">
                  <p className="mb-4">Click the button below to sign in with your Transparent Classroom account</p>
                  <Button 
                    onClick={handleTCLogin} 
                    className="w-full bg-[#6b8e50] hover:bg-[#5a7946]"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Continue to Transparent Classroom
                  </Button>
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setAuthType(authType === 'login' ? 'transparent-classroom' : 'login')}
                >
                  {authType === 'login' 
                    ? "Sign in directly with Transparent Classroom" 
                    : "Sign in with email and password"}
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a 
                href="https://www.transparentclassroom.com/auth/sign_up" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Sign up
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Right column - Hero section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary/90 to-primary-foreground hidden md:flex flex-col justify-center p-12 text-white">
        <div className="space-y-6 max-w-lg mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">
            TC Mobile Experience
          </h1>
          <p className="text-lg">
            A modern, mobile-friendly interface for Transparent Classroom, designed to give parents an easier way to stay connected with their child's education.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Clean, responsive design optimized for mobile devices
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Easy installation to your iOS home screen
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Quick access to your child's activities and progress
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}