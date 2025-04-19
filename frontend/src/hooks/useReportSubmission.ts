
import { useState } from "react";
import { toast } from "@/lib/toast";

interface ApiCall {
  endpoint: string;
  fields: Record<string, string>;
}

export const useReportSubmission = () => {
  const [step, setStep] = useState<number>(1);
  const [analysisQuery, setAnalysisQuery] = useState<string>("");
  const [formFields, setFormFields] = useState<string[]>([]);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [apiCalls, setApiCalls] = useState<string[]>([]);
  const [requestedData, setRequestedData] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to submit initial query
  const submitQuery = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Make API call to get required fields
      const response = await fetch("http://192.168.55.47:4000/new-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ context: analysisQuery }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API response:", data);
      
      if (!data.api_calls || !data.requested_data || !Array.isArray(data.api_calls) || !Array.isArray(data.requested_data)) {
        throw new Error("Invalid API response format");
      }
      
      setApiCalls(data.api_calls);
      setRequestedData(data.requested_data);
      
      // Extract unique fields from requested_data
      const allFields: string[] = [];
      data.requested_data.forEach((fields: string[]) => {
        fields.forEach(field => {
          if (!allFields.includes(field)) {
            allFields.push(field);
          }
        });
      });
      
      setFormFields(allFields);
      setStep(2);
      return true;
    } catch (err) {
      console.error("Error submitting query:", err);
      setError(err instanceof Error ? err.message : "Failed to process your query");
      toast.error("Error", {
        description: err instanceof Error ? err.message : "Failed to process your query"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to submit final data
  const submitFinalData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare API calls with user inputs
      const preparedApiCalls: ApiCall[] = apiCalls.map((endpoint, index) => {
        // Get the requested fields for this endpoint
        const requiredFields = requestedData[index] || [];
        
        // Prepare fields object with user inputs
        const fields: Record<string, string> = {};
        for (const field of requiredFields) {
          if (userInputs[field]) {
            fields[field] = userInputs[field];
          }
        }
        
        return {
          endpoint,
          fields
        };
      });
      
      // Make final API call
      const response = await fetch("http://192.168.55.47:4000/selected-apis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ api_calls: preparedApiCalls }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      // If everything is successful, move to final step
      setStep(3);
      return true;
    } catch (err) {
      console.error("Error submitting final data:", err);
      setError(err instanceof Error ? err.message : "Failed to submit your data");
      toast.error("Error", {
        description: err instanceof Error ? err.message : "Failed to submit your data"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};
