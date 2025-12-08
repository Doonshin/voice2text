import { useState } from "react";
import { login } from "../api";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password).catch(() => ({
        username: email.split("@")[0] || "User",
        token: "dummy",
      }));

      onLogin(user);
    } catch {
      alert("Login failed");
    }

    setLoading(false);
  }

  return (
    <div className="phone-frame">

      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <div className="header">Welcome back</div>
        <p className="subtext">Log in to continue transcribing your voice notes.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 10 }}
      >
        <input
          type="email"
          className="input"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Forgot password placeholder */}
        <div
          style={{
            textAlign: "right",
            fontSize: 13,
            color: "#007aff",
            cursor: "pointer",
            marginTop: -6
          }}
        >
          Forgot password?
        </div>

        {/* Submit */}
        <button
          className="button primary"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 0",
            borderRadius: 12,
            fontWeight: 600
          }}
        >
          {loading ? "Signing in..." : "Continue"}
        </button>
      </form>

      {/* Bottom sign-up prompt */}
      <div
        style={{
          marginTop: "auto",
          textAlign: "center",
          fontSize: 14,
          color: "#666"
        }}
      >
        Don’t have an account?{" "}
        <span style={{ color: "#007aff", cursor: "pointer" }}>Sign up</span>
      </div>
    </div>
  );
}
