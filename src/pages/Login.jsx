import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return alert(error.message);
      navigate("/");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return alert(error.message);
      alert("Account created!");
      navigate("/");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F8F3E7",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#FFFFFF",
          padding: 40,
          borderRadius: 16,
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          width: 320,
          textAlign: "center",
        }}
      >
        <img src="/campus-logo.png" alt="logo" style={{ width: 60 }} />
        <h2 style={{ color: "#2C2C2C", marginBottom: 20 }}>Campus Xchange</h2>

        <input
          type="email"
          placeholder="Email (use woxsen.edu.in)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={input}
        />

        <button type="submit" style={btn}>
          {mode === "login" ? "Login" : "Sign Up"}
        </button>

        <p
          style={{ marginTop: 10, color: "#2DBE60", cursor: "pointer" }}
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login"
            ? "New here? Create account"
            : "Have an account? Login"}
        </p>
      </form>
    </div>
  );
}

const input = {
  width: "100%",
  padding: "10px 12px",
  margin: "10px 0",
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 14,
};

const btn = {
  backgroundColor: "#2DBE60",
  border: "none",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: 8,
  cursor: "pointer",
  width: "100%",
  marginTop: 10,
  fontWeight: 600,
};
