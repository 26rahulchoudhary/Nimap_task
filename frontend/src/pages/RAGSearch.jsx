import { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function RagSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const search = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const res = await API.post("/rag/search", { query: query.trim() });
      setResults(res.data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  return (
    <Layout>
      <h1>AI Semantic Search</h1>

      <div style={styles.searchContainer}>
        <input
          placeholder="Ask something about your documents..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          style={styles.input}
          disabled={loading}
        />

        <button onClick={search} disabled={loading || !query.trim()} style={styles.button}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        {loading && <div style={styles.loading}>Searching documents...</div>}

        {hasSearched && !loading && results.length === 0 && (
          <div style={styles.noResults}>
            No relevant documents found. Try a different query or make sure documents are indexed.
          </div>
        )}

        {results.map((r, i) => (
          <div key={i} style={styles.card}>
            <p>{r.content}</p>
            <small>Score: {r.rerank_score ? r.rerank_score.toFixed(3) : r.score}</small>
          </div>
        ))}
      </div>
    </Layout>
  );
}

const styles = {
  searchContainer: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "4px",
    border: "none",
    background: "#0070f3",
    color: "white",
    cursor: "pointer",
  },
  loading: {
    fontStyle: "italic",
    color: "#555",
  },
  noResults: {
    color: "red",
  },
  card: {
    background: "white",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
  },
};