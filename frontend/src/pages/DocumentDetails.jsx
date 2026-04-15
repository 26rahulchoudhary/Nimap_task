import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

export default function DocumentDetails() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasRole } = useAuth();

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/document/${id}`);
      setDocument(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load document");
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async () => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await API.delete(`/document/${id}`);
      window.location.href = "/documents";
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed");
    }
  };

  const downloadDocument = async () => {
    try {
      const res = await API.get(`/document/${id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", document.title || "document");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Download failed");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading document...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/documents">← Back to Documents</Link>
        </div>
      </Layout>
    );
  }

  if (!document) {
    return (
      <Layout>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h2>Document not found</h2>
          <Link to="/documents">← Back to Documents</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ marginBottom: "30px" }}>
        <Link to="/documents" style={styles.backLink}>
          ← Back to Documents
        </Link>
        <h1>{document.title}</h1>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Document Information</h3>
          <div style={styles.info}>
            <div style={styles.field}>
              <strong>Title:</strong> {document.title}
            </div>
            <div style={styles.field}>
              <strong>Company:</strong> {document.company_name}
            </div>
            <div style={styles.field}>
              <strong>Type:</strong> {document.document_type}
            </div>
            <div style={styles.field}>
              <strong>Created:</strong>{" "}
              {new Date(document.created_at).toLocaleDateString()}
            </div>
            <div style={styles.field}>
              <strong>Size:</strong> {document.file_size || "N/A"}
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h3>Actions</h3>
          <div style={styles.actions}>
            <button onClick={downloadDocument} style={styles.primaryBtn}>
              Download
            </button>

            {hasRole("Admin") && (
              <button onClick={deleteDocument} style={styles.dangerBtn}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {document.content && (
        <div style={styles.card}>
          <h3>Content Preview</h3>
          <div style={styles.content}>
            {document.content.length > 1000
              ? `${document.content.substring(0, 1000)}...`
              : document.content}
          </div>
        </div>
      )}
    </Layout>
  );
}

const styles = {
  backLink: {
    display: "inline-block",
    marginBottom: "20px",
    color: "#0066cc",
    textDecoration: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  field: {
    padding: "8px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  primaryBtn: {
    background: "#0066cc",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  dangerBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  content: {
    background: "#f9fafb",
    padding: "15px",
    borderRadius: "8px",
    fontFamily: "monospace",
    whiteSpace: "pre-wrap",
    maxHeight: "400px",
    overflowY: "auto",
  },
};
