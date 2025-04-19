import { Router, Request, Response } from "express";
import { queryLLM } from "../helpers/QueryLLM";
import axios, { Axios } from "axios";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { report } from "process";

// Define interfaces for better type safety
interface Context {
  [key: string]: any;
}

interface APIResponse {
  api_ids: number[];
}

interface APIMapping {
  [key: number]: string;
}

interface DataMapping {
  [key: number]: string[];
}

interface ResponseData {
  api_calls: string[];
  requested_data: string[][];
  report_id: string;
}

const router = Router();
router.use(cookieParser());
//generator function
function generateReportId(): string {
  const timestamp = Date.now(); // Milliseconds since Unix Epoch
  const uniqueId = Math.random().toString(36).substring(2, 8); // Random string
  return `REP-${timestamp}-${uniqueId}`;
}


// This route is used to set initial context for the report.
// TODO - report creation using database
router.post("/new-report", async (req: Request, res: Response) => {
  try {
    const { context } = req.body as { context: Context };
    
    // Convert context to string for LLM query
    const contextString = JSON.stringify(context);
    const llmResponse = await queryLLM(contextString);

    // Base URL and API configurations
    // change this to use environment variable
    const baseUrl = process.env.TEST_URL;
    
    const apiEndpoints: APIMapping = {
      1: "/api/alpha/credit",
      2: "/api/alpha/employment",
      3: "/api/alpha/payment_history",
      4: "/api/alpha/credit_utilization",
      5: "/api/alpha/dti_ratio",
      6: "/api/beta/credit",
      7: "/api/beta/employment",
      8: "/api/beta/payment_history",
      9: "/api/beta/credit_utilization",
      10: "/api/beta/dti_ratio",
      11: "/api/gamma/credit",
      12: "/api/gamma/employment",
      13: "/api/gamma/payment_history",
      14: "/api/gamma/credit_utilization",
      15: "/api/gamma/dti_ratio",
    };
    
    const requiredDataFields: DataMapping = {
       
      1:  ["phone"],
      2:  ["phone"],
      3:  ["phone"],
      4:  ["phone"],
      5:  ["phone"],
      6:  ["phone"],
      7:  ["phone"],
      8:  ["phone"],
      9:  ["phone"],
      10: ["phone"],
      11: ["phone"],
      12: ["phone"],
      13: ["phone"],
      14: ["phone"],
      15: ["phone"],
    };
    // Parse the LLM response
    const parsedData = JSON.parse(llmResponse) as APIResponse;
    
    // Prepare response data
    const apiCalls: string[] = [];
    const dataRequirements: string[][] = [];
    
    // Process the API IDs returned by the LLM
    parsedData.api_ids.forEach((apiId) => {
      const apiUrl = baseUrl + apiEndpoints[apiId];
      const requiredData = requiredDataFields[apiId];
      
      apiCalls.push(apiUrl);
      dataRequirements.push(requiredData);
    });
    //generate reportid
    const reportId = generateReportId();
    // Send the response
    const responseData: ResponseData = {
      api_calls: apiCalls,
      requested_data: dataRequirements,
      report_id: reportId
    };
     // Store report_id in a cookie (HTTP only for security)
    res.cookie("report_id", reportId, { httpOnly: true, sameSite: "strict" });
    res.json(responseData);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Chat endpoint
const BASE_URL = process.env.FLASK_URL
router.post("/chat", async (req: Request, res: Response) => {
  console.log(req.body)
  try {
      const { chat, report_id } = req.body; 
      if (!chat) {
          return res.status(400).json({ error: "Chat query is required." });
      }

      console.log(`FLASK_URL: ${BASE_URL}`);

      // Setting headers
      const headers = {
          "Content-Type": "application/json"
      };


      // Call `/chat`
      console.log("Sending chat query...");
      const response3 = await axios.post(`${BASE_URL}/chat`, { query: chat , report_id}, { headers });
      console.log("Chat Response:", response3.data);

      // Send back all responses
      res.json({
          message: "Success",
          chatResponse: response3.data.response
      });

  } catch (error: any) {
      console.error("Error:", error.message);
      res.status(500).json({ error: error.message, details: error.response?.data });
  }
});

export { router as LLMRouter };