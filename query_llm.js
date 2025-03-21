import axios from "axios";
export const queryLLM = async (User_data) => {
    try {
        const parsedUserData = JSON.parse(User_data);
        let Mainprompt = `
You are an intelligent API selector that strictly returns only the API ID(s) based on the provided user data.

## Context:
- You have access to a list of APIs with specific user data requirements.
- Only return the "api_id" of APIs whose "required_user_data" **ALL** exist as keys in "user_data".
- If multiple APIs match, return all applicable "api_id" values in a JSON array.
- Do NOT return any additional information, explanations, or text.
- If no API can be used, return an empty JSON array: "[]".

## Given User Data (Check Keys Only):
Keys Available = ${JSON.stringify(Object.keys(parsedUserData))}

## List of APIs (Check Required Keys):
[
  { "api_id": 0, "api_context": "used for credit analysis", "required_user_data": ["card_id"] },
  { "api_id": 1, "api_context": "used for calculating credit score", "required_user_data": ["card_id", "card_number"] },
  { "api_id": 2, "api_context": "used for calculating defaulting risk percentage", "required_user_data": ["risk_history", "card_id"] }
]

### 🔹 Rules:
- Compare **only keys** from "user_data" with "required_user_data".
- If **all required keys** exist in "user_data", add the API's "api_id" to the response.
- Do NOT include APIs that have missing required keys.
- If no API qualifies, return: { "api_ids": [] }

### ✅ Output Format (Strict JSON Response):
{ "api_ids": [api_id_1, api_id_2, ...] }
        `;

        console.log('Prompt:', Mainprompt);

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
