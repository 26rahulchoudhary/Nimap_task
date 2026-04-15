import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const { hasRole } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.sidebar}>
      <h2>AI Documents</h2>

      <nav style={styles.nav}>
        <Link
          to="/dashboard"
          style={isActive("/dashboard") ? { ...styles.link, ...styles.active } : styles.link}
        >
          Dashboard
        </Link>
        <Link
          to="/documents"
          style={isActive("/documents") ? { ...styles.link, ...styles.active } : styles.link}
        >
          Documents
        </Link>
        <Link
          to="/upload"
          style={isActive("/upload") ? { ...styles.link, ...styles.active } : styles.link}
        >
          Upload
        </Link>
        <Link
          to="/search"
          style={isActive("/search") ? { ...styles.link, ...styles.active } : styles.link}
        >
          Search
        </Link>
        <Link
          to="/rag"
          style={isActive("/rag") ? { ...styles.link, ...styles.active } : styles.link}
        >
          AI Search
        </Link>
        {hasRole("Admin") && (
          <Link
            to="/roles"
            style={isActive("/roles") ? { ...styles.link, ...styles.active } : styles.link}
          >
            👥 Roles
          </Link>
        )}
      </nav>
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
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "20px",
  },
  link: {
    display: "block",
    color: "#cbd5e1",
    padding: "12px 16px",
    textDecoration: "none",
    borderRadius: "8px",
    transition: "all 0.2s",
  },
  active: {
    background: "#1f2937",
    color: "white",
    fontWeight: "600",
  },
};