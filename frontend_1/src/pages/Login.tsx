
import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="hidden lg:flex lg:w-1/2 bg-primary/10 p-8 items-center justify-center">
          <div className="max-w-md mx-auto animate-fade-in">
            <div className="text-4xl font-bold text-gradient mb-4">CrediSphere</div>
            <h1 className="text-3xl font-semibold mb-4">Multi-Bureau Credit Scoring & Risk Aggregation</h1>
            <p className="text-muted-foreground">
              An innovative platform that allows financial institutions to integrate, aggregate, and
              analyze credit data from multiple bureaus. Make smarter lending decisions with
              comprehensive credit insights.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 rounded-lg glass-card">
                <div className="text-lg font-medium mb-1">Unified Profiles</div>
                <p className="text-sm text-muted-foreground">
                  Consolidate credit data from multiple bureaus into a single view
                </p>
              </div>
              <div className="p-4 rounded-lg glass-card">
                <div className="text-lg font-medium mb-1">Smart Analysis</div>
                <p className="text-sm text-muted-foreground">
                  AI-powered risk assessment and credit insights
                </p>
              </div>
              <div className="p-4 rounded-lg glass-card">
                <div className="text-lg font-medium mb-1">Bureau Redundancy</div>
                <p className="text-sm text-muted-foreground">
                  Continue operations even when a bureau is unavailable
                </p>
              </div>
              <div className="p-4 rounded-lg glass-card">
                <div className="text-lg font-medium mb-1">Secure Platform</div>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security for your sensitive credit data
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 flex items-center justify-center p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
