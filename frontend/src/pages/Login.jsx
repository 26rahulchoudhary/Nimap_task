// Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      {error && <div style={styles.error}>{error}</div>}

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        style={styles.input}
      />

      <button onClick={handleLogin} disabled={loading} style={styles.button}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    border: "1px solid #ddd",
    borderRadius: "6px",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    color: "#dc2626",
    background: "#fef2f2",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px",
    border: "1px solid #fecaca",
  },
};
