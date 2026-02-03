import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) return alert(error.message);
    alert("Account created successfully. You can now log in!");
    navigate("/login");
  };

  return (
    <div
      style={{
        backgroundColor: "#141414",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <img
          src="/campus-logo.png"
          alt="Campus Xchange Logo"
          style={{ width: 120, marginBottom: 10 }}
        />
        <h1 style={{ color: "#E50914", letterSpacing: 1 }}>CAMPUS XCHANGE</h1>
      </div>

      <form
        onSubmit={handleSignup}
        style={{
          background: "#000",
          padding: "2.5rem 2rem",
          borderRadius: "6px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 0 20px rgba(0,0,0,0.5)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Create Account</h2>

        <input
          type="email"
          placeholder="your-id@woxsen.edu.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "14px",
            background: "#222",
            border: "none",
            borderRadius: "4px",
            color: "#fff",
          }}
        />

        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            background: "#222",
            border: "none",
            borderRadius: "4px",
            color: "#fff",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#E50914",
            border: "none",
            borderRadius: "4px",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#f6121d")}
          onMouseOut={(e) => (e.target.style.background = "#E50914")}
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p style={{ textAlign: "center", marginTop: 20, color: "#b3b3b3" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#fff", textDecoration: "underline" }}>
            Sign In
          </Link>
        </p>
      </form>

      <footer style={{ marginTop: 50, fontSize: 13, color: "#8c8c8c" }}>
        © {new Date().getFullYear()} CAMPUS XCHANGE — Woxsen University Network
      </footer>
    </div>
  );
}
