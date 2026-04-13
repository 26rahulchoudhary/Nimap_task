export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={styles.nav}>
      <h3>AI Financial System</h3>
      <button onClick={logout} style={styles.btn}>
        Logout
      </button>
    </div>
  );
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
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

  btn: {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  width: "auto",
  whiteSpace: "nowrap",
},
};