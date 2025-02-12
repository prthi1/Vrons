import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Dashboard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Visitor"); // Default role
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // Fetch all users from Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    } catch (err) {
      setError("Failed to fetch users.");
      console.error(err);
    }
  };

  // Create a new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user details in Firestore
      await addDoc(collection(db, "users"), {
        email: email,
        role: role, // Save the selected role
        createdBy: auth.currentUser.uid, // ID of the admin who created the user
      });

      // Clear form and fetch updated user list
      setEmail("");
      setPassword("");
      setRole("Visitor"); // Reset role to default
      fetchUsers();
    } catch (err) {
      setError("Failed to create user. Please try again.");
      console.error(err);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        Admin Dashboard
      </h1>

      {/* Create User Form */}
      <div
        style={{
          background: "#f9fafb",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          marginBottom: "2rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
          }}
        >
          Create New User
        </h2>
        <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter user's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                marginTop: "0.5rem",
                outline: "none",
              }}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter user's password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                marginTop: "0.5rem",
                outline: "none",
              }}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                marginTop: "0.5rem",
                outline: "none",
              }}
            >
              <option value="Visitor">Visitor</option>
              <option value="Worker">Worker</option>
              <option value="Student">Student</option>
            </select>
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: "0.875rem", textAlign: "center" }}>{error}</p>}
          <button
            type="submit"
            style={{
              width: "100%",
              background: "#3b82f6",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
              border: "none",
              fontWeight: "500",
            }}
          >
            Create User
          </button>
        </form>
      </div>

      {/* List of Users */}
      <div
        style={{
          background: "#f9fafb",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
          }}
        >
          Users List
        </h2>
        {users.length > 0 ? (
          <ul style={{ listStyle: "none", padding: "0" }}>
            {users.map((user) => (
              <li
                key={user.id}
                style={{
                  background: "white",
                  padding: "1rem",
                  borderRadius: "0.375rem",
                  marginBottom: "0.5rem",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <p style={{ fontWeight: "500", color: "#1e293b" }}>Email: {user.email}</p>
                <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Role: {user.role}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: "center", color: "#6b7280" }}>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;