export default function Loading({ message = "Loading...", size = "medium" }) {
  const sizes = {
    small: { width: "20px", height: "20px" },
    medium: { width: "40px", height: "40px" },
    large: { width: "60px", height: "60px" },
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.spinner, ...sizes[size] }}></div>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    gap: "12px",
  },
  spinner: {
    border: "3px solid #f3f4f6",
    borderTop: "3px solid #0066cc",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  message: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },
};

// Add CSS animation
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
