import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
  try {
    const res = await API.get("/document");
    setDocs(res.data);
  } catch (err) {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }
};

  const totalDocs = docs.length;
  const companies = new Set(docs.map(d => d.company_name)).size;

  const typeCount = {};
  docs.forEach(d => {
    typeCount[d.document_type] = (typeCount[d.document_type] || 0) + 1;
  });

  return (
    <Layout>
      <h1>Dashboard</h1>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Total Documents</h3>
          <h2>{totalDocs}</h2>
        </div>

        <div style={styles.card}>
          <h3>Companies</h3>
          <h2>{companies}</h2>
        </div>

        <div style={styles.card}>
          <h3>Document Types</h3>
          <h2>{Object.keys(typeCount).length}</h2>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  grid: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
  },
  card: {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    flex: 1,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
};