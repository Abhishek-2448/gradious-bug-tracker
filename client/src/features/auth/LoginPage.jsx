import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import Logo from "../../components/Logo.jsx";

// Demo accounts for training only. These match server/src/data/users.js
const DEMO_ACCOUNTS = [
  { label: "Admin", email: "admin@gradious.com", password: "admin123" },
  { label: "Developer", email: "dev1@gradious.com", password: "dev123" },
  { label: "Reporter", email: "reporter@gradious.com", password: "rep123" },
];

function LoginPage() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const doLogin = async (emailValue, passwordValue) => {
    setError(null);
    setLoading(true);
    try {
      await login(emailValue, passwordValue);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    doLogin(email, password);
  };

  return (
    <div className="login-card">
      <div className="login-logo">
        <Logo size={44} />
      </div>
      <h1>Gradious Bug Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="demo-box">
        <p>Quick login (demo accounts):</p>
        {DEMO_ACCOUNTS.map((account) => (
          <button
            key={account.label}
            type="button"
            disabled={loading}
            onClick={() => doLogin(account.email, account.password)}
          >
            {account.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LoginPage;
