import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div style={styles.nav}>
      <h3>AI Financial System</h3>
      <div style={styles.userInfo}>
        {user && <span>Welcome, {user.email}</span>}
        <button onClick={handleLogout} style={styles.btn}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    height: "60px",
    background: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    borderBottom: "1px solid #e5e7eb",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  btn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
};