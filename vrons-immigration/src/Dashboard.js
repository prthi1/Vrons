import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { getFunctions, httpsCallable } from "firebase/functions";

const Dashboard = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Visitor"); // Default role
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleUserClick(user) {
    navigate(`/clients/${user.id}`, { state: { user } });
  }

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    } catch (err) {
      setMessage("Failed to fetch users.");
      console.error(err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);


      await addDoc(collection(db, "users"), {
        firstName,
        lastName,
        passportNumber,
        email,
        role,
        createdBy: auth.currentUser.uid,

      });

      setFirstName("");
      setLastName("");
      setPassportNumber("");
      setEmail("");
      setPassword("");
      setRole("Visitor");
      setMessage("User created successfully!");
      fetchUsers();
    } catch (err) {
      setMessage("Failed to create user. Please try again.");
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId, authUid) => {
    try {
      const functions = getFunctions();
      const deleteUserFunction = httpsCallable(functions, "deleteUser");
      await deleteUserFunction({ userId, authUid });
      
      setMessage("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      setMessage("Failed to delete user.");
      console.error(err);
    }
  };

  const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.deleteUser = functions.https.onCall(async (data, context) => {
  // Validate admin role (add your own logic)
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError("permission-denied", "Unauthorized");
  }

  try {
    // Delete Firestore document
    await admin.firestore().collection("users").doc(data.userId).delete();

    // Delete Authentication user
    await admin.auth().deleteUser(data.authUid);

    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Deletion failed", error);
  }
});

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
          textAlign: "center",
          color: "#2d3748",
        }}
      >
        Admin Dashboard
      </h1>
      {message && <p style={{ color: "#3182ce", textAlign: "center" }}>{message}</p>}

      {/* Create User Form */}
      <div
        style={{
          background: "#ffffff",
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
            color: "#4a5568",
          }}
        >
          Create New User
        </h2>
        <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "5rem" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontWeight: "500", marginBottom: "0.5rem" }}>First Name</label>
              <input type="text" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ width: "90%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e2e8f0" }} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontWeight: "500", marginBottom: "0.5rem" }}>Last Name</label>
              <input type="text" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e2e8f0" }} required />
            </div>
          </div>
          <div style={{ display: "flex", gap: "5rem" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontWeight: "500", marginBottom: "0.5rem" }}>Passport Number</label>
              <input type="text" placeholder="Enter passport number" value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e2e8f0" }} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontWeight: "500", marginBottom: "0.5rem" }}>Email Address</label>
              <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e2e8f0" }} required />
            </div>
          </div>
          <div style={{ display: "flex", gap: "5rem" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontWeight: "500", marginBottom: "0.5rem" }}>Password</label>
              <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e2e8f0" }} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontWeight: "500", marginBottom: "0.5rem" }}>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e2e8f0" }}>
                <option value="Visitor">Visitor</option>
                <option value="Worker">Worker</option>
                <option value="Student">Student</option>
              </select>
            </div>
          </div>
          {error && <p style={{ color: "#e53e3e", fontSize: "0.875rem", textAlign: "center" }}>{error}</p>}
          <button type="submit" style={{ width: "100%", background: "#4299e1", color: "white", padding: "0.5rem", borderRadius: "0.375rem", cursor: "pointer", border: "none", fontWeight: "500", fontSize: "0.875rem" }}>Create User</button>
        </form>
      </div>

      {/* Users List Table */}
      <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <h2 style={{ color: "#4a5568" }}>Users List</h2>
        {users.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#edf2f7", color: "#4a5568" }}>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>First Name</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Last Name</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Passport Number</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Email</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Role</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  style={{ borderBottom: "1px solid #e2e8f0", color: "#4a5568", cursor: "pointer" }}
                  onClick={() => handleUserClick(user)}
                >
                  <td style={{ padding: "0.75rem" }}>{user.firstName}</td>
                  <td style={{ padding: "0.75rem" }}>{user.lastName}</td>
                  <td style={{ padding: "0.75rem" }}>{user.passportNumber}</td>
                  <td style={{ padding: "0.75rem" }}>{user.email}</td>
                  <td style={{ padding: "0.75rem" }}>{user.role}</td>
                  <td style={{ padding: "0.75rem" }}>
                  <button
    onClick={(e) => {
      e.stopPropagation();
      handleDeleteUser(user.id, user.authUid); // Pass both Firestore ID and Auth UID
    }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#e53e3e",
                      }}
                    >
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center", color: "#718096" }}>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;