import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, SendHorizonal } from "lucide-react";
import "./Login.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 900);
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-icon">
            <Mail size={22} />
          </div>
          <h1>Forgot Password</h1>
          <p className="subtitle">Enter your email to receive a reset link</p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className={error ? "input-error" : ""}
              />
              {error && <span className="error-text">{error}</span>}
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="reset-success-box">
            <p className="reset-success-text">A password reset link has been sent to:</p>
            <strong className="reset-email">{email}</strong>

            <button type="button" className="login-btn success-btn" onClick={() => navigate("/reset-password")}>
              <SendHorizonal size={18} />
              Continue to Reset
            </button>
          </div>
        )}

        <button type="button" className="back-link-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={16} />
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;