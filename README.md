# 📄 Financial Document Management System with RAG

An AI-powered backend system built using **FastAPI** that enables organizations to **store, manage, and semantically search financial documents** using a **Retrieval-Augmented Generation (RAG)** pipeline.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* User registration & login
* Role-Based Access Control (RBAC)

**Roles:**

* Admin (Full access)
* Financial Analyst (Upload & edit)
* Auditor (Review)
* Client (View)

---

### 📂 Document Management

* Upload financial documents (PDF)
* Store metadata:

  * Title
  * Company Name
  * Document Type (Invoice, Report, Contract)
  * Uploaded By
  * Created At
* Get all documents
* Get document by ID
* Delete documents
* Search documents by metadata (company, type)

---

### 🧠 RAG (Retrieval-Augmented Generation)

#### 🔹 Pipeline

```
Document → Text Extraction → Chunking → Embeddings → Vector DB
```

#### 🔹 Capabilities

* Semantic search using vector similarity
* pgvector integration with PostgreSQL
* Chunk-based indexing
* Cross-encoder reranking for higher accuracy
* Context retrieval API
* Embedding lifecycle management (delete + re-index)

---

## 🏗️ Tech Stack

* **Backend:** FastAPI
* **Database:** PostgreSQL
* **Vector DB:** pgvector
* **ORM:** SQLAlchemy
* **Authentication:** JWT
* **Embeddings:** Sentence Transformers
* **Reranking:** Cross-Encoder (MiniLM)
* **Text Extraction:** PyMuPDF
* **Chunking:** LangChain Text Splitters

---

## 📁 Project Structure

```
project/
│
├── app/
│   ├── main.py
│   ├── config.py
│   ├── database.py
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
```

---

## 🔌 API Endpoints

### 🔐 Auth

* `POST /auth/register`
* `POST /auth/login`

### 👥 Roles & Permissions

* `POST /roles/create`
* `POST /users/assign-role`
* `GET /users/{id}/roles`
* `GET /users/{id}/permissions`

### 📄 Documents

* `POST /documents/upload`
* `GET /documents`
* `GET /documents/{id}`
* `DELETE /documents/{id}`
* `GET /documents/search?company=...&document_type=...`

### 🧠 RAG

* `POST /rag/index/{document_id}`
* `DELETE /rag/remove-document/{document_id}`
* `POST /rag/search`
* `GET /rag/context/{document_id}`

---

## 🔍 Semantic Search Flow

```
User Query
   ↓
Convert to Embedding
   ↓
Vector Search (Top 20)
   ↓
Reranking (Cross-Encoder)
   ↓
Top 5 Results
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo.git
cd project
```

---

### 2. Create Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate   # Windows
```

---

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Setup PostgreSQL

Create database and enable pgvector:

```sql
CREATE EXTENSION vector;
```

---

### 5. Environment Variables

Create `.env` file:

```
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your_secret_key
ALGORITHM=HS256
```

---

### 6. Run the Server

```bash
uvicorn app.main:app --reload
```

---

## 🧪 Example API Request

### Semantic Search

```json
POST /rag/search

{
  "query": "financial risk due to high debt",
  "top_k": 5
}
```

---

## 🧠 Key Design Decisions

* Separate **upload** and **indexing** for scalability
* Use **pgvector** instead of external vector DB
* Implement **reranking** for improved accuracy
* Maintain **data consistency** by deleting embeddings with documents
* Support both **metadata search** and **semantic search**

---

## 🔥 Future Improvements

* LLM-based answer generation
* Hybrid search (keyword + vector)
* Background indexing (Celery / FastAPI tasks)
* Cloud storage (AWS S3)
* Advanced filters and analytics

---

## 👨‍💻 Author

**Rahul Choudhary**

---

## ⭐ Final Note

This project demonstrates:

* Backend engineering with FastAPI
* AI-powered search (RAG)
* Database + vector search integration
* Scalable architecture design

---
