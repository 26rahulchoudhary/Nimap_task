import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const { user, hasRole } = useAuth();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await API.get("/document");
      setDocs(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
  };

  const totalDocs = docs.length;
  const companies = new Set(docs.map(d => d.company_name)).size;

  const typeCount = {};
  docs.forEach(d => {
    typeCount[d.document_type] = (typeCount[d.document_type] || 0) + 1;
  });

  const recentUploads = docs.filter(d => {
    const uploadDate = new Date(d.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return uploadDate > weekAgo;
  }).length;

  return (
    <Layout>
      <div style={{ marginBottom: "30px" }}>
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.email}!</p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Total Documents</h3>
          <h2>{totalDocs}</h2>
        </div>

        <div style={styles.card}>
          <h3>Companies</h3>
          <h2>{companies}</h2>
        </div>

        <div style={styles.card}>
          <h3>Document Types</h3>
          <h2>{Object.keys(typeCount).length}</h2>
        </div>

        <div style={styles.card}>
          <h3>Recent Uploads (7 days)</h3>
          <h2>{recentUploads}</h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: "40px" }}>
        <h2>Quick Actions</h2>
        <div style={styles.actions}>
          <Link to="/upload" style={styles.actionCard}>
            <h3>Upload Document</h3>
            <p>Upload new financial documents</p>
          </Link>

          <Link to="/documents" style={styles.actionCard}>
            <h3>View Documents</h3>
            <p>Browse and manage documents</p>
          </Link>

          <Link to="/search" style={styles.actionCard}>
            <h3>Search Documents</h3>
            <p>Search by company or metadata</p>
          </Link>

          <Link to="/rag" style={styles.actionCard}>
            <h3>AI Search</h3>
            <p>Semantic search with AI</p>
          </Link>

          {hasRole("Admin") && (
            <Link to="/roles" style={styles.actionCard}>
              <h3>👥 Manage Roles</h3>
              <p>Assign roles to users</p>
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    textAlign: "center",
  },
  actions: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  actionCard: {
    display: "block",
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    textDecoration: "none",
    color: "inherit",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
};