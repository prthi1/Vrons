import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import "./logo.jpg"




const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Redirect to home page after login
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  const companyLogo = "./logo.jpg";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #070707, #bb1b28)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <img
            src={companyLogo}
            alt="Company Logo"
            style={{ width: "150px", height: "auto" }}
          />
        </div>
        <h1
          style={{
            fontSize: "1.875rem",
            fontWeight: "bold",
            textAlign: "center",
            color: "#1e293b",
            marginBottom: "1.5rem",
          }}
        >
          Sign In
        </h1>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "91%",
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "91%",
                padding: "0.5rem 1rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                marginTop: "0.5rem",
                outline: "none",
              }}
              required
            />
          </div>
          {error && (
            <p style={{ color: "#ef4444", fontSize: "0.875rem", textAlign: "center" }}>{error}</p>
          )}
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
            SIGN IN
          </button>
        </form>
        <div
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "#3b82f6",
          }}
        >
          <a href="/signup" style={{ textDecoration: "none", color: "inherit" }}>
            Signup
          </a>
          <span style={{ margin: "0 0.5rem", color: "#6b7280" }}>|</span>
          <a href="/forgot-password" style={{ textDecoration: "none", color: "inherit" }}>
            Forgot Password?
          </a>
        </div>
        <div
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "#6b7280",
          }}
        >
          © 2025 Vrons Immigration Services. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;