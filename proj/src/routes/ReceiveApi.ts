import { Router, Request, Response, response } from "express"
import { fetchAndCombineResults } from "../helpers/Request";
import cors from "cors"
import axios from "axios";
import { generateInsights } from "../helpers/GenInsights";

const router = Router();
router.post("/selected-apis", async (req: Request, res: Response) => {
    try {
        console.log(req.body, "REQUESTBODY");
        const results: any = await fetchAndCombineResults(req.body);

        // Initialize formattedData with placeholders in the correct order
        const formattedData: any = {
            bureau: ["Alpha", "Beta", "Gamma"],
            credit_score: [0, 0, 0], // Placeholder for fixed positions
            score_range_min: [300, 1, 0], // Default values for each bureau
            score_range_max: [850, 1000, 100], // Default values for each bureau
            payment_history: [0, 0, 0], // Placeholder for fixed positions
            credit_utilization: [0, 0, 0], // Placeholder for fixed positions
            debt_to_income_ratio: [0, 0, 0], // Placeholder for fixed positions
            employment_stat: [0, 0, 0] // Placeholder for fixed positions
        };
        
        // Mapping of bureau names to their fixed positions
        const bureauOrder: { [key: string]: number } = {
            Alpha: 0,
            Beta: 1,
            Gamma: 2
        };
        
        // Process results to dynamically populate the formattedData object
        for (const result of results.results) {
            const { bureau, field, value } = result.datas.data;
        
            // Ensure bureau is valid and map fields dynamically to the correct position
            if (bureau in bureauOrder) {
                const position = bureauOrder[bureau as keyof typeof bureauOrder];
        
                // Dynamically populate fields based on "field"
                if (field === "payment_history") {
                    formattedData.payment_history[position] = value;
                } else if (field === "employment") {
                    formattedData.employment_stat[position] = value;
                } else if (field === "credit") {
                    formattedData.credit_score[position] = value;
                } else if (field === "credit_utilization") {
                    formattedData.credit_utilization[position] = value;
                } else if (field === "debt_to_income_ratio") {
                    formattedData.debt_to_income_ratio[position] = value;
                }
            }
        }
              


        // Call Flask API
        const response = await axios.post('http://127.0.0.1:5000/data_for_ml', {data:formattedData});
        console.log("Response:", response.data);

        const riskScore = response.data.risk_score;
        const responseData = response.data.data;

        // Generate insights
        const insights = await generateInsights(riskScore, responseData);

        // Send only necessary data
        res.json({
            insights,
            riskScore,
            formattedData, // Extract only the necessary part of response
        });

    } catch (error: any) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
});


export { router as ReceiveApiRouter }