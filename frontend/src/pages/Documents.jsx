import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { hasRole, user } = useAuth();

  useEffect(() => {
    load();
    // Debug logging
    console.log("User:", user);
    console.log("User roles:", user?.roles);
    console.log("Has Admin role:", hasRole("Admin"));
  }, [user]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await API.get("/document");
      setDocs(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await API.delete(`/document/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading documents...
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
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ marginBottom: "30px" }}>
        <h1>Documents</h1>
        <Link to="/upload" style={styles.uploadBtn}>
          Upload New Document
        </Link>
      </div>

      {docs.length === 0 ? (
        <div style={styles.empty}>
          <h3>No documents found</h3>
          <p>Upload your first document to get started.</p>
          <Link to="/upload" style={styles.uploadLink}>
            Upload Document
          </Link>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Type</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.document_id}>
                <td>
                  <Link to={`/documents/${d.document_id}`} style={styles.titleLink}>
                    {d.title}
                  </Link>
                </td>
                <td>{d.company_name}</td>
                <td>{d.document_type}</td>
                <td>{new Date(d.created_at).toLocaleDateString()}</td>
                <td>
                  <div style={styles.actions}>
                    <Link to={`/documents/${d.document_id}`} style={styles.viewBtn}>
                      View
                    </Link>
                    {hasRole("Admin") && (
                      <button
                        onClick={() => remove(d.document_id)}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

const styles = {
  uploadBtn: {
    display: "inline-block",
    background: "#0066cc",
    color: "white",
    padding: "10px 20px",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "14px",
  },
  empty: {
    textAlign: "center",
    padding: "50px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  uploadLink: {
    display: "inline-block",
    background: "#0066cc",
    color: "white",
    padding: "10px 20px",
    borderRadius: "6px",
    textDecoration: "none",
    marginTop: "10px",
  },
  titleLink: {
    color: "#0066cc",
    textDecoration: "none",
    fontWeight: "500",
  },
  actions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  viewBtn: {
    color: "#0066cc",
    textDecoration: "none",
    fontSize: "14px",
  },
  deleteBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
};
