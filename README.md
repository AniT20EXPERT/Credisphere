
# CrediSphere: Unified Credit Intelligence for Lenders

![Status](https://img.shields.io/badge/Status-Hackathon_Prototype-blue) ![License](https://img.shields.io/badge/License-ISC-green) ![Stack](https://img.shields.io/badge/Stack-React_|_Node_|_Flask_|_XGBoost_|_Ollama-orange)

**CrediSphere** is a multi-bureau credit risk aggregation system designed to revolutionize the lending process. Built for the **Breach 2025 FinTech Hackathon**, it solves the critical issues of inconsistent credit scoring and bureau API downtime by providing a unified, AI-driven risk assessment platform.

[pls refer the credisphere report pdf]

## 🚩 Problem Statement
Financial institutions depend on credit bureau data for borrower risk assessment. However, they face significant inefficiencies:
* **Inconsistent Scoring:** Different bureaus provide conflicting scores (e.g., one says "Good," another says "Risk").
* **Bureau Downtime:** API failures lead to delayed decision-making.
* **Manual Verification:** Processing conflicting data manually takes days, causing customer churn.

## 💡 Solution
CrediSphere is an intelligent aggregation layer that:
1.  **Selects APIs Dynamically:** Uses LLMs to choose the most relevant credit bureaus based on loan context.
2.  **Ensures Continuity:** Manages API downtime with smart fallback protocols.
3.  **Predicts Risk:** Utilizes an XGBoost ML model to predict a unified borrower risk score.
4.  **Generates Insights:** Provides AI-driven financial analysis to explain creditworthiness.
5.  **Empowers Decisions:** Features a RAG-powered chatbot ("Chat with PDF") to analyze financial documents.

---

## 🚀 Key Features

* **Dynamic API Orchestration:** An LLM-based engine selects the optimal bureau APIs for each specific user context.
* **Resilient Data Aggregation:** automatically handles API failures to ensure uninterrupted credit assessment.
* **AI Risk Scoring:** Custom XGBoost model trained to predict risk scores based on aggregated data.
* **Financial Insight Generator:** Context-aware LLM analysis of risk scores to explain *why* a borrower is risky or safe.
* **RAG Chatbot Assistant:** Upload financial statements (PDFs) and chat with them using Retrieval-Augmented Generation (FAISS + Ollama) for deeper analysis.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), TailwindCSS, shadcn/ui
* **Interface Server:** Node.js, Express.js
* **AI/ML Server:** Flask, LangChain, FAISS, PyPDF
* **Models:** XGBoost (Risk Prediction), Ollama/Mistral (LLM & Chatbot), Nomic-Embed-Text (Embeddings)
* **Database:** Supabase (Auth, Reports, Chat History)
* **Mock Services:** Custom Node.js server simulating Alpha, Beta, and Gamma credit bureaus.

---

## 🏗️ System Architecture

**Data Flow:**
1.  **Frontend (React):** User submits loan application & context.
2.  **Interface Server (Node):** Receives context, calls Ollama to decide which APIs to query.
3.  **Mock Bureau APIs:** Simulates response/downtime from bureaus (Alpha, Beta, Gamma).
4.  **AI Server (Flask):**
    * Runs XGBoost model on aggregated data for risk prediction.
    * Generates insights using Mistral.
    * Processes uploaded PDFs for the RAG chatbot.

*(See `docs/architecture.png` in the repo for the visual diagram)*

---

## ⚙️ Installation & Setup

### Prerequisites
* Node.js & npm
* Python 3.8+ & pip
* [Ollama](https://ollama.com/) installed and running locally.
    * Pull required models: `ollama pull mistral` and `ollama pull nomic-embed-text`

### 1. Start Mock Bureau APIs (`test_api`)
This service simulates the credit bureaus.
```bash
cd test_api
npm install
# By default runs on port 4001. Check src/index.ts to configure host.
npm start
````

### 2\. Start AI/ML Server (`flask_server`)

Handles risk prediction and PDF analysis.

```bash
cd flask_server
pip install flask langchain_community faiss-cpu pandas numpy xgboost pypdf
# Update DATA_PATH in app.py to point to your local 'proj/src/routes/uploads' directory
python app.py
# Runs on 0.0.0.0:5000
```

### 3\. Start Interface Server (`proj`)

The main backend orchestrator.

```bash
cd proj
npm install
```

Create a `.env` file in the `proj` directory:

```env
HOST_IP=127.0.0.1
PORT=4000
TEST_URL=[http://127.0.0.1:4001](http://127.0.0.1:4001)
FLASK_URL=[http://127.0.0.1:5000](http://127.0.0.1:5000)
```

Run the server:

```bash
npm run dev
```

### 4\. Start Frontend (`frontend`)

```bash
cd frontend
npm install
# Ensure src/components/reports/ReportAnalysis.tsx points to [http://127.0.0.1:4000](http://127.0.0.1:4000)
npm run dev
```

-----

## 🔮 Future Enhancements

  * Integration with live Credit Bureau APIs (CIBIL, Experian).
  * Expansion of the XGBoost model with larger, real-world datasets.
  * Scalable cloud deployment for high-availability.
