import { useState, useEffect } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Roles() {
  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

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
      alert("Role assigned successfully");
      setUserId("");
      setRoleId("");
      loadUsers(); // Refresh user list
    } catch (err) {
      alert(err.response?.data?.detail || "Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  const viewUserDetails = async (user) => {
    setSelectedUser(user);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        API.get(`/users/${user.user_id}/roles`),
        API.get(`/users/${user.user_id}/permissions`),
      ]);
      setUserRoles(rolesRes.data);
      setUserPermissions(permsRes.data);
    } catch (err) {
      console.error("Failed to load user details:", err);
      alert("Failed to load user details");
    }
  };

  return (
    <Layout>
      <h1>Role Management</h1>

      <div style={styles.grid}>
        {/* Assign Role Section */}
        <div style={styles.card}>
          <h2>Assign Role to User</h2>

          <div style={styles.form}>
            <input
              type="number"
              min="1"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={styles.input}
            />

            <input
              type="number"
              min="1"
              placeholder="Role ID"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              style={styles.input}
            />

            <button onClick={assign} disabled={loading} style={styles.button}>
              {loading ? "Assigning..." : "Assign Role"}
            </button>
          </div>
        </div>

        {/* Users List */}
        <div style={styles.card}>
          <h2>Users</h2>
          <div style={styles.userList}>
            {users.map((user) => (
              <div
                key={user.user_id}
                style={styles.userItem}
                onClick={() => viewUserDetails(user)}
              >
                <div>
                  <strong>{user.email}</strong>
                  <br />
                  <small>ID: {user.user_id}</small>
                </div>
                <span style={styles.viewBtn}>View</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>User Details: {selectedUser.email}</h2>

            <div style={styles.detailsGrid}>
              <div style={styles.detailCard}>
                <h3>Roles</h3>
                {userRoles.length > 0 ? (
                  <ul>
                    {userRoles.map((role, index) => (
                      <li key={index}>{role.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No roles assigned</p>
                )}
              </div>

              <div style={styles.detailCard}>
                <h3>Permissions</h3>
                {userPermissions.length > 0 ? (
                  <ul>
                    {userPermissions.map((perm, index) => (
                      <li key={index}>{perm}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No permissions</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              style={styles.closeBtn}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
  },
  button: {
    background: "#0066cc",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  userList: {
    maxHeight: "400px",
    overflowY: "auto",
  },
  userItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    border: "1px solid #eee",
    borderRadius: "6px",
    marginBottom: "8px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  viewBtn: {
    fontSize: "14px",
  },
  modal: {
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
  modalContent: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    margin: "20px 0",
  },
  detailCard: {
    background: "#f9fafb",
    padding: "15px",
    borderRadius: "8px",
  },
  closeBtn: {
    background: "#6b7280",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "20px",
  },
};
