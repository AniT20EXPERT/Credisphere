
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";
import { ArrowRight, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useReportSubmission } from "@/hooks/useReportSubmission";

const ReportSubmission: React.FC = () => {
  const navigate = useNavigate();
  const {
    step,
    setStep,
    analysisQuery,
    setAnalysisQuery,
    formFields,
    userInputs,
    setUserInputs,
    apiCalls,
    isLoading,
    error,
    submitQuery,
    submitFinalData
  } = useReportSubmission();

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysisQuery.trim()) {
      toast.error("Please enter what you want to analyze");
      return;
    }
    
    await submitQuery();
  };

  const handleUserInputsChange = (field: string, value: string) => {
    setUserInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const missingFields = formFields.filter((field) => !userInputs[field] || userInputs[field].trim() === "");
    if (missingFields.length > 0) {
      toast.error(`Please fill all required fields: ${missingFields.join(", ")}`);
      return;
    }
  
    const success = await submitFinalData();
    if (success) {
      toast.success("Report submitted successfully");
      const reportId = "REP-" + Math.floor(Math.random() * 10000);
      navigate(`/report-analysis?id=${reportId}`, {
        state: { apiCalls, userInputs },
      });
    }
  };
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Submit New Report</h1>
      <p className="text-muted-foreground mb-6">
        Submit a credit analysis request
      </p>
      
      {/* Step Indicator */}
      <div className="mb-8">
        <Progress value={(step / 3) * 100} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span className={step >= 1 ? "text-primary font-medium" : ""}>Analysis Query</span>
          <span className={step >= 2 ? "text-primary font-medium" : ""}>Required Information</span>
          <span className={step >= 3 ? "text-primary font-medium" : ""}>Submission</span>
        </div>
      </div>
      
      {/* Step 1: Analysis Query */}
      {step === 1 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl">What do you want to analyze?</CardTitle>
          </CardHeader>
          <form onSubmit={handleQuerySubmit}>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Describe what you're looking to analyze and we'll determine what information is needed.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="analysisQuery">Analysis Query</Label>
                  <Input
                    id="analysisQuery"
                    placeholder="e.g., I need to check credit scores for a loan application"
                    value={analysisQuery}
                    onChange={(e) => setAnalysisQuery(e.target.value)}
                    className="form-input min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                type="submit" 
                className="button-hover-effect"
                disabled={isLoading || !analysisQuery.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
      
      {/* Step 2: Dynamic Form Fields */}
      {step === 2 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl">Required Information</CardTitle>
          </CardHeader>
          <form onSubmit={handleFinalSubmit}>
            <CardContent>
              {error ? (
                <div className="flex items-center space-x-2 p-4 bg-destructive/10 text-destructive rounded-md">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    Please provide the following information needed for your analysis:
                  </p>
                  
                  {formFields.length === 0 ? (
                    <div className="py-4 text-center">
                      <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">Loading required fields...</p>
                    </div>
                  ) : (
                    <>
                      {formFields.map((field) => (
                        <div key={field} className="space-y-2">
                          <Label htmlFor={field} className="capitalize">
                            {field.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          <Input
                            id={field}
                            value={userInputs[field] || ''}
                            onChange={(e) => handleUserInputsChange(field, e.target.value)}
                            placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
                            className="form-input"
                          />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button 
                type="submit" 
                className="button-hover-effect"
                disabled={isLoading || formFields.length === 0 || error !== null}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Submit <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
      
      {/* Step 3: Submission Success */}
      {step === 3 && (
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="mb-4 rounded-full bg-green-100 dark:bg-green-900 p-3">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Report Submitted Successfully</h3>
              <p className="text-muted-foreground text-center mb-6">
                Your analysis request has been submitted and is being processed.
              </p>
              <Button 
                onClick={() => navigate("/report-analysis?id=REP-" + Math.floor(Math.random() * 10000))}
                className="button-hover-effect"
              >
                View Report <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportSubmission;
