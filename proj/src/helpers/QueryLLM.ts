import axios from "axios";
export const queryLLM = async (using_context: any) => {
    try {
        const parsedUserData = JSON.parse(using_context);
        let Mainprompt = `
You are an intelligent API selector that strictly returns only the API ID(s) based on the provided context. 
- You first analyze the given context and determine the most relevant APIs to be called. 
- However, to be safe, you also return API IDs that are slightly less relevant to the context. 
- Special Condition: 
  - If the context involves risk analysis, credit risk assessment, or loan granting, return all API IDs.

Context & Matching Logic:
- You have access to a list of APIs, each with a specific "api_context".
- Your job is to select APIs whose "api_context" is relevant to the given "using_context".
- If multiple APIs match, return all applicable "api_id" values in a JSON array.
- Do NOT return any additional information, explanations, or text.
- If no API matches, return an empty JSON array: { "api_ids": [] }.
- If the context involves risk assessment or loan decisions, return all API IDs.

Given Context (Match Relevant APIs):
"${JSON.stringify(parsedUserData)}"

List of APIs:
[
  { "api_id": 1, "api_context": "Used for calculating credit score from Alpha bureau" },
  { "api_id": 2, "api_context": "Used to get employment status from Alpha bureau" },
  { "api_id": 3, "api_context": "Used to retrieve payment history from Alpha bureau" },
  { "api_id": 4, "api_context": "Used to get credit utilization data from Alpha bureau" },
  { "api_id": 5, "api_context": "Used to get debt-to-income (DTI) ratio from Alpha bureau" },
  
  { "api_id": 6, "api_context": "Used for calculating credit score from Beta bureau" },
  { "api_id": 7, "api_context": "Used to get employment status from Beta bureau" },
  { "api_id": 8, "api_context": "Used to retrieve payment history from Beta bureau" },
  { "api_id": 9, "api_context": "Used to get credit utilization data from Beta bureau" },
  { "api_id": 10, "api_context": "Used to get debt-to-income (DTI) ratio from Beta bureau" },

  { "api_id": 11, "api_context": "Used for calculating credit score from Gamma bureau" },
  { "api_id": 12, "api_context": "Used to get employment status from Gamma bureau" },
  { "api_id": 13, "api_context": "Used to retrieve payment history from Gamma bureau" },
  { "api_id": 14, "api_context": "Used to get credit utilization data from Gamma bureau" },
  { "api_id": 15, "api_context": "Used to get debt-to-income (DTI) ratio from Gamma bureau" }
]

Rules:
1. Select only those APIs where "api_context" is relevant to the "using_context".
2. If the context involves risk analysis or loan granting, return ALL API IDs.
3. If no API matches, return: { "api_ids": [] }.

Output Format (Strict JSON Response):
{ "api_ids": [api_id_1, api_id_2, ...] }
        `;

        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'mistral',
            prompt: Mainprompt,
            stream: false
        });

        const response_query = response.data.response.trim();
        console.log('LLM Response:', response_query);

        return response_query;

    } catch (err) {
        console.error('Error:', err);
        return null;
    }
};
