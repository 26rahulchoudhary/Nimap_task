import { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Search() {
  const [company, setCompany] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const search = async () => {
    if (!company) return;

    setLoading(true);
    try {
      const res = await API.get(`/document/search/?company=${encodeURIComponent(company)}`);
      setResults(res.data);
      setHasSearched(true);
    } catch (err) {
      alert(err.response?.data?.detail || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1>Search Documents</h1>

      <input
        placeholder="Company name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && search()}
      />

      <button onClick={search} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      <div style={{ marginTop: 20 }}>
        {hasSearched && results.length === 0 && (
          <p style={{ color: "#888" }}>No documents found.</p>
        )}
        {results.map((d) => (
          <div key={d.document_id} style={styles.card}>
            <h3>{d.title}</h3>
            <p>{d.company_name}</p>
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