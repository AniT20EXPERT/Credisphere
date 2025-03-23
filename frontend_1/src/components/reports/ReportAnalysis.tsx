import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { toast } from "@/lib/toast";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Download, FileText, Loader2, ArrowLeft, Upload, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Line, Bar, Radar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Legend } from "chart.js";
import RiskScoreGauge from "../dashboard/RiskScoreGauge";
// Register chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  RadialLinearScale,  // For radar chart
  Title, 
  Tooltip, 
  Legend
);

const ReportAnalysis: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reportId = queryParams.get("id") || "REP-0000";
  const { apiCalls = [], userInputs = {} } = location.state || {};

  const [formattedData, setFormattedData] = useState<any>(null); // Store the response data
  const [insights, setInsights] = useState<string>(""); 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<{text: string, sender: 'user' | 'bot'}[]>([
    {text: "Hello! How can I assist you with this report?", sender: 'bot'}
  ]);
  const [userMessage, setUserMessage] = useState<string>("");
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const [riskScore, setRiskScore] = useState<number | null>(null);

  // Fetch the data from the /selected-apis endpoint
  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const preparedApiCalls = apiCalls.map((endpoint: string) => ({
          endpoint,
          fields: { ...userInputs, reportId },
        }));

        const response = await fetch("http://192.168.1.11:4000/selected-apis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_calls: preparedApiCalls }),
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();
        
        // Extracting data.response and passing it to processFormattedData
        const responseData = data.formattedData;
        // const riskScore = data.riskScore
        const processedData = processFormattedData(responseData);
        
        setFormattedData(processedData);
        setInsights(data.insights || "No insights available.");
        setRiskScore(data.riskScore || null);
      } catch (err) {
        console.error("Error fetching analysis:", err);
        setError(err instanceof Error ? err.message : "Failed to load analysis");
        toast.error("Failed to load analysis");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [reportId, apiCalls, userInputs]);

  // Function to process the response data into chart formats
  const processFormattedData = (data: any) => {
    return {
      creditScoreData: {
        labels: data.bureau,
        datasets: [
          {
            label: "Credit Score",
            data: data.credit_score,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          }
        ]
      },
      creditUtilizationData: {
        labels: data.bureau,
        datasets: [
          {
            label: "Credit Utilization",
            data: data.credit_utilization,
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          }
        ]
      },
      debtToIncomeData: {
        labels: data.bureau,
        datasets: [
          {
            label: "Debt to Income Ratio",
            data: data.debt_to_income_ratio,
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 1,
          }
        ]
      },
      scoreRangeData: {
        labels: data.bureau,
        datasets: [
          {
            label: "Score Range Max",
            data: data.score_range_max,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "Score Range Min",
            data: data.score_range_min,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          }
        ]
      },
      radarData: {
        labels: ['Credit Score', 'Credit Utilization', 'Debt to Income Ratio'],
        datasets: [
          {
            label: 'Score & Utilization',
            data: [
              data.credit_score[0], // Alpha's credit score
              data.credit_utilization[0], // Alpha's credit utilization
              data.debt_to_income_ratio[0] // Alpha's debt to income ratio
            ],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          }
        ]
      }
    };
  };

  // Handle file uploads
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      if (fileArray.length + selectedFiles.length > 10) {
        toast.error("You can only upload up to 10 files.");
        return;
      }
      setSelectedFiles((prevFiles) => [...prevFiles, ...fileArray]);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to upload.");
      return;
    }
  
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
    
    // Add insights and reportId to the form data
    formData.append("insights", insights);
    formData.append("report_id", reportId);
  
    try {
      const response = await fetch("http://192.168.1.11:4000/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }
  
      toast.success("Files uploaded successfully!");
      
      // Call the load-documents endpoint after successful upload
      try {
        const loadResponse = await fetch("http://192.168.1.11:4000/load-documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ report_id: reportId }),
        });
        
        if (!loadResponse.ok) {
          const errorData = await loadResponse.json();
          console.error("Error loading documents:", errorData);
          toast.warning("Files uploaded but there was an issue processing them.");
        } else {
          toast.success("Documents processed successfully!");
        }
      } catch (loadError) {
        console.error("Error calling load-documents:", loadError);
        toast.warning("Files uploaded but there was an issue processing them.");
      }
      
      setSelectedFiles([]);
      setIsChatbotOpen(true); // Show the chatbot once upload is successful
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files.");
    }
  };

  
  // Chat message handling
  const handleSendMessage = async () => {
    if (!userMessage.trim() || isSendingMessage) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, {text: userMessage, sender: 'user'}]);
    
    // Set loading state
    setIsSendingMessage(true);
    
    try {
      // Send message to /chat endpoint with the required structure
      const response = await fetch("http://192.168.1.11:4000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat: userMessage,
          insights: insights,
          report_id: reportId
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
      }
      
      // Parse the response
      const data = await response.json();
      
      // Add the bot's response to the chat
      if (data.chatResponse) {
        console.log(data)
        setChatMessages(prev => [...prev, {
          text: data.chatResponse,
          sender: 'bot'
        }]);
      } else {
        // Fallback if response is missing
        setChatMessages(prev => [...prev, {
          text: "I'm sorry, I couldn't process your request at this time.",
          sender: 'bot'
        }]);
      }
    } catch (err) {
      console.error("Error sending chat message:", err);
      // Add an error message to the chat
      setChatMessages(prev => [...prev, {
        text: "Sorry, there was an error processing your message. Please try again.",
        sender: 'bot'
      }]);
    } finally {
      // Clear the input and reset loading state
      setUserMessage("");
      setIsSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="space-y-3 text-center">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <FileText className="h-10 w-10 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Analysis</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20"> {/* Added padding at bottom for file upload */}
      {/* Charts and insights would go here... */}
      
      <div className="max-w-4xl mx-auto">
      
      <RiskScoreGauge score={riskScore} />

      {/* Credit Score Visualization */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Credit Score Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-full">
            <Bar data={formattedData.creditScoreData} />
          </div>
        </CardContent>
      </Card>

      {/* Credit Utilization Visualization */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Credit Utilization Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-full">
            <Bar data={formattedData.creditUtilizationData} />
          </div>
        </CardContent>
      </Card>

      {/* Debt to Income Ratio Visualization */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Debt to Income Ratio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-full">
            <Bar data={formattedData.debtToIncomeData} />
          </div>
        </CardContent>
      </Card>

      {/* Score Range Comparison */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Score Range Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-full">
            <Line data={formattedData.scoreRangeData} />
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart Visualization */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Radar Chart - Score & Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-full">
            <Radar data={formattedData.radarData} />
          </div>
        </CardContent>
      </Card>

      {/* Markdown Insights */}
      {insights && (
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {insights}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
      
      {/* File upload section - moved to the bottom */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Upload Files</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="p-2 border rounded w-full"
          />
          <div className="mt-4">
            {selectedFiles.length > 0 && (
              <ul className="text-sm space-y-1">
                {selectedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
          <Button onClick={handleUpload} className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700">
            <Upload className="mr-2 h-4 w-4" /> Upload Files
          </Button>
        </CardContent>
      </Card>

      {/* Floating Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => setIsChatbotOpen(!isChatbotOpen)} 
          className="rounded-full h-12 w-12 p-0 bg-indigo-600 hover:bg-indigo-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Floating Chatbot Dialog */}
      {isChatbotOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 rounded-lg shadow-xl bg-gradient-to-br from-indigo-600 to-purple-700 overflow-hidden">
          <div className="flex items-center justify-between p-3 text-white border-b border-indigo-400">
            <h3 className="font-medium">Report Assistant</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-white hover:bg-indigo-500 rounded-full"
              onClick={() => setIsChatbotOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white h-72 overflow-y-auto p-3">
            {chatMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-2 max-w-[80%] p-2 rounded-lg ${
                  msg.sender === 'user' 
                    ? 'ml-auto bg-indigo-100 text-indigo-900' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isSendingMessage && (
              <div className="flex items-center space-x-2 text-gray-400 p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Assistant is typing...</span>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about this report..." 
                className="flex-1 p-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isSendingMessage}
              />
              <Button 
                onClick={handleSendMessage} 
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={isSendingMessage}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportAnalysis;