import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Documents() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await API.get("/document");
    setDocs(res.data);
  };

  const remove = async (id) => {
  if (!window.confirm("Are you sure you want to delete this document?")) return;
  await API.delete(`/document/${id}`);
  load();
};

  return (
    <Layout>
      <h1>Documents</h1>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {docs.map((d) => (
            <tr key={d.document_id}>
              <td>{d.title}</td>
              <td>{d.company_name}</td>
              <td>{d.document_type}</td>
              <td>
                <button onClick={() => remove(d.document_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}