import { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");

  const [uploadedDocId, setUploadedDocId] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const [indexed, setIndexed] = useState(false);
  const [error, setError] = useState("");

  // 📤 Upload document
  const upload = async () => {
    // Validation
    if (!file) {
      setError("Please select a file");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }
    if (!company.trim()) {
      setError("Please enter a company name");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("company_name", company);
    formData.append("document_type", "Financial Statement");

    setUploading(true);
    setError("");

    try {
      const res = await API.post("/document/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const docId = res.data.doc_id;

      setUploadedDocId(docId);
      setUploadSuccess(true);
      setFile(null);
      setTitle("");
      setCompany("");
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || err.message || "Upload failed";
      setError(errorMessage);
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const indexDocument = async () => {
    setIndexing(true);
    setError("");

    try {
      await API.post(`/rag/index/${uploadedDocId}`);
      setIndexed(true);
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || err.message || "Indexing failed";
      setError(errorMessage);
      console.error("Indexing error:", err);
    } finally {
      setIndexing(false);
    }
  };

  const resetForm = () => {
    setUploadSuccess(false);
    setIndexed(false);
    setUploadedDocId(null);
    setFile(null);
    setTitle("");
    setCompany("");
    setError("");
  };

  return (
    <Layout>
      <h1>Upload Document</h1>

      {error && <div style={styles.error}>{error}</div>}

      {!uploadSuccess ? (
        <div style={styles.uploadForm}>
          <div style={styles.formGroup}>
            <label>Select File *</label>
            <input
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setError("");
              }}
              style={styles.fileInput}
              disabled={uploading}
            />
            {file && <p style={styles.fileInfo}>✓ {file.name}</p>}
          </div>

          <div style={styles.formGroup}>
            <label>Title *</label>
            <input
              placeholder="e.g., Q4 2025 Financial Report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              disabled={uploading}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Company Name *</label>
            <input
              placeholder="e.g., ABC Corporation"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={styles.input}
              disabled={uploading}
            />
          </div>

          <button
            onClick={upload}
            disabled={uploading || !file || !title.trim() || !company.trim()}
            style={styles.uploadBtn}
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
        </div>
      ) : (
        <div style={styles.box}>
          <h3>✓ Document uploaded successfully!</h3>
          <p>Document ID: {uploadedDocId}</p>

          {!indexed ? (
            <>
              <p style={styles.indexInfo}>
                Index this document for AI semantic search (optional but
                recommended)
              </p>
              <button
                onClick={indexDocument}
                disabled={indexing}
                style={styles.indexBtn}
              >
                {indexing ? "Indexing..." : "Index for AI Search"}
              </button>
            </>
          ) : (
            <p style={styles.success}>✔ Document indexed successfully!</p>
          )}

          <button onClick={resetForm} style={styles.resetBtn}>
            Upload Another Document
          </button>
        </div>
      )}
    </Layout>
  );
}

const styles = {
  error: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
    border: "1px solid #fecaca",
  },
  uploadForm: {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  formGroup: {
    marginBottom: "20px",
  },
  fileInput: {
    display: "block",
    marginTop: "8px",
    padding: "10px",
    border: "2px solid #e5e7eb",
    borderRadius: "6px",
    width: "100%",
  },
  fileInfo: {
    marginTop: "8px",
    color: "#16a34a",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "8px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    boxSizing: "border-box",
  },
  uploadBtn: {
    background: "#0066cc",
    color: "white",
    padding: "12px 20px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    width: "100%",
  },
  box: {
    marginTop: 20,
    padding: 20,
    background: "#f0fdf4",
    borderRadius: 10,
    border: "1px solid #bbf7d0",
  },
  indexInfo: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "15px",
  },
  indexBtn: {
    background: "#8b5cf6",
    color: "white",
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "10px",
    width: "100%",
  },
  success: {
    color: "#16a34a",
    fontWeight: "600",
    marginTop: "15px",
  },
  resetBtn: {
    background: "#6b7280",
    color: "white",
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
    width: "100%",
  },
};