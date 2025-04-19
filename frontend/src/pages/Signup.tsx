
import React from "react";
import SignupForm from "@/components/auth/SignupForm";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const Signup: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="hidden lg:flex lg:w-1/2 bg-primary/10 p-8 items-center justify-center">
          <div className="max-w-md mx-auto animate-fade-in">
            <div className="text-4xl font-bold text-gradient mb-4">CrediSphere</div>
            <h1 className="text-3xl font-semibold mb-4">Join CrediSphere Today</h1>
            <p className="text-muted-foreground mb-8">
              Create an account to access our powerful credit risk aggregation platform and make 
              smarter lending decisions with comprehensive credit insights.
            </p>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-primary/10 mr-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-primary"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                    <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                    <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Multi-Bureau Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Aggregate and analyze credit data from multiple bureaus in one place
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-primary/10 mr-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-primary"
                  >
                    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path>
                    <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Real-time Risk Assessment</h3>
                  <p className="text-sm text-muted-foreground">
                    Get instant insights into credit risk with our advanced analytics
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-primary/10 mr-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-primary"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                    <line x1="2" x2="22" y1="10" y2="10"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Enhanced Lending Decisions</h3>
                  <p className="text-sm text-muted-foreground">
                    Make more informed lending decisions with comprehensive credit profiles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 flex items-center justify-center p-8">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
