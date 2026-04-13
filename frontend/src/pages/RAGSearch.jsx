import { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function RagSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const search = async () => {
    if (!query) return;

    const res = await API.post("/rag/search", { query });
    setResults(res.data);
  };

  return (
    <Layout>
      <h1>AI Semantic Search</h1>

      <input
        placeholder="Ask something..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={search}>Search</button>

      <div style={{ marginTop: 20 }}>
        {results.map((r, i) => (
          <div key={i} style={styles.card}>
            <p>{r.text || r.chunk}</p>
            <small>Score: {r.score}</small>
          </div>
        ))}
      </div>
    </Layout>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
  },
};