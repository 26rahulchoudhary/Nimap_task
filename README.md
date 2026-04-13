📄 Financial Document Management System with RAG

An AI-powered backend system built using FastAPI that enables organizations to store, manage, and semantically search financial documents using a Retrieval-Augmented Generation (RAG) pipeline.

🚀 Features
🔐 Authentication & Authorization
User Registration & Login (JWT-based)
Role-Based Access Control (RBAC)
Roles:
Admin
Financial Analyst
Auditor
Client
📂 Document Management
Upload financial documents (PDF)
Store metadata:
Title
Company Name
Document Type (Invoice, Report, Contract)
Uploaded By
Created At
Retrieve all documents
Get document by ID
Delete documents
Metadata-based search
🧠 RAG (Retrieval-Augmented Generation)
🔹 Pipeline
Document → Text Extraction → Chunking → Embeddings → Vector DB
🔹 Features
Semantic search using vector similarity
pgvector integration with PostgreSQL
Chunk-based document indexing
Reranking using cross-encoder model
Context retrieval API
Embedding lifecycle management (delete + re-index)
🏗️ Tech Stack
Component	Technology
Backend	FastAPI
Database	PostgreSQL
Vector DB	pgvector
ORM	SQLAlchemy
Authentication	JWT
Embeddings	Sentence Transformers
Reranking	Cross-Encoder (MiniLM)
Text Extraction	PyMuPDF
Chunking	LangChain Text Splitters
📁 Project Structure
project/
│
├── app/
│   ├── main.py
│   ├── config.py
│
│   ├── models/
│   ├── schemas/
│   ├── routes/
│   ├── services/
│   ├── auth/
│   ├── rag/
│   └── utils/
│
├── requirements.txt
└── README.md
🔌 API Endpoints
🔐 Auth
Method	Endpoint
POST	/auth/register
POST	/auth/login
👥 Roles
Method	Endpoint
POST	/roles/create
POST	/users/assign-role
GET	/users/{id}/roles
GET	/users/{id}/permissions
📄 Documents
Method	Endpoint
POST	/documents/upload
GET	/documents
GET	/documents/{id}
DELETE	/documents/{id}
GET	/documents/search
🧠 RAG
Method	Endpoint
POST	/rag/index/{document_id}
DELETE	/rag/remove-document/{document_id}
POST	/rag/search
GET	/rag/context/{document_id}
🔍 Semantic Search Flow
User Query
   ↓
Convert to Embedding
   ↓
Vector Search (Top 20)
   ↓
Reranking (Cross-Encoder)
   ↓
Top 5 Most Relevant Results
⚙️ Setup Instructions
1️⃣ Clone Repository
git clone <your-repo-url>
cd project
2️⃣ Create Virtual Environment
python -m venv venv
venv\Scripts\activate   # Windows
3️⃣ Install Dependencies
pip install -r requirements.txt
4️⃣ Setup PostgreSQL
Create database
Enable pgvector:
CREATE EXTENSION vector;
5️⃣ Environment Variables

Create .env file:

DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your_secret_key
ALGORITHM=HS256
6️⃣ Run Server
uvicorn app.main:app --reload
🧪 Example Request
🔹 Semantic Search
POST /rag/search

{
  "query": "financial risk due to high debt",
  "top_k": 5
}
🧠 Key Design Decisions
Separate document upload and embedding indexing
Use pgvector instead of external vector DB
Implement reranking for better accuracy
Maintain embedding cleanup on delete
Support metadata + semantic search
📊 System Architecture
Client
  ↓
FastAPI
  ↓
PostgreSQL (Metadata + pgvector)
  ↓
RAG Pipeline
  ↓
Semantic Results
🔥 Future Improvements
LLM-based answer generation
Hybrid search (keyword + vector)
Background indexing (Celery)
S3 file storage
Advanced filtering
👨‍💻 Author

Rahul Choudhary

⭐ Final Note

This project demonstrates:

Backend engineering
AI/ML integration (RAG)
Database design
Scalable system architecture
