
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, Lock, Building, AlertTriangle } from "lucide-react";

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signup } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (organization.length < 2) {
      newErrors.organization = "Organization name is too short";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await signup(email, password, organization);
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-scale-in w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">Create Account</h1>
        <p className="text-muted-foreground">
          Join CrediSphere to streamline your credit risk analysis
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="form-label">
            Email
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              className={`form-input pl-10 ${errors.email ? "border-destructive" : ""}`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive flex items-center mt-1">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {errors.email}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="form-label">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`form-input pl-10 ${errors.password ? "border-destructive" : ""}`}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive flex items-center mt-1">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {errors.password}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              className={`form-input pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive flex items-center mt-1">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {errors.confirmPassword}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="organization" className="form-label">
            Organization
          </Label>
          <div className="relative">
            <Input
              id="organization"
              type="text"
              className={`form-input pl-10 ${errors.organization ? "border-destructive" : ""}`}
              placeholder="Enter your organization name"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          {errors.organization && (
            <p className="text-xs text-destructive flex items-center mt-1">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {errors.organization}
            </p>
          )}
        </div>
        
        <div className="pt-2">
          <Button
            type="submit"
            className="w-full rounded-lg h-12 button-hover-effect"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <span className="loading-dot loading-dot-1"></span>
                <span className="loading-dot loading-dot-2"></span>
                <span className="loading-dot"></span>
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      </form>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
