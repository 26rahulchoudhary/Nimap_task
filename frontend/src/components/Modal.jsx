export default function Modal({ isOpen, onClose, title, children, size = "medium" }) {
  if (!isOpen) return null;

  const sizes = {
    small: { maxWidth: "400px", width: "90%" },
    medium: { maxWidth: "600px", width: "90%" },
    large: { maxWidth: "800px", width: "95%" },
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <div style={{ ...styles.modal, ...sizes[size] }}>
        {(title || onClose) && (
          <div style={styles.header}>
            {title && <h2 style={styles.title}>{title}</h2>}
            {onClose && (
              <button onClick={onClose} style={styles.closeBtn}>
                ✕
              </button>
            )}
          </div>
        )}

        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    maxHeight: "90vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #e5e7eb",
  },
  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#6b7280",
    padding: "4px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
  },
  content: {
    padding: "24px",
    overflowY: "auto",
    flex: 1,
  },
};
