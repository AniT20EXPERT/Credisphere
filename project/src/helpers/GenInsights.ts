import axios from "axios";

export const generateInsights = async (risk_score: any, data: any): Promise<string | null> => {
    try {
        let mainPrompt: string = `
        You are an expert in credit risk analysis and loan underwriting.  
You will be provided with a customer's credit profile, including their credit history, financial ratios, and employment details.  

### Task:  
Your job is to analyze the provided data and generate insights, highlighting key risk factors, strengths, and recommendations for loan approval or rejection.  

### Customer's Risk Assessment:  
- **Aggregated Risk Score:** ${risk_score}  

### Customer's Financial & Credit Profile:  
${JSON.stringify(data, null, 2)}  

### Instructions:  
1. **Format Profile as Enhanced Table:** Convert the customer's financial & credit profile into a well-structured markdown table with clear sections:
   - Format credit score information with appropriate ranges and interpretations
   - Group related data points under informative headers (e.g., "Credit History", "Financial Ratios", "Employment Details")
   - Include descriptive labels that explain what each metric means
   - Use proper formatting for percentages, dollar amounts, and dates
   - Add a brief explanation for any technical terms or ratios

2. **Identify Strengths:** Highlight positive indicators that support creditworthiness.  

3. **Assess Risks:** Identify potential red flags that increase the likelihood of default.  

4. **Provide Recommendations:** Offer actionable suggestions, such as loan approval terms, risk mitigation strategies, or required improvements.  

5. **Format:** Present the insights in well-structured **Markdown** with proper headings, bullet points, and explanations.  

6. **Output:** Your report should be **concise** and **clear**, focusing on the key findings and recommendations.

Now, generate a detailed markdown report based on this analysis.
        `;

        console.log('Prompt:', mainPrompt);

        // Uncomment this when integrating with the actual API
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'mistral',
            prompt: mainPrompt,
            stream: false  
        });

        const responseQuery: string = response.data.response.trim();  
        console.log('Insights generated:', responseQuery);

        return responseQuery;

        

    } catch (err) {
        console.error('Error:', err);
        return null;
    }
};
