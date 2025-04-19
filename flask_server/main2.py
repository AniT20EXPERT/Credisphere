from flask import Flask, request, jsonify
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema.document import Document
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.docstore.in_memory import InMemoryDocstore
import faiss
from langchain_community.llms import Ollama
from langchain.memory import ConversationBufferMemory
import pandas as pd
from xgboost import XGBRegressor
from flask import Flask, request, jsonify
import os
import numpy as np

app = Flask(__name__)
# Initialize memory for chat history
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)



# Global variable to store the RAG chain
rag_chain = None
vector_store = None


def load_documents(data_path):
    """Load PDFs from directory."""
    print("🔄 Loading documents...")
    try:
        if not os.path.exists(data_path):
            raise FileNotFoundError(f"Directory not found: {data_path}")

        document_loader = PyPDFDirectoryLoader(data_path)
        documents = document_loader.load()

        if not documents:
            raise ValueError("No PDF documents found in directory.")

        print(f"✅ Loaded {len(documents)} documents.")
        return documents

    except Exception as e:
        print(f"❌ Error in load_documents: {e}")
        return []



def split_documents(documents: list[Document]):
    """Split documents into smaller chunks for better retrieval."""
    # Debug information
    print(f"📊 Document count: {len(documents)}")
    if documents:
        print(f"📄 First document type: {type(documents[0])}")
        print(
            f"📄 First document content sample: {str(documents[0].page_content)[:100] if hasattr(documents[0], 'page_content') else 'No page_content attribute'}")
    else:
        print("⚠️ No documents to split!")
        return []

    # Make sure documents are valid before splitting
    valid_documents = []
    for doc in documents:
        if hasattr(doc, 'page_content') and doc.page_content and isinstance(doc.page_content, str):
            valid_documents.append(doc)
        else:
            print(f"⚠️ Skipping invalid document: {type(doc)}")

    print(f"📊 Valid document count: {len(valid_documents)}")

    if not valid_documents:
        print("❌ No valid documents to process!")
        return []

    try:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=200,  # Increased overlap for better context
            length_function=len,
            is_separator_regex=False,
        )
        chunks = text_splitter.split_documents(valid_documents)
        print(f"✅ Split into {len(chunks)} chunks.")
        return chunks
    except Exception as e:
        print(f"❌ Error during document splitting: {str(e)}")
        # Return filtered documents as chunks if splitting fails
        return valid_documents

def get_embedding_function():
    """Initialize the embedding model."""
    return OllamaEmbeddings(model="nomic-embed-text:latest")


def add_to_faiss(chunks: list[Document]):
    """Create FAISS index and store document embeddings."""
    print("🔄 Creating FAISS index...")
    embedding_function = get_embedding_function()

    # Initialize FAISS index
    embedding_dim = len(embedding_function.embed_query("test"))  # Get embedding size
    index = faiss.IndexFlatL2(embedding_dim)

    vector_store = FAISS(
        embedding_function=embedding_function,
        index=index,
        docstore=InMemoryDocstore(),
        index_to_docstore_id={},
    )

    vector_store.add_documents(chunks)
    print(f"✅ FAISS index created with {len(chunks)} chunks.")
    return vector_store


def create_rag_chain(vector_store):
    """Create a retrieval-augmented generation (RAG) pipeline."""
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})  # Retrieve top 3 chunks
    llm = Ollama(model="mistral")  # Change model if needed

    def custom_rag_chain(query):
        """Retrieve relevant documents and generate a response."""
        retrieved_docs = retriever.get_relevant_documents(query)

        if not retrieved_docs:
            return "No relevant information found."

        print("\n🔹 Retrieved Contexts:\n")
        retrieved_text = ""
        for i, doc in enumerate(retrieved_docs, 1):
            print(f"Chunk {i}:\n{doc.page_content}\n{'-' * 50}")
            retrieved_text += f"Chunk {i}: {doc.page_content}\n"

        # Retrieve previous conversation history
        past_conversation = memory.load_memory_variables({})["chat_history"]
        past_chat_text = "\n".join(
            [f"User: {msg.content}" if msg.type == "human" else f"Bot: {msg.content}" for msg in past_conversation])

        # Ensure retrieved text is properly structured
        prompt = f"""
        You are a highly intelligent AI assistant. Answer the question based on the retrieved documents.
        ## Previous Conversation:
        {past_chat_text}

        ## Retrieved Context:
        {retrieved_text}

        ## User Question:
        {query}

        ## Answer:
        """

        print("\n🔹 Full Prompt Sent to LLM:\n", prompt)

        response = llm.invoke(prompt).strip()  # Get response from LLM
        # Update memory with the latest query and response
        memory.save_context({"input": query}, {"output": response})
        return response

    return custom_rag_chain

# Store loaded reports and their insights
report_insights = {}  # { reportid: insights }

@app.route("/add_insights", methods=["POST"])
def adding_insights():
    data = request.get_json()
    reportid = data.get("report_id")
    insights = data.get("insights")
    # Store insights for this report_id
    report_insights[reportid] = insights
    return jsonify({"status": "success", "message": f"Insights added for report_id: {reportid}"}), 200

@app.route("/load-documents", methods=["POST"])
def load_docs_endpoint():
    """Endpoint to load documents on demand."""
    global rag_chain, vector_store
    # Extract report_id and insights from the request
    data = request.get_json()
    reportid = data.get("report_id")  # Get report_id
    if not reportid:
        return jsonify({"status": "error", "message": "Missing report_id"}), 400
    # Clear memory if it exists
    global memory
    memory.clear()
    print("✅ Memory context cleared.")
    # DATA_PATH = './data'
    DATA_PATH = r"E:\breach_back\proj\src\routes\uploads"
    try:
        # # Filter only files that contain report_id in the filename
        # all_files = os.listdir(DATA_PATH)
        # matching_files = [f for f in all_files]
        #
        # if not matching_files:
        #     return jsonify({"status": "error", "message": "No matching documents found"}), 404

        # Load and process only matching documents
        # documents = load_documents([os.path.join(DATA_PATH, f) for f in matching_files])
        documents = load_documents(DATA_PATH)
        chunks = split_documents(documents)
        vector_store = add_to_faiss(chunks)
        rag_chain = create_rag_chain(vector_store)
        return jsonify({
            "status": "success",
            "message": f"Documents loaded successfully. Processed {len(documents)} documents into {len(chunks)} chunks."
        })
    except Exception as e:

        return jsonify({"status": "error", "message": str(e)}), 500

aggregated_list = {}

@app.route("/chat", methods=["POST"])
def query():
    """Handle queries via POST requests."""
    global rag_chain, vector_store

    if vector_store is None:
        return jsonify({
            "status": "error",
            "message": "Document index not loaded. Please call /load-documents endpoint first."
        }), 400

    data = request.get_json()
    query_text = data.get("query")
    reportid = data.get("report_id")
    if not query_text:
        return jsonify({"status": "error", "message": "Query text is required"}), 400

    # Retrieve stored insights for this report_id
    insights = report_insights.get(reportid, "No insights available.")


    # Retrieve relevant documents from vector store
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})
    retrieved_docs = retriever.get_relevant_documents(query_text)

    if not retrieved_docs:
        return jsonify({"status": "success", "query": query_text, "response": "No relevant information found."})

    # Format retrieved documents
    print("\n🔹 Retrieved Contexts:\n")
    retrieved_text = ""
    for i, doc in enumerate(retrieved_docs, 1):
        print(f"Chunk {i}:\n{doc.page_content}\n{'-' * 50}")
        retrieved_text += f"Chunk {i}: {doc.page_content}\n"

    # Get conversation history
    past_conversation = memory.load_memory_variables({})["chat_history"]
    past_chat_text = "\n".join(
        [f"User: {msg.content}" if msg.type == "human" else f"Bot: {msg.content}" for msg in past_conversation])

    # Build prompt
    prompt = f"""
    You are a highly intelligent AI assistant. Answer the question based on the retrieved documents.
    ## Previous Conversation:
    {past_chat_text}
    
    ##Insights from the report:
    {insights}
    
    ##aggregated credit score:
    {aggregated_list["aggregated_credit_data"]}
    
    ## Retrieved Context:
    {retrieved_text}

    ## User Question:
    {query_text}
    
    ## Answer:
    """

    print("\n🔹 Full Prompt Sent to LLM:\n", prompt)

    # Get response from LLM
    llm = Ollama(model="mistral")
    response = llm.invoke(prompt).strip()

    # Update memory
    memory.save_context({"input": query_text}, {"output": response})

    return jsonify({"status": "success", "query": query_text, "response": response})

@app.route("/clear-memory", methods=["POST"])
def clear_memory_endpoint():
    """Endpoint to clear conversation memory."""
    global memory
    memory.clear()
    return jsonify({"status": "success", "message": "Conversation memory cleared successfully."})


@app.route("/status", methods=["GET"])
def status():
    """Check if documents are loaded."""
    global rag_chain
    return jsonify({
        "status": "success",
        "documents_loaded": rag_chain is not None,
        "memory_exists": len(memory.load_memory_variables({})["chat_history"]) > 0
    })




def normalized_data(data):
    # print(data)
    # # Check if 'data' exists and is a dictionary
    # if isinstance(data, dict) and 'data' in data:
    #     data = pd.DataFrame(data['data'])  # Convert inner dictionary to DataFrame
    #     print("Successfully extracted nested JSON.")
    # else:
    #     print("Error: 'data' key not found or not a dictionary!")
    #     return
    data = pd.DataFrame(data)
    # Check if 'credit_score' column exists
    if 'credit_score' not in data.columns:
        print("Error: 'credit_score' column still not found!")
        print("Available columns:", data.columns)
        return

    # Debugging Output
    print("Dataset Loaded Successfully!")
    data.to_csv('unprocessed_credit_data.csv', index=False)
    print(data.head())
    # Function to compute median while ignoring zeros
    def median_nonzero(series):
        non_zero_values = series[series != 0]  # Ignore zero values
        return non_zero_values.median() if not non_zero_values.empty else 0

    # Handle missing or zero values for credit_score (Skip 0 values)
    median_credit_score = median_nonzero(data['credit_score'])
    data['credit_score'] = data['credit_score'].replace(0, np.nan).fillna(median_credit_score)

    # Improved normalization method for credit scores
    def normalize_scores(row):
        if pd.isna(row['credit_score']) or row['credit_score'] == 0:
            return np.nan  # Skip normalization for zero/invalid scores

        if row['score_range_max'] == row['score_range_min']:
            percentile = 0.5
        else:
            percentile = (row['credit_score'] - row['score_range_min']) / (
                        row['score_range_max'] - row['score_range_min'])

        if percentile < 0.2:
            return 300 + (percentile / 0.2) * 150
        elif percentile < 0.4:
            return 450 + ((percentile - 0.2) / 0.2) * 100
        elif percentile < 0.7:
            return 550 + ((percentile - 0.4) / 0.3) * 100
        else:
            return 650 + ((percentile - 0.7) / 0.3) * 200

    # Debugging output
    print("Normalization Results:")
    for index, row in data.iterrows():
        bureau = row['bureau']
        score = row['credit_score']
        if pd.isna(score) or score == 0:
            print(f"Bureau {bureau}: Skipping credit score as it is 0 or missing")
            continue  # Skip processing for zero/missing scores
        min_val = row['score_range_min']
        max_val = row['score_range_max']
        normalized = normalize_scores(row)
        percentile = (score - min_val) / (max_val - min_val) if max_val > min_val else 0.5
        print(
            f"Bureau {bureau}: Original {score} ({min_val}-{max_val}, {percentile:.2f} percentile) → Normalized {normalized:.0f}")

    # Apply normalization
    data['normalized_score'] = data.apply(normalize_scores, axis=1)

    # Encode payment history
    payment_mapping = {'Poor': 1, 'Fair': 2, 'Good': 3, 'Very Good': 4, 'Excellent': 5}
    data['payment_history_encoded'] = data['payment_history'].map(payment_mapping)

    # Encode employment status
    employment_mapping = {'Unemployed': 1, 'Part-Time': 2, 'Full-Time': 3, 'Self-Employed': 4}
    data['employment_stat'] = data['employment_stat'].fillna('Unemployed')
    data['employment_stat_encoded'] = data['employment_stat'].map(employment_mapping)

    # Handle missing or zero values for credit utilization
    median_utilization = median_nonzero(data['credit_utilization'])
    data['credit_utilization'] = data['credit_utilization'].replace(0, np.nan).fillna(median_utilization)

    # Interpret risk level
    print("\nCredit Utilization Interpretation:")
    for value in data['credit_utilization']:
        risk_level = "Low risk" if value < 30 else "Medium risk" if value < 50 else "High risk"
        print(f"Utilization {value}%: {risk_level}")

    # Normalize credit utilization
    data['credit_utilization_normalized'] = 1 - (data['credit_utilization'] / 100)
    data.drop('credit_utilization', axis=1, inplace=True)

    # Handle missing or zero values for debt-to-income ratio
    median_dti = median_nonzero(data['debt_to_income_ratio'])
    data['debt_to_income_ratio'] = data['debt_to_income_ratio'].replace(0, np.nan).fillna(median_dti)

    # Rename debt-to-income ratio column
    data = data.rename(columns={'debt_to_income_ratio': 'dti_ratio'})

    print("\nData after normalization and encoding:")
    print(data)

    # Drop redundant columns
    data = data.drop(columns=['score_range_min', 'score_range_max', 'payment_history', 'employment_stat', 'credit_score'])

    # Export to CSV
    data.to_csv('processed_credit_data.csv', index=False)

    print("\nCSV file 'processed_credit_data.csv' saved successfully!")

    # Compute median values excluding 'bureau'
    median_values = data.drop(columns=['bureau']).median()

    print("\nMedian Values After Normalization and Encoding (Excluding Bureau):")
    print(median_values['normalized_score'])
    aggregated_list["aggregated_credit_data"] = median_values['normalized_score']
    median_values.to_csv('median_values.csv', index=False)
    return median_values



# global rag_chain, vector_store


@app.route("/data_for_ml", methods=["POST"])
def query_for_ml():
    """Handle queries via POST requests."""

    data = request.get_json()
    data = data.get("data")

    if not data:
        return jsonify({"status": "error", "message": "Query text is required"}), 400

    test_normalised_data = normalized_data(data)
    # type(test_normalised_data)
    model = XGBRegressor()
    model.load_model("xgboost_risk_model.json")

    # Step 4: Test model on your real data
    real_data = pd.DataFrame([test_normalised_data])
    print(real_data)
    predicted_risk = model.predict(real_data)
    print("\nPredicted Aggregated Risk Score on Real Data:", predicted_risk[0])
    return jsonify({"status": "success", "risk_score": float(predicted_risk[0]), "data": data}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)