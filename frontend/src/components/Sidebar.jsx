import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2>📊 AI Docs</h2>

      <Link to="/dashboard">Dashboard</Link>
      <Link to="/documents">Documents</Link>
      <Link to="/upload">Upload</Link>
      <Link to="/search">Search</Link>
      <Link to="/rag">RAG Search</Link>
      <Link to="/roles">Roles</Link>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "240px",
    height: "100vh",
    background: "#111827",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};