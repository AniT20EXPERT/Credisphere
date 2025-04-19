import axios from 'axios';
type Result = { [key: string]: any };

export async function fetchAndCombineResults(apiCalls: any): Promise<Result> {
    console.log(apiCalls, "apiCalls")
    try {
      // Use Promise.all to make all API calls concurrently
      const results = await Promise.all(
        apiCalls.api_calls.map(async (apiCall: any) => {
          try {
            console.log(apiCall)
            const response = await axios.post(
              apiCall.endpoint, 
              apiCall.fields,
              {
                headers: {
                  "Content-Type": "application/json",
                }
              }
            );
  
            return { endpoint: apiCall.endpoint, datas: response.data };
          } catch (err: any) {
            console.error(`Error fetching from ${apiCall.endpoint}:`, err);
            return { 
              endpoint: apiCall.endpoint, 
              error: err.message,
              status: 'failed',
              connectionError: err.code === 'ECONNREFUSED' ? true : false
            };
          }
        })
      );
  
      // Combine results into a structured JSON object
      console.log(results)
      return { results };
    } catch (error) {
      console.error("Error fetching results:", error);
      throw error;
    }
  }
