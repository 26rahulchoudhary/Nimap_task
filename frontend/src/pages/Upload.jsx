import { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");

  const [uploadedDocId, setUploadedDocId] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const [indexed, setIndexed] = useState(false);

  // 📤 Upload document
  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("company_name", company);
    formData.append("document_type", "Financial Statement");

    try {
      const res = await API.post("/document/upload", formData);

      const docId = res.data.doc_id;

      setUploadedDocId(docId);
      setUploadSuccess(true);

      alert("Uploaded successfully!");
    } catch (err) {
      console.log(err.response?.data);
      alert("Upload failed");
    }
  };

  const indexDocument = async () => {
    setIndexing(true);

    try {
      await API.post(`/rag/index/${uploadedDocId}`);
      setIndexed(true);

      alert("Document indexed for AI search!");
    } catch (err) {
      console.log(err.response?.data);
      alert("Indexing failed");
    } finally {
      setIndexing(false);
    }
  };

  return (
    <Layout>
      <h1>Upload Document</h1>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <button onClick={upload}>Upload</button>

      {uploadSuccess && (
        <div style={styles.box}>
          <h3>Document uploaded successfully</h3>

          {!indexed ? (
            <button onClick={indexDocument} disabled={indexing}>
              {indexing ? "Indexing..." : "Index for AI Search"}
            </button>
          ) : (
            <p style={{ color: "green" }}>✔ Indexed successfully</p>
          )}
        </div>
      )}
    </Layout>
  );
}

const styles = {
  box: {
    marginTop: 20,
    padding: 15,
    background: "#f3f4f6",
    borderRadius: 10,
  },
};