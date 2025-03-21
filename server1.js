import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";  // Use promise-based MySQL
import {queryLLM} from "./src/libs/query_llm.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.post("/add_info", async (req, res) => {
    try {
        const user_data = JSON.stringify(req.body);  // Now reassignment is allowed
        const response = await queryLLM(user_data);
        res.json(response);

    } catch (error) {
      console.error("Error inserting data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
