export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  type = "button",
  ...props
}) {
  const baseStyles = {
    border: "none",
    borderRadius: "6px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: size === "small" ? "12px" : size === "large" ? "16px" : "14px",
    fontWeight: "500",
    transition: "all 0.2s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    ...props.style,
  };

  const variants = {
    primary: {
      background: disabled ? "#9ca3af" : "#0066cc",
      color: "white",
    },
    secondary: {
      background: disabled ? "#f3f4f6" : "#f3f4f6",
      color: disabled ? "#9ca3af" : "#374151",
      border: "1px solid #d1d5db",
    },
    danger: {
      background: disabled ? "#fca5a5" : "#dc2626",
      color: "white",
    },
    success: {
      background: disabled ? "#86efac" : "#16a34a",
      color: "white",
    },
  };

  const sizes = {
    small: { padding: "6px 12px" },
    medium: { padding: "10px 16px" },
    large: { padding: "12px 24px" },
  };

  const styles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
    opacity: disabled ? 0.6 : 1,
  };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      style={styles}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
