import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Login.css";

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = new URLSearchParams(window.location.search).get("access_token") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("All fields are required.");
      setMessage("");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setMessage("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setMessage("");
      return;
    }

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      setMessage("");
      return;
    }

    setError("");
    setIsLoading(true);

    const { error } = await supabase.auth.updateUser(
      { password },
      { accessToken: token }
    );

    setIsLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Password reset successful.");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-brand">
          <h1>Reset Password</h1>
          <p className="subtitle">Create a new password for your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>New Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          {error && <span className="error-text">{error}</span>}
          {message && <div className="stockin-success-box">{message}</div>}

          <button type="submit" className="login-btn">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;