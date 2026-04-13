import { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Roles() {
  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [loading, setLoading] = useState(false);

  const assign = async () => {
    const uid = parseInt(userId, 10);
    const rid = parseInt(roleId, 10);

    if (isNaN(uid) || isNaN(rid) || uid <= 0 || rid <= 0) {
      alert("Enter valid numeric IDs");
      return;
    }

    setLoading(true);
    try {
      await API.post("/users/assign-role", {
        user_id: uid,
        role_id: rid,
      });
      alert("Role assigned");
    } catch (err) {
      alert(err.response?.data?.detail || "Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1>Role Management</h1>

      <input
        type="number"
        min="1"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <input
        type="number"
        min="1"
        placeholder="Role ID"
        value={roleId}
        onChange={(e) => setRoleId(e.target.value)}
      />

      <button onClick={assign} disabled={loading}>
        {loading ? "Assigning..." : "Assign Role"}
      </button>
    </Layout>
  );
}