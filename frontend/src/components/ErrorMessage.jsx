export default function ErrorMessage({ message, onRetry, showRetry = true }) {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>⚠️</div>
      <h3 style={styles.title}>Something went wrong</h3>
      <p style={styles.message}>{message}</p>
      {showRetry && onRetry && (
        <button onClick={onRetry} style={styles.retryBtn}>
          Try Again
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    textAlign: "center",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  icon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  title: {
    margin: "0 0 8px 0",
    color: "#dc2626",
    fontSize: "20px",
    fontWeight: "600",
  },
  message: {
    margin: "0 0 20px 0",
    color: "#6b7280",
    maxWidth: "400px",
    lineHeight: "1.5",
  },
  retryBtn: {
    background: "#0066cc",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
};
