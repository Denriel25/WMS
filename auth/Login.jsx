import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    }

    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);
    setMessage("");

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsLoading(true);

      const response = await fetch("http://127.0.0.1/wms-api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (data.message !== "Login success") {
        setMessage(data.message);
        setIsLoading(false);
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userId", data.user.id);

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/staff/dashboard");
      }
    } catch (error) {
      setMessage("Failed to connect to backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-icon">
            <ShieldCheck size={22} />
          </div>
          <h1>WareSync</h1>
          <p className="subtitle">Login to your warehouse account</p>
        </div>

        <form onSubmit={handleLogin} noValidate>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className={`password-wrapper ${errors.password ? "input-error" : ""}`}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {message && <div className="auth-message">{message}</div>}

          <div className="form-actions">
            <p className="forgot" onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </p>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="auth-links">
          <button
            type="button"
            className="signup-link-btn"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>
        </div>
        
        <p className="footer">All Rights Reserved. WareSync 2026</p>
      </div>
    </div>
  );
}

export default Login;